import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import cartController from '@/modules/carts/cart.controller';

const router = Router();
router.get('/:user_id', authMiddleware(), cartController.getUserCart.bind(cartController));
router.post('/:user_id', authMiddleware(), cartController.addItemToCart.bind(cartController));
router.put('/item/:id', authMiddleware(), cartController.updateCartItem.bind(cartController));
router.delete('/item/:id/:user_id', authMiddleware(), cartController.removeCartItem.bind(cartController));
router.delete('/:user_id', authMiddleware(), cartController.clearCart.bind(cartController));

export default router;
