import express from 'express';
import productVariantController from '@/modules/product-variants/product-variant.controller';

const router = express.Router();

router.get('/', productVariantController.getAllVariants);

router.get('/:id', productVariantController.getVariantById);

router.post('/', productVariantController.createVariant);

router.put('/:id', productVariantController.updateVariant);

router.delete('/:id', productVariantController.deleteVariant);

export default router;
