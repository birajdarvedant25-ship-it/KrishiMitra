import app from '../backend/dist/app.js';

// Vercel Serverless Function catch-all entrypoint for Express API (/api/*)
export default function handler(req: any, res: any) {
  // If invoked with Vercel catch-all route parameter where req.url is missing subpath
  if (req.query?.path) {
    const subpath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    if (!req.url.startsWith(`/api/${subpath}`)) {
      req.url = `/api/${subpath}`;
    }
  }
  return app(req, res);
}
