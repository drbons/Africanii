import React, { useState, useRef } from 'react';
import { X, Edit2, Film, Image, LinkIcon } from 'lucide-react';
import { Button } from './button';

export interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  previewUrl: string;
}

export interface MediaUploaderProps {
  onMediaChange: (media: MediaFile[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
}

export function MediaUploader({
  onMediaChange,
  maxFiles = 4,
  acceptedFileTypes = 'image/*,video/*'
}: MediaUploaderProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [activePreview, setActivePreview] = useState<MediaFile | null>(null);
  const [linkPreview, setLinkPreview] = useState<{url: string, title: string, image: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files).slice(0, maxFiles - mediaFiles.length);
    
    Promise.all(
      newFiles.map(file => {
        return new Promise<MediaFile>((resolve) => {
          const reader = new FileReader();
          const id = Math.random().toString(36).substring(2, 15);
          
          reader.onloadend = () => {
            resolve({
              id,
              file,
              type: file.type.startsWith('image/') ? 'image' : 'video',
              previewUrl: reader.result as string
            });
          };
          
          reader.readAsDataURL(file);
        });
      })
    ).then(files => {
      const updatedFiles = [...mediaFiles, ...files].slice(0, maxFiles);
      setMediaFiles(updatedFiles);
      onMediaChange(updatedFiles);
      
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    
    const fileList = e.dataTransfer.files;
    const files = Array.from(fileList);
    
    // Convert to our format and generate previews
    Promise.all(
      files.slice(0, maxFiles - mediaFiles.length).map(file => {
        return new Promise<MediaFile>((resolve) => {
          const reader = new FileReader();
          const id = Math.random().toString(36).substring(2, 15);
          
          reader.onloadend = () => {
            resolve({
              id,
              file,
              type: file.type.startsWith('image/') ? 'image' : 'video',
              previewUrl: reader.result as string
            });
          };
          
          reader.readAsDataURL(file);
        });
      })
    ).then(files => {
      const updatedFiles = [...mediaFiles, ...files].slice(0, maxFiles);
      setMediaFiles(updatedFiles);
      onMediaChange(updatedFiles);
    });
  };

  const removeFile = (id: string) => {
    const updatedFiles = mediaFiles.filter(file => file.id !== id);
    setMediaFiles(updatedFiles);
    onMediaChange(updatedFiles);
    
    if (activePreview && activePreview.id === id) {
      setActivePreview(null);
    }
  };

  const handleLinkPreview = async () => {
    const url = linkInputRef.current?.value || '';
    if (!url) return;
    
    try {
      // In a real application, you would call an API to fetch link metadata
      // This is a mock response
      setLinkPreview({
        url,
        title: "Link Preview Title",
        image: "https://via.placeholder.com/300x200"
      });
      
      // Clear the input
      if (linkInputRef.current) {
        linkInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error fetching link preview:', error);
    }
  };
  
  const removeLinkPreview = () => {
    setLinkPreview(null);
  };

  return (
    <div className="space-y-2">
      {/* Media Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-md p-4 transition-colors ${
          dragging ? 'border-green-500 bg-green-50' : 'border-gray-300'
        } ${mediaFiles.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center p-4">
          <div className="flex space-x-2 mb-2">
            <Image className="w-5 h-5 text-gray-400" />
            <Film className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Drag and drop media files, or
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept={acceptedFileTypes}
            onChange={handleFileSelect}
            disabled={mediaFiles.length >= maxFiles}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={mediaFiles.length >= maxFiles}
          >
            Browse files
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            Maximum {maxFiles} files (images or videos)
          </p>
        </div>
      </div>
      
      {/* Link Input */}
      <div className="flex items-center space-x-2">
        <input
          ref={linkInputRef}
          type="text"
          placeholder="Paste a link to add preview"
          className="flex-1 px-3 py-2 border rounded-md text-sm"
        />
        <Button 
          type="button"
          size="sm"
          variant="outline"
          onClick={handleLinkPreview}
        >
          <LinkIcon className="w-4 h-4 mr-1" />
          Preview
        </Button>
      </div>
      
      {/* Link Preview */}
      {linkPreview && (
        <div className="border rounded-md p-2 relative">
          <div className="flex">
            {linkPreview.image && (
              <img 
                src={linkPreview.image} 
                alt="Link preview" 
                className="w-16 h-16 object-cover rounded-md mr-2"
              />
            )}
            <div>
              <h4 className="font-medium text-sm">{linkPreview.title}</h4>
              <p className="text-xs text-gray-500 truncate">{linkPreview.url}</p>
            </div>
          </div>
          <button
            type="button"
            className="absolute top-1 right-1 p-1 bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={removeLinkPreview}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      
      {/* Media Previews */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {mediaFiles.map((media) => (
            <div 
              key={media.id} 
              className="relative border rounded-md overflow-hidden group"
            >
              {media.type === 'image' ? (
                <img 
                  src={media.previewUrl} 
                  alt="Preview" 
                  className="w-full h-20 object-cover"
                />
              ) : (
                <div className="w-full h-20 bg-gray-100 flex items-center justify-center">
                  <Film className="w-6 h-6 text-gray-400" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  className="p-1 bg-white rounded-full mx-1"
                  onClick={() => setActivePreview(media)}
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  className="p-1 bg-white rounded-full mx-1"
                  onClick={() => removeFile(media.id)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Edit Modal (simplified for now) */}
      {activePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">Edit Media</h3>
              <button onClick={() => setActivePreview(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              {activePreview.type === 'image' ? (
                <img 
                  src={activePreview.previewUrl} 
                  alt="Preview" 
                  className="max-h-[50vh] mx-auto"
                />
              ) : (
                <video 
                  src={activePreview.previewUrl} 
                  controls
                  className="max-h-[50vh] mx-auto"
                />
              )}
            </div>
            
            <div className="p-4 border-t flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setActivePreview(null)}
              >
                Cancel
              </Button>
              <Button onClick={() => setActivePreview(null)}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaUploader; 