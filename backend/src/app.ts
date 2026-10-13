import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { authRouter } from './routes/auth.js';
import { profileRouter } from './routes/profile.js';
import { cropsRouter } from './routes/crops.js';
import { diseaseRouter } from './routes/disease.js';
import { weatherRouter } from './routes/weather.js';
import { irrigationRouter } from './routes/irrigation.js';
import { advisorRouter } from './routes/advisor.js';
import { alertsRouter } from './routes/alerts.js';

const app = express();

// CORS Configuration supporting local browser, LAN, Capacitor Android WebView, and Vercel domains
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
    // Mobile native requests, Capacitor HTTP plugins, serverless rewrites, and CLI tools send no origin header
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      (config.clientUrl && origin === config.clientUrl) ||
      /^https?:\/\/([a-zA-Z0-9-]+\.)*vercel\.app(:[0-9]+)?$/.test(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin) ||
      /^capacitor:\/\/localhost(:[0-9]+)?$/.test(origin) ||
      /^https?:\/\/localhost(:[0-9]+)?$/.test(origin)
    ) {
      return callback(null, true);
    }

    // Default to allow for deployed production domains and previews
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve uploaded images securely
app.use('/uploads', express.static(config.uploadDir));

// Root API info & Health Check
app.get('/api', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'KrishiMitra API',
    aiMode: config.aiMode,
    timestamp: new Date().toISOString()
  });
});

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

export { app };
export default app;
