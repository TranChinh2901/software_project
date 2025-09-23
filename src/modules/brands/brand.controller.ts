import { Request, Response, NextFunction } from "express";
import { BrandService } from "./brand.service";
import { CreateBrandDto } from "./dto/brand.dto";
import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";
import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";
import { SuccessMessages } from "@/constants/message";

export class BrandController {
  private brandService: BrandService;

  constructor() {
    this.brandService = new BrandService();
  }


  createBrand = async (req: Request, res: Response, next: NextFunction) => {
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

      const brand = await this.brandService.createBrand(createBrandDto);

      return new AppResponse({
        message: SuccessMessages.BRAND.BRAND_CREATED,
        statusCode: HttpStatusCode.CREATED,
        data: brand
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  };

  getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brands = await this.brandService.getAllBrands();

      return new AppResponse({
        message: SuccessMessages.BRAND.BRAND_LIST_GET,
        statusCode: HttpStatusCode.OK,
        data: brands
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  };

  getBrandById = async (req: Request, res: Response, next: NextFunction) => {
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

      const brand = await this.brandService.getBrandById(brandId);

      return new AppResponse({
        message: SuccessMessages.BRAND.BRAND_LIST_BY_ID,
        statusCode: HttpStatusCode.OK,
        data: brand
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  };

  updateBrand = async (req: Request, res: Response, next: NextFunction) => {
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

      const { name_brand, description_brand, is_deleted } = req.body;

      const logoFile = req.file;
      let logo_url: string | undefined;

      if (logoFile) {
        logo_url = logoFile.path;
      }

      const updateBrandDto = {
        name_brand,
        description_brand,
        is_deleted,
        ...(logo_url && { logo_url })
      };

      const brand = await this.brandService.updateBrand(brandId, updateBrandDto);

      return new AppResponse({
        message: SuccessMessages.BRAND.BRAND_UPDATED,
        statusCode: HttpStatusCode.OK,
        data: brand
      }).sendResponse(res);
    } catch (error) {
      next(error);
    }
  };

  deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
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
      await this.brandService.deleteBrand(brandId);

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