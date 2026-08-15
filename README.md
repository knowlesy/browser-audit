<div align="center">

# 🛡️ SpectreCheck
### Universal Browser Privacy & Hardening Auditor

[![CI Checks](https://github.com/knowlesy/browser-audit/actions/workflows/ci.yml/badge.svg)](https://github.com/knowlesy/browser-audit/actions/workflows/ci.yml)
[![Pages Deployment](https://github.com/knowlesy/browser-audit/actions/workflows/pages.yml/badge.svg)](https://github.com/knowlesy/browser-audit/actions/workflows/pages.yml)
[![Licence: MIT](https://img.shields.io/badge/Licence-MIT-a6e3a1.svg)](LICENSE)
[![Theme: Catppuccin Mocha](https://img.shields.io/badge/Theme-Catppuccin%20Mocha-cba6f7.svg)](https://github.com/catppuccin/catppuccin)
[![Zero Telemetry](https://img.shields.io/badge/Zero-Telemetry-89b4fa.svg)](#privacy-guarantee)

<p align="center">
  A lightweight, zero-dependency client-side web application hosted on GitHub Pages that audits a visitor's browser for privacy leaks, tracking protections, and anti-fingerprinting configurations.
</p>

[**Architecture & Methodology**](docs/architecture.md) • [**Live GitHub Pages**](https://knowlesy.github.io/browser-audit/) • [**Changelog**](CHANGELOG.md)

</div>

---

## 🌟 Overview

**SpectreCheck** dynamically adapts its heuristics, scoring algorithms, and remediation advice depending on whether the visitor uses **Firefox (Gecko)**, **Brave**, **Chromium variants (Chrome, Edge, Opera, Vivaldi)**, or **Safari (WebKit)**.

All checks execute locally in real-time within the visitor's browser. **Zero data is collected, stored, or transmitted to any external server.**

---

## 🔬 Core Audit Vectors

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SPECTRECHECK AUDIT SUITE                        │
├──────────────────────────┬─────────────────────────────────────────────┤
│ 1. Anti-Fingerprinting   │ Canvas Farbling (multi-pass), Firefox RFP,  │
│    & Farbling            │ UTC timezone lock, AudioContext, WebGL GPU  │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 2. WebRTC IP Leaks       │ STUN candidate gathering, Public IP leaks,  │
│                          │ Private LAN IP leaks, mDNS obfuscation      │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 3. Trackers & Telemetry  │ Multi-network probe matrix (Analytics, Ads, │
│                          │ Surveillance Pixels, Session Recorders)     │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 4. Privacy Signals       │ Global Privacy Control (GPC), Do Not Track  │
│    & Storage Isolation   │ (DNT), Cookie partitioning & Referrers      │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 5. Hardware Attack       │ Encrypted Media Extensions (DRM / Widevine),│
│    Surface & Sensors     │ MediaDevices, Bluetooth, USB, HID, Battery  │
└──────────────────────────┴─────────────────────────────────────────────┘
```

### 1. Engine Detection & Anti-Fingerprinting
* **Brave Farbling Detection**: Renders identical 2D Canvas operations across two sequential passes to detect non-deterministic Farbling noise and randomized byte deltas.
* **Firefox Resist Fingerprinting (RFP)**: Probes viewport dimension rounding / letterboxing, UTC timezone locking (`new Date().getTimezoneOffset() === 0`), and high-resolution timer quantization (`performance.now()`).
* **AudioContext & WebGL**: Evaluates acoustic buffer variance and probes `WEBGL_debug_renderer_info` to identify unmasked physical GPU model strings.

### 2. WebRTC STUN Candidate & IP Leaks
* Creates temporary `RTCPeerConnection` with public STUN servers to detect whether public IPv4/IPv6 addresses leak through VPN/proxy layers or if candidates are properly obscured via mDNS (`.local` hostnames) or disabled.

### 3. Telemetry & Tracker Blocking Matrix
* Dispatches simulated requests against known analytics and tracking endpoints (Google Analytics, Meta Pixel, DoubleClick, TikTok, Yandex, Clarity, Criteo) to measure real-world content blocker defence rates.

### 4. Privacy Signals & Storage Isolation
* Queries `navigator.globalPrivacyControl` (GPC) and `navigator.doNotTrack` (DNT).
* Checks cross-site cookie isolation and Storage Access API availability.

### 5. Hardware Surface & Sensor APIs
* Probes Encrypted Media Extensions (`navigator.requestMediaKeySystemAccess`) for Widevine DRM tracking keys.
* Checks default permissions and exposure for Battery API, Web Bluetooth, WebUSB, WebHID, Web Serial, CPU core concurrency, and Speech Synthesis voices.

---

## 🛠️ Engine-Tailored Remediation

Every test card features an expandable drawer with tailored instructions and one-click copyable configuration keys:

* **For Firefox users:** Exact `about:config` preference strings (e.g. `privacy.resistFingerprinting = true`, `media.peerconnection.enabled = false`, `network.cookie.cookieBehavior = 5`) aligned with Arkenfox hardening standards.
* **For Brave users:** Shield configurations (`brave://settings/shields`), aggressive adblocking rules, and WebRTC IP Handling Policy settings (`Disable Non-Proxied UDP`).
* **For Chrome / Edge / Chromium users:** Recommended open-source extensions (uBlock Origin, CanvasBlocker, Privacy Badger) and internal flag adjustments.

---

## 🎨 Catppuccin Mocha Design System

SpectreCheck uses an authentic **Catppuccin Mocha** dark palette:

| Token | Hex | Role |
| :--- | :--- | :--- |
| `--ctp-base` | `#1e1e2e` | Deep dark page background |
| `--ctp-surface0` | `#313244` | Card background |
| `--ctp-surface1` | `#45475a` | 1px border and divider lines |
| `--ctp-mauve` | `#cba6f7` | Primary brand accent & focus states |
| `--ctp-green` | `#a6e3a1` | Pass / Protected status badge |
| `--ctp-yellow` | `#f9e2af` | Caution / Default status badge |
| `--ctp-red` | `#f38ba8` | Fail / Leaking status badge |
| `--ctp-teal` | `#94e2d5` | Code snippets & highlights |

---

## 🚀 Quickstart & Local Usage

SpectreCheck requires **no build step, no Node.js compilation, and zero external dependencies**.

### Option 1: Run with any local HTTP server
```bash
# Using Python 3
python3 -m http.server 8080

# Or using Node npx serve
npx -y serve .

# Open in your browser
open http://localhost:8080
```

### Option 2: Open Directly
You can also open `index.html` directly in any modern browser.

---

## 🧪 Running Automated Tests

Run the built-in Node.js verification test suite:

```bash
node test/audit-test.mjs
```

The test suite validates:
* ES Module export contracts.
* Comprehensive probe ID mapping across Firefox, Brave, and Chromium remediation presets.
* Weighted privacy scoring calculations and letter grade boundaries ($A+$ through $F$).
* Structured Markdown and JSON report generator outputs.

---

## 🚢 Deployment Guide

### GitHub Pages (Recommended)
1. Push this repository to GitHub.
2. In your repository settings, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions** (the included `.github/workflows/pages.yml` will automatically deploy on every push to `main`).

---

## 🔒 Privacy Guarantee

* **Zero Telemetry**: No Google Analytics, no tracking pixels, no telemetry beacons.
* **Zero Backend**: All heuristics and STUN lookups execute strictly in your local browser sandbox.
* **Open Source**: Complete transparency under the MIT Licence.

---

## 📄 Licence

Distributed under the [MIT Licence](LICENSE). Built with ❤️ for privacy advocates and browser hardening enthusiasts.
