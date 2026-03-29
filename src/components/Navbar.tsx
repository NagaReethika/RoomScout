import { Link, useNavigate } from 'react-router-dom';
import { Home, LogIn, UserPlus, PlusCircle, Calendar, LogOut, Heart } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;

  const logout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-rose-500" />
            <span className="text-2xl font-bold text-rose-500 tracking-tight">RoomScout</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/stays" className="text-gray-600 hover:text-rose-500 font-medium transition-colors">Stays</Link>
            {user ? (
              <>
                <Link to="/create-listing" className="flex items-center space-x-1 text-gray-600 hover:text-rose-500 font-medium transition-colors">
                  <PlusCircle className="h-4 w-4" />
                  <span>Host your stay</span>
                </Link>
                <Link to="/my-bookings" className="flex items-center space-x-1 text-gray-600 hover:text-rose-500 font-medium transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span>My Bookings</span>
                </Link>
                <Link to="/favorites" className="flex items-center space-x-1 text-gray-600 hover:text-rose-500 font-medium transition-colors">
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </Link>
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                  <span className="text-gray-900 font-semibold">Hi, {user.name}</span>
                  <button onClick={logout} className="text-gray-500 hover:text-rose-500 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-rose-500 font-medium transition-colors">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center space-x-1 bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 transition-colors font-medium">
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
