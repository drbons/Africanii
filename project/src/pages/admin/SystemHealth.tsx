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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  HardDrive,
  RefreshCw,
  Server,
  Cpu,
  BarChart,
  FileText,
  XCircle,
  Zap
} from 'lucide-react';

// Custom Memory icon component since it's not available in lucide-react
const Memory = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 19v-3"></path>
    <path d="M10 19v-3"></path>
    <path d="M14 19v-3"></path>
    <path d="M18 19v-3"></path>
    <rect x="4" y="4" width="16" height="12" rx="2"></rect>
    <path d="M8 4v4"></path>
    <path d="M16 4v4"></path>
  </svg>
);

// Mock data for system metrics
const serverMetrics = {
  uptime: '99.98%',
  responseTime: '123ms',
  cpuUsage: 34,
  memoryUsage: 42,
  diskUsage: 57,
  lastReboot: '2023-07-01 03:15 AM',
  activeConnections: 267,
  serverLoad: [28, 35, 40, 32, 45, 50, 38, 30, 35, 42, 38, 40],
  serverLocation: 'AWS us-east-1',
  status: 'operational'
};

// Mock data for recent errors
const recentErrors = [
  {
    id: 'ERR-001',
    message: 'Database connection timeout',
    timestamp: '2023-07-10 13:45:22',
    severity: 'high',
    component: 'Database',
    status: 'resolved',
    count: 3
  },
  {
    id: 'ERR-002',
    message: 'Failed to process payment transaction',
    timestamp: '2023-07-10 10:22:15',
    severity: 'medium',
    component: 'Payment Gateway',
    status: 'investigating',
    count: 5
  },
  {
    id: 'ERR-003',
    message: 'API rate limit exceeded',
    timestamp: '2023-07-09 22:17:03',
    severity: 'low',
    component: 'External API',
    status: 'resolved',
    count: 12
  },
  {
    id: 'ERR-004',
    message: 'Failed to send notification email',
    timestamp: '2023-07-09 18:05:47',
    severity: 'medium',
    component: 'Notification Service',
    status: 'resolved',
    count: 8
  }
];

// Mock data for logs
const systemLogs = [
  {
    id: 'LOG-001',
    message: 'System backup completed successfully',
    timestamp: '2023-07-10 02:00:00',
    level: 'info',
    component: 'Backup Service'
  },
  {
    id: 'LOG-002',
    message: 'User authentication successful',
    timestamp: '2023-07-10 14:22:35',
    level: 'info',
    component: 'Authentication'
  },
  {
    id: 'LOG-003',
    message: 'Database query took longer than expected',
    timestamp: '2023-07-10 13:40:12',
    level: 'warning',
    component: 'Database'
  },
  {
    id: 'LOG-004',
    message: 'Payment webhook received and processed',
    timestamp: '2023-07-10 11:15:02',
    level: 'info',
    component: 'Payment Gateway'
  },
  {
    id: 'LOG-005',
    message: 'New business profile created',
    timestamp: '2023-07-10 10:32:18',
    level: 'info',
    component: 'Business Management'
  },
  {
    id: 'LOG-006',
    message: 'Scheduled maintenance started',
    timestamp: '2023-07-10 02:30:00',
    level: 'info',
    component: 'System'
  }
];

// Mock data for service status
const serviceStatus = [
  { name: 'Web Application', status: 'operational', uptime: '99.99%' },
  { name: 'Database', status: 'operational', uptime: '99.95%' },
  { name: 'Authentication Service', status: 'operational', uptime: '99.98%' },
  { name: 'Storage Service', status: 'operational', uptime: '99.99%' },
  { name: 'Email Service', status: 'degraded', uptime: '98.72%' },
  { name: 'Payment Gateway', status: 'operational', uptime: '99.90%' },
  { name: 'Search Service', status: 'operational', uptime: '99.94%' },
  { name: 'Analytics Service', status: 'operational', uptime: '99.97%' }
];

export default function AdminSystemHealthPage() {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // In a real app, this would fetch new data
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'outage':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getErrorStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Resolved
          </Badge>
        );
      case 'investigating':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Investigating
          </Badge>
        );
      case 'identified':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Identified
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Health</h2>
          <p className="text-muted-foreground">
            Monitor system performance and diagnose issues
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Operational</div>
            <p className="text-xs text-muted-foreground">All systems normal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverMetrics.responseTime}</div>
            <p className="text-xs text-muted-foreground">Avg. response time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverMetrics.uptime}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverMetrics.activeConnections}</div>
            <p className="text-xs text-muted-foreground">Current users</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="services">
            <Zap className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="errors">
            <AlertCircle className="h-4 w-4 mr-2" />
            Errors
          </TabsTrigger>
          <TabsTrigger value="logs">
            <FileText className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
        </TabsList>

        {/* System Overview */}
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
                <CardDescription>
                  Current system resource utilization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 mr-2 text-blue-600" />
                      <span>CPU Usage</span>
                    </div>
                    <span className="font-medium">{serverMetrics.cpuUsage}%</span>
                  </div>
                  <Progress value={serverMetrics.cpuUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Memory />
                      <span>Memory Usage</span>
                    </div>
                    <span className="font-medium">{serverMetrics.memoryUsage}%</span>
                  </div>
                  <Progress value={serverMetrics.memoryUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2 text-amber-600" />
                      <span>Disk Usage</span>
                    </div>
                    <span className="font-medium">{serverMetrics.diskUsage}%</span>
                  </div>
                  <Progress value={serverMetrics.diskUsage} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Server Location</p>
                    <p className="font-medium">{serverMetrics.serverLocation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Reboot</p>
                    <p className="font-medium">{serverMetrics.lastReboot}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Server Load</CardTitle>
                <CardDescription>
                  System load over the last 12 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end space-x-2 pt-4">
                  {serverMetrics.serverLoad.map((load, i) => (
                    <div
                      key={i}
                      className="bg-primary/10 hover:bg-primary/20 rounded-t flex-1"
                      style={{ height: `${load * 2}%` }}
                      title={`${load}% at ${(new Date(Date.now() - (11 - i) * 3600000)).getHours()}:00`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-2">
                  <div>12 hours ago</div>
                  <div>6 hours ago</div>
                  <div>Now</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Services Status */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>
                Current status and uptime for all system services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b">
                        <th className="py-3 px-4 text-left font-medium">Service</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Uptime</th>
                        <th className="py-3 px-4 text-left font-medium">Last Checked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceStatus.map((service, index) => (
                        <tr key={index} className={index < serviceStatus.length - 1 ? 'border-b' : ''}>
                          <td className="py-3 px-4 font-medium">{service.name}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={getStatusColor(service.status)}
                            >
                              {service.status === 'operational' ? (
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-green-600 mr-1.5"></div>
                                  Operational
                                </div>
                              ) : service.status === 'degraded' ? (
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-yellow-600 mr-1.5"></div>
                                  Degraded
                                </div>
                              ) : service.status === 'outage' ? (
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-red-600 mr-1.5"></div>
                                  Outage
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-blue-600 mr-1.5"></div>
                                  Maintenance
                                </div>
                              )}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{service.uptime}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date().toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="outline" size="sm">
                  View Detailed History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Errors */}
        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>
                System errors detected in the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b">
                        <th className="py-3 px-4 text-left font-medium">Error</th>
                        <th className="py-3 px-4 text-left font-medium">Severity</th>
                        <th className="py-3 px-4 text-left font-medium">Component</th>
                        <th className="py-3 px-4 text-left font-medium">Count</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentErrors.map((error, index) => (
                        <tr key={index} className={index < recentErrors.length - 1 ? 'border-b' : ''}>
                          <td className="py-3 px-4">
                            <div className="font-medium">{error.id}</div>
                            <div className="text-muted-foreground">{error.message}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={getSeverityColor(error.severity)}
                            >
                              {error.severity.charAt(0).toUpperCase() + error.severity.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{error.component}</td>
                          <td className="py-3 px-4">{error.count}</td>
                          <td className="py-3 px-4">
                            {getErrorStatusBadge(error.status)}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{error.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="outline" size="sm">
                  View Full Error Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Logs */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>
                Recent system logs and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b">
                        <th className="py-3 px-4 text-left font-medium">ID</th>
                        <th className="py-3 px-4 text-left font-medium">Message</th>
                        <th className="py-3 px-4 text-left font-medium">Level</th>
                        <th className="py-3 px-4 text-left font-medium">Component</th>
                        <th className="py-3 px-4 text-left font-medium">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {systemLogs.map((log, index) => (
                        <tr key={index} className={index < systemLogs.length - 1 ? 'border-b' : ''}>
                          <td className="py-3 px-4 font-mono text-xs">{log.id}</td>
                          <td className="py-3 px-4 max-w-xs truncate">{log.message}</td>
                          <td className="py-3 px-4">
                            <span className={getLogLevelColor(log.level)}>
                              {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">{log.component}</td>
                          <td className="py-3 px-4 text-muted-foreground">{log.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Showing last 6 logs of 147 total
                </div>
                <Button variant="outline" size="sm">
                  View All Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 