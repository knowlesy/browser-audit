/**
 * Firefox & Gecko Tailored Remediation Presets
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

export const FirefoxRemediation = {
  fp_canvas_farbling: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Enable RFP Canvas Extraction Prompt & Spoofing',
    description: 'Firefox has built-in canvas spoofing and permission gates via Resist Fingerprinting (RFP).',
    configKey: 'privacy.resistFingerprinting = true',
    steps: [
      'Type about:config in the Firefox URL address bar and press Enter.',
      'Click "Accept the Risk and Continue".',
      'Search for privacy.resistFingerprinting and set it to true.',
      'Optionally, search for privacy.resistFingerprinting.randomData and set it to true for extra canvas entropy.'
    ],
    tip: 'Alternatively, install the open-source extension "CanvasBlocker" for fine-grained per-site canvas farbling without full RFP letterboxing.'
  },

  fp_firefox_rfp: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Activate Full Firefox Resist Fingerprinting (RFP)',
    description: 'RFP locks your timezone to UTC, clamps performance timers, spoofs standard system fonts, and standardises viewport metrics.',
    configKey: 'privacy.resistFingerprinting = true',
    steps: [
      'Open about:config in a new tab.',
      'Search for privacy.resistFingerprinting.',
      'Double-click or toggle to set the value to true.',
      'To enable viewport letterboxing bars, verify privacy.resistFingerprinting.letterboxing = true.'
    ],
    tip: 'Consider adopting the curated Arkenfox user.js template for an enterprise-grade hardened Firefox profile.'
  },

  fp_audiocontext: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Restrict Web Audio & Synthetic DSP Fingerprinting',
    description: 'Mitigate acoustic fingerprinting in Firefox by enabling RFP or disabling background audio synthesis.',
    configKey: 'dom.webaudio.enabled = true (with RFP) or CanvasBlocker Audio setting',
    steps: [
      'Enable privacy.resistFingerprinting = true in about:config (automatically injects audio noise).',
      'If using CanvasBlocker, ensure "Audio API Protection" is toggled to "Fake Readings".'
    ]
  },

  fp_webgl: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Mask WebGL GPU Vendor & Renderer Info',
    description: 'Prevent web scripts from querying your unmasked physical graphics card model.',
    configKey: 'webgl.disabled = true (or privacy.resistFingerprinting = true)',
    steps: [
      'In about:config, enabling privacy.resistFingerprinting masks your GPU as a generic descriptor.',
      'To completely disable WebGL for maximum attack surface reduction, set webgl.disabled = true.'
    ]
  },

  fp_screen_geometry: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Enable Viewport Letterboxing & Normalise Geometry',
    description: 'Letterboxing standardises browser dimensions to 200x100 stepping intervals, blending your device with the crowd.',
    configKey: 'privacy.resistFingerprinting.letterboxing = true',
    steps: [
      'Navigate to about:config.',
      'Search for privacy.resistFingerprinting.letterboxing.',
      'Set the value to true to enable stepped window sizing.'
    ]
  },

  webrtc_ip_leak: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Disable or Restrict WebRTC IP Address Gathering',
    description: 'Prevent WebRTC from querying STUN servers and revealing your true public or local LAN IP address.',
    configKey: 'media.peerconnection.enabled = false',
    steps: [
      'Navigate to about:config.',
      'Search for media.peerconnection.enabled.',
      'Set the value to false to completely disable WebRTC.',
      'If you need WebRTC for video calls (Google Meet / Zoom), keep it true and set media.peerconnection.ice.default_address_only = true to force proxy/mDNS.'
    ]
  },

  trackers_matrix: {
    engineName: 'Firefox / Gecko',
    type: 'settings_and_addons',
    title: 'Enable Firefox Strict Enhanced Tracking Protection & uBlock Origin',
    description: 'Strengthen Firefox native tracking protection and install community adblock filters.',
    configKey: 'about:preferences#privacy -> Strict Mode',
    steps: [
      'Open Firefox Settings (about:preferences#privacy).',
      'Under "Enhanced Tracking Protection", select the "Strict" radio button.',
      'Install the "uBlock Origin" add-on from addons.mozilla.org.',
      'In uBlock Origin settings, enable "AdGuard Tracking Protection" and "EasyPrivacy" filter lists.'
    ]
  },

  signal_gpc: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Enable Global Privacy Control (GPC) in Firefox',
    description: 'Broadcast the GPC signal to assert legal opt-out rights under GDPR/CCPA.',
    configKey: 'privacy.globalprivacycontrol.enabled = true',
    steps: [
      'Navigate to about:config.',
      'Search for privacy.globalprivacycontrol.enabled.',
      'Toggle the preference to true.',
      'Also verify privacy.globalprivacycontrol.functionality.enabled = true.'
    ]
  },

  signal_dnt: {
    engineName: 'Firefox / Gecko',
    type: 'settings',
    title: 'Send "Do Not Track" Request Header',
    description: 'Signal to websites that you do not wish to be tracked.',
    configKey: 'privacy.donottrackheader.enabled = true',
    steps: [
      'Open Firefox Settings -> Privacy & Security.',
      'Under "Send websites a Do Not Track signal", choose "Always".'
    ]
  },

  signal_storage_partitioning: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Enforce Total Cookie Protection (dFPI)',
    description: 'Isolate storage and cookies to the top-level origin where they were set.',
    configKey: 'network.cookie.cookieBehavior = 5',
    steps: [
      'In about:config, verify network.cookie.cookieBehavior is set to 5 (Total Cookie Protection).',
      'Ensure privacy.partition.network_state = true for full network cache isolation.'
    ]
  },

  signal_referrer: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Trim Cross-Origin Referrer Headers',
    description: 'Strip full path parameters from HTTP Referrer headers sent to third parties.',
    configKey: 'network.http.referer.XOriginTrimmingPolicy = 2',
    steps: [
      'Navigate to about:config.',
      'Set network.http.referer.XOriginTrimmingPolicy to 2 (send origin only on cross-origin).',
      'Set network.http.referer.XOriginPolicy to 1 or 2 to strictly control outgoing referrers.'
    ]
  },

  hw_drm_eme: {
    engineName: 'Firefox / Gecko',
    type: 'settings',
    title: 'Disable Encrypted Media Extensions (DRM Content)',
    description: 'Prevent playback of proprietary DRM streams and eliminate Widevine tracking identifiers.',
    configKey: 'media.eme.enabled = false',
    steps: [
      'Open Firefox Settings -> General.',
      'Uncheck "Play DRM-controlled content".',
      'Or in about:config, set media.eme.enabled = false.'
    ]
  },

  hw_media_devices: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Prevent Media Device Enumeration',
    description: 'Ensure hardware labels and device IDs are masked until explicit user permission is granted.',
    configKey: 'media.navigator.enabled = false (or use RFP)',
    steps: [
      'Enable privacy.resistFingerprinting = true in about:config (masks device enumeration).',
      'Optionally set media.navigator.enabled = false.'
    ]
  },

  hw_peripheral_apis: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Disable Peripheral Sensor & Battery Web APIs',
    description: 'Firefox natively blocks Battery API and isolates WebUSB/Bluetooth behind strict flags.',
    configKey: 'dom.battery.enabled = false',
    steps: [
      'In about:config, verify dom.battery.enabled = false.',
      'Ensure dom.gamepad.enabled = false if you do not use web controllers.'
    ]
  },

  hw_cpu_memory: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Normalise Hardware Concurrency & Memory',
    description: 'Standardise CPU core reporting to prevent hardware fingerprinting.',
    configKey: 'dom.maxHardwareConcurrency = 2 (or use privacy.resistFingerprinting = true)',
    steps: [
      'Enabling privacy.resistFingerprinting = true automatically locks CPU core count to 2.',
      'Alternatively, set dom.maxHardwareConcurrency to 2 or 4 in about:config.'
    ]
  },

  hw_speech_voices: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    title: 'Disable Speech Synthesis Voice Leakage',
    description: 'Prevent websites from enumerating OS-installed text-to-speech voice packs.',
    configKey: 'media.webspeech.synth.enabled = false',
    steps: [
      'In about:config, search for media.webspeech.synth.enabled.',
      'Set the value to false to disable speech synthesis voice enumeration.'
    ]
  }
};
