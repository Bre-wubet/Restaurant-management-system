import express from 'express';

import {
  addInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';

import { authorizeRoles, authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router();
router.use(authenticateToken);authorizeRoles('staff', 'admin'), 

router.post('/', authorizeRoles('staff', 'admin'), addInventoryItem);
router.get('/', authorizeRoles('staff', 'admin'), getAllInventoryItems);
router.get('/:id', authorizeRoles('staff', 'admin'), getInventoryItemById);
router.put('/:id', authorizeRoles('staff', 'admin'), updateInventoryItem);
router.delete('/:id', authorizeRoles('admin'), deleteInventoryItem);

export default router;
