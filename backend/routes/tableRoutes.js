import express from 'express';
import {
  createTable,
  getAllTables,
  getTableById,
  updateTableStatus,
  deleteTable,
} from '../controllers/tableController.js';

const router = express.Router();

router.post('/', createTable);
router.get('/', getAllTables);
router.get('/:id', getTableById);
router.patch('/:id/status', updateTableStatus);
router.delete('/:id', deleteTable);

export default router;
