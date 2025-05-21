import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { doc, setDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Upload, Calendar, Clock, MapPin, DollarSign, Link as LinkIcon, Share2, Eye, CreditCard } from 'lucide-react';

// Type definitions
interface TicketTier {
  id: string;
  name: string;
  price: number;
  availableQuantity: number;
  description: string;
}

interface EventData {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  category: string;
  isFree: boolean;
  ticketTiers?: TicketTier[];
  paymentMethods: {
    zelle: boolean;
    cashApp: boolean;
  };
  zelleInfo?: string;
  cashAppInfo?: string;
  externalRegistration: boolean;
  externalRegistrationLink?: string;
  visibility: 'public' | 'private' | 'invitation';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [virtualLink, setVirtualLink] = useState('');
  const [category, setCategory] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([]);
  const [newTierName, setNewTierName] = useState('');
  const [newTierPrice, setNewTierPrice] = useState('');
  const [newTierQuantity, setNewTierQuantity] = useState('');
  const [newTierDescription, setNewTierDescription] = useState('');
  const [payWithZelle, setPayWithZelle] = useState(false);
  const [payWithCashApp, setPayWithCashApp] = useState(false);
  const [zelleInfo, setZelleInfo] = useState('');
  const [cashAppInfo, setCashAppInfo] = useState('');
  const [externalRegistration, setExternalRegistration] = useState(false);
  const [externalRegistrationLink, setExternalRegistrationLink] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'invitation'>('public');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const EVENT_CATEGORIES = [
    'Networking',
    'Workshop',
    'Conference',
    'Seminar',
    'Expo',
    'Fundraiser',
    'Cultural',
    'Social',
    'Educational',
    'Other'
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addTicketTier = () => {
    if (!newTierName || !newTierPrice || !newTierQuantity) return;
    
    const price = parseFloat(newTierPrice);
    const quantity = parseInt(newTierQuantity);
    
    if (isNaN(price) || price < 0) {
      setError('Please enter a valid price');
      return;
    }
    
    if (isNaN(quantity) || quantity < 1) {
      setError('Please enter a valid quantity');
      return;
    }
    
    const newTier: TicketTier = {
      id: Date.now().toString(),
      name: newTierName,
      price,
      availableQuantity: quantity,
      description: newTierDescription
    };
    
    setTicketTiers([...ticketTiers, newTier]);
    setNewTierName('');
    setNewTierPrice('');
    setNewTierQuantity('');
    setNewTierDescription('');
  };

  const removeTicketTier = (id: string) => {
    setTicketTiers(ticketTiers.filter(tier => tier.id !== id));
  };

  const validateStep1 = () => {
    if (!title.trim()) {
      setError('Event title is required');
      return false;
    }
    if (!description.trim()) {
      setError('Event description is required');
      return false;
    }
    if (!imageFile) {
      setError('Event cover image is required');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!date) {
      setError('Event date is required');
      return false;
    }
    if (!time) {
      setError('Event start time is required');
      return false;
    }
    if (!location.trim() && !isVirtual) {
      setError('Event location is required');
      return false;
    }
    if (isVirtual && !virtualLink.trim()) {
      setError('Virtual event link is required');
      return false;
    }
    if (!category) {
      setError('Event category is required');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!isFree && ticketTiers.length === 0) {
      setError('At least one ticket tier is required for paid events');
      return false;
    }
    if (!isFree && !externalRegistration && !payWithZelle && !payWithCashApp) {
      setError('At least one payment method is required for paid events');
      return false;
    }
    if (payWithZelle && !zelleInfo.trim()) {
      setError('Zelle information is required');
      return false;
    }
    if (payWithCashApp && !cashAppInfo.trim()) {
      setError('Cash App information is required');
      return false;
    }
    if (externalRegistration && !externalRegistrationLink.trim()) {
      setError('External registration link is required');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (!user) {
      setError('You must be logged in to create an event');
      setLoading(false);
      return;
    }

    try {
      // Upload image first
      let imageUrl = '';
      if (imageFile) {
        try {
          // Simple path with no special characters
          const storageRef = ref(storage, `images/${Date.now()}.jpg`);
          
          // Upload the file
          const snapshot = await uploadBytes(storageRef, imageFile);
          
          // Get the download URL
          imageUrl = await getDownloadURL(snapshot.ref);
        } catch (uploadError: any) {
          console.error('Error uploading image:', uploadError);
          setError(`Upload error: ${uploadError.message || 'Failed to upload image'}`);
          setLoading(false);
          return;
        }
      }

      // Create event object
      const eventId = crypto.randomUUID();
      const eventData: EventData = {
        id: eventId,
        title,
        description,
        imageUrl,
        date,
        time,
        endTime: endTime || "",
        location,
        isVirtual,
        virtualLink: isVirtual && virtualLink ? virtualLink : "",
        category,
        isFree,
        ticketTiers: !isFree ? (ticketTiers.length > 0 ? ticketTiers : []) : [],
        paymentMethods: {
          zelle: payWithZelle,
          cashApp: payWithCashApp
        },
        zelleInfo: payWithZelle ? zelleInfo : "",
        cashAppInfo: payWithCashApp ? cashAppInfo : "",
        externalRegistration,
        externalRegistrationLink: externalRegistration ? externalRegistrationLink : "",
        visibility,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      await setDoc(doc(db, 'events', eventId), eventData);

      // Navigate back to events page
      navigate('/events');
    } catch (error: any) {
      console.error('Error creating event:', error);
      setError(`Create event error: ${error?.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-lg border-t-4 border-t-indigo-500">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Create Event</CardTitle>
          <CardDescription className="text-center">
            Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Date, Time & Location' : 'Tickets & Registration'}
          </CardDescription>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a clear, descriptive title"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="description">Event Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event, what attendees can expect, etc."
                  rows={5}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="image" className="block mb-2">Cover Image</Label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Event preview"
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById('image')?.click()}
                      disabled={loading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">Recommended size: 1200 x 630 pixels</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date, Time & Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Event Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={loading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="time" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Start Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endTime" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  End Time (Optional)
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Event Type
                </Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isVirtual}
                      onChange={() => setIsVirtual(false)}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span>In-Person</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isVirtual}
                      onChange={() => setIsVirtual(true)}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span>Virtual</span>
                  </label>
                </div>
              </div>

              {!isVirtual ? (
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter venue address"
                    disabled={loading}
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="virtualLink">Virtual Event Link</Label>
                  <Input
                    id="virtualLink"
                    value={virtualLink}
                    onChange={(e) => setVirtualLink(e.target.value)}
                    placeholder="Zoom, Google Meet, or other platform link"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Link will be shared with registered attendees</p>
                </div>
              )}

              <div>
                <Label htmlFor="category">Event Category</Label>
                <Select value={category} onValueChange={setCategory} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Tickets & Registration */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Pricing
                </Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isFree}
                      onChange={() => setIsFree(true)}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span>Free Event</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isFree}
                      onChange={() => setIsFree(false)}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span>Paid Event</span>
                  </label>
                </div>
              </div>

              {!isFree && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <Label>Ticket Tiers</Label>
                  
                  {ticketTiers.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {ticketTiers.map((tier) => (
                        <div key={tier.id} className="flex items-center justify-between border p-3 rounded">
                          <div>
                            <p className="font-medium">{tier.name}</p>
                            <p className="text-sm text-gray-600">${tier.price.toFixed(2)} • {tier.availableQuantity} available</p>
                            <p className="text-xs text-gray-500">{tier.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTicketTier(tier.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tierName">Ticket Name</Label>
                      <Input
                        id="tierName"
                        value={newTierName}
                        onChange={(e) => setNewTierName(e.target.value)}
                        placeholder="E.g., General Admission"
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tierPrice">Price ($)</Label>
                      <Input
                        id="tierPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newTierPrice}
                        onChange={(e) => setNewTierPrice(e.target.value)}
                        placeholder="0.00"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tierQuantity">Available Quantity</Label>
                      <Input
                        id="tierQuantity"
                        type="number"
                        min="1"
                        value={newTierQuantity}
                        onChange={(e) => setNewTierQuantity(e.target.value)}
                        placeholder="Number of tickets"
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tierDescription">Description (Optional)</Label>
                      <Input
                        id="tierDescription"
                        value={newTierDescription}
                        onChange={(e) => setNewTierDescription(e.target.value)}
                        placeholder="Perks, restrictions, etc."
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTicketTier}
                    disabled={loading || !newTierName || !newTierPrice || !newTierQuantity}
                    className="mt-2"
                  >
                    Add Ticket Tier
                  </Button>
                </div>
              )}

              {!isFree && (
                <div className="space-y-4">
                  <Label className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Label>
                  
                  <div className="space-y-3">
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={payWithZelle}
                        onChange={() => setPayWithZelle(!payWithZelle)}
                        className="h-4 w-4 mt-1 text-indigo-600"
                      />
                      <div className="flex-1">
                        <span className="font-medium">Zelle</span>
                        {payWithZelle && (
                          <Input
                            value={zelleInfo}
                            onChange={(e) => setZelleInfo(e.target.value)}
                            placeholder="Your Zelle email or phone number"
                            className="mt-2"
                            disabled={loading}
                          />
                        )}
                      </div>
                    </label>
                    
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={payWithCashApp}
                        onChange={() => setPayWithCashApp(!payWithCashApp)}
                        className="h-4 w-4 mt-1 text-indigo-600"
                      />
                      <div className="flex-1">
                        <span className="font-medium">Cash App</span>
                        {payWithCashApp && (
                          <Input
                            value={cashAppInfo}
                            onChange={(e) => setCashAppInfo(e.target.value)}
                            placeholder="Your $Cashtag"
                            className="mt-2"
                            disabled={loading}
                          />
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={externalRegistration}
                    onChange={() => setExternalRegistration(!externalRegistration)}
                    className="h-4 w-4 mt-1 text-indigo-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      <span className="font-medium">Use External Registration Platform</span>
                    </div>
                    {externalRegistration && (
                      <Input
                        value={externalRegistrationLink}
                        onChange={(e) => setExternalRegistrationLink(e.target.value)}
                        placeholder="Eventbrite, Meetup, or other registration link"
                        className="mt-2"
                        disabled={loading}
                      />
                    )}
                  </div>
                </label>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Event Visibility
                </Label>
                <Select 
                  value={visibility} 
                  onValueChange={(val: 'public' | 'private' | 'invitation') => setVisibility(val)} 
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can find this event</SelectItem>
                    <SelectItem value="private">Private - Only visible to community members</SelectItem>
                    <SelectItem value="invitation">Invitation Only - Only those with the link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrevStep}
                disabled={loading}
              >
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button 
              type="button" 
              onClick={handleNextStep}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                step < 3 ? 'Next' : 'Create Event'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 