// WebSocket utility for real-time updates with mock implementation
import { useEffect, useState } from 'react';

// Types
export interface WebSocketMessage {
  type: 'new_post' | 'typing' | 'reaction' | 'comment' | 'share';
  data: any;
}

class WebSocketService {
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private mockConnected = false;
  private mockMessageQueue: {type: string, data: any}[] = [];
  private mockInterval: number | null = null;

  // Initialize the mock WebSocket connection
  connect(userId: string) {
    console.log('Mock WebSocket connecting for user:', userId);
    
    // Simulate connection success
    setTimeout(() => {
      this.mockConnected = true;
      console.log('Mock WebSocket connected');
      
      // Process any queued messages that might have been sent before "connection"
      this.processMockMessageQueue();
      
      // Set up interval to simulate receiving messages
      this.mockInterval = window.setInterval(() => {
        // Very low probability of random events for demonstration
        if (Math.random() < 0.02) {
          this.simulateRandomEvent();
        }
      }, 10000) as unknown as number;
    }, 500);
  }
  
  private simulateRandomEvent() {
    const events = [
      {
        type: 'typing',
        data: {
          userId: 'random-user-' + Math.floor(Math.random() * 100),
          username: ['John', 'Sarah', 'Michael', 'Emma'][Math.floor(Math.random() * 4)],
          isTyping: true
        }
      }
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    this.notifyListeners(randomEvent.type, randomEvent.data);
    
    // For typing events, simulate stop typing after 3 seconds
    if (randomEvent.type === 'typing') {
      setTimeout(() => {
        this.notifyListeners('typing', {
          ...randomEvent.data,
          isTyping: false
        });
      }, 3000);
    }
  }
  
  private processMockMessageQueue() {
    if (this.mockConnected && this.mockMessageQueue.length > 0) {
      this.mockMessageQueue.forEach(msg => {
        this.notifyListeners(msg.type, msg.data);
      });
      this.mockMessageQueue = [];
    }
  }
  
  disconnect() {
    console.log('Mock WebSocket disconnected');
    this.mockConnected = false;
    
    if (this.mockInterval !== null) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }
  
  subscribe(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }
  
  unsubscribe(event: string, callback: (data: any) => void) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event) || [];
      this.listeners.set(
        event, 
        callbacks.filter(cb => cb !== callback)
      );
    }
  }
  
  private notifyListeners(event: string, data: any) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event) || [];
      callbacks.forEach(callback => callback(data));
    }
  }
  
  send(message: WebSocketMessage) {
    if (!this.mockConnected) {
      // Queue message to be processed when "connected"
      this.mockMessageQueue.push(message);
      console.log('Mock WebSocket not connected, message queued', message);
      return;
    }
    
    console.log('Mock WebSocket sending message:', message);
    
    // Simulate local echo for sent messages
    setTimeout(() => {
      if (message.type === 'new_post') {
        // Echo back the post as if it came from the server
        this.notifyListeners('new_post', message.data);
      }
    }, 300);
  }
  
  sendTyping(isTyping: boolean) {
    this.send({
      type: 'typing',
      data: {
        userId: localStorage.getItem('userId') || 'anonymous',
        username: 'You',
        isTyping
      }
    });
  }
}

// Create a singleton instance
export const webSocketService = new WebSocketService();

// Automatically connect when imported
console.log('Initializing mock WebSocket service');
const userId = localStorage.getItem('userId') || 'anonymous-' + Math.random().toString(36).substring(2, 9);
localStorage.setItem('userId', userId);
webSocketService.connect(userId);

// React hook for using WebSocket
export function useWebSocket(event: string, callback: (data: any) => void) {
  useEffect(() => {
    webSocketService.subscribe(event, callback);
    
    return () => {
      webSocketService.unsubscribe(event, callback);
    };
  }, [event, callback]);
}

// Hook to track who's typing
export function useTypingIndicator() {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  useEffect(() => {
    const handleTyping = (data: { userId: string, username: string, isTyping: boolean }) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          if (!prev.includes(data.username)) {
            return [...prev, data.username];
          }
        } else {
          return prev.filter(username => username !== data.username);
        }
        return prev;
      });
    };
    
    webSocketService.subscribe('typing', handleTyping);
    
    return () => {
      webSocketService.unsubscribe('typing', handleTyping);
    };
  }, []);
  
  return typingUsers;
}

export default webSocketService; 