import { Repository } from "typeorm";
import { Category } from "./entity/category.entity";
import { AppDataSource } from "@/config/database.config";
import { Brand } from "../brands/entity/brand.entity";
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { AppError } from "@/common/error.response";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { CategoryMapper } from "./category.mapper";

export class CategoryService {
    private categoryRespository: Repository<Category>;
    private brandResponsitory: Repository<Brand>;

    constructor() {
        this.categoryRespository = AppDataSource.getRepository(Category);
        this.brandResponsitory = AppDataSource.getRepository(Brand);
    }

    async createCategory(categoryData: CreateCategoryDto): Promise<CategoryResponseDto> {
        try {
            const checkBrand = await this.brandResponsitory.findOne({
                where: {
                    id: categoryData.brand_id,
                },
            });
            if (!checkBrand) {
                throw new AppError(
                    ErrorMessages.BRAND.BRAND_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.BRAND_NOT_FOUND
                )
            };
            const newCategory = this.categoryRespository.create({
                ...categoryData,
                brand: checkBrand,
            });
            const savedCategory = await this.categoryRespository.save(newCategory);
            const categoryWithBrand = await this.categoryRespository.findOne({
                where: {
                    id: savedCategory.id,
                }, 
                relations: ["brand"],
            });
            return CategoryMapper.toCategoryResponseDto(categoryWithBrand!);
        } catch (error) {
            throw new AppError(
                ErrorMessages.CATEGORY.CREATE_CATEGORY_FAILED,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.SERVER_ERROR,
                error
            )
        }
    }

    async getAllCategories(): Promise<CategoryResponseDto[]> {
        try {
            const categories = await this.categoryRespository.find({
                relations: ["brand"]
            });
            return CategoryMapper.toCategoryResponseDtoList(categories);
        } catch (error) {
            throw new AppError(
                ErrorMessages.CATEGORY.FAILED_TO_FETCH_CATEGORY,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            )
        }
    }
    async getCategoryById(id: number): Promise<CategoryResponseDto> {
        try {
            const category = await this.categoryRespository.findOne({
                where: { id },
                relations: ["brand"]
            });
            if (!category) {
                throw new AppError(
                    ErrorMessages.CATEGORY.CATEGORY_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.CATEGORY_NOT_FOUND
                )
            }
            return CategoryMapper.toCategoryResponseDto(category);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorMessages.CATEGORY.FAILED_TO_FETCH_CATEGORY_BY_ID,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR
            )
        }
    }

    async updateCategory(id: number, updateData: UpdateCategoryDto): Promise<CategoryResponseDto> {
        try {
            const category = await this.categoryRespository.findOne({
                where: { id },
                relations: ["brand"]
            });

            if (!category) {
                throw new AppError(
                    ErrorMessages.CATEGORY.CATEGORY_NOT_FOUND,
                    HttpStatusCode.NOT_FOUND,
                    ErrorCode.CATEGORY_NOT_FOUND
                );
            }
            if (updateData.brand_id) {
                const newBrand = await this.brandResponsitory.findOne({
                    where: { id: updateData.brand_id }
                });

                if (!newBrand) {
                    throw new AppError(
                        ErrorMessages.BRAND.BRAND_NOT_FOUND,
                        HttpStatusCode.NOT_FOUND,
                        ErrorCode.BRAND_NOT_FOUND
                    );
                }
                category.brand = newBrand;
            }

            const { brand_id, ...updateFields } = updateData;
            Object.assign(category, updateFields);
            
            const updatedCategory = await this.categoryRespository.save(category);

            const categoryWithBrand = await this.categoryRespository.findOne({
                where: { id: updatedCategory.id },
                relations: ["brand"]
            });

            return CategoryMapper.toCategoryResponseDto(categoryWithBrand!);

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                ErrorMessages.CATEGORY.FAILED_UPDATE_CATEGORY,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                ErrorCode.SERVER_ERROR,
                error
            );
        }
    }
}


export default new CategoryService();