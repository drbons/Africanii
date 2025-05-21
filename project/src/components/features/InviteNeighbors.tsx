import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import ShareInviteDialog from './ShareInviteDialog';

export default function InviteNeighbors() {
  const [showShareDialog, setShowShareDialog] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Invite Business Owners</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Know other African business owners? Invite them to join our community!
        </p>
        <Button 
          className="w-full bg-green-600 hover:bg-green-700" 
          onClick={() => setShowShareDialog(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Send Invites
        </Button>

        {/* Share dialog */}
        <ShareInviteDialog 
          isOpen={showShareDialog} 
          onClose={() => setShowShareDialog(false)} 
        />
      </CardContent>
    </Card>
  );
}