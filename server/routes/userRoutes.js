import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
} from '../controllers/userController.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', adminMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', adminMiddleware, deleteUser);
router.put('/:id/role', adminMiddleware, updateUserRole);

export default router;
