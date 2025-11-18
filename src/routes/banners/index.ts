import express from 'express';
import bannerController from '@/modules/banners/banner.controller';
import { requireAuth } from '@/middlewares/auth.middleware';

const router = express.Router();

router.get('/', bannerController.getAllBanners);
router.get('/:id', bannerController.getBannerById);

router.post('/', requireAuth(), bannerController.createBanner);
router.put('/:id', requireAuth(), bannerController.updateBanner);
router.delete('/:id', requireAuth(), bannerController.deleteBanner);

export default router;
