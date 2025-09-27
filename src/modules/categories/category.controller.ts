import { ErrorCode } from '@/constants/error-code';
import { AppError } from '@/common/error.response';
import { Request, Response, NextFunction } from "express";
import categoryService, { CategoryService } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";
import { SuccessMessages } from "@/constants/message";

export class CategoryController {
  
   async createCategory(req: Request, res: Response, next: NextFunction){
        try {
            const { name_category, description_category, brand_id } = req.body;

            const imageFile = req.file;
            let image_category: string | undefined;

            if (imageFile) {
                image_category = imageFile.path;
            }

            const createCategoryDto: CreateCategoryDto = {
                name_category,
                description_category,
                image_category,
                brand_id: parseInt(brand_id)
            };
 
            const category = await categoryService.createCategory(createCategoryDto);

            return new AppResponse({
                message: SuccessMessages.CATEGORY.CATEGORY_CREATED,
                statusCode: HttpStatusCode.CREATED,
                data: category
            }).sendResponse(res);
        } catch (error) {
            next(error);
        }
    };

    async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await categoryService.getAllCategories();

            return new AppResponse({
                message: SuccessMessages.CATEGORY.CATEGORY_LIST_GET,
                statusCode: HttpStatusCode.OK,
                data: categories,
            }).sendResponse(res);
        } catch (error) {
            next(error);
        }
    };

    async getCategoryById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const categoryId = parseInt(id);
            if(isNaN(categoryId)) {
                throw new AppError(
                    "Invalid category ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_PARAMS
                )
            }
            const category = await categoryService.getCategoryById(categoryId);
            return new AppResponse({
                message: SuccessMessages.CATEGORY.CATEGORY_LIST_BY_ID,
                statusCode: HttpStatusCode.OK,
                data: category
            }).sendResponse(res);
        } catch (error) {
            next(error);
        }
    }
    async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const categoryId = parseInt(id);
            if(isNaN(categoryId)) {
                throw new AppError(
                    "Invalid category ID",
                    HttpStatusCode.BAD_REQUEST,
                    ErrorCode.INVALID_PARAMS
                )
            }
            const {name_category, description_category, brand_id} = req.body;
            const imageFile = req.file;
            let image_category: string | undefined;
            if(imageFile) {
                image_category = imageFile.path;
            }
            const updateCategory: UpdateCategoryDto = {
                name_category,
                description_category,
                image_category,
                brand_id: brand_id ? parseInt(brand_id) : undefined
            }
            const category = await categoryService.updateCategory(categoryId, updateCategory);
            return new AppResponse({
                message: SuccessMessages.CATEGORY.CATEGORY_UPDATED,
                statusCode: HttpStatusCode.OK,
                data: category
            }).sendResponse(res);

        } catch (error) {
            next(error);
        }
    }
}


export default new CategoryController();