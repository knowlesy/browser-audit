/**
 * Audit Report Generator (Markdown & JSON)
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

export class ReportGenerator {
  /**
   * Generate full Markdown report
   * @param {object} engineInfo 
   * @param {Array<object>} probeResults 
   * @param {object} scoreResult 
   * @returns {string}
   */
  static generateMarkdown(engineInfo, probeResults, scoreResult) {
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toUTCString();

    let md = `# 🛡️ SpectreCheck Browser Privacy & Hardening Audit Report\n\n`;
    md += `*Generated:* ${formattedDate} (${timestamp})\n`;
    md += `*Auditor:* SpectreCheck 1.0.0 (Zero-Telemetry Client Audit)\n\n`;

    md += `## 📊 Executive Summary\n\n`;
    md += `* **Overall Privacy Score:** \`${scoreResult.overallScore} / 100\`\n`;
    md += `* **Privacy Grade:** **${scoreResult.grade}** (${scoreResult.gradeSummary})\n`;
    md += `* **Test Breakdown:** ${scoreResult.stats.pass} Protected | ${scoreResult.stats.caution} Caution | ${scoreResult.stats.fail} Leaking (Total: ${scoreResult.stats.total})\n\n`;

    md += `### 🖥️ Client Profile\n\n`;
    md += `* **Detected Browser:** ${engineInfo.browserName} (${engineInfo.version})\n`;
    md += `* **Rendering Engine:** ${engineInfo.engine.toUpperCase()}\n`;
    md += `* **Operating System:** ${engineInfo.os} (${engineInfo.platform})\n`;
    md += `* **Brave Shields Active:** ${engineInfo.isBrave ? 'Yes' : 'No'}\n`;
    md += `* **Hardened Profile Detected:** ${engineInfo.isTorOrHardened ? 'Yes' : 'No'}\n\n`;

    md += `## 🔬 Detailed Vector Breakdown\n\n`;

    const categories = [
      { id: 'fingerprinting', title: '1. Anti-Fingerprinting & Farbling' },
      { id: 'webrtc', title: '2. WebRTC IP Leaks & Candidate Gathering' },
      { id: 'trackers', title: '3. Telemetry & Tracker Blocking' },
      { id: 'signals', title: '4. Privacy Signals & Storage Isolation' },
      { id: 'hardware', title: '5. Hardware & Sensor Surface Probing' }
    ];

    for (const cat of categories) {
      const items = probeResults.filter(r => r.category === cat.id);
      if (items.length === 0) continue;

      md += `### ${cat.title}\n\n`;

      for (const item of items) {
        const icon = item.status === 'pass' ? '✅' : item.status === 'caution' ? '⚠️' : '❌';
        const statusLabel = item.status === 'pass' ? 'PASS / PROTECTED' : item.status === 'caution' ? 'CAUTION' : 'FAIL / LEAKING';

        md += `#### ${icon} ${item.title}\n\n`;
        md += `* **Status:** \`${statusLabel}\` — *${item.badge}*\n`;
        md += `* **Summary:** ${item.summary}\n`;

        if (item.details && Object.keys(item.details).length > 0) {
          md += `\n| Metric / Finding | Value |\n`;
          md += `| :--- | :--- |\n`;
          for (const [k, v] of Object.entries(item.details)) {
            md += `| ${k} | \`${v}\` |\n`;
          }
          md += `\n`;
        }

        if (item.remediation) {
          md += `> **Remediation (${item.remediation.engineName}):** ${item.remediation.title}\n`;
          if (item.remediation.configKey) {
            md += `> \`\`\`\n> ${item.remediation.configKey}\n> \`\`\`\n`;
          }
          if (item.remediation.steps && item.remediation.steps.length > 0) {
            item.remediation.steps.forEach(s => {
              md += `> * ${s}\n`;
            });
          }
          md += `\n`;
        }

        md += `---\n\n`;
      }
    }

    md += `\n*Audit completed with zero external network requests and zero tracking.* [SpectreCheck](https://github.com/knowlesy/browser-audit)\n`;

    return md;
  }

  /**
   * Generate structured JSON report
   * @param {object} engineInfo 
   * @param {Array<object>} probeResults 
   * @param {object} scoreResult 
   * @returns {string}
   */
  static generateJSON(engineInfo, probeResults, scoreResult) {
    const reportObj = {
      spectrecheck_version: '1.0.0',
      timestamp: new Date().toISOString(),
      score: scoreResult,
      client_profile: engineInfo,
      probes: probeResults
    };

    return JSON.stringify(reportObj, null, 2);
  }
}
