import React, { useState, useEffect } from 'react';
import { favoriteService } from '../services/api.ts';
import StayCard from '../components/StayCard.tsx';
import { Heart, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await favoriteService.getMyFavorites();
      setFavorites(data);
    } catch (err) {
      setError('Failed to load favorites. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight"
        >
          My <span className="text-rose-500">Wishlist</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 text-xl max-w-2xl mx-auto"
        >
          Your favorite stays and listings, saved for your next adventure.
        </motion.p>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="h-12 w-12 text-rose-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading your wishlist...</p>
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
              onClick={fetchFavorites}
              className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : favorites.length > 0 ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {favorites.map((fav: any) => (
              <StayCard key={fav._id} listing={fav.listing} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200"
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                <Heart className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
              <p className="text-gray-500">Start exploring and save your favorite stays for later.</p>
              <Link 
                to="/stays"
                className="inline-block mt-6 bg-rose-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
              >
                Explore Stays
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
