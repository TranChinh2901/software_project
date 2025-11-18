import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import orderController from '@/modules/orders/order.controller';

const router = Router();

// Public routes
router.get('/', authMiddleware(), orderController.getAllOrders.bind(orderController));
router.get('/:id', authMiddleware(), orderController.getOrderById.bind(orderController));
router.get('/user/orders', authMiddleware(), orderController.getUserOrders.bind(orderController));

// Protected routes (require authentication)
router.post('/', authMiddleware(), orderController.createOrder.bind(orderController));
router.put('/:id/status', authMiddleware(), orderController.updateOrderStatus.bind(orderController));
router.post('/:id/cancel', authMiddleware(), orderController.cancelOrder.bind(orderController));

export default router;
