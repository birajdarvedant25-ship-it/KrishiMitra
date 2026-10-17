import { AgriculturalKnowledgeService } from '../agriculture/knowledgeBase.js';

export interface DiseaseAnalysisResult {
  crop: string;
  issue_type?: string;
  possible_issue: string;
  confidence: number;
  symptoms: string[];
  severity: 'low' | 'medium' | 'high' | 'unknown';
  organic_solutions: string[];
  biological_solutions: string[];
  additional_treatment: string[];
  prevention: string[];
  warning: string;
  language: string;
  providerUsed: string;
  needs_better_image?: boolean;
}

export class MockAiService {
  static analyzeImage(filenameOrHint: string, selectedCrop?: string, lang: 'en' | 'hi' | 'mr' = 'en'): DiseaseAnalysisResult {
    const hint = (filenameOrHint + ' ' + (selectedCrop || '')).toLowerCase();

    let diseaseKey = 'early_blight';
    let sampleConfidence = 76;
    let sampleSeverity: 'low' | 'medium' | 'high' = 'low';

    if (hint.includes('cotton') || hint.includes('boll') || hint.includes('कापूस') || hint.includes('कपास')) {
      diseaseKey = 'pink_bollworm';
      sampleConfidence = 84;
      sampleSeverity = 'medium';
    } else if (hint.includes('chilli') || hint.includes('mirch') || hint.includes('curl') || hint.includes('मिरची')) {
      diseaseKey = 'chilli_leaf_curl';
      sampleConfidence = 79;
      sampleSeverity = 'medium';
    } else if (hint.includes('late') || hint.includes('rot') || hint.includes('बटाटा')) {
      diseaseKey = 'late_blight';
      sampleConfidence = 81;
      sampleSeverity = 'high';
    } else if (hint.includes('healthy') || hint.includes('निरोगी') || hint.includes('स्वस्थ')) {
      return {
        crop: selectedCrop || (lang === 'mr' ? 'पीक' : lang === 'hi' ? 'फसल' : 'Crop'),
        issue_type: 'healthy',
        possible_issue: lang === 'mr' ? 'निरोगी पीक (कोणतीही गंभीर कीड/रोग नाही)' : lang === 'hi' ? 'स्वस्थ पौधा (कोई गंभीर रोग नहीं)' : 'Healthy Plant (No visible pathogen)',
        confidence: 90,
        symptoms: [
          lang === 'mr' ? 'पाने ताजी व हिरवीगार दिसत आहेत' : lang === 'hi' ? 'पत्तियां हरी व स्वस्थ हैं' : 'Vibrant green foliage with regular cell structure'
        ],
        severity: 'low',
        organic_solutions: [
          lang === 'mr' ? 'नियमित जीवामृत किंवा सेंद्रिय खतांचा वापर सुरू ठेवा' : lang === 'hi' ? 'जीवामृत व जैविक पोषण जारी रखें' : 'Continue routine application of Jeevamrut and organic compost'
        ],
        biological_solutions: [],
        additional_treatment: [],
        prevention: [
          lang === 'mr' ? 'योग्य सिंचन व हवा खेळती ठेवा' : lang === 'hi' ? 'उचित सिंचाई व हवा का संचार बनाए रखें' : 'Maintain balanced watering and crop spacing'
        ],
        warning: 'SIMULATED DEMO RESULT: This is a synthetic mock response generated for local development.',
        language: lang,
        providerUsed: 'SIMULATED DEMO RESULT'
      };
    }

    const disease = AgriculturalKnowledgeService.getDisease(diseaseKey)!;

    const warnings = {
      en: 'SIMULATED DEMO RESULT: This is a synthetic mock response for testing. In production, configure GEMINI_API_KEY or OPENAI_API_KEY with active credits.',
      hi: 'अनुकरणित डेमो परिणाम (SIMULATED DEMO RESULT): यह केवल विकास परीक्षण हेतु है। वास्तविक एआई के लिए अपनी सक्रिय एपीआई कुंजी कॉन्फ़िगर करें।',
      mr: 'प्रात्यक्षिक डेमो निकाल (SIMULATED DEMO RESULT): हा केवळ चाचणीसाठी तयार केलेला अंदाज आहे. प्रत्यक्ष वापरासाठी सक्रिय API की कॉन्फिगर करा.'
    };

    return {
      crop: disease.crop[lang] || disease.crop.en,
      issue_type: 'disease',
      possible_issue: `[DEMO] ${disease.name[lang] || disease.name.en}`,
      confidence: sampleConfidence,
      symptoms: disease.symptoms[lang] || disease.symptoms.en,
      severity: sampleSeverity,
      organic_solutions: disease.organicSolutions[lang] || disease.organicSolutions.en,
      biological_solutions: disease.biologicalSolutions[lang] || disease.biologicalSolutions.en,
      additional_treatment: disease.verifiedTreatments[lang] || disease.verifiedTreatments.en,
      prevention: disease.prevention[lang] || disease.prevention.en,
      warning: warnings[lang] || warnings.en,
      language: lang,
      providerUsed: 'SIMULATED DEMO RESULT'
    };
  }

  static generateChatResponse(message: string, context: { crop?: string; location?: string; weather?: string }, lang: 'en' | 'hi' | 'mr' = 'en'): string {
    const query = message.toLowerCase();

    if (lang === 'mr') {
      if (query.includes('पाणी') || query.includes('सिंचन') || query.includes('water') || query.includes('irrigation')) {
        return `💧 **पाणी व्यवस्थापन सल्ला:**\n\n1. सध्याच्या हवामानानुसार आणि जमिनीत ओलावा तपासूनच पाणी द्यावे.\n2. जमिनीतील ४ इंच खोलीवरील मातीची मूठ वळून पहा. मातीचा लाडू बनल्यास ओलावा पुरेसा आहे.\n3. पाणी देण्यासाठी सकाळी लवकर (६ ते ९) किंवा संध्याकाळी ५ नंतरची वेळ निवडा, जेणेकरून बाष्पीभवन कमी होईल.\n4. ठिबक सिंचनाचा वापर केल्यास मुळांना आवश्यक तेवढेच पाणी मिळते.`;
      }
      if (query.includes('पाऊस') || query.includes('हवामान') || query.includes('rain') || query.includes('weather')) {
        return `🌦️ **हवामान आणि शेती सल्ला:**\n\n1. तुमच्या भागातील हवामानाचा अंदाज तपासूनच फवारणी किंवा खत देणे निश्चित करा.\n2. ढगाळ किंवा पावसाळी हवामान असल्यास कोणतीही रासायनिक किंवा जैविक फवारणी करू नका, कारण ती पावसाने धुतली जाऊ शकते.\n3. शेतातील पाण्याचा निचरा योग्य राहील याची खबरदारी घ्या.`;
      }
      if (query.includes('सेंद्रिय') || query.includes('रोग') || query.includes('कीड') || query.includes('organic')) {
        return `🌿 **सेंद्रिय पीक संरक्षण सल्ला:**\n\n1. किडींच्या नियंत्रणासाठी सर्वप्रथम एकरी ८ ते १० चिकट सापळे (पिवळे व निळे) लावा.\n2. ५% निंबोळी अर्क (NSKE) किंवा कडुनिंब तेल (५ मिली/लिटर) चा प्रतिबंधात्मक फवारा द्या.\n3. बुरशीजन्य रोगांसाठी ट्रायकोडर्मा व्हिरीडी (५ ग्रॅम प्रति लिटर) चा वापर करा.\n4. जमिनीची सुपीकता टिकवण्यासाठी जिवामृताचा नियमित वापर करा.`;
      }
      return `नमस्ते शेतकरी बंधू! 🙏\n\nमी आपला डिजिटल कृषिमित्र आहे. तुम्ही मला विचारू शकता:\n- पिकावरील रोग व कीड नियंत्रण (सेंद्रिय उपाय)\n- आज पाणी द्यावे का?\n- आज फवारणी करणे योग्य आहे का?\n- खत व पीक काळजी.\n\nतुम्हाला कोणत्या पिकाबद्दल माहिती हवी आहे?`;
    }

    if (lang === 'hi') {
      if (query.includes('पानी') || query.includes('सिंचाई') || query.includes('water') || query.includes('irrigation')) {
        return `💧 **सिंचाई प्रबंधन सलाह:**\n\n1. मिट्टी में नमी का परीक्षण करने के बाद ही सिंचाई करें।\n2. 4 इंच गहराई से मिट्टी लेकर मुट्ठी बनाएं; यदि लड्डू बनता है तो अभी पानी न दें।\n3. सिंचाई सुबह जल्दी या शाम के समय करें ताकि पानी का वाष्पीकरण न हो।\n4. ड्रिप सिंचाई का प्रयोग करने से 40-50% पानी की बचत होती है।`;
      }
      if (query.includes('बारिश') || query.includes('मौसम') || query.includes('rain') || query.includes('weather')) {
        return `🌦️ **मौसम एवं कृषि सलाह:**\n\n1. मौसम पूर्वानुमान देखकर ही कीटनाशक या खाद का प्रयोग करें।\n2. यदि बारिश या तेज हवा की संभावना हो तो छिड़काव टाल दें।\n3. खेत में पानी का उचित निकास सुनिश्चित करें।`;
      }
      if (query.includes('जैविक') || query.includes('रोग') || query.includes('कीट') || query.includes('organic')) {
        return `🌿 **जैविक फसल सुरक्षा उपाय:**\n\n1. रस चूसक कीटों के लिए पीले और नीले चिपचिपे ट्रैप लगाएं।\n2. नीम का तेल (3-5 मिली प्रति लीटर) का छिड़काव करें।\n3. फफूंद जनित रोगों की रोकथाम हेतु ट्राइकोडर्मा विरिडी का प्रयोग करें।\n4. फसल की रोग प्रतिरोधक क्षमता बढ़ाने के लिए जीवामृत का छिड़काव करें।`;
      }
      return `नमस्ते किसान भाई! 🙏\n\nमैं आपका कृषिमित्र सहायक हूँ। आप मुझसे पूछ सकते हैं:\n- फसल के रोगों व कीटों के जैविक उपाय\n- मौसम आधारित सिंचाई की जानकारी\n- खाद व पोषण प्रबंधन\n- आज छिड़काव करें या नहीं?\n\nआप अपनी किस फसल के बारे में जानना चाहते हैं?`;
    }

    // English
    if (query.includes('water') || query.includes('irrigation')) {
      return `💧 **Irrigation Management Advisory:**\n\n1. Check root-zone moisture before turning on water. Perform the hand-ball test at 4-inch depth.\n2. Schedule irrigation in the early morning or evening to minimize evaporative losses.\n3. For heavy black/clay soils, avoid excess ponding which causes root rot.\n4. Drip irrigation delivers water directly to root zones and cuts water consumption by up to 50%.`;
    }
    if (query.includes('rain') || query.includes('weather')) {
      return `🌦️ **Weather & Farm Advisory:**\n\n1. Always verify the rainfall forecast before scheduling chemical or biological sprays.\n2. Do not spray during wind speeds above 15 km/h or when rain is expected within 6-12 hours.\n3. Ensure field drainage channels are clear of debris to prevent water stagnation.`;
    }
    if (query.includes('organic') || query.includes('disease') || query.includes('pest')) {
      return `🌿 **Organic Crop Protection Guide:**\n\n1. Always start with preventive biological solutions: install 8-10 sticky/pheromone traps per acre.\n2. Spray cold-pressed Neem oil (3-5 ml/L with mild surfactant) at the earliest sign of sucking pests.\n3. For soil and foliage fungal protection, apply *Trichoderma viride* or *Pseudomonas fluorescens*.\n4. Prune lower infected leaves and sanitize tools between rows to break disease spread.`;
    }
    return `Hello Farmer! 🙏\n\nI am KrishiMitra, your AI Farming Assistant. You can ask me about:\n- Crop disease diagnosis and organic treatments\n- Weather-based irrigation guidance\n- Sowing, fertilizer, and crop management tips\n- Spraying weather conditions\n\nWhich crop would you like advice on today?`;
  }
}
