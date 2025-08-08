import express from 'express';
import {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  cancelReservation,
} from '../controllers/reservationController.js';

const router = express.Router();

router.post('/', createReservation);
router.get('/', getAllReservations);
router.get('/:id', getReservationById);
router.put('/:id', updateReservation);
router.delete('/:id', cancelReservation);

export default router;
