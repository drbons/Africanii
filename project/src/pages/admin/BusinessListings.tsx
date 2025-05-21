import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  ChevronDown,
  Filter,
  Check,
  X,
  Edit2,
  Trash2,
  MoreHorizontal,
  Star,
  AlertCircle,
  Flag,
  Eye,
  MessageSquare,
  Tag,
  Pin
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';

// Mock data for businesses
const businessesMockData = [
  {
    id: '1',
    name: 'Taste of Africa Restaurant',
    owner: 'James Wilson',
    category: 'Restaurant',
    location: 'Atlanta, GA',
    status: 'approved',
    featured: true,
    rating: 4.7,
    reviews: 28,
    reports: 0,
    createdAt: '2023-04-10T14:30:00Z',
    lastUpdated: '2023-05-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'African Fabrics Imports',
    owner: 'Amina Osei',
    category: 'Retail',
    location: 'Houston, TX',
    status: 'approved',
    featured: false,
    rating: 4.2,
    reviews: 17,
    reports: 0,
    createdAt: '2023-04-15T09:45:00Z',
    lastUpdated: '2023-05-12T11:20:00Z'
  },
  {
    id: '3',
    name: 'Motherland Hair Salon',
    owner: 'Lisa Johnson',
    category: 'Beauty & Wellness',
    location: 'Chicago, IL',
    status: 'approved',
    featured: false,
    rating: 4.5,
    reviews: 23,
    reports: 1,
    createdAt: '2023-04-18T16:20:00Z',
    lastUpdated: '2023-05-20T09:15:00Z'
  },
  {
    id: '4',
    name: 'Safari Tech Solutions',
    owner: 'Robert Mensah',
    category: 'Technology',
    location: 'New York, NY',
    status: 'approved',
    featured: true,
    rating: 4.8,
    reviews: 12,
    reports: 0,
    createdAt: '2023-04-22T11:10:00Z',
    lastUpdated: '2023-05-18T14:30:00Z'
  },
  {
    id: '5',
    name: 'Afro Beats Music Shop',
    owner: 'David Johnson',
    category: 'Entertainment',
    location: 'Los Angeles, CA',
    status: 'pending',
    featured: false,
    rating: 0,
    reviews: 0,
    reports: 0,
    createdAt: '2023-06-01T10:25:00Z',
    lastUpdated: '2023-06-01T10:25:00Z'
  },
  {
    id: '6',
    name: 'Savanna Coffee House',
    owner: 'Michael Adeyemi',
    category: 'Restaurant',
    location: 'Miami, FL',
    status: 'pending',
    featured: false,
    rating: 0,
    reviews: 0,
    reports: 0,
    createdAt: '2023-06-02T15:40:00Z',
    lastUpdated: '2023-06-02T15:40:00Z'
  },
  {
    id: '7',
    name: 'Accra Market',
    owner: 'Grace Afolabi',
    category: 'Retail',
    location: 'Dallas, TX',
    status: 'flagged',
    featured: false,
    rating: 3.2,
    reviews: 5,
    reports: 3,
    createdAt: '2023-03-15T08:20:00Z',
    lastUpdated: '2023-05-10T14:15:00Z'
  },
  {
    id: '8',
    name: 'Sahara Designs',
    owner: 'Ahmed Mohammed',
    category: 'Home Decor',
    location: 'Seattle, WA',
    status: 'rejected',
    featured: false,
    rating: 0,
    reviews: 0,
    reports: 0,
    createdAt: '2023-05-28T09:15:00Z',
    lastUpdated: '2023-05-30T11:20:00Z'
  }
];

// Business categories for filtering
const categories = [
  'All Categories',
  'Restaurant',
  'Retail',
  'Beauty & Wellness',
  'Technology',
  'Entertainment',
  'Home Decor',
  'Professional Services',
  'Healthcare',
];

// Pending approvals
const pendingBusinesses = businessesMockData.filter(business => business.status === 'pending');

// Reported content
const reportedContent = [
  {
    id: '1',
    businessId: '7',
    businessName: 'Accra Market',
    type: 'Business Description',
    reason: 'Inappropriate content',
    reportedBy: 'user123',
    reportedAt: '2023-05-08T09:30:00Z',
    status: 'pending'
  },
  {
    id: '2',
    businessId: '7',
    businessName: 'Accra Market',
    type: 'Business Photo',
    reason: 'Misleading image',
    reportedBy: 'user456',
    reportedAt: '2023-05-09T14:45:00Z',
    status: 'pending'
  },
  {
    id: '3',
    businessId: '7',
    businessName: 'Accra Market',
    type: 'Business Contact',
    reason: 'Incorrect information',
    reportedBy: 'user789',
    reportedAt: '2023-05-10T11:20:00Z',
    status: 'pending'
  },
  {
    id: '4',
    businessId: '3',
    businessName: 'Motherland Hair Salon',
    type: 'Review',
    reason: 'Spam/fake review',
    reportedBy: 'business_owner',
    reportedAt: '2023-05-19T16:40:00Z',
    status: 'pending'
  }
];

export default function AdminBusinessListingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [currentTab, setCurrentTab] = useState('all-listings');
  const [businesses, setBusinesses] = useState(businessesMockData);

  // Filter businesses based on search term and filters
  const filteredBusinesses = businesses.filter(business => {
    // Search term filter
    const matchesSearch =
      searchTerm === '' ||
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === 'all' ||
      business.status === statusFilter;

    // Category filter
    const matchesCategory =
      categoryFilter === 'All Categories' ||
      business.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (businessId: string, newStatus: string) => {
    setBusinesses(prevBusinesses =>
      prevBusinesses.map(business =>
        business.id === businessId
          ? { ...business, status: newStatus }
          : business
      )
    );
  };

  const handleToggleFeatured = (businessId: string) => {
    setBusinesses(prevBusinesses =>
      prevBusinesses.map(business =>
        business.id === businessId
          ? { ...business, featured: !business.featured }
          : business
      )
    );
  };

  const handleResolveReport = (reportId: string) => {
    // In a real app, this would update the report status in the database
    console.log(`Resolved report: ${reportId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Business Listings</h2>
        <p className="text-muted-foreground">
          Manage business listings, approvals, and content moderation
        </p>
      </div>

      <Tabs defaultValue="all-listings" onValueChange={setCurrentTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all-listings">All Listings</TabsTrigger>
          <TabsTrigger value="pending-approvals">
            Pending Approvals
            {pendingBusinesses.length > 0 && (
              <Badge variant="secondary" className="ml-2">{pendingBusinesses.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reported-content">
            Reported Content
            {reportedContent.length > 0 && (
              <Badge variant="secondary" className="ml-2">{reportedContent.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* All Listings Tab */}
        <TabsContent value="all-listings">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <CardTitle>Business Listings</CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search businesses..."
                      className="pl-8 w-full md:w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <Filter className="h-4 w-4 mr-2" />
                          Status
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                          All
                          {statusFilter === 'all' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                          Approved
                          {statusFilter === 'approved' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                          Pending
                          {statusFilter === 'pending' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('flagged')}>
                          Flagged
                          {statusFilter === 'flagged' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                          Rejected
                          {statusFilter === 'rejected' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <Filter className="h-4 w-4 mr-2" />
                          Category
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {categories.map(category => (
                          <DropdownMenuItem 
                            key={category} 
                            onClick={() => setCategoryFilter(category)}
                          >
                            {category}
                            {categoryFilter === category && <Check className="h-4 w-4 ml-auto" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b">
                        <th className="py-3 px-4 text-left font-medium">Business</th>
                        <th className="py-3 px-4 text-left font-medium">Owner</th>
                        <th className="py-3 px-4 text-left font-medium">Category</th>
                        <th className="py-3 px-4 text-left font-medium">Location</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Rating</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBusinesses.length > 0 ? (
                        filteredBusinesses.map((business) => (
                          <tr key={business.id} className="border-b last:border-b-0">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                {business.featured && (
                                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                                )}
                                <span>{business.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{business.owner}</td>
                            <td className="py-3 px-4">{business.category}</td>
                            <td className="py-3 px-4">{business.location}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={
                                  business.status === 'approved' ? 'default' :
                                  business.status === 'pending' ? 'outline' :
                                  business.status === 'flagged' ? 'destructive' : 'secondary'
                                }
                              >
                                {business.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                {business.rating > 0 ? (
                                  <>
                                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                                    <span>{business.rating}</span>
                                    <span className="text-gray-500 ml-1">({business.reviews})</span>
                                  </>
                                ) : (
                                  <span className="text-gray-500">No reviews</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit Listing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message Owner
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {business.status !== 'approved' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(business.id, 'approved')}>
                                      <Check className="h-4 w-4 mr-2 text-green-500" />
                                      Approve Listing
                                    </DropdownMenuItem>
                                  )}
                                  {business.status !== 'flagged' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(business.id, 'flagged')}>
                                      <Flag className="h-4 w-4 mr-2 text-yellow-500" />
                                      Flag Listing
                                    </DropdownMenuItem>
                                  )}
                                  {business.status !== 'rejected' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(business.id, 'rejected')}>
                                      <X className="h-4 w-4 mr-2 text-red-500" />
                                      Reject Listing
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  {business.featured ? (
                                    <DropdownMenuItem onClick={() => handleToggleFeatured(business.id)}>
                                      <Pin className="h-4 w-4 mr-2 text-gray-500" />
                                      Remove from Featured
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleToggleFeatured(business.id)}>
                                      <Pin className="h-4 w-4 mr-2 text-yellow-500" />
                                      Add to Featured
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Listing
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-gray-500">
                            No businesses found matching the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Showing {filteredBusinesses.length} of {businesses.length} businesses
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Approvals Tab */}
        <TabsContent value="pending-approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Review and approve new business listing submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingBusinesses.length > 0 ? (
                <div className="space-y-6">
                  {pendingBusinesses.map(business => (
                    <div
                      key={business.id}
                      className="flex flex-col border rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <h3 className="font-medium text-lg">{business.name}</h3>
                          <Badge variant="outline">Submitted {formatDate(business.createdAt)}</Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Owner</p>
                            <p className="mt-1">{business.owner}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Category</p>
                            <p className="mt-1">{business.category}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Location</p>
                            <p className="mt-1">{business.location}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusChange(business.id, 'approved')}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleStatusChange(business.id, 'rejected')}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No pending approvals at this time</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reported Content Tab */}
        <TabsContent value="reported-content">
          <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>Review and resolve content that has been flagged by users</CardDescription>
            </CardHeader>
            <CardContent>
              {reportedContent.length > 0 ? (
                <div className="space-y-4">
                  {reportedContent.map(report => (
                    <div
                      key={report.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{report.businessName}</h3>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2">
                            {report.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Reported on {formatDate(report.reportedAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Reason:</span> {report.reason}
                        </p>
                      </div>
                      <div className="flex mt-4 md:mt-0 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => {/* View content logic */}}
                        >
                          View Content
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleResolveReport(report.id)}
                        >
                          Ignore Report
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => {/* Remove content logic */}}
                        >
                          Remove Content
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reported content at this time</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>Create and manage business categories and tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="font-medium mb-2">Add New Category</h3>
                <div className="flex gap-2">
                  <Input placeholder="Enter new category name" className="max-w-sm" />
                  <Button>Add Category</Button>
                </div>
              </div>

              <h3 className="font-medium mb-4">Current Categories</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.filter(cat => cat !== 'All Categories').map(category => (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{category}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 