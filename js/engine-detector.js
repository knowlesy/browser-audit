/**
 * Engine & Client Profiler
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

export class EngineDetector {
  static detect() {
    const ua = navigator.userAgent || '';
    const vendor = navigator.vendor || '';
    const platform = navigator.platform || '';
    
    let engine = 'unknown';
    let browserName = 'Unknown Browser';
    let isBrave = false;
    let isFirefox = false;
    let isChromium = false;
    let isWebKit = false;
    let isTorOrHardened = false;

    // Check for Brave (via official navigator.brave API or userAgentData)
    // @ts-ignore
    if (typeof navigator.brave?.isBrave === 'function' || (navigator.userAgentData?.brands?.some(b => b.brand.toLowerCase().includes('brave')))) {
      isBrave = true;
      isChromium = true;
      engine = 'chromium';
      browserName = 'Brave Browser';
    } else if (/Firefox\/([0-9.]+)/i.test(ua) || /Gecko\/[0-9]+/i.test(ua)) {
      // Gecko / Firefox
      engine = 'gecko';
      isFirefox = true;
      browserName = 'Mozilla Firefox';

      if (/LibreWolf/i.test(ua)) {
        browserName = 'LibreWolf';
        isTorOrHardened = true;
      } else if (/Waterfox/i.test(ua)) {
        browserName = 'Waterfox';
      } else if (new Date().getTimezoneOffset() === 0 && (screen.width === window.innerWidth || screen.width === 1000 || screen.width === 1920)) {
        // Tor Browser / Hardened Firefox RFP heuristics
        isTorOrHardened = true;
        browserName = 'Firefox (Hardened / Tor)';
      }
    } else if (/Edg\/([0-9.]+)/i.test(ua)) {
      engine = 'chromium';
      isChromium = true;
      browserName = 'Microsoft Edge';
    } else if (/OPR\/([0-9.]+)/i.test(ua) || /Opera/i.test(ua)) {
      engine = 'chromium';
      isChromium = true;
      browserName = 'Opera';
    } else if (/Vivaldi\/([0-9.]+)/i.test(ua)) {
      engine = 'chromium';
      isChromium = true;
      browserName = 'Vivaldi';
    } else if (/Chrome\/([0-9.]+)/i.test(ua)) {
      engine = 'chromium';
      isChromium = true;
      browserName = 'Google Chrome (or Chromium variant)';
    } else if (/Safari\/([0-9.]+)/i.test(ua) && /Apple Computer/i.test(vendor)) {
      engine = 'webkit';
      isWebKit = true;
      browserName = 'Apple Safari';
    }

    // Operating System detection
    let os = 'Unknown OS';
    if (/Macintosh|Mac OS X/i.test(ua)) {
      os = 'macOS';
    } else if (/Windows NT/i.test(ua)) {
      os = 'Windows';
    } else if (/Android/i.test(ua)) {
      os = 'Android';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      os = 'iOS';
    } else if (/Linux/i.test(ua)) {
      os = 'Linux';
    }

    // Extract version if possible
    let version = 'Latest';
    const versionMatch = ua.match(/(?:Firefox|Chrome|Edg|OPR|Version)\/([0-9.]+)/i);
    if (versionMatch && versionMatch[1]) {
      version = versionMatch[1];
    }

    return {
      engine,
      browserName,
      version,
      os,
      platform,
      isBrave,
      isFirefox,
      isChromium,
      isWebKit,
      isTorOrHardened,
      rawUserAgent: ua,
      clientHintsSupported: Boolean(navigator.userAgentData)
    };
  }

  static async verifyBraveAsync() {
    try {
      // @ts-ignore
      if (navigator.brave && typeof navigator.brave.isBrave === 'function') {
        // @ts-ignore
        const result = await navigator.brave.isBrave();
        return Boolean(result);
      }
    } catch {
      // Ignore error if blocked
    }
    return false;
  }
}
