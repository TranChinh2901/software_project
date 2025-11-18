import { CartResponseDto, CartItemResponseDto } from "./cart.dto";
import { Cart } from "../entity/cart.entity";
import { CartItem } from "../entity/cart-item.entity";

export class CartMapper {
  static toCartResponseDto(cart: Cart): CartResponseDto {
    return {
      id: cart.id,
      user_id: cart.user_id,
      created_at: cart.created_at,
      items: cart.items ? cart.items.map((item) => CartMapper.toCartItemResponseDto(item)) : [],
    };
  }

  static toCartItemResponseDto(cartItem: CartItem): CartItemResponseDto {
    return {
      id: cartItem.id,
      quantity: cartItem.quantity,
      product_variant: {
        id: cartItem.product_variant.id,
        size: cartItem.product_variant.size || '',
        price: cartItem.product_variant.price,
        quantity: cartItem.product_variant.quantity,
        product: {
          id: cartItem.product_variant.product.id,
          name_product: cartItem.product_variant.product.name_product,
          image_product: cartItem.product_variant.product.image_product,
        },
        color: cartItem.product_variant.color ? {
          id: cartItem.product_variant.color.id,
          name_color: cartItem.product_variant.color.name_color,
        } : undefined,
      },
    };
  }

  static toCartResponseDtoList(carts: Cart[]): CartResponseDto[] {
    return carts.map((cart) => CartMapper.toCartResponseDto(cart));
  }
}
