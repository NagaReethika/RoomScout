import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
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
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
