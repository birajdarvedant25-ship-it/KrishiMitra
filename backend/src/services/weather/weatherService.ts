export interface WeatherData {
  locationName: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  rainfallMm: number;
  weatherCode: number;
  condition: string;
  conditionIcon: string;
  isDay: boolean;
  forecast: Array<{
    date: string;
    dayName: string;
    maxTemp: number;
    minTemp: number;
    rainProbability: number;
    condition: string;
    conditionIcon: string;
  }>;
  agriculturalImpact: {
    spraySuitability: {
      status: 'good' | 'caution' | 'poor';
      reason: { en: string; hi: string; mr: string };
    };
    fungalDiseaseRisk: 'low' | 'medium' | 'high';
    heatStressLevel: 'normal' | 'moderate' | 'severe';
    irrigationAdvice: { en: string; hi: string; mr: string };
  };
}

// Indian agricultural coordinates lookup (Maharashtra focus + Indian capitals)
export const DISTRICT_COORDINATES: Record<string, { lat: number; lon: number; name: { en: string; hi: string; mr: string } }> = {
  pune: { lat: 18.5204, lon: 73.8567, name: { en: 'Pune', hi: 'पुणे', mr: 'पुणे' } },
  nashik: { lat: 19.9975, lon: 73.7898, name: { en: 'Nashik', hi: 'नासिक', mr: 'नाशिक' } },
  ahmednagar: { lat: 19.0948, lon: 74.748, name: { en: 'Ahmednagar', hi: 'अहमदनगर', mr: 'अहिल्यानगर' } },
  nagpur: { lat: 21.1458, lon: 79.0882, name: { en: 'Nagpur', hi: 'नागपुर', mr: 'नागपूर' } },
  aurangabad: { lat: 19.8762, lon: 75.3433, name: { en: 'Chhatrapati Sambhajinagar', hi: 'छत्रपति संभाजीनगर', mr: 'छत्रपती संभाजीनगर' } },
  solapur: { lat: 17.6599, lon: 75.9064, name: { en: 'Solapur', hi: 'सोलापुर', mr: 'सोलापूर' } },
  kolhapur: { lat: 16.705, lon: 74.2433, name: { en: 'Kolhapur', hi: 'कोल्हापुर', mr: 'कोल्हापूर' } },
  satara: { lat: 17.6805, lon: 74.0183, name: { en: 'Satara', hi: 'सतारा', mr: 'सातारा' } },
  sangli: { lat: 16.8524, lon: 74.5815, name: { en: 'Sangli', hi: 'सांगली', mr: 'सांगली' } },
  jalgaon: { lat: 21.0077, lon: 75.5626, name: { en: 'Jalgaon', hi: 'जलगांव', mr: 'जळगाव' } },
  amravati: { lat: 20.9374, lon: 77.7796, name: { en: 'Amravati', hi: 'अमरावती', mr: 'अमरावती' } },
  nanded: { lat: 19.1383, lon: 77.321, name: { en: 'Nanded', hi: 'नांदेड़', mr: 'नांदेड' } },
  latur: { lat: 18.4088, lon: 76.5604, name: { en: 'Latur', hi: 'लातूर', mr: 'लातूर' } },
  akola: { lat: 20.7002, lon: 77.0082, name: { en: 'Akola', hi: 'अकोला', mr: 'अकोला' } },
  buldhana: { lat: 20.5306, lon: 76.1822, name: { en: 'Buldhana', hi: 'बुलढाणा', mr: 'बुलढाणा' } },
  beed: { lat: 18.9891, lon: 75.7601, name: { en: 'Beed', hi: 'बीड', mr: 'बीड' } },
  dhule: { lat: 20.9042, lon: 74.7749, name: { en: 'Dhule', hi: 'धुले', mr: 'धुळे' } },
  jalna: { lat: 19.8347, lon: 75.8816, name: { en: 'Jalna', hi: 'जालना', mr: 'जालना' } },
  osmanabad: { lat: 18.1861, lon: 76.0419, name: { en: 'Dharashiv', hi: 'धाराशिव', mr: 'धाराशिव' } },
  parbhani: { lat: 19.2685, lon: 76.7719, name: { en: 'Parbhani', hi: 'परभणी', mr: 'परभणी' } },
  yavatmal: { lat: 20.3888, lon: 78.1204, name: { en: 'Yavatmal', hi: 'यवतमाल', mr: 'यवतमाळ' } },
  wardha: { lat: 20.7453, lon: 78.6022, name: { en: 'Wardha', hi: 'वर्धा', mr: 'वर्धा' } },
  chandrapur: { lat: 19.9615, lon: 79.2961, name: { en: 'Chandrapur', hi: 'चंद्रपुर', mr: 'चंद्रपूर' } },
  mumbai: { lat: 19.076, lon: 72.8777, name: { en: 'Mumbai', hi: 'मुंबई', mr: 'मुंबई' } },
  thane: { lat: 19.2183, lon: 72.9781, name: { en: 'Thane', hi: 'ठाणे', mr: 'ठाणे' } },
  ratnagiri: { lat: 16.9902, lon: 73.312, name: { en: 'Ratnagiri', hi: 'रत्नागिरी', mr: 'रत्नागिरी' } },
  delhi: { lat: 28.6139, lon: 77.209, name: { en: 'New Delhi', hi: 'नई दिल्ली', mr: 'नवी दिल्ली' } },
  bhopal: { lat: 23.2599, lon: 77.4126, name: { en: 'Bhopal', hi: 'भोपाल', mr: 'भोपाळ' } },
  lucknow: { lat: 26.8467, lon: 80.9462, name: { en: 'Lucknow', hi: 'लखनऊ', mr: 'लखनौ' } },
  hyderabad: { lat: 17.385, lon: 78.4867, name: { en: 'Hyderabad', hi: 'हैदराबाद', mr: 'हैदराबाद' } },
  bengaluru: { lat: 12.9716, lon: 77.5946, name: { en: 'Bengaluru', hi: 'बेंगलुरु', mr: 'बंगळुरू' } }
};

function interpretWmoCode(code: number): { text: string; icon: string } {
  if (code === 0) return { text: 'Clear Sky', icon: 'Sun' };
  if (code === 1 || code === 2) return { text: 'Partly Cloudy', icon: 'CloudSun' };
  if (code === 3) return { text: 'Overcast', icon: 'Cloud' };
  if (code >= 45 && code <= 48) return { text: 'Foggy', icon: 'CloudFog' };
  if (code >= 51 && code <= 55) return { text: 'Light Drizzle', icon: 'CloudDrizzle' };
  if (code >= 61 && code <= 65) return { text: 'Rainy', icon: 'CloudRain' };
  if (code >= 80 && code <= 82) return { text: 'Rain Showers', icon: 'CloudRain' };
  if (code >= 95) return { text: 'Thunderstorm', icon: 'CloudLightning' };
  return { text: 'Partly Cloudy', icon: 'CloudSun' };
}

export class WeatherService {
  static resolveCoordinates(locationOrDistrict?: string, lat?: number, lon?: number): { lat: number; lon: number; name: string } {
    if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
      return { lat, lon, name: locationOrDistrict || 'Current Location' };
    }

    if (locationOrDistrict) {
      const clean = locationOrDistrict.toLowerCase().trim().replace(/[^a-z]/g, '');
      const matchKey = Object.keys(DISTRICT_COORDINATES).find(
        (key) => clean.includes(key) || key.includes(clean)
      );
      if (matchKey) {
        const found = DISTRICT_COORDINATES[matchKey];
        return { lat: found.lat, lon: found.lon, name: found.name.en };
      }
    }

    // Default to Pune, Maharashtra (major agricultural hub)
    const def = DISTRICT_COORDINATES.pune;
    return { lat: def.lat, lon: def.lon, name: 'Pune, Maharashtra' };
  }

  static async getLiveWeather(locationOrDistrict?: string, lat?: number, lon?: number): Promise<WeatherData> {
    const coords = this.resolveCoordinates(locationOrDistrict, lat, lon);

    try {
      // Free Open-Meteo API (zero API key required, reliable for India)
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=Asia%2FKolkata&forecast_days=6`;

      const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!response.ok) {
        throw new Error(`Open-Meteo API returned status ${response.status}`);
      }

      const data = (await response.json()) as any;
      const current = data.current;
      const daily = data.daily;

      const code = current.weather_code ?? 0;
      const cond = interpretWmoCode(code);
      const temp = Math.round(current.temperature_2m);
      const humidity = Math.round(current.relative_humidity_2m);
      const wind = Math.round(current.wind_speed_10m);
      const rainProb = daily.precipitation_probability_max?.[0] || 0;
      const rainMm = current.precipitation || 0;

      // Calculate agricultural indicators
      const spraySuitability = this.calculateSpraySuitability(wind, rainProb, humidity);
      const fungalDiseaseRisk = humidity > 80 && temp >= 20 && temp <= 30 ? 'high' : humidity > 65 ? 'medium' : 'low';
      const heatStressLevel = temp >= 38 ? 'severe' : temp >= 34 ? 'moderate' : 'normal';
      const irrigationAdvice = this.calculateIrrigationAdvice(rainProb, rainMm, temp, humidity);

      const forecastList = (daily.time || []).slice(0, 5).map((dateStr: string, idx: number) => {
        const d = new Date(dateStr);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayCond = interpretWmoCode(daily.weather_code[idx]);
        return {
          date: dateStr,
          dayName: idx === 0 ? 'Today' : dayNames[d.getDay()],
          maxTemp: Math.round(daily.temperature_2m_max[idx]),
          minTemp: Math.round(daily.temperature_2m_min[idx]),
          rainProbability: daily.precipitation_probability_max[idx] || 0,
          condition: dayCond.text,
          conditionIcon: dayCond.icon
        };
      });

      return {
        locationName: coords.name,
        latitude: coords.lat,
        longitude: coords.lon,
        temperature: temp,
        feelsLike: Math.round(current.apparent_temperature || temp),
        humidity,
        windSpeed: wind,
        rainProbability: rainProb,
        rainfallMm: rainMm,
        weatherCode: code,
        condition: cond.text,
        conditionIcon: cond.icon,
        isDay: current.is_day === 1,
        forecast: forecastList,
        agriculturalImpact: {
          spraySuitability,
          fungalDiseaseRisk,
          heatStressLevel,
          irrigationAdvice
        }
      };
    } catch (err) {
      console.warn('Live weather fetch failed, returning realistic agricultural fallback weather:', err);
      return this.getMockWeatherData(coords.name, coords.lat, coords.lon);
    }
  }

  private static calculateSpraySuitability(windSpeed: number, rainProb: number, humidity: number) {
    if (rainProb > 50) {
      return {
        status: 'poor' as const,
        reason: {
          en: 'Rain is likely. Chemical or bio-sprays will wash off leaves without effect.',
          hi: 'बारिश की अधिक संभावना है। दवा पत्तियों से धुल जाएगी।',
          mr: 'पावसाची शक्यता जास्त आहे. औषध पानांवरून वाहून जाईल.'
        }
      };
    }
    if (windSpeed > 18) {
      return {
        status: 'poor' as const,
        reason: {
          en: 'Wind speed is high (> 18 km/h). Spray drift can cause wastage and poor coverage.',
          hi: 'हवा की गति तेज है। स्प्रे का बहाव होने से दवा बर्बाद होगी।',
          mr: 'वाऱ्याचा वेग जास्त आहे (> १८ किमी/तास). औषध हवेने इतरत्र उडेल.'
        }
      };
    }
    if (windSpeed > 12 || humidity > 85) {
      return {
        status: 'caution' as const,
        reason: {
          en: 'Moderate conditions. Spray during early morning (7-9 AM) or late afternoon.',
          hi: 'मध्यम स्थिति। सुबह जल्दी या शाम 4 बजे के बाद ही छिड़काव करें।',
          mr: 'मध्यम परिस्थिती. सकाळी लवकर किंवा दुपारी ४ नंतरच फवारणी करा.'
        }
      };
    }
    return {
      status: 'good' as const,
      reason: {
        en: 'Favorable spray weather. Low wind and dry foliage.',
        hi: 'छिड़काव के लिए अनुकूल मौसम। हवा शांत और पत्तियां सूखी हैं।',
        mr: 'फवारणीसाठी उत्तम हवामान. मंद वारा आणि कोरडी पाने.'
      }
    };
  }

  private static calculateIrrigationAdvice(rainProb: number, rainMm: number, temp: number, humidity: number) {
    if (rainMm > 8 || rainProb >= 65) {
      return {
        en: 'Rain is likely today/tomorrow. Postpone irrigation to avoid waterlogging and root asphyxiation.',
        hi: 'आज/कल बारिश की संभावना है। जलभराव से बचने के लिए सिंचाई टालें।',
        mr: 'आज/उद्या पावसाची शक्यता आहे. पाणी साचू नये म्हणून पाणी देणे पुढे ढकला.'
      };
    }
    if (temp > 35 && humidity < 40) {
      return {
        en: 'High heat and low humidity. Irrigate in early morning or evening to replenish transpiration loss.',
        hi: 'अधिक तापमान व शुष्क मौसम। वाष्पीकरण की भरपाई के लिए सुबह या शाम को सिंचाई करें।',
        mr: 'जास्त तापमान व कोरडी हवा. ओलावा टिकवण्यासाठी सकाळी किंवा संध्याकाळी पाणी द्या.'
      };
    }
    return {
      en: 'Normal weather conditions. Maintain standard irrigation schedule based on soil moisture check.',
      hi: 'सामान्य मौसम स्थिति। मिट्टी में नमी जांचकर सामान्य समय सारणी अनुसार पानी दें।',
      mr: 'हवामान सामान्य आहे. जमिनीत ओलावा तपासून नियमित वेळेनुसार पाणी द्या.'
    };
  }

  static getMockWeatherData(name: string, lat: number, lon: number): WeatherData {
    return {
      locationName: name || 'Nashik, Maharashtra',
      latitude: lat || 19.9975,
      longitude: lon || 73.7898,
      temperature: 29,
      feelsLike: 31,
      humidity: 68,
      windSpeed: 11,
      rainProbability: 25,
      rainfallMm: 0,
      weatherCode: 1,
      condition: 'Partly Cloudy',
      conditionIcon: 'CloudSun',
      isDay: true,
      forecast: [
        { date: 'Today', dayName: 'Today', maxTemp: 31, minTemp: 21, rainProbability: 20, condition: 'Partly Cloudy', conditionIcon: 'CloudSun' },
        { date: 'Tomorrow', dayName: 'Thu', maxTemp: 32, minTemp: 22, rainProbability: 15, condition: 'Sunny', conditionIcon: 'Sun' },
        { date: 'Day 3', dayName: 'Fri', maxTemp: 30, minTemp: 20, rainProbability: 40, condition: 'Cloudy', conditionIcon: 'Cloud' },
        { date: 'Day 4', dayName: 'Sat', maxTemp: 28, minTemp: 19, rainProbability: 60, condition: 'Showers', conditionIcon: 'CloudRain' },
        { date: 'Day 5', dayName: 'Sun', maxTemp: 29, minTemp: 20, rainProbability: 30, condition: 'Partly Cloudy', conditionIcon: 'CloudSun' }
      ],
      agriculturalImpact: {
        spraySuitability: {
          status: 'good',
          reason: {
            en: 'Favorable spray weather. Low wind and dry foliage.',
            hi: 'छिड़काव के लिए अनुकूल मौसम। हवा शांत और पत्तियां सूखी हैं।',
            mr: 'फवारणीसाठी उत्तम हवामान. मंद वारा आणि कोरडी पाने.'
          }
        },
        fungalDiseaseRisk: 'medium',
        heatStressLevel: 'normal',
        irrigationAdvice: {
          en: 'Normal weather conditions. Check soil moisture before scheduled watering.',
          hi: 'सामान्य मौसम। पानी देने से पहले मिट्टी की नमी जांच लें।',
          mr: 'हवामान सामान्य आहे. पाणी देण्यापूर्वी जमिनीतील ओलावा तपासा.'
        }
      }
    };
  }
}
