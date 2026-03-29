import { Request, Response } from 'express';
import Booking from '../models/Booking.ts';
import Listing from '../models/Listing.ts';
import Stay from '../models/Stay.ts';

interface AuthRequest extends Request {
  user?: any;
}

export const createBooking = async (req: AuthRequest, res: Response) => {
  const { listingId, startDate, endDate, totalPrice } = req.body;
  
  // Check both collections
  const listing = await Listing.findById(listingId);
  const stay = !listing ? await Stay.findById(listingId) : null;

  if (!listing && !stay) {
    res.status(404);
    throw new Error('Listing not found');
  }

  const booking = await Booking.create({
    user: req.user._id,
    listing: listingId,
    listingModel: listing ? 'Listing' : 'Stay',
    startDate,
    endDate,
    totalPrice,
  });

  res.status(201).json(booking);
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('listing');
  res.json(bookings);
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate('listing')
    .populate('user', 'name email');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Ensure user owns the booking
  if (booking.user._id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(booking);
};
