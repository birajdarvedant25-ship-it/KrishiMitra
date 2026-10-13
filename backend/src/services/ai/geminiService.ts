import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/index.js';
import { DiseaseAnalysisResult } from './mockAiService.js';

export class GeminiService {
  private static getClient(): GoogleGenerativeAI | null {
    if (!config.geminiApiKey) return null;
    return new GoogleGenerativeAI(config.geminiApiKey);
  }

  static async analyzeCropImage(
    imageBuffer: Buffer,
    mimeType: string,
    cropHint?: string,
    lang: 'en' | 'hi' | 'mr' = 'en'
  ): Promise<DiseaseAnalysisResult> {
    const ai = this.getClient();
    if (!ai) {
      throw new Error('Gemini API key is not configured.');
    }

    // Try modern active Gemini multimodal vision models:
    const modelsToTry = [
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.8-flash'
    ];
    let lastError: Error | null = null;

    const langInstructions = {
      en: 'Respond in English. Use simple, clear language suitable for an Indian farmer.',
      hi: 'हिंदी में उत्तर दें। भारतीय किसान के लिए सरल, व्यावहारिक व सुबोध भाषा का प्रयोग करें।',
      mr: 'मराठीमध्ये उत्तर द्या. शेतकरी बांधवांना सहज समजेल अशी साधी, सोपी व व्यावहारिक भाषा वापरा.'
    };

    const prompt = `
You are an expert Agricultural Plant Pathologist and Sustainable Farming Advisor.
Analyze this ACTUAL uploaded plant/crop image with precision.
${cropHint ? `Farmer provided note/suspected crop: "${cropHint}".` : ''}

INSPECTION GUIDELINES:
1. ${langInstructions[lang]}
2. Carefully inspect the leaf, stem, fruit, or foliage in the image.
3. Classify the issue_type into one of:
   - "disease" (fungal, bacterial, viral infection)
   - "pest" (insect damage, sucking pests, larvae, mites)
   - "nutrient_deficiency" (chlorosis, nitrogen/potassium/calcium deficit)
   - "environmental_stress" (sunburn, waterlogging, drought)
   - "healthy" (plant appears normal with no visible pathology)
   - "unknown" (unclear symptoms or image does not show identifiable crop)
   - "analysis_unavailable" (image is unreadable, blurry, dark, or not a plant)

4. If healthy, state that the plant appears healthy in "possible_issue".
5. Give realistic AI confidence (0-100%) based strictly on image clarity and typicality of visual symptoms. DO NOT invent arbitrary fixed numbers.
6. Prioritize ORGANIC, BIOLOGICAL, AND CULTURAL solutions FIRST.
7. For chemical treatments, recommend verified university packages of practices only with strict PPE safety gear and label instructions. Never invent chemical dosages.
8. State clearly that this is an AI assessment and not an absolute laboratory diagnosis.

Return ONLY strict valid JSON matching this schema exactly (no markdown formatting, no code block backticks):
{
  "crop": "Specific crop name in ${lang}",
  "issue_type": "disease" | "pest" | "nutrient_deficiency" | "environmental_stress" | "healthy" | "unknown" | "analysis_unavailable",
  "possible_issue": "Specific identified problem or 'Healthy Crop' in ${lang}",
  "confidence": 82,
  "symptoms": ["Visible symptom 1", "Visible symptom 2"],
  "severity": "low" | "medium" | "high" | "unknown",
  "organic_solutions": ["Organic cultural solution 1", "Organic solution 2"],
  "biological_solutions": ["Biocontrol agent 1", "Biocontrol agent 2"],
  "additional_treatment": ["Verified cautious practice"],
  "prevention": ["Preventative tip 1", "Preventative tip 2"],
  "needs_better_image": false,
  "warning": "Safety disclaimer clarifying AI estimate and KVK consultation",
  "language": "${lang}"
}
`;

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: mimeType || 'image/jpeg'
      }
    };

    for (const modelName of modelsToTry) {
      try {
        console.log(`[DISEASE DEBUG] provider = Google Gemini`);
        console.log(`[DISEASE DEBUG] model = ${modelName}`);
        console.log(`[DISEASE DEBUG] aiRequestStarted = true`);

        const model = ai.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([prompt, imagePart]);
        const text = result.response.text();

        console.log(`[DISEASE DEBUG] aiResponseReceived = true`);

        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        const confidenceVal = typeof parsed.confidence === 'number'
          ? Math.min(Math.max(parsed.confidence, 0), 100)
          : 75;

        return {
          crop: parsed.crop || 'Identified Crop',
          issue_type: parsed.issue_type || 'disease',
          possible_issue: parsed.possible_issue || 'Plant Health Inspection',
          confidence: confidenceVal,
          symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
          severity: ['low', 'medium', 'high', 'unknown'].includes(parsed.severity) ? parsed.severity : 'medium',
          organic_solutions: Array.isArray(parsed.organic_solutions) ? parsed.organic_solutions : [],
          biological_solutions: Array.isArray(parsed.biological_solutions) ? parsed.biological_solutions : [],
          additional_treatment: Array.isArray(parsed.additional_treatment) ? parsed.additional_treatment : [],
          prevention: Array.isArray(parsed.prevention) ? parsed.prevention : [],
          warning: parsed.warning || 'AI assessment for advisory only. Consult your local agricultural officer.',
          language: lang,
          providerUsed: `Google Gemini (${modelName})`
        };
      } catch (err: any) {
        console.warn(`[DISEASE DEBUG] Gemini model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    throw lastError || new Error('Gemini vision analysis failed on all models.');
  }

  static async chat(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    context: { crop?: string; location?: string; weather?: string },
    lang: 'en' | 'hi' | 'mr' = 'en'
  ): Promise<string> {
    const ai = this.getClient();
    if (!ai) throw new Error('Gemini API key is not configured.');

    const model = ai.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const langDirectives = {
      en: 'Respond in English. Farmer-friendly, practical, short, step-by-step.',
      hi: 'हिंदी में उत्तर दें। भारतीय किसान के लिए सरल, व्यावहारिक, चरणबद्ध एवं स्पष्ट भाषा का प्रयोग करें।',
      mr: 'मराठीमध्ये उत्तर द्या. शेतकऱ्यांसाठी सोपी, व्यावहारिक, मुद्यांनुसार आणि अत्यंत उपयुक्त माहिती द्या.'
    };

    const systemPrompt = `You are KrishiMitra, an empathetic, highly knowledgeable agricultural companion for Indian farmers.
${langDirectives[lang]}
Active farm context:
- Crops: ${context.crop || 'General agriculture'}
- Location: ${context.location || 'India'}
- Current Weather: ${context.weather || 'Normal'}

Guidance:
- Give biological and organic practices preference.
- Provide simple actionable steps.
- Avoid technical jargon.
- Never invent unverified chemical mixtures.
`;

    const chat = model.startChat({
      history: history.slice(-6).map((h) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.6
      }
    });

    const response = await chat.sendMessage(`${systemPrompt}\n\nFarmer Query: ${message}`);
    return response.response.text();
  }
}
