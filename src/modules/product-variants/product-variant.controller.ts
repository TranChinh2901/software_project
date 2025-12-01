import { NextFunction, Request, Response } from "express";
import { CreateProductVariantDto, UpdateProductVariantDto } from "./dto/product-variant.dto";
import productVariantService from "./product-variant.service";
import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";

export class ProductVariantController {
  async createVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: CreateProductVariantDto = {
        product_id: parseInt(req.body.product_id),
        color_id: req.body.color_id ? parseInt(req.body.color_id) : undefined,
        size: req.body.size,
        price: parseFloat(req.body.price),
        quantity: parseInt(req.body.quantity)
      };

      const variant = await productVariantService.createVariant(dto);

      return new AppResponse({
        message: "Product variant created successfully",
        statusCode: HttpStatusCode.CREATED,
        data: variant
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async getAllVariants(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id } = req.query;

      let variants;
      if (product_id) {
        variants = await productVariantService.getVariantsByProduct(parseInt(product_id as string));
      } else {
        variants = await productVariantService.getAllVariants();
      }

      return new AppResponse({
        message: "Product variants retrieved successfully",
        statusCode: HttpStatusCode.OK,
        data: variants
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async getVariantById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const variantId = parseInt(id);

      if (isNaN(variantId)) {
        throw new AppError(
          "Invalid variant ID",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      const variant = await productVariantService.getVariantById(variantId);

      return new AppResponse({
        message: "Product variant retrieved successfully",
        statusCode: HttpStatusCode.OK,
        data: variant
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async updateVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const variantId = parseInt(id);

      if (isNaN(variantId)) {
        throw new AppError(
          "Invalid variant ID",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      const dto: UpdateProductVariantDto = {
        color_id: req.body.color_id ? parseInt(req.body.color_id) : undefined,
        size: req.body.size,
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        quantity: req.body.quantity !== undefined ? parseInt(req.body.quantity) : undefined
      };

      const variant = await productVariantService.updateVariant(variantId, dto);

      return new AppResponse({
        message: "Product variant updated successfully",
        statusCode: HttpStatusCode.OK,
        data: variant
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async deleteVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const variantId = parseInt(id);

      if (isNaN(variantId)) {
        throw new AppError(
          "Invalid variant ID",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      await productVariantService.deleteVariant(variantId);

      return new AppResponse({
        message: "Product variant deleted successfully",
        statusCode: HttpStatusCode.OK
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductVariantController();
