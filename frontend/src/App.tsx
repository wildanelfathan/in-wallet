import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Message, User } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User>({
    id: 'user-' + Date.now(),
    name: 'Pengguna',
    preferences: {
      language: 'id-ID',
      voice: 'id-ID-Standard-A',
      theme: 'light'
    }
  });

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(API_BASE_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      newSocket.emit('join-chat', user.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('receive-message', (data) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: data.message,
        sender: 'ai',
        timestamp: new Date(data.timestamp),
        type: 'text'
      };
      setMessages(prev => [...prev, newMessage]);
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      // Handle error (show notification, etc.)
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [user.id]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !socket) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);

    // Send message through socket
    socket.emit('send-message', {
      message: text,
      userId: user.id
    });
  };

  const clearChat = () => {
    setMessages([]);
  };

  const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...preferences
      }
    }));
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        user={user}
        onPreferencesChange={updateUserPreferences}
        isConnected={isConnected}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          user={user}
          isConnected={isConnected}
        />
        
        {/* Chat Interface */}
        <ChatInterface
          messages={messages}
          onSendMessage={sendMessage}
          onClearChat={clearChat}
          isConnected={isConnected}
          user={user}
        />
      </div>
    </div>
  );
}

export default App;