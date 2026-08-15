# Changelog

All notable changes to **SpectreCheck** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-15

### Added
* **Engine & Client Profiling**: Automatic identification of Gecko (Firefox/LibreWolf/Tor), Chromium (Brave, Chrome, Edge, Opera, Vivaldi), and WebKit engines with OS and version extraction.
* **Anti-Fingerprinting Probes**:
  * Multi-pass Canvas 2D Farbling detection (identifying non-deterministic noise in Brave Shields and CanvasBlocker).
  * Firefox Resist Fingerprinting (RFP) heuristics (UTC timezone locking, timer precision quantisation, and window geometry normalisation).
  * AudioContext acoustic fingerprinting with DynamicsCompressor and Oscillator buffer variance.
  * WebGL GPU hardware exposure and `WEBGL_debug_renderer_info` unmasking.
  * Screen geometry and OS taskbar/dock leakage detection.
* **WebRTC IP Leak Engine**:
  * Real-time STUN candidate gathering via `RTCPeerConnection`.
  * Public IPv4/IPv6 de-anonymisation detection (bypassing VPN/proxy layers).
  * Private LAN IP disclosure detection (`192.168.x.x`, `10.x.x.x`).
  * mDNS `.local` candidate obfuscation verification.
* **Telemetry & Tracker Blocking Matrix**:
  * Asynchronous probe matrix against major tracking, analytics, and surveillance networks (Google Analytics, Meta Pixel, DoubleClick, TikTok, Yandex, Clarity, Criteo, Scorecard Research).
  * Automatic adblock/content-blocker defense rate calculation.
* **Privacy Signals & Storage Isolation**:
  * Global Privacy Control (GPC) signal verification.
  * Do Not Track (DNT) header probe.
  * Cross-site cookie isolation and Storage Access API state partitioning checks.
  * Cross-origin referrer policy trimming inspection.
* **Hardware & Sensor Attack Surface**:
  * Encrypted Media Extensions (DRM / Widevine / ClearKey / PlayReady) probing.
  * MediaDevices hardware label and device ID leakage checks.
  * Web Bluetooth, WebUSB, WebHID, Web Serial, and Battery Status API auditing.
  * CPU logical core concurrency and speech synthesis voice pack enumeration.
* **Engine-Tailored Remediation System**:
  * Interactive expandable drawers on every test card with copyable configuration keys and step-by-step guidance.
  * Exact `about:config` strings for Firefox users (with Arkenfox user.js alignment).
  * Shield toggles (`brave://settings/shields`) and WebRTC IP handling rules for Brave.
  * Extension recommendations (uBlock Origin, CanvasBlocker, Privacy Badger) and flag settings for Chromium/Edge.
* **UI & Design System**:
  * Catppuccin Mocha palette with dark `#1e1e2e` base and `#313244` card surfaces.
  * Centralised responsive 780px card layout.
  * Circular SVG privacy score dial with dynamic letter grade (A+ through F).
  * Instant category and status filtering (All, Leaking, Caution, Protected, Vectors).
  * One-click Export Report (formatted Markdown and JSON) with clipboard copy and file download.
  * Toast notification system for copy events and status updates.
* **Documentation & DevOps**:
  * Comprehensive `docs/architecture.md` with Mermaid diagrams.
  * GitHub Actions CI and GitHub Pages deployment workflows.
  * Automated Node.js unit test suite (`test/audit-test.mjs`).
