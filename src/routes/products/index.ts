import express from "express";
import productController from "@/modules/products/product.controller";
import { asyncHandle } from "@/utils/handle-error";
import { validateBody } from "@/middlewares/validate.middleware";
import { requireAdmin, requireAuth, requireAnyRole } from "@/middlewares/auth.middleware";
import { RoleType } from "@/constants/role-type";

const router = express.Router();

// Public routes - Anyone can view products
router.get("/", asyncHandle(productController.getAll));
router.get("/:id", asyncHandle(productController.getById));

// User routes - Authenticated users can view detailed product info
router.get("/:id/variants", requireAuth(), asyncHandle(productController.getVariants));

// Admin routes - Only admins can manage products
router.post("/", 
  requireAdmin(), 
  // validateBody(CreateProductSchema),
  asyncHandle(productController.create)
);

router.put("/:id", 
  requireAdmin(),
  // validateBody(UpdateProductSchema), 
  asyncHandle(productController.update)
);

router.delete("/:id", 
  requireAdmin(), 
  asyncHandle(productController.delete)
);

// Product images
router.post("/:id/images", 
  requireAdmin(),
  asyncHandle(productController.uploadImages)
);

export default router;
