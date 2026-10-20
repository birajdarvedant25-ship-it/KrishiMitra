import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let appInstance = null;
let initError = null;

// Candidate bundle paths inside backend service
const candidatePaths = [
  path.resolve(__dirname, 'app.cjs'),
  path.resolve(__dirname, 'dist/app.cjs'),
  path.resolve(__dirname, 'app.mjs'),
  path.resolve(__dirname, 'dist/app.mjs')
];

for (const candidate of candidatePaths) {
  if (fs.existsSync(candidate)) {
    try {
      if (candidate.endsWith('.cjs')) {
        const mod = require(candidate);
        appInstance = mod.default || mod.app || mod;
      } else {
        const mod = await import(candidate);
        appInstance = mod.default || mod.app || mod;
      }
      if (typeof appInstance === 'function') {
        break;
      }
    } catch (err) {
      console.warn(`[ENTRYPOINT] Failed loading ${candidate}:`, err.message);
      if (!initError) initError = err;
    }
  }
}

if (!appInstance && !initError) {
  initError = new Error('No candidate application bundle could be resolved in backend directory.');
}

export default function handler(req, res) {
  if (initError) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      status: 'error',
      phase: 'initialization',
      message: initError.message || String(initError),
      stack: initError.stack,
      cwd: process.cwd(),
      dirname: __dirname
    }));
  }

  // URL normalization: if Vercel strips '/api', ensure it is present for Express routing
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
    req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
  }

  try {
    return appInstance(req, res);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      status: 'error',
      phase: 'request',
      message: err.message || String(err),
      stack: err.stack
    }));
  }
}

export { handler };
export { appInstance as app };
