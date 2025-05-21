import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, MapPin, Phone, Building2, WifiOff, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { profile, isOffline, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      // Populate form with existing profile data
      setFullName(profile.fullName || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setCity(profile.city || '');
      setState(profile.state || '');
      setBusinessName(profile.businessProfiles?.[0]?.name || '');
      setBusinessAddress(profile.businessProfiles?.[0]?.address || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isOffline) {
        throw new Error('Cannot update profile while offline');
      }

      await updateProfile({
        fullName,
        email,
        phone,
        city,
        state,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/'; // Redirect to home page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCreateBusiness = () => {
    navigate('/create-business');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {isOffline && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <WifiOff className="h-5 w-5 text-yellow-500" />
          <span className="text-yellow-700">
            You are currently offline. Some features may be limited.
          </span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <div className="space-x-4">
          {profile?.role !== 'business' && (
            <Button
              onClick={handleCreateBusiness}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Business Profile
            </Button>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="pl-10"
                      placeholder="City"
                    />
                    <Input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading || isOffline}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {profile?.businessProfiles?.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Business Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.businessProfiles.map((business, index) => (
              <div key={business.id} className="border-b last:border-0 py-4">
                <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
                <p className="text-gray-600">{business.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>{business.address}</p>
                  <p>Category: {business.category}</p>
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate(`/edit-business/${business.id}`)}
                >
                  Edit Business Profile
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}