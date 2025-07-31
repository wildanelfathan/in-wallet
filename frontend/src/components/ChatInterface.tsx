import React, { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon, PaperAirplaneIcon, StopIcon } from '@heroicons/react/24/outline';
import { Message, User } from '../types';
import MessageBubble from './MessageBubble';
import ChatSuggestions from './ChatSuggestions';
import VoiceRecorder from './VoiceRecorder';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  isConnected: boolean;
  user: User;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isConnected,
  user
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !isConnected) return;

    const text = inputText.trim();
    setInputText('');
    setIsTyping(true);

    try {
      await onSendMessage(text);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceMessage = async (audioBlob: Blob) => {
    if (!isConnected) return;

    setIsTyping(true);
    try {
      // TODO: Implement voice message processing
      // For now, just send a placeholder message
      await onSendMessage('Pesan suara diterima');
    } catch (error) {
      console.error('Error processing voice message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-full"></div>
            </div>
            <h3 className="text-lg font-medium mb-2">Selamat datang di Travas!</h3>
            <p className="text-sm max-w-md">
              Saya adalah asisten AI lokal yang siap membantu Anda dengan berbagai hal seperti rekomendasi makanan, transportasi, cuaca, dan acara lokal.
            </p>
            <div className="mt-6">
              <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.sender === 'user'}
            />
          ))
        )}
        
        {isTyping && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
            </div>
            <div className="chat-bubble-ai">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-end space-x-2">
          {/* Text Input */}
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan Anda..."
              disabled={!isConnected}
              className="input-field resize-none"
            />
          </div>

          {/* Voice Button */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            disabled={!isConnected}
            className={`p-3 rounded-lg transition-colors duration-200 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {isRecording ? (
              <StopIcon className="w-5 h-5" />
            ) : (
              <MicrophoneIcon className="w-5 h-5" />
            )}
          </button>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || !isConnected}
            className="btn-primary p-3"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Recorder */}
        {isRecording && (
          <div className="mt-4">
            <VoiceRecorder
              onRecordingComplete={handleVoiceMessage}
              onCancel={() => setIsRecording(false)}
              language={user.preferences.language}
            />
          </div>
        )}

        {/* Connection Status */}
        {!isConnected && (
          <div className="mt-2 text-sm text-red-600 flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            Terputus dari server
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;