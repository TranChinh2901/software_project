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

export class OrderService {
  private orderRepository: Repository<Order>;
  private orderDetailRepository: Repository<OrderDetail>;
  private cartRepository: Repository<Cart>;
  private productRepository: Repository<Product>;
  private userRepository: Repository<User>;
  private shippingAddressRepository: Repository<ShippingAddress>;
  private voucherRepository: Repository<Voucher>;

  constructor() {
    this.orderRepository = AppDataSource.getRepository(Order);
    this.orderDetailRepository = AppDataSource.getRepository(OrderDetail);
    this.cartRepository = AppDataSource.getRepository(Cart);
    this.productRepository = AppDataSource.getRepository(Product);
    this.userRepository = AppDataSource.getRepository(User);
    this.shippingAddressRepository = AppDataSource.getRepository(ShippingAddress);
    this.voucherRepository = AppDataSource.getRepository(Voucher);
  }

  async createOrder(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { user_id, items, shipping_address_id, voucher_id, note, payment_method } = orderData;

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

      const shippingAddress = await queryRunner.manager.findOne(ShippingAddress, {
        where: { id: shipping_address_id }
      });

      if (!shippingAddress) {
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
        shipping_address_id,
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
      relations: ['order_items', 'user', 'shipping_address']
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
      relations: ['order_items', 'order_items.product'],
      order: { created_at: 'DESC' }
    });

    return OrderMapper.toOrderResponseDtoArray(orders);
  }

  async getAllOrders(params: { status?: string; page: number; limit: number }) {
    const { status, page, limit } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.order_items', 'order_items')
      .leftJoinAndSelect('order_items.product', 'product')
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
}

export default new OrderService();
