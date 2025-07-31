import { VoiceService } from '../services/voiceService';

export class VoiceController {
  private voiceService: VoiceService;

  constructor() {
    this.voiceService = new VoiceService();
  }

  async speechToText(audioBuffer: Buffer, language: string = 'id-ID') {
    try {
      const result = await this.voiceService.convertSpeechToText(audioBuffer, language);
      return {
        text: result.text,
        confidence: result.confidence,
        language: result.language,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in speech to text:', error);
      throw new Error('Terjadi kesalahan dalam mengkonversi suara ke teks');
    }
  }

  async textToSpeech(text: string, language: string = 'id-ID', voice: string = 'default') {
    try {
      const audioBuffer = await this.voiceService.convertTextToSpeech(text, language, voice);
      return audioBuffer;
    } catch (error) {
      console.error('Error in text to speech:', error);
      throw new Error('Terjadi kesalahan dalam mengkonversi teks ke suara');
    }
  }

  async getAvailableVoices() {
    try {
      const voices = await this.voiceService.getAvailableVoices();
      return {
        voices: voices,
        defaultVoice: 'id-ID-Standard-A',
        supportedLanguages: ['id-ID', 'en-US', 'jv-ID', 'su-ID']
      };
    } catch (error) {
      console.error('Error getting available voices:', error);
      throw new Error('Terjadi kesalahan dalam mengambil daftar suara');
    }
  }

  async streamTextToSpeech(text: string, language: string = 'id-ID', voice: string = 'default', res: any) {
    try {
      await this.voiceService.streamTextToSpeech(text, language, voice, res);
    } catch (error) {
      console.error('Error in voice streaming:', error);
      throw new Error('Terjadi kesalahan dalam streaming suara');
    }
  }

  async detectLanguage(audioBuffer: Buffer) {
    try {
      const language = await this.voiceService.detectLanguage(audioBuffer);
      return {
        language: language,
        confidence: 0.95,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error detecting language:', error);
      throw new Error('Terjadi kesalahan dalam mendeteksi bahasa');
    }
  }

  async transcribeAudio(audioBuffer: Buffer, language: string = 'id-ID') {
    try {
      const result = await this.voiceService.transcribeAudio(audioBuffer, language);
      return {
        text: result.text,
        segments: result.segments,
        language: result.language,
        duration: result.duration,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('Terjadi kesalahan dalam transkripsi audio');
    }
  }
}