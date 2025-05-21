import React from 'react';
import { Link } from 'react-router-dom';

const CategoryMenu = () => {
  const categories = [
    'All',
    'Restaurants',
    'Retail',
    'Services',
    'Healthcare',
    'Technology',
    'Entertainment'
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8 overflow-x-auto py-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/business-directory?category=${category.toLowerCase()}`}
              className="text-gray-600 hover:text-indigo-600 whitespace-nowrap"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;