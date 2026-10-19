// Universal CommonJS / ESM bridge for Vercel Serverless Function & Express runtime
let appPromise;

const handler = async (req, res) => {
  if (!appPromise) {
    appPromise = import('./backend/app.mjs').then(m => m.default || m.app || m);
  }
  const app = await appPromise;
  return app(req, res);
};

module.exports = handler;
module.exports.default = handler;
module.exports.app = handler;
