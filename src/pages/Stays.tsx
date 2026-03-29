import React, { useState, useEffect } from 'react';
import { stayService } from '../services/api.ts';
import StayCard from '../components/StayCard.tsx';
import { Search, SlidersHorizontal, Loader2, AlertCircle, ChevronDown, Home, Hotel, Building, Tent, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const CATEGORIES = [
  { id: 'PG', label: 'PG', icon: Home },
  { id: 'Hostel', label: 'Hostel', icon: Building },
  { id: 'Hotel', label: 'Hotel', icon: Hotel },
  { id: 'Room', label: 'Room', icon: Sparkles },
  { id: 'Homestay', label: 'Homestay', icon: Tent },
  { id: 'Apartment', label: 'Apartment', icon: Building },
  { id: 'Villa', label: 'Villa', icon: Home },
];

export default function Stays() {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Filter states
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  const fetchStays = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await stayService.getAll({
        location,
        state,
        category,
        sort
      });
      setStays(data);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to load stays. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStays();
  };

  // Effect for sorting after initial search
  useEffect(() => {
    if (hasSearched) {
      fetchStays();
    }
  }, [sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight"
        >
          Find Your Perfect <span className="text-rose-500">Stay</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 text-xl max-w-2xl mx-auto"
        >
          Discover handpicked PGs, Hostels, Hotels, and more across India's most vibrant locations.
        </motion.p>
      </div>

      {/* Search & Preferences Section */}
      <motion.div 
        layout
        className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 mb-16"
      >
        <form onSubmit={handleSearch} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Location Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Where are you going?</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search city or state..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all text-lg font-medium"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* State Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Select State</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="w-full pl-12 pr-10 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all appearance-none cursor-pointer text-lg font-medium"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">All States</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold text-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Search className="h-6 w-6" />}
                Search Stays
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">What are you looking for?</label>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setCategory('')}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 border-2 ${
                  category === '' 
                    ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100' 
                    : 'bg-white text-gray-500 border-gray-100 hover:border-rose-200 hover:text-rose-500'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                All Stays
              </button>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 border-2 ${
                      category === cat.id 
                        ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100' 
                        : 'bg-white text-gray-500 border-gray-100 hover:border-rose-200 hover:text-rose-500'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {!hasSearched ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                <Sparkles className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Ready to explore?</h2>
              <p className="text-gray-500">Enter a location or select a category above to start your search.</p>
            </div>
          </motion.div>
        ) : loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="h-12 w-12 text-rose-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Finding the best stays for you...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-2xl mx-auto"
          >
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={fetchStays}
              className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {stays.length} {stays.length === 1 ? 'Stay' : 'Stays'} found
              </h2>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-2.5 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all appearance-none cursor-pointer text-sm font-bold text-gray-600"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="">Sort: Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {stays.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {stays.map((stay: any) => (
                  <StayCard key={stay._id} listing={stay} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No stays found</h2>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => { setLocation(''); setState(''); setCategory(''); setHasSearched(false); }}
                  className="mt-6 text-rose-500 font-bold hover:underline"
                >
                  Reset search
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
