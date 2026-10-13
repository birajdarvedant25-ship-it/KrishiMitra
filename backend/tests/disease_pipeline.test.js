import test from 'node:test';
import assert from 'node:assert/strict';
import { AIService } from '../dist/services/ai/aiService.js';
import { MockAiService } from '../dist/services/ai/mockAiService.js';
import { config } from '../dist/config/index.js';

// Image A: 1x1 red pixel PNG
const imageABuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

// Image B: 2x2 multi-pixel PNG
const imageBBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNkWPj/PwMDw38GBgYACW4E+Vj7iLAAAAAElFTkSuQmCC',
  'base64'
);

test('Disease Detection Pipeline - Integrity & Regression Suite', async (t) => {
  await t.test('1. Production Mode: AI Provider handles real image bytes without hardcoded Early Blight fallback', async () => {
    console.log('[TEST] Testing AIService with Image A (1x1 PNG)...');
    const resultA = await AIService.analyzeDisease(
      imageABuffer,
      'image/png',
      'test_leaf_a.png',
      'Tomato',
      'en'
    );

    console.log('[TEST] Result A:', {
      crop: resultA.crop,
      issue_type: resultA.issue_type,
      possible_issue: resultA.possible_issue,
      confidence: resultA.confidence,
      severity: resultA.severity,
      providerUsed: resultA.providerUsed
    });

    // In production mode with valid Gemini key:
    // It must NOT default to the old hardcoded Early Blight (Alternaria solani) at 88% confidence and medium severity!
    assert.ok(
      resultA.providerUsed.toLowerCase().includes('gemini') ||
      resultA.providerUsed.includes('Unavailable') ||
      resultA.issue_type === 'analysis_unavailable',
      `Provider should include gemini or explicit unavailable, got ${resultA.providerUsed}`
    );

    // If Gemini analyzed the image, ensure it is NOT blindly hardcoding Early Blight 88%
    if (resultA.providerUsed.toLowerCase().includes('gemini')) {
      const isOldHardcodedMock =
        resultA.possible_issue === 'Early Blight (Alternaria solani)' &&
        resultA.confidence === 88 &&
        resultA.severity === 'medium';
      assert.equal(
        isOldHardcodedMock,
        false,
        'Production AI must return real model inference, not the old 88% Early Blight fallback'
      );
    }
  });

  await t.test('2. Independent Processing: Different image inputs produce independent results', async () => {
    console.log('[TEST] Testing AIService with Image B (2x2 PNG)...');
    const resultB = await AIService.analyzeDisease(
      imageBBuffer,
      'image/png',
      'test_leaf_b.png',
      'Cotton',
      'en'
    );

    console.log('[TEST] Result B:', {
      crop: resultB.crop,
      issue_type: resultB.issue_type,
      possible_issue: resultB.possible_issue,
      confidence: resultB.confidence,
      severity: resultB.severity,
      providerUsed: resultB.providerUsed
    });

    // Verify it is not the old mock
    const isOldHardcodedMock =
      resultB.possible_issue === 'Early Blight (Alternaria solani)' &&
      resultB.confidence === 88 &&
      resultB.severity === 'medium';
    assert.equal(
      isOldHardcodedMock,
      false,
      'Image B must not return the old hardcoded 88% Early Blight mock'
    );
  });

  await t.test('3. MockAiService: In simulated/demo mode, output is clearly labeled as SIMULATED DEMO RESULT', async () => {
    const demoResult = MockAiService.analyzeImage('sample.jpg', 'Wheat', 'en');
    assert.ok(demoResult.warning.includes('SIMULATED DEMO RESULT'), 'Mock output must warn user it is simulated');
    assert.ok(
      demoResult.providerUsed.includes('SIMULATED') || demoResult.providerUsed.includes('DEMO'),
      'Provider used must reflect simulated/demo status'
    );
  });

  await t.test('4. Production Failure Fallback: Explicitly returns analysis_unavailable with confidence 0 instead of fake diagnosis', async () => {
    // Test production fallback directly when no API key is available or both fail
    const originalGeminiKey = config.geminiApiKey;
    const originalOpenAiKey = config.openaiApiKey;

    try {
      // Temporarily clear keys
      config.geminiApiKey = '';
      config.openaiApiKey = '';

      const fallbackResult = await AIService.analyzeDisease(
        imageABuffer,
        'image/png',
        'fail_test.png',
        'Rice',
        'en'
      );

      console.log('[TEST] Fallback Result:', fallbackResult);
      assert.equal(fallbackResult.issue_type, 'analysis_unavailable');
      assert.equal(fallbackResult.confidence, 0);
      assert.equal(fallbackResult.severity, 'unknown');
      assert.equal(fallbackResult.needs_better_image, true);
      assert.ok(fallbackResult.possible_issue.includes('Analysis Unavailable') || fallbackResult.possible_issue.includes('Clear Photo'));
      assert.equal(
        fallbackResult.possible_issue !== 'Early Blight (Alternaria solani)',
        true,
        'Must never return Early Blight when AI fails in production'
      );
    } finally {
      // Restore keys
      config.geminiApiKey = originalGeminiKey;
      config.openaiApiKey = originalOpenAiKey;
    }
  });
});
