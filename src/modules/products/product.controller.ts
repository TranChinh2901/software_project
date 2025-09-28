import { NextFunction, Request, Response } from "express";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import productService from "./product.service";
import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";

export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const {name_product, price, origin_price, small_description, meta_description, status, stock_quantity, category_id, brand_id} = req.body;
            const imageFile = req.file;
            let image_product: string | undefined;
            if (imageFile) {
                image_product = imageFile.path;
            }
            const createProductDto: CreateProductDto = {
              name_product,
              price,
              origin_price,
              small_description,
              meta_description,
              image_product,
              status,
              stock_quantity,
              category_id: parseInt(category_id),
              brand_id: parseInt(brand_id),
            }
            const product = await productService.createProduct(createProductDto);
            return new AppResponse({
              message: SuccessMessages.PRODUCT.PRODUCT_CREATED,
              statusCode: HttpStatusCode.CREATED,
              data: product
            }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }
  async getAllProducts(req: Request, res: Response, next: NextFunction) { 
    try {
      const products = await productService.getAllProducts();
      return new AppResponse({
        message: SuccessMessages.PRODUCT.PRODUCT_LIST_GET,
        statusCode: HttpStatusCode.OK,
        data: products
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }
  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = req.params;
      const productId = parseInt(id);
      if(isNaN(productId)) {
        throw new AppError(
            "Invalid product ID",
                              HttpStatusCode.BAD_REQUEST,
                              ErrorCode.INVALID_PARAMS
        )
      }
      const product = await productService.getProductById(productId);
      return new AppResponse({
        message: SuccessMessages.PRODUCT.PRODUCT_LIST_BY_ID,
        statusCode: HttpStatusCode.OK,
        data: product
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = req.params;
      const productId = parseInt(id);
      if(isNaN(productId)) {
        throw new AppError(
            "Invalid product ID",
            HttpStatusCode.BAD_REQUEST,
            ErrorCode.INVALID_PARAMS
        )
      }
       const {name_product, price, origin_price, small_description, meta_description, status, stock_quantity, category_id, brand_id} = req.body;
       const imageFile = req.file;
        let image_product: string | undefined;
        if(imageFile) {
          image_product = imageFile.path;
        }
        const updateProduct: UpdateProductDto = {
          name_product,
          price,
          origin_price,
          small_description,
          meta_description,
          image_product,
          status,
          stock_quantity,
          category_id: parseInt(category_id),
          brand_id: parseInt(brand_id),
        }
        const product = await productService.updateProduct(productId, updateProduct);
        return new AppResponse({
          message: SuccessMessages.PRODUCT.PRODUCT_UPDATED,
          statusCode: HttpStatusCode.OK,
          data: product
        }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();