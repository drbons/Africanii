import React from 'react';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Business Profile Updated',
      message: 'Your business profile has been successfully updated.',
      time: '2 hours ago',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'alert',
      title: 'New Message',
      message: 'You have received a new message from John Doe.',
      time: '4 hours ago',
      icon: Bell
    },
    {
      id: 3,
      type: 'info',
      title: 'Event Reminder',
      message: 'Upcoming networking event tomorrow at 6 PM.',
      time: '1 day ago',
      icon: Info
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Notifications</h1>
        <p className="text-gray-600">Stay updated with your latest activities and alerts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`
                  p-2 rounded-full
                  ${notification.type === 'success' ? 'bg-green-100 text-green-600' : ''}
                  ${notification.type === 'alert' ? 'bg-red-100 text-red-600' : ''}
                  ${notification.type === 'info' ? 'bg-blue-100 text-blue-600' : ''}
                `}>
                  <notification.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  <p className="text-gray-600">{notification.message}</p>
                  <span className="text-sm text-gray-500">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}