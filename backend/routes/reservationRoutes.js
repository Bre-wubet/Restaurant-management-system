import express from 'express';
import {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  cancelReservation,
} from '../controllers/reservationController.js';

import { authorizeRoles, authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router();
router.use(authenticateToken);

router.post('/', authorizeRoles('customer', 'staff', 'admin'), createReservation);
router.get('/', authorizeRoles('staff', 'admin'), getAllReservations);
router.get('/:id', authorizeRoles('staff', 'admin'), getReservationById);
router.put('/:id', authorizeRoles('staff', 'admin'), updateReservation);
router.delete('/:id', authorizeRoles('customer', 'staff', 'admin'), cancelReservation);

export default router;
