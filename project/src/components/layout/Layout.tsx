import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Store, Calendar, MessageSquare, Bell, ShoppingBag, Settings, User } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Mark layout as loaded after first render
  useEffect(() => {
    // Use RAF for smoother transition after browser paint
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  }, []);

  // Enforce LTR direction at document level
  useEffect(() => {
    // Set document-level direction to enforce LTR
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
    document.body.setAttribute('dir', 'ltr');
    document.body.style.direction = 'ltr';
    document.body.style.textAlign = 'left';
  }, []);

  return (
    <div 
      className={`min-h-screen bg-gray-50 ${isLoaded ? 'transition-opacity duration-300 opacity-100' : 'opacity-95'}`}
      dir="ltr"
      lang="en"
      style={{ direction: 'ltr', textAlign: 'left' }}
    >
      {/* Navigation Header - using a more efficient rendering approach */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-indigo-600">Community Hub</Link>
          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-6 h-6 text-gray-600" />
            </Link>
            <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full">
              <User className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content - moved earlier in the DOM for faster paint */}
      <main className="pt-16 pb-16" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
        {children}
      </main>

      {/* Bottom Navigation - deferred render approach */}
      <footer className="bg-white shadow-md fixed bottom-0 left-0 right-0 z-50">
        <nav className="h-16 flex items-center justify-around max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center p-1">
            <Home className="w-6 h-6 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Home</span>
          </Link>
          <Link to="/marketplace" className="flex flex-col items-center p-1">
            <Store className="w-6 h-6 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Marketplace</span>
          </Link>
          <Link to="/events" className="flex flex-col items-center p-1">
            <Calendar className="w-6 h-6 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Events</span>
          </Link>
          <Link to="/messages" className="flex flex-col items-center p-1">
            <MessageSquare className="w-6 h-6 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Messages</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center p-1">
            <ShoppingBag className="w-6 h-6 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Shop</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;