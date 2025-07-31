import { LocalService } from '../services/localService';

export class LocalController {
  private localService: LocalService;

  constructor() {
    this.localService = new LocalService();
  }

  async getTransportationOptions(origin: string, destination: string, type: string = 'all') {
    try {
      const options = await this.localService.getTransportationOptions(origin, destination, type);
      return {
        origin,
        destination,
        options,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting transportation options:', error);
      throw new Error('Terjadi kesalahan dalam mengambil opsi transportasi');
    }
  }

  async getFoodRecommendations(params: {
    location?: string;
    cuisine?: string;
    priceRange?: string;
    rating?: string;
  }) {
    try {
      const recommendations = await this.localService.getFoodRecommendations(params);
      return {
        recommendations,
        total: recommendations.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting food recommendations:', error);
      throw new Error('Terjadi kesalahan dalam mengambil rekomendasi makanan');
    }
  }

  async getCulturalEvents(params: {
    city?: string;
    date?: string;
    category?: string;
  }) {
    try {
      const events = await this.localService.getCulturalEvents(params);
      return {
        events,
        total: events.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting cultural events:', error);
      throw new Error('Terjadi kesalahan dalam mengambil acara budaya');
    }
  }

  async getShoppingRecommendations(params: {
    category?: string;
    location?: string;
    priceRange?: string;
    brand?: string;
  }) {
    try {
      const recommendations = await this.localService.getShoppingRecommendations(params);
      return {
        recommendations,
        total: recommendations.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting shopping recommendations:', error);
      throw new Error('Terjadi kesalahan dalam mengambil rekomendasi belanja');
    }
  }

  async getWeather(city: string) {
    try {
      const weather = await this.localService.getWeather(city);
      return {
        city,
        weather,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting weather:', error);
      throw new Error('Terjadi kesalahan dalam mengambil informasi cuaca');
    }
  }

  async getTrafficInfo(origin: string, destination: string) {
    try {
      const traffic = await this.localService.getTrafficInfo(origin, destination);
      return {
        origin,
        destination,
        traffic,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting traffic info:', error);
      throw new Error('Terjadi kesalahan dalam mengambil informasi lalu lintas');
    }
  }

  async getLocalNews(params: {
    city?: string;
    category?: string;
    limit?: number;
  }) {
    try {
      const news = await this.localService.getLocalNews(params);
      return {
        news,
        total: news.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting local news:', error);
      throw new Error('Terjadi kesalahan dalam mengambil berita lokal');
    }
  }

  async getLocalServices(location: string) {
    try {
      const services = await this.localService.getLocalServices(location);
      return {
        location,
        services,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting local services:', error);
      throw new Error('Terjadi kesalahan dalam mengambil layanan lokal');
    }
  }

  async getEmergencyContacts(city: string) {
    try {
      const contacts = await this.localService.getEmergencyContacts(city);
      return {
        city,
        contacts,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      throw new Error('Terjadi kesalahan dalam mengambil kontak darurat');
    }
  }
}