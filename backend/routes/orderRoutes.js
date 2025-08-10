import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { authorizeRoles, authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router();

router.use(authenticateToken);

router.post('/', authorizeRoles('customer', 'staff', 'admin'), createOrder);
router.get('/', authorizeRoles('staff', 'admin'), getAllOrders);
router.get('/:id', authorizeRoles('staff', 'admin'), getOrderById);
router.patch('/:id/status', authorizeRoles('staff', 'admin'), updateOrderStatus);
router.delete('/:id', authorizeRoles('admin'), deleteOrder);

export default router;
