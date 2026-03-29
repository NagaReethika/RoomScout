import React, { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { favoriteService } from '../services/api.ts';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  listingId: string;
  listingModel: 'Listing' | 'Stay';
  className?: string;
}

export default function FavoriteButton({ listingId, listingModel, className = "" }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  
  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) {
        setChecking(false);
        return;
      }
      try {
        const { data } = await favoriteService.checkIsFavorite(listingId);
        setIsFavorite(data.isFavorite);
      } catch (err) {
        console.error('Error checking favorite status:', err);
      } finally {
        setChecking(false);
      }
    };
    checkFavorite();
  }, [listingId, user]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const { data } = await favoriteService.toggle({ listingId, listingModel });
      setIsFavorite(data.isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <div className={`h-10 w-10 flex items-center justify-center ${className}`}><Loader2 className="h-4 w-4 animate-spin text-gray-300" /></div>;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleFavorite}
      disabled={loading}
      className={`group relative flex items-center justify-center h-10 w-10 rounded-full transition-all ${
        isFavorite 
          ? 'bg-rose-50 text-rose-500' 
          : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-rose-50 hover:text-rose-500'
      } shadow-sm border border-gray-100 ${className}`}
      title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={`h-5 w-5 transition-all ${
          isFavorite ? 'fill-rose-500 scale-110' : 'group-hover:scale-110'
        }`} 
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
          <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
        </div>
      )}
    </motion.button>
  );
}
