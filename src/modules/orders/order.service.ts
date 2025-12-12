import { Repository } from "typeorm";
import { Order } from "./entity/order.entity";
import { OrderDetail } from "./entity/order-detail.entity";
import { Cart } from "@/modules/carts/entity/cart.entity";
import { Product } from "@/modules/products/entity/product.entity";
import { AppDataSource } from "@/config/database.config";
import { CreateOrderDto, OrderResponseDto } from "./dto/order.dto";
import { AppError } from "@/common/error.response";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { OrderMapper } from "./order.mapper";
import { OrderType, PaymentMethod, PaymentStatus } from "./enum/order.enum";
import { User } from "@/modules/users/entity/user.entity";
import { ShippingAddress } from "@/modules/shipping-address/entity/shipping-address.entity";
import { Voucher } from "@/modules/vouchers/entity/voucher.entity";
import { Transaction } from "@/modules/transactions/entity/transaction.entity";

export class OrderService {
  private orderRepository: Repository<Order>;
  private orderDetailRepository: Repository<OrderDetail>;
  private cartRepository: Repository<Cart>;
  private productRepository: Repository<Product>;
  private userRepository: Repository<User>;
  private shippingAddressRepository: Repository<ShippingAddress>;
  private voucherRepository: Repository<Voucher>;
  private transactionRepository: Repository<Transaction>;

  constructor() {
    this.orderRepository = AppDataSource.getRepository(Order);
    this.orderDetailRepository = AppDataSource.getRepository(OrderDetail);
    this.cartRepository = AppDataSource.getRepository(Cart);
    this.productRepository = AppDataSource.getRepository(Product);
    this.userRepository = AppDataSource.getRepository(User);
    this.shippingAddressRepository = AppDataSource.getRepository(ShippingAddress);
    this.voucherRepository = AppDataSource.getRepository(Voucher);
    this.transactionRepository = AppDataSource.getRepository(Transaction);
  }

  async createOrder(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { user_id, items, shipping_address_id, shipping_address, voucher_id, note, payment_method } = orderData;

      const user = await queryRunner.manager.findOne(User, {
        where: { id: user_id }
      });

      if (!user) {
        throw new AppError(
          ErrorMessages.USER.USER_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.USER_NOT_FOUND
        );
      }

      let shippingAddressId = shipping_address_id;
      
      if (!shippingAddressId && shipping_address) {
        const newShippingAddress = queryRunner.manager.create(ShippingAddress, {
          user_id,
          fullname: shipping_address.fullname,
          phone_number: shipping_address.phone_number,
          address: `${shipping_address.address}${shipping_address.ward ? ', ' + shipping_address.ward : ''}${shipping_address.district ? ', ' + shipping_address.district : ''}${shipping_address.city ? ', ' + shipping_address.city : ''}`,
          is_default: false
        });
        const savedAddress = await queryRunner.manager.save(newShippingAddress);
        shippingAddressId = savedAddress.id;
      }

      if (!shippingAddressId) {
        throw new AppError(
          'Shipping address is required',
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.VALIDATION_ERROR
        );
      }

      const shippingAddressRecord = await queryRunner.manager.findOne(ShippingAddress, {
        where: { id: shippingAddressId }
      });

      if (!shippingAddressRecord) {
        throw new AppError(
          'Shipping address not found',
          HttpStatusCode.NOT_FOUND,
          ErrorCode.VALIDATION_ERROR
        );
      }

      let voucher = null;
      if (voucher_id) {
        voucher = await queryRunner.manager.findOne(Voucher, {
          where: { id: voucher_id }
        });
      }

      const orderItems: OrderDetail[] = [];
      let total_amount = 0;

      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.product_id }
        });

        if (!product) {
          throw new AppError(
            ErrorMessages.PRODUCT.PRODUCT_NOT_FOUND,
            HttpStatusCode.NOT_FOUND,
            ErrorCode.PRODUCT_NOT_FOUND
          );
        }

        const orderItem = queryRunner.manager.create(OrderDetail, {
          product_variant_id: item.product_id,
          quantity: item.quantity,
          price: product.price
        });

        orderItems.push(orderItem);
        total_amount += product.price * item.quantity;
      }

      const discount_amount = 0; 
      const final_amount = total_amount - discount_amount;

      const order = queryRunner.manager.create(Order, {
        user_id,
        shipping_address_id: shippingAddressId,
        total_amount: final_amount,
        note,
        payment_method: payment_method as PaymentMethod,
        payment_status: PaymentStatus.UNPAID,
        status: OrderType.PENDING
      });

      const savedOrder = await queryRunner.manager.save(order);

      for (const item of orderItems) {
        item.order_id = savedOrder.id;
      }

      await queryRunner.manager.save(orderItems);

      await queryRunner.commitTransaction();

      return OrderMapper.toOrderResponseDto(savedOrder);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrderById(id: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['order_items', 'order_items.product_variant', 'order_items.product_variant.product', 'user', 'shipping_address']
    });

    if (!order) {
      throw new AppError(
        ErrorMessages.ORDER.ORDER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.ORDER_NOT_FOUND
      );
    }

    return OrderMapper.toOrderResponseDto(order);
  }

  async getUserOrders(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { user_id: userId },
      relations: ['order_items', 'order_items.product_variant', 'order_items.product_variant.product'],
      order: { created_at: 'DESC' }
    });

    return OrderMapper.toOrderResponseDtoArray(orders);
  }

  async getAllOrders(params: { status?: string; page: number; limit: number }) {
    const { status, page, limit } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.shipping_address', 'shipping_address')
      .leftJoinAndSelect('order.order_items', 'order_items')
      .leftJoinAndSelect('order_items.product_variant', 'product_variant')
      .leftJoinAndSelect('product_variant.product', 'product')
      .skip(skip)
      .take(limit)
      .orderBy('order.created_at', 'DESC');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      data: OrderMapper.toOrderResponseDtoArray(orders),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateOrderStatus(id: number, status: OrderType): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new AppError(
        ErrorMessages.ORDER.ORDER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.ORDER_NOT_FOUND
      );
    }

    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);

    return OrderMapper.toOrderResponseDto(updatedOrder);
  }

  async cancelOrder(id: number, cancel_reason: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new AppError(
        ErrorMessages.ORDER.ORDER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.ORDER_NOT_FOUND
      );
    }

    order.status = OrderType.CANCELLED;
    order.cancel_reason = cancel_reason;
    const updatedOrder = await this.orderRepository.save(order);

    return OrderMapper.toOrderResponseDto(updatedOrder);
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({ 
      where: { id },
      relations: ['order_items']
    });

    if (!order) {
      throw new AppError(
        ErrorMessages.ORDER.ORDER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.ORDER_NOT_FOUND
      );
    }

    const transactions = await this.transactionRepository.find({
      where: { order: { id: id } }
    });
    if (transactions && transactions.length > 0) {
      await this.transactionRepository.remove(transactions);
    }

    if (order.order_items && order.order_items.length > 0) {
      await this.orderDetailRepository.remove(order.order_items);
    }

    await this.orderRepository.remove(order);
  }

  async getOrderDetailById(id: number): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['order_items', 'order_items.product_variant', 'order_items.product_variant.product', 'user', 'shipping_address']
    });

    if (!order) {
      throw new AppError(
        ErrorMessages.ORDER.ORDER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.ORDER_NOT_FOUND
      );
    }

    return OrderMapper.toOrderDetailResponseDto(order);
  }
}

export default new OrderService();
