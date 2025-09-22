import { Repository } from "typeorm";
import { AppDataSource } from "@/config/database.config";
import { Brand } from "./entity/brand.entity";
import { CreateBrandDto, UpdateBrandDto } from "./dto/brand.dto";
import { AppError } from "@/common/error.response";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";

export class BrandService {
  private brandRepository: Repository<Brand>;

  constructor() {
    this.brandRepository = AppDataSource.getRepository(Brand);
  }

  async createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    try {
      const existingBrand = await this.brandRepository.findOne({
        where: { name_brand: createBrandDto.name_brand, is_deleted: false }
      });

      if (existingBrand) {
        throw new AppError(
          ErrorMessages.BRAND.BRAND_NAME_ALREADY_EXISTS,
          HttpStatusCode.CONFLICT,
          ErrorCode.BRAND_ALREADY_EXISTS
        );
      }
      const brand = this.brandRepository.create(createBrandDto);
    //   console.log("Brand created:", brand);
      const savedBrand = await this.brandRepository.save(brand);
    //   console.log("Brand saved:", savedBrand);
      return savedBrand;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.BRAND.CREATE_BRAND_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllBrands(): Promise<Brand[]> {
    try {
      return await this.brandRepository.find({
        where: { is_deleted: false },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      throw new AppError(
        ErrorMessages.BRAND.FAILED_TO_FETCH_BRAND,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBrandById(id: number): Promise<Brand> {
    try {
      const brand = await this.brandRepository.findOne({
        where: { id, is_deleted: false }
      });

      if (!brand) {
        throw new AppError(
          ErrorMessages.BRAND.BRAND_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.BRAND_NOT_FOUND
        );
      }

      return brand;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.BRAND.FAILED_TO_FETCH_BRAND_BY_ID,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateBrand(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    try {
      const brand = await this.getBrandById(id);
      if (updateBrandDto.name_brand && updateBrandDto.name_brand !== brand.name_brand) {
        const existingBrand = await this.brandRepository.findOne({
          where: { name_brand: updateBrandDto.name_brand, is_deleted: false }
        });

        if (existingBrand) {
          throw new AppError(
            ErrorMessages.BRAND.BRAND_NAME_ALREADY_EXISTS,
            HttpStatusCode.CONFLICT,
            ErrorCode.BRAND_ALREADY_EXISTS
          );
        }
      }

      Object.assign(brand, updateBrandDto);
      return await this.brandRepository.save(brand);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.BRAND.FAILED_UPDATE_BRAND,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteBrand(id: number): Promise<void> {
    try {
      const brand = await this.getBrandById(id);
      brand.is_deleted = true;
      await this.brandRepository.save(brand);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorMessages.BRAND.FAILED_DELETE_BRAND,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}