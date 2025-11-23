import { Request, Response, NextFunction } from "express";
import brandService, { BrandService } from "./brand.service";
import { CreateBrandDto, UpdateBrandDto } from "./dto/brand.dto";
import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";
import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";
import { SuccessMessages } from "@/constants/message";

export class BrandController {


 async createBrand(req: Request, res: Response, next: NextFunction)  {
    try {
      const { name_brand, description_brand } = req.body;

      const logoFile = req.file;
      let logo_url: string | undefined;

      if (logoFile) {
        logo_url = logoFile.path;
      }

      const createBrandDto: CreateBrandDto = {
        name_brand,
        description_brand,
        logo_url
      };

      const brand = await brandService.createBrand(createBrandDto);

      return new AppResponse({
        message: SuccessMessages.BRAND.BRAND_CREATED,
        statusCode: HttpStatusCode.CREATED,
        data: brand
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  };

 async getAllBrands(req: Request, res: Response, next: NextFunction){
    try {
      const brands = await brandService.getAllBrands();

      return new AppResponse({
        message: SuccessMessages.BRAND.BRAND_LIST_GET,
        statusCode: HttpStatusCode.OK,
        data: brands
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  };

async getBrandById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const brandId = parseInt(id);

      if (isNaN(brandId)) {
        throw new AppError(
          "Invalid brand ID",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      const brand = await brandService.getBrandById(brandId);

      return new AppResponse({
        message: SuccessMessages.BRAND.BRAND_LIST_BY_ID,
        statusCode: HttpStatusCode.OK,
        data: brand
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  };

  async updateBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const brandId = parseInt(id);

      if (isNaN(brandId)) {
        throw new AppError(
          "Invalid brand ID",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }

      const { name_brand, description_brand } = req.body;
      
      console.log('Update brand request body:', req.body);
      console.log('name_brand:', name_brand);
      console.log('description_brand:', description_brand);

      const logoFile = req.file;
      let logo_url: string | undefined;

      if (logoFile) {
        logo_url = logoFile.path;
      }

      const updateBrandDto: UpdateBrandDto = {
        name_brand,
        description_brand,
        ...(logo_url && { logo_url })
      };
      
      console.log('UpdateBrandDto:', updateBrandDto);

      const brand = await brandService.updateBrand(brandId, updateBrandDto);

      return new AppResponse({
        message: SuccessMessages.BRAND.BRAND_UPDATED,
        statusCode: HttpStatusCode.OK,
        data: brand
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  };

  async deleteBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const brandId = parseInt(id);

      if (isNaN(brandId)) {
        throw new AppError(
          "Invalid brand ID",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PARAMS
        );
      }
      await brandService.deleteBrand(brandId);

      return new AppResponse({
        message: SuccessMessages.BRAND.BRAND_DELETED,
        statusCode: HttpStatusCode.OK,
        data: null
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  };
}


export default new BrandController();