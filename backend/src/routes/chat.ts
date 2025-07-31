import express from 'express';
import { ChatController } from '../controllers/chatController';

const router = express.Router();
const chatController = new ChatController();

// POST /api/chat/send
router.post('/send', async (req, res) => {
  try {
    const { message, userId, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Pesan tidak boleh kosong' 
      });
    }

    const response = await chatController.processMessage(message, userId, context);
    res.json(response);
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam memproses pesan' 
    });
  }
});

// GET /api/chat/history/:userId
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const history = await chatController.getChatHistory(
      userId, 
      parseInt(limit as string), 
      parseInt(offset as string)
    );
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam mengambil riwayat chat' 
    });
  }
});

// POST /api/chat/clear/:userId
router.post('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await chatController.clearChatHistory(userId);
    res.json({ message: 'Riwayat chat berhasil dihapus' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam menghapus riwayat chat' 
    });
  }
});

// POST /api/chat/feedback
router.post('/feedback', async (req, res) => {
  try {
    const { messageId, rating, feedback } = req.body;
    await chatController.saveFeedback(messageId, rating, feedback);
    res.json({ message: 'Feedback berhasil disimpan' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam menyimpan feedback' 
    });
  }
});

export default router;