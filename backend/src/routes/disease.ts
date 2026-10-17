import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { db, DiseaseAnalysis } from '../db/index.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';
import { AIService } from '../services/ai/aiService.js';
import { WeatherService } from '../services/weather/weatherService.js';
import { config } from '../config/index.js';

export const diseaseRouter = Router();

// Ensure upload directory exists
try {
  if (!fs.existsSync(config.uploadDir)) {
    fs.mkdirSync(config.uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('[UPLOAD] Upload directory notice:', err);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      if (!fs.existsSync(config.uploadDir)) {
        fs.mkdirSync(config.uploadDir, { recursive: true });
      }
    } catch {}
    cb(null, config.uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `crop-${Date.now()}-${uuidv4().substring(0, 8)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Please upload JPG, PNG, or WEBP image.'));
    }
  }
});

// Analyze Disease
diseaseRouter.post(
  '/analyze',
  optionalAuth,
  upload.single('image'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { cropHint, language, imageBase64 } = req.body;
      const lang = ['en', 'hi', 'mr'].includes(language) ? language : req.user?.preferredLanguage || 'en';

      let imageBuffer: Buffer | null = null;
      let mimeType = 'image/jpeg';
      let filename = 'crop-capture.jpg';
      let imageUrl = '/uploads/sample-leaf.jpg';

      if (req.file) {
        imageBuffer = fs.readFileSync(req.file.path);
        mimeType = req.file.mimetype;
        filename = req.file.filename;
        imageUrl = `/uploads/${req.file.filename}`;
      } else if (imageBase64) {
        const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          imageBuffer = Buffer.from(matches[2], 'base64');
        } else {
          imageBuffer = Buffer.from(imageBase64, 'base64');
        }
        filename = `capture-${Date.now()}.jpg`;
        const savePath = path.join(config.uploadDir, filename);
        try {
          fs.writeFileSync(savePath, imageBuffer);
          imageUrl = `/uploads/${filename}`;
        } catch {
          imageUrl = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
        }
      }

      // Check if image was received
      if (!imageBuffer || imageBuffer.length === 0) {
        if (config.aiMode === 'production') {
          res.status(400).json({
            success: false,
            message: 'No image provided. Please select or capture a crop photo.'
          });
          return;
        } else {
          imageBuffer = Buffer.from('mock-demo-placeholder');
          filename = 'demo-leaf.jpg';
        }
      }

      // Safe Diagnostic Logging (never logs API keys or full base64 image data)
      console.log(`[DISEASE DEBUG] mode = ${config.aiMode}`);
      console.log(`[DISEASE DEBUG] imageReceived = true`);
      console.log(`[DISEASE DEBUG] mimeType = ${mimeType}`);
      console.log(`[DISEASE DEBUG] imageSize = ${imageBuffer.length} bytes`);
      console.log(`[DISEASE DEBUG] imageEncodedLength = ${imageBuffer.toString('base64').length}`);
      console.log(`[DISEASE DEBUG] aiRequestStarted = true`);

      // Obtain live farm and weather context for enriched multimodal diagnosis
      const userLocation = req.user?.district || 'Pune, Maharashtra';
      let weatherSummary = '';
      try {
        const liveWeather = await WeatherService.getLiveWeather(userLocation);
        weatherSummary = `${liveWeather.condition}, Temp: ${liveWeather.temperature}°C, Humidity: ${liveWeather.humidity}%, Rain probability: ${liveWeather.rainProbability}%`;
      } catch (wErr) {
        console.warn('[DISEASE DEBUG] Weather context lookup skipped:', wErr);
      }

      // Analyze using Multi-AI Orchestrator with real image and farm context
      const analysis = await AIService.analyzeDisease(
        imageBuffer,
        mimeType,
        filename,
        cropHint,
        lang as 'en' | 'hi' | 'mr',
        { location: userLocation, weather: weatherSummary }
      );

      console.log(`[DISEASE DEBUG] aiResponseReceived = true`);
      console.log(`[DISEASE DEBUG] providerUsed = ${analysis.providerUsed}`);

      // Persist analysis in database
      const record: DiseaseAnalysis = {
        id: uuidv4(),
        userId: req.user?.id,
        imageUrl,
        cropIdentified: analysis.crop,
        possibleIssue: analysis.possible_issue,
        confidence: analysis.confidence,
        symptoms: analysis.symptoms,
        severity: analysis.severity,
        organicSolutions: analysis.organic_solutions,
        biologicalSolutions: analysis.biological_solutions,
        additionalTreatment: analysis.additional_treatment,
        prevention: analysis.prevention,
        warning: analysis.warning,
        language: lang,
        issueType: analysis.issue_type,
        createdAt: new Date().toISOString()
      };

      db.diseaseAnalyses.create(record);

      res.status(200).json({
        success: true,
        analysis: record,
        providerUsed: analysis.providerUsed,
        needs_better_image: analysis.needs_better_image || false,
        issue_type: analysis.issue_type || 'unknown'
      });
    } catch (err: any) {
      console.error('[DISEASE DEBUG] Disease analysis route error:', err);
      res.status(500).json({
        success: false,
        message: 'Could not complete image analysis at this time. Please ensure the image is clear and try again.'
      });
    }
  }
);

// Get Recent Analyses History
diseaseRouter.get('/history', optionalAuth, (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  const history = db.diseaseAnalyses.findByUserId(userId);
  res.json({ success: true, history });
});

// Get Single Analysis
diseaseRouter.get('/:id', (req, res: Response): void => {
  const { id } = req.params;
  const item = db.diseaseAnalyses.findById(id);

  if (!item) {
    res.status(404).json({ success: false, message: 'Diagnosis record not found.' });
    return;
  }

  res.json({ success: true, analysis: item });
});
