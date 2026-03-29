import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api.ts';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import { formatINR } from '../lib/formatters.ts';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await bookingService.getMyBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading your bookings...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="h-14 w-14 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
          <Calendar className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Bookings</h1>
          <p className="text-gray-500">Manage your upcoming and past trips</p>
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking: any) => (
            <div key={booking._id} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={booking.listing?.imageUrl}
                  alt={booking.listing?.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-rose-500 shadow-sm">
                  Confirmed
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 truncate">{booking.listing?.title}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 text-rose-500" />
                    <span>{booking.listing?.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="h-4 w-4 text-rose-500" />
                    <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-lg pt-2">
                    <span className="text-rose-500 font-bold text-xl">₹</span>
                    <span>Total: {formatINR(booking.totalPrice)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/booking/${booking._id}`)}
                  className="w-full py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h2>
          <p className="text-gray-500 mb-8">Start exploring and find your next stay!</p>
          <button onClick={() => window.location.href = '/'} className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition-all">
            Explore Stays
          </button>
        </div>
      )}
    </div>
  );
}
