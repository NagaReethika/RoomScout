import mongoose from 'mongoose';
import './Listing.ts';
import './Stay.ts';

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: 'listingModel'
  },
  listingModel: {
    type: String,
    required: true,
    enum: ['Listing', 'Stay']
  }
}, { timestamps: true });

// Ensure a user can only favorite a listing once
favoriteSchema.index({ user: 1, listing: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
