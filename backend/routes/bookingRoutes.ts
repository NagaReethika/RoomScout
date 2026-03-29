import express from 'express';
import { createBooking, getMyBookings, getBookingById } from '../controllers/bookingController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, getMyBookings);
router.route('/:id').get(protect, getBookingById);

export default router;
