export interface DiseaseKnowledge {
  id: string;
  name: { en: string; hi: string; mr: string };
  crop: { en: string; hi: string; mr: string };
  symptoms: { en: string[]; hi: string[]; mr: string[] };
  organicSolutions: { en: string[]; hi: string[]; mr: string[] };
  biologicalSolutions: { en: string[]; hi: string[]; mr: string[] };
  verifiedTreatments: { en: string[]; hi: string[]; mr: string[] };
  prevention: { en: string[]; hi: string[]; mr: string[] };
  riskFactors: {
    tempRange: [number, number];
    humidityMin: number;
    rainFavorable: boolean;
  };
}

export interface CropProfile {
  id: string;
  name: { en: string; hi: string; mr: string };
  seasons: string[];
  stages: { en: string; hi: string; mr: string }[];
  soilTypes: string[];
  waterNeeds: string;
  commonDiseases: string[];
}

export const CROP_PROFILES: Record<string, CropProfile> = {
  tomato: {
    id: 'tomato',
    name: { en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो' },
    seasons: ['Kharif', 'Rabi', 'Zaid'],
    stages: [
      { en: 'Seedling (0-25 days)', hi: 'अंकुरण (0-25 दिन)', mr: 'रोपवाटिका (०-२५ दिवस)' },
      { en: 'Vegetative (25-45 days)', hi: 'वानस्पतिक विकास (25-45 दिन)', mr: 'शाकीय वाढ (२५-४५ दिवस)' },
      { en: 'Flowering & Fruit Set (45-70 days)', hi: 'फूल व फलधारण (45-70 दिन)', mr: 'फुलोरा व फळधारणा (४५-७० दिवस)' },
      { en: 'Harvesting (70-120 days)', hi: 'तुड़ाई (70-120 दिन)', mr: 'तोडणी (७०-१२० दिवस)' }
    ],
    soilTypes: ['Sandy Loam', 'Clay Loam', 'Black Soil'],
    waterNeeds: 'Moderate to high, requires consistent soil moisture without waterlogging.',
    commonDiseases: ['early_blight', 'late_blight', 'leaf_curl', 'bacterial_wilt']
  },
  cotton: {
    id: 'cotton',
    name: { en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
    seasons: ['Kharif'],
    stages: [
      { en: 'Germination & Seedling (0-30 days)', hi: 'अंकुरण व प्रारंभिक अवस्था (0-30 दिन)', mr: 'उगवण व रोपावस्था (०-३० दिवस)' },
      { en: 'Square Formation & Flowering (30-70 days)', hi: 'कली व फूल आना (30-70 दिन)', mr: 'पात्या व फुले येणे (३०-७० दिवस)' },
      { en: 'Boll Development (70-120 days)', hi: 'टिंडे बनना (70-120 दिन)', mr: 'बोंड भरणे (७०-१२० दिवस)' },
      { en: 'Boll Bursting & Picking (120-160 days)', hi: 'कपास चुनाई (120-160 दिन)', mr: 'बोंड फुटणे व वेचणी (१२०-१६० दिवस)' }
    ],
    soilTypes: ['Deep Black Soil', 'Alluvial Soil'],
    waterNeeds: 'Critical during square formation and boll development; avoid water stagnation.',
    commonDiseases: ['pink_bollworm', 'bacterial_blight', 'grey_mildew', 'leaf_curl']
  },
  chilli: {
    id: 'chilli',
    name: { en: 'Chilli', hi: 'मिर्च', mr: 'मिरची' },
    seasons: ['Kharif', 'Rabi'],
    stages: [
      { en: 'Transplanting & Establishment (0-20 days)', hi: 'रोपण व जड़ पकड़ना (0-20 दिन)', mr: 'पुनर्लागवड (०-२० दिवस)' },
      { en: 'Vegetative Growth (20-45 days)', hi: 'वानस्पतिक विकास (20-45 दिन)', mr: 'शाकीय वाढ (२०-४५ दिवस)' },
      { en: 'Flowering & Fruit Initiation (45-75 days)', hi: 'फूल व मिर्च लगना (45-75 दिन)', mr: 'फुलोरा व फळधारणा (४५-७५ दिवस)' },
      { en: 'Fruit Maturity & Plucking (75-150 days)', hi: 'मिर्च तुड़ाई (75-150 दिन)', mr: 'तोडणी (७५-१५० दिवस)' }
    ],
    soilTypes: ['Well-drained Loam', 'Black Cotton Soil'],
    waterNeeds: 'Sensitive to both drought and waterlogging; drip irrigation highly recommended.',
    commonDiseases: ['chilli_leaf_curl', 'anthracnose', 'powdery_mildew', 'thrips_mite']
  },
  soybean: {
    id: 'soybean',
    name: { en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन' },
    seasons: ['Kharif'],
    stages: [
      { en: 'Emergence (0-15 days)', hi: 'अंकुरण (0-15 दिन)', mr: 'उगवण (०-१५ दिवस)' },
      { en: 'Vegetative (15-35 days)', hi: 'वानस्पतिक अवस्था (15-35 दिन)', mr: 'शाकीय वाढ (१५-३५ दिवस)' },
      { en: 'Flowering & Pod Filling (35-75 days)', hi: 'फूल व फली भरना (35-75 दिन)', mr: 'फुलोरा व शेंगा भरणे (३५-७५ दिवस)' },
      { en: 'Maturity (75-100 days)', hi: 'परिपक्वता (75-100 दिन)', mr: 'पक्वता (७५-१०० दिवस)' }
    ],
    soilTypes: ['Black Soil', 'Clay Loam'],
    waterNeeds: 'Critical at flowering and pod development; vulnerable to moisture stress.',
    commonDiseases: ['soybean_rust', 'yellow_mosaic', 'charcoal_rot']
  },
  onion: {
    id: 'onion',
    name: { en: 'Onion', hi: 'प्याज', mr: 'कांदा' },
    seasons: ['Kharif', 'Late Kharif', 'Rabi'],
    stages: [
      { en: 'Nursery & Transplanting (0-30 days)', hi: 'नर्सरी व रोपाई (0-30 दिन)', mr: 'रोपवाटिका व पुनर्लागवड (०-३० दिवस)' },
      { en: 'Vegetative Growth (30-60 days)', hi: 'वानस्पतिक विकास (30-60 दिन)', mr: 'पातीची वाढ (३०-६० दिवस)' },
      { en: 'Bulb Development (60-95 days)', hi: 'कंद बनना (60-95 दिन)', mr: 'कांदा पोसणे (६०-९५ दिवस)' },
      { en: 'Maturity & Harvest (95-120 days)', hi: 'कटाई पूर्व परिपक्वता (95-120 दिन)', mr: 'काढणी पूर्व अवस्था (९५-१२० दिवस)' }
    ],
    soilTypes: ['Sandy Loam', 'Clay Loam'],
    waterNeeds: 'Regular light watering; stop irrigation 10-15 days before harvest.',
    commonDiseases: ['purple_blotch', 'stemphylium_blight', 'downy_mildew', 'thrips']
  },
  wheat: {
    id: 'wheat',
    name: { en: 'Wheat', hi: 'गेहूं', mr: 'गहू' },
    seasons: ['Rabi'],
    stages: [
      { en: 'Crown Root Initiation (20-25 days)', hi: 'सीआरआई अवस्था (20-25 दिन)', mr: 'मुकुट मुळे फुटणे (२०-२५ दिवस)' },
      { en: 'Tillering (40-45 days)', hi: 'कल्ले फूटना (40-45 दिन)', mr: 'फुटवे फुटणे (४०-४५ दिवस)' },
      { en: 'Booting & Heading (65-70 days)', hi: 'गाभा व बाली निकलना (65-70 दिन)', mr: 'पोटरी व लोंब्या बाहेर पडणे (६५-७० दिवस)' },
      { en: 'Grain Filling (85-90 days)', hi: 'दूधिया व दाना भरना (85-90 दिन)', mr: 'दाणे भरणे (८५-९० दिवस)' }
    ],
    soilTypes: ['Clay Loam', 'Alluvial Soil'],
    waterNeeds: 'Critical irrigation at CRI (21 days), tillering, flowering, and grain-filling.',
    commonDiseases: ['yellow_rust', 'brown_rust', 'powdery_mildew', 'loose_smut']
  }
};

export const DISEASE_DATABASE: Record<string, DiseaseKnowledge> = {
  early_blight: {
    id: 'early_blight',
    name: {
      en: 'Early Blight (Alternaria solani)',
      hi: 'अगेती झुलसा (अर्ली ब्लाइट)',
      mr: 'करपा / अर्ली ब्लाइट'
    },
    crop: { en: 'Tomato / Potato', hi: 'टमाटर / आलू', mr: 'टोमॅटो / बटाटा' },
    symptoms: {
      en: [
        'Concentric dark brown to black rings (target-board appearance) on older lower leaves',
        'Yellow halo surrounding necrotic spots',
        'Premature defoliation starting from the base of the plant',
        'Sunken dark lesions on stems near soil line'
      ],
      hi: [
        'निचली पत्तियों पर गोल छल्लेदार गहरे भूरे या काले धब्बे (टारगेट बोर्ड जैसे)',
        'धब्बों के चारों ओर पीला घेरा',
        'पौधे के निचले हिस्से से पत्तियों का सूखकर गिरना',
        'तने पर गहरे धब्बे'
      ],
      mr: [
        'खालच्या जुन्या पानांवर काळे-तपकिरी गोलाकार चक्राकार डाग (टार्गेट बोर्डसारखे)',
        'डागांभोवती पिवळसर कडा',
        'झाडाची खालची पाने पिवळी पडून गळणे',
        'खोडावर काळपट चट्टे पडणे'
      ]
    },
    organicSolutions: {
      en: [
        'Prune and safely dispose of affected lower leaves to improve air circulation',
        'Spray certified Neem oil (3-5 ml per liter of water) mixed with mild soap',
        'Apply fermented buttermilk spray (5% sour butter milk in water) in early morning',
        'Avoid overhead sprinkler irrigation; keep foliage dry by using drip irrigation',
        'Apply Jeevamrut or Dashparni Ark every 12-14 days to boost soil and plant immunity'
      ],
      hi: [
        'प्रभावित निचली पत्तियों को तोड़कर खेत से दूर नष्ट करें ताकि हवा का संचार बढ़े',
        'प्रमाणित नीम का तेल (3-5 मिली प्रति लीटर पानी) हल्के साबुन के साथ मिलाकर छिड़कें',
        '5% खट्टी छाछ का पानी में घोल बनाकर सुबह के समय छिड़काव करें',
        'फव्वारा सिंचाई से बचें; ड्रिप सिंचाई से पानी दें ताकि पत्तियां सूखी रहें',
        'पौधों की रोग प्रतिरोधक क्षमता बढ़ाने हेतु जीवामृत या दशपर्णी अर्क का छिड़काव करें'
      ],
      mr: [
        'रोगट झालेली खालची पाने खुडून शेताबाहेर नष्ट करा, ज्यामुळे हवा खेळती राहील',
        'प्रमाणित कडुनिंब तेल (३-५ मिली प्रति लिटर पाणी) सौम्य साबणासह फवारा',
        '५% आंबट ताकाचे द्रावण सकाळी पानांवर फवारा',
        'पानांवर पाणी पडू देऊ नका; ठिबक सिंचनाचा वापर करा जेणेकरून ओलावा साचणार नाही',
        'दर १२-१४ दिवसांनी जिवामृत किंवा दशपर्णी अर्काचा फवारा देऊन रोगप्रतिकारशक्ती वाढवा'
      ]
    },
    biologicalSolutions: {
      en: [
        'Foliar spray of Trichoderma harzianum or Trichoderma viride (5g/liter of water)',
        'Pseudomonas fluorescens (10g/liter) applied to soil and foliage'
      ],
      hi: [
        'ट्राइकोडर्मा विरिडी या ट्राइकोडर्मा हर्जिएनम (5 ग्राम प्रति लीटर) का पत्तियों पर छिड़काव',
        'स्यूडोमोनास फ्लोरोसेंस (10 ग्राम प्रति लीटर) का मिट्टी व पत्तियों पर उपयोग'
      ],
      mr: [
        'ट्रायकोडर्मा व्हिरीडी किंवा ट्रायकोडर्मा हरझियानम (५ ग्रॅम प्रति लिटर पाणी) पानांवर फवारा',
        'सुडोमोनास फ्लोरोसन्स (१० ग्रॅम प्रति लिटर) जमिनीतून व पानांवर द्यावे'
      ]
    },
    verifiedTreatments: {
      en: [
        'If infection crosses economic threshold, consult your local Krishi Vigyan Kendra (KVK) officer',
        'Registered contact protectants like Copper Oxychloride or Mancozeb as per verified university package of practices',
        'Always wear protective gloves, mask, and follow statutory waiting period (PHI) mentioned on label'
      ],
      hi: [
        'यदि प्रकोप अधिक हो, तो नजदीकी कृषि विज्ञान केंद्र (KVK) विशेषज्ञ से सलाह लें',
        'कृषि विश्वविद्यालय द्वारा अनुशंसित कॉपर ऑक्सीक्लोराइड या मैंकोज़ेब का लेबल निर्देशानुसार सीमित उपयोग करें',
        'दवा छिड़कते समय मास्क, दस्ताने पहनें और लेबल पर दी गई तुड़ाई पूर्व प्रतीक्षा अवधि (PHI) का अनिवार्य पालन करें'
      ],
      mr: [
        'प्रादुर्भाव आर्थिक नुकसान पातळी ओलांडल्यास जवळच्या कृषी विज्ञान केंद्रातील (KVK) तज्ज्ञांचा सल्ला घ्या',
        'कृषी विद्यापीठाने शिफारस केलेले कॉपर ऑक्सिक्लोराईड किंवा मँकोझेब लेबल निर्देशांनुसार वापरा',
        'औषध फवारताना मास्क, हातमोजे वापरा आणि लेबलवर दिलेला काढणीपूर्व प्रतीक्षा कालावधी (PHI) पाळा'
      ]
    },
    prevention: {
      en: [
        'Follow 3-year crop rotation avoiding Solanaceous crops (tomato, potato, eggplant)',
        'Ensure wide plant spacing (60 x 45 cm) for excellent airflow',
        'Apply organic mulch to prevent rain splashing soil microbes onto lower leaves',
        'Use certified disease-resistant hybrid seed varieties'
      ],
      hi: [
        'टमाटर के बाद सोलेनेसी कुल (आलू, बैंगन) की फसल न लगाएं; 3 वर्षीय फसल चक्र अपनाएं',
        'पौधों के बीच उचित दूरी (60 x 45 सेमी) रखें ताकि पर्याप्त धूप और हवा मिले',
        'मिट्टी से फफूंद के छींटे रोकने के लिए जैविक मल्चिंग करें',
        'रोग प्रतिरोधी प्रमाणित बीजों का ही चयन करें'
      ],
      mr: [
        'टोमॅटोनंतर वांगी किंवा बटाटा लावू नका; योग्य पीकपालट करा',
        'रोपांमध्ये योग्य अंतर (६० x ४५ सेंमी) ठेवा जेणेकरून हवा आणि ऊन योग्य मिळेल',
        'मातीतील बुरशी पानांवर उडू नये म्हणून आच्छादन (मल्चिंग) करा',
        'प्रमाणित आणि रोगप्रतिकारक जातींच्या रोपांची निवड करा'
      ]
    },
    riskFactors: {
      tempRange: [22, 30],
      humidityMin: 75,
      rainFavorable: true
    }
  },
  late_blight: {
    id: 'late_blight',
    name: {
      en: 'Late Blight (Phytophthora infestans)',
      hi: 'पछेती झुलसा (लेट ब्लाइट)',
      mr: 'लेट ब्लाइट / करपा (फायटोप्थोरा)'
    },
    crop: { en: 'Tomato / Potato', hi: 'टमाटर / आलू', mr: 'टोमॅटो / बटाटा' },
    symptoms: {
      en: [
        'Water-soaked pale green or dark lesions on leaf tips and margins',
        'White fungal/cottony downy growth on leaf undersides in high humidity',
        'Rapid blackening and rotting of foliage and brown firm rot on fruit'
      ],
      hi: [
        'पत्तियों के सिरों पर पानी से भीगे भूरे या काले धब्बे',
        'अधिक नमी में पत्ती की निचली सतह पर सफेद रुई जैसी फफूंद',
        'पत्तियों व फलों का तेजी से काला पड़कर सड़ना'
      ],
      mr: [
        'पानांच्या टोकांवर पाणी शोषल्यासारखे काळपट डाग',
        'जास्त आर्द्रतेमध्ये पानांच्या खाली पांढऱ्या बुरशीची वाढ',
        'पाने आणि फळे वेगाने काळी पडून कुजणे'
      ]
    },
    organicSolutions: {
      en: [
        'Immediately remove and burn/bury severely blighted branches; never compost diseased tissue',
        'Bordeaux mixture (1%) spray preventive application before continuous cool rains',
        'Neem cake soil amendment to strengthen root zone biodiversity',
        'Keep field thoroughly weed-free to eliminate wild alternate hosts'
      ],
      hi: [
        'गंभीर रूप से ग्रसित शाखाओं को तुरंत काटकर मिट्टी में गहरा दबाएं या जलाएं; कम्पोस्ट में न डालें',
        'ठंडे व बारिश के मौसम से पहले 1% बोर्डो मिश्रण का बचाव के तौर पर छिड़काव करें',
        'जड़ क्षेत्र को मजबूत करने के लिए नीम की खली का प्रयोग करें',
        'खेत को खरपतवार मुक्त रखें'
      ],
      mr: [
        'रोगट फांद्या त्वरित काढून जाळून टाका किंवा जमिनीत गाडा; कंपोस्ट खतात टाकू नका',
        'सतत ढगाळ व पावसाळी हवामानापूर्वी १% बोर्डो मिश्रणाची प्रतिबंधात्मक फवारणी करा',
        'जमिनीत कडुलिंब पेंड घालून मुळांचे आरोग्य सुधारा',
        'शेतातील तण पूर्णपणे काढून टाका'
      ]
    },
    biologicalSolutions: {
      en: [
        'Bacillus subtilis bio-fungicide formulation (5-10 ml/liter)',
        'Trichoderma viride preventative soil application enriched with well-decomposed FYM'
      ],
      hi: [
        'बैसिलस सबटिलिस जैविक कवकनाशी (5-10 मिली/लीटर)',
        'ट्राइकोडर्मा विरिडी को सड़ी गोबर खाद में मिलाकर खेत में प्रयोग करें'
      ],
      mr: [
        'बॅसिलस सबटिलिस जैविक बुरशीनाशक (५-१० मिली/लिटर)',
        'ट्रायकोडर्मा व्हिरीडी शेणखतात मिसळून जमिनीत देणे'
      ]
    },
    verifiedTreatments: {
      en: [
        'Under severe epidemic risk, consult regional state agricultural university guidelines',
        'Targeted systemic protectants like Cymoxanil + Mancozeb or Metalaxyl combinations used only strictly according to statutory label guidelines'
      ],
      hi: [
        'गंभीर खतरे की स्थिति में स्थानीय कृषि अधिकारी या विश्वविद्यालय से संपर्क करें',
        'लेबल निर्देशों और सुरक्षा नियमों का पालन करते हुए ही अनुशंसित प्रणालीगत कवकनाशी का प्रयोग करें'
      ],
      mr: [
        'तीव्र प्रादुर्भाव असल्यास स्थानिक कृषी अधिकारी किंवा कृषी केंद्राचा त्वरित सल्ला घ्यावा',
        'शिफारस केलेल्या बुरशीनाशकांचा लेबलवरील सूचनांनुसारच काटेकोर वापर करावा'
      ]
    },
    prevention: {
      en: [
        'Plant only certified healthy tubers or certified seedlings',
        'Avoid cool moist valley areas with poor morning sunlight',
        'Cease overhead sprinkling during cloudy foggy spells'
      ],
      hi: [
        'हमेशा प्रमाणित व स्वस्थ बीजों/पौधों का ही रोपण करें',
        'कोहरे और बादलों वाले दिनों में पत्तियों पर पानी छिड़कने से बचें'
      ],
      mr: [
        'प्रमाणित निरोगी रोपे किंवा बियाणे वापरा',
        'धुके किंवा ढगाळ वातावरणात पानांवर पाणी पडू देऊ नका'
      ]
    },
    riskFactors: {
      tempRange: [12, 22],
      humidityMin: 85,
      rainFavorable: true
    }
  },
  pink_bollworm: {
    id: 'pink_bollworm',
    name: {
      en: 'Pink Bollworm (Pectinophora gossypiella)',
      hi: 'गुलाबी सुंडी (पिंक बॉलवॉर्म)',
      mr: 'गुलाबी बोंडअळी'
    },
    crop: { en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
    symptoms: {
      en: [
        'Rosetted flowers that fail to open naturally',
        'Small entry holes on developing cotton bolls plugged with excreta',
        'Premature boll dropping and stained, discolored lint inside opened bolls'
      ],
      hi: [
        'गुलाब जैसी सिकुड़ी हुई फूल कलियां (रोसेटेड फूल) जो पूरी नहीं खिलतीं',
        'कपास के टिंडों पर छोटे छिद्र और मल का जमाव',
        'टिंडों का समय से पहले गिरना और खराब रुई'
      ],
      mr: [
        'गुलाबासारखी बंद राहिलेली फुले (रोझेट फुले) जी उघडत नाहीत',
        'बोंडांवर बारीक छिद्र आणि विष्ठेचे डाग',
        'बोंडे अकाली गळणे आणि आतील कापूस डागाळलेला निघणे'
      ]
    },
    organicSolutions: {
      en: [
        'Install Pheromone traps (Pectino-lure) @ 8-10 traps per acre for continuous monitoring',
        'Collect and destroy rosetted flowers and dropped infested bolls daily',
        'Spray certified Neem Seed Kernel Extract (NSKE 5%) or 1500 ppm Neem oil at initiation of flowering',
        'Avoid extending the crop season into ratoon cotton'
      ],
      hi: [
        'निगरानी हेतु 8-10 फेरोमोन ट्रैप (पेक्टिनोल्योर) प्रति एकड़ लगाएं',
        'सिकुड़े हुए रोसेटेड फूलों और गिरे हुए प्रभावित टिंडों को इकट्ठा कर नष्ट करें',
        'फूल आते समय 5% नीम बीज अर्क (NSKE) या नीम तेल (1500 ppm) का छिड़काव करें',
        'कपास की फसल को अनावश्यक अधिक समय तक न खींचें'
      ],
      mr: [
        'निरीक्षणासाठी एकरी ८-१० कामगंध सापळे (फेरोमोन ट्रॅप) लावा',
        'रोझेट फुले व गळालेली कीडग्रस्त बोंडे गोळा करून जमिनीत गाडून नष्ट करा',
        '५% निंबोळी अर्क (NSKE) किंवा कडुनिंब तेल (१५०० पीपीएम) फुलोऱ्याच्या सुरुवातीला फवारा',
        'कपाशीचे पीक जास्त महिने ताणून ठेवू नका'
      ]
    },
    biologicalSolutions: {
      en: [
        'Release egg parasitoid Trichogramma bactrae @ 60,000 to 1,00,000 parasites/acre at weekly intervals',
        'Foliar application of Beauveria bassiana (10g/liter) during humid evening hours'
      ],
      hi: [
        'ट्राइकोग्रामा बैक्ट्रे परजीवी अंडों (Trichogramma bactrae) का खेत में साप्ताहिक प्रयोग',
        'ब्युवेरिया बासियाना (10 ग्राम/लीटर) का शाम के समय छिड़काव'
      ],
      mr: [
        'ट्रायकोग्रामा बॅक्ट्री या परोपजीवी कीटकांचे कार्ड एकरी ६०,००० ते १ लाख प्रमाणात लावा',
        'ब्युव्हेरिया बॅसियाना जैविक बुरशी (१० ग्रॅम प्रति लिटर) संध्याकाळच्या वेळी फवारा'
      ]
    },
    verifiedTreatments: {
      en: [
        'Apply treatments only when moth trap catch crosses ETL (8 moths/trap/night for 3 consecutive days)',
        'Consult government agricultural department advisories for approved green-label insect growth regulators',
        'Follow complete safety protocol and avoid mixing chemicals arbitrarily'
      ],
      hi: [
        'जब कीट आर्थिक नुकसान स्तर (ETL - लगातार 3 दिन 8 पतंगे/ट्रैप) पार करे तभी विशेषज्ञ की राय लें',
        'सरकारी कृषि विभाग द्वारा स्वीकृत कीटनाशक ही अनुशंसित मात्रा में उपयोग करें'
      ],
      mr: [
        'आर्थिक नुकसान पातळी (सलग ३ दिवस प्रति सापळा ८ पतंग) ओलांडल्यासच कृषी अधिकाऱ्यांच्या सल्ल्याने उपाय करा',
        'केंद्रीय कीटकनाशक मंडळाने शिफारस केलेले अधिकृत औषधच वापरा'
      ]
    },
    prevention: {
      en: [
        'Deep summer ploughing to expose hibernating pupae to natural sunlight and predators',
        'Timely termination of crop by December to break pest life cycle',
        'Destruction of cotton crop residues after final picking'
      ],
      hi: [
        'मई-जून में गहरी गर्मी की जुताई करें ताकि सुंडी की प्यूपा धूप से नष्ट हो जाएं',
        'दिसंबर तक फसल की कटाई पूर्ण कर जीवन चक्र को तोड़ें',
        'अंतिम चुनाई के बाद अवशेषों को नष्ट करें'
      ],
      mr: [
        'उन्हाळ्यात शेताची खोल नांगरट करा जेणेकरून कोशावस्थेतील अळ्या उन्हाने नष्ट होतील',
        'डिसेंबर अखेरपर्यंत पीक काढून जीवनचक्र खंडित करा',
        'शेवटच्या वेचणीनंतर पराठ्या शेतात न ठेवता नष्ट करा'
      ]
    },
    riskFactors: {
      tempRange: [25, 34],
      humidityMin: 60,
      rainFavorable: false
    }
  },
  chilli_leaf_curl: {
    id: 'chilli_leaf_curl',
    name: {
      en: 'Chilli Leaf Curl Virus & Thrips Complex',
      hi: 'मिर्च का पर्ण कुंचन रोग (मुर्राह / लीफ कर्ल)',
      mr: 'मिरचीवरील चुरडा-मुरडा (लीफ कर्ल व फुलकिडे)'
    },
    crop: { en: 'Chilli', hi: 'मिर्च', mr: 'मिरची' },
    symptoms: {
      en: [
        'Upward curling of leaves (boat shaped) accompanied by crinkling and puckering',
        'Stunted bush-like plant appearance with severely reduced leaf size',
        'Flower drop and poor fruit formation with deformed small peppers'
      ],
      hi: [
        'पत्तियों का ऊपर की ओर नाव की तरह मुड़ना व सिकुड़ना',
        'पौधे का बौना हो जाना और पत्तियों का छोटा रह जाना',
        'फूलों का गिरना और टेढ़ी-मेढ़ी मिर्च बनना'
      ],
      mr: [
        'पाने वरच्या बाजूला वाटीसारखी किंवा बोटीसारखी दुमडणे',
        'झाडाची वाढ खुंटून झाड झुडपासारखे दिसणे आणि पाने लहान होणे',
        'फुलांची गळ होणे आणि फळे लहान किंवा वाकडीतिकडी येणे'
      ]
    },
    organicSolutions: {
      en: [
        'Install yellow and blue sticky traps (20 traps/acre) to capture vector whiteflies and thrips',
        'Spray Agniastra or Dashparni Ark (25-30 ml/liter) every 10 days as natural repellent',
        'Spray 5% Neem Seed Kernel Extract (NSKE) or 10,000 ppm Neem oil at early stage',
        'Eradicate and bury weed hosts and severely infected vector-bearing plants immediately'
      ],
      hi: [
        'रस चूसक कीटों (थ्रिप्स व सफेद मक्खी) को पकड़ने हेतु 20 नीले व पीले चिपचिपे ट्रैप प्रति एकड़ लगाएं',
        'अग्नियास्त्र या दशपर्णी अर्क का 10 दिनों के अंतराल पर छिड़काव करें',
        '5% नीम बीज अर्क (NSKE) या नीम तेल का छिड़काव करें',
        'रोग से बुरी तरह ग्रस्त पौधों को उखाड़कर नष्ट करें'
      ],
      mr: [
        'फुलकिडे व पांढरी माशी पकडण्यासाठी एकरी २० निळे व पिवळे चिकट सापळे लावा',
        'दशपर्णी अर्क किंवा अग्न्यास्त्र (२५-३० मिली/लिटर) दर १० दिवसांनी फवारा',
        '५% निंबोळी अर्क किंवा कडुलिंब तेल फवारा',
        'तीव्र प्रादुर्भाव झालेली रोपे उपटून जाळून नष्ट करा'
      ]
    },
    biologicalSolutions: {
      en: [
        'Verticillium lecanii (Lecanicillium lecanii) or Beauveria bassiana @ 5g/liter for vector suppression',
        'Conserve natural predators like ladybird beetles and hoverflies'
      ],
      hi: [
        'वर्टिसिलियम लेकानी या ब्युवेरिया बासियाना (5 ग्राम/लीटर) का छिड़काव',
        'मित्र कीट जैसे लेडीबर्ड बीटल का संरक्षण करें'
      ],
      mr: [
        'व्हर्टिसिलियम लेकानी किंवा ब्युव्हेरिया बॅसियाना (५ ग्रॅम प्रति लिटर) फवारा',
        'ढालकिडा यांसारख्या मित्रकिटकांचे रक्षण करा'
      ]
    },
    verifiedTreatments: {
      en: [
        'Virus itself has no chemical cure; management focuses entirely on controlling sucking pest vectors',
        'Consult state agricultural university recommendations for registered sucking pest control agents',
        'Follow rotation of chemical classes to prevent vector resistance buildup'
      ],
      hi: [
        'वायरस का कोई सीधा रासायनिक उपचार नहीं है; केवल वाहक कीटों (सफेद मक्खी, थ्रिप्स) का ही नियंत्रण संभव है',
        'कृषि विशेषज्ञ की सलाह से अनुशंसित कीटनाशकों का सावधानीपूर्वक प्रयोग करें'
      ],
      mr: [
        'व्हायरसवर थेट रासायनिक औषध नसते; केवळ रसशोषक कीटकांचे नियंत्रण करावे लागते',
        'कृषी विद्यापीठाच्या शिफारशीनुसार अधिकृत औषध खबरदारी घेऊनच वापरा'
      ]
    },
    prevention: {
      en: [
        'Raise chilli nursery under 40-mesh insect-proof nylon net',
        'Grow barrier crops of 2-3 rows of maize, sorghum, or pearl millet around chilli field',
        'Apply silver-on-black reflective plastic mulch to deter sucking insects'
      ],
      hi: [
        'नर्सरी को 40-मेश नायलॉन जाली में ही तैयार करें',
        'खेत के चारों ओर मक्का या ज्वार की 2-3 पंक्तियों की अवरोधक फसल (बॉर्डर क्रॉप) लगाएं',
        'सिल्वर-ब्लैक मल्चिंग का उपयोग करें'
      ],
      mr: [
        'रोपवाटिका ४० मेश नायलॉन जाळीमध्ये सुरक्षित तयार करा',
        'शेताच्या चारही बाजूंनी मका किंवा ज्वारीच्या २-३ ओळींचे संरक्षक कुंपण लावा',
        'सिल्व्हर-ब्लॅक प्लास्टिक मल्चिंगचा वापर करा'
      ]
    },
    riskFactors: {
      tempRange: [28, 38],
      humidityMin: 40,
      rainFavorable: false
    }
  }
};

export class AgriculturalKnowledgeService {
  static getCrop(cropIdOrName: string): CropProfile | undefined {
    const key = cropIdOrName.toLowerCase().trim();
    return (
      CROP_PROFILES[key] ||
      Object.values(CROP_PROFILES).find((p) =>
        p.name.en.toLowerCase() === key ||
        p.name.hi === key ||
        p.name.mr === key
      )
    );
  }

  static getDisease(diseaseIdOrName: string): DiseaseKnowledge | undefined {
    const key = diseaseIdOrName.toLowerCase().trim().replace(/[\s-]/g, '_');
    return (
      DISEASE_DATABASE[key] ||
      Object.values(DISEASE_DATABASE).find((d) =>
        d.id.includes(key) ||
        d.name.en.toLowerCase().includes(key)
      )
    );
  }

  static findDiseasesForCrop(cropName: string): DiseaseKnowledge[] {
    const crop = this.getCrop(cropName);
    if (!crop) return [];
    return crop.commonDiseases
      .map((id) => DISEASE_DATABASE[id])
      .filter((d): d is DiseaseKnowledge => Boolean(d));
  }

  static assessWeatherRisk(diseaseId: string, currentTemp: number, currentHumidity: number, isRaining: boolean) {
    const disease = DISEASE_DATABASE[diseaseId];
    if (!disease) return null;

    const { tempRange, humidityMin, rainFavorable } = disease.riskFactors;
    const tempRisk = currentTemp >= tempRange[0] && currentTemp <= tempRange[1];
    const humidityRisk = currentHumidity >= humidityMin;
    const rainRisk = !disease.riskFactors.rainFavorable || isRaining;

    let score = 0;
    if (tempRisk) score += 35;
    if (humidityRisk) score += 45;
    if (rainRisk && isRaining) score += 20;

    let level: 'low' | 'medium' | 'high' = 'low';
    if (score >= 70) level = 'high';
    else if (score >= 40) level = 'medium';

    return {
      diseaseId,
      diseaseName: disease.name,
      riskLevel: level,
      score,
      tempRisk,
      humidityRisk
    };
  }
}
