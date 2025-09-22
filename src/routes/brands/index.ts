import { Router } from "express";
import { BrandController } from "@/modules/brands/brand.controller";
import { uploadBrandLogo } from "@/middlewares/upload.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { CreateBrandSchema } from "@/modules/brands/schema/brand.shema";
import { requireAuth } from "@/middlewares/auth.middleware";

const router = Router();
const brandController = new BrandController();

router.post(
  "/",
  requireAuth(),
  uploadBrandLogo.single("logo"), 
  validateBody(CreateBrandSchema),
  brandController.createBrand
);
router.get("/", brandController.getAllBrands);

router.get("/:id", brandController.getBrandById);

router.put(
  "/:id",
  requireAuth(),
  uploadBrandLogo.single("logo"), 
  brandController.updateBrand
);

router.delete("/:id", requireAuth(), brandController.deleteBrand);

export { router as brandRoutes };