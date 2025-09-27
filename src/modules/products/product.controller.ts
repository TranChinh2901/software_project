import { NextFunction, Request, Response } from "express";
import { CreateProductDto } from "./dto/product.dto";
import productService from "./product.service";
import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

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
}

export default new ProductController();