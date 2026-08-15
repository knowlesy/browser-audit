/**
 * WebRTC IP Leak & Candidate Inspector
 * SpectreCheck - Universal Browser Privacy & Hardening Auditor
 */

export class WebRTCProbes {
  /**
   * Run WebRTC IP leak checks
   * @param {object} engineInfo 
   * @returns {Promise<Array<object>>}
   */
  static async runAll(engineInfo) {
    const results = [];

    // Probe 1: WebRTC STUN Candidate Gathering & Public/Local IP Leak
    results.push(await this.probeWebRTCLeak(engineInfo));

    return results;
  }

  static async probeWebRTCLeak(engineInfo) {
    const probeId = 'webrtc_ip_leak';
    const title = 'WebRTC ICE Candidate & IP Leak Probing';
    const category = 'webrtc';

    const PeerConnection = window.RTCPeerConnection || 
                           window.webkitRTCPeerConnection || 
                           window.mozRTCPeerConnection;

    if (!PeerConnection) {
      return {
        id: probeId,
        title,
        category,
        status: 'pass',
        badge: 'WebRTC Disabled',
        summary: 'WebRTC is completely disabled in your browser. No IP addresses or ICE candidates can be harvested.',
        details: {
          'WebRTC API': 'Disabled / Not Available',
          'IP Leak Risk': 'Zero (Maximum Protection)'
        }
      };
    }

    return new Promise((resolve) => {
      let pc = null;
      let isResolved = false;
      const gatheredCandidates = [];
      const publicIPs = new Set();
      const privateIPs = new Set();
      const mdnsCandidates = new Set();

      // IP Regex patterns
      const ipv4Regex = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/;
      const ipv6Regex = /([a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7}|[a-f0-9]{1,4}(?:::?[a-f0-9]{1,4}){1,6})/i;
      const privateIPv4Regex = /^(?:10\.|127\.|172\.(?:1[6-9]|2[0-9]|3[01])\.|192\.168\.)/;

      const finishProbe = () => {
        if (isResolved) return;
        isResolved = true;

        if (pc) {
          try {
            pc.close();
          } catch {
            // Ignore close error
          }
        }

        const publicList = Array.from(publicIPs);
        const privateList = Array.from(privateIPs);
        const mdnsList = Array.from(mdnsCandidates);

        if (publicList.length > 0) {
          resolve({
            id: probeId,
            title,
            category,
            status: 'fail',
            badge: 'Public IP Leaked',
            summary: `WebRTC gathered STUN candidates revealing your real public IP address (${publicList.join(', ')}), bypassing proxy or VPN layers.`,
            details: {
              'Public IP Leaked': publicList.join(', '),
              'Private LAN IPs': privateList.length > 0 ? privateList.join(', ') : 'None detected',
              'mDNS Obfuscation': mdnsList.length > 0 ? 'Partial' : 'Disabled',
              'Candidate Count': `${gatheredCandidates.length} gathered`
            }
          });
          return;
        }

        if (privateList.length > 0) {
          resolve({
            id: probeId,
            title,
            category,
            status: 'caution',
            badge: 'Local IP Exposed',
            summary: `WebRTC leaked your internal private LAN IP address (${privateList.join(', ')}), enabling local network reconnaissance.`,
            details: {
              'Public IP': 'Protected / Not Exposed',
              'Private LAN IPs': privateList.join(', '),
              'mDNS Masking': 'Inactive',
              'Candidate Count': `${gatheredCandidates.length} candidates`
            }
          });
          return;
        }

        if (mdnsList.length > 0) {
          resolve({
            id: probeId,
            title,
            category,
            status: 'pass',
            badge: 'mDNS Masked',
            summary: 'WebRTC uses mDNS (.local) hostname obfuscation to mask local network IP addresses from web scripts.',
            details: {
              'Public IP Leak': 'None detected',
              'Local IP Leak': 'Protected (mDNS Obfuscation Active)',
              'mDNS Identifiers': mdnsList.slice(0, 2).join(', ') + (mdnsList.length > 2 ? ' ...' : ''),
              'Candidate Count': `${gatheredCandidates.length} gathered`
            }
          });
          return;
        }

        // No candidates gathered or blocked
        resolve({
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'Candidates Blocked',
          summary: 'No WebRTC ICE candidates were gathered. STUN lookups and local IP discovery are blocked.',
          details: {
            'Public IP': 'Not Exposed',
            'Private IP': 'Not Exposed',
            'Candidate Gathering': 'Blocked / Refused'
          }
        });
      };

      // 3.5s timeout safety fallback
      const timer = setTimeout(() => {
        finishProbe();
      }, 3500);

      try {
        const config = {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun.cloudflare.com:3478' }
          ],
          iceCandidatePoolSize: 2
        };

        pc = new PeerConnection(config);

        pc.onicecandidate = (event) => {
          if (!event || !event.candidate) {
            // End of candidate gathering
            clearTimeout(timer);
            finishProbe();
            return;
          }

          const candidateStr = event.candidate.candidate || '';
          gatheredCandidates.push(candidateStr);

          // Check for .local mDNS domains
          if (/\.local\b/i.test(candidateStr)) {
            const match = candidateStr.match(/([a-f0-9-]+\.local)/i);
            if (match) mdnsCandidates.add(match[1]);
          }

          // Check for IPv4
          const matchIPv4 = candidateStr.match(ipv4Regex);
          if (matchIPv4) {
            const ip = matchIPv4[1];
            if (privateIPv4Regex.test(ip)) {
              privateIPs.add(ip);
            } else if (!ip.endsWith('.0') && !ip.startsWith('0.')) {
              publicIPs.add(ip);
            }
          }

          // Check for IPv6
          const matchIPv6 = candidateStr.match(ipv6Regex);
          if (matchIPv6) {
            const ip = matchIPv6[1];
            if (ip.startsWith('fe80') || ip.startsWith('fd')) {
              privateIPs.add(ip);
            } else {
              publicIPs.add(ip);
            }
          }
        };

        pc.onicecandidateerror = () => {
          // Candidate error can happen when STUN is blocked
        };

        // Create dummy data channel and offer
        pc.createDataChannel('spectrecheck-probe');
        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .catch(() => {
            clearTimeout(timer);
            finishProbe();
          });

      } catch (e) {
        clearTimeout(timer);
        resolve({
          id: probeId,
          title,
          category,
          status: 'pass',
          badge: 'WebRTC Blocked',
          summary: 'WebRTC PeerConnection initialization was blocked by browser policies.',
          details: {
            'Exception': e.message || 'Access Denied'
          }
        });
      }
    });
  }
}
