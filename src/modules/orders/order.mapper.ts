import { Order } from "./entity/order.entity";
import { OrderResponseDto, OrderDetailResponseDto } from "./dto/order.dto";

export class OrderMapper {
  static toOrderResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      user_id: order.user_id,
      total_amount: order.total_amount,
      note: order.note,
      status: order.status,
      cancel_reason: order.cancel_reason,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      order_items: order.order_items?.map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_variant_id,
        quantity: item.quantity,
        price: item.price,
        product: item.product_variant?.product ? {
          id: item.product_variant.product.id,
          name_product: item.product_variant.product.name_product,
          image_product: item.product_variant.product.image_product
        } : undefined
      })) || []
    };
  }

  static toOrderDetailResponseDto(order: Order): OrderDetailResponseDto {
    const baseDto = this.toOrderResponseDto(order);
    return {
      ...baseDto,
      order_items: baseDto.order_items || [],
      user: order.user ? {
        id: order.user.id,
        full_name: order.user.fullname,
        email: order.user.email
      } : null,
      shipping_address: order.shipping_address ? {
        id: order.shipping_address.id,
        address: order.shipping_address.address,
        phone: order.shipping_address.phone_number
      } : null
    };
  }

  static toOrderResponseDtoArray(orders: Order[]): OrderResponseDto[] {
    return orders.map(order => this.toOrderResponseDto(order));
  }
}

