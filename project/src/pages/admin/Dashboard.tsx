import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Store, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';

// Mock data for dashboard
const analyticsData = {
  users: {
    total: 3845,
    change: '+12.5%',
    increasing: true,
    newToday: 24,
    activeUsers: 1253,
    verifiedUsers: 2945,
    unverifiedUsers: 900
  },
  businesses: {
    total: 782,
    change: '+5.3%',
    increasing: true,
    newToday: 8,
    pendingApproval: 23,
    featuredListings: 42,
    flaggedListings: 7
  },
  revenue: {
    total: 128750,
    change: '+8.1%',
    increasing: true,
    monthly: 42250,
    subscriptions: {
      basic: 345,
      premium: 240,
      enterprise: 65
    }
  }
};

const recentUsers = [
  { id: 1, name: 'David Johnson', email: 'david.j@example.com', joined: '2 hours ago', status: 'active' },
  { id: 2, name: 'Sarah Williams', email: 'sarah.w@example.com', joined: '4 hours ago', status: 'pending' },
  { id: 3, name: 'Michael Brown', email: 'michael.b@example.com', joined: '1 day ago', status: 'active' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', joined: '2 days ago', status: 'active' }
];

const recentBusinesses = [
  { id: 1, name: 'Taste of Africa Restaurant', owner: 'James Wilson', submitted: '3 hours ago', status: 'pending' },
  { id: 2, name: 'African Fabrics Imports', owner: 'Amina Osei', submitted: '1 day ago', status: 'approved' },
  { id: 3, name: 'Motherland Hair Salon', owner: 'Lisa Johnson', submitted: '2 days ago', status: 'approved' },
  { id: 4, name: 'Safari Tech Solutions', owner: 'Robert Mensah', submitted: '3 days ago', status: 'approved' }
];

const recentReports = [
  { id: 1, type: 'Business', name: 'XYZ Company', reason: 'Inappropriate content', submitted: '5 hours ago' },
  { id: 2, type: 'User', name: 'user123', reason: 'Spam messages', submitted: '1 day ago' },
  { id: 3, type: 'Business', name: 'ABC Services', reason: 'Misrepresentation', submitted: '2 days ago' }
];

// Status badge component
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'flagged';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
      case 'flagged':
        return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState('week');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your platform's key metrics and activities
          </p>
        </div>
        <Tabs defaultValue="week" className="w-full md:w-auto" onValueChange={(value) => setPeriod(value)}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.users.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {analyticsData.users.increasing ? (
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={analyticsData.users.increasing ? 'text-green-500' : 'text-red-500'}>
                {analyticsData.users.change}
              </span>
              <span className="ml-1">from last {period}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Listings</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.businesses.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {analyticsData.businesses.increasing ? (
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={analyticsData.businesses.increasing ? 'text-green-500' : 'text-red-500'}>
                {analyticsData.businesses.change}
              </span>
              <span className="ml-1">from last {period}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.revenue.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {analyticsData.revenue.increasing ? (
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={analyticsData.revenue.increasing ? 'text-green-500' : 'text-red-500'}>
                {analyticsData.revenue.change}
              </span>
              <span className="ml-1">from last {period}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.businesses.pendingApproval}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires your review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Users */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Newly registered user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={user.status as any} />
                    <p className="text-xs text-muted-foreground mt-1">{user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Businesses */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Businesses</CardTitle>
            <CardDescription>Latest business listings submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBusinesses.map(business => (
                <div key={business.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{business.name}</p>
                    <p className="text-sm text-muted-foreground">by {business.owner}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={business.status as any} />
                    <p className="text-xs text-muted-foreground mt-1">{business.submitted}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reports */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Reports &amp; Flags</CardTitle>
            <CardDescription>Content reported by users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map(report => (
                <div key={report.id} className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">
                      {report.type}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{report.submitted}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Verified Users</span>
                <span className="font-medium">{formatNumber(analyticsData.users.verifiedUsers)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(analyticsData.users.verifiedUsers / analyticsData.users.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm">Unverified Users</span>
                <span className="font-medium">{formatNumber(analyticsData.users.unverifiedUsers)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-yellow-500 h-2.5 rounded-full" 
                  style={{ width: `${(analyticsData.users.unverifiedUsers / analyticsData.users.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Featured Listings</span>
                <span className="font-medium">{formatNumber(analyticsData.businesses.featuredListings)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(analyticsData.businesses.featuredListings / analyticsData.businesses.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm">Pending Approval</span>
                <span className="font-medium">{formatNumber(analyticsData.businesses.pendingApproval)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-yellow-500 h-2.5 rounded-full" 
                  style={{ width: `${(analyticsData.businesses.pendingApproval / analyticsData.businesses.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm">Flagged Content</span>
                <span className="font-medium">{formatNumber(analyticsData.businesses.flaggedListings)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-red-600 h-2.5 rounded-full" 
                  style={{ width: `${(analyticsData.businesses.flaggedListings / analyticsData.businesses.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Basic</span>
                <span className="font-medium">{formatNumber(analyticsData.revenue.subscriptions.basic)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-gray-500 h-2.5 rounded-full" 
                  style={{ width: `${(analyticsData.revenue.subscriptions.basic / (analyticsData.revenue.subscriptions.basic + analyticsData.revenue.subscriptions.premium + analyticsData.revenue.subscriptions.enterprise)) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm">Premium</span>
                <span className="font-medium">{formatNumber(analyticsData.revenue.subscriptions.premium)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(analyticsData.revenue.subscriptions.premium / (analyticsData.revenue.subscriptions.basic + analyticsData.revenue.subscriptions.premium + analyticsData.revenue.subscriptions.enterprise)) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm">Enterprise</span>
                <span className="font-medium">{formatNumber(analyticsData.revenue.subscriptions.enterprise)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${(analyticsData.revenue.subscriptions.enterprise / (analyticsData.revenue.subscriptions.basic + analyticsData.revenue.subscriptions.premium + analyticsData.revenue.subscriptions.enterprise)) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 