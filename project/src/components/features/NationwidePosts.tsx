import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function NationwidePosts() {
  const posts = [
    {
      id: 1,
      title: 'African Restaurant Opening',
      location: 'Atlanta, GA',
      description: 'New authentic African cuisine restaurant opening next week!'
    },
    {
      id: 2,
      title: 'Business Networking Event',
      location: 'Houston, TX',
      description: 'Join us for our monthly African business networking event'
    },
    {
      id: 3,
      title: 'Cultural Festival',
      location: 'Chicago, IL',
      description: 'Annual African cultural festival and business expo'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nationwide Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="border-b last:border-0 pb-4 last:pb-0">
              <h3 className="font-medium">{post.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {post.location}
              </div>
              <p className="text-sm mt-1">{post.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}