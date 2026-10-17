import { Router, Response } from 'express';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';
import { AIService } from '../services/ai/aiService.js';
import { WeatherService } from '../services/weather/weatherService.js';
import { db } from '../db/index.js';

export const advisorRouter = Router();

// Daily Farm Advisory Summary
advisorRouter.get('/daily', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lang = req.user?.preferredLanguage || (req.query.lang as 'en' | 'hi' | 'mr') || 'en';
    const district = req.user?.district || (req.query.location as string) || 'Pune';

    const weather = await WeatherService.getLiveWeather(district);
    const crops = req.user?.id ? db.crops.findByUserId(req.user.id) : [];

    const advisories = {
      en: {
        farmingAdvice: weather.rainProbability > 50
          ? 'Rain showers are forecasted. Hold off on foliar fertilizer application and clear field water outlets.'
          : 'Favorable clear conditions. Ideal day for field scouting, intercultural weeding, and organic maintenance.',
        irrigationTip: weather.agriculturalImpact.irrigationAdvice.en,
        diseaseWarning: weather.agriculturalImpact.fungalDiseaseRisk === 'high'
          ? 'Elevated risk of fungal blights due to high moisture. Scout lower leaves and apply organic bio-agents.'
          : 'Low to moderate disease pressure today.',
        sprayTip: weather.agriculturalImpact.spraySuitability.reason.en,
        weatherSummary: `${weather.condition}, ${weather.temperature}°C with ${weather.rainProbability}% chance of rain.`
      },
      hi: {
        farmingAdvice: weather.rainProbability > 50
          ? 'बारिश की संभावना है। पत्तियों पर छिड़काव रोकें और खेत से जल निकासी के रास्ते साफ रखें।'
          : 'मौसम खुला रहेगा। खेत की निगरानी, निराई-गुड़ाई एवं जैविक देखभाल के लिए उत्तम समय है।',
        irrigationTip: weather.agriculturalImpact.irrigationAdvice.hi,
        diseaseWarning: weather.agriculturalImpact.fungalDiseaseRisk === 'high'
          ? 'अधिक नमी के कारण फफूंद जनित रोगों का खतरा अधिक है। पत्तियों के निचले भाग की जांच करें।'
          : 'आज रोगों का खतरा सामान्य से कम है।',
        sprayTip: weather.agriculturalImpact.spraySuitability.reason.hi,
        weatherSummary: `${weather.condition}, तापमान ${weather.temperature}°C और ${weather.rainProbability}% बारिश की संभावना।`
      },
      mr: {
        farmingAdvice: weather.rainProbability > 50
          ? 'पावसाचा अंदाज आहे. खते किंवा फवारणी देणे टाळा आणि शेतातील पाण्याचा निचरा योग्य राहील याची खात्री करा.'
          : 'हवामान अनुकूल आहे. पिकाची पाहणी, खुरपणी आणि सेंद्रिय खतांच्या वापरासाठी उत्तम दिवस आहे.',
        irrigationTip: weather.agriculturalImpact.irrigationAdvice.mr,
        diseaseWarning: weather.agriculturalImpact.fungalDiseaseRisk === 'high'
          ? 'जास्त आर्द्रतेमुळे करपा किंवा बुरशीजन्य रोगांचा प्रादुर्भाव वाढू शकतो. ट्रायकोडर्माचा प्रतिबंधात्मक वापर करा.'
          : 'आज रोगांचा प्रादुर्भाव वाढण्याचा धोका कमी आहे.',
        sprayTip: weather.agriculturalImpact.spraySuitability.reason.mr,
        weatherSummary: `${weather.condition}, तापमान ${weather.temperature}°C आणि ${weather.rainProbability}% पावसाची शक्यता.`
      }
    };

    const selectedAdvisory = advisories[lang] || advisories.en;

    res.json({
      success: true,
      advisory: selectedAdvisory,
      weather,
      cropCount: crops.length
    });
  } catch (err) {
    console.error('Daily advisory error:', err);
    res.status(500).json({ success: false, message: 'Could not generate daily advisory.' });
  }
});

// Conversational Chat with AI Farmer Assistant
advisorRouter.post('/chat', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, history = [], language, location, crop } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, message: 'Message content is required.' });
      return;
    }

    const lang = ['en', 'hi', 'mr'].includes(language)
      ? language
      : req.user?.preferredLanguage || 'en';

    const userLocation = location || req.user?.district || 'Maharashtra, India';
    const activeCrop = crop || (req.user?.id ? db.crops.findByUserId(req.user.id).map(c => c.cropName).join(', ') : 'Crops');

    // Context for AI
    const context = {
      location: userLocation,
      crop: activeCrop,
      weather: 'Live farm context'
    };

    const result = await AIService.chat(message, history, context, lang as 'en' | 'hi' | 'mr');

    res.json({
      success: true,
      reply: result.response,
      providerUsed: result.providerUsed
    });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({
      success: false,
      message: 'AI Assistant could not respond at this moment. Please try again.'
    });
  }
});
