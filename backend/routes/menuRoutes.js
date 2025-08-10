import express from 'express';
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';

import { authorizeRoles, authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/', createMenuItem);
router.get('/', getAllMenuItems);
router.get('/:id', authenticateToken, authorizeRoles('staff', 'admin'), getMenuItemById);
router.put('/:id', authenticateToken, authorizeRoles('staff', 'admin'), updateMenuItem);
router.delete('/:id', authenticateToken, authorizeRoles('staff', 'admin'), deleteMenuItem);

export default router;
