import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import BusinessProfileForm from '@/components/BusinessProfileForm';
import type { BusinessProfile } from '@/hooks/useAuth';

export default function CreateBusinessPage() {
  const navigate = useNavigate();
  const { addBusinessProfile, profile } = useAuth();

  // Guard: redirect general users away from this page
  useEffect(() => {
    const role = profile?.role as string | undefined;
    // Redirect if user is not a business user
    if (profile && role !== 'business' && role !== 'seller') {
      navigate('/profile');
    }
  }, [profile, navigate]);

  const handleSubmit = async (businessProfile: Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addBusinessProfile(businessProfile);
      navigate('/profile');
    } catch (error) {
      console.error('Error creating business profile:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BusinessProfileForm onSubmit={handleSubmit} isEditing={false} />
    </div>
  );
} 