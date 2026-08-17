import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getUserOrders);
router.get('/all', adminMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/status', adminMiddleware, updateOrderStatus);
router.delete('/:id', adminMiddleware, deleteOrder);

export default router;
