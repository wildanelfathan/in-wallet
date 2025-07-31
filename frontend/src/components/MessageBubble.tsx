import React from 'react';
import { Message } from '../types';
import { ClockIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.text);
      utterance.lang = 'id-ID';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-primary-600' : 'bg-gray-200'
        }`}>
          {isUser ? (
            <span className="text-white text-sm font-medium">U</span>
          ) : (
            <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
          )}
        </div>

        {/* Message Content */}
        <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
          <div className="space-y-1">
            {/* Message Text */}
            <p className="text-sm leading-relaxed">{message.text}</p>
            
            {/* Message Metadata */}
            <div className={`flex items-center justify-between text-xs ${
              isUser ? 'text-white/70' : 'text-gray-500'
            }`}>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-3 h-3" />
                <span>{formatTime(message.timestamp)}</span>
              </div>
              
              {/* AI Message Actions */}
              {!isUser && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleSpeak}
                    className="hover:bg-white/10 rounded p-1 transition-colors"
                    title="Dengarkan"
                  >
                    <SpeakerWaveIcon className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.metadata.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="block w-full text-left text-xs bg-white/10 hover:bg-white/20 rounded px-2 py-1 transition-colors"
                    onClick={() => {
                      // Handle suggestion click
                      console.log('Suggestion clicked:', suggestion);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Confidence Score (for AI messages) */}
            {!isUser && message.metadata?.confidence && (
              <div className="mt-1 text-xs text-gray-400">
                Kepercayaan: {Math.round(message.metadata.confidence * 100)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;