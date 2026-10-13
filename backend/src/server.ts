import { app } from './app.js';
import { config } from './config/index.js';

// Start Server on 0.0.0.0:5000 (accessible on localhost and Android/LAN)
const server = app.listen(config.port, config.host, () => {
  console.log(`
🌾 ======================================================== 🌾
   KrishiMitra Backend running on:
   - Host: ${config.host}:${config.port}
   - Local: http://localhost:${config.port}
   - Android / LAN: http://192.168.1.21:${config.port}
   AI Mode: ${config.aiMode.toUpperCase()}
   Gemini API Key: ${config.geminiApiKey ? 'CONFIGURED' : 'MOCK / FALLBACK'}
   OpenAI API Key: ${config.openaiApiKey ? 'CONFIGURED' : 'MOCK / FALLBACK'}
🌾 ======================================================== 🌾
  `);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[SERVER] Port ${config.port} is already in use. Reusing running server.`);
  } else {
    console.error('[SERVER] Startup error:', err);
  }
});

export { app, server };
export default app;
