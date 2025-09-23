import express from "express";
import { CategoryController } from "@/modules/categories/category.controller";
import { validateBody } from "@/middlewares/validate.middleware";
import { CategorySchema } from "@/modules/categories/schema/category.schema";
import { uploadCategoryImage } from "@/middlewares/upload.middleware";
import { requireAuth } from "@/middlewares/auth.middleware";

const categoryRoutes = express.Router();
const categoryController = new CategoryController();

categoryRoutes.post(
    "/",
    uploadCategoryImage.single("image_category"),
    requireAuth(),
    validateBody(CategorySchema),
    categoryController.createCategory
);

categoryRoutes.get("/", categoryController.getAllCategories);

export { categoryRoutes };
