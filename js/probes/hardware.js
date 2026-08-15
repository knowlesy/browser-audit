/**
 * Hardware, Sensors & Media Probes
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

export class HardwareProbes {
  /**
   * Run all hardware, sensor, and media API probes
   * @param {object} engineInfo 
   * @returns {Promise<Array<object>>}
   */
  static async runAll(engineInfo) {
    const results = [];

    // Probe 1: Encrypted Media Extensions (DRM / EME Probing)
    results.push(await this.probeDRM(engineInfo));

    // Probe 2: Media Devices Enumeration (Camera, Mic, Speakers)
    results.push(await this.probeMediaDevices(engineInfo));

    // Probe 3: Sensor & Peripheral APIs (Bluetooth, USB, HID, Serial, Battery)
    results.push(await this.probePeripheralAPIs(engineInfo));

    // Probe 4: CPU Concurrency & Memory Leakage
    results.push(await this.probeHardwareSpecs(engineInfo));

    // Probe 5: Speech Synthesis Voice Enumeration
    results.push(await this.probeSpeechVoices(engineInfo));

    return results;
  }

  /**
   * Probe 1: DRM / EME (Widevine, ClearKey, PlayReady)
   */
  static async probeDRM(engineInfo) {
    const probeId = 'hw_drm_eme';
    const title = 'Encrypted Media Extensions (DRM / EME)';
    const category = 'hardware';

    if (!navigator.requestMediaKeySystemAccess) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'DRM Disabled',
        summary: 'Encrypted Media Extensions API is not supported or is disabled. Hardware DRM tracking tokens are blocked.',
        details: {
          'EME Support': 'Disabled / Not Available',
          'DRM Fingerprint Risk': 'Zero'
        }
      };
    }

    const testKeySystems = [
      { name: 'Google Widevine', keySystem: 'com.widevine.alpha' },
      { name: 'W3C ClearKey', keySystem: 'org.w3.clearkey' },
      { name: 'Microsoft PlayReady', keySystem: 'com.microsoft.playready' }
    ];

    const probeConfigs = [
      {
        initDataTypes: ['cenc'],
        audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
        videoCapabilities: [{ contentType: 'video/mp4;codecs="avc1.42E01E"' }]
      }
    ];

    const activeSystems = [];

    for (const sys of testKeySystems) {
      try {
        await navigator.requestMediaKeySystemAccess(sys.keySystem, probeConfigs);
        activeSystems.push(sys.name);
      } catch {
        // Not supported or rejected
      }
    }

    const detailsMap = {
      'EME API': 'Available'
    };

    testKeySystems.forEach(sys => {
      detailsMap[sys.name] = activeSystems.includes(sys.name) ? 'Supported / Enabled' : 'Not Supported / Blocked';
    });

    if (activeSystems.length === 0) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'DRM Blocked',
        summary: 'No proprietary DRM key systems were exposed to web scripts.',
        details: detailsMap
      };
    }

    return {
      id: probeId,
      title,
      category,
      status: 'caution',
      badge: 'DRM Active',
      summary: `Proprietary DRM subsystems exposed (${activeSystems.join(', ')}). DRM components can provide persistent device identification.`,
      details: detailsMap
    };
  }

  /**
   * Probe 2: Media Devices Enumeration
   */
  static async probeMediaDevices(engineInfo) {
    const probeId = 'hw_media_devices';
    const title = 'Media Devices & Audio/Video Enumeration';
    const category = 'hardware';

    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'API Disabled',
        summary: 'MediaDevices enumeration API is disabled or unsupported.',
        details: {
          'MediaDevices API': 'Unavailable'
        }
      };
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(d => d.kind === 'audioinput');
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      const audioOutputs = devices.filter(d => d.kind === 'audiooutput');

      const hasLabels = devices.some(d => d.label && d.label.length > 0);
      const hasDeviceIds = devices.some(d => d.deviceId && d.deviceId.length > 0);

      const detailsMap = {
        'Microphone Inputs': `${audioInputs.length} detected`,
        'Camera Inputs': `${videoInputs.length} detected`,
        'Audio Output Speakers': `${audioOutputs.length} detected`,
        'Device Hardware Labels': hasLabels ? '⚠️ LEAKING' : '🛡️ Masked (Permission Required)',
        'Persistent Device IDs': hasDeviceIds ? `${devices.length} IDs exposed` : '🛡️ Blanked / Hidden'
      };

      if (hasLabels) {
        return {
          id: probeId,
          title,
          category,
          status: 'fail',
          badge: 'Device Labels Leaked',
          summary: 'Exact physical hardware model names for audio/video devices leaked without active permission.',
          details: detailsMap
        };
      }

      if (devices.length === 0) {
        return {
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'Devices Concealed',
          summary: 'No hardware media devices exposed to scripts.',
          details: detailsMap
        };
      }

      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'IDs Masked',
        summary: `Enumerated ${devices.length} device slots, but hardware labels and persistent model names are properly masked until permission is granted.`,
        details: detailsMap
      };
    } catch (e) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'Access Denied',
        summary: 'Device enumeration access was restricted.',
        details: { 'Error': e.message || 'Access blocked' }
      };
    }
  }

  /**
   * Probe 3: Sensor & Peripheral APIs (Bluetooth, USB, HID, Serial, Battery)
   */
  static async probePeripheralAPIs(engineInfo) {
    const probeId = 'hw_peripheral_apis';
    const title = 'Peripheral & Sensor Web APIs Surface';
    const category = 'hardware';

    // @ts-ignore
    const hasBattery = typeof navigator.getBattery === 'function';
    // @ts-ignore
    const hasBluetooth = typeof navigator.bluetooth !== 'undefined';
    // @ts-ignore
    const hasUSB = typeof navigator.usb !== 'undefined';
    // @ts-ignore
    const hasHID = typeof navigator.hid !== 'undefined';
    // @ts-ignore
    const hasSerial = typeof navigator.serial !== 'undefined';
    const hasOrientation = typeof window.DeviceOrientationEvent !== 'undefined';

    const exposedApis = [];
    if (hasBattery) exposedApis.push('Battery API');
    if (hasBluetooth) exposedApis.push('Web Bluetooth');
    if (hasUSB) exposedApis.push('WebUSB');
    if (hasHID) exposedApis.push('WebHID');
    if (hasSerial) exposedApis.push('Web Serial');

    const detailsMap = {
      'Battery Status API': hasBattery ? '⚠️ Exposed (navigator.getBattery)' : '🛡️ Disabled / Blocked',
      'Web Bluetooth API': hasBluetooth ? '⚠️ Available' : '🛡️ Disabled',
      'WebUSB API': hasUSB ? '⚠️ Available' : '🛡️ Disabled',
      'WebHID API': hasHID ? '⚠️ Available' : '🛡️ Disabled',
      'Web Serial API': hasSerial ? '⚠️ Available' : '🛡️ Disabled',
      'Device Orientation / Gyro': hasOrientation ? 'Available (Event Supported)' : '🛡️ Blocked'
    };

    if (exposedApis.length >= 3) {
      return {
        id: probeId,
        title,
        category,
        status: 'caution',
        badge: `${exposedApis.length} APIs Exposed`,
        summary: `Large peripheral API attack surface (${exposedApis.join(', ')}). While access typically prompts for permission, API presence enables feature fingerprinting.`,
        details: detailsMap
      };
    }

    return {
      id: probeId,
      title,
      category,
      status: 'pass',
      badge: 'APIs Restricted',
      summary: 'Dangerous peripheral APIs (Battery, WebUSB, Bluetooth, HID) are blocked or restricted.',
      details: detailsMap
    };
  }

  /**
   * Probe 4: CPU Concurrency & Memory Leakage
   */
  static async probeHardwareSpecs(engineInfo) {
    const probeId = 'hw_cpu_memory';
    const title = 'CPU Concurrency & Memory Architecture';
    const category = 'hardware';

    const concurrency = navigator.hardwareConcurrency;
    // @ts-ignore
    const deviceMemory = navigator.deviceMemory;

    const isConcurrencySpoofed = concurrency === 2 || concurrency === 4;
    const isMemoryHidden = typeof deviceMemory === 'undefined';

    const detailsMap = {
      'Logical CPU Cores': concurrency ? `${concurrency} cores` : 'Undisclosed',
      'Device RAM Tier': deviceMemory ? `${deviceMemory} GB` : '🛡️ Undisclosed (Masked)',
      'Concurrency Normalisation': isConcurrencySpoofed ? '🛡️ Spoofed / Standardised' : 'Raw Hardware Core Count'
    };

    if (engineInfo.isTorOrHardened || (isConcurrencySpoofed && isMemoryHidden)) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'Specs Standardised',
        summary: 'CPU core count and RAM values are normalised or hidden to mitigate hardware fingerprinting.',
        details: detailsMap
      };
    }

    return {
      id: probeId,
      title,
      category,
      status: 'caution',
      badge: `${concurrency || '?'} Cores Exposed`,
      summary: `Your exact processor logical core count (${concurrency} cores) and memory configuration are exposed.`,
      details: detailsMap
    };
  }

  /**
   * Probe 5: Speech Synthesis Voice Enumeration
   */
  static async probeSpeechVoices(engineInfo) {
    const probeId = 'hw_speech_voices';
    const title = 'Speech Synthesis System Voice Enumeration';
    const category = 'hardware';

    if (!window.speechSynthesis || typeof window.speechSynthesis.getVoices !== 'function') {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'Voices Blocked',
        summary: 'Speech Synthesis API is not exposed.',
        details: {
          'SpeechSynthesis API': 'Not Available'
        }
      };
    }

    try {
      let voices = window.speechSynthesis.getVoices();
      
      // If empty, wait briefly for async voice loading
      if (voices.length === 0) {
        await new Promise(resolve => {
          const timeout = setTimeout(resolve, 300);
          window.speechSynthesis.onvoiceschanged = () => {
            clearTimeout(timeout);
            voices = window.speechSynthesis.getVoices();
            resolve();
          };
        });
      }

      const voiceCount = voices.length;

      if (voiceCount > 0) {
        const sampleVoices = voices.slice(0, 3).map(v => `${v.name} (${v.lang})`).join(', ');
        return {
          id: probeId,
          title,
          category,
          status: 'caution',
          badge: `${voiceCount} Voices Leaking`,
          summary: `Enumerated ${voiceCount} installed system speech voices, which leaks operating system language packs and regional locale configurations.`,
          details: {
            'Installed Voice Count': `${voiceCount} voices`,
            'Sample Voices': sampleVoices + (voiceCount > 3 ? '...' : ''),
            'Fingerprint Entropy': 'Moderate (System TTS engines reveal OS & locale)'
          }
        };
      }

      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: '0 Voices Exposed',
        summary: 'No system speech voices were leaked to the webpage.',
        details: {
          'Voice Count': '0 (Hidden or uninitialised)'
        }
      };
    } catch (e) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'Protected',
        summary: 'Speech voice enumeration failed or was blocked.',
        details: { 'Error': e.message || 'Access blocked' }
      };
    }
  }
}
