import { Repository } from "typeorm";
import { AppDataSource } from "@/config/database.config";
import { Brand } from "./entity/brand.entity";
import { CreateBrandDto, UpdateBrandDto, BrandResponseDto } from "./dto/brand.dto";
import { AppError } from "@/common/error.response";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { BrandMapper } from "./brand.mapper";

export class BrandService {
  private brandRepository: Repository<Brand>;

  constructor() {
    this.brandRepository = AppDataSource.getRepository(Brand);
  }
  async createBrand(createBrandDto: CreateBrandDto): Promise<BrandResponseDto> {
    try {
      const existingBrand = await this.brandRepository.findOne({
        where: { name_brand: createBrandDto.name_brand }
      });

      if (existingBrand) {
        throw new AppError(
          ErrorMessages.BRAND.BRAND_NAME_ALREADY_EXISTS,
          HttpStatusCode.CONFLICT,
          ErrorCode.BRAND_ALREADY_EXISTS
        );
      }

      const brand = this.brandRepository.create(createBrandDto);
      const savedBrand = await this.brandRepository.save(brand);
      return BrandMapper.toBrandResponseDto(savedBrand);
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

  async getAllBrands(): Promise<BrandResponseDto[]> {
    try {
      const brands = await this.brandRepository.find({
        order: { created_at: 'DESC' }
      });
      return BrandMapper.toBrandResponseDtoList(brands);
    } catch (error) {
      throw new AppError(
        ErrorMessages.BRAND.FAILED_TO_FETCH_BRAND,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBrandById(id: number): Promise<BrandResponseDto> {
    try {
      const brand = await this.brandRepository.findOne({
        where: { id }
      });

      if (!brand) {
        throw new AppError(
          ErrorMessages.BRAND.BRAND_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.BRAND_NOT_FOUND
        );
      }

      return BrandMapper.toBrandResponseDto(brand);
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

  async updateBrand(id: number, updateBrandDto: UpdateBrandDto): Promise<BrandResponseDto> {
    try {
      const brand = await this.brandRepository.findOne({
        where: { id }
      });

      if (!brand) {
        throw new AppError(
          ErrorMessages.BRAND.BRAND_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.BRAND_NOT_FOUND
        );
      }

      if (updateBrandDto.name_brand && updateBrandDto.name_brand !== brand.name_brand) {
        const existingBrand = await this.brandRepository.findOne({
          where: { name_brand: updateBrandDto.name_brand }
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
      const updatedBrand = await this.brandRepository.save(brand);
      return BrandMapper.toBrandResponseDto(updatedBrand);
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
      const brand = await this.brandRepository.findOne({
        where: { id }
      });

      if (!brand) {
        throw new AppError(
          ErrorMessages.BRAND.BRAND_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.BRAND_NOT_FOUND
        );
      }

      await this.brandRepository.remove(brand);
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


export default new BrandService();
