import mongoose from 'mongoose';

const staySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Stay', staySchema);
