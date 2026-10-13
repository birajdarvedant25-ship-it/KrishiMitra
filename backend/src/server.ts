import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { authRouter } from './routes/auth.js';
import { profileRouter } from './routes/profile.js';
import { cropsRouter } from './routes/crops.js';
import { diseaseRouter } from './routes/disease.js';
import { weatherRouter } from './routes/weather.js';
import { irrigationRouter } from './routes/irrigation.js';
import { advisorRouter } from './routes/advisor.js';
import { alertsRouter } from './routes/alerts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Configuration supporting local browser, LAN, and Capacitor Android WebView
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.1.21:5173',
  'http://192.168.1.21:5000',
  'capacitor://localhost',
  'http://localhost',
  'https://localhost'
];

app.use(cors({
  origin: (origin, callback) => {
    // Mobile native requests, Capacitor HTTP plugins, and CLI tools send no origin header
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin) ||
      /^capacitor:\/\/localhost(:[0-9]+)?$/.test(origin) ||
      /^https?:\/\/localhost(:[0-9]+)?$/.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve uploaded images securely
app.use('/uploads', express.static(config.uploadDir));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'KrishiMitra AI Farming Assistant Backend',
    aiMode: config.aiMode,
    geminiConfigured: Boolean(config.geminiApiKey),
    openaiConfigured: Boolean(config.openaiApiKey),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/crops', cropsRouter);
app.use('/api/disease', diseaseRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/irrigation', irrigationRouter);
app.use('/api/advisor', advisorRouter);
app.use('/api/alerts', alertsRouter);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong. Please try again shortly.'
  });
});

// Start Server on 0.0.0.0:5000 (accessible on localhost and Android/LAN)
const server = app.listen(config.port, config.host, () => {
  console.log(`
🌾 ======================================================== 🌾
   KrishiMitra Backend running on:
   - Host: ${config.host}:${config.port}
   - Local: http://localhost:${config.port}
   - Android / LAN: http://192.168.1.21:${config.port}
   AI Mode: ${config.aiMode.toUpperCase()}
   Gemini API Key: ${config.geminiApiKey ? 'CONFIGURED' : 'MOCK / FALLBACK'}
   OpenAI API Key: ${config.openaiApiKey ? 'CONFIGURED' : 'MOCK / FALLBACK'}
🌾 ======================================================== 🌾
  `);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[SERVER] Port ${config.port} is already in use. Reusing running server.`);
  } else {
    console.error('[SERVER] Startup error:', err);
  }
});

export { app, server };
