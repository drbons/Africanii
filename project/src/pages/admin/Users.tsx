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
  Mail,
  AlertCircle
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

// Mock data for users
const usersMockData = [
  { 
    id: '1', 
    name: 'David Johnson', 
    email: 'david.j@example.com', 
    role: 'business', 
    status: 'active',
    verified: true,
    createdAt: '2023-05-15T10:30:00Z',
    lastLogin: '2023-06-10T14:22:35Z',
    businessCount: 2
  },
  { 
    id: '2', 
    name: 'Sarah Williams', 
    email: 'sarah.w@example.com', 
    role: 'business', 
    status: 'pending',
    verified: false,
    createdAt: '2023-05-17T08:45:00Z',
    lastLogin: '2023-06-09T11:15:42Z',
    businessCount: 1
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    email: 'michael.b@example.com', 
    role: 'general', 
    status: 'active',
    verified: true,
    createdAt: '2023-05-20T14:20:00Z',
    lastLogin: '2023-06-11T09:34:21Z',
    businessCount: 0
  },
  { 
    id: '4', 
    name: 'Emily Davis', 
    email: 'emily.d@example.com', 
    role: 'general', 
    status: 'active',
    verified: true,
    createdAt: '2023-05-22T16:10:00Z',
    lastLogin: '2023-06-10T16:45:12Z',
    businessCount: 0
  },
  { 
    id: '5', 
    name: 'James Wilson', 
    email: 'james.w@example.com', 
    role: 'business', 
    status: 'active',
    verified: true,
    createdAt: '2023-05-25T11:05:00Z',
    lastLogin: '2023-06-11T13:28:55Z',
    businessCount: 3
  },
  { 
    id: '6', 
    name: 'Amina Osei', 
    email: 'amina.o@example.com', 
    role: 'business', 
    status: 'suspended',
    verified: true,
    createdAt: '2023-05-27T09:30:00Z',
    lastLogin: '2023-06-01T08:12:33Z',
    businessCount: 1
  },
  { 
    id: '7', 
    name: 'Robert Mensah', 
    email: 'robert.m@example.com', 
    role: 'business', 
    status: 'active',
    verified: true,
    createdAt: '2023-05-28T15:45:00Z',
    lastLogin: '2023-06-11T10:54:46Z',
    businessCount: 1
  },
  { 
    id: '8', 
    name: 'Lisa Johnson', 
    email: 'lisa.j@example.com', 
    role: 'general', 
    status: 'inactive',
    verified: true,
    createdAt: '2023-05-30T13:20:00Z',
    lastLogin: '2023-06-02T14:32:18Z',
    businessCount: 0
  }
];

// User verification requests
const verificationRequests = [
  {
    id: '1',
    user: {
      id: '2',
      name: 'Sarah Williams',
      email: 'sarah.w@example.com'
    },
    documentType: 'Government ID',
    submittedAt: '2023-06-05T09:12:00Z',
    status: 'pending'
  },
  {
    id: '2',
    user: {
      id: '9',
      name: 'John Adebayo',
      email: 'john.a@example.com'
    },
    documentType: 'Business License',
    submittedAt: '2023-06-06T14:33:00Z',
    status: 'pending'
  },
  {
    id: '3',
    user: {
      id: '10',
      name: 'Marie Mubarak',
      email: 'marie.m@example.com'
    },
    documentType: 'Government ID',
    submittedAt: '2023-06-07T11:45:00Z',
    status: 'pending'
  }
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all-users');
  const [users, setUsers] = useState(usersMockData);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    // Search term filter
    const matchesSearch = 
      searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      user.status === statusFilter;
    
    // Role filter
    const matchesRole = 
      roleFilter === 'all' || 
      user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus } 
          : user
      )
    );
  };

  const handleApproveVerification = (requestId: string) => {
    // In a real app, this would update the verification status in the database
    console.log(`Approved verification request: ${requestId}`);
  };

  const handleRejectVerification = (requestId: string) => {
    // In a real app, this would update the verification status in the database
    console.log(`Rejected verification request: ${requestId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Manage user accounts, verifications, and permissions
        </p>
      </div>

      <Tabs defaultValue="all-users" onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="verification">Verification Requests</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>
        
        {/* All Users Tab */}
        <TabsContent value="all-users">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <CardTitle>User Accounts</CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search users..."
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
                        <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                          Active
                          {statusFilter === 'active' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                          Pending
                          {statusFilter === 'pending' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('suspended')}>
                          Suspended
                          {statusFilter === 'suspended' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                          Inactive
                          {statusFilter === 'inactive' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <Filter className="h-4 w-4 mr-2" />
                          Role
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setRoleFilter('all')}>
                          All
                          {roleFilter === 'all' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter('general')}>
                          General User
                          {roleFilter === 'general' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter('business')}>
                          Business Owner
                          {roleFilter === 'business' && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
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
                        <th className="py-3 px-4 text-left font-medium">Name</th>
                        <th className="py-3 px-4 text-left font-medium">Email</th>
                        <th className="py-3 px-4 text-left font-medium">Role</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Verified</th>
                        <th className="py-3 px-4 text-left font-medium">Joined</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b last:border-b-0">
                            <td className="py-3 px-4">{user.name}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge variant={user.role === 'business' ? 'default' : 'secondary'}>
                                {user.role === 'business' ? 'Business Owner' : 'General User'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge 
                                variant={
                                  user.status === 'active' ? 'default' :
                                  user.status === 'pending' ? 'outline' :
                                  user.status === 'suspended' ? 'destructive' : 'secondary'
                                }
                              >
                                {user.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {user.verified ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                            </td>
                            <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
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
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {user.status !== 'active' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                                      <Check className="h-4 w-4 mr-2 text-green-500" />
                                      Set as Active
                                    </DropdownMenuItem>
                                  )}
                                  {user.status !== 'suspended' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'suspended')}>
                                      <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                                      Suspend Account
                                    </DropdownMenuItem>
                                  )}
                                  {user.status !== 'inactive' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'inactive')}>
                                      <X className="h-4 w-4 mr-2 text-red-500" />
                                      Set as Inactive
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Account
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-gray-500">
                            No users found matching the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Showing {filteredUsers.length} of {users.length} users
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Verification Requests Tab */}
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verification Requests</CardTitle>
              <CardDescription>Approve or reject user verification submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {verificationRequests.length > 0 ? (
                <div className="space-y-4">
                  {verificationRequests.map(request => (
                    <div 
                      key={request.id} 
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{request.user.name}</h3>
                        <p className="text-sm text-gray-500">{request.user.email}</p>
                        <div className="mt-1 flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {request.documentType}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Submitted on {formatDate(request.submittedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex mt-4 md:mt-0 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => {/* View document logic */}}
                        >
                          View Document
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveVerification(request.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleRejectVerification(request.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No verification requests pending</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Roles & Permissions Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>User Roles & Permissions</CardTitle>
              <CardDescription>Manage user roles and access permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b">
                    <h3 className="font-medium">Role: General User</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">
                        Default role for standard users. Can browse the directory, interact with businesses, and participate in community discussions.
                      </p>
                      
                      <h4 className="font-medium mt-4">Permissions:</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>View business listings and profiles</li>
                        <li>Send messages to businesses</li>
                        <li>Post in community forums</li>
                        <li>Submit reviews for businesses</li>
                        <li>Manage personal profile</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b">
                    <h3 className="font-medium">Role: Business Owner</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">
                        Enhanced role for users who manage business listings. Includes all general user permissions plus business management capabilities.
                      </p>
                      
                      <h4 className="font-medium mt-4">Permissions:</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Create and manage business listings</li>
                        <li>Upload business photos and media</li>
                        <li>Respond to customer reviews</li>
                        <li>Access business analytics dashboard</li>
                        <li>Create promotional posts</li>
                        <li>Manage team members (Premium only)</li>
                        <li>Create sponsored listings (Premium only)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b">
                    <h3 className="font-medium">Role: Administrator</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">
                        Full administrative access to the platform. Can manage all aspects of the system including users, content, and settings.
                      </p>
                      
                      <h4 className="font-medium mt-4">Permissions:</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>All permissions from other roles</li>
                        <li>Manage user accounts</li>
                        <li>Approve/reject business listings</li>
                        <li>Moderate content and reviews</li>
                        <li>Access admin dashboard with analytics</li>
                        <li>Manage system settings and configurations</li>
                        <li>Manage payment and subscription settings</li>
                        <li>Send system announcements and emails</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 