export interface IrrigationCalculationInput {
  cropName: string;
  growthStage?: string;
  soilType?: string; // Sandy, Loamy, Clay, Black Soil
  irrigationMethod?: string; // Drip, Sprinkler, Flood/Furrow
  recentRainfallMm?: number;
  upcomingRainProbability?: number;
  temperature?: number;
  soilMoistureLevel?: 'dry' | 'moderate' | 'wet';
  language?: 'en' | 'hi' | 'mr';
}

export interface IrrigationRecommendation {
  status: 'irrigate_now' | 'irrigate_lightly' | 'delay_irrigation' | 'no_irrigation_needed';
  title: string;
  recommendation: string;
  reason: string;
  weatherInfluence: string;
  soilConsiderations: string;
  suggestedAction: string;
  waterSavingTip: string;
}

export class IrrigationService {
  static calculateRecommendation(input: IrrigationCalculationInput): IrrigationRecommendation {
    const lang = input.language || 'en';
    const rainExpected = (input.upcomingRainProbability || 0) >= 60 || (input.recentRainfallMm || 0) > 10;
    const isSoilWet = input.soilMoistureLevel === 'wet';
    const isSoilDry = input.soilMoistureLevel === 'dry';
    const isHot = (input.temperature || 28) > 34;
    const soil = (input.soilType || 'loam').toLowerCase();
    const isBlackSoil = soil.includes('black') || soil.includes('clay');
    const isSandy = soil.includes('sandy');

    let status: IrrigationRecommendation['status'] = 'irrigate_lightly';

    if (rainExpected || isSoilWet) {
      status = 'delay_irrigation';
    } else if (isSoilDry || (isHot && !rainExpected)) {
      status = 'irrigate_now';
    } else {
      status = 'irrigate_lightly';
    }

    const messages = {
      en: {
        titles: {
          irrigate_now: 'Irrigation Recommended Today',
          irrigate_lightly: 'Light / Moderate Irrigation Needed',
          delay_irrigation: 'Delay Irrigation — Sufficient Moisture / Rain Forecast',
          no_irrigation_needed: 'No Irrigation Needed'
        },
        reasons: {
          delay_irrigation: rainExpected
            ? 'High probability of upcoming rain or significant recent rainfall detected.'
            : 'Soil moisture is currently optimal. Excess watering can cause root rot.',
          irrigate_now: isSoilDry
            ? 'Soil moisture is low and plants are at risk of moisture stress.'
            : 'High temperature accelerates plant evapotranspiration.',
          irrigate_lightly: 'Crop is in steady growth phase; maintain consistent root-zone moisture.'
        },
        weatherInfluence: `Forecast indicates ${(input.upcomingRainProbability || 0)}% chance of rain with current temperature around ${input.temperature || 28}°C.`,
        soilConsiderations: isBlackSoil
          ? 'Black/Clay soil has high water retention. Water slowly and avoid ponding.'
          : isSandy
          ? 'Sandy soil drains very quickly. Shorter, more frequent irrigation cycles are optimal.'
          : 'Loamy soil retains good balance of moisture and aeration.',
        suggestedAction: 'Always perform the simple ball test: grab a handful of soil from 4 inches depth; if it holds form without crumbling, moisture is adequate.',
        waterSavingTip: input.irrigationMethod?.toLowerCase().includes('drip')
          ? 'Drip irrigation saves 40-60% water compared to furrow flooding. Operate during early morning hours to minimize evaporation.'
          : 'Consider shifting to drip irrigation or mulching crop beds to reduce water evaporation by up to 50%.'
      },
      hi: {
        titles: {
          irrigate_now: 'आज सिंचाई की सलाह दी जाती है',
          irrigate_lightly: 'हल्की या मध्यम सिंचाई करें',
          delay_irrigation: 'सिंचाई टालें — बारिश की संभावना या पर्याप्त नमी',
          no_irrigation_needed: 'अभी सिंचाई की आवश्यकता नहीं है'
        },
        reasons: {
          delay_irrigation: rainExpected
            ? 'आने वाले समय में बारिश की संभावना या हालिया वर्षा दर्ज की गई है।'
            : 'मिट्टी में पर्याप्त नमी बनी हुई है। अधिक पानी देने से जड़ सड़न हो सकती है।',
          irrigate_now: isSoilDry
            ? 'मिट्टी में नमी कम है, जिससे फसल में तनाव आ सकता है।'
            : 'अधिक तापमान के कारण पानी की खपत बढ़ गई है।',
          irrigate_lightly: 'फसल की सामान्य वृद्धि हेतु जड़ क्षेत्र में समान नमी बनाए रखें।'
        },
        weatherInfluence: `मौसम पूर्वानुमान: ${input.upcomingRainProbability || 0}% बारिश की संभावना और तापमान लगभग ${input.temperature || 28}°C है।`,
        soilConsiderations: isBlackSoil
          ? 'काली/चिकनी मिट्टी में पानी सोखने की क्षमता अधिक होती है। जलभराव न होने दें।'
          : isSandy
          ? 'बलुई मिट्टी से पानी तेजी से रिस जाता है। कम पानी बार-बार देना लाभदायक है।'
          : 'दोमट मिट्टी में नमी और हवा का संतुलन अच्छा रहता है।',
        suggestedAction: 'खेत में 4 इंच गहराई से मुट्ठी भर मिट्टी लेकर लड्डू बनाकर देखें; यदि लड्डू आसानी से बनता है तो नमी पर्याप्त है।',
        waterSavingTip: input.irrigationMethod?.toLowerCase().includes('drip')
          ? 'ड्रिप सिंचाई से 40-60% पानी की बचत होती है। वाष्पीकरण रोकने के लिए सुबह के समय ही पानी चलाएं।'
          : 'पानी की बचत और नमी बनाए रखने के लिए मेड़ों पर सूखी घास या मल्चिंग का उपयोग करें।'
      },
      mr: {
        titles: {
          irrigate_now: 'आज पाणी देण्याची शिफारस आहे',
          irrigate_lightly: 'हलके किंवा मध्यम पाणी द्यावे',
          delay_irrigation: 'पाणी देणे पुढे ढकला — पावसाचा अंदाज किंवा पुरेसा ओलावा',
          no_irrigation_needed: 'सध्या पाणी देण्याची आवश्यकता नाही'
        },
        reasons: {
          delay_irrigation: rainExpected
            ? 'पावसाचा अंदाज आहे किंवा नुकताच पाऊस झाला आहे. पाणी साचल्यास मुळे सडू शकतात.'
            : 'जमिनीत पुरेसा ओलावा आहे. अति पाण्यामुळे पिकाला अपाय होऊ शकतो.',
          irrigate_now: isSoilDry
            ? 'जमिनीत ओलावा कमी झाला असून पिकाला पाण्याची तातडीने गरज आहे.'
            : 'जास्त तापमानामुळे बाष्पीभवन वाढले आहे.',
          irrigate_lightly: 'पिकाच्या चांगल्या वाढीसाठी मुळांच्या भागात हलका ओलावा टिकवून ठेवा.'
        },
        weatherInfluence: `हवामान अंदाज: ${input.upcomingRainProbability || 0}% पावसाची शक्यता आणि तापमान सुमारे ${input.temperature || 28}°C आहे.`,
        soilConsiderations: isBlackSoil
          ? 'काळी किंवा चिकणमाती पाणी जास्त वेळ धरून ठेवते. वाफ्यात पाणी साचणार नाही याची काळजी घ्या.'
          : isSandy
          ? 'हलकी किंवा वाळूयुक्त जमीन लवकर कोरडी होते. कमी प्रमाणात वारंवार पाणी देणे योग्य ठरेल.'
          : 'मध्यम जमिनीत हवा व पाणी संतुलन चांगले राहते.',
        suggestedAction: 'जमिनीतील ४ इंच खोलीवरील माती हातात घेऊन लाडू वळून पहा; मातीचा गोळा झाला तर ओलावा पुरेसा आहे.',
        waterSavingTip: input.irrigationMethod?.toLowerCase().includes('drip')
          ? 'ठिबक सिंचनामुळे ४०-६०% पाण्याची बचत होते. उन्हाच्या वेळेत न चालवता सकाळी लवकर ठिबक चालू करा.'
          : 'बाष्पीभवन रोखण्यासाठी आणि पाणी वाचवण्यासाठी पिकाच्या ओळीत पालापाचोळ्याचे आच्छादन (मल्चिंग) करा.'
      }
    };

    const t = messages[lang] || messages.en;

    return {
      status,
      title: t.titles[status],
      recommendation: status === 'delay_irrigation'
        ? t.titles.delay_irrigation
        : status === 'irrigate_now'
        ? t.titles.irrigate_now
        : t.titles.irrigate_lightly,
      reason: t.reasons[status],
      weatherInfluence: t.weatherInfluence,
      soilConsiderations: t.soilConsiderations,
      suggestedAction: t.suggestedAction,
      waterSavingTip: t.waterSavingTip
    };
  }
}
