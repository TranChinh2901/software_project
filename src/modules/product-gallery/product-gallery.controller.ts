import { NextFunction, Request, Response } from "express";
import { CreateProductGalleryDto, ProductGalleryGroupedResponseDto } from "./dto/product-gallery.dto";
import productGalleryService from "./product-gallery.service";
import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";

export class ProductGalleryController {
   async createProductGallery(req: Request, res: Response, next: NextFunction) {
  try {
    const { product_id } = req.body;
    const files = req.files as Express.Multer.File[];

    const imageUrls = files.map(file => file.path);

    const createProductGalleryDto: CreateProductGalleryDto = {
      image_url: imageUrls,
      product_id: parseInt(product_id)
    };

    const productGallery = await productGalleryService.addNewImagesToProduct(createProductGalleryDto);

    const grouped: ProductGalleryGroupedResponseDto = {
      id: productGallery[0].id,
      product_id: productGallery[0].product_id,
      product: productGallery[0].product,
      image_url: productGallery.map(p => p.image_url)
    };

    return new AppResponse({
      message: SuccessMessages.PRODUCT_GALLERY.PRODUCT_GALLERY_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: grouped
    }).sendResponse(res);
  } catch (error) {
    next(error);
  }
}
async getAllProductGallery(req: Request, res: Response, next: NextFunction) {
    try {
        const gallegies = await productGalleryService.getAllProductGalleries();
        return new AppResponse({
            message: SuccessMessages.PRODUCT_GALLERY.PRODUCT_GALLERY_LIST_GET,
            statusCode: HttpStatusCode.OK,
            data: gallegies
        }).sendResponse(res);
    } catch (error) {
        next(error);
    }
}
async deleteProductGallery(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const galleryId = parseInt(id);
        if (isNaN(galleryId)) {
             throw new AppError(
                      "Invalid gallery ID",
                      HttpStatusCode.BAD_REQUEST,
                      ErrorCode.INVALID_PARAMS
                    );
        }
        await productGalleryService.deleteProductGallery(galleryId);
        return new AppResponse({
            message: SuccessMessages.PRODUCT_GALLERY.PRODUCT_GALLERY_DELETED,
            statusCode: HttpStatusCode.OK
        }).sendResponse(res);
    } catch (error) {
        next(error);
    }
}}

export default new ProductGalleryController();