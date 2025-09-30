import express from 'express';
import productGalleryController from '@/modules/product-gallery/product-gallery.controller';
import { requireAuth } from '@/middlewares/auth.middleware';
import { uploadProductGalleryImages } from '@/middlewares/upload.middleware';

const router = express.Router();

router.post('/',
//   requireAuth(),
    uploadProductGalleryImages.array('image_url'),
  productGalleryController.createProductGallery
);

router.get('/', productGalleryController.getAllProductGallery);

router.delete('/:id',
//   requireAuth(),
  productGalleryController.deleteProductGallery
);
export default router;
