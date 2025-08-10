import express from 'express';
import {
  createTable,
  getAllTables,
  getTableById,
  updateTableStatus,
  deleteTable,
} from '../controllers/tableController.js';

import { authorizeRoles, authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router();
router.use(authenticateToken);

router.post('/', authorizeRoles('admin'), createTable);
router.get('/', authorizeRoles('staff', 'admin'), getAllTables);
router.get('/:id', authorizeRoles('staff', 'admin'), getTableById);
router.patch('/:id/status', authorizeRoles('staff', 'admin'), updateTableStatus);
router.delete('/:id', authorizeRoles('admin'), deleteTable);

export default router;
