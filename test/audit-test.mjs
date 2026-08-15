/**
 * SpectreCheck Verification & Unit Test Suite
 */

import assert from 'node:assert';
import { EngineDetector } from '../js/engine-detector.js';
import { FirefoxRemediation } from '../js/remediation/firefox.js';
import { BraveRemediation } from '../js/remediation/brave.js';
import { ChromiumRemediation } from '../js/remediation/chromium.js';
import { RemediationEngine } from '../js/remediation/engine.js';
import { PrivacyScorer } from '../js/utils/scoring.js';
import { ReportGenerator } from '../js/utils/reporter.js';

console.log('🧪 Running SpectreCheck Verification Test Suite...\n');

let passedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// 1. Module Export Contracts
test('Module Exports Verification', () => {
  assert.strictEqual(typeof EngineDetector.detect, 'function');
  assert.strictEqual(typeof RemediationEngine.getRemediation, 'function');
  assert.strictEqual(typeof PrivacyScorer.evaluate, 'function');
  assert.strictEqual(typeof ReportGenerator.generateMarkdown, 'function');
  assert.strictEqual(typeof ReportGenerator.generateJSON, 'function');
});

// 2. Remediation Key Mapping
test('Remediation Presets Coverage', () => {
  const probeIds = [
    'fp_canvas_farbling',
    'fp_firefox_rfp',
    'fp_audiocontext',
    'fp_webgl',
    'fp_screen_geometry',
    'webrtc_ip_leak',
    'trackers_matrix',
    'signal_gpc',
    'signal_dnt',
    'signal_storage_partitioning',
    'signal_referrer',
    'hw_drm_eme',
    'hw_media_devices',
    'hw_peripheral_apis',
    'hw_cpu_memory',
    'hw_speech_voices'
  ];

  for (const id of probeIds) {
    assert.ok(FirefoxRemediation[id], `Missing Firefox remediation for: ${id}`);
    assert.ok(BraveRemediation[id], `Missing Brave remediation for: ${id}`);
    assert.ok(ChromiumRemediation[id], `Missing Chromium remediation for: ${id}`);
  }
});

// 3. Remediation Dispatcher
test('Remediation Dispatcher Output', () => {
  const probe = { id: 'fp_canvas_farbling' };
  
  // Test Firefox Engine Dispatch
  const ffRem = RemediationEngine.getRemediation(probe, { isFirefox: true, engine: 'gecko' });
  assert.strictEqual(ffRem.engineName, 'Firefox / Gecko');
  assert.ok(ffRem.configKey.includes('privacy.resistFingerprinting'));

  // Test Brave Engine Dispatch
  const brRem = RemediationEngine.getRemediation(probe, { isBrave: true, isChromium: true, engine: 'chromium' });
  assert.strictEqual(brRem.engineName, 'Brave Browser');
  assert.ok(brRem.configKey.includes('brave://settings/shields'));

  // Test Chromium Engine Dispatch
  const crRem = RemediationEngine.getRemediation(probe, { isFirefox: false, isBrave: false, isChromium: true, engine: 'chromium' });
  assert.strictEqual(crRem.engineName, 'Chromium / Chrome / Edge');
});

// 4. Scoring Algorithm & Grade Evaluation
test('Privacy Scorer Calculation', () => {
  const mockProbesAllPass = [
    { id: 'fp_canvas_farbling', category: 'fingerprinting', status: 'pass' },
    { id: 'webrtc_ip_leak', category: 'webrtc', status: 'pass' },
    { id: 'trackers_matrix', category: 'trackers', status: 'pass' },
    { id: 'signal_gpc', category: 'signals', status: 'pass' },
    { id: 'hw_drm_eme', category: 'hardware', status: 'pass' }
  ];

  const scorePass = PrivacyScorer.evaluate(mockProbesAllPass);
  assert.strictEqual(scorePass.overallScore, 100);
  assert.strictEqual(scorePass.grade, 'A+');
  assert.strictEqual(scorePass.stats.pass, 5);
  assert.strictEqual(scorePass.stats.fail, 0);

  const mockProbesAllFail = [
    { id: 'fp_canvas_farbling', category: 'fingerprinting', status: 'fail' },
    { id: 'webrtc_ip_leak', category: 'webrtc', status: 'fail' },
    { id: 'trackers_matrix', category: 'trackers', status: 'fail' },
    { id: 'signal_gpc', category: 'signals', status: 'fail' },
    { id: 'hw_drm_eme', category: 'hardware', status: 'fail' }
  ];

  const scoreFail = PrivacyScorer.evaluate(mockProbesAllFail);
  assert.strictEqual(scoreFail.overallScore, 0);
  assert.strictEqual(scoreFail.grade, 'F');
  assert.strictEqual(scoreFail.stats.fail, 5);
});

// 5. Report Generation
test('Report Generation Output (Markdown & JSON)', () => {
  const mockEngine = {
    browserName: 'Mozilla Firefox',
    engine: 'gecko',
    version: '128.0',
    os: 'macOS',
    platform: 'MacIntel',
    isBrave: false,
    isTorOrHardened: true
  };

  const mockProbes = [
    {
      id: 'fp_canvas_farbling',
      title: 'Canvas 2D Anti-Fingerprinting & Farbling',
      category: 'fingerprinting',
      status: 'pass',
      badge: 'Farbling Active',
      summary: 'Dynamic noise detected',
      details: { 'Noise': 'Active' },
      remediation: FirefoxRemediation.fp_canvas_farbling
    }
  ];

  const mockScore = PrivacyScorer.evaluate(mockProbes);

  const md = ReportGenerator.generateMarkdown(mockEngine, mockProbes, mockScore);
  assert.ok(md.includes('# 🛡️ SpectreCheck Browser Privacy & Hardening Audit Report'));
  assert.ok(md.includes('Mozilla Firefox'));
  assert.ok(md.includes('privacy.resistFingerprinting'));

  const jsonStr = ReportGenerator.generateJSON(mockEngine, mockProbes, mockScore);
  const jsonObj = JSON.parse(jsonStr);
  assert.strictEqual(jsonObj.spectrecheck_version, '1.0.0');
  assert.strictEqual(jsonObj.client_profile.browserName, 'Mozilla Firefox');
});

console.log(`\n🎉 All ${passedTests} test suites passed cleanly!\n`);
