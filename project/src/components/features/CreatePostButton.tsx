import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreatePost from './CreatePost';

const CreatePostButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-20 right-4 rounded-full w-12 h-12 shadow-lg bg-green-600 hover:bg-green-700"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Post Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg relative">
            <Button
              className="absolute -top-2 -right-2 bg-white text-gray-700 hover:bg-gray-100 p-1 rounded-full h-8 w-8 shadow-md"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            <CreatePost onPostCreated={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostButton;