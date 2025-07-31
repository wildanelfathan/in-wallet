import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatRoutes from './routes/chat';
import voiceRoutes from './routes/voice';
import localRoutes from './routes/local';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/local', localRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Travas AI Assistant Backend berjalan dengan baik!',
    timestamp: new Date().toISOString()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined chat room`);
  });

  socket.on('send-message', async (data) => {
    try {
      // Process message with AI
      const response = await processMessageWithAI(data.message, data.userId);
      
      socket.emit('receive-message', {
        message: response,
        timestamp: new Date().toISOString(),
        type: 'ai'
      });
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', { message: 'Terjadi kesalahan dalam memproses pesan' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// AI Message Processing Function
async function processMessageWithAI(message: string, userId: string) {
  // TODO: Integrate with actual AI model
  // For now, return a simple response
  const responses = [
    "Halo! Saya Travas, asisten AI lokal Anda. Apa yang bisa saya bantu?",
    "Terima kasih atas pesannya! Saya sedang memproses permintaan Anda.",
    "Saya mengerti pertanyaan Anda. Mari saya bantu dengan informasi yang tepat.",
    "Bagus sekali! Ada yang bisa saya bantu lagi?",
    "Saya siap membantu Anda dengan berbagai hal, dari rekomendasi tempat makan hingga informasi transportasi lokal."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Travas Backend berjalan di port ${PORT}`);
  console.log(`📱 Socket.IO server siap untuk koneksi real-time`);
  console.log(`🌐 Health check tersedia di http://localhost:${PORT}/health`);
});