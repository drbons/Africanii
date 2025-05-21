import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, 
  MapPin, 
  Star, 
  BadgeCheck, 
  Clock, 
  Filter, 
  SortAsc, 
  Grid, 
  List, 
  Heart, 
  Share2, 
  MessageSquare, 
  Flag, 
  Plus,
  Instagram,
  Facebook,
  Twitter,
  ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function BusinessDirectoryPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState([0, 4]);
  const [ratingFilter, setRatingFilter] = useState(0);
  // Track active filter tags
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  // State for showing filter modal
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  
  // Helper function to check if user is a business owner
  const isBusinessOwner = () => {
    const role = profile?.role as string | undefined;
    return role === 'business' || role === 'seller';
  };
  
  // Mock data - would be fetched from Firestore in a real implementation
  const categories = [
    'All',
    'Restaurants',
    'Retail',
    'Services',
    'Healthcare',
    'Technology',
    'Entertainment'
  ];
  
  const popularFilters = [
    'Open Now',
    'Verified',
    'New Businesses',
    'Black-Owned',
    'Woman-Owned',
    'Accepting Online Orders',
    'Delivery Available'
  ];
  
  const businessData = [
    {
      id: 1,
      name: 'African Kitchen',
      logo: 'https://via.placeholder.com/80',
      category: 'Restaurants',
      tags: ['African Cuisine', 'Delivery', 'Takeout'],
      rating: 4.8,
      reviewCount: 127,
      isVerified: true,
      distance: '0.7 mi',
      address: '123 Main St, Atlanta, GA',
      hours: {
        status: 'Open',
        closing: 'Closes 9 PM',
        full: 'Mon-Sat: 11AM-9PM, Sun: 12PM-8PM'
      },
      yearsInBusiness: 5,
      description: 'Authentic African cuisine served in a warm, welcoming atmosphere. Specializing in West African dishes.',
      latestReview: {
        text: 'Amazing food and excellent service! The jollof rice is the best in town.',
        author: 'Michael S.',
        date: '2 days ago'
      },
      isFeatured: true,
      socials: {
        instagram: true,
        facebook: true,
        twitter: false
      },
      isSaved: false
    },
    {
      id: 2,
      name: 'Motherland Fabrics',
      logo: 'https://via.placeholder.com/80',
      category: 'Retail',
      tags: ['Textiles', 'Home Goods', 'Clothing'],
      rating: 4.6,
      reviewCount: 98,
      isVerified: true,
      distance: '1.2 mi',
      address: '456 Oak St, Atlanta, GA',
      hours: {
        status: 'Closed',
        opening: 'Opens 10 AM tomorrow',
        full: 'Mon-Fri: 10AM-7PM, Sat: 10AM-8PM, Sun: Closed'
      },
      yearsInBusiness: 8,
      description: 'Premium African textiles, clothing and home decor items directly sourced from artisans across Africa.',
      latestReview: {
        text: 'Beautiful fabrics with amazing quality. The staff was very helpful!',
        author: 'Jessica T.',
        date: '1 week ago'
      },
      isFeatured: true,
      socials: {
        instagram: true,
        facebook: true,
        twitter: true
      },
      isSaved: true
    },
    {
      id: 3,
      name: 'Sankofa Tech Solutions',
      logo: 'https://via.placeholder.com/80',
      category: 'Technology',
      tags: ['Software Development', 'Consulting', 'Web Design'],
      rating: 4.3,
      reviewCount: 64,
      isVerified: false,
      distance: '2.5 mi',
      address: '789 Tech Blvd, Atlanta, GA',
      hours: {
        status: 'Open',
        closing: 'Closes 6 PM',
        full: 'Mon-Fri: 9AM-6PM, Sat-Sun: Closed'
      },
      yearsInBusiness: 3,
      description: 'Full-service tech consulting and software development company specializing in solutions for small businesses.',
      latestReview: {
        text: 'Great team that delivered our project on time and within budget.',
        author: 'Robert J.',
        date: '3 weeks ago'
      },
      isFeatured: false,
      socials: {
        instagram: false,
        facebook: true,
        twitter: true
      },
      isSaved: false
    },
    {
      id: 4,
      name: 'Afrique Hair Salon',
      logo: 'https://via.placeholder.com/80',
      category: 'Services',
      tags: ['Hair Care', 'Beauty', 'Braiding'],
      rating: 4.9,
      reviewCount: 215,
      isVerified: true,
      distance: '0.5 mi',
      address: '234 Beauty Ave, Atlanta, GA',
      hours: {
        status: 'Open',
        closing: 'Closes 8 PM',
        full: 'Tue-Sat: 10AM-8PM, Sun: 12PM-6PM, Mon: Closed'
      },
      yearsInBusiness: 12,
      description: 'Expert hair care specializing in all types of African hair styles, braiding, locks, and natural hair care.',
      latestReview: {
        text: 'Best braiding in town! Always leave feeling beautiful.',
        author: 'Tasha W.',
        date: '3 days ago'
      },
      isFeatured: true,
      socials: {
        instagram: true,
        facebook: true,
        twitter: false
      },
      isSaved: false
    },
    {
      id: 5,
      name: 'Taste of Ethiopia',
      logo: 'https://via.placeholder.com/80',
      category: 'Restaurants',
      tags: ['Ethiopian Cuisine', 'Vegetarian Options', 'Dining'],
      rating: 4.5,
      reviewCount: 88,
      isVerified: false,
      distance: '3.1 mi',
      address: '567 Food Ln, Atlanta, GA',
      hours: {
        status: 'Open',
        closing: 'Closes 10 PM',
        full: 'Daily: 11AM-10PM'
      },
      yearsInBusiness: 4,
      description: 'Authentic Ethiopian dining experience with traditional injera and a variety of meat and vegetarian dishes.',
      latestReview: {
        text: 'Incredible flavors and very friendly service. A hidden gem!',
        author: 'David M.',
        date: '5 days ago'
      },
      isFeatured: false,
      socials: {
        instagram: true,
        facebook: false,
        twitter: false
      },
      isSaved: false
    },
    {
      id: 6,
      name: 'Diaspora Health Clinic',
      logo: 'https://via.placeholder.com/80',
      category: 'Healthcare',
      tags: ['Medical Care', 'Family Medicine', 'Wellness'],
      rating: 4.7,
      reviewCount: 156,
      isVerified: true,
      distance: '1.8 mi',
      address: '890 Health Rd, Atlanta, GA',
      hours: {
        status: 'Closed',
        opening: 'Opens 9 AM tomorrow',
        full: 'Mon-Fri: 9AM-5PM, Sat: 10AM-2PM, Sun: Closed'
      },
      yearsInBusiness: 7,
      description: 'Comprehensive healthcare services with cultural sensitivity and specialized knowledge of health issues affecting the African diaspora.',
      latestReview: {
        text: 'Dr. Johnson is incredible. Very thorough and actually listens.',
        author: 'Sarah K.',
        date: '2 weeks ago'
      },
      isFeatured: false,
      socials: {
        instagram: false,
        facebook: true,
        twitter: true
      },
      isSaved: true
    }
  ];
  
  // Function to render star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < Math.floor(rating) 
              ? "fill-yellow-400 text-yellow-400" 
              : i < rating 
                ? "fill-yellow-400 text-yellow-400 opacity-50" 
                : "text-gray-300"
            } 
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };
  
  // Toggle a filter tag
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };
  
  // Filter businesses based on search term, category, and active filters
  const filteredBusinesses = businessData.filter(business => {
    // Basic text search
    const matchesSearch = 
      searchTerm === '' || 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter - make case insensitive
    const matchesCategory = 
      selectedCategory === 'all' || 
      business.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // Apply active filter tags
    const matchesFilters = activeFilters.every(filter => {
      switch(filter) {
        case 'Open Now':
          return business.hours.status === 'Open';
        case 'Verified':
          return business.isVerified;
        case 'New Businesses':
          return business.yearsInBusiness <= 2;
        case 'Black-Owned':
          return true; // Mock data doesn't have this attribute
        case 'Woman-Owned':
          return true; // Mock data doesn't have this attribute
        case 'Accepting Online Orders':
          return business.tags.some(tag => 
            tag.toLowerCase().includes('delivery') || 
            tag.toLowerCase().includes('takeout')
          );
        case 'Delivery Available':
          return business.tags.some(tag => 
            tag.toLowerCase().includes('delivery')
          );
        default:
          return true;
      }
    });
    
    return matchesSearch && matchesCategory && matchesFilters;
  });
  
  // Sort businesses
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case 'highest-rated':
        return b.rating - a.rating;
      case 'most-reviewed':
        return b.reviewCount - a.reviewCount;
      case 'nearest':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'newest':
        return b.yearsInBusiness - a.yearsInBusiness;
      default:
        return a.isFeatured ? -1 : b.isFeatured ? 1 : 0;
    }
  });
  
  // Featured businesses
  const featuredBusinesses = businessData.filter(business => business.isFeatured);
  
  // Recently viewed businesses (this would normally be stored in state or localStorage)
  const recentlyViewed = businessData.slice(0, 3);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Africanii</h1>
          <p className="text-gray-600">Discover and connect with African businesses across the United States</p>
        </div>
        {user ? (
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => 
              isBusinessOwner()
                ? navigate('/create-business')
                : navigate('/profile')
            }
          >
            <Plus size={16} className="mr-2" />
            {isBusinessOwner() 
              ? 'Add Your Business' 
              : 'Create a Business Profile'
            }
          </Button>
        ) : (
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => navigate('/login')}
          >
            <Plus size={16} className="mr-2" />
            Sign in to Add Business
          </Button>
        )}
      </div>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search businesses, categories, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Location filter */}
            <div className="relative min-w-[200px]">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Location"
                className="pl-10"
              />
            </div>
            
            {/* Filter button */}
            <Button 
              variant="outline" 
              className="min-w-[100px]" 
              onClick={() => setShowFiltersModal(true)}
            >
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
            
            {/* Sort options */}
            <div className="min-w-[200px]">
              <div className="flex items-center gap-2">
                <SortAsc size={16} />
                <select 
                  className="flex-1 p-2 border rounded-md" 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="most-reviewed">Most Reviewed</option>
                  <option value="nearest">Nearest</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
            
            {/* View toggle */}
            <div className="flex border rounded-md">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                className="rounded-r-none border-0"
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                className="rounded-l-none border-0"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
          
          {/* Filter chips/tags */}
          <div className="flex flex-wrap gap-2">
            {popularFilters.map((filter) => (
              <div key={filter} className="flex items-center">
                <Button 
                  variant={activeFilters.includes(filter) ? "default" : "outline"} 
                  size="sm" 
                  className={`rounded-full text-xs ${activeFilters.includes(filter) ? 'bg-indigo-600' : ''}`}
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                </Button>
              </div>
            ))}
          </div>
          
          {/* Category tabs */}
          <div className="pt-2">
            <Tabs defaultValue="all" onValueChange={(val) => setSelectedCategory(val.toLowerCase())}>
              <TabsList className="w-full justify-start overflow-x-auto">
                {categories.map((category) => (
                  <TabsTrigger key={category.toLowerCase()} value={category.toLowerCase()}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Map view toggle */}
          <div className="flex items-center gap-2 pt-2">
            <Switch id="map-view" checked={showMap} onCheckedChange={setShowMap} />
            <Label htmlFor="map-view">Show Map View</Label>
          </div>
        </div>
      </div>
      
      {/* Featured Businesses Section */}
      {featuredBusinesses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <BadgeCheck className="mr-2 text-indigo-600" />
            Featured Businesses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses.map((business) => (
              <BusinessCard 
                key={business.id} 
                business={business} 
                viewMode="grid"
                renderStars={renderStars}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Main Business Listings */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">All Businesses</h2>
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
        }>
          {sortedBusinesses.length > 0 ? (
            sortedBusinesses.map((business) => (
              <BusinessCard 
                key={business.id} 
                business={business} 
                viewMode={viewMode}
                renderStars={renderStars}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No businesses found matching your criteria.</p>
              <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Recently Viewed Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentlyViewed.map((business) => (
            <Card key={business.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex gap-3">
                <div className="w-12 h-12 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden">
                  <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium line-clamp-1">{business.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{business.category}</p>
                  {renderStars(business.rating)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// BusinessCard component
interface BusinessCardProps {
  business: any;
  viewMode: 'grid' | 'list';
  renderStars: (rating: number) => JSX.Element;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, viewMode, renderStars }) => {
  const [saved, setSaved] = useState(business.isSaved);
  
  return (
    <Card className={`hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
      <div className={viewMode === 'list' ? 'flex flex-1' : ''}>
        <div className={viewMode === 'list' ? 'w-1/4 p-4' : 'p-4'}>
          {/* Business Image and Badges */}
          <div className="relative">
            <div className={`${viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'} bg-gray-100 rounded-md overflow-hidden mb-3`}>
              <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {business.isVerified && (
                <div className="bg-green-100 text-green-800 p-1 rounded-full">
                  <BadgeCheck size={16} />
                </div>
              )}
              {business.isFeatured && (
                <div className="bg-indigo-100 text-indigo-800 p-1 rounded-full">
                  <Star size={16} />
                </div>
              )}
            </div>
            <div className="absolute bottom-6 left-2">
              <div className="bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {business.distance}
              </div>
            </div>
          </div>
        </div>
        
        <div className={viewMode === 'list' ? 'flex-1 p-4' : ''}>
          <CardHeader className={viewMode === 'list' ? 'p-0 mb-2' : 'px-4 py-0 mb-2'}>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl mb-1">{business.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <span>{business.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                  <span>{business.yearsInBusiness} years in business</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className={viewMode === 'list' ? 'p-0' : 'px-4 py-0'}>
            <div className="space-y-3">
              {/* Rating */}
              <div className="flex items-center gap-2">
                {renderStars(business.rating)}
                <span className="text-sm text-gray-600">({business.reviewCount})</span>
              </div>
              
              {/* Status and hours */}
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className={`text-sm ${business.hours.status === 'Open' ? 'text-green-600' : 'text-red-600'}`}>
                  {business.hours.status}
                </span>
                <span className="text-sm text-gray-600">
                  {business.hours.status === 'Open' ? business.hours.closing : business.hours.opening}
                </span>
              </div>
              
              {/* Address */}
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">{business.address}</span>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {business.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {viewMode === 'list' && (
                <p className="text-sm text-gray-700">{business.description}</p>
              )}
              
              {/* Social media */}
              <div className="flex gap-2">
                {business.socials.facebook && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <Facebook size={16} />
                  </Button>
                )}
                {business.socials.instagram && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <Instagram size={16} />
                  </Button>
                )}
                {business.socials.twitter && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <Twitter size={16} />
                  </Button>
                )}
              </div>
              
              {/* Latest review preview - Only for grid view */}
              {viewMode === 'grid' && business.latestReview && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm italic line-clamp-2">"{business.latestReview.text}"</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{business.latestReview.author}</span>
                    <span>{business.latestReview.date}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </div>
      
      <CardFooter className={viewMode === 'list' ? 'w-1/6 border-l flex flex-col justify-center p-4' : 'p-4 border-t flex justify-between'}>
        {viewMode === 'list' ? (
          <>
            <Button size="sm" className="w-full mb-2">View Details</Button>
            <Button variant="outline" size="sm" className="w-full mb-2">Contact</Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`w-full ${saved ? 'text-red-600' : ''}`}
              onClick={() => setSaved(!saved)}
            >
              <Heart className={saved ? 'fill-red-600' : ''} size={16} />
            </Button>
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={saved ? 'text-red-600' : ''}
                onClick={() => setSaved(!saved)}
              >
                <Heart className={saved ? 'fill-red-600' : ''} size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Flag size={16} />
              </Button>
            </div>
            <div>
              <Button variant="default" size="sm">View Details</Button>
            </div>
          </>
        )}
        {!business.isVerified && (
          <Button variant="ghost" size="sm" className="text-xs text-indigo-600 mt-2">
            Claim This Business
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};