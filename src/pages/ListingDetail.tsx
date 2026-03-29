import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingService, bookingService } from '../services/api.ts';
import { MapPin, DollarSign, Calendar, User, Star, ShieldCheck, Heart } from 'lucide-react';
import { formatINR } from '../lib/formatters.ts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'motion/react';
import L from 'leaflet';
import FavoriteButton from '../components/FavoriteButton.tsx';

// Fix for Leaflet marker icons
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const CITY_COORDINATES: { [key: string]: [number, number] } = {
  'Srinagar': [34.0837, 74.7973],
  'New Delhi': [28.6139, 77.2090],
  'Udaipur': [24.5854, 73.7125],
  'Jaipur': [26.9124, 75.7873],
  'Hyderabad': [17.3850, 78.4867],
  'Mumbai': [19.0760, 72.8777],
  'Pune': [18.5204, 73.8567],
  'Bapatla': [15.9051, 80.4694],
  'Visakhapatnam': [17.6868, 83.2185],
  'Tirupati': [13.6288, 79.4192],
  'Kumarakom': [9.5916, 76.4297],
  'Chennai': [13.0827, 80.2707],
  'Bangalore': [12.9716, 77.5946],
  'Goa': [15.2993, 74.1240],
  'Benaulim': [15.2500, 73.9333],
  'Manali': [32.2432, 77.1892],
};

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await listingService.getById(id!);
        setListing(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both dates');
      return;
    }

    setBookingLoading(true);
    setError('');

    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));

    if (nights <= 0) {
      setError('End date must be after start date');
      setBookingLoading(false);
      return;
    }

    try {
      await bookingService.create({
        listingId: id,
        startDate,
        endDate,
        totalPrice: nights * listing.price,
      });
      navigate('/my-bookings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading stay details...</div>;
  if (!listing) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Stay not found</div>;

  const position = CITY_COORDINATES[listing.location] || [20.5937, 78.9629]; // Default to center of India

  return (
    <div className="relative min-h-screen">
      {/* Background Animations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -45, 0],
            x: [0, -50, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-rose-500 text-rose-500" />
              <span className="font-bold text-gray-900">4.9</span>
              <span className="underline">128 reviews</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="underline font-medium">{listing.location}{listing.state ? `, ${listing.state}` : ''}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton 
            listingId={id!} 
            listingModel={listing.category ? 'Stay' : 'Listing'} 
            className="h-12 w-12"
          />
          <span className="text-sm font-bold text-gray-600 hidden sm:inline">Save</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <div className="aspect-video w-full overflow-hidden rounded-3xl shadow-lg">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex items-center justify-between py-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hosted by {listing.owner?.name}</h2>
              <p className="text-gray-500">Joined in 2024</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <ShieldCheck className="h-6 w-6 text-rose-500 shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900">RoomScout Cover</h3>
                <p className="text-gray-500">Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like check-in problems.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">{listing.description}</p>
          </div>

          {/* Map Section */}
          <div className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Where you'll be</h2>
            <div className="h-[400px] w-full rounded-3xl overflow-hidden shadow-inner border border-gray-100 z-0">
              <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    <div className="font-bold">{listing.title}</div>
                    <div className="text-xs text-gray-500">{listing.location}</div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <p className="mt-4 text-gray-600 font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-500" />
              {listing.location}, {listing.state}
            </p>
          </div>
        </div>

        {/* Booking Card */}
        <div className="md:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{formatINR(listing.price)}</span>
                <span className="text-gray-500">/ night</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-bold">4.9</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-2 border border-gray-300 rounded-xl overflow-hidden">
                <div className="p-3 border-r border-gray-300">
                  <label className="block text-[10px] font-bold uppercase text-gray-900 mb-1">Check-in</label>
                  <input
                    type="date"
                    className="w-full text-sm focus:outline-none"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-bold uppercase text-gray-900 mb-1">Checkout</label>
                  <input
                    type="date"
                    className="w-full text-sm focus:outline-none"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all disabled:opacity-50 shadow-lg shadow-rose-200"
              >
                {bookingLoading ? 'Processing...' : 'Reserve Now'}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-4">You won't be charged yet</p>

            <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
              <div className="flex justify-between text-gray-600">
                <span className="underline">{formatINR(listing.price)} x 5 nights</span>
                <span>{formatINR(listing.price * 5)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="underline">Cleaning fee</span>
                <span>{formatINR(500)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="underline">Service fee</span>
                <span>{formatINR(200)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>{formatINR(listing.price * 5 + 700)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
