/**
 * Remediation Engine Dispatcher
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

import { FirefoxRemediation } from './firefox.js?v=1.0.2';
import { BraveRemediation } from './brave.js?v=1.0.2';
import { ChromiumRemediation } from './chromium.js?v=1.0.2';

export class RemediationEngine {
  /**
   * Resolve remediation for a specific probe result and detected browser engine
   * @param {object} probeResult 
   * @param {object} engineInfo 
   * @returns {object|null}
   */
  static getRemediation(probeResult, engineInfo) {
    const probeId = probeResult.id;

    // Check if Firefox/Gecko
    if (engineInfo.isFirefox || engineInfo.engine === 'gecko') {
      if (FirefoxRemediation[probeId]) {
        return FirefoxRemediation[probeId];
      }
    }

    // Check if Brave
    if (engineInfo.isBrave) {
      if (BraveRemediation[probeId]) {
        return BraveRemediation[probeId];
      }
    }

    // Check if Chromium / Chrome / Edge / Opera / Generic
    if (ChromiumRemediation[probeId]) {
      return ChromiumRemediation[probeId];
    }

    // Fallback to Firefox remediation if available
    return FirefoxRemediation[probeId] || null;
  }
}
