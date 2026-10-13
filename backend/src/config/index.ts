import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multi-path loader for robust environment variable discovery
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(process.cwd(), '.env.example'),
  path.resolve(process.cwd(), 'backend/.env.example'),
  path.resolve(__dirname, '../../.env.example'),
  path.resolve(__dirname, '../../../.env.example')
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

const rawAiMode = (process.env.AI_MODE || 'mock').trim().toLowerCase();
const resolvedAiMode = rawAiMode === 'production' ? 'production' : 'mock';

export const config = {
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'krishimitra_super_secret_jwt_key_2026_dev',
  aiMode: resolvedAiMode as 'mock' | 'production',
  geminiApiKey: process.env.GEMINI_API_KEY?.trim() || '',
  openaiApiKey: process.env.OPENAI_API_KEY?.trim() || '',
  weatherApiKey: process.env.WEATHER_API_KEY?.trim() || '',
  databasePath: process.env.DATABASE_PATH || path.resolve(__dirname, '../../data/krishimitra.json'),
  uploadDir: path.resolve(__dirname, '../../uploads')
};
