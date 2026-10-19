// Universal CommonJS / ESM bridge for root Vercel Serverless Function & Express runtime
let appInstance;

try {
  const cjs = require('./backend/app.cjs');
  appInstance = cjs.default || cjs.app || cjs;
} catch (err) {
  // If require fails (e.g. running under ESM loader), fall back to async handler
}

let asyncAppPromise = null;

const handler = async (req, res) => {
  try {
    if (!appInstance) {
      if (!asyncAppPromise) {
        asyncAppPromise = import('./backend/app.mjs').then(m => m.default || m.app || m);
      }
      appInstance = await asyncAppPromise;
    }
    return appInstance(req, res);
  } catch (err) {
    console.error('[CRITICAL] Root function invocation error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      status: 'error',
      error: 'KrishiMitra Backend Function Invocation Failed',
      message: err.message
    }));
  }
};

module.exports = appInstance || handler;
module.exports.default = appInstance || handler;
module.exports.app = appInstance || handler;
