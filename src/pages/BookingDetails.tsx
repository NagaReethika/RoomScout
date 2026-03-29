import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api.ts';
import { Calendar, MapPin, ArrowLeft, User, Mail, Clock, ShieldCheck } from 'lucide-react';
import { formatINR } from '../lib/formatters.ts';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data } = await bookingService.getById(id!);
        setBooking(data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Booking not found');
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>
      <p className="mt-4 text-gray-500">Loading booking details...</p>
    </div>
  );

  if (error || !booking) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="bg-rose-50 p-8 rounded-3xl inline-block">
        <ShieldCheck className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Booking not found'}</h2>
        <p className="text-gray-500 mb-6">We couldn't find the booking you're looking for.</p>
        <button 
          onClick={() => navigate('/my-bookings')}
          className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition-all"
        >
          Back to My Bookings
        </button>
      </div>
    </div>
  );

  const nights = Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/my-bookings')}
        className="flex items-center gap-2 text-gray-600 hover:text-rose-500 font-bold mb-8 transition-colors group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        Back to My Bookings
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="relative h-64 sm:h-80">
          <img
            src={booking.listing?.imageUrl}
            alt={booking.listing?.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">{booking.listing?.title}</h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-5 w-5 text-rose-400" />
              <span className="font-medium">{booking.listing?.location}, {booking.listing?.state}</span>
            </div>
          </div>
          <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Confirmed
          </div>
        </div>

        <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Booking Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-rose-500" />
                Trip Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Check-in</p>
                  <p className="text-gray-900 font-bold">{new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Check-out</p>
                  <p className="text-gray-900 font-bold">{new Date(booking.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-gray-600 bg-rose-50/50 p-3 rounded-xl border border-rose-100/50">
                <Clock className="h-4 w-4 text-rose-500" />
                <span className="text-sm font-medium">{nights} night{nights > 1 ? 's' : ''} stay</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="h-6 w-6 text-rose-500" />
                Guest Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Primary Guest</p>
                    <p className="text-gray-900 font-bold">{booking.user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Mail className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-gray-900 font-bold">{booking.user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>{formatINR(booking.listing?.price)} x {nights} nights</span>
                <span className="font-medium">{formatINR(booking.listing?.price * nights)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Cleaning fee</span>
                <span className="font-medium">{formatINR(2000)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service fee</span>
                <span className="font-medium">{formatINR(3500)}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total (INR)</span>
                <span className="text-2xl font-black text-rose-500">{formatINR(booking.totalPrice)}</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Payment Secured</p>
                <p className="text-xs text-gray-500">Your transaction is protected by RoomScout guarantee.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
