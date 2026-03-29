import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingService } from '../services/api.ts';
import { PlusCircle, Image, MapPin, DollarSign, Type, AlignLeft, AlertCircle } from 'lucide-react';

export default function CreateListing() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await listingService.create({
        ...formData,
        price: Number(formData.price),
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
            <PlusCircle className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Host Your Stay</h1>
            <p className="text-gray-500">Share your space with travelers from around the world</p>
          </div>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
              <Type className="h-4 w-4" />
              <span>Title</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Cozy Beachfront Villa"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Bali, Indonesia"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <DollarSign className="h-4 w-4" />
                <span>Price per night</span>
              </label>
              <input
                type="number"
                name="price"
                required
                placeholder="0.00"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
              <Image className="h-4 w-4" />
              <span>Image URL</span>
            </label>
            <input
              type="url"
              name="imageUrl"
              required
              placeholder="https://images.unsplash.com/..."
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            {formData.imageUrl && (
              <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-gray-100">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
              <AlignLeft className="h-4 w-4" />
              <span>Description</span>
            </label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Tell guests about your place..."
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 text-white py-5 rounded-2xl font-bold text-xl hover:bg-rose-600 transition-all disabled:opacity-50 shadow-lg shadow-rose-200"
          >
            {loading ? 'Creating listing...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
