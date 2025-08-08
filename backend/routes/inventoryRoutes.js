import express from 'express';

import {
  addInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';

const router = express.Router();

router.post('/', addInventoryItem);
router.get('/', getAllInventoryItems);
router.get('/:id', getInventoryItemById);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

export default router;
