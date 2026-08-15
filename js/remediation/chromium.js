/**
 * Chromium (Chrome / Edge / Opera / Vivaldi) Tailored Remediation Presets
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

export const ChromiumRemediation = {
  fp_canvas_farbling: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'extension_recommended',
    risk: 'Low Risk',
    title: 'Install Canvas Noise Extension (e.g. CanvasBlocker / Fingerprint Defender)',
    description: 'Chromium engines lack built-in canvas farbling. Install an open-source extension to inject noise into canvas extractions.',
    compatibility: 'Regular web browsing, video streaming, and document editing are unaffected. Extensions allow whitelist exceptions for web image editors if needed.',
    configKey: 'Extension: Canvas Defender / CanvasBlocker or uBlock Origin Scriptlets',
    steps: [
      'Install "CanvasBlocker" or "Canvas Fingerprint Defender" from the Chrome Web Store.',
      'Configure the extension to "Fake Readout API" or "Inject subtle noise".',
      'Alternatively, consider using Brave or Hardened Firefox for native anti-fingerprinting.'
    ],
    tip: 'Chromium does not natively protect against 2D Canvas or WebGL hardware fingerprinting out of the box.'
  },

  fp_firefox_rfp: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'settings_and_flags',
    risk: 'Low Risk',
    title: 'Anti-Fingerprinting Limitations in Chromium',
    description: 'Chromium browsers do not support full RFP (Resist Fingerprinting) or UTC timezone locking without system-level modifications.',
    compatibility: 'Chromium prioritises web standards over anti-fingerprinting. For full RFP protection, consider Firefox or LibreWolf.',
    configKey: 'chrome://flags or Extension: Timezone Faker',
    steps: [
      'Install a timezone masking extension if you need to conceal your physical timezone.',
      'Consider switching to Firefox (with RFP) or Brave (with Strict Farbling) for comprehensive protection.'
    ]
  },

  fp_audiocontext: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'extension_recommended',
    risk: 'Zero Risk',
    title: 'Install Audio Fingerprint Defender',
    description: 'Protect against acoustic fingerprinting by installing an audio noise injection extension.',
    compatibility: 'Audible music, podcasts, and video streaming quality remain 100% unaffected. Subtle noise is added only to analytical DSP rendering buffers.',
    configKey: 'Extension: Audio Fingerprint Defender',
    steps: [
      'Install "Audio Fingerprint Defender" from the Chrome Web Store.',
      'The extension will automatically add subtle noise to OfflineAudioContext buffer rendering.'
    ]
  },

  fp_webgl: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'settings_and_flags',
    risk: 'Low Risk (Extension) / High Risk (Disabled)',
    title: 'Spoof WebGL GPU Vendor & Renderer Strings',
    description: 'Mitigate GPU fingerprinting in Chromium using extensions or startup flags.',
    compatibility: 'Installing a WebGL spoofing extension preserves full 3D functionality in Google Maps 3D, Figma, and WebGL games while disguising your hardware. Disabling WebGL entirely (--disable-webgl) will break 3D web apps.',
    configKey: 'Extension: WebGL Fingerprint Defender',
    steps: [
      'Recommended: Install "WebGL Fingerprint Defender" from Chrome Web Store to spoof GPU vendor/renderer strings without breaking 3D sites.',
      'Extreme Hardening (Breaks 3D sites): Start Chrome with the flag --disable-webgl.'
    ]
  },

  fp_screen_geometry: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'info',
    risk: 'Zero Risk',
    title: 'Display Resolution & Scaling in Chromium',
    description: 'Chromium directly exposes display workspace bounds to web scripts.',
    compatibility: 'Zero site breakage. Running in maximized mode prevents fine-grained window dimension fingerprinting.',
    configKey: 'Standard Chromium Behaviour',
    steps: [
      'Chromium does not offer native window letterboxing.',
      'Running in maximized mode prevents fine-grained window dimension fingerprinting.'
    ]
  },

  webrtc_ip_leak: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'extension_and_settings',
    risk: 'Low Risk (Safe Hardening)',
    title: 'Configure WebRTC IP Handling in Chromium (Without Breaking Calls)',
    description: 'Chromium lacks a native UI toggle to disable WebRTC. Use uBlock Origin or a WebRTC policy extension to prevent VPN IP leaks.',
    compatibility: 'Setting "Prevent WebRTC from leaking local IP" in uBlock Origin or WebRTC Control protects against VPN/proxy bypass WITHOUT breaking Google Meet, Discord, or Zoom calls.',
    configKey: 'uBlock Origin -> Settings -> "Prevent WebRTC from leaking local IP address"',
    steps: [
      'Safe Hardening (Calls Still Work): Open uBlock Origin Dashboard -> Settings -> Check "Prevent WebRTC from leaking local IP address".',
      'Alternatively, install "WebRTC Control" from Chrome Web Store and select "Disable Non-Proxied UDP".',
      'In Edge: Open edge://settings/privacy and search for WebRTC.'
    ]
  },

  trackers_matrix: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'extension_recommended',
    risk: 'Low Risk',
    title: 'Install uBlock Origin & Privacy Badger',
    description: 'Chromium lacks aggressive built-in tracker blocking. Equip community-maintained blocking filters.',
    compatibility: 'Over 99% of web browsing loads faster and cleaner. Click the uBlock icon to pause on trusted cashback or payment portals if needed.',
    configKey: 'Extension: uBlock Origin (Chrome Web Store)',
    steps: [
      'Install "uBlock Origin" from the Chrome Web Store.',
      'Open uBlock Origin Dashboard -> Filter Lists.',
      'Enable "EasyPrivacy", "AdGuard Tracking Protection", and "Block Minor Tracking Hosts".',
      'Optionally install "Privacy Badger" from EFF to learn and block invisible third-party trackers.'
    ]
  },

  signal_gpc: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'settings_and_extensions',
    risk: 'Zero Risk',
    title: 'Enable Global Privacy Control in Chromium',
    description: 'Enable GPC via browser settings or privacy extensions.',
    compatibility: '100% compatible. Passive machine-readable header; does not cause any site breakage.',
    configKey: 'chrome://settings/privacy or Extension: Privacy Badger / OptMeOut',
    steps: [
      'Install "Privacy Badger" or "OptMeOut" extension to automatically inject the GPC signal.',
      'In newer Chrome builds, verify under chrome://settings/privacy -> "Do Not Track" and privacy signals.'
    ]
  },

  signal_dnt: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'settings',
    risk: 'Zero Risk',
    title: 'Enable "Do Not Track" in Chrome / Edge Settings',
    description: 'Send a DNT header with all web requests.',
    compatibility: '100% compatible with all web applications.',
    configKey: 'chrome://settings/cookies or edge://settings/privacy',
    steps: [
      'Open chrome://settings/cookies (or edge://settings/privacy).',
      'Toggle ON "Send a \'Do Not Track\' request with your browsing traffic".'
    ]
  },

  signal_storage_partitioning: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'settings_and_flags',
    risk: 'Low Risk',
    title: 'Block Third-Party Cookies & Enable Storage Partitioning',
    description: 'Prevent cross-site trackers from accessing shared storage state.',
    compatibility: 'Cross-site cookies are isolated per top-level origin. Embedded third-party login widgets will prompt for storage access permission if needed.',
    configKey: 'chrome://settings/cookies -> Block third-party cookies',
    steps: [
      'Open chrome://settings/cookies.',
      'Select "Block third-party cookies" (or "Block in Incognito").',
      'Ensure "Third-Party Storage Partitioning (CHIPS)" is enabled in chrome://flags.'
    ]
  },

  signal_referrer: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'extension_recommended',
    risk: 'Zero Risk',
    title: 'Strip Tracking Parameters with ClearURLs',
    description: 'Remove surveillance tokens (utm_source, fbclid, gclid) and referrers from URLs.',
    compatibility: 'Zero site breakage. Strips tracking tokens automatically while keeping target web pages working normally.',
    configKey: 'Extension: ClearURLs',
    steps: [
      'Install "ClearURLs" from the Chrome Web Store to strip surveillance query parameters automatically.'
    ]
  },

  hw_drm_eme: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'settings',
    risk: 'Moderate Risk (Paid Streaming Only)',
    title: 'Configure Protected Content & DRM Permissions [Optional Tradeoff]',
    description: 'Control Widevine DRM identifier permissions. Standard YouTube and Twitch do NOT require DRM and will work normally. Paid streaming services (Netflix, Spotify, Prime Video) require DRM.',
    compatibility: 'Standard YouTube, Twitch, and general web video will continue to play normally. Subscription streaming services (Netflix, Spotify Web Player, Disney+, Prime Video) will be blocked.',
    configKey: 'chrome://settings/content/protectedContent',
    steps: [
      'Compatibility: Standard YouTube and Twitch video streaming will continue to work normally.',
      'Service impact: Subscription services like Netflix and Spotify Web Player will be blocked.',
      'To configure: Open chrome://settings/content/protectedContent.',
      'Choose "Don\'t allow sites to play protected content" if DRM streaming is not needed.'
    ]
  },

  hw_media_devices: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'settings',
    risk: 'Zero Risk',
    title: 'Restrict Camera and Microphone Default Access',
    description: 'Ensure device labels are masked until permission is explicitly prompted.',
    compatibility: 'Calls on Google Meet, Teams, or Zoom will still prompt for camera/microphone permission normally when you join.',
    configKey: 'chrome://settings/content/camera & microphone',
    steps: [
      'Open chrome://settings/content.',
      'Verify that Camera and Microphone are set to "Don\'t allow sites to see your camera/mic" by default.'
    ]
  },

  hw_peripheral_apis: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'settings',
    risk: 'Zero Risk',
    title: 'Disable WebUSB, Web Bluetooth & Serial API Access',
    description: 'Block web scripts from requesting connection to USB devices or Bluetooth beacons.',
    compatibility: '99.9% of websites do not use peripheral APIs. Does not impact normal browsing.',
    configKey: 'chrome://settings/content -> Additional permissions',
    steps: [
      'Open chrome://settings/content.',
      'Under "Additional permissions", set WebUSB, WebHID, Web Serial, and Bluetooth to "Don\'t allow sites to connect".'
    ]
  },

  hw_cpu_memory: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'info',
    risk: 'Zero Risk',
    title: 'Hardware Concurrency in Chromium',
    description: 'Chromium does not offer native core count masking.',
    compatibility: 'Chromium exposes physical CPU core count and memory tier to web scripts.',
    configKey: 'Standard Hardware Reporting',
    steps: [
      'Chromium exposes navigator.hardwareConcurrency and deviceMemory natively to web workers.'
    ]
  },

  hw_speech_voices: {
    engineName: 'Chromium / Chrome / Edge',
    type: 'info',
    risk: 'Zero Risk',
    title: 'Speech Synthesis Voices in Chromium',
    description: 'Speech voices are populated from the host OS TTS service.',
    compatibility: 'Standard speech synthesis remains available.',
    configKey: 'Standard Web Speech API',
    steps: [
      'Chromium exposes system TTS voices to the SpeechSynthesis API without permission prompts.'
    ]
  }
};
