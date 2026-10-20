import app from '../backend/app.mjs';

// Vercel Serverless Function entrypoint for Express API
export default function handler(req, res) {
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
    req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
  }
  return app(req, res);
}

export { app };
