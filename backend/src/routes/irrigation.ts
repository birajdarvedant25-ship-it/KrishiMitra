import { Router, Response } from 'express';
import { IrrigationService } from '../services/irrigation/irrigationService.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';
import { WeatherService } from '../services/weather/weatherService.js';

export const irrigationRouter = Router();

irrigationRouter.post('/calculate', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      cropName,
      growthStage,
      soilType,
      irrigationMethod,
      recentRainfallMm,
      upcomingRainProbability,
      temperature,
      soilMoistureLevel,
      language
    } = req.body;

    const lang = ['en', 'hi', 'mr'].includes(language)
      ? language
      : req.user?.preferredLanguage || 'en';

    // If weather data was not directly supplied by client, fetch current location weather automatically
    let rainProb = upcomingRainProbability;
    let temp = temperature;

    if (rainProb === undefined || temp === undefined) {
      const weather = await WeatherService.getLiveWeather(req.user?.district || 'Pune');
      if (rainProb === undefined) rainProb = weather.rainProbability;
      if (temp === undefined) temp = weather.temperature;
    }

    const recommendation = IrrigationService.calculateRecommendation({
      cropName: cropName || 'General Crop',
      growthStage,
      soilType: soilType || 'Medium Black Soil',
      irrigationMethod: irrigationMethod || 'Drip Irrigation',
      recentRainfallMm: Number(recentRainfallMm || 0),
      upcomingRainProbability: Number(rainProb || 0),
      temperature: Number(temp || 28),
      soilMoistureLevel,
      language: lang
    });

    res.json({
      success: true,
      recommendation
    });
  } catch (err) {
    console.error('Irrigation calculation error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate irrigation advisory.'
    });
  }
});
