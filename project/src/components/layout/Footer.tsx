import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-600">
              Connecting African businesses across the United States.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/business-directory" className="text-gray-600 hover:text-indigo-600">Business Directory</a></li>
              <li><a href="/events" className="text-gray-600 hover:text-indigo-600">Events</a></li>
              <li><a href="/for-sale" className="text-gray-600 hover:text-indigo-600">Marketplace</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="text-gray-600 hover:text-indigo-600">Help Center</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-indigo-600">Contact Us</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-indigo-600">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Facebook</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Twitter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">&copy; 2025 Africanii. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;