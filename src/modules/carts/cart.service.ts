import { Repository } from "typeorm";
import { Cart } from "./entity/cart.entity";
import { CartItem } from "./entity/cart-item.entity";
import { ProductVariant } from "@/modules/product-variants/entity/product-variant";
import { AppDataSource } from "@/config/database.config";
import { AddItemToCartDto, UpdateCartItemDto, CartResponseDto } from "./dto/cart.dto";
import { CartMapper } from "./dto/cart.mapper";
import { AppError } from "@/common/error.response";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";

export class CartService {
  private cartRepository: Repository<Cart>;
  private cartItemRepository: Repository<CartItem>;
  private productVariantRepository: Repository<ProductVariant>;

  constructor() {
    this.cartRepository = AppDataSource.getRepository(Cart);
    this.cartItemRepository = AppDataSource.getRepository(CartItem);
    this.productVariantRepository = AppDataSource.getRepository(ProductVariant);
  }

  async getUserCart(userId: number): Promise<CartResponseDto> {
    try {
      const cart = await this.cartRepository.findOne({
        where: { user_id: userId },
        relations: [
          "items",
          "items.product_variant",
          "items.product_variant.product",
          "items.product_variant.color",
        ],
      });

      if (!cart) {
        throw new AppError(
          ErrorMessages.CART.CART_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.CART_NOT_FOUND
        );
      }

      return CartMapper.toCartResponseDto(cart);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.CART.FAILED_TO_FETCH_CART,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  async addItemToCart(userId: number, addItemDto: AddItemToCartDto): Promise<CartResponseDto> {
    try {
      const productVariant = await this.productVariantRepository.findOne({
        where: { id: addItemDto.product_variant_id },
        relations: ["product", "color"],
      });

      if (!productVariant) {
        throw new AppError(
          ErrorMessages.PRODUCT.PRODUCT_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.PRODUCT_NOT_FOUND
        );
      }

      let cart = await this.cartRepository.findOne({
        where: { user_id: userId },
      });

      if (!cart) {
        cart = this.cartRepository.create({ user_id: userId });
        cart = await this.cartRepository.save(cart);
      }

      const existingCartItem = await this.cartItemRepository.findOne({
        where: {
          cart: { id: cart.id },
          product_variant: { id: addItemDto.product_variant_id },
        },
        relations: ["cart", "product_variant"],
      });

      if (existingCartItem) {
        existingCartItem.quantity += addItemDto.quantity;
        await this.cartItemRepository.save(existingCartItem);
      } else {
        const newCartItem = this.cartItemRepository.create({
          cart: cart,
          product_variant: productVariant,
          quantity: addItemDto.quantity,
        });
        await this.cartItemRepository.save(newCartItem);
      }

      return this.getUserCart(userId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.CART.ADD_ITEM_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.SERVER_ERROR,
        error
      );
    }
  }

  async updateCartItem(cartItemId: number, updateData: UpdateCartItemDto): Promise<CartResponseDto> {
    try {
      const cartItem = await this.cartItemRepository.findOne({
        where: { id: cartItemId },
        relations: ["cart", "cart.user"],
      });

      if (!cartItem) {
        throw new AppError(
          ErrorMessages.CART.CART_ITEM_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.CART_ITEM_NOT_FOUND
        );
      }

      cartItem.quantity = updateData.quantity;
      await this.cartItemRepository.save(cartItem);

      return this.getUserCart(cartItem.cart.user.id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.CART.UPDATE_ITEM_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.SERVER_ERROR,
        error
      );
    }
  }

  async removeCartItem(cartItemId: number, userId: number): Promise<CartResponseDto> {
    try {
      const cartItem = await this.cartItemRepository.findOne({
        where: { id: cartItemId },
        relations: ["cart"],
      });

      if (!cartItem || cartItem.cart.user_id !== userId) {
        throw new AppError(
          ErrorMessages.CART.CART_ITEM_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.CART_ITEM_NOT_FOUND
        );
      }

      await this.cartItemRepository.remove(cartItem);
      return this.getUserCart(userId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.CART.REMOVE_ITEM_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.SERVER_ERROR,
        error
      );
    }
  }

  async clearCart(userId: number): Promise<void> {
    try {
      const cart = await this.cartRepository.findOne({
        where: { user_id: userId },
      });

      if (!cart) {
        throw new AppError(
          ErrorMessages.CART.CART_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.CART_NOT_FOUND
        );
      }

      await this.cartItemRepository.delete({ cart: { id: cart.id } });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.CART.CLEAR_CART_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.SERVER_ERROR,
        error
      );
    }
  }
}

export default new CartService();
