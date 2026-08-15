/**
 * Weighted Scoring & Privacy Grading Utility
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

export class PrivacyScorer {
  static CATEGORY_WEIGHTS = {
    fingerprinting: 0.30,
    webrtc: 0.25,
    trackers: 0.25,
    signals: 0.10,
    hardware: 0.10
  };

  /**
   * Calculate overall score, grade, and categorical breakdowns
   * @param {Array<object>} probeResults 
   * @returns {object}
   */
  static evaluate(probeResults) {
    const categoryScores = {
      fingerprinting: { total: 0, count: 0 },
      webrtc: { total: 0, count: 0 },
      trackers: { total: 0, count: 0 },
      signals: { total: 0, count: 0 },
      hardware: { total: 0, count: 0 }
    };

    let passCount = 0;
    let cautionCount = 0;
    let failCount = 0;

    for (const item of probeResults) {
      let itemScore = 0;
      if (item.status === 'pass') {
        itemScore = 100;
        passCount++;
      } else if (item.status === 'caution') {
        itemScore = 50;
        cautionCount++;
      } else {
        itemScore = 0;
        failCount++;
      }

      const cat = item.category || 'hardware';
      if (categoryScores[cat]) {
        categoryScores[cat].total += itemScore;
        categoryScores[cat].count += 1;
      }
    }

    let weightedSum = 0;
    let totalWeightApplied = 0;

    for (const [cat, data] of Object.entries(categoryScores)) {
      if (data.count > 0) {
        const catAvg = data.total / data.count;
        const weight = this.CATEGORY_WEIGHTS[cat] || 0.1;
        weightedSum += catAvg * weight;
        totalWeightApplied += weight;
      }
    }

    const overallScore = totalWeightApplied > 0 
      ? Math.round(weightedSum / totalWeightApplied) 
      : 0;

    const gradeInfo = this.getGrade(overallScore);

    return {
      overallScore,
      grade: gradeInfo.grade,
      gradeSummary: gradeInfo.summary,
      gradeColor: gradeInfo.color,
      stats: {
        pass: passCount,
        caution: cautionCount,
        fail: failCount,
        total: probeResults.length
      },
      categoryAverages: {
        fingerprinting: categoryScores.fingerprinting.count > 0 ? Math.round(categoryScores.fingerprinting.total / categoryScores.fingerprinting.count) : 0,
        webrtc: categoryScores.webrtc.count > 0 ? Math.round(categoryScores.webrtc.total / categoryScores.webrtc.count) : 0,
        trackers: categoryScores.trackers.count > 0 ? Math.round(categoryScores.trackers.total / categoryScores.trackers.count) : 0,
        signals: categoryScores.signals.count > 0 ? Math.round(categoryScores.signals.total / categoryScores.signals.count) : 0,
        hardware: categoryScores.hardware.count > 0 ? Math.round(categoryScores.hardware.total / categoryScores.hardware.count) : 0
      }
    };
  }

  static getGrade(score) {
    if (score >= 93) {
      return {
        grade: 'A+',
        summary: 'Maximum Hardened Privacy',
        color: 'var(--ctp-green)'
      };
    } else if (score >= 82) {
      return {
        grade: 'A',
        summary: 'Strong Privacy & Anti-Tracking',
        color: 'var(--ctp-teal)'
      };
    } else if (score >= 70) {
      return {
        grade: 'B',
        summary: 'Moderate Protection (Some Vectors Exposed)',
        color: 'var(--ctp-sapphire)'
      };
    } else if (score >= 55) {
      return {
        grade: 'C',
        summary: 'Standard Default Browser (Multiple Leaks)',
        color: 'var(--ctp-yellow)'
      };
    } else if (score >= 40) {
      return {
        grade: 'D',
        summary: 'High Fingerprinting & Surveillance Risk',
        color: 'var(--ctp-peach)'
      };
    } else {
      return {
        grade: 'F',
        summary: 'Critical Exposure (Unprotected Browser)',
        color: 'var(--ctp-red)'
      };
    }
  }
}
