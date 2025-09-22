import { Router } from "express";
import { BrandController } from "@/modules/brands/brand.controller";
import { uploadBrandLogo } from "@/middlewares/upload.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { CreateBrandSchema } from "@/modules/brands/schema/brand.shema";

const router = Router();
const brandController = new BrandController();

router.post(
  "/",
  uploadBrandLogo.single("logo"), 
  validateBody(CreateBrandSchema),
  brandController.createBrand
);
router.get("/", brandController.getAllBrands);

router.get("/:id", brandController.getBrandById);

router.put(
  "/:id",
  uploadBrandLogo.single("logo"), 
  brandController.updateBrand
);

router.delete("/:id", brandController.deleteBrand);

export { router as brandRoutes };