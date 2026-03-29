import { Request, Response } from 'express';
import Listing from '../models/Listing.ts';
import Stay from '../models/Stay.ts';

interface AuthRequest extends Request {
  user?: any;
}

export const getListings = async (req: Request, res: Response) => {
  const { location, minPrice, maxPrice } = req.query;
  let query: any = {};

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const listings = await Listing.find(query).populate('owner', 'name email');
  res.json(listings);
};

export const getListingById = async (req: Request, res: Response) => {
  let listing = await Listing.findById(req.params.id).populate('owner', 'name email');
  
  if (!listing) {
    // Check Stay collection if not found in Listing
    const stay = await Stay.findById(req.params.id);
    if (stay) {
      // Return stay with a mock owner for UI compatibility
      listing = {
        ...stay.toObject(),
        owner: { name: 'RoomScout Admin', email: 'admin@roomscout.com' }
      } as any;
    }
  }

  if (listing) {
    res.json(listing);
  } else {
    res.status(404);
    throw new Error('Listing not found');
  }
};

export const createListing = async (req: AuthRequest, res: Response) => {
  const { title, description, location, price, imageUrl } = req.body;
  const listing = await Listing.create({
    title,
    description,
    location,
    price,
    imageUrl,
    owner: req.user._id,
  });
  res.status(201).json(listing);
};

export const updateListing = async (req: AuthRequest, res: Response) => {
  const listing = await Listing.findById(req.params.id);
  if (listing) {
    if (listing.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this listing');
    }
    listing.title = req.body.title || listing.title;
    listing.description = req.body.description || listing.description;
    listing.location = req.body.location || listing.location;
    listing.price = req.body.price || listing.price;
    listing.imageUrl = req.body.imageUrl || listing.imageUrl;

    const updatedListing = await listing.save();
    res.json(updatedListing);
  } else {
    res.status(404);
    throw new Error('Listing not found');
  }
};

export const deleteListing = async (req: AuthRequest, res: Response) => {
  const listing = await Listing.findById(req.params.id);
  if (listing) {
    if (listing.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this listing');
    }
    await listing.deleteOne();
    res.json({ message: 'Listing removed' });
  } else {
    res.status(404);
    throw new Error('Listing not found');
  }
};
