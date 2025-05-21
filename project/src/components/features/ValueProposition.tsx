import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Globe } from 'lucide-react';

export default function ValueProposition() {
  const features = [
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with African businesses and entrepreneurs'
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'Expand your network and grow your business'
    },
    {
      icon: Globe,
      title: 'Visibility',
      description: 'Increase your online presence and reach'
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Why Join Our Community?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}