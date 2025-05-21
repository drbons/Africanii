import React, { useState } from 'react';
import { collection, doc, setDoc, addDoc, getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Sample data to upload
const sampleBusinessProfiles = [
  {
    name: 'African Kitchen',
    category: 'Food & Restaurant',
    description: 'Authentic African cuisine restaurant offering dishes from across the continent.',
    address: '123 Main St, Atlanta, GA 30303',
    phone: '+1 (404) 555-1234',
    email: 'info@africankitchen.com',
    website: 'https://www.africankitchen.com',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=AfricanKitchen',
    coverImageUrl: 'https://source.unsplash.com/random/1000x300/?african,food',
    location: {
      lat: 33.7488,
      lng: -84.3877
    },
    hours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 10:00 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '12:00 PM - 11:00 PM',
      sunday: '12:00 PM - 9:00 PM'
    },
    rating: 4.7,
    reviews: 128,
    tags: ['African cuisine', 'Restaurant', 'Catering']
  },
  {
    name: 'AfriTech Solutions',
    category: 'Technology',
    description: 'Software development and IT consulting firm specializing in African market solutions.',
    address: '456 Tech Blvd, Houston, TX 77002',
    phone: '+1 (713) 555-6789',
    email: 'contact@afritechsolutions.com',
    website: 'https://www.afritechsolutions.com',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=AfriTech',
    coverImageUrl: 'https://source.unsplash.com/random/1000x300/?technology,office',
    location: {
      lat: 29.7604,
      lng: -95.3698
    },
    hours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    rating: 4.9,
    reviews: 56,
    tags: ['Technology', 'Software Development', 'IT Consulting']
  },
  {
    name: 'AfriWear Fashions',
    category: 'Retail & Fashion',
    description: 'African-inspired clothing and accessories for modern fashion enthusiasts.',
    address: '789 Fashion Ave, Chicago, IL 60611',
    phone: '+1 (312) 555-9012',
    email: 'sales@afriwear.com',
    website: 'https://www.afriwearfashions.com',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=AfriWear',
    coverImageUrl: 'https://source.unsplash.com/random/1000x300/?fashion,african',
    location: {
      lat: 41.8781,
      lng: -87.6298
    },
    hours: {
      monday: '10:00 AM - 8:00 PM',
      tuesday: '10:00 AM - 8:00 PM',
      wednesday: '10:00 AM - 8:00 PM',
      thursday: '10:00 AM - 8:00 PM',
      friday: '10:00 AM - 9:00 PM',
      saturday: '10:00 AM - 9:00 PM',
      sunday: '11:00 AM - 6:00 PM'
    },
    rating: 4.5,
    reviews: 89,
    tags: ['Fashion', 'African clothing', 'Accessories']
  }
];

const sampleUserProfiles = [
  {
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    role: 'seller',
    phone: '+1 (404) 555-5678',
    city: 'Atlanta',
    state: 'GA',
    businessId: 'business1',
    createdAt: new Date().toISOString()
  },
  {
    email: 'sarah.smith@example.com',
    fullName: 'Sarah Smith',
    role: 'seller',
    phone: '+1 (713) 555-8901',
    city: 'Houston',
    state: 'TX',
    businessId: 'business2',
    createdAt: new Date().toISOString()
  },
  {
    email: 'michael.johnson@example.com',
    fullName: 'Michael Johnson',
    role: 'seller',
    phone: '+1 (312) 555-2345',
    city: 'Chicago',
    state: 'IL',
    businessId: 'business3',
    createdAt: new Date().toISOString()
  },
  {
    email: 'emma.wilson@example.com',
    fullName: 'Emma Wilson',
    role: 'buyer',
    phone: '+1 (213) 555-6789',
    city: 'Los Angeles',
    state: 'CA',
    createdAt: new Date().toISOString()
  }
];

// Sample posts data
const samplePosts = [
  {
    content: 'Just launched my new African cuisine restaurant in Atlanta!',
    author: {
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    timestamp: new Date().toISOString(),
    likes: 24,
    comments: 5,
    type: 'community',
    location: 'Atlanta, GA',
    tags: ['Atlanta', 'AfricanCuisine', 'Restaurant']
  },
  {
    content: 'Looking for African fabric suppliers in Houston area. Any recommendations?',
    author: {
      name: 'Sarah Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    timestamp: new Date().toISOString(),
    likes: 15,
    comments: 8,
    type: 'personal',
    location: 'Houston, TX',
    tags: ['Houston', 'AfricanFabrics', 'Suppliers']
  },
  {
    content: 'Excited to announce our new African art gallery opening next month in Chicago!',
    author: {
      name: 'Michael Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    },
    timestamp: new Date().toISOString(),
    likes: 32,
    comments: 12,
    type: 'community',
    location: 'Chicago, IL',
    tags: ['Chicago', 'AfricanArt', 'Gallery']
  }
];

const sampleImages = [
  {
    url: 'https://source.unsplash.com/random/800x600/?african,restaurant',
    path: 'business_images/african_kitchen_1.jpg'
  },
  {
    url: 'https://source.unsplash.com/random/800x600/?african,food',
    path: 'business_images/african_kitchen_2.jpg'
  },
  {
    url: 'https://source.unsplash.com/random/800x600/?technology,office',
    path: 'business_images/afritech_1.jpg'
  },
  {
    url: 'https://source.unsplash.com/random/800x600/?computer,code',
    path: 'business_images/afritech_2.jpg'
  },
  {
    url: 'https://source.unsplash.com/random/800x600/?fashion,african',
    path: 'business_images/afriwear_1.jpg'
  },
  {
    url: 'https://source.unsplash.com/random/800x600/?clothing,store',
    path: 'business_images/afriwear_2.jpg'
  }
];

// Function to fetch an image as a data URL
async function fetchImageAsDataURL(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export default function AdminToolsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('database');

  const uploadBusinesses = async () => {
    try {
      setLoading(true);
      setProgress(0);
      setError(null);
      setSuccess(null);

      const db = getFirestore();
      const businessesCollection = collection(db, 'businesses');

      // Upload each business
      for (let i = 0; i < sampleBusinessProfiles.length; i++) {
        const business = sampleBusinessProfiles[i];
        const businessId = `business${i + 1}`;
        await setDoc(doc(businessesCollection, businessId), business);
        
        // Update progress
        setProgress(((i + 1) / sampleBusinessProfiles.length) * 100);
      }

      setSuccess('Businesses uploaded successfully!');
    } catch (err: any) {
      setError(`Error uploading businesses: ${err.message}`);
      console.error('Error uploading businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadProfiles = async () => {
    try {
      setLoading(true);
      setProgress(0);
      setError(null);
      setSuccess(null);

      const db = getFirestore();
      const profilesCollection = collection(db, 'profiles');

      // Upload each profile
      for (let i = 0; i < sampleUserProfiles.length; i++) {
        const profile = sampleUserProfiles[i];
        const userId = `user${i + 1}`;
        await setDoc(doc(profilesCollection, userId), profile);
        
        // Update progress
        setProgress(((i + 1) / sampleUserProfiles.length) * 100);
      }

      setSuccess('User profiles uploaded successfully!');
    } catch (err: any) {
      setError(`Error uploading profiles: ${err.message}`);
      console.error('Error uploading profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadPosts = async () => {
    try {
      setLoading(true);
      setProgress(0);
      setError(null);
      setSuccess(null);

      const db = getFirestore();
      const postsCollection = collection(db, 'posts');

      // Upload each post
      for (let i = 0; i < samplePosts.length; i++) {
        const post = samplePosts[i];
        await addDoc(postsCollection, post);
        
        // Update progress
        setProgress(((i + 1) / samplePosts.length) * 100);
      }

      setSuccess('Posts uploaded successfully!');
    } catch (err: any) {
      setError(`Error uploading posts: ${err.message}`);
      console.error('Error uploading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async () => {
    try {
      setLoading(true);
      setProgress(0);
      setError(null);
      setSuccess(null);

      const storage = getStorage();
      const db = getFirestore();
      const imagesCollection = collection(db, 'images');

      // Upload each image
      for (let i = 0; i < sampleImages.length; i++) {
        const image = sampleImages[i];
        
        // Fetch image as data URL
        const dataUrl = await fetchImageAsDataURL(image.url);
        
        // Upload to Firebase Storage
        const storageRef = ref(storage, image.path);
        await uploadString(storageRef, dataUrl, 'data_url');
        
        // Get download URL
        const downloadUrl = await getDownloadURL(storageRef);
        
        // Save reference to Firestore
        await addDoc(imagesCollection, {
          path: image.path,
          url: downloadUrl,
          createdAt: new Date().toISOString()
        });
        
        // Update progress
        setProgress(((i + 1) / sampleImages.length) * 100);
      }

      setSuccess('Images uploaded successfully!');
    } catch (err: any) {
      setError(`Error uploading images: ${err.message}`);
      console.error('Error uploading images:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadAll = async () => {
    try {
      setLoading(true);
      setProgress(0);
      setError(null);
      setSuccess(null);

      // Upload businesses (25%)
      await uploadBusinesses();
      setProgress(25);

      // Upload profiles (50%)
      await uploadProfiles();
      setProgress(50);

      // Upload posts (75%)
      await uploadPosts();
      setProgress(75);

      // Upload images (100%)
      await uploadImages();
      setProgress(100);

      setSuccess('All data uploaded successfully!');
    } catch (err: any) {
      setError(`Error during upload: ${err.message}`);
      console.error('Error during upload:', err);
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in or not an admin, show access denied
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You must be logged in to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Tools</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="database">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Sample Data</CardTitle>
                <CardDescription>
                  Upload sample business profiles, user accounts, and posts to the Firebase database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Button onClick={uploadBusinesses} disabled={loading}>
                    Upload Businesses
                  </Button>
                  <Button onClick={uploadProfiles} disabled={loading}>
                    Upload Profiles
                  </Button>
                  <Button onClick={uploadPosts} disabled={loading}>
                    Upload Posts
                  </Button>
                  <Button onClick={uploadAll} disabled={loading} variant="default">
                    Upload All Data
                  </Button>
                </div>

                {loading && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Uploading... {Math.round(progress)}%</p>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mt-4">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Upload Sample Images</CardTitle>
              <CardDescription>
                Upload sample images to Firebase Storage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={uploadImages} disabled={loading}>
                Upload Sample Images
              </Button>

              {loading && (
                <div className="my-4">
                  <p className="text-sm text-muted-foreground mb-2">Uploading... {Math.round(progress)}%</p>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 