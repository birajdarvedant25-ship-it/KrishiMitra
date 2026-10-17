import app from '../backend/dist/app.js';

// Vercel Serverless Function entrypoint for Express API (/api)
export default function handler(req: any, res: any) {
  return app(req, res);
}
