import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CreatePost from '@/components/features/CreatePost';
import PostFeed from '@/components/features/PostFeed';
import InviteNeighbors from '@/components/features/InviteNeighbors';
import PinnedBusinesses from '@/components/features/PinnedBusinesses';
import CreatePostButton from '@/components/features/CreatePostButton';
import CountryFlagsBanner from '@/components/features/CountryFlagsBanner';
import { Search } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      {/* Sliding Flags Banner */}
      <div className="mb-8">
        <CountryFlagsBanner />
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for GENERAL CONTRACTOR..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content - Feed */}
        <div className="w-full lg:w-[60%]">
          {/* Value Proposition - Always visible */}
          <div className="bg-white rounded-lg p-8 shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6">Why Join Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-gray-600">Connect with African businesses</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Visibility</h3>
                <p className="text-gray-600">Increase your online presence</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Growth</h3>
                <p className="text-gray-600">Expand your network</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Join Now
            </button>
          </div>

          {/* Community Feed Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Community Feed</h2>
            {user && <CreatePost />}
            <div className="mt-6">
              <PostFeed type="community" />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[40%] space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-bold mb-4">My Posts</h3>
            {user ? (
              <PostFeed type="personal" />
            ) : (
              <p className="text-gray-600">Sign in to view your posts</p>
            )}
          </div>
          <PinnedBusinesses />
          <InviteNeighbors />
        </div>
      </div>

      <CreatePostButton />
    </div>
  );
}