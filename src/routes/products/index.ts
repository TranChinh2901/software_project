import { requireAuth } from "@/middlewares/auth.middleware";
import { uploadProductImage } from "@/middlewares/upload.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import productController from "@/modules/products/product.controller";
import { CreateProductSchema } from "@/modules/products/schema/product.schema";
import express from "express";
const router = express.Router();

router.post("/", 
  requireAuth(),
  uploadProductImage.single("image_product"), 
  validateBody(CreateProductSchema),
  productController.createProduct
)
router.get("/", productController.getAllProducts);

export default router;
