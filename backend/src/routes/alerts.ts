import { Router, Response } from 'express';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';
import { db } from '../db/index.js';
import { WeatherService } from '../services/weather/weatherService.js';
import { AlertService } from '../services/alerts/alertService.js';

export const alertsRouter = Router();

alertsRouter.get('/', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lang = req.user?.preferredLanguage || (req.query.lang as 'en' | 'hi' | 'mr') || 'en';
    const district = req.user?.district || (req.query.location as string) || 'Pune';

    const weather = await WeatherService.getLiveWeather(district);
    const crops = req.user?.id ? db.crops.findByUserId(req.user.id) : [{ cropName: 'General Crops' }];

    // Generate weather and crop condition alerts
    const generatedAlerts = AlertService.generateAlertsForWeatherAndCrops(weather, crops, lang);

    // Stored custom or persisted alerts
    const storedAlerts = db.alerts.findByUserId(req.user?.id);

    // Combine unique
    const combined = [...generatedAlerts, ...storedAlerts];

    res.json({
      success: true,
      alerts: combined
    });
  } catch (err) {
    console.error('Alerts error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch alerts.' });
  }
});

alertsRouter.put('/:id/read', (req, res: Response): void => {
  const { id } = req.params;
  db.alerts.markAsRead(id);
  res.json({ success: true, message: 'Alert marked as read.' });
});
