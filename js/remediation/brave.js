/**
 * Brave Browser Tailored Remediation Presets
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

export const BraveRemediation = {
  fp_canvas_farbling: {
    engineName: 'Brave Browser',
    type: 'brave_shields',
    title: 'Enable Brave Strict Fingerprinting Farbling',
    description: 'Brave includes built-in dynamic Farbling that injects subtle pseudo-random noise into canvas and audio outputs.',
    configKey: 'brave://settings/shields -> Block fingerprinting: Aggressive / Strict',
    steps: [
      'Open brave://settings/shields in a new tab.',
      'Locate "Block fingerprinting".',
      'Change the setting from "Standard" to "Strict, may break sites".',
      'Alternatively, click the Brave Lion icon in the address bar on any page and toggle Fingerprinting Protection to Strict.'
    ],
    tip: 'Strict mode randomises canvas, audio, WebGL, and font metrics per session and per site.'
  },

  fp_firefox_rfp: {
    engineName: 'Brave Browser',
    type: 'brave_shields',
    title: 'Brave Farbling vs RFP Architecture',
    description: 'Brave employs dynamic Farbling (pseudo-randomised entropy) rather than Firefox RFP static standardisation.',
    configKey: 'brave://settings/shields',
    steps: [
      'Brave mitigates fingerprinting by introducing subtle noise into browser APIs on each run.',
      'Ensure "Block fingerprinting" is set to "Strict" in brave://settings/shields.'
    ]
  },

  fp_audiocontext: {
    engineName: 'Brave Browser',
    type: 'brave_shields',
    title: 'Enable Brave Audio Farbling Protection',
    description: 'Brave Shields automatically adds floating-point acoustic noise to AudioContext operations under Strict mode.',
    configKey: 'brave://settings/shields -> Fingerprinting Protection',
    steps: [
      'Open brave://settings/shields.',
      'Set "Block fingerprinting" to "Strict, may break sites".'
    ]
  },

  fp_webgl: {
    engineName: 'Brave Browser',
    type: 'brave_shields',
    title: 'Enable Brave WebGL Parameter Farbling',
    description: 'Brave farbles WebGL canvas parameters and masks GPU vendor extensions.',
    configKey: 'brave://settings/shields -> Fingerprinting Protection',
    steps: [
      'Open brave://settings/shields.',
      'Set "Block fingerprinting" to "Strict".'
    ]
  },

  fp_screen_geometry: {
    engineName: 'Brave Browser',
    type: 'brave_shields',
    title: 'Screen Geometry Protection in Brave',
    description: 'Brave Shields standardises reported screen dimensions in Strict Fingerprinting mode.',
    configKey: 'brave://settings/shields',
    steps: [
      'Set "Block fingerprinting" to "Strict" in brave://settings/shields.'
    ]
  },

  webrtc_ip_leak: {
    engineName: 'Brave Browser',
    type: 'brave_settings',
    title: 'Configure WebRTC IP Handling Policy in Brave',
    description: 'Prevent WebRTC from leaking local LAN or public IP addresses when using proxies or VPNs.',
    configKey: 'brave://settings/shields -> WebRTC IP Handling Policy: Disable Non-Proxied UDP',
    steps: [
      'Open brave://settings/shields in a new tab.',
      'Scroll down to "WebRTC IP handling policy".',
      'Change the dropdown from "Default" to "Disable non-proxied UDP".',
      'This guarantees that WebRTC will never bypass your VPN or proxy tunnel.'
    ]
  },

  trackers_matrix: {
    engineName: 'Brave Browser',
    type: 'brave_shields',
    title: 'Set Brave Trackers & Ads Blocking to Aggressive',
    description: 'Enhance Brave Shields native Rust adblocking engine with custom filter lists.',
    configKey: 'brave://settings/shields -> Trackers & ads blocking: Aggressive',
    steps: [
      'Open brave://settings/shields.',
      'Under "Trackers & ads blocking", change the setting from "Standard" to "Aggressive".',
      'Visit brave://settings/shields/filters to subscribe to additional community filter lists (e.g. Fanboy Annoyances, uBlock filters).'
    ]
  },

  signal_gpc: {
    engineName: 'Brave Browser',
    type: 'brave_settings',
    title: 'Brave Global Privacy Control is Built-in',
    description: 'Brave enables Global Privacy Control (GPC) by default across all platforms.',
    configKey: 'brave://settings/privacy -> Global Privacy Control',
    steps: [
      'Open brave://settings/privacy.',
      'Verify that "Global Privacy Control (GPC)" is toggled ON.'
    ]
  },

  signal_dnt: {
    engineName: 'Brave Browser',
    type: 'brave_settings',
    title: 'Enable "Do Not Track" Header in Brave',
    description: 'Send the DNT header alongside GPC with all web requests.',
    configKey: 'brave://settings/privacy -> Send "Do Not Track" request: Enabled',
    steps: [
      'Open brave://settings/privacy.',
      'Toggle ON "Send a \'Do Not Track\' request with your browsing traffic".'
    ]
  },

  signal_storage_partitioning: {
    engineName: 'Brave Browser',
    type: 'brave_shields',
    title: 'Brave Ephemeral Storage & Cookie Partitioning',
    description: 'Brave partitions third-party storage pools and purges cross-site state on tab close.',
    configKey: 'brave://settings/shields -> "Forget me when I close this site" (Optional)',
    steps: [
      'Brave automatically isolates third-party storage per top-level domain.',
      'For sensitive sessions, enable "Forget me when I close this site" in the Shields panel.'
    ]
  },

  signal_referrer: {
    engineName: 'Brave Browser',
    type: 'brave_shields',
    title: 'Brave Strict Referrer Policy',
    description: 'Brave automatically strips referrers down to the domain name on cross-site requests.',
    configKey: 'brave://settings/shields',
    steps: [
      'Brave enforces strict cross-origin referrer trimming out of the box.'
    ]
  },

  hw_drm_eme: {
    engineName: 'Brave Browser',
    type: 'brave_settings',
    title: 'Manage Widevine DRM in Brave [Optional Tradeoff]',
    description: 'Control Google Widevine DRM extension. Free YouTube and Twitch do NOT require DRM and will work normally. Paid streaming services (Netflix, Spotify Web, Prime Video) require Widevine to play.',
    configKey: 'brave://settings/extensions -> Widevine: Disabled',
    steps: [
      'Compatibility: YouTube, Twitch, and standard web media will continue to work normally.',
      'Service impact: Subscription platforms (Netflix, Spotify, Disney+) will not be able to play.',
      'To toggle: Open brave://settings/extensions.',
      'Toggle OFF "Widevine" and restart the browser.'
    ]
  },

  hw_media_devices: {
    engineName: 'Brave Browser',
    type: 'brave_settings',
    title: 'Verify Media Device Permissions',
    description: 'Brave requires explicit permission before revealing microphone and camera hardware models.',
    configKey: 'brave://settings/content',
    steps: [
      'Open brave://settings/content.',
      'Check Camera and Microphone permissions to ensure "Don\'t allow sites to see your camera/mic" is default.'
    ]
  },

  hw_peripheral_apis: {
    engineName: 'Brave Browser',
    type: 'brave_settings',
    title: 'Restrict Web Bluetooth, USB & Serial in Brave',
    description: 'Block peripheral hardware connection requests from websites.',
    configKey: 'brave://settings/content -> Additional permissions',
    steps: [
      'Open brave://settings/content.',
      'Under "Additional permissions", set WebUSB, Web Bluetooth, and Web Serial to "Don\'t allow sites to connect".'
    ]
  },

  hw_cpu_memory: {
    engineName: 'Brave Browser',
    type: 'brave_shields',
    title: 'Brave Hardware Concurrency Reporting',
    description: 'Brave Strict Fingerprinting mode standardises hardware concurrency values.',
    configKey: 'brave://settings/shields -> Block fingerprinting: Strict',
    steps: [
      'Set "Block fingerprinting" to "Strict" in brave://settings/shields.'
    ]
  },

  hw_speech_voices: {
    engineName: 'Brave Browser',
    type: 'brave_shields',
    title: 'Speech Synthesis Protection in Brave',
    description: 'Brave masks system speech synthesis voice lists when Strict Fingerprinting is active.',
    configKey: 'brave://settings/shields -> Block fingerprinting: Strict',
    steps: [
      'Enable "Strict" fingerprinting in brave://settings/shields to suppress speech voice enumeration.'
    ]
  }
};
