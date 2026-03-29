import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Welcome to <span className="text-rose-500">RoomScout</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 font-medium">
            Find your perfect stay anytime, anywhere
          </p>
          <button
            onClick={() => navigate('/stays')}
            className="bg-rose-500 text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-rose-600 transition-all transform hover:scale-105 shadow-xl shadow-rose-500/20"
          >
            Explore Stays
          </button>
        </motion.div>
      </div>
    </div>
  );
}
