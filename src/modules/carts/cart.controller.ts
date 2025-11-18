import { NextFunction, Request, Response } from "express";
import cartService from "./cart.service";
import { AddItemToCartDto, UpdateCartItemDto } from "./dto/cart.dto";
import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";

export class CartController {
  async getUserCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const userId = parseInt(user_id);

      if (isNaN(userId)) {
        throw new AppError(
          "Invalid user ID",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      const cart = await cartService.getUserCart(userId);
      return new AppResponse({
        message: SuccessMessages.CART.CART_GET,
        statusCode: HttpStatusCode.OK,
        data: cart,
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async addItemToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { product_variant_id, quantity } = req.body;

      const userId = parseInt(user_id);
      const variantId = parseInt(product_variant_id);

      if (isNaN(userId) || isNaN(variantId) || !quantity) {
        throw new AppError(
          "Invalid parameters",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      const addItemDto: AddItemToCartDto = {
        product_variant_id: variantId,
        quantity,
      };

      const cart = await cartService.addItemToCart(userId, addItemDto);
      return new AppResponse({
        message: SuccessMessages.CART.ITEM_ADDED,
        statusCode: HttpStatusCode.OK,
        data: cart,
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const cartItemId = parseInt(id);

      if (isNaN(cartItemId) || !quantity) {
        throw new AppError(
          "Invalid parameters",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      const updateData: UpdateCartItemDto = { quantity };
      const cart = await cartService.updateCartItem(cartItemId, updateData);
      return new AppResponse({
        message: SuccessMessages.CART.ITEM_UPDATED,
        statusCode: HttpStatusCode.OK,
        data: cart,
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async removeCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, user_id } = req.params;
      const cartItemId = parseInt(id);
      const userId = parseInt(user_id);

      if (isNaN(cartItemId) || isNaN(userId)) {
        throw new AppError(
          "Invalid parameters",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      const cart = await cartService.removeCartItem(cartItemId, userId);
      return new AppResponse({
        message: SuccessMessages.CART.ITEM_REMOVED,
        statusCode: HttpStatusCode.OK,
        data: cart,
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const userId = parseInt(user_id);

      if (isNaN(userId)) {
        throw new AppError(
          "Invalid user ID",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      await cartService.clearCart(userId);
      return new AppResponse({
        message: SuccessMessages.CART.CART_CLEARED,
        statusCode: HttpStatusCode.OK,
        data: null,
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
