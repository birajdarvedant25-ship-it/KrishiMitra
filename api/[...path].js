import app from '../backend/app.mjs';

// Vercel Serverless Function catch-all entrypoint for Express API (/api/*)
export default function handler(req, res) {
  try {
    if (req.query?.path) {
      const subpath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
      const queryIdx = req.url ? req.url.indexOf('?') : -1;
      const queryString = queryIdx !== -1 ? req.url.substring(queryIdx) : '';
      if (!req.url || !req.url.startsWith(`/api/${subpath}`)) {
        req.url = `/api/${subpath}${queryString}`;
      }
    } else if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
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
