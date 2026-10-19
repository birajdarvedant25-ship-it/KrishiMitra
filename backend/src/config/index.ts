import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const getDirname = (): string => {
  const g = globalThis as any;
  if (typeof g.__dirname === 'string') return g.__dirname;
  return path.dirname(fileURLToPath(import.meta.url));
};
const __dirname: string = getDirname();

// Multi-path loader for robust environment variable discovery
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env')
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

const rawAiMode = (process.env.AI_MODE || '').trim().toLowerCase();
const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)?.trim() || '';
const openaiKey = process.env.OPENAI_API_KEY?.trim() || '';

// If explicitly set to 'mock', run in mock mode.
// If explicitly set to 'production' or if any real AI key is configured, run in real production AI mode.
const resolvedAiMode = rawAiMode === 'mock'
  ? 'mock'
  : (rawAiMode === 'production' || rawAiMode === 'live' || Boolean(geminiKey || openaiKey))
    ? 'production'
    : 'mock';

const isVercel = Boolean(process.env.VERCEL);
const defaultDbPath = isVercel
  ? path.join('/tmp', 'krishimitra.json')
  : path.resolve(__dirname, '../../data/krishimitra.json');
const defaultUploadDir = isVercel
  ? path.join('/tmp', 'uploads')
  : path.resolve(__dirname, '../../uploads');

export const config = {
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'krishimitra_super_secret_jwt_key_2026_dev',
  aiMode: resolvedAiMode as 'mock' | 'production',
  geminiApiKey: geminiKey,
  geminiModel: process.env.GEMINI_MODEL?.trim() || '',
  openaiApiKey: openaiKey,
  weatherApiKey: process.env.WEATHER_API_KEY?.trim() || '',
  databasePath: process.env.DATABASE_PATH || defaultDbPath,
  uploadDir: process.env.UPLOAD_DIR || defaultUploadDir
};
