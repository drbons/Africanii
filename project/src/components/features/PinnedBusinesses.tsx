import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function PinnedBusinesses() {
  const pinnedBusinesses = [
    {
      id: '1',
      name: 'African Cuisine Restaurant',
      category: 'Restaurant',
      location: 'Atlanta, GA'
    },
    {
      id: '2',
      name: 'Afro Beauty Salon',
      category: 'Beauty',
      location: 'Houston, TX'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Featured Businesses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pinnedBusinesses.map((business) => (
            <div key={business.id} className="flex items-start space-x-3">
              <Star className="w-4 h-4 text-yellow-400 mt-1" />
              <div>
                <h3 className="font-medium">{business.name}</h3>
                <p className="text-sm text-gray-600">
                  {business.category} • {business.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}