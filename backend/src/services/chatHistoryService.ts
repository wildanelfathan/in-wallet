interface ChatMessage {
  id?: string;
  userId: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context?: any;
  feedback?: {
    rating: number;
    comment?: string;
  };
}

interface ChatHistory {
  messages: ChatMessage[];
  total: number;
  hasMore: boolean;
}

export class ChatHistoryService {
  private chatHistory: Map<string, ChatMessage[]> = new Map();

  async saveMessage(message: ChatMessage): Promise<string> {
    try {
      const messageId = this.generateMessageId();
      const messageWithId = { ...message, id: messageId };
      
      if (!this.chatHistory.has(message.userId)) {
        this.chatHistory.set(message.userId, []);
      }
      
      const userHistory = this.chatHistory.get(message.userId)!;
      userHistory.push(messageWithId);
      
      // Keep only last 100 messages per user
      if (userHistory.length > 100) {
        userHistory.splice(0, userHistory.length - 100);
      }
      
      return messageId;
    } catch (error) {
      console.error('Error saving message:', error);
      throw new Error('Terjadi kesalahan dalam menyimpan pesan');
    }
  }

  async getHistory(userId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    try {
      const userHistory = this.chatHistory.get(userId) || [];
      return userHistory.slice(offset, offset + limit);
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw new Error('Terjadi kesalahan dalam mengambil riwayat chat');
    }
  }

  async getTotalCount(userId: string): Promise<number> {
    try {
      const userHistory = this.chatHistory.get(userId) || [];
      return userHistory.length;
    } catch (error) {
      console.error('Error getting total count:', error);
      throw new Error('Terjadi kesalahan dalam menghitung total pesan');
    }
  }

  async clearHistory(userId: string): Promise<void> {
    try {
      this.chatHistory.delete(userId);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw new Error('Terjadi kesalahan dalam menghapus riwayat chat');
    }
  }

  async saveFeedback(messageId: string, rating: number, feedback?: string): Promise<void> {
    try {
      // Find message in all user histories
      for (const [userId, messages] of this.chatHistory.entries()) {
        const message = messages.find(msg => msg.id === messageId);
        if (message) {
          message.feedback = {
            rating,
            comment: feedback
          };
          break;
        }
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw new Error('Terjadi kesalahan dalam menyimpan feedback');
    }
  }

  async getMessageById(messageId: string): Promise<ChatMessage | null> {
    try {
      for (const messages of this.chatHistory.values()) {
        const message = messages.find(msg => msg.id === messageId);
        if (message) {
          return message;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting message by ID:', error);
      throw new Error('Terjadi kesalahan dalam mengambil pesan');
    }
  }

  async getUserStats(userId: string): Promise<{
    totalMessages: number;
    userMessages: number;
    aiMessages: number;
    averageRating: number;
    lastActivity: Date | null;
  }> {
    try {
      const userHistory = this.chatHistory.get(userId) || [];
      const userMessages = userHistory.filter(msg => msg.sender === 'user').length;
      const aiMessages = userHistory.filter(msg => msg.sender === 'ai').length;
      
      const ratings = userHistory
        .filter(msg => msg.feedback?.rating)
        .map(msg => msg.feedback!.rating);
      
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;
      
      const lastActivity = userHistory.length > 0 
        ? userHistory[userHistory.length - 1].timestamp 
        : null;
      
      return {
        totalMessages: userHistory.length,
        userMessages,
        aiMessages,
        averageRating,
        lastActivity
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new Error('Terjadi kesalahan dalam mengambil statistik pengguna');
    }
  }

  async searchMessages(userId: string, query: string): Promise<ChatMessage[]> {
    try {
      const userHistory = this.chatHistory.get(userId) || [];
      const lowerQuery = query.toLowerCase();
      
      return userHistory.filter(msg => 
        msg.message.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching messages:', error);
      throw new Error('Terjadi kesalahan dalam mencari pesan');
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Export chat history for backup
  async exportChatHistory(userId: string): Promise<ChatMessage[]> {
    try {
      return this.chatHistory.get(userId) || [];
    } catch (error) {
      console.error('Error exporting chat history:', error);
      throw new Error('Terjadi kesalahan dalam mengekspor riwayat chat');
    }
  }

  // Import chat history from backup
  async importChatHistory(userId: string, messages: ChatMessage[]): Promise<void> {
    try {
      this.chatHistory.set(userId, messages);
    } catch (error) {
      console.error('Error importing chat history:', error);
      throw new Error('Terjadi kesalahan dalam mengimpor riwayat chat');
    }
  }
}