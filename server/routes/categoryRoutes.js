import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', adminMiddleware, createCategory);
router.put('/:id', adminMiddleware, updateCategory);
router.delete('/:id', adminMiddleware, deleteCategory);

export default router;
