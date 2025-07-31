import axios from 'axios';

interface AIMessage {
  userId: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context?: any;
}

interface AIResponse {
  text: string;
  context: any;
  suggestions?: string[];
  confidence?: number;
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.AI_API_KEY || '';
    this.baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
  }

  async processMessage(message: string, userId: string, context?: any): Promise<AIResponse> {
    try {
      // TODO: Integrate with actual AI model (OpenAI, Hugging Face, or local model)
      // For now, return a simple response based on message content
      
      const response = await this.generateResponse(message, context);
      
      return {
        text: response.text,
        context: response.context,
        suggestions: response.suggestions,
        confidence: response.confidence
      };
    } catch (error) {
      console.error('Error processing message with AI:', error);
      throw new Error('Terjadi kesalahan dalam memproses pesan dengan AI');
    }
  }

  private async generateResponse(message: string, context?: any): Promise<AIResponse> {
    // Simple rule-based responses for demonstration
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('hi')) {
      return {
        text: 'Halo! Saya Travas, asisten AI lokal Anda. Apa yang bisa saya bantu hari ini?',
        context: { greeting: true },
        suggestions: ['Rekomendasi makanan', 'Informasi transportasi', 'Acara lokal'],
        confidence: 0.9
      };
    }
    
    if (lowerMessage.includes('makan') || lowerMessage.includes('restoran') || lowerMessage.includes('food')) {
      return {
        text: 'Saya bisa membantu Anda menemukan rekomendasi makanan lokal yang enak! Di mana lokasi Anda saat ini?',
        context: { intent: 'food_recommendation' },
        suggestions: ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta'],
        confidence: 0.85
      };
    }
    
    if (lowerMessage.includes('transport') || lowerMessage.includes('ojek') || lowerMessage.includes('grab')) {
      return {
        text: 'Saya bisa membantu Anda dengan informasi transportasi! Dari mana ke mana Anda ingin pergi?',
        context: { intent: 'transportation' },
        suggestions: ['Gojek', 'Grab', 'TransJakarta', 'KRL'],
        confidence: 0.8
      };
    }
    
    if (lowerMessage.includes('cuaca') || lowerMessage.includes('weather')) {
      return {
        text: 'Saya bisa memberikan informasi cuaca untuk Anda. Kota mana yang ingin Anda cek cuacanya?',
        context: { intent: 'weather' },
        suggestions: ['Jakarta', 'Bandung', 'Surabaya', 'Medan'],
        confidence: 0.9
      };
    }
    
    if (lowerMessage.includes('acara') || lowerMessage.includes('event') || lowerMessage.includes('budaya')) {
      return {
        text: 'Saya bisa membantu Anda menemukan acara budaya dan lokal yang menarik! Kota mana yang ingin Anda cek acaranya?',
        context: { intent: 'cultural_events' },
        suggestions: ['Jakarta', 'Bandung', 'Yogyakarta', 'Bali'],
        confidence: 0.85
      };
    }
    
    // Default response
    return {
      text: 'Terima kasih atas pesannya! Saya Travas, asisten AI lokal yang siap membantu Anda dengan berbagai hal seperti rekomendasi makanan, transportasi, cuaca, dan acara lokal. Apa yang bisa saya bantu?',
      context: { intent: 'general' },
      suggestions: ['Rekomendasi makanan', 'Informasi transportasi', 'Cuaca hari ini', 'Acara lokal'],
      confidence: 0.7
    };
  }

  buildContext(messages: AIMessage[]): any {
    const context: any = {
      recentMessages: messages.slice(-5).map(msg => ({
        message: msg.message,
        sender: msg.sender,
        timestamp: msg.timestamp
      })),
      userPreferences: this.extractUserPreferences(messages),
      conversationFlow: this.analyzeConversationFlow(messages)
    };
    
    return context;
  }

  private extractUserPreferences(messages: AIMessage[]): any {
    const preferences: any = {
      location: null,
      interests: [],
      language: 'id-ID'
    };
    
    // Extract location mentions
    const locationKeywords = ['jakarta', 'bandung', 'surabaya', 'yogyakarta', 'bali', 'medan'];
    for (const msg of messages) {
      if (msg.sender === 'user') {
        const lowerMsg = msg.message.toLowerCase();
        for (const location of locationKeywords) {
          if (lowerMsg.includes(location)) {
            preferences.location = location;
            break;
          }
        }
      }
    }
    
    return preferences;
  }

  private analyzeConversationFlow(messages: AIMessage[]): any {
    const flow = {
      currentTopic: 'general',
      topicHistory: [],
      userEngagement: 'medium'
    };
    
    // Analyze recent messages to determine current topic
    const recentMessages = messages.slice(-3);
    for (const msg of recentMessages) {
      if (msg.sender === 'user') {
        const lowerMsg = msg.message.toLowerCase();
        if (lowerMsg.includes('makan') || lowerMsg.includes('restoran')) {
          flow.currentTopic = 'food';
        } else if (lowerMsg.includes('transport') || lowerMsg.includes('ojek')) {
          flow.currentTopic = 'transportation';
        } else if (lowerMsg.includes('cuaca')) {
          flow.currentTopic = 'weather';
        } else if (lowerMsg.includes('acara') || lowerMsg.includes('event')) {
          flow.currentTopic = 'events';
        }
      }
    }
    
    return flow;
  }

  async generateSuggestions(context: any): Promise<string[]> {
    const suggestions: string[] = [];
    
    if (context.intent === 'food_recommendation') {
      suggestions.push('Rekomendasi makanan halal', 'Restoran tradisional', 'Cafe terdekat');
    } else if (context.intent === 'transportation') {
      suggestions.push('Gojek', 'Grab', 'TransJakarta', 'KRL Commuter');
    } else if (context.intent === 'weather') {
      suggestions.push('Cuaca Jakarta', 'Cuaca Bandung', 'Cuaca Surabaya');
    } else if (context.intent === 'cultural_events') {
      suggestions.push('Festival budaya', 'Konser musik', 'Pameran seni');
    } else {
      suggestions.push('Rekomendasi makanan', 'Informasi transportasi', 'Cuaca hari ini', 'Acara lokal');
    }
    
    return suggestions;
  }
}