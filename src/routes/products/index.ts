import express from "express";
import productController from "@/modules/products/product.controller";
import { asyncHandle } from "@/utils/handle-error";
import { requireAdmin, requireAuth, requireAnyRole } from "@/middlewares/auth.middleware";

const router = express.Router();

router.get("/", asyncHandle(productController.getAll));
router.get("/:id", asyncHandle(productController.getById));

router.get("/:id/variants", requireAuth(), asyncHandle(productController.getVariants));

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
