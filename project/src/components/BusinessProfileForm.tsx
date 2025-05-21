import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Upload } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Progress } from '@/components/ui/progress';

export interface BusinessProfile {
  name: string;
  category: string;
  address: string;
  phone: string;
  description: string;
  imageUrl?: string;
}

interface BusinessProfileFormProps {
  onSubmit: (profile: BusinessProfile) => Promise<void>;
  initialData?: BusinessProfile;
  isEditing?: boolean;
}

const BUSINESS_CATEGORIES = [
  'Retail',
  'Restaurant',
  'Professional Services',
  'Technology',
  'Healthcare',
  'Construction',
  'Education',
  'Entertainment',
  'Manufacturing',
  'Transportation',
  'Real Estate',
  'Other'
];

// Image compression utility
const compressImage = (file: File, quality = 0.7): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Skip compression for small images (< 300KB)
    if (file.size < 300 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Calculate new dimensions (max 1200px width/height)
        let width = img.width;
        let height = img.height;
        const maxSize = 1200;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to Blob then File
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            // Create a new file with the same name
            const newFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            resolve(newFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};

export default function BusinessProfileForm({ onSubmit, initialData, isEditing = false }: BusinessProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [businessName, setBusinessName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview immediately for better UX
      setImagePreview(URL.createObjectURL(file));
      
      try {
        // Show compression status
        setIsCompressing(true);
        
        // Compress image in background
        const compressedFile = await compressImage(file);
        
        setImageFile(compressedFile);
        console.log(`Image compressed: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB`);
      } catch (err) {
        console.warn('Image compression failed, using original:', err);
        setImageFile(file);
      } finally {
        setIsCompressing(false);
      }
    }
  }, []);

  const validateForm = () => {
    if (!businessName.trim()) {
      setError('Business name is required');
      return false;
    }
    if (!category) {
      setError('Please select a business category');
      return false;
    }
    if (!address.trim()) {
      setError('Business address is required');
      return false;
    }
    if (!phone.trim()) {
      setError('Business phone number is required');
      return false;
    }
    if (!description.trim()) {
      setError('Business description is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      let imageUrl = initialData?.imageUrl || '';

      // Handle image upload if there's a new image file
      if (imageFile) {
        try {
          setUploadProgress(10);
          
          // Generate a unique filename
          const timestamp = Date.now();
          const fileExtension = imageFile.name.split('.').pop();
          const filename = `${timestamp}.${fileExtension || 'jpg'}`;
          
          // Use the correct storage path
          const storageRef = ref(storage, `businessImages/${filename}`);
          
          // Upload the file with proper metadata
          const metadata = {
            contentType: imageFile.type,
            customMetadata: {
              'uploaded-by': 'web-app',
              'cache-control': 'public,max-age=31536000'
            }
          };
          
          // Upload with metadata
          setUploadProgress(30);
          const snapshot = await uploadBytes(storageRef, imageFile, metadata);
          setUploadProgress(70);
          
          // Get the download URL
          imageUrl = await getDownloadURL(snapshot.ref);
          setUploadProgress(100);
          
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          setError('Failed to upload image. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Create the business profile object
      const businessProfile: BusinessProfile = {
        name: businessName,
        category,
        address,
        phone,
        description,
        imageUrl
      };

      // Try to submit the profile
      try {
        await onSubmit(businessProfile);
        // Don't need to call setLoading(false) if we're navigating away
      } catch (submitError: any) {
        console.error('Error submitting business profile:', submitError);
        setError(submitError?.message || 'Failed to save business profile. Please try again.');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Unexpected error in form submission:', error);
      setError(error?.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-t-4 border-t-blue-500">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          {isEditing ? 'Edit Business Profile' : 'Create Business Profile'}
        </CardTitle>
        <CardDescription className="text-center">
          {isEditing ? 'Update your business information' : 'Tell us about your business'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="category">Business Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your business address"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="phone">Business Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your business phone number"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your business..."
              rows={4}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="businessImage">Business Image</Label>
            <div className="mt-1 flex flex-col gap-2">
              {(imagePreview || initialData?.imageUrl) && (
                <div className="relative mb-2 overflow-hidden rounded-lg aspect-video max-h-64 bg-gray-100">
                  <img 
                    src={imagePreview || initialData?.imageUrl}
                    alt="Business preview" 
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              
              {isCompressing && (
                <div className="text-sm text-amber-600 mb-2 flex items-center">
                  <span className="mr-2">Optimizing image...</span>
                  <Progress value={50} className="h-2 w-24" />
                </div>
              )}
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="text-sm text-blue-600 mb-2">
                  <span>Uploading image...</span>
                  <Progress value={uploadProgress} className="h-2 mt-1" />
                </div>
              )}
              
              <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-500" />
                  <span className="mt-2 text-sm font-medium text-gray-700">
                    Click to upload image
                  </span>
                  <span className="mt-1 text-xs text-gray-400">
                    PNG, JPG, WEBP up to 5MB
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={loading}
                  />
                </label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : (
              isEditing ? 'Update Business Profile' : 'Create Business Profile'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}