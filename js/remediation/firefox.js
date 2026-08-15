/**
 * Firefox & Gecko Tailored Remediation Presets
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

export const FirefoxRemediation = {
  fp_canvas_farbling: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    risk: 'Low Risk',
    title: 'Enable RFP Canvas Extraction Prompt & Spoofing',
    description: 'Firefox includes built-in canvas spoofing and permission gates via Resist Fingerprinting (RFP).',
    compatibility: 'Standard browsing, video streaming, and web apps will work normally. Highly specialized tools (such as web-based image diff checkers or canvas photo editors) may detect subtle pixel variance.',
    configKey: 'privacy.resistFingerprinting = true',
    steps: [
      'Type about:config in the Firefox address bar and press Enter.',
      'Click "Accept the Risk and Continue".',
      'Search for privacy.resistFingerprinting and toggle it to true.',
      'Optionally, search for privacy.resistFingerprinting.randomData and set to true for extra canvas entropy.'
    ],
    tip: 'Alternatively, install the open-source extension "CanvasBlocker" for fine-grained per-site canvas farbling without full RFP letterboxing.'
  },

  fp_firefox_rfp: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    risk: 'Moderate Risk',
    title: 'Activate Full Firefox Resist Fingerprinting (RFP)',
    description: 'RFP locks your timezone to UTC, clamps performance timers, spoofs standard system fonts, and standardises viewport metrics.',
    compatibility: 'Will lock your reported timezone to UTC (which may offset calendar display times in web calendar apps) and clamps window resize dimensions to 200x100 increments. Free video streaming and regular browsing are unaffected.',
    configKey: 'privacy.resistFingerprinting = true',
    steps: [
      'Open about:config in a new tab.',
      'Search for privacy.resistFingerprinting.',
      'Double-click or toggle to set the value to true.',
      'To enable viewport letterboxing borders, verify privacy.resistFingerprinting.letterboxing = true.'
    ],
    tip: 'Consider adopting the curated Arkenfox user.js template for an enterprise-grade hardened Firefox profile.'
  },

  fp_audiocontext: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    risk: 'Zero Risk',
    title: 'Restrict Web Audio & Synthetic DSP Fingerprinting',
    description: 'Mitigate acoustic fingerprinting in Firefox by enabling RFP or disabling background audio synthesis.',
    compatibility: 'Audible sound output, Spotify, podcasts, music, and video playback quality are 100% unaffected. Acoustic noise only alters analytical DSP sample buffers queried by tracking scripts.',
    configKey: 'privacy.resistFingerprinting = true (or CanvasBlocker audio spoofing)',
    steps: [
      'Enable privacy.resistFingerprinting = true in about:config (automatically injects audio noise).',
      'If using CanvasBlocker, ensure "Audio API Protection" is toggled to "Fake Readings".'
    ]
  },

  fp_webgl: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    risk: 'Moderate Risk',
    title: 'Mask WebGL GPU Vendor & Renderer Info',
    description: 'Prevent web scripts from querying your unmasked physical graphics card model.',
    compatibility: 'Enabling RFP masks GPU vendor/renderer strings with zero site breakage. However, completely disabling WebGL (webgl.disabled = true) will BREAK 3D web apps like Google Maps 3D, Figma, WebGL games, and 3D CAD viewers.',
    configKey: 'privacy.resistFingerprinting = true (Recommended) or webgl.disabled = true',
    steps: [
      'In about:config, enabling privacy.resistFingerprinting = true safely masks your GPU as a generic descriptor without breaking 3D sites.',
      'To completely disable WebGL for maximum attack surface reduction (breaks 3D sites), set webgl.disabled = true.'
    ]
  },

  fp_screen_geometry: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    risk: 'Zero Risk',
    title: 'Enable Viewport Letterboxing & Normalise Geometry',
    description: 'Letterboxing standardises browser dimensions to 200x100 stepping intervals, blending your device with the crowd.',
    compatibility: 'Zero functional breakage. Small grey padding bars appear around the content when resizing the window to match standardised dimensions.',
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
    risk: 'Moderate to High Risk (If Disabled)',
    title: 'Protect WebRTC IP Address Leaks (Without Breaking Calls)',
    description: 'Prevent WebRTC from querying STUN servers and revealing your true public or local LAN IP address.',
    compatibility: 'Setting media.peerconnection.enabled = false completely blocks WebRTC, which will BREAK browser-based voice/video calls (Google Meet, Discord Web, Zoom Web, Microsoft Teams). To prevent VPN IP leaks WITHOUT breaking calls, set media.peerconnection.ice.default_address_only = true instead.',
    configKey: 'media.peerconnection.ice.default_address_only = true',
    steps: [
      'Safe Hardening (Calls Still Work): In about:config, set media.peerconnection.ice.default_address_only = true. This prevents VPN/proxy bypass while keeping Google Meet and Zoom operational.',
      'Maximum Hardening (Breaks Web Calls): In about:config, set media.peerconnection.enabled = false if you do not use in-browser voice or video calls.'
    ]
  },

  trackers_matrix: {
    engineName: 'Firefox / Gecko',
    type: 'settings_and_addons',
    risk: 'Low Risk',
    title: 'Enable Firefox Strict Enhanced Tracking Protection & uBlock Origin',
    description: 'Strengthen Firefox native tracking protection and install community adblock filters.',
    compatibility: 'Over 99% of websites load faster and cleaner. Rarely, affiliate cashback referral links (e.g. TopCashback) or anti-adblock paywalls may require pausing uBlock Origin for that specific domain.',
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
    risk: 'Zero Risk',
    title: 'Enable Global Privacy Control (GPC) in Firefox',
    description: 'Broadcast the GPC signal to assert legal opt-out rights under GDPR/CCPA.',
    compatibility: '100% compatible. Passive machine-readable privacy preference header; does not cause any visual or functional site breakage.',
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
    risk: 'Zero Risk',
    title: 'Send "Do Not Track" Request Header',
    description: 'Signal to websites that you do not wish to be tracked.',
    compatibility: '100% compatible with all web applications.',
    configKey: 'privacy.donottrackheader.enabled = true',
    steps: [
      'Open Firefox Settings -> Privacy & Security.',
      'Under "Send websites a Do Not Track signal", choose "Always".'
    ]
  },

  signal_storage_partitioning: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    risk: 'Low Risk',
    title: 'Enforce Total Cookie Protection (dFPI)',
    description: 'Isolate storage and cookies to the top-level origin where they were set.',
    compatibility: 'Prevents cross-site trackers from following you. In rare cases, third-party embedded login widgets (e.g. "Login with Google" in a third-party iframe) will prompt for storage access approval.',
    configKey: 'network.cookie.cookieBehavior = 5',
    steps: [
      'In about:config, verify network.cookie.cookieBehavior is set to 5 (Total Cookie Protection).',
      'Ensure privacy.partition.network_state = true for full network cache isolation.'
    ]
  },

  signal_referrer: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    risk: 'Zero Risk',
    title: 'Trim Cross-Origin Referrer Headers',
    description: 'Strip full path parameters from HTTP Referrer headers sent to third parties.',
    compatibility: 'Zero site breakage. Sends only domain name (origin) to external links while keeping internal site navigation intact.',
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
    risk: 'Moderate Risk (Paid Streaming Only)',
    title: 'Disable Encrypted Media Extensions (DRM Content) [Optional Tradeoff]',
    description: 'Eliminate Widevine DRM device identifiers. Standard YouTube and Twitch do NOT require DRM. Paid streaming platforms require DRM to play.',
    compatibility: 'Free YouTube, Twitch, Vimeo, and general web videos will NOT break. Subscription streaming services (Netflix, Spotify Web Player, Disney+, Prime Video, Apple TV+) will be blocked.',
    configKey: 'media.eme.enabled = false',
    steps: [
      'Compatibility: Free YouTube, Twitch, and general web video will continue to play normally.',
      'Service impact: Paid streaming platforms (Netflix, Spotify Web Player, Disney+, Prime Video) will be blocked.',
      'To disable: Open Firefox Settings (about:preferences) -> General.',
      'Scroll to "Digital Rights Management (DRM) Content" and uncheck "Play DRM-controlled content".',
      'Or in about:config, toggle media.eme.enabled to false.'
    ]
  },

  hw_media_devices: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    risk: 'Zero Risk',
    title: 'Prevent Silent Media Device Enumeration',
    description: 'Ensure hardware labels and device IDs are masked until explicit user permission is granted.',
    compatibility: 'Zero impact on video calls. When you join a Google Meet or Zoom call, Firefox will still prompt you to select your mic/camera normally.',
    configKey: 'media.navigator.enabled = false (or use RFP)',
    steps: [
      'Enable privacy.resistFingerprinting = true in about:config (masks device enumeration).',
      'Optionally set media.navigator.enabled = false.'
    ]
  },

  hw_peripheral_apis: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    risk: 'Zero Risk',
    title: 'Disable Peripheral Sensor & Battery Web APIs',
    description: 'Firefox natively blocks Battery API and isolates WebUSB/Bluetooth behind strict flags.',
    compatibility: '99.9% of websites do not use peripheral APIs. Only specialized hardware web apps (e.g. web-based keyboard firmware flashers or Arduino web tools) require these.',
    configKey: 'dom.battery.enabled = false',
    steps: [
      'In about:config, verify dom.battery.enabled = false.',
      'Ensure dom.gamepad.enabled = false if you do not use web controllers.'
    ]
  },

  hw_cpu_memory: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    risk: 'Zero Risk',
    title: 'Normalise Hardware Concurrency & Memory',
    description: 'Standardise CPU core reporting to prevent hardware fingerprinting.',
    compatibility: 'Zero performance impact on web browsing. Web workers continue to multithread efficiently while advertising a standardised baseline.',
    configKey: 'dom.maxHardwareConcurrency = 2 (or use privacy.resistFingerprinting = true)',
    steps: [
      'Enabling privacy.resistFingerprinting = true automatically locks CPU core count to 2.',
      'Alternatively, set dom.maxHardwareConcurrency to 2 or 4 in about:config.'
    ]
  },

  hw_speech_voices: {
    engineName: 'Firefox / Gecko',
    type: 'about_config',
    risk: 'Zero Risk',
    title: 'Disable Speech Synthesis Voice Leakage',
    description: 'Prevent websites from enumerating OS-installed text-to-speech voice packs.',
    compatibility: 'Websites will fall back to browser default synthetic voices rather than reading your host OS regional language packs.',
    configKey: 'media.webspeech.synth.enabled = false',
    steps: [
      'In about:config, search for media.webspeech.synth.enabled.',
      'Set the value to false to disable speech synthesis voice enumeration.'
    ]
  }
};
