import express from 'express';
import { toggleFavorite, getMyFavorites, checkIsFavorite } from '../controllers/favoriteController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.route('/')
  .post(protect, toggleFavorite)
  .get(protect, getMyFavorites);

router.route('/:listingId/check').get(protect, checkIsFavorite);

export default router;
