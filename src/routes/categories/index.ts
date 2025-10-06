
import { requireAuth } from "@/middlewares/auth.middleware";
import { uploadCategoryImage } from "@/middlewares/upload.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { CategoryController } from "@/modules/categories/category.controller";
import { CategorySchema } from "@/modules/categories/schema/category.schema";
import express from "express";
const router = express.Router();
const categoryController = new CategoryController();


    router.post("/",
        requireAuth(),
        uploadCategoryImage.single("image_category"),
        validateBody(CategorySchema),
        categoryController.createCategory
    );

    router.get("/", categoryController.getAllCategories);
    router.get("/:id", categoryController.getCategoryById);
    router.put("/:id", 
        requireAuth(),
        uploadCategoryImage.single("image_category"),
        // validateBody(CategorySchema),
        categoryController.updateCategory
    )
    router.delete("/:id", 
        requireAuth(),
        categoryController.deleteCategory
    )
export { router as categoryRoutes };