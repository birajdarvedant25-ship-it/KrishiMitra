import { Alert } from '../../db/index.js';
import { WeatherData } from '../weather/weatherService.js';
import { v4 as uuidv4 } from 'uuid';

export class AlertService {
  static generateAlertsForWeatherAndCrops(weather: WeatherData, crops: Array<{ cropName: string }>, lang: 'en' | 'hi' | 'mr' = 'en'): Alert[] {
    const alerts: Alert[] = [];
    const now = new Date().toISOString();

    // 1. Rain Alert
    if (weather.rainProbability >= 60 || weather.rainfallMm > 5) {
      alerts.push({
        id: uuidv4(),
        type: 'rain',
        severity: weather.rainProbability >= 80 ? 'critical' : 'warning',
        title: lang === 'mr' ? '🌧️ पावसाचा इशारा' : lang === 'hi' ? '🌧️ भारी बारिश की चेतावनी' : '🌧️ Rain Alert',
        message: lang === 'mr'
          ? `पुढील २४ तासांत ${weather.rainProbability}% पावसाची शक्यता आहे. शेतात पाणी साचू नये म्हणून निचरा व्यवस्था तपासा आणि रासायनिक फवारणी टाळा.`
          : lang === 'hi'
          ? `अगले 24 घंटों में ${weather.rainProbability}% बारिश की संभावना है। जल निकासी की व्यवस्था करें और कीटनाशक छिड़काव स्थगित रखें।`
          : `${weather.rainProbability}% chance of rain forecast. Ensure proper drainage in fields and hold off on pesticide or foliar sprays.`,
        date: now,
        read: false
      });
    }

    // 2. Heat Alert
    if (weather.temperature >= 36) {
      alerts.push({
        id: uuidv4(),
        type: 'heat',
        severity: 'warning',
        title: lang === 'mr' ? '🔥 तीव्र उष्णतेचा इशारा' : lang === 'hi' ? '🔥 अत्यधिक गर्मी की चेतावनी' : '🔥 High Heat Advisory',
        message: lang === 'mr'
          ? `तापमान ${weather.temperature}°C वर पोहोचले आहे. पिकांमधील ओलावा टिकवण्यासाठी हलके पाणी द्यावे व दुपारच्या कडक उन्हात फवारणी करू नये.`
          : lang === 'hi'
          ? `तापमान ${weather.temperature}°C तक पहुंच गया है। पौधों को नमी के तनाव से बचाने के लिए सुबह या शाम को सिंचाई करें।`
          : `Temperature has reached ${weather.temperature}°C. Maintain soil moisture through light irrigation and avoid midday applications.`,
        date: now,
        read: false
      });
    }

    // 3. Fungal Disease Risk Alert
    if (weather.humidity >= 78 && weather.temperature >= 20 && weather.temperature <= 30) {
      const cropListStr = crops.map(c => c.cropName).join(', ') || 'Tomato, Chilli, Cotton';
      alerts.push({
        id: uuidv4(),
        type: 'disease',
        severity: 'warning',
        title: lang === 'mr' ? '🦠 बुरशीजन्य रोगाचा धोका' : lang === 'hi' ? '🦠 फफूंद जनित रोग का जोखिम' : '🦠 Fungal Disease Risk Alert',
        message: lang === 'mr'
          ? `हवेत आर्द्रता (${weather.humidity}%) जास्त असल्याने करपा किंवा तांबेरा रोगाचा प्रादुर्भाव वाढू शकतो (${cropListStr}). झाडांची पाहणी करा व सेंद्रिय ट्रायकोडर्मा किंवा ताक फवारणीचा विचार करा.`
          : lang === 'hi'
          ? `हवा में अधिक नमी (${weather.humidity}%) के कारण फफूंद जनित रोगों (जैसे झुलसा) का खतरा बढ़ गया है (${cropListStr})। जैविक ट्राइकोडर्मा का छिड़काव उपयोगी रहेगा।`
          : `High humidity (${weather.humidity}%) creates favorable conditions for fungal blights and rots in ${cropListStr}. Inspect lower leaves and consider preventative organic biocontrol.`,
        date: now,
        read: false
      });
    }

    // 4. Spraying Condition Notification
    if (weather.agriculturalImpact.spraySuitability.status === 'poor') {
      alerts.push({
        id: uuidv4(),
        type: 'pest',
        severity: 'info',
        title: lang === 'mr' ? '⚠️ आज फवारणी टाळा' : lang === 'hi' ? '⚠️ आज छिड़काव न करें' : '⚠️ Spraying Not Recommended Today',
        message: weather.agriculturalImpact.spraySuitability.reason[lang] || weather.agriculturalImpact.spraySuitability.reason.en,
        date: now,
        read: false
      });
    }

    return alerts;
  }
}
