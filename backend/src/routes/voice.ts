import express from 'express';
import multer from 'multer';
import { VoiceController } from '../controllers/voiceController';

const router = express.Router();
const voiceController = new VoiceController();

// Configure multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file audio yang diperbolehkan'));
    }
  }
});

// POST /api/voice/speech-to-text
router.post('/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'File audio tidak ditemukan' 
      });
    }

    const { userId, language = 'id-ID' } = req.body;
    const audioBuffer = req.file.buffer;
    
    const result = await voiceController.speechToText(audioBuffer, language);
    res.json(result);
  } catch (error) {
    console.error('Error in speech-to-text:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam mengkonversi suara ke teks' 
    });
  }
});

// POST /api/voice/text-to-speech
router.post('/text-to-speech', async (req, res) => {
  try {
    const { text, language = 'id-ID', voice = 'default' } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'Teks tidak boleh kosong' 
      });
    }

    const audioBuffer = await voiceController.textToSpeech(text, language, voice);
    
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', audioBuffer.length);
    res.send(audioBuffer);
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam mengkonversi teks ke suara' 
    });
  }
});

// GET /api/voice/available-voices
router.get('/available-voices', async (req, res) => {
  try {
    const voices = await voiceController.getAvailableVoices();
    res.json(voices);
  } catch (error) {
    console.error('Error getting available voices:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam mengambil daftar suara' 
    });
  }
});

// POST /api/voice/stream
router.post('/stream', async (req, res) => {
  try {
    const { text, language = 'id-ID', voice = 'default' } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'Teks tidak boleh kosong' 
      });
    }

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    await voiceController.streamTextToSpeech(text, language, voice, res);
  } catch (error) {
    console.error('Error in voice streaming:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam streaming suara' 
    });
  }
});

export default router;