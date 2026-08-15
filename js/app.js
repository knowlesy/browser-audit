/**
 * SpectreCheck Main Application Controller
 * Universal Browser Privacy & Hardening Auditor
 */

import { EngineDetector } from './engine-detector.js';
import { FingerprintingProbes } from './probes/fingerprinting.js';
import { WebRTCProbes } from './probes/webrtc.js';
import { TrackerProbes } from './probes/trackers.js';
import { SignalProbes } from './probes/signals.js';
import { HardwareProbes } from './probes/hardware.js';
import { RemediationEngine } from './remediation/engine.js';
import { PrivacyScorer } from './utils/scoring.js';
import { ReportGenerator } from './utils/reporter.js';

class SpectreCheckApp {
  constructor() {
    this.engineInfo = null;
    this.probeResults = [];
    this.scoreResult = null;
    this.activeFilter = 'all';
    this.activeModalTab = 'markdown';
    this.isRunning = false;

    // Cache DOM Elements
    this.elements = {
      profileBrowserName: document.getElementById('profileBrowserName'),
      profileEngineBadge: document.getElementById('profileEngineBadge'),
      profileMeta: document.getElementById('profileMeta'),
      
      scoreGrade: document.getElementById('scoreGrade'),
      scorePercent: document.getElementById('scorePercent'),
      scoreCircleProgress: document.getElementById('scoreCircleProgress'),
      scoreSummaryTitle: document.getElementById('scoreSummaryTitle'),
      scoreSummaryDesc: document.getElementById('scoreSummaryDesc'),
      statPass: document.getElementById('statPass'),
      statCaution: document.getElementById('statCaution'),
      statFail: document.getElementById('statFail'),

      progressContainer: document.getElementById('progressContainer'),
      progressFill: document.getElementById('progressFill'),
      progressLabel: document.getElementById('progressLabel'),
      progressPercent: document.getElementById('progressPercent'),

      filterPills: document.querySelectorAll('.filter-pill'),
      filterCountAll: document.getElementById('filterCountAll'),
      filterCountFail: document.getElementById('filterCountFail'),
      filterCountCaution: document.getElementById('filterCountCaution'),
      filterCountPass: document.getElementById('filterCountPass'),

      probeList: document.getElementById('probeList'),
      emptyResults: document.getElementById('emptyResults'),

      btnRerun: document.getElementById('btnRerun'),
      btnExport: document.getElementById('btnExport'),

      modalOverlay: document.getElementById('modalOverlay'),
      modalClose: document.getElementById('modalClose'),
      tabMarkdown: document.getElementById('tabMarkdown'),
      tabJson: document.getElementById('tabJson'),
      reportTextarea: document.getElementById('reportTextarea'),
      btnCopyReport: document.getElementById('btnCopyReport'),
      btnDownloadReport: document.getElementById('btnDownloadReport'),

      toastContainer: document.getElementById('toastContainer')
    };

    this.init();
  }

  async init() {
    this.bindEvents();
    
    // Step 1: Detect engine and client environment
    this.engineInfo = EngineDetector.detect();
    const isBraveConfirmed = await EngineDetector.verifyBraveAsync();
    if (isBraveConfirmed) {
      this.engineInfo.isBrave = true;
      this.engineInfo.browserName = 'Brave Browser';
      this.engineInfo.engine = 'chromium';
    }

    this.renderProfileCard();

    // Step 2: Auto-run initial audit
    this.runAudit();
  }

  bindEvents() {
    // Re-run Audit
    this.elements.btnRerun?.addEventListener('click', () => {
      if (!this.isRunning) {
        this.runAudit();
      }
    });

    // Export Modal
    this.elements.btnExport?.addEventListener('click', () => this.openExportModal());
    this.elements.modalClose?.addEventListener('click', () => this.closeExportModal());
    this.elements.modalOverlay?.addEventListener('click', (e) => {
      if (e.target === this.elements.modalOverlay) this.closeExportModal();
    });

    // Modal Tabs
    this.elements.tabMarkdown?.addEventListener('click', () => this.setModalTab('markdown'));
    this.elements.tabJson?.addEventListener('click', () => this.setModalTab('json'));

    // Copy & Download Report
    this.elements.btnCopyReport?.addEventListener('click', () => this.copyReportToClipboard());
    this.elements.btnDownloadReport?.addEventListener('click', () => this.downloadReportFile());

    // Filter Pills
    this.elements.filterPills?.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.getAttribute('data-filter') || 'all';
        this.setFilter(filter);
      });
    });

    // Global Keybinds (Escape closes modal)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.elements.modalOverlay?.classList.contains('active')) {
        this.closeExportModal();
      }
    });
  }

  renderProfileCard() {
    if (!this.elements.profileBrowserName) return;

    this.elements.profileBrowserName.textContent = this.engineInfo.browserName;
    
    let engineLabel = `${this.engineInfo.engine.toUpperCase()} ENGINE`;
    if (this.engineInfo.isBrave) engineLabel = 'BRAVE SHIELDS';
    if (this.engineInfo.isTorOrHardened) engineLabel = 'GECKO (HARDENED)';
    this.elements.profileEngineBadge.textContent = engineLabel;

    const metaParts = [];
    if (this.engineInfo.version) metaParts.push(`v${this.engineInfo.version}`);
    if (this.engineInfo.os) metaParts.push(this.engineInfo.os);
    metaParts.push(this.engineInfo.platform || 'Desktop');

    this.elements.profileMeta.textContent = `${metaParts.join(' • ')} — ${this.engineInfo.rawUserAgent.substring(0, 50)}...`;
  }

  async runAudit() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.probeResults = [];
    
    // UI Reset
    if (this.elements.btnRerun) this.elements.btnRerun.disabled = true;
    if (this.elements.progressContainer) this.elements.progressContainer.style.display = 'flex';
    if (this.elements.probeList) this.elements.probeList.innerHTML = '';
    this.updateProgress(0, 'Initializing audit probes...');

    try {
      // 1. Anti-Fingerprinting Probes
      this.updateProgress(10, 'Testing Canvas Farbling & Anti-Fingerprinting...');
      const fpResults = await FingerprintingProbes.runAll(this.engineInfo);
      this.processBatch(fpResults);

      // 2. WebRTC Probes
      this.updateProgress(35, 'Testing WebRTC STUN Candidates & IP Leaks...');
      const webrtcResults = await WebRTCProbes.runAll(this.engineInfo);
      this.processBatch(webrtcResults);

      // 3. Trackers & Telemetry Probes
      this.updateProgress(55, 'Testing Tracker & Telemetry Matrix...');
      const trackerResults = await TrackerProbes.runAll(this.engineInfo);
      this.processBatch(trackerResults);

      // 4. Privacy Signals & Storage Isolation
      this.updateProgress(75, 'Querying Privacy Signals & Partitioning...');
      const signalResults = await SignalProbes.runAll(this.engineInfo);
      this.processBatch(signalResults);

      // 5. Hardware & Sensor Surface Probing
      this.updateProgress(90, 'Probing EME, MediaDevices & Sensor APIs...');
      const hwResults = await HardwareProbes.runAll(this.engineInfo);
      this.processBatch(hwResults);

      // Complete
      this.updateProgress(100, 'Audit Complete');
      
      // Calculate Final Scores
      this.scoreResult = PrivacyScorer.evaluate(this.probeResults);
      this.renderScoreHero();
      this.updateFilterCounts();
      this.applyFilter();

      this.showToast('Audit completed successfully', 'success');
    } catch (err) {
      console.error('Audit execution error:', err);
      this.showToast('Audit finished with warnings', 'info');
    } finally {
      this.isRunning = false;
      if (this.elements.btnRerun) this.elements.btnRerun.disabled = false;
      setTimeout(() => {
        if (this.elements.progressContainer) {
          this.elements.progressContainer.style.display = 'none';
        }
      }, 800);
    }
  }

  processBatch(batch) {
    for (const item of batch) {
      // Attach tailored remediation
      item.remediation = RemediationEngine.getRemediation(item, this.engineInfo);
      this.probeResults.push(item);
      this.renderProbeCard(item);
    }
  }

  updateProgress(percent, label) {
    if (this.elements.progressFill) {
      this.elements.progressFill.style.width = `${percent}%`;
    }
    if (this.elements.progressLabel) {
      this.elements.progressLabel.textContent = label;
    }
    if (this.elements.progressPercent) {
      this.elements.progressPercent.textContent = `${percent}%`;
    }
  }

  renderScoreHero() {
    if (!this.scoreResult) return;

    const { overallScore, grade, gradeSummary, gradeColor, stats } = this.scoreResult;

    // Update Grade and Percentage
    if (this.elements.scoreGrade) {
      this.elements.scoreGrade.textContent = grade;
      this.elements.scoreGrade.style.color = gradeColor;
    }
    if (this.elements.scorePercent) {
      this.elements.scorePercent.textContent = `${overallScore}% Score`;
    }

    // Animated SVG Dial (Circumference ~ 377)
    if (this.elements.scoreCircleProgress) {
      const radius = 60;
      const circumference = 2 * Math.PI * radius; // 376.99
      const offset = circumference - (overallScore / 100) * circumference;
      this.elements.scoreCircleProgress.style.strokeDashoffset = offset;
      this.elements.scoreCircleProgress.style.stroke = gradeColor;
    }

    // Summary Text
    if (this.elements.scoreSummaryTitle) {
      this.elements.scoreSummaryTitle.textContent = `${grade} Grade — ${gradeSummary}`;
    }
    if (this.elements.scoreSummaryDesc) {
      this.elements.scoreSummaryDesc.textContent = `Evaluated ${stats.total} privacy vectors across Anti-Fingerprinting, WebRTC, Trackers, Privacy Signals, and Hardware Surface APIs.`;
    }

    // Stat Boxes
    if (this.elements.statPass) this.elements.statPass.textContent = stats.pass;
    if (this.elements.statCaution) this.elements.statCaution.textContent = stats.caution;
    if (this.elements.statFail) this.elements.statFail.textContent = stats.fail;
  }

  renderProbeCard(item) {
    if (!this.elements.probeList) return;

    const card = document.createElement('div');
    card.className = `probe-card status-${item.status}`;
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-status', item.status);

    const categoryIcon = this.getCategoryIcon(item.category);

    // Build Details Rows
    let detailsHtml = '';
    if (item.details && Object.keys(item.details).length > 0) {
      detailsHtml += `<table class="finding-meta-table"><tbody>`;
      for (const [k, v] of Object.entries(item.details)) {
        detailsHtml += `<tr><td>${this.escapeHtml(k)}</td><td>${this.escapeHtml(v)}</td></tr>`;
      }
      detailsHtml += `</tbody></table>`;
    }

    // Build Remediation HTML
    let remediationHtml = '';
    if (item.remediation) {
      const rem = item.remediation;
      let stepsHtml = '';
      if (rem.steps && rem.steps.length > 0) {
        stepsHtml = `
          <div class="remediation-steps">
            ${rem.steps.map(s => `
              <div class="remediation-step">
                <span class="step-bullet">▸</span>
                <span>${this.escapeHtml(s)}</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      let configSnippetHtml = '';
      if (rem.configKey) {
        configSnippetHtml = `
          <div class="config-snippet-box">
            <span class="config-key">${this.escapeHtml(rem.configKey)}</span>
            <button type="button" class="btn-copy js-copy-btn" data-copy="${this.escapeHtml(rem.configKey)}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              Copy
            </button>
          </div>
        `;
      }

      remediationHtml = `
        <div class="remediation-box">
          <div class="remediation-header">
            <span class="remediation-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              Remediation: ${this.escapeHtml(rem.title)}
            </span>
            <span class="remediation-badge">${this.escapeHtml(rem.engineName)}</span>
          </div>
          <p class="remediation-desc">${this.escapeHtml(rem.description)}</p>
          ${configSnippetHtml}
          ${stepsHtml}
        </div>
      `;
    }

    card.innerHTML = `
      <div class="probe-card-header">
        <div class="probe-icon-wrap">
          ${categoryIcon}
        </div>
        <div class="probe-title-wrap">
          <div class="probe-title">${this.escapeHtml(item.title)}</div>
          <div class="probe-subtitle">${this.escapeHtml(item.summary)}</div>
        </div>
        <span class="status-badge ${item.status}">${this.escapeHtml(item.badge)}</span>
        <svg class="drawer-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      <div class="probe-drawer">
        <div class="finding-box">
          <span class="finding-title">Diagnostic Findings</span>
          <p class="finding-content">${this.escapeHtml(item.summary)}</p>
          ${detailsHtml}
        </div>
        ${remediationHtml}
      </div>
    `;

    // Event listener for drawer toggle
    const header = card.querySelector('.probe-card-header');
    header?.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });

    // Event listener for copy button
    const copyBtns = card.querySelectorAll('.js-copy-btn');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const textToCopy = btn.getAttribute('data-copy') || '';
        this.copyText(textToCopy, btn);
      });
    });

    this.elements.probeList.appendChild(card);
  }

  setFilter(filter) {
    this.activeFilter = filter;

    this.elements.filterPills?.forEach(pill => {
      const pFilter = pill.getAttribute('data-filter') || 'all';
      if (pFilter === filter) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    this.applyFilter();
  }

  applyFilter() {
    if (!this.elements.probeList) return;

    const cards = this.elements.probeList.querySelectorAll('.probe-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const status = card.getAttribute('data-status');
      const category = card.getAttribute('data-category');

      let matches = false;
      if (this.activeFilter === 'all') {
        matches = true;
      } else if (this.activeFilter === 'fail' && status === 'fail') {
        matches = true;
      } else if (this.activeFilter === 'caution' && status === 'caution') {
        matches = true;
      } else if (this.activeFilter === 'pass' && status === 'pass') {
        matches = true;
      } else if (this.activeFilter === category) {
        matches = true;
      }

      if (matches) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (this.elements.emptyResults) {
      if (visibleCount === 0) {
        this.elements.emptyResults.classList.add('active');
      } else {
        this.elements.emptyResults.classList.remove('active');
      }
    }
  }

  updateFilterCounts() {
    if (!this.scoreResult) return;
    const { stats } = this.scoreResult;
    if (this.elements.filterCountAll) this.elements.filterCountAll.textContent = stats.total;
    if (this.elements.filterCountFail) this.elements.filterCountFail.textContent = stats.fail;
    if (this.elements.filterCountCaution) this.elements.filterCountCaution.textContent = stats.caution;
    if (this.elements.filterCountPass) this.elements.filterCountPass.textContent = stats.pass;
  }

  openExportModal() {
    if (!this.scoreResult) {
      this.scoreResult = PrivacyScorer.evaluate(this.probeResults);
    }
    this.updateReportText();
    this.elements.modalOverlay?.classList.add('active');
  }

  closeExportModal() {
    this.elements.modalOverlay?.classList.remove('active');
  }

  setModalTab(tab) {
    this.activeModalTab = tab;
    if (tab === 'markdown') {
      this.elements.tabMarkdown?.classList.add('active');
      this.elements.tabJson?.classList.remove('active');
    } else {
      this.elements.tabMarkdown?.classList.remove('active');
      this.elements.tabJson?.classList.add('active');
    }
    this.updateReportText();
  }

  updateReportText() {
    if (!this.elements.reportTextarea) return;

    if (this.activeModalTab === 'markdown') {
      this.elements.reportTextarea.value = ReportGenerator.generateMarkdown(
        this.engineInfo,
        this.probeResults,
        this.scoreResult
      );
    } else {
      this.elements.reportTextarea.value = ReportGenerator.generateJSON(
        this.engineInfo,
        this.probeResults,
        this.scoreResult
      );
    }
  }

  async copyReportToClipboard() {
    if (!this.elements.reportTextarea) return;
    try {
      await navigator.clipboard.writeText(this.elements.reportTextarea.value);
      this.showToast('Audit report copied to clipboard!', 'success');
    } catch {
      this.elements.reportTextarea.select();
      document.execCommand('copy');
      this.showToast('Report copied via fallback', 'success');
    }
  }

  downloadReportFile() {
    if (!this.elements.reportTextarea) return;
    const content = this.elements.reportTextarea.value;
    const isMd = this.activeModalTab === 'markdown';
    const ext = isMd ? 'md' : 'json';
    const mime = isMd ? 'text/markdown' : 'application/json';
    const filename = `spectrecheck-audit-${new Date().toISOString().slice(0, 10)}.${ext}`;

    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast(`Saved report as ${filename}`, 'success');
  }

  async copyText(text, btnElement) {
    try {
      await navigator.clipboard.writeText(text);
      if (btnElement) {
        btnElement.classList.add('copied');
        btnElement.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Copied!
        `;
        setTimeout(() => {
          btnElement.classList.remove('copied');
          btnElement.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            Copy
          `;
        }, 1800);
      }
      this.showToast('Copied preference string', 'success');
    } catch {
      this.showToast('Failed to copy to clipboard', 'info');
    }
  }

  showToast(message, type = 'info') {
    if (!this.elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconSvg = type === 'success'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ctp-green)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ctp-blue)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    toast.innerHTML = `${iconSvg}<span>${this.escapeHtml(message)}</span>`;
    this.elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  getCategoryIcon(category) {
    switch (category) {
      case 'fingerprinting':
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>`;
      case 'webrtc':
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
      case 'trackers':
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
      case 'signals':
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      case 'hardware':
      default:
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;
    }
  }

  escapeHtml(str) {
    if (typeof str !== 'string') return String(str ?? '');
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new SpectreCheckApp();
});
