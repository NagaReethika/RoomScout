import { Request, Response } from 'express';
import Favorite from '../models/Favorite.ts';

interface AuthRequest extends Request {
  user?: any;
}

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  const { listingId, listingModel } = req.body;

  if (!listingId || !listingModel) {
    res.status(400);
    throw new Error('Listing ID and model are required');
  }

  const existingFavorite = await Favorite.findOne({
    user: req.user._id,
    listing: listingId
  });

  if (existingFavorite) {
    await Favorite.findByIdAndDelete(existingFavorite._id);
    res.json({ message: 'Removed from favorites', isFavorite: false });
  } else {
    await Favorite.create({
      user: req.user._id,
      listing: listingId,
      listingModel
    });
    res.status(201).json({ message: 'Added to favorites', isFavorite: true });
  }
};

export const getMyFavorites = async (req: AuthRequest, res: Response) => {
  const favorites = await Favorite.find({ user: req.user._id }).populate('listing');
  res.json(favorites);
};

export const checkIsFavorite = async (req: AuthRequest, res: Response) => {
  const { listingId } = req.params;
  const favorite = await Favorite.findOne({
    user: req.user._id,
    listing: listingId
  });
  res.json({ isFavorite: !!favorite });
};
