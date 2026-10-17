import test from 'node:test';
import assert from 'node:assert/strict';

// Test URLs
const BASE_URL = 'http://localhost:5000/api';

test('KrishiMitra Backend API Test Suite', async (t) => {
  // We can dynamically start the server if not running or import app
  const { app, server } = await import('../dist/server.js');

  t.after(() => {
    if (server && server.listening) {
      server.close();
    }
  });

  await t.test('1. Health Check Endpoint', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.equal(data.app, 'KrishiMitra AI Farming Assistant Backend');
  });

  await t.test('2. Authentication Flow - Registration & Login', async () => {
    const testUser = {
      name: 'Ramesh Patil',
      emailOrPhone: `testfarmer_${Date.now()}@krishi.com`,
      password: 'securepassword123',
      preferredLanguage: 'mr',
      state: 'Maharashtra',
      district: 'Nashik'
    };

    // Register
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    assert.equal(regRes.status, 201);
    const regData = await regRes.json();
    assert.equal(regData.success, true);
    assert.ok(regData.token);
    assert.equal(regData.user.preferredLanguage, 'mr');

    // Duplicate Registration Failure
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    assert.equal(dupRes.status, 409);

    // Login with valid credentials
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: testUser.emailOrPhone,
        password: testUser.password
      })
    });
    assert.equal(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.equal(loginData.success, true);
    assert.ok(loginData.token);

    // Login with invalid password
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: testUser.emailOrPhone,
        password: 'wrongpassword'
      })
    });
    assert.equal(badLoginRes.status, 401);
  });

  await t.test('3. Weather API - Live Open-Meteo & Location Resolution', async () => {
    // Valid location (Nashik)
    const res = await fetch(`${BASE_URL}/weather/current?location=Nashik`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.weather);
    assert.ok(data.weather.temperature !== undefined);
    assert.ok(data.weather.agriculturalImpact);
    assert.ok(data.weather.forecast.length > 0);

    // Coordinate resolution (Pune)
    const coordRes = await fetch(`${BASE_URL}/weather/current?lat=18.5204&lon=73.8567`);
    assert.equal(coordRes.status, 200);
    const coordData = await coordRes.json();
    assert.equal(coordData.success, true);
  });

  await t.test('4. Crop Disease Detection & AI Orchestrator Fallback', async () => {
    const samplePng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    // Multilingual Disease Analysis (Marathi)
    const mrRes = await fetch(`${BASE_URL}/disease/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cropHint: 'Tomato',
        language: 'mr',
        imageBase64: samplePng
      })
    });
    assert.equal(mrRes.status, 200);
    const mrData = await mrRes.json();
    assert.equal(mrData.success, true);
    assert.ok(Array.isArray(mrData.analysis.organicSolutions), 'Must return organic solutions array');

    // Hindi
    const hiRes = await fetch(`${BASE_URL}/disease/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cropHint: 'Cotton',
        language: 'hi',
        imageBase64: samplePng
      })
    });
    const hiData = await hiRes.json();
    assert.equal(hiData.success, true);
    assert.equal(hiData.analysis.language, 'hi');
    assert.ok(Array.isArray(hiData.analysis.organicSolutions), 'Must return organic solutions array');
  });

  await t.test('5. Irrigation Calculator', async () => {
    const irrRes = await fetch(`${BASE_URL}/irrigation/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cropName: 'Tomato',
        growthStage: 'Flowering & Fruit Set',
        soilType: 'Medium Black Soil',
        irrigationMethod: 'Drip Irrigation',
        soilMoistureLevel: 'dry',
        language: 'mr'
      })
    });
    assert.equal(irrRes.status, 200);
    const irrData = await irrRes.json();
    assert.equal(irrData.success, true);
    assert.ok(irrData.recommendation.title);
    assert.ok(irrData.recommendation.reason);
    assert.ok(irrData.recommendation.waterSavingTip);
  });

  await t.test('6. AI Farmer Assistant Chatbot & Daily Advisory', async () => {
    // Daily Advisory
    const advRes = await fetch(`${BASE_URL}/advisor/daily?location=Pune&lang=mr`);
    assert.equal(advRes.status, 200);
    const advData = await advRes.json();
    assert.equal(advData.success, true);
    assert.ok(advData.advisory.farmingAdvice);

    // Chatbot query in Marathi
    const chatRes = await fetch(`${BASE_URL}/advisor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'टोमॅटो पिकाला पाणी कधी द्यावे?',
        language: 'mr'
      })
    });
    assert.equal(chatRes.status, 200);
    const chatData = await chatRes.json();
    assert.equal(chatData.success, true);
    assert.ok(chatData.reply);
  });

  await t.test('7. Weather API - Dynamic Geocoding for Other Indian Cities', async () => {
    // Test dynamic geocoding for Surat
    const suratRes = await fetch(`${BASE_URL}/weather/current?location=Surat`);
    assert.equal(suratRes.status, 200);
    const suratData = await suratRes.json();
    assert.equal(suratData.success, true);
    assert.ok(suratData.weather.locationName.toLowerCase().includes('surat'));

    // Test dynamic geocoding for Ludhiana
    const ludhianaRes = await fetch(`${BASE_URL}/weather/current?location=Ludhiana`);
    assert.equal(ludhianaRes.status, 200);
    const ludhianaData = await ludhianaRes.json();
    assert.equal(ludhianaData.success, true);
    assert.ok(ludhianaData.weather.locationName.toLowerCase().includes('ludhiana'));
  });

  await t.test('8. Crops API - Listing & Supported Meta', async () => {
    const cropsRes = await fetch(`${BASE_URL}/crops`);
    assert.equal(cropsRes.status, 200);
    const cropsData = await cropsRes.json();
    assert.equal(cropsData.success, true);
    assert.ok(Array.isArray(cropsData.crops));

    const metaRes = await fetch(`${BASE_URL}/crops/meta/supported`);
    assert.equal(metaRes.status, 200);
    const metaData = await metaRes.json();
    assert.equal(metaData.success, true);
    assert.ok(metaData.supportedCrops.length > 0);
  });

  await t.test('9. Alerts API - Dynamic Weather & Condition Alerts', async () => {
    const alertsRes = await fetch(`${BASE_URL}/alerts?location=Nashik&lang=en`);
    assert.equal(alertsRes.status, 200);
    const alertsData = await alertsRes.json();
    assert.equal(alertsData.success, true);
    assert.ok(Array.isArray(alertsData.alerts));
  });

  await t.test('10. 404 JSON Fallback - Never returns unhandled HTML for unknown API paths', async () => {
    const missingRes = await fetch(`${BASE_URL}/nonexistent-route-for-testing`);
    assert.equal(missingRes.status, 404);
    const missingData = await missingRes.json();
    assert.equal(missingData.success, false);
    assert.ok(missingData.message.includes('API endpoint not found'));
  });
});
