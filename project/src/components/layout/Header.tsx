import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/'); // Use React Router's navigate instead of window.location
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-green-600">
          Africanii
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/marketplace" className="text-gray-600 hover:text-green-600">
            Marketplace
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-green-600">
            About Us
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-green-600">
            Contact Us
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/notifications" className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="w-6 h-6 text-gray-600" />
          </Link>
          <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full">
            <User className="w-6 h-6 text-gray-600" />
          </Link>
          {user && (
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;