import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  Globe,
  Lock,
  Mail,
  Shield,
  Bell,
  Database,
  Users,
  Upload,
  Save,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage system settings and configuration
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full flex flex-wrap max-w-[600px]">
          <TabsTrigger value="general" className="flex-1">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="database" className="flex-1">
            <Database className="h-4 w-4 mr-2" />
            Data & Backup
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Site Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Site Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" defaultValue="Africanii" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-url">Site URL</Label>
                    <Input id="site-url" defaultValue="https://africanii.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea 
                    id="site-description" 
                    rows={3} 
                    defaultValue="The premier directory for finding and connecting with African businesses across the continent and diaspora."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <Switch id="maintenance-mode" />
                </div>
              </div>

              {/* Regional Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Regional Settings</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="default-language">Default Language</Label>
                    <select id="default-language" className="w-full p-2 border rounded-md">
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="ar">Arabic</option>
                      <option value="sw">Swahili</option>
                      <option value="pt">Portuguese</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select id="timezone" className="w-full p-2 border rounded-md">
                      <option value="UTC">UTC</option>
                      <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                      <option value="Africa/Cairo">Africa/Cairo (EET)</option>
                      <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                      <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <select id="date-format" className="w-full p-2 border rounded-md">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <select id="currency" className="w-full p-2 border rounded-md">
                      <option value="USD">USD ($)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="KES">KES (KSh)</option>
                      <option value="ZAR">ZAR (R)</option>
                      <option value="EGP">EGP (E£)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input id="admin-email" defaultValue="admin@africanii.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input id="support-email" defaultValue="support@africanii.com" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input id="phone" defaultValue="+1 (234) 567-8900" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Physical Address</Label>
                    <Input id="address" defaultValue="123 Business Avenue, Lagos, Nigeria" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">Reset</Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure authentication, permissions, and security options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Authentication */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentication</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-muted-foreground text-sm">
                        Require admins to use 2FA when logging in
                      </div>
                    </div>
                    <Switch id="two-factor" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Email Verification</div>
                      <div className="text-muted-foreground text-sm">
                        Require email verification for new users
                      </div>
                    </div>
                    <Switch id="email-verification" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Social Authentication</div>
                      <div className="text-muted-foreground text-sm">
                        Allow users to sign in with social media accounts
                      </div>
                    </div>
                    <Switch id="social-auth" defaultChecked />
                  </div>
                </div>
              </div>

              {/* Password Policy */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Policy</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="min-password-length">Minimum Password Length</Label>
                      <Input id="min-password-length" type="number" defaultValue="8" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                      <Input id="password-expiry" type="number" defaultValue="90" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Password Requirements</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="req-uppercase" defaultChecked />
                        <label htmlFor="req-uppercase">Require uppercase letters</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="req-numbers" defaultChecked />
                        <label htmlFor="req-numbers">Require numbers</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="req-symbols" defaultChecked />
                        <label htmlFor="req-symbols">Require special characters</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Settings</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                      <Input id="max-login-attempts" type="number" defaultValue="5" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Force Logout on Password Change</div>
                      <div className="text-muted-foreground text-sm">
                        Require users to log in again after changing their password
                      </div>
                    </div>
                    <Switch id="force-logout" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">Reset</Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Email Provider */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Provider</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email-provider">Provider</Label>
                    <select id="email-provider" className="w-full p-2 border rounded-md">
                      <option value="smtp">SMTP</option>
                      <option value="sendgrid">SendGrid</option>
                      <option value="mailchimp">Mailchimp</option>
                      <option value="aws-ses">AWS SES</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-email">From Email</Label>
                    <Input id="from-email" defaultValue="noreply@africanbusinessdirectory.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-settings">SMTP Settings</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input placeholder="SMTP Host" />
                    <Input placeholder="SMTP Port" defaultValue="587" />
                    <Input placeholder="SMTP Username" />
                    <Input type="password" placeholder="SMTP Password" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">Test Connection</Button>
                </div>
              </div>

              {/* Admin Notifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Admin Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">New User Registrations</div>
                      <div className="text-muted-foreground text-sm">
                        Receive notifications when new users register
                      </div>
                    </div>
                    <Switch id="notify-new-users" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">New Business Listings</div>
                      <div className="text-muted-foreground text-sm">
                        Receive notifications when new businesses are added
                      </div>
                    </div>
                    <Switch id="notify-new-businesses" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">User Reports</div>
                      <div className="text-muted-foreground text-sm">
                        Receive notifications for reported content
                      </div>
                    </div>
                    <Switch id="notify-reports" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Payment Notifications</div>
                      <div className="text-muted-foreground text-sm">
                        Receive notifications for payments and subscriptions
                      </div>
                    </div>
                    <Switch id="notify-payments" defaultChecked />
                  </div>
                </div>
              </div>

              {/* Email Templates */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Templates</h3>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800 border-b">
                          <th className="py-3 px-4 text-left font-medium">Template</th>
                          <th className="py-3 px-4 text-left font-medium">Status</th>
                          <th className="py-3 px-4 text-left font-medium">Last Updated</th>
                          <th className="py-3 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">Welcome Email</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Active</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">2023-06-15</td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Password Reset</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Active</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">2023-05-22</td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Business Verification</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center text-yellow-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span>Draft</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">2023-07-01</td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">Edit</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">Payment Receipt</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Active</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">2023-04-10</td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">Edit</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>
                    Add New Template
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">Reset</Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database & Backup Settings */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Data & Backup Settings</CardTitle>
              <CardDescription>
                Manage database configuration and backup options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Database Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Database Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Database Type</Label>
                    <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                      Cloud Firestore
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Project ID</Label>
                    <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                      african-business-directory-35791
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Database Status</Label>
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-800 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Connected and operational
                  </div>
                </div>
              </div>

              {/* Backup Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Backup Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Automatic Backups</div>
                      <div className="text-muted-foreground text-sm">
                        Schedule regular backups of your database
                      </div>
                    </div>
                    <Switch id="auto-backups" defaultChecked />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <select id="backup-frequency" className="w-full p-2 border rounded-md">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backup-time">Backup Time</Label>
                      <Input type="time" id="backup-time" defaultValue="02:00" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="retention-period">Retention Period (days)</Label>
                      <Input type="number" id="retention-period" defaultValue="30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storage-location">Storage Location</Label>
                      <select id="storage-location" className="w-full p-2 border rounded-md">
                        <option value="gcloud">Google Cloud Storage</option>
                        <option value="aws">Amazon S3</option>
                        <option value="local">Local Storage</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Backups */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recent Backups</h3>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800 border-b">
                          <th className="py-3 px-4 text-left font-medium">ID</th>
                          <th className="py-3 px-4 text-left font-medium">Date & Time</th>
                          <th className="py-3 px-4 text-left font-medium">Size</th>
                          <th className="py-3 px-4 text-left font-medium">Status</th>
                          <th className="py-3 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">
                            <div className="font-mono text-xs">BKP-20230710-0200</div>
                          </td>
                          <td className="py-3 px-4">July 10, 2023, 02:00 AM</td>
                          <td className="py-3 px-4">1.2 GB</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Completed</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Download</Button>
                              <Button variant="ghost" size="sm">Restore</Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">
                            <div className="font-mono text-xs">BKP-20230709-0200</div>
                          </td>
                          <td className="py-3 px-4">July 9, 2023, 02:00 AM</td>
                          <td className="py-3 px-4">1.1 GB</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Completed</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Download</Button>
                              <Button variant="ghost" size="sm">Restore</Button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">
                            <div className="font-mono text-xs">BKP-20230708-0200</div>
                          </td>
                          <td className="py-3 px-4">July 8, 2023, 02:00 AM</td>
                          <td className="py-3 px-4">1.1 GB</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Completed</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Download</Button>
                              <Button variant="ghost" size="sm">Restore</Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="default" className="flex items-center">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Database
                </Button>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 