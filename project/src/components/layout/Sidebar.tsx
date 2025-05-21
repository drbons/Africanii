import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Store, Calendar, MessageSquare, Bell, ShoppingBag, Settings, Shield } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Store, label: 'Business Directory', path: '/business-directory' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: MessageSquare, label: 'Chats', path: '/chats' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: ShoppingBag, label: 'For Sale', path: '/for-sale' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Shield, label: 'Admin Tools', path: '/admin' },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;