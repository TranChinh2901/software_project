import express from 'express';
import productVariantController from '@/modules/product-variants/product-variant.controller';

const router = express.Router();

// GET /product-variants - Get all variants or filter by product_id
router.get('/', productVariantController.getAllVariants);

// GET /product-variants/:id - Get variant by ID
router.get('/:id', productVariantController.getVariantById);

// POST /product-variants - Create new variant
router.post('/', productVariantController.createVariant);

// PUT /product-variants/:id - Update variant
router.put('/:id', productVariantController.updateVariant);

// DELETE /product-variants/:id - Delete variant
router.delete('/:id', productVariantController.deleteVariant);

export default router;
