import React, { useState, useEffect } from 'react';
import { Search, Tag, Plus, SlidersHorizontal, ArrowUpDown, X, MapPin, DollarSign, Star, Filter, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Simple Badge component since the import might be failing
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 text-gray-900 border-gray-200';
      case 'destructive':
        return 'bg-red-500 text-white border-transparent';
      case 'outline':
        return 'bg-transparent text-gray-600 border-gray-200';
      default:
        return 'bg-blue-500 text-white border-transparent';
    }
  };

  return (
    <div 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getVariantClass()} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

interface ItemForSale {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  description: string;
  location: string;
  imageUrl: string;
  createdAt: string;
  isNew?: boolean;
  isHot?: boolean;
}

export default function ForSalePage() {
  const { user } = useAuth();
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Sample items data
  const [items, setItems] = useState<ItemForSale[]>([
    {
      id: '1',
      title: 'Laptop Computer',
      price: 599.99,
      category: 'Electronics',
      condition: 'Excellent',
      description: 'High-performance laptop with SSD and 16GB RAM.',
      location: 'Atlanta, GA',
      imageUrl: 'https://placehold.co/400x300/e6e6e6/cccccc?text=Laptop',
      createdAt: new Date(2023, 5, 15).toISOString(),
      isHot: true
    },
    {
      id: '2',
      title: 'Dining Table',
      price: 249.99,
      category: 'Furniture',
      condition: 'Good',
      description: 'Wooden dining table with 6 chairs, perfect for family dinners.',
      location: 'Chicago, IL',
      imageUrl: 'https://placehold.co/400x300/e6e6e6/cccccc?text=Table',
      createdAt: new Date(2023, 6, 22).toISOString()
    },
    {
      id: '3',
      title: 'Winter Jacket',
      price: 89.99,
      category: 'Clothing',
      condition: 'Like New',
      description: 'Warm winter jacket, hardly worn, size XL.',
      location: 'New York, NY',
      imageUrl: 'https://placehold.co/400x300/e6e6e6/cccccc?text=Jacket',
      createdAt: new Date(2023, 7, 3).toISOString()
    },
    {
      id: '4',
      title: 'Collection of Classic Novels',
      price: 45.99,
      category: 'Books',
      condition: 'Good',
      description: 'Set of 10 classic novels in hardcover.',
      location: 'Boston, MA',
      imageUrl: 'https://placehold.co/400x300/e6e6e6/cccccc?text=Books',
      createdAt: new Date(2023, 7, 18).toISOString()
    },
    {
      id: '5',
      title: 'Oil Painting',
      price: 350.00,
      category: 'Art',
      condition: 'Excellent',
      description: 'Original oil painting of sunset over mountains.',
      location: 'Miami, FL',
      imageUrl: 'https://placehold.co/400x300/e6e6e6/cccccc?text=Painting',
      createdAt: new Date(2023, 8, 5).toISOString()
    },
    {
      id: '6',
      title: 'Bluetooth Speaker',
      price: 79.99,
      category: 'Electronics',
      condition: 'New',
      description: 'Waterproof Bluetooth speaker with 20-hour battery life.',
      location: 'Atlanta, GA',
      imageUrl: 'https://placehold.co/400x300/e6e6e6/cccccc?text=Speaker',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isNew: true
    },
    {
      id: '7',
      title: 'Mountain Bike',
      price: 499.99,
      category: 'Sports & Outdoors',
      condition: 'Good',
      description: '21-speed mountain bike, recently tuned up.',
      location: 'Denver, CO',
      imageUrl: 'https://placehold.co/400x300/e6e6e6/cccccc?text=Bike',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '8',
      title: 'Vintage Camera',
      price: 175.00,
      category: 'Electronics',
      condition: 'Fair',
      description: 'Collectible film camera from the 1970s. Still works!',
      location: 'Portland, OR',
      imageUrl: 'https://placehold.co/400x300/e6e6e6/cccccc?text=Camera',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: '9',
      title: 'Designer Handbag',
      price: 899.99,
      category: 'Clothing',
      condition: 'Like New',
      description: 'Luxury designer handbag, barely used.',
      location: 'Los Angeles, CA',
      imageUrl: 'https://placehold.co/400x300/e6e6e6/cccccc?text=Handbag',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      isHot: true
    }
  ]);

  const categories = Array.from(new Set(items.map(item => item.category)));
  const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'For Parts'];
  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Alphabetical A-Z', value: 'name-asc' },
    { label: 'Alphabetical Z-A', value: 'name-desc' }
  ];

  // Check if any filters are active
  const hasActiveFilters = (): boolean => {
    return (
      searchTerm !== '' ||
      selectedCategories.length > 0 ||
      selectedConditions.length > 0 ||
      minPrice !== '' ||
      maxPrice !== '' ||
      location !== ''
    );
  };

  // Handle category checkbox changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle condition checkbox changes
  const handleConditionChange = (condition: string) => {
    setSelectedConditions(prev => {
      if (prev.includes(condition)) {
        return prev.filter(c => c !== condition);
      } else {
        return [...prev, condition];
      }
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedConditions([]);
    setMinPrice('');
    setMaxPrice('');
    setLocation('');
    setSortOption('newest');
  };

  // Compute filtered and sorted items
  const filteredItems = items.filter(item => {
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
      return false;
    }
    
    // Condition filter
    if (selectedConditions.length > 0 && !selectedConditions.includes(item.condition)) {
      return false;
    }
    
    // Price range filter
    const numMinPrice = minPrice ? parseFloat(minPrice) : 0;
    const numMaxPrice = maxPrice ? parseFloat(maxPrice) : Infinity;
    
    if (item.price < numMinPrice || item.price > numMaxPrice) {
      return false;
    }
    
    // Location filter
    if (location && !item.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    
    // Search term (match title or description)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Marketplace</h1>
          <p className="text-gray-600">Buy and sell items within the African business community</p>
        </div>
        {user && (
          <Link to="/create-item">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" />
              Post Item
            </Button>
          </Link>
        )}
      </div>

      {/* Search Bar and Sort */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search items by title, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={isFiltersOpen ? "bg-gray-100" : ""}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters() && <Badge className="ml-2 bg-blue-500">{filteredItems.length}</Badge>}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[140px]">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                {sortOptions.find(option => option.value === sortOption)?.label || 'Sort By'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.value} 
                  onClick={() => setSortOption(option.value)}
                  className={sortOption === option.value ? "bg-gray-100 font-medium" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expandable Filters Section */}
      {isFiltersOpen && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Filter Options</h3>
            
            {hasActiveFilters() && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4 mr-1" />
                Reset Filters
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Price Range
              </h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full"
                />
                <span className="text-gray-400">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Categories */}
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                Categories
              </h4>
              <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm font-normal"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Condition */}
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Condition
              </h4>
              <div className="space-y-1">
                {conditions.map((condition) => (
                  <div key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`condition-${condition}`}
                      checked={selectedConditions.includes(condition)}
                      onChange={() => handleConditionChange(condition)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label
                      htmlFor={`condition-${condition}`}
                      className="ml-2 text-sm font-normal"
                    >
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Location */}
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Location
              </h4>
              <Input
                type="text"
                placeholder="City, State, or Zip"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters() && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchTerm}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => setSearchTerm('')}
                    />
                  </Badge>
                )}
                
                {selectedCategories.map(category => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => handleCategoryChange(category)}
                    />
                  </Badge>
                ))}
                
                {selectedConditions.map(condition => (
                  <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                    {condition}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => handleConditionChange(condition)}
                    />
                  </Badge>
                ))}
                
                {(minPrice || maxPrice) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Price: {minPrice || '0'} - {maxPrice || '∞'}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                    />
                  </Badge>
                )}
                
                {location && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Location: {location}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => setLocation('')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
        </p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow relative overflow-hidden">
              {item.isNew && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 z-10">
                  NEW
                </div>
              )}
              {item.isHot && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 z-10">
                  HOT
                </div>
              )}
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <MapPin className="h-3 w-3" /> 
                  <span>{item.location}</span>
                  <Clock className="h-3 w-3 ml-2" />
                  <span>
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-3">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                    <Badge variant="outline" className="bg-gray-50">
                      {item.condition}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                </div>
              </CardContent>
              <div className="p-4 pt-0 flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                <Button size="sm" className="flex-1">Contact Seller</Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}