import { Router, Request, Response } from 'express';
import { WeatherService, DISTRICT_COORDINATES } from '../services/weather/weatherService.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

export const weatherRouter = Router();

weatherRouter.get('/current', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { location, lat, lon } = req.query;

    const targetLoc = (location as string) || req.user?.district || 'Pune';
    const latitude = lat ? parseFloat(lat as string) : undefined;
    const longitude = lon ? parseFloat(lon as string) : undefined;

    const weather = await WeatherService.getLiveWeather(targetLoc, latitude, longitude);

    res.json({
      success: true,
      weather
    });
  } catch (err) {
    console.error('Weather route error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve weather data. Please try again.'
    });
  }
});

weatherRouter.get('/locations', (_req: Request, res: Response): void => {
  const list = Object.entries(DISTRICT_COORDINATES).map(([key, item]) => ({
    id: key,
    name: item.name,
    latitude: item.lat,
    longitude: item.lon
  }));

  res.json({ success: true, locations: list });
});
