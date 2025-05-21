import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Calendar,
  MapPin,
  Users,
  Store,
  TrendingUp,
  MousePointer,
  ArrowRight,
  MessageSquare,
  Clock,
  Filter
} from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';

// Mock data for analytics
const userGrowthData = {
  daily: [32, 28, 35, 42, 38, 41, 50, 45],
  weekly: [210, 245, 268, 290, 315, 342, 385, 420],
  monthly: [1250, 1480, 1620, 1890, 2150, 2400, 2750, 3100],
  total: 3845
};

const businessGrowthData = {
  daily: [5, 3, 4, 6, 4, 5, 7, 8],
  weekly: [25, 28, 32, 30, 29, 35, 42, 48],
  monthly: [120, 145, 165, 195, 230, 270, 310, 345],
  total: 782
};

const engagementData = {
  searches: {
    total: 12480,
    change: '+12.5%',
    increasing: true
  },
  profileViews: {
    total: 28950,
    change: '+8.3%',
    increasing: true
  },
  messages: {
    total: 5340,
    change: '+15.2%',
    increasing: true
  },
  clickThroughs: {
    total: 9840,
    change: '+5.7%',
    increasing: true
  }
};

const locationData = [
  { city: 'Atlanta', state: 'GA', users: 580, businesses: 95 },
  { city: 'Houston', state: 'TX', users: 520, businesses: 87 },
  { city: 'Chicago', state: 'IL', users: 490, businesses: 76 },
  { city: 'New York', state: 'NY', users: 450, businesses: 72 },
  { city: 'Los Angeles', state: 'CA', users: 380, businesses: 62 },
  { city: 'Miami', state: 'FL', users: 320, businesses: 58 },
  { city: 'Dallas', state: 'TX', users: 290, businesses: 51 },
  { city: 'Washington', state: 'DC', users: 240, businesses: 42 }
];

const trafficSourcesData = [
  { source: 'Organic Search', visitors: 12480, percentage: 42 },
  { source: 'Direct', visitors: 8920, percentage: 30 },
  { source: 'Social Media', visitors: 4750, percentage: 16 },
  { source: 'Referrals', visitors: 2180, percentage: 7 },
  { source: 'Email Campaigns', visitors: 1240, percentage: 4 },
  { source: 'Other', visitors: 310, percentage: 1 }
];

const conversionFunnelData = [
  { stage: 'Visitors', count: 29880, percentage: 100 },
  { stage: 'Registrations', count: 5180, percentage: 17.3 },
  { stage: 'Profile Completions', count: 4250, percentage: 14.2 },
  { stage: 'Business Submissions', count: 920, percentage: 3.1 },
  { stage: 'Premium Conversions', count: 310, percentage: 1.0 }
];

// Bar chart component
const BarChart = ({ data, title, color = 'bg-blue-500' }: { data: number[], title: string, color?: string }) => {
  const maxValue = Math.max(...data);
  
  return (
    <div>
      <p className="text-sm font-medium mb-3">{title}</p>
      <div className="flex items-end gap-2 h-[150px]">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full relative">
              <div 
                className={`w-full rounded-t ${color}`} 
                style={{ height: `${(value / maxValue) * 130}px` }}
              ></div>
            </div>
            <span className="text-xs mt-1">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Line chart component (simplified)
const LineChart = ({ data, title, color = 'stroke-blue-500' }: { data: number[], title: string, color?: string }) => {
  const maxValue = Math.max(...data);
  const height = 150;
  const width = 300;
  const padding = 20;
  
  // Generate points for the chart
  const points = data.map((value, i) => {
    const x = padding + (i * ((width - padding * 2) / (data.length - 1)));
    const y = height - padding - ((value / maxValue) * (height - padding * 2));
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div>
      <p className="text-sm font-medium mb-3">{title}</p>
      <div className="relative h-[150px]">
        <svg width={width} height={height} className="overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="stroke-gray-200" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} className="stroke-gray-200" strokeWidth="1" />
          
          {/* Data line */}
          <polyline
            points={points}
            fill="none"
            className={`${color}`}
            strokeWidth="2"
          />
          
          {/* Data points */}
          {data.map((value, i) => {
            const x = padding + (i * ((width - padding * 2) / (data.length - 1)));
            const y = height - padding - ((value / maxValue) * (height - padding * 2));
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                className={`${color.replace('stroke-', 'fill-')}`}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// Progress bar component
const ProgressBar = ({ percentage, label, count }: { percentage: number, label: string, count: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-sm">
      <span>{label}</span>
      <span className="font-medium">{formatNumber(count)}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('week');
  const [chartData, setChartData] = useState({
    users: userGrowthData.weekly,
    businesses: businessGrowthData.weekly
  });

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    if (value === 'day') {
      setChartData({
        users: userGrowthData.daily,
        businesses: businessGrowthData.daily
      });
    } else if (value === 'week') {
      setChartData({
        users: userGrowthData.weekly,
        businesses: businessGrowthData.weekly
      });
    } else if (value === 'month') {
      setChartData({
        users: userGrowthData.monthly,
        businesses: businessGrowthData.monthly
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for your platform
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Tabs defaultValue="week" className="w-full md:w-auto" onValueChange={handlePeriodChange}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
        </TabsList>
        
        {/* Growth Tab */}
        <TabsContent value="growth">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(userGrowthData.total)}</div>
                <p className="text-xs text-muted-foreground">
                  Total registered users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Businesses</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(businessGrowthData.total)}</div>
                <p className="text-xs text-muted-foreground">
                  Total business listings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+12.8%</div>
                <p className="text-xs text-muted-foreground">
                  Month over month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Time on Site</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8m 42s</div>
                <p className="text-xs text-muted-foreground">
                  Per session
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  New user registrations over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={chartData.users} 
                  title={`User Growth (per ${period})`} 
                  color="bg-blue-500" 
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Business Listings Growth</CardTitle>
                <CardDescription>
                  New business listings over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={chartData.businesses} 
                  title={`Business Growth (per ${period})`} 
                  color="bg-green-500" 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Searches</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(engagementData.searches.total)}</div>
                <p className="text-xs text-green-600">
                  {engagementData.searches.change} from last {period}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(engagementData.profileViews.total)}</div>
                <p className="text-xs text-green-600">
                  {engagementData.profileViews.change} from last {period}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(engagementData.messages.total)}</div>
                <p className="text-xs text-green-600">
                  {engagementData.messages.change} from last {period}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Throughs</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(engagementData.clickThroughs.total)}</div>
                <p className="text-xs text-green-600">
                  {engagementData.clickThroughs.change} from last {period}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                User activity and engagement over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <LineChart 
                  data={[9200, 9600, 10300, 10900, 11500, 12000, 12480]} 
                  title="Searches" 
                  color="stroke-blue-500" 
                />
                <LineChart 
                  data={[22400, 23200, 24300, 25100, 26400, 27800, 28950]} 
                  title="Profile Views" 
                  color="stroke-green-500" 
                />
                <LineChart 
                  data={[3800, 4050, 4300, 4550, 4800, 5100, 5340]} 
                  title="Messages" 
                  color="stroke-purple-500" 
                />
                <LineChart 
                  data={[7600, 8100, 8400, 8900, 9200, 9600, 9840]} 
                  title="Click Throughs" 
                  color="stroke-amber-500" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Geography Tab */}
        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>
                Users and business locations by city
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b">
                        <th className="py-3 px-4 text-left font-medium">Location</th>
                        <th className="py-3 px-4 text-left font-medium">Users</th>
                        <th className="py-3 px-4 text-left font-medium">Businesses</th>
                        <th className="py-3 px-4 text-left font-medium">User Density</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locationData.map((location) => (
                        <tr key={location.city} className="border-b last:border-b-0">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                              <span>
                                {location.city}, {location.state}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{formatNumber(location.users)}</td>
                          <td className="py-3 px-4">{formatNumber(location.businesses)}</td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${(location.users / userGrowthData.total) * 100}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Traffic Sources Tab */}
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficSourcesData.map((source) => (
                  <ProgressBar
                    key={source.source}
                    label={source.source}
                    count={source.visitors}
                    percentage={source.percentage}
                  />
                ))}
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatNumber(trafficSourcesData[0].visitors)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Organic Traffic
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatNumber(trafficSourcesData[2].visitors)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Social Media
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {formatNumber(trafficSourcesData[4].visitors)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Email Campaigns
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Conversion Funnel Tab */}
        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>
                Track user journey from visitor to customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {conversionFunnelData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center mb-2">
                      <span className="text-lg font-medium">{stage.stage}</span>
                      <span className="ml-auto text-lg font-medium">{formatNumber(stage.count)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-lg h-8 dark:bg-gray-700 mb-1">
                      <div 
                        className="bg-blue-600 h-8 rounded-lg" 
                        style={{ width: `${stage.percentage}%` }}
                      >
                        <div className="flex items-center justify-between px-3 h-full">
                          <span className="text-white text-sm font-medium">{stage.percentage}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {index < conversionFunnelData.length - 1 && (
                      <div className="flex justify-center my-2">
                        <ArrowRight className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    
                    {index < conversionFunnelData.length - 1 && (
                      <div className="text-sm text-gray-500 text-center">
                        {(conversionFunnelData[index + 1].count / stage.count * 100).toFixed(1)}% conversion rate
                      </div>
                    )}
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