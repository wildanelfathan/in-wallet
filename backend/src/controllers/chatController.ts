import { AIService } from '../services/aiService';
import { ChatHistoryService } from '../services/chatHistoryService';

export class ChatController {
  private aiService: AIService;
  private chatHistoryService: ChatHistoryService;

  constructor() {
    this.aiService = new AIService();
    this.chatHistoryService = new ChatHistoryService();
  }

  async processMessage(message: string, userId: string, context?: any) {
    try {
      // Save user message to history
      const userMessageId = await this.chatHistoryService.saveMessage({
        userId,
        message,
        sender: 'user',
        timestamp: new Date(),
        context
      });

      // Process with AI
      const aiResponse = await this.aiService.processMessage(message, userId, context);
      
      // Save AI response to history
      const aiMessageId = await this.chatHistoryService.saveMessage({
        userId,
        message: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        context: aiResponse.context
      });

      return {
        messageId: aiMessageId,
        text: aiResponse.text,
        timestamp: new Date().toISOString(),
        context: aiResponse.context,
        suggestions: aiResponse.suggestions || []
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw new Error('Terjadi kesalahan dalam memproses pesan');
    }
  }

  async getChatHistory(userId: string, limit: number = 50, offset: number = 0) {
    try {
      const history = await this.chatHistoryService.getHistory(userId, limit, offset);
      return {
        messages: history,
        total: await this.chatHistoryService.getTotalCount(userId),
        hasMore: history.length === limit
      };
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw new Error('Terjadi kesalahan dalam mengambil riwayat chat');
    }
  }

  async clearChatHistory(userId: string) {
    try {
      await this.chatHistoryService.clearHistory(userId);
      return { success: true };
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw new Error('Terjadi kesalahan dalam menghapus riwayat chat');
    }
  }

  async saveFeedback(messageId: string, rating: number, feedback?: string) {
    try {
      await this.chatHistoryService.saveFeedback(messageId, rating, feedback);
      return { success: true };
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw new Error('Terjadi kesalahan dalam menyimpan feedback');
    }
  }

  async getConversationContext(userId: string) {
    try {
      const recentMessages = await this.chatHistoryService.getHistory(userId, 10, 0);
      return this.aiService.buildContext(recentMessages);
    } catch (error) {
      console.error('Error getting conversation context:', error);
      throw new Error('Terjadi kesalahan dalam mengambil konteks percakapan');
    }
  }
}