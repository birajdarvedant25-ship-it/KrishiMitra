import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

test('Vercel API Serverless Function Entrypoints Integration Suite', async (t) => {
  // Import the exact files deployed to Vercel
  const { default: apiIndexHandler } = await import('../../api/index.js');
  const { default: apiCatchAllHandler } = await import('../../api/[...path].js');

  assert.equal(typeof apiIndexHandler, 'function', 'api/index.js must export a request handler function');
  assert.equal(typeof apiCatchAllHandler, 'function', 'api/[...path].js must export a request handler function');

  // Start an HTTP server that mimics Vercel's serverless function dispatcher
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;

    if (pathname === '/api' || pathname === '/api/') {
      return apiIndexHandler(req, res);
    }

    if (pathname.startsWith('/api/')) {
      // Simulate Vercel setting req.query for [...path]
      const subpathParts = pathname.replace(/^\/api\//, '').split('/');
      req.query = Object.fromEntries(url.searchParams.entries());
      req.query.path = subpathParts;
      return apiCatchAllHandler(req, res);
    }

    res.writeHead(404);
    res.end();
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  t.after(() => {
    server.close();
  });

  await t.test('1. GET /api/health via api/index and api/[...path]', async () => {
    // Direct /api endpoint
    const resRoot = await fetch(`${baseUrl}/api`);
    assert.equal(resRoot.status, 200);
    const dataRoot = await resRoot.json();
    assert.equal(dataRoot.status, 'ok');

    // Health endpoint via catch-all
    const resHealth = await fetch(`${baseUrl}/api/health`);
    assert.equal(resHealth.status, 200);
    const dataHealth = await resHealth.json();
    assert.equal(dataHealth.status, 'ok');
    assert.equal(dataHealth.app, 'KrishiMitra AI Farming Assistant Backend');
  });

  await t.test('2. GET /api/weather/current', async () => {
    const res = await fetch(`${baseUrl}/api/weather/current?location=Nashik`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.weather);
    assert.equal(data.weather.locationName, 'Nashik');
    assert.ok(typeof data.weather.temperature === 'number');
  });

  await t.test('3. POST /api/disease/analyze', async () => {
    // 1x1 transparent PNG base64
    const png1x1Base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    const res = await fetch(`${baseUrl}/api/disease/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cropHint: 'Tomato',
        imageBase64: png1x1Base64,
        language: 'en'
      })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.analysis);
    assert.ok(data.analysis.cropIdentified);
    assert.ok(typeof data.analysis.confidence === 'number');
  });

  await t.test('4. GET /api/disease/history', async () => {
    const res = await fetch(`${baseUrl}/api/disease/history`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.history));
  });

  await t.test('5. GET /api/crops', async () => {
    const res = await fetch(`${baseUrl}/api/crops`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.crops));
  });

  await t.test('6. GET /api/alerts', async () => {
    const res = await fetch(`${baseUrl}/api/alerts?location=Nashik&lang=en`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.alerts));
  });

  await t.test('7. GET /api/advisor/daily', async () => {
    const res = await fetch(`${baseUrl}/api/advisor/daily?location=Nashik&lang=en`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.advisory);
    assert.ok(data.advisory.farmingAdvice);
    assert.ok(data.advisory.irrigationTip);
    assert.ok(data.advisory.weatherSummary);
  });
});
