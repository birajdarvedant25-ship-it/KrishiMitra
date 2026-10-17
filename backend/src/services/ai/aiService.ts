import { config } from '../../config/index.js';
import { GeminiService } from './geminiService.js';
import { OpenAiService } from './openAiService.js';
import { MockAiService, DiseaseAnalysisResult } from './mockAiService.js';
import { AgriculturalKnowledgeService } from '../agriculture/knowledgeBase.js';

export class AIService {
  static async analyzeDisease(
    imageBuffer: Buffer,
    mimeType: string,
    filename: string,
    cropHint?: string,
    lang: 'en' | 'hi' | 'mr' = 'en',
    context?: { location?: string; weather?: string }
  ): Promise<DiseaseAnalysisResult> {
    console.log(`[DISEASE DEBUG] mode = ${config.aiMode}`);
    console.log(`[DISEASE DEBUG] imageReceived = ${Boolean(imageBuffer && imageBuffer.length > 0)}`);
    console.log(`[DISEASE DEBUG] mimeType = ${mimeType}`);
    console.log(`[DISEASE DEBUG] imageSize = ${imageBuffer?.length || 0} bytes`);
    console.log(`[DISEASE DEBUG] imageEncodedLength = ${imageBuffer ? imageBuffer.toString('base64').length : 0}`);

    // If explicitly set to mock mode, use simulated demo engine
    if (config.aiMode === 'mock') {
      console.log(`[DISEASE DEBUG] provider = Mock AI (Demo Mode)`);
      return MockAiService.analyzeImage(filename, cropHint, lang);
    }

    // PRODUCTION MODE: NEVER use Mock AI. Must use real AI models.
    let providerAttempted = 'none';

    // 1. Try Google Gemini (Primary Multimodal Vision)
    if (config.geminiApiKey) {
      providerAttempted = 'Google Gemini';
      try {
        const result = await GeminiService.analyzeCropImage(imageBuffer, mimeType, cropHint, lang, context);
        return this.enrichWithKnowledgeBase(result, lang);
      } catch (geminiError: any) {
        console.warn('[DISEASE DEBUG] Gemini analysis failed:', geminiError.message);
      }
    }

    // 2. Try OpenAI GPT-4o-mini (Secondary / Fallback)
    if (config.openaiApiKey) {
      providerAttempted = 'OpenAI';
      try {
        const result = await OpenAiService.analyzeCropImage(imageBuffer, mimeType, cropHint, lang);
        return this.enrichWithKnowledgeBase(result, lang);
      } catch (openAiError: any) {
        console.warn('[DISEASE DEBUG] OpenAI fallback analysis failed:', openAiError.message);
      }
    }

    // In PRODUCTION MODE: When AI fails or keys are unavailable, NEVER return Early Blight!
    // Return explicit analysis_unavailable status with 0% confidence as required by specification.
    console.warn(`[DISEASE DEBUG] Production AI processing failed with provider: ${providerAttempted}. Returning analysis_unavailable.`);

    const unavailableTitles = {
      en: 'AI Analysis Unavailable',
      hi: 'एआई विश्लेषण उपलब्ध नहीं हो सका',
      mr: 'एआय विश्लेषण उपलब्ध होऊ शकले नाही'
    };

    const unavailableCrop = {
      en: cropHint || 'Unknown Plant',
      hi: cropHint || 'अज्ञात पौधा',
      mr: cropHint || 'अनोळखी वनस्पती'
    };

    const unavailableWarnings = {
      en: 'AI analysis could not be completed. Please ensure the leaf or plant is clearly visible in good lighting and try again.',
      hi: 'एआई विश्लेषण पूर्ण नहीं किया जा सका। कृपया पौधे की पत्ती का स्पष्ट फोटो अच्छी रोशनी में लेकर पुनः प्रयास करें।',
      mr: 'एआय विश्लेषण पूर्ण होऊ शकले नाही. कृपया चांगल्या प्रकाशात पानाचा स्पष्ट व जवळून फोटो काढून पुन्हा प्रयत्न करा.'
    };

    const practicalTips = {
      en: [
        'Take a clear, close-up photo of the affected leaf or plant part.',
        'Ensure the camera is focused and the lighting is bright and even.',
        'Avoid blurry, shaky, or shadowy photos.'
      ],
      hi: [
        'प्रभावित पत्ती या फल का पास से स्पष्ट फोटो लें।',
        'कैमरा फोकस सही रखें और पर्याप्त रोशनी में फोटो खींचें।',
        'धुंधले या अंधेरे वाले फोटो से बचें।'
      ],
      mr: [
        'बाधित पानाचा किंवा फळाचा जवळून स्वच्छ फोटो घ्या.',
        'कॅमेऱ्याचा फोकस व्यवस्थित ठेवून चांगल्या प्रकाशात फोटो काढा.',
        'अस्पष्ट किंवा अंधारातील फोटो काढणे टाळा.'
      ]
    };

    return {
      crop: unavailableCrop[lang] || unavailableCrop.en,
      issue_type: 'analysis_unavailable',
      possible_issue: unavailableTitles[lang] || unavailableTitles.en,
      confidence: 0,
      severity: 'unknown',
      symptoms: [],
      organic_solutions: [],
      biological_solutions: [],
      additional_treatment: [],
      prevention: practicalTips[lang] || practicalTips.en,
      warning: unavailableWarnings[lang] || unavailableWarnings.en,
      language: lang,
      providerUsed: 'None (Analysis Unavailable)',
      needs_better_image: true
    };
  }

  static async chat(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    context: { crop?: string; location?: string; weather?: string },
    lang: 'en' | 'hi' | 'mr' = 'en'
  ): Promise<{ response: string; providerUsed: string }> {
    if (config.aiMode === 'mock') {
      return {
        response: MockAiService.generateChatResponse(message, context, lang),
        providerUsed: 'Mock AI Engine'
      };
    }

    // 1. Try Gemini
    if (config.geminiApiKey) {
      try {
        const response = await GeminiService.chat(message, history, context, lang);
        return { response, providerUsed: 'Google Gemini' };
      } catch (err: any) {
        console.warn('[AI DEBUG] Gemini chat failed:', err.message);
      }
    }

    // 2. Try OpenAI
    if (config.openaiApiKey) {
      try {
        const response = await OpenAiService.chat(message, history, context, lang);
        return { response, providerUsed: 'OpenAI GPT-4o-mini' };
      } catch (err: any) {
        console.warn('[AI DEBUG] OpenAI chat failed:', err.message);
      }
    }

    // In PRODUCTION MODE: Never silently substitute mock data when real AI fails
    if (config.aiMode === 'production') {
      const unavailableResponses = {
        en: 'The AI Agricultural Assistant is currently unavailable due to upstream provider rate limits or network issues. Please try again in a moment.',
        hi: 'अपस्ट्रीम प्रदाता सीमा या नेटवर्क समस्या के कारण एआई कृषि सहायक अभी उत्तर देने में असमर्थ है। कृपया कुछ देर बाद पुनः प्रयास करें।',
        mr: 'सर्व्हरवरील मर्यादा किंवा नेटवर्क समस्येमुळे एआय कृषी सहाय्यक सध्या उपलब्ध नाही. कृपया काही वेळात पुन्हा प्रयत्न करा.'
      };
      return {
        response: unavailableResponses[lang] || unavailableResponses.en,
        providerUsed: 'None (Provider Unavailable)'
      };
    }

    // Fallback in case of mock demo mode
    return {
      response: MockAiService.generateChatResponse(message, context, lang),
      providerUsed: 'Mock AI Engine'
    };
  }

  private static enrichWithKnowledgeBase(result: DiseaseAnalysisResult, lang: 'en' | 'hi' | 'mr'): DiseaseAnalysisResult {
    // If the plant is healthy, unknown, or analysis unavailable, do not attach disease treatments!
    if (['healthy', 'unknown', 'analysis_unavailable'].includes(result.issue_type || '')) {
      return result;
    }

    // Cross-reference with our verified agricultural knowledge layer
    const matched = AgriculturalKnowledgeService.getDisease(result.possible_issue);

    if (matched) {
      // Ensure organic solutions are populated if empty
      const kbOrganic = matched.organicSolutions[lang] || matched.organicSolutions.en;
      if (result.organic_solutions.length === 0 && kbOrganic.length > 0) {
        result.organic_solutions = kbOrganic;
      }

      const kbBio = matched.biologicalSolutions[lang] || matched.biologicalSolutions.en;
      if (result.biological_solutions.length === 0 && kbBio.length > 0) {
        result.biological_solutions = kbBio;
      }
    }

    return result;
  }
}
