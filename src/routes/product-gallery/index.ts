import express from 'express';
import productGalleryController from '@/modules/product-gallery/product-gallery.controller';
import { requireAuth } from '@/middlewares/auth.middleware';
import { uploadProductGalleryImages } from '@/middlewares/upload.middleware';

const router = express.Router();

router.post('/',
  requireAuth(),
    uploadProductGalleryImages.array('files'),
  productGalleryController.createProductGallery
);

export default router;
