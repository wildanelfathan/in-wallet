import express from 'express';
import { LocalController } from '../controllers/localController';

const router = express.Router();
const localController = new LocalController();

// GET /api/local/transportation
router.get('/transportation', async (req, res) => {
  try {
    const { origin, destination, type = 'all' } = req.query;
    
    if (!origin || !destination) {
      return res.status(400).json({ 
        error: 'Origin dan destination diperlukan' 
      });
    }

    const options = await localController.getTransportationOptions(
      origin as string, 
      destination as string, 
      type as string
    );
    
    res.json(options);
  } catch (error) {
    console.error('Error getting transportation options:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam mengambil opsi transportasi' 
    });
  }
});

// GET /api/local/food-recommendations
router.get('/food-recommendations', async (req, res) => {
  try {
    const { location, cuisine, priceRange, rating } = req.query;
    
    const recommendations = await localController.getFoodRecommendations({
      location: location as string,
      cuisine: cuisine as string,
      priceRange: priceRange as string,
      rating: rating as string
    });
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting food recommendations:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam mengambil rekomendasi makanan' 
    });
  }
});

// GET /api/local/cultural-events
router.get('/cultural-events', async (req, res) => {
  try {
    const { city, date, category } = req.query;
    
    const events = await localController.getCulturalEvents({
      city: city as string,
      date: date as string,
      category: category as string
    });
    
    res.json(events);
  } catch (error) {
    console.error('Error getting cultural events:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam mengambil acara budaya' 
    });
  }
});

// GET /api/local/shopping-recommendations
router.get('/shopping-recommendations', async (req, res) => {
  try {
    const { category, location, priceRange, brand } = req.query;
    
    const recommendations = await localController.getShoppingRecommendations({
      category: category as string,
      location: location as string,
      priceRange: priceRange as string,
      brand: brand as string
    });
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting shopping recommendations:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam mengambil rekomendasi belanja' 
    });
  }
});

// GET /api/local/weather
router.get('/weather', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ 
        error: 'Nama kota diperlukan' 
      });
    }

    const weather = await localController.getWeather(city as string);
    res.json(weather);
  } catch (error) {
    console.error('Error getting weather:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam mengambil informasi cuaca' 
    });
  }
});

// GET /api/local/traffic
router.get('/traffic', async (req, res) => {
  try {
    const { origin, destination } = req.query;
    
    if (!origin || !destination) {
      return res.status(400).json({ 
        error: 'Origin dan destination diperlukan' 
      });
    }

    const traffic = await localController.getTrafficInfo(
      origin as string, 
      destination as string
    );
    
    res.json(traffic);
  } catch (error) {
    console.error('Error getting traffic info:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam mengambil informasi lalu lintas' 
    });
  }
});

// GET /api/local/local-news
router.get('/local-news', async (req, res) => {
  try {
    const { city, category, limit = 10 } = req.query;
    
    const news = await localController.getLocalNews({
      city: city as string,
      category: category as string,
      limit: parseInt(limit as string)
    });
    
    res.json(news);
  } catch (error) {
    console.error('Error getting local news:', error);
    res.status(500).json({ 
      error: 'Terjadi kesalahan dalam mengambil berita lokal' 
    });
  }
});

export default router;