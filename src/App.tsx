/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import ListingDetail from './pages/ListingDetail.tsx';
import CreateListing from './pages/CreateListing.tsx';
import MyBookings from './pages/MyBookings.tsx';
import Stays from './pages/Stays.tsx';
import BookingDetails from './pages/BookingDetails.tsx';
import Favorites from './pages/Favorites.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stays" element={<Stays />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route 
              path="/create-listing" 
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-bookings" 
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking/:id" 
              element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500 font-medium">© 2026 RoomScout Inc. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-400">
              <a href="#" className="hover:text-rose-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-rose-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-rose-500 transition-colors">Sitemap</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

