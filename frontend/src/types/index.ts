export interface User {
  id: string;
  name: string;
  preferences: {
    language: 'id-ID' | 'en-US' | 'jv-ID' | 'su-ID';
    voice: string;
    theme: 'light' | 'dark';
  };
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'voice' | 'image';
  metadata?: {
    confidence?: number;
    language?: string;
    suggestions?: string[];
  };
}

export interface ChatSuggestion {
  id: string;
  text: string;
  category: string;
}

export interface LocalService {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  contact?: string;
}

export interface TransportationOption {
  id: string;
  name: string;
  type: 'motorcycle' | 'car' | 'public' | 'walking';
  provider: string;
  estimatedTime: number;
  estimatedCost: number;
  distance: number;
  description: string;
}

export interface FoodRecommendation {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  location: string;
  description: string;
  halal: boolean;
  image?: string;
}

export interface CulturalEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  description: string;
  organizer: string;
  price?: number;
  image?: string;
}

export interface WeatherInfo {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
}

export interface VoiceSettings {
  language: string;
  voice: string;
  speed: number;
  pitch: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  autoScroll: boolean;
  soundEnabled: boolean;
}

export interface ChatHistory {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SocketMessage {
  type: 'message' | 'typing' | 'error';
  data: any;
  timestamp: string;
}

export interface LocalNews {
  id: string;
  title: string;
  content: string;
  category: string;
  city: string;
  publishedAt: string;
  source: string;
  image?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: string;
  description: string;
}