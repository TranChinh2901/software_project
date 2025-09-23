import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/category.dto";
import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";
import { SuccessMessages } from "@/constants/message";

export class CategoryController {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }
    createCategory = async (req: Request, res: Response, next: NextFunction) => {
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

            const category = await this.categoryService.createCategory(createCategoryDto);

            return new AppResponse({
                message: SuccessMessages.CATEGORY.CATEGORY_CREATED,
                statusCode: HttpStatusCode.CREATED,
                data: category
            }).sendResponse(res);
        } catch (error) {
            next(error);
        }
    };

    getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await this.categoryService.getAllCategories();

            return new AppResponse({
                message: SuccessMessages.CATEGORY.CATEGORY_LIST_GET,
                statusCode: HttpStatusCode.OK,
                data: categories
            }).sendResponse(res);
        } catch (error) {
            next(error);
        }
    };
}