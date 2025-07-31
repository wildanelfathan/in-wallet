import React from 'react';
import { 
  TruckIcon, 
  CakeIcon, 
  SunIcon, 
  CalendarIcon,
  MapPinIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      id: 'food',
      text: 'Rekomendasi makanan',
      icon: CakeIcon,
      category: 'food'
    },
    {
      id: 'transport',
      text: 'Informasi transportasi',
      icon: TruckIcon,
      category: 'transport'
    },
    {
      id: 'weather',
      text: 'Cuaca hari ini',
      icon: SunIcon,
      category: 'weather'
    },
    {
      id: 'events',
      text: 'Acara lokal',
      icon: CalendarIcon,
      category: 'events'
    },
    {
      id: 'location',
      text: 'Tempat terdekat',
      icon: MapPinIcon,
      category: 'location'
    },
    {
      id: 'shopping',
      text: 'Belanja online',
      icon: ShoppingBagIcon,
      category: 'shopping'
    }
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Apa yang bisa saya bantu?</h4>
      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="flex items-center space-x-2 p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-200 text-left"
          >
            <suggestion.icon className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestions;