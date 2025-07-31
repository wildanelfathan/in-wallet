import axios from 'axios';

interface TransportationOption {
  id: string;
  name: string;
  type: 'motorcycle' | 'car' | 'public' | 'walking';
  provider: string;
  estimatedTime: number;
  estimatedCost: number;
  distance: number;
  description: string;
}

interface FoodRecommendation {
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

interface CulturalEvent {
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

interface ShoppingRecommendation {
  id: string;
  name: string;
  category: string;
  location: string;
  priceRange: string;
  rating: number;
  description: string;
  brand?: string;
  image?: string;
}

interface WeatherInfo {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: any[];
}

interface TrafficInfo {
  origin: string;
  destination: string;
  currentTime: number;
  normalTime: number;
  congestion: string;
  alternativeRoutes: any[];
}

interface LocalNews {
  id: string;
  title: string;
  content: string;
  category: string;
  city: string;
  publishedAt: string;
  source: string;
  image?: string;
}

export class LocalService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.LOCAL_API_KEY || '';
  }

  async getTransportationOptions(origin: string, destination: string, type: string = 'all'): Promise<TransportationOption[]> {
    try {
      // TODO: Integrate with actual transportation APIs (Gojek, Grab, etc.)
      // For now, return mock data
      
      const mockOptions: TransportationOption[] = [
        {
          id: 'gojek-1',
          name: 'Gojek',
          type: 'motorcycle',
          provider: 'Gojek',
          estimatedTime: 15,
          estimatedCost: 25000,
          distance: 5.2,
          description: 'Ojek online dengan driver berpengalaman'
        },
        {
          id: 'grab-1',
          name: 'Grab',
          type: 'motorcycle',
          provider: 'Grab',
          estimatedTime: 18,
          estimatedCost: 28000,
          distance: 5.2,
          description: 'Layanan transportasi online terpercaya'
        },
        {
          id: 'transjakarta-1',
          name: 'TransJakarta',
          type: 'public',
          provider: 'TransJakarta',
          estimatedTime: 25,
          estimatedCost: 3500,
          distance: 5.2,
          description: 'Bus rapid transit Jakarta'
        },
        {
          id: 'krl-1',
          name: 'KRL Commuter',
          type: 'public',
          provider: 'KAI Commuter',
          estimatedTime: 20,
          estimatedCost: 3000,
          distance: 5.2,
          description: 'Kereta listrik Jakarta'
        }
      ];

      return mockOptions.filter(option => 
        type === 'all' || option.type === type
      );
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
  }): Promise<FoodRecommendation[]> {
    try {
      // TODO: Integrate with actual food APIs (GoFood, GrabFood, etc.)
      // For now, return mock data
      
      const mockRecommendations: FoodRecommendation[] = [
        {
          id: 'resto-1',
          name: 'Warung Tekko',
          cuisine: 'Indonesia',
          rating: 4.5,
          priceRange: 'Murah',
          location: 'Jakarta Selatan',
          description: 'Warung tradisional dengan masakan Indonesia autentik',
          halal: true
        },
        {
          id: 'resto-2',
          name: 'Sate Khas Senayan',
          cuisine: 'Indonesia',
          rating: 4.3,
          priceRange: 'Sedang',
          location: 'Jakarta Pusat',
          description: 'Sate ayam dan kambing dengan bumbu khas',
          halal: true
        },
        {
          id: 'resto-3',
          name: 'Bakmi GM',
          cuisine: 'Chinese',
          rating: 4.2,
          priceRange: 'Murah',
          location: 'Jakarta Barat',
          description: 'Bakmi dengan kuah kaldu yang gurih',
          halal: false
        },
        {
          id: 'resto-4',
          name: 'Soto Betawi H. Ma\'ruf',
          cuisine: 'Indonesia',
          rating: 4.7,
          priceRange: 'Sedang',
          location: 'Jakarta Utara',
          description: 'Soto betawi dengan kuah santan yang kental',
          halal: true
        }
      ];

      return mockRecommendations.filter(rec => {
        if (params.location && !rec.location.toLowerCase().includes(params.location.toLowerCase())) {
          return false;
        }
        if (params.cuisine && rec.cuisine !== params.cuisine) {
          return false;
        }
        if (params.rating && rec.rating < parseFloat(params.rating)) {
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Error getting food recommendations:', error);
      throw new Error('Terjadi kesalahan dalam mengambil rekomendasi makanan');
    }
  }

  async getCulturalEvents(params: {
    city?: string;
    date?: string;
    category?: string;
  }): Promise<CulturalEvent[]> {
    try {
      // TODO: Integrate with actual event APIs
      // For now, return mock data
      
      const mockEvents: CulturalEvent[] = [
        {
          id: 'event-1',
          name: 'Festival Budaya Jakarta',
          date: '2024-01-15',
          location: 'Taman Mini Indonesia Indah',
          category: 'Festival',
          description: 'Festival budaya yang menampilkan berbagai kesenian tradisional Indonesia',
          organizer: 'Dinas Pariwisata Jakarta'
        },
        {
          id: 'event-2',
          name: 'Konser Musik Tradisional',
          date: '2024-01-20',
          location: 'Gedung Kesenian Jakarta',
          category: 'Musik',
          description: 'Konser musik tradisional dengan gamelan dan angklung',
          organizer: 'Sanggar Seni Budaya'
        },
        {
          id: 'event-3',
          name: 'Pameran Batik Nusantara',
          date: '2024-01-25',
          location: 'Museum Tekstil Jakarta',
          category: 'Pameran',
          description: 'Pameran batik dari berbagai daerah di Indonesia',
          organizer: 'Museum Tekstil Jakarta'
        }
      ];

      return mockEvents.filter(event => {
        if (params.city && !event.location.toLowerCase().includes(params.city.toLowerCase())) {
          return false;
        }
        if (params.category && event.category !== params.category) {
          return false;
        }
        return true;
      });
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
  }): Promise<ShoppingRecommendation[]> {
    try {
      // TODO: Integrate with actual shopping APIs (Tokopedia, Shopee, etc.)
      // For now, return mock data
      
      const mockRecommendations: ShoppingRecommendation[] = [
        {
          id: 'shop-1',
          name: 'Mall Taman Anggrek',
          category: 'Mall',
          location: 'Jakarta Barat',
          priceRange: 'Menengah-Tinggi',
          rating: 4.3,
          description: 'Mall modern dengan berbagai toko dan restoran'
        },
        {
          id: 'shop-2',
          name: 'Pasar Tanah Abang',
          category: 'Pasar',
          location: 'Jakarta Pusat',
          priceRange: 'Murah',
          rating: 4.1,
          description: 'Pasar tekstil terbesar di Asia Tenggara'
        },
        {
          id: 'shop-3',
          name: 'Plaza Senayan',
          category: 'Mall',
          location: 'Jakarta Selatan',
          priceRange: 'Tinggi',
          rating: 4.5,
          description: 'Mall mewah dengan brand internasional'
        }
      ];

      return mockRecommendations.filter(rec => {
        if (params.category && rec.category !== params.category) {
          return false;
        }
        if (params.location && !rec.location.toLowerCase().includes(params.location.toLowerCase())) {
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Error getting shopping recommendations:', error);
      throw new Error('Terjadi kesalahan dalam mengambil rekomendasi belanja');
    }
  }

  async getWeather(city: string): Promise<WeatherInfo> {
    try {
      // TODO: Integrate with actual weather API
      // For now, return mock data
      
      const mockWeather: WeatherInfo = {
        city: city,
        temperature: 28,
        condition: 'Cerah Berawan',
        humidity: 75,
        windSpeed: 10,
        forecast: [
          { date: '2024-01-15', high: 30, low: 25, condition: 'Cerah' },
          { date: '2024-01-16', high: 29, low: 24, condition: 'Berawan' },
          { date: '2024-01-17', high: 31, low: 26, condition: 'Hujan Ringan' }
        ]
      };

      return mockWeather;
    } catch (error) {
      console.error('Error getting weather:', error);
      throw new Error('Terjadi kesalahan dalam mengambil informasi cuaca');
    }
  }

  async getTrafficInfo(origin: string, destination: string): Promise<TrafficInfo> {
    try {
      // TODO: Integrate with actual traffic API
      // For now, return mock data
      
      const mockTraffic: TrafficInfo = {
        origin: origin,
        destination: destination,
        currentTime: 25,
        normalTime: 15,
        congestion: 'Sedang',
        alternativeRoutes: [
          {
            name: 'Rute Alternatif 1',
            time: 20,
            distance: 6.5
          },
          {
            name: 'Rute Alternatif 2',
            time: 18,
            distance: 7.2
          }
        ]
      };

      return mockTraffic;
    } catch (error) {
      console.error('Error getting traffic info:', error);
      throw new Error('Terjadi kesalahan dalam mengambil informasi lalu lintas');
    }
  }

  async getLocalNews(params: {
    city?: string;
    category?: string;
    limit?: number;
  }): Promise<LocalNews[]> {
    try {
      // TODO: Integrate with actual news API
      // For now, return mock data
      
      const mockNews: LocalNews[] = [
        {
          id: 'news-1',
          title: 'Festival Kuliner Jakarta 2024 Sukses Digelar',
          content: 'Festival kuliner terbesar di Jakarta berhasil menarik ribuan pengunjung...',
          category: 'Kuliner',
          city: 'Jakarta',
          publishedAt: '2024-01-15T10:00:00Z',
          source: 'Jakarta Post'
        },
        {
          id: 'news-2',
          title: 'TransJakarta Tambah Rute Baru',
          content: 'TransJakarta menambahkan rute baru untuk melayani warga Jakarta...',
          category: 'Transportasi',
          city: 'Jakarta',
          publishedAt: '2024-01-15T09:30:00Z',
          source: 'Kompas'
        },
        {
          id: 'news-3',
          title: 'Acara Budaya Tradisional di TMII',
          content: 'Berbagai acara budaya tradisional digelar di Taman Mini Indonesia Indah...',
          category: 'Budaya',
          city: 'Jakarta',
          publishedAt: '2024-01-15T08:45:00Z',
          source: 'Antara'
        }
      ];

      return mockNews.filter(news => {
        if (params.city && news.city !== params.city) {
          return false;
        }
        if (params.category && news.category !== params.category) {
          return false;
        }
        return true;
      }).slice(0, params.limit || 10);
    } catch (error) {
      console.error('Error getting local news:', error);
      throw new Error('Terjadi kesalahan dalam mengambil berita lokal');
    }
  }

  async getLocalServices(location: string): Promise<any[]> {
    try {
      // TODO: Integrate with actual local services API
      // For now, return mock data
      
      const mockServices = [
        {
          id: 'service-1',
          name: 'Rumah Sakit Umum',
          type: 'Kesehatan',
          location: location,
          description: 'Layanan kesehatan 24 jam'
        },
        {
          id: 'service-2',
          name: 'Kantor Polisi',
          type: 'Keamanan',
          location: location,
          description: 'Layanan keamanan dan pengaduan'
        },
        {
          id: 'service-3',
          name: 'Kantor Pos',
          type: 'Pos',
          location: location,
          description: 'Layanan pos dan pengiriman'
        }
      ];

      return mockServices;
    } catch (error) {
      console.error('Error getting local services:', error);
      throw new Error('Terjadi kesalahan dalam mengambil layanan lokal');
    }
  }

  async getEmergencyContacts(city: string): Promise<any[]> {
    try {
      // TODO: Integrate with actual emergency contacts API
      // For now, return mock data
      
      const mockContacts = [
        {
          id: 'emergency-1',
          name: 'Polisi',
          number: '110',
          type: 'Keamanan',
          description: 'Layanan darurat kepolisian'
        },
        {
          id: 'emergency-2',
          name: 'Ambulans',
          number: '118',
          type: 'Kesehatan',
          description: 'Layanan darurat medis'
        },
        {
          id: 'emergency-3',
          name: 'Pemadam Kebakaran',
          number: '113',
          type: 'Kebakaran',
          description: 'Layanan darurat kebakaran'
        }
      ];

      return mockContacts;
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      throw new Error('Terjadi kesalahan dalam mengambil kontak darurat');
    }
  }
}