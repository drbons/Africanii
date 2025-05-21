import React, { useState, useEffect, useRef } from 'react';
import { Smile } from 'lucide-react';
import { Button } from './button';

// Common emoji categories
const emojiCategories = [
  {
    name: 'Smileys',
    emojis: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '🥰', '😘']
  },
  {
    name: 'People',
    emojis: ['👋', '👍', '👎', '✌️', '🤞', '🫶', '👏', '🙌', '👆', '👇', '👈', '👉', '🫵', '🙏', '🤝']
  },
  {
    name: 'Food',
    emojis: ['🍎', '🍕', '🍔', '🍟', '🍩', '🍦', '🍫', '🍿', '🍱', '🍲', '🍳', '🍺', '🍷', '🥂', '🧋']
  },
  {
    name: 'Activities',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎮', '🎯', '🎲', '🧩', '🎭', '🎨', '🎬', '🎤', '🎧']
  },
  {
    name: 'Travel',
    emojis: ['🚗', '✈️', '🚢', '🚄', '🚲', '⛵', '🏖️', '🏕️', '🏞️', '🌋', '🗻', '🏔️', '🌇', '🌆', '🌃']
  },
  {
    name: 'Objects',
    emojis: ['💻', '📱', '💡', '🔋', '📷', '🎁', '📚', '✏️', '📌', '📎', '🔑', '🔒', '🧸', '🧴', '💎']
  }
];

// Frequently used emojis
const frequentEmojis = ['👍', '❤️', '😂', '🙏', '😊', '🔥', '🎉', '✨', '💯', '👏'];

export interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={emojiPickerRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-gray-700"
      >
        <Smile className="w-5 h-5" />
      </Button>
      
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-white border rounded-md shadow-lg z-50 w-64 max-h-80 overflow-hidden">
          <div className="p-2 border-b">
            <h3 className="text-sm font-medium">Frequently Used</h3>
            <div className="flex flex-wrap mt-1">
              {frequentEmojis.map((emoji, index) => (
                <button
                  key={index}
                  className="p-1 text-xl hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex border-b">
            {emojiCategories.map((category, index) => (
              <button
                key={index}
                className={`flex-1 p-2 text-xs ${activeCategory === index ? 'bg-gray-100' : ''}`}
                onClick={() => setActiveCategory(index)}
              >
                {category.emojis[0]}
              </button>
            ))}
          </div>
          
          <div className="p-2 h-48 overflow-y-auto">
            <h3 className="text-sm font-medium mb-1">{emojiCategories[activeCategory].name}</h3>
            <div className="grid grid-cols-8 gap-1">
              {emojiCategories[activeCategory].emojis.map((emoji, index) => (
                <button
                  key={index}
                  className="p-1 text-xl hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmojiPicker; 