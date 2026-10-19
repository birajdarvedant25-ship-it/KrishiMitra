import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const getDirname = (): string => {
  try {
    if (typeof __dirname === 'string') return __dirname;
  } catch {}
  try {
    const getMetaUrl = new Function('return typeof import.meta !== "undefined" && import.meta ? import.meta.url : null');
    const metaUrl = getMetaUrl();
    if (metaUrl) {
      return path.dirname(fileURLToPath(metaUrl));
    }
  } catch {}
  return process.cwd();
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

let resolvedDbPath = process.env.DATABASE_PATH || defaultDbPath;
if (isVercel && !resolvedDbPath.startsWith('/tmp')) {
  resolvedDbPath = path.join('/tmp', path.basename(resolvedDbPath).replace(/\.db$/, '.json'));
}

let resolvedUploadDir = process.env.UPLOAD_DIR || defaultUploadDir;
if (isVercel && !resolvedUploadDir.startsWith('/tmp')) {
  resolvedUploadDir = path.join('/tmp', 'uploads');
}

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
  databasePath: resolvedDbPath,
  uploadDir: resolvedUploadDir
};

