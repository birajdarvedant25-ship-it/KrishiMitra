import app from '../backend/app.mjs';

// Vercel Serverless Function entrypoint for Express API (/api)
export default function handler(req, res) {
  try {
    if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
      req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
    }
    return app(req, res);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      status: 'error',
      phase: 'handler',
      message: err.message || String(err),
      stack: err.stack
    }));
  }
}

export { app };
