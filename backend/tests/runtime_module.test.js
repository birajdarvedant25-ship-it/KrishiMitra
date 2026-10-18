import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');

test('Vercel Production Runtime Module Loading & Regression Suite', async (t) => {
  await t.test('1. Verify build artifacts exist (both app.mjs and dist/app.js)', () => {
    const appMjsPath = path.join(backendRoot, 'app.mjs');
    const distAppJsPath = path.join(backendRoot, 'dist/app.js');
    const distAppMjsPath = path.join(backendRoot, 'dist/app.mjs');

    assert.ok(fs.existsSync(appMjsPath), 'backend/app.mjs must exist as production service entrypoint');
    assert.ok(fs.existsSync(distAppJsPath), 'backend/dist/app.js must exist for TypeScript and API route consumers');
    assert.ok(fs.existsSync(distAppMjsPath), 'backend/dist/app.mjs must exist as bundled ESM distribution');
  });

  await t.test('2. Regression check: Isolated CommonJS environment reproduces syntax error on app.js but succeeds on app.mjs', () => {
    const sandboxDir = path.join(backendRoot, '../scratch/sandbox_module_test');
    fs.mkdirSync(sandboxDir, { recursive: true });

    // Emulate AWS Lambda /var/task default CommonJS module scope (missing "type": "module")
    fs.writeFileSync(
      path.join(sandboxDir, 'package.json'),
      JSON.stringify({ name: 'isolated-task', version: '1.0.0', type: 'commonjs' }, null, 2)
    );

    // Write a .js file using ESM import (the exact state that previously crashed Vercel)
    fs.writeFileSync(
      path.join(sandboxDir, 'crasher.js'),
      'import express from "express";\nexport default express();\n'
    );

    // Verify crasher.js fails with SyntaxError: Cannot use import statement outside a module
    let crashError = '';
    try {
      execSync('node crasher.js', { cwd: sandboxDir, stdio: 'pipe' });
    } catch (err) {
      crashError = err.stderr ? err.stderr.toString() : err.message;
    }

    assert.ok(
      crashError.includes('Cannot use import statement outside a module'),
      `Expected SyntaxError on unbundled .js in CommonJS scope, got: ${crashError}`
    );

    // Copy production app.mjs into the sandbox
    fs.copyFileSync(path.join(backendRoot, 'app.mjs'), path.join(sandboxDir, 'app.mjs'));

    // Runner importing app.mjs in the CommonJS sandbox
    fs.writeFileSync(
      path.join(sandboxDir, 'check.mjs'),
      `
import app from './app.mjs';
import assert from 'node:assert/strict';
assert.equal(typeof app, 'function', 'app should export an Express function');
console.log('SANDBOX_LOAD_OK');
`
    );

    const out = execSync('node check.mjs', { cwd: sandboxDir, stdio: 'pipe' }).toString();
    assert.ok(out.includes('SANDBOX_LOAD_OK'), 'app.mjs must load cleanly in CommonJS sandbox');
  });

  await t.test('3. Verify real Express backend routes execute properly on app.mjs', async () => {
    const { default: app } = await import('../app.mjs');
    assert.equal(typeof app, 'function', 'app.mjs default export must be an Express application function');

    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      // Health Check
      const healthRes = await fetch(`${baseUrl}/api/health`);
      assert.equal(healthRes.status, 200);
      const healthData = await healthRes.json();
      assert.equal(healthData.status, 'ok');
      assert.equal(healthData.app, 'KrishiMitra AI Farming Assistant Backend');

      // Weather Current
      const weatherRes = await fetch(`${baseUrl}/api/weather/current?location=Nashik`);
      assert.equal(weatherRes.status, 200);
      const weatherData = await weatherRes.json();
      assert.equal(weatherData.success, true);
      assert.ok(weatherData.weather);

      // Crops Listing
      const cropsRes = await fetch(`${baseUrl}/api/crops`);
      assert.equal(cropsRes.status, 200);
      const cropsData = await cropsRes.json();
      assert.equal(cropsData.success, true);
      assert.ok(Array.isArray(cropsData.crops));

      // Crops Supported Meta
      const metaRes = await fetch(`${baseUrl}/api/crops/meta/supported`);
      assert.equal(metaRes.status, 200);
      const metaData = await metaRes.json();
      assert.equal(metaData.success, true);
      assert.ok(metaData.supportedCrops.length > 0);

      // Alerts
      const alertsRes = await fetch(`${baseUrl}/api/alerts?location=Nashik&lang=en`);
      assert.equal(alertsRes.status, 200);
      const alertsData = await alertsRes.json();
      assert.equal(alertsData.success, true);
      assert.ok(Array.isArray(alertsData.alerts));

      // 404 JSON Fallback
      const notFoundRes = await fetch(`${baseUrl}/api/route-that-does-not-exist`);
      assert.equal(notFoundRes.status, 404);
      const notFoundData = await notFoundRes.json();
      assert.equal(notFoundData.success, false);
    } finally {
      server.close();
    }
  });
});
