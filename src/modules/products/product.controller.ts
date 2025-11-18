import { NextFunction, Request, Response } from "express";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { QueryProductDto } from "./dto/query-product.dto";
import productService from "./product.service";
import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";

export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const {name_product, price, origin_price, small_description, meta_description, status, stock_quantity, discount, category_id, brand_id} = req.body;
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
              discount,
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
      const query: QueryProductDto = req.query as any;
      const result = await productService.getAllProducts(query);
      return new AppResponse({
        message: SuccessMessages.PRODUCT.PRODUCT_LIST_GET,
        statusCode: HttpStatusCode.OK,
        data: result
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async getFeaturedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getFeaturedProducts();
      return new AppResponse({
        message: 'Lấy danh sách sản phẩm nổi bật thành công',
        statusCode: HttpStatusCode.OK,
        data: products
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async getBestSellers(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getBestSellers();
      return new AppResponse({
        message: 'Lấy danh sách sản phẩm bán chạy nhất thành công',
        statusCode: HttpStatusCode.OK,
        data: products
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async getFlashSaleProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getFlashSaleProducts();
      return new AppResponse({
        message: 'Lấy danh sách sản phẩm flash sale thành công',
        statusCode: HttpStatusCode.OK,
        data: products
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  }

  async getProductsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category_id } = req.params;
      const categoryId = parseInt(category_id);

      if (isNaN(categoryId)) {
        throw new AppError(
          "Invalid category ID",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      const products = await productService.getProductsByCategory(categoryId);
      return new AppResponse({
        message: 'Lấy danh sách sản phẩm theo danh mục thành công',
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

  async getRelatedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const productId = parseInt(id);
      const limit = parseInt(req.query.limit as string) || 4;

      if(isNaN(productId)) {
        throw new AppError(
            "Invalid product ID",
            HttpStatusCode.BAD_REQUEST,
            ErrorCode.INVALID_PARAMS
        )
      }

      const products = await productService.getRelatedProducts(productId, limit);
      return new AppResponse({
        message: 'Lấy danh sách sản phẩm liên quan thành công',
        statusCode: HttpStatusCode.OK,
        data: products
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
       const {name_product, price, origin_price, small_description, meta_description, status, stock_quantity, discount, category_id, brand_id} = req.body;
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
          discount,
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