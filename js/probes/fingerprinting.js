/**
 * Anti-Fingerprinting Probes & Heuristics
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

export class FingerprintingProbes {
  /**
   * Run all anti-fingerprinting probes
   * @param {object} engineInfo 
   * @returns {Promise<Array<object>>}
   */
  static async runAll(engineInfo) {
    const results = [];

    // Probe 1: Canvas Farbling & Multi-Pass Determinism
    results.push(await this.probeCanvasFarbling(engineInfo));

    // Probe 2: Firefox Resist Fingerprinting (RFP) Heuristics
    results.push(await this.probeFirefoxRFP(engineInfo));

    // Probe 3: AudioContext Fingerprint & Spoofing
    results.push(await this.probeAudioContext(engineInfo));

    // Probe 4: WebGL Hardware & Shader Signature
    results.push(await this.probeWebGL(engineInfo));

    // Probe 5: Screen Geometry & Colour Depth
    results.push(await this.probeScreenGeometry(engineInfo));

    return results;
  }

  /**
   * Probe 1: Canvas Farbling / Multi-Pass Randomisation
   */
  static async probeCanvasFarbling(engineInfo) {
    const probeId = 'fp_canvas_farbling';
    const title = 'Canvas 2D Anti-Fingerprinting & Farbling';
    const category = 'fingerprinting';

    try {
      const renderPass = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 240;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Draw complex text, gradients, shadows, and composite paths
        ctx.textBaseline = 'top';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);

        ctx.fillStyle = '#069';
        ctx.fillText('SpectreCheck Audit <canvas> 🛡️ 1.0', 4, 17);

        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('SpectreCheck Audit <canvas> 🛡️ 1.0', 2, 19);

        // Gradient & shapes
        const grad = ctx.createLinearGradient(0, 0, 100, 0);
        grad.addColorStop(0, '#cba6f7');
        grad.addColorStop(1, '#89b4fa');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(200, 30, 18, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL('image/png');
      };

      const pass1 = renderPass();
      const pass2 = renderPass();

      if (!pass1 || !pass2) {
        return {
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'Canvas Disabled',
          summary: 'Canvas 2D context extraction is blocked or disabled.',
          details: {
            'Canvas 2D Access': 'Blocked / Unavailable',
            'Protection Status': 'Maximum Protection (Extraction Suppressed)'
          }
        };
      }

      const isFarbled = pass1 !== pass2;
      const pass1Sample = pass1.substring(pass1.length - 28);
      const pass2Sample = pass2.substring(pass2.length - 28);

      if (isFarbled) {
        return {
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'Farbling Active',
          summary: 'Dynamic Canvas Farbling / noise randomisation detected across extraction passes. Your hardware signature is disguised.',
          details: {
            'Farbling Noise': 'Active (Non-deterministic output)',
            'Pass 1 Checksum': `...${pass1Sample}`,
            'Pass 2 Checksum': `...${pass2Sample}`,
            'Engine Defence': engineInfo.isBrave ? 'Brave Shields Canvas Farbling' : 'Canvas Noise / Spoofing Active'
          }
        };
      }

      // If deterministic, check if canvas data is blank / spoofed or raw
      const isBlank = pass1.length < 500;
      if (isBlank) {
        return {
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'Blank / Spoofed',
          summary: 'Canvas extraction returned an empty or blanked canvas image.',
          details: {
            'Canvas Output': 'Blanked / Empty',
            'Protection Status': 'Extraction Suppressed'
          }
        };
      }

      // Deterministic canvas with full data -> Leaking raw hardware signature
      return {
        id: probeId,
        title,
        category,
        status: engineInfo.isFirefox ? 'caution' : 'fail',
        badge: 'Deterministic (Raw)',
        summary: 'Canvas rendering is completely deterministic across extraction passes. Trackers can build a persistent canvas fingerprint.',
        details: {
          'Farbling Noise': 'Disabled (Identical byte stream returned)',
          'Signature Consistency': 'Deterministic (100% match)',
          'Fingerprinting Risk': 'High (Device GPU rasterisation exposed)'
        }
      };
    } catch (e) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'Protected',
        summary: 'Canvas operations threw an exception, preventing fingerprint extraction.',
        details: {
          'Exception': e.message || 'Canvas access denied'
        }
      };
    }
  }

  /**
   * Probe 2: Firefox Resist Fingerprinting (RFP) & Timezone Heuristics
   */
  static async probeFirefoxRFP(engineInfo) {
    const probeId = 'fp_firefox_rfp';
    const title = 'Firefox RFP & Timezone Normalisation';
    const category = 'fingerprinting';

    const tzOffset = new Date().getTimezoneOffset();
    const intlTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isUtcLocked = tzOffset === 0 && (intlTz === 'UTC' || intlTz === 'Etc/UTC');

    // Timer precision check (clamped to 100ms or 20ms under RFP/Tor vs microsecond under standard Chromium)
    const t1 = performance.now();
    for (let i = 0; i < 50000; i++) { Math.sqrt(i); }
    const t2 = performance.now();
    const timerDelta = t2 - t1;
    const isTimerClamped = timerDelta % 20 === 0 || timerDelta % 100 === 0 || (timerDelta === 0 && Math.round(timerDelta) === timerDelta);

    // Viewport rounding check (RFP rounds dimensions or letterboxes)
    const innerW = window.innerWidth;
    const innerH = window.innerHeight;
    const isLetterboxed = (innerW % 200 === 0 && innerH % 100 === 0) || (screen.width === innerW && screen.height === innerH);

    let rfpScore = 0;
    if (isUtcLocked) rfpScore += 2;
    if (isTimerClamped) rfpScore += 1;
    if (isLetterboxed) rfpScore += 1;

    const isRFPActive = rfpScore >= 2;

    if (isRFPActive) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'RFP Active',
        summary: 'Resist Fingerprinting protections detected: UTC timezone offset lock, timer quantization, and normalised metric geometry.',
        details: {
          'Timezone Offset': `${tzOffset} min (${intlTz})`,
          'UTC Lock': 'Enforced (Offset 0)',
          'Timer Precision': isTimerClamped ? 'Quantised / Clamped' : 'Standard',
          'Geometry Normalisation': isLetterboxed ? 'Letterboxed / Normalised' : 'Unrounded',
          'Status': 'Enhanced Anti-Fingerprinting Active'
        }
      };
    }

    if (engineInfo.isFirefox) {
      return {
        id: probeId,
        title,
        category,
        status: 'caution',
        badge: 'RFP Inactive',
        summary: 'Firefox Resist Fingerprinting (privacy.resistFingerprinting) is currently disabled. Your local timezone and fine-grained clock are exposed.',
        details: {
          'Timezone Offset': `${tzOffset} min (${intlTz})`,
          'UTC Lock': 'Disabled (Local Timezone Exposed)',
          'Timer Precision': `${timerDelta.toFixed(3)} ms (High Precision)`,
          'Viewport Geometry': `${innerW} × ${innerH} px (Raw Window Dimensions)`
        }
      };
    }

    // For Chromium / WebKit
    return {
      id: probeId,
      title,
      category,
      status: isUtcLocked ? 'pass' : 'caution',
      badge: isUtcLocked ? 'UTC Timezone' : 'Local Timezone Exposed',
      summary: isUtcLocked 
        ? 'Browser is normalised to UTC timezone, reducing geographic fingerprinting.'
        : 'Local system timezone and high-resolution performance timers are directly readable by scripts.',
      details: {
        'Timezone Offset': `${tzOffset} min (${intlTz})`,
        'Timer Precision': `${timerDelta.toFixed(4)} ms (High Resolution Clock)`,
        'Screen Dimensions': `${screen.width} × ${screen.height} px`
      }
    };
  }

  /**
   * Probe 3: AudioContext Fingerprint & DynamicsCompressor
   */
  static async probeAudioContext(engineInfo) {
    const probeId = 'fp_audiocontext';
    const title = 'AudioContext Acoustic Fingerprinting';
    const category = 'fingerprinting';

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext || window.OfflineAudioContext;
      if (!AudioCtx) {
        return {
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'Audio API Disabled',
          summary: 'Web Audio API is completely disabled or blocked in this browser.',
          details: {
            'AudioContext': 'Not Available',
            'Fingerprint Risk': 'Zero'
          }
        };
      }

      // Check OfflineAudioContext with oscillator and dynamics compressor
      const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!OfflineCtx) {
        return {
          id: probeId,
          title,
          category,
          status: 'caution',
          badge: 'Partial Audio API',
          summary: 'OfflineAudioContext is restricted, preventing background acoustic rendering.',
          details: {
            'Offline Audio': 'Unavailable'
          }
        };
      }

      const runAudioPass = async () => {
        const context = new OfflineCtx(1, 44100, 44100);
        const osc = context.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(10000, context.currentTime);

        const comp = context.createDynamicsCompressor();
        comp.threshold.setValueAtTime(-50, context.currentTime);
        comp.knee.setValueAtTime(40, context.currentTime);
        comp.ratio.setValueAtTime(12, context.currentTime);
        comp.attack.setValueAtTime(0, context.currentTime);
        comp.release.setValueAtTime(0.25, context.currentTime);

        osc.connect(comp);
        comp.connect(context.destination);
        osc.start(0);

        const renderedBuffer = await context.startRendering();
        const output = renderedBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 4500; i < 5000; i++) {
          sum += Math.abs(output[i]);
        }
        return sum;
      };

      const sum1 = await runAudioPass();
      const sum2 = await runAudioPass();

      const isAudioFarbled = Math.abs(sum1 - sum2) > 0.0000001;

      if (isAudioFarbled) {
        return {
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'Audio Noise Active',
          summary: 'Audio Farbling / randomised acoustic noise detected. Trackers cannot compute a stable audio signature.',
          details: {
            'Acoustic Hash Pass 1': sum1.toFixed(8),
            'Acoustic Hash Pass 2': sum2.toFixed(8),
            'Noise Injection': 'Active (Non-deterministic audio synthesis)'
          }
        };
      }

      // Check if audio result is 0 or NaN (blocked)
      if (sum1 === 0 || isNaN(sum1)) {
        return {
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'Audio Blocked',
          summary: 'Audio buffer output is zeroed out or suppressed.',
          details: {
            'Render Buffer': 'Zeroed / Suppressed'
          }
        };
      }

      return {
        id: probeId,
        title,
        category,
        status: engineInfo.isFirefox ? 'caution' : 'fail',
        badge: 'Deterministic Audio',
        summary: 'Audio synthesis produces deterministic floating-point values linked to your hardware audio stack.',
        details: {
          'Acoustic Hash': sum1.toFixed(8),
          'Farbling Protection': 'Disabled',
          'Fingerprinting Risk': 'Moderate (Floating-point DSP variance exposed)'
        }
      };
    } catch (e) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'Protected',
        summary: 'AudioContext fingerprinting was blocked by browser security policies.',
        details: {
          'Reason': e.message || 'Access blocked'
        }
      };
    }
  }

  /**
   * Probe 4: WebGL Hardware & Shader Signature
   */
  static async probeWebGL(engineInfo) {
    const probeId = 'fp_webgl';
    const title = 'WebGL GPU Unmasked Hardware Profile';
    const category = 'fingerprinting';

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        return {
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'WebGL Disabled',
          summary: 'WebGL context is disabled or blocked. GPU fingerprinting is impossible.',
          details: {
            'WebGL Context': 'Disabled / Unavailable',
            'Hardware Exposure': 'None'
          }
        };
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) {
        return {
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'Vendor Masked',
          summary: 'WEBGL_debug_renderer_info extension is blocked. Raw GPU vendor and model strings are hidden.',
          details: {
            'Unmasked Vendor': 'Masked (Extension Disabled)',
            'Unmasked Renderer': 'Masked (Extension Disabled)'
          }
        };
      }

      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown';
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';

      // Check if generic or spoofed
      const isGeneric = /Mozilla|Generic|Standard|Software/i.test(renderer) && !/NVIDIA|AMD|Radeon|Intel|Apple|Adreno|Mali/i.test(renderer);

      if (isGeneric) {
        return {
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'GPU Spoofed / Generic',
          summary: 'GPU hardware profile is masked with generic renderer descriptors.',
          details: {
            'Vendor': vendor,
            'Renderer': renderer,
            'Spoofing Status': 'Active'
          }
        };
      }

      return {
        id: probeId,
        title,
        category,
        status: 'fail',
        badge: 'Raw GPU Leaking',
        summary: 'Your exact GPU graphics card model and driver stack are directly exposed to web scripts.',
        details: {
          'Unmasked Vendor': vendor,
          'Unmasked Renderer': renderer,
          'Max Texture Size': `${gl.getParameter(gl.MAX_TEXTURE_SIZE)} px`,
          'Fingerprinting Risk': 'High (Unique GPU & driver model identifier)'
        }
      };
    } catch (e) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'Protected',
        summary: 'WebGL probing was prevented by browser security controls.',
        details: {
          'Exception': e.message || 'WebGL blocked'
        }
      };
    }
  }

  /**
   * Probe 5: Screen Geometry & Colour Depth Leakage
   */
  static async probeScreenGeometry(engineInfo) {
    const probeId = 'fp_screen_geometry';
    const title = 'Display Geometry & Colour Depth Leakage';
    const category = 'fingerprinting';

    const screenW = screen.width;
    const screenH = screen.height;
    const availW = screen.availWidth;
    const availH = screen.availHeight;
    const colourDepth = screen.colorDepth;
    const pixelRatio = window.devicePixelRatio || 1;

    // Check if dimensions are normalised or spoofed
    const isStandardised = (screenW === 1920 && screenH === 1080 && availW === 1920 && availH === 1080) ||
                           (screenW === 1000 && screenH === 1000) ||
                           (colourDepth === 24 && pixelRatio === 1);

    const hasTaskbarLeak = (availW !== screenW) || (availH !== screenH);

    if (engineInfo.isTorOrHardened || isStandardised) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'Normalised Geometry',
        summary: 'Display metrics and colour depths are normalised to standard baseline values.',
        details: {
          'Resolution': `${screenW} × ${screenH} px`,
          'Available Area': `${availW} × ${availH} px`,
          'Colour Depth': `${colourDepth}-bit`,
          'Device Pixel Ratio': `${pixelRatio}x`
        }
      };
    }

    return {
      id: probeId,
      title,
      category,
      status: hasTaskbarLeak ? 'caution' : 'caution',
      badge: hasTaskbarLeak ? 'Taskbar / Dock Leaking' : 'Resolution Exposed',
      summary: hasTaskbarLeak 
        ? 'Available screen bounds reveal system taskbar, menu bar, or dock dimensions.'
        : 'Physical screen resolution and display scaling factors are visible to websites.',
      details: {
        'Physical Resolution': `${screenW} × ${screenH} px`,
        'Available Workspace': `${availW} × ${availH} px`,
        'Colour Depth': `${colourDepth}-bit`,
        'Pixel Scaling Ratio': `${pixelRatio}x`,
        'OS Dock/Taskbar Area': hasTaskbarLeak ? `Offset detected (${screenW - availW}w, ${screenH - availH}h)` : 'Full screen'
      }
    };
  }
}
