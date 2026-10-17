import OpenAI from 'openai';
import { config } from '../../config/index.js';
import { DiseaseAnalysisResult } from './mockAiService.js';

export class OpenAiService {
  private static getClient(): OpenAI | null {
    if (!config.openaiApiKey) return null;
    return new OpenAI({ apiKey: config.openaiApiKey });
  }

  static async analyzeCropImage(
    imageBuffer: Buffer,
    mimeType: string,
    cropHint?: string,
    lang: 'en' | 'hi' | 'mr' = 'en'
  ): Promise<DiseaseAnalysisResult> {
    const openai = this.getClient();
    if (!openai) {
      throw new Error('OpenAI API key is not configured.');
    }

    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${base64Image}`;

    const langInstructions = {
      en: 'Respond in English. Simple, practical wording for farmers.',
      hi: 'हिंदी में उत्तर दें। भारतीय किसान के अनुकूल सरल भाषा का प्रयोग करें।',
      mr: 'मराठीत उत्तर द्या. शेतकरी बांधवांना समजेल अशी सुलभ भाषा वापरा.'
    };

    const systemPrompt = `You are KrishiMitra, an expert AI agricultural plant pathologist.
${langInstructions[lang]}
Inspect the uploaded crop image carefully.
Allowed issue types: "disease", "pest", "nutrient_deficiency", "environmental_stress", "healthy", "unknown", "analysis_unavailable".
If healthy, note plant appears healthy.
Priority: Organic and biological treatments FIRST.
Safety: No invented pesticide dosages. Cautionary language only.
Return ONLY valid JSON matching this schema:
{
  "crop": "Crop name in ${lang}",
  "issue_type": "disease" | "pest" | "nutrient_deficiency" | "environmental_stress" | "healthy" | "unknown" | "analysis_unavailable",
  "possible_issue": "Identified disease/pest or 'Healthy Crop' in ${lang}",
  "confidence": 80,
  "symptoms": ["Symptom 1", "Symptom 2"],
  "severity": "low" | "medium" | "high" | "unknown",
  "organic_solutions": ["Organic solution 1"],
  "biological_solutions": ["Biocontrol 1"],
  "additional_treatment": ["Precautionary verified practice"],
  "prevention": ["Preventative cultural tip"],
  "warning": "Safety disclaimer regarding AI estimate and agricultural officer consultation",
  "language": "${lang}"
}`;

    console.log(`[DISEASE DEBUG] provider = OpenAI`);
    console.log(`[DISEASE DEBUG] model = gpt-4o-mini`);
    console.log(`[DISEASE DEBUG] aiRequestStarted = true`);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Identify crop and condition from this photo. Notes: ${cropHint || 'None'}` },
            { type: 'image_url', image_url: { url: dataUrl } }
          ]
        }
      ],
      max_tokens: 1000
    });

    console.log(`[DISEASE DEBUG] aiResponseReceived = true`);

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    const confidenceVal = typeof parsed.confidence === 'number'
      ? Math.min(Math.max(parsed.confidence, 0), 100)
      : 75;

    return {
      crop: parsed.crop || 'Crop',
      possible_issue: parsed.possible_issue || 'Plant Health Inspection',
      confidence: confidenceVal,
      symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
      severity: ['low', 'medium', 'high', 'unknown'].includes(parsed.severity) ? parsed.severity : 'medium',
      organic_solutions: Array.isArray(parsed.organic_solutions) ? parsed.organic_solutions : [],
      biological_solutions: Array.isArray(parsed.biological_solutions) ? parsed.biological_solutions : [],
      additional_treatment: Array.isArray(parsed.additional_treatment) ? parsed.additional_treatment : [],
      prevention: Array.isArray(parsed.prevention) ? parsed.prevention : [],
      warning: parsed.warning || 'AI assessment for guidance. Consult your nearest agricultural extension worker.',
      language: lang,
      providerUsed: 'OpenAI (GPT-4o Vision)'
    };
  }

  static async chat(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    context: { crop?: string; location?: string; weather?: string },
    lang: 'en' | 'hi' | 'mr' = 'en'
  ): Promise<string> {
    const openai = this.getClient();
    if (!openai) throw new Error('OpenAI API key is not configured.');

    const langDirectives = {
      en: 'Respond in English. Simple, practical, concise, step-by-step.',
      hi: 'हिंदी में उत्तर दें। भारतीय किसान के लिए सरल व सुबोध भाषा रखें।',
      mr: 'मराठीत उत्तर द्या. सोप्या मुद्द्यांमध्ये स्पष्ट सल्ला द्या.'
    };

    const systemPrompt = `You are KrishiMitra, an empathetic Indian AI farmer assistant.
${langDirectives[lang]}
Farmer Context:
- Active Crops: ${context.crop || 'General agriculture'}
- Location: ${context.location || 'India'}
- Weather: ${context.weather || 'Normal'}
Rules:
- Promote organic/biological treatments first.
- Clear, bulleted, actionable steps.
- No invented chemical dosages.`;

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map((h) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 600,
      temperature: 0.6
    });

    return response.choices[0]?.message?.content || 'No response available.';
  }
}
