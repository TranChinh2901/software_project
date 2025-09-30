import { NextFunction, Request, Response } from "express";
import { CreateProductGalleryDto } from "./dto/product-gallery.dto";
import productGalleryService from "./product-gallery.service";
import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

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

    return new AppResponse({
      message: SuccessMessages.PRODUCT_GALLERY.PRODUCT_GALLERY_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: productGallery
    }).sendResponse(res);
  } catch (error) {
    next(error);
  }
}
}

export default new ProductGalleryController();