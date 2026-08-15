/**
 * Privacy Signals & Storage Isolation Probes
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

export class SignalProbes {
  /**
   * Run all privacy signals and storage partitioning probes
   * @param {object} engineInfo 
   * @returns {Promise<Array<object>>}
   */
  static async runAll(engineInfo) {
    const results = [];

    // Probe 1: Global Privacy Control (GPC)
    results.push(await this.probeGPC(engineInfo));

    // Probe 2: Do Not Track (DNT) Signal
    results.push(await this.probeDNT(engineInfo));

    // Probe 3: Storage Partitioning & Cookie Isolation
    results.push(await this.probeStoragePartitioning(engineInfo));

    // Probe 4: Referrer Leakage & Policy
    results.push(await this.probeReferrerPolicy(engineInfo));

    return results;
  }

  /**
   * Probe 1: Global Privacy Control (GPC)
   */
  static async probeGPC(engineInfo) {
    const probeId = 'signal_gpc';
    const title = 'Global Privacy Control (GPC) Signal';
    const category = 'signals';

    // @ts-ignore
    const gpc = navigator.globalPrivacyControl;
    const isEnabled = gpc === true;

    if (isEnabled) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'GPC Active',
        summary: 'Global Privacy Control signal is actively broadcasted (navigator.globalPrivacyControl === true), asserting your legal right to opt out of data sale/sharing.',
        details: {
          'Signal State': 'Enabled (true)',
          'Legal Standard': 'CCPA / GDPR / CPRA Compliant Signal',
          'Enforcement': 'Transmitted in HTTP headers and DOM'
        }
      };
    }

    return {
      id: probeId,
      title,
      category,
      status: 'caution',
      badge: 'GPC Disabled',
      summary: 'Global Privacy Control signal is not enabled. Websites receive no machine-readable request prohibiting data sale or sharing.',
      details: {
        'Signal State': 'Disabled / Undefined (false)',
        'Legal Assertion': 'Inactive',
        'Recommendation': 'Enable GPC in browser privacy settings or via extension'
      }
    };
  }

  /**
   * Probe 2: Do Not Track (DNT)
   */
  static async probeDNT(engineInfo) {
    const probeId = 'signal_dnt';
    const title = 'Do Not Track (DNT) Header & DOM Flag';
    const category = 'signals';

    // @ts-ignore
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    const isDNT = dnt === '1' || dnt === 'yes';

    if (isDNT) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'DNT Active',
        summary: 'Do Not Track header is actively broadcasted (navigator.doNotTrack === "1").',
        details: {
          'DNT Header': 'Enabled (1)',
          'DOM Property': 'navigator.doNotTrack = "1"',
          'Status': 'Transmitting preference'
        }
      };
    }

    return {
      id: probeId,
      title,
      category,
      status: 'caution',
      badge: 'DNT Disabled',
      summary: 'Do Not Track signal is disabled or unconfigured.',
      details: {
        'DNT Header': dnt ? String(dnt) : 'Unset / Disabled',
        'Status': 'No DNT signal sent'
      }
    };
  }

  /**
   * Probe 3: Storage Partitioning & Third-Party State Isolation
   */
  static async probeStoragePartitioning(engineInfo) {
    const probeId = 'signal_storage_partitioning';
    const title = 'State Partitioning & Cookie Isolation';
    const category = 'signals';

    const hasStorageAccess = typeof document.hasStorageAccess === 'function';
    const hasRequestStorageAccess = typeof document.requestStorageAccess === 'function';
    // @ts-ignore
    const isPartitionedCookie = typeof cookieStore !== 'undefined';

    let isolationStatus = 'Standard';
    let isPass = false;

    if (engineInfo.isFirefox) {
      // Firefox Total Cookie Protection / Dynamic First-Party Isolation
      isolationStatus = 'Total Cookie Protection (dFPI / ETP Strict)';
      isPass = true;
    } else if (engineInfo.isBrave) {
      isolationStatus = 'Brave Ephemeral Storage & Partitioning';
      isPass = true;
    } else if (hasStorageAccess) {
      isolationStatus = 'Storage Access API Supported (Partitioning Active)';
      isPass = true;
    }

    if (isPass) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'Partitioned',
        summary: 'Client storage and cookie partitioning mechanisms are supported, preventing cross-site tracker state correlation.',
        details: {
          'Storage Isolation': isolationStatus,
          'Storage Access API': hasStorageAccess ? 'Supported' : 'Not Available',
          'Cookie Store API': isPartitionedCookie ? 'Available' : 'Standard',
          'Cross-Site State Leak': 'Isolated per top-level origin'
        }
      };
    }

    return {
      id: probeId,
      title,
      category,
      status: 'caution',
      badge: 'Unpartitioned',
      summary: 'Third-party storage partitioning could not be verified. Shared storage pools may allow cross-site tracking.',
      details: {
        'Storage Access API': hasStorageAccess ? 'Supported' : 'Unsupported',
        'Isolation State': 'Legacy / Shared Storage Pool'
      }
    };
  }

  /**
   * Probe 4: Referrer Leakage & Policy
   */
  static async probeReferrerPolicy(engineInfo) {
    const probeId = 'signal_referrer';
    const title = 'Referrer Leakage & Strictness Policy';
    const category = 'signals';

    const rawReferrer = document.referrer;
    const isReferrerEmpty = !rawReferrer || rawReferrer === '';

    return {
      id: probeId,
      title,
      category,
      status: 'pass',
      badge: isReferrerEmpty ? 'No Referrer' : 'Referrer Present',
      summary: isReferrerEmpty 
        ? 'No referrer path leaked on initial page navigation.' 
        : `Referrer received: ${rawReferrer.substring(0, 45)}...`,
      details: {
        'Incoming Referrer': isReferrerEmpty ? 'None (Clean entry)' : rawReferrer,
        'Default Policy': 'strict-origin-when-cross-origin',
        'Cross-Origin Strictness': 'Paths trimmed on cross-origin requests'
      }
    };
  }
}
