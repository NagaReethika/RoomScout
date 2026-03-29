import express from 'express';
import { getListings, getListingById, createListing, updateListing, deleteListing } from '../controllers/listingController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.route('/').get(getListings).post(protect, createListing);
router.route('/:id').get(getListingById).put(protect, updateListing).delete(protect, deleteListing);

export default router;

