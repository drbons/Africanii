import React, { useState } from 'react';
import { 
  MessageSquare, Search, Phone, Video, Paperclip, Image, Mic, 
  File, Send, MoreVertical, Check, Pin, Archive, Star, Clock,
  Camera, Smile
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Type definitions for message and chat data
type MessageStatus = 'sent' | 'delivered' | 'read' | 'pending';

interface Message {
  id: number;
  text: string;
  time: string;
  sender: 'me' | 'them';
  status: MessageStatus;
  starred: boolean;
}

interface ChatContact {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  typing: boolean;
  pinned: boolean;
}

// Mock data for demonstration
const mockChats: ChatContact[] = [
  { 
    id: 1, 
    name: 'Jane Doe', 
    lastMessage: 'Looking forward to our meeting tomorrow!',
    time: '12:34 PM',
    unread: 3,
    online: true,
    typing: false,
    pinned: true
  },
  { 
    id: 2, 
    name: 'John Smith', 
    lastMessage: "I'll send you the invoice shortly",
    time: '10:15 AM',
    unread: 0,
    online: false,
    typing: false,
    pinned: false
  },
  { 
    id: 3, 
    name: 'Business Connect Group', 
    lastMessage: 'Samuel: Does anyone have contacts in Lagos?',
    time: 'Yesterday',
    unread: 5,
    online: false,
    typing: false,
    pinned: false
  },
  { 
    id: 4, 
    name: 'Amara Johnson', 
    lastMessage: 'Thank you for your help!',
    time: 'Yesterday',
    unread: 0,
    online: true,
    typing: true,
    pinned: false
  }
];

const mockMessages: Message[] = [
  {
    id: 1,
    text: 'Hello, how are you?',
    time: '10:30 AM',
    sender: 'them',
    status: 'read',
    starred: false
  },
  {
    id: 2,
    text: "I'm doing well, thanks for asking! How about you?",
    time: '10:32 AM',
    sender: 'me',
    status: 'read',
    starred: false
  },
  {
    id: 3,
    text: "I'm good too. I wanted to discuss our upcoming business event. Are you available sometime this week?",
    time: '10:33 AM',
    sender: 'them',
    status: 'read',
    starred: true
  },
  {
    id: 4,
    text: "Yes, I'm free on Thursday afternoon. Would 2 PM work for you?",
    time: '10:36 AM',
    sender: 'me',
    status: 'delivered',
    starred: false
  },
  {
    id: 5,
    text: "That works perfectly. I'll send you the agenda beforehand.",
    time: '10:37 AM',
    sender: 'them',
    status: 'read',
    starred: false
  }
];

export default function ChatsPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  
  // Find active chat data
  const activeChatData = mockChats.find(chat => chat.id === activeChat);

  // Function to send a new message
  const sendMessage = () => {
    if (messageText.trim() === '') return;
    
    // Get current time in HH:MM AM/PM format
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    // Create new message
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      time: timeString,
      sender: 'me',
      status: 'sent',
      starred: false
    };
    
    // Add message to list
    setMessages([...messages, newMessage]);
    
    // Clear input
    setMessageText('');
  };

  // Handle key press for sending message with Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Display message status icon
  const renderMessageStatus = (status: MessageStatus) => {
    switch(status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400 ml-1" />;
      case 'delivered':
        return (
          <div className="flex ml-1">
            <Check className="h-3 w-3 text-gray-400" />
            <Check className="h-3 w-3 text-gray-400 -ml-1" />
          </div>
        );
      case 'read':
        return (
          <div className="flex ml-1">
            <Check className="h-3 w-3 text-blue-500" />
            <Check className="h-3 w-3 text-blue-500 -ml-1" />
          </div>
        );
      default:
        return <Clock className="h-3 w-3 text-gray-400 ml-1" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="h-[calc(100vh-8rem)]">
            <CardHeader className="pb-2">
              <CardTitle>Messages</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search or start new chat" 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto h-[calc(100%-130px)]">
              <div className="space-y-1">
                {mockChats.map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer relative
                      ${chat.pinned ? 'bg-gray-50' : 'hover:bg-gray-50'}
                      ${activeChat === chat.id ? 'bg-gray-100' : ''}
                    `}
                    onClick={() => setActiveChat(chat.id)}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-gray-500" />
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{chat.time}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate">
                          {chat.typing ? (
                            <span className="text-blue-500 italic">typing...</span>
                          ) : chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <Badge variant="default" className="rounded-full bg-blue-500 text-white h-5 min-w-5 flex items-center justify-center ml-1">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {chat.pinned && (
                      <Pin className="h-3 w-3 text-gray-400 absolute top-2 right-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3">
          <Card className="h-[calc(100vh-8rem)] flex flex-col">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                  </div>
                  {activeChatData?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-base">{activeChatData?.name || 'Chat Room'}</CardTitle>
                  {activeChatData?.typing ? (
                    <p className="text-xs text-blue-500">typing...</p>
                  ) : activeChatData?.online ? (
                    <p className="text-xs text-green-500">online</p>
                  ) : (
                    <p className="text-xs text-gray-500">last seen today at 10:30 AM</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <Button size="icon" variant="ghost" className="text-gray-500 hover:text-blue-500 group">
                    <Phone className="h-5 w-5" />
                    <span className="sr-only">Call</span>
                  </Button>
                  <span>Call</span>
                </Tooltip>
                <Tooltip>
                  <Button size="icon" variant="ghost" className="text-gray-500 hover:text-blue-500 group">
                    <Video className="h-5 w-5" />
                    <span className="sr-only">Video call</span>
                  </Button>
                  <span>Video call</span>
                </Tooltip>
                <Tooltip>
                  <Button size="icon" variant="ghost" className="text-gray-500 hover:text-blue-500 group">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search in conversation</span>
                  </Button>
                  <span>Search in conversation</span>
                </Tooltip>
              </div>
            </CardHeader>
            
            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="group relative">
                    <div 
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'me' 
                          ? 'bg-blue-500 text-white rounded-tr-none' 
                          : 'bg-gray-100 rounded-tl-none'
                      }`}
                    >
                      <p>{message.text}</p>
                      <div className="flex items-center justify-end text-xs opacity-70 mt-1">
                        <span>{message.time}</span>
                        {message.sender === 'me' && renderMessageStatus(message.status)}
                      </div>
                    </div>

                    {/* Message actions that appear on hover */}
                    <div className="absolute top-0 -right-8 bottom-0 hidden group-hover:flex flex-col justify-center space-y-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full bg-white shadow-sm">
                        <Star className={`h-3 w-3 ${message.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full bg-white shadow-sm">
                        <MessageSquare className="h-3 w-3 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-gray-500">
                      <Smile className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid grid-cols-8 gap-2">
                      {['😀', '😊', '😂', '👍', '❤️', '👏', '🙏', '🔥'].map((emoji) => (
                        <button 
                          key={emoji} 
                          className="text-xl hover:bg-gray-100 p-1 rounded"
                          onClick={() => setMessageText(prev => prev + emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-gray-500">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="flex flex-col space-y-1">
                      <Button variant="ghost" className="justify-start" size="sm">
                        <Image className="mr-2 h-4 w-4" /> Photos & Videos
                      </Button>
                      <Button variant="ghost" className="justify-start" size="sm">
                        <File className="mr-2 h-4 w-4" /> Documents
                      </Button>
                      <Button variant="ghost" className="justify-start" size="sm">
                        <Camera className="mr-2 h-4 w-4" /> Camera
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Input 
                  placeholder="Type your message..." 
                  className="flex-1" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                
                {messageText ? (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-blue-500"
                    onClick={sendMessage}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className={`text-gray-500 ${recording ? 'text-red-500' : ''}`}
                    onClick={() => setRecording(!recording)}
                  >
                    <Mic className="h-5 w-5" />
                    {recording && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                  </Button>
                )}
              </div>
              {recording && (
                <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm">Recording voice message... 0:05</span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-red-500 h-8">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 