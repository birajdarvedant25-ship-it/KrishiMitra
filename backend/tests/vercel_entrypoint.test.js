import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');

test('Vercel Backend Service Entrypoint Integration Suite (app.js & app.mjs)', async (t) => {
  // Verify all required production service entrypoint build artifacts exist
  const appJsPath = path.resolve(backendRoot, 'app.js');
  const rootAppJsPath = path.resolve(backendRoot, '../app.js');
  const appMjsPath = path.resolve(backendRoot, 'app.mjs');
  const appCjsPath = path.resolve(backendRoot, 'app.cjs');
  const distAppJsPath = path.resolve(backendRoot, 'dist/app.js');

  assert.ok(fs.existsSync(appJsPath), 'backend/app.js must exist as production service entrypoint');
  assert.ok(fs.existsSync(rootAppJsPath), 'app.js (root) must exist for top-level entrypoint resolution');
  assert.ok(fs.existsSync(appMjsPath), 'backend/app.mjs must exist as production ESM entrypoint');
  assert.ok(fs.existsSync(appCjsPath), 'backend/app.cjs must exist as production CJS entrypoint');
  assert.ok(fs.existsSync(distAppJsPath), 'backend/dist/app.js must exist');

  // Verify that backend/app.js and root/app.js export an Express application
  const { default: backendAppJs } = await import('../app.js');
  assert.equal(typeof backendAppJs, 'function', 'backend/app.js must export an Express application');
  const { default: rootAppJs } = await import('../../app.js');
  assert.equal(typeof rootAppJs, 'function', 'root app.js must export an Express application');

  // Import backend/app.mjs
  const { default: appMjs } = await import('../app.mjs');
  assert.equal(typeof appMjs, 'function', 'backend/app.mjs must export an Express application');

  // Start HTTP server using the Express app from app.mjs
  const server = http.createServer((req, res) => {
    return appMjs(req, res);
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  t.after(() => {
    server.close();
  });

  await t.test('1. GET /api/health returns HTTP 200 with JSON payload', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.ok(data.app.includes('KrishiMitra'));
  });

  await t.test('2. GET /api/weather/current returns HTTP 200 with weather data', async () => {
    const res = await fetch(`${baseUrl}/api/weather/current?location=Pune`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.weather.temperature !== undefined);
  });

  await t.test('3. POST /api/disease/analyze handles request safely', async () => {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const body = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="cropHint"',
      '',
      'tomato',
      `--${boundary}`,
      'Content-Disposition: form-data; name="image"; filename="leaf.png"',
      'Content-Type: image/png',
      '',
      'fake-png-data',
      `--${boundary}--`
    ].join('\r\n');

    const res = await fetch(`${baseUrl}/api/disease/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body
    });

    assert.ok(res.status === 200 || res.status === 400 || res.status === 429);
    const data = await res.json();
    assert.ok(data.success !== undefined);
  });

  await t.test('4. GET /api/disease/history returns HTTP 200 with array', async () => {
    const res = await fetch(`${baseUrl}/api/disease/history`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.history));
  });

  await t.test('5. GET /api/crops returns HTTP 200 with list of crops', async () => {
    const res = await fetch(`${baseUrl}/api/crops`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.crops));
  });

  await t.test('6. GET /api/alerts returns HTTP 200 with dynamic alerts', async () => {
    const res = await fetch(`${baseUrl}/api/alerts?location=Nashik`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.alerts));
  });

  await t.test('7. GET /api/advisor/daily returns HTTP 200 with daily advisory', async () => {
    const res = await fetch(`${baseUrl}/api/advisor/daily?location=Nagpur`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.advisory.farmingAdvice !== undefined);
  });
});
