import express from 'express';
import bannerController from '@/modules/banners/banner.controller';
import { requireAuth } from '@/middlewares/auth.middleware';
import { uploadBannerImage } from '@/middlewares/upload.middleware';

const router = express.Router();

router.get('/', bannerController.getAllBanners);
router.get('/:id', bannerController.getBannerById);

router.post('/', requireAuth(), uploadBannerImage.single('image_url'), bannerController.createBanner);
router.put('/:id', requireAuth(), uploadBannerImage.single('image_url'), bannerController.updateBanner);
router.delete('/:id', requireAuth(), bannerController.deleteBanner);

export default router;
