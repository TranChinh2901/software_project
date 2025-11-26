import { NextFunction, Request, Response } from "express";
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from "./dto/product.dto";
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
      
      // Validate category_id
      if (!category_id) {
        throw new AppError(
          "Category ID is required",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }
      
      const parsedCategoryId = parseInt(category_id);
      if (isNaN(parsedCategoryId)) {
        throw new AppError(
          "Invalid category ID",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      // Validate brand_id
      if (!brand_id) {
        throw new AppError(
          "Brand ID is required",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }
      
      const parsedBrandId = parseInt(brand_id);
      if (isNaN(parsedBrandId)) {
        throw new AppError(
          "Invalid brand ID",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      const imageFile = req.file;
      let image_product: string | undefined;
      if (imageFile) {
        image_product = imageFile.path;
      }
      
      const createProductDto: CreateProductDto = {
        name_product,
        price: parseFloat(price),
        origin_price: origin_price ? parseFloat(origin_price) : undefined,
        small_description,
        meta_description,
        image_product,
        status,
        stock_quantity: parseInt(stock_quantity),
        discount: discount ? parseInt(discount) : 0,
        category_id: parsedCategoryId,
        brand_id: parsedBrandId,
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
      const query: QueryProductDto = {
        search: req.query.search as string,
        category_id: req.query.category_id ? parseInt(req.query.category_id as string) : undefined,
        brand_id: req.query.brand_id ? parseInt(req.query.brand_id as string) : undefined,
        min_price: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
        max_price: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
        sort: (req.query.sort as any) || 'newest',
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 12,
        featured: req.query.featured === 'true',
        status: req.query.status as string,
        is_on_sale: req.query.is_on_sale === 'true'
      };
      
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
      
      // Validate and parse category_id if provided
      let parsedCategoryId: number | undefined;
      if (category_id !== undefined && category_id !== null && category_id !== '') {
        parsedCategoryId = parseInt(category_id);
        if (isNaN(parsedCategoryId)) {
          throw new AppError(
            "Invalid category ID",
            HttpStatusCode.BAD_REQUEST,
            ErrorCode.INVALID_PARAMS
          );
        }
      }

      // Validate and parse brand_id if provided
      let parsedBrandId: number | undefined;
      if (brand_id !== undefined && brand_id !== null && brand_id !== '') {
        parsedBrandId = parseInt(brand_id);
        if (isNaN(parsedBrandId)) {
          throw new AppError(
            "Invalid brand ID",
            HttpStatusCode.BAD_REQUEST,
            ErrorCode.INVALID_PARAMS
          );
        }
      }

      const imageFile = req.file;
      let image_product: string | undefined;
      if(imageFile) {
        image_product = imageFile.path;
      }
      
      const updateProductDto: UpdateProductDto = {
        name_product,
        price: price !== undefined ? parseFloat(price) : undefined,
        origin_price: origin_price !== undefined ? parseFloat(origin_price) : undefined,
        small_description,
        meta_description,
        image_product,
        status,
        stock_quantity: stock_quantity !== undefined ? parseInt(stock_quantity) : undefined,
        discount: discount !== undefined ? parseInt(discount) : undefined,
        category_id: parsedCategoryId,
        brand_id: parsedBrandId,
      }
      
      const product = await productService.updateProduct(productId, updateProductDto);
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