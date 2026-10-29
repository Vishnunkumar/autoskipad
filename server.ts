import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Filter lists & mock databases
interface AdFilterRule {
  id: string;
  pattern: string;
  type: 'network' | 'cosmetic' | 'scriptlet' | 'ssai_cue';
  target: 'youtube' | 'jiohotstar' | 'general';
  action: 'BLOCK' | 'FAST_FORWARD' | 'HIDE' | 'STRIP_TAG';
  description: string;
}

const DEFAULT_RULES: AdFilterRule[] = [
  {
    id: 'yt-net-1',
    pattern: '||googleads.g.doubleclick.net/pagead/ads^*',
    type: 'network',
    target: 'youtube',
    action: 'BLOCK',
    description: 'Blocks client-side VAST/VMAP ad tag queries on YouTube mobile web/app'
  },
  {
    id: 'yt-net-2',
    pattern: '||youtube.com/api/stats/ads^*',
    type: 'network',
    target: 'youtube',
    action: 'BLOCK',
    description: 'Prevents ad impression and telemetry pingback reporting'
  },
  {
    id: 'yt-script-1',
    pattern: 'youtube.com##+js(set-constant, ytInitialPlayerResponse.adPlacements, undefined)',
    type: 'scriptlet',
    target: 'youtube',
    action: 'FAST_FORWARD',
    description: 'Brave defuser scriptlet: wipes ad placement array before player initializes'
  },
  {
    id: 'yt-script-2',
    pattern: 'youtube.com##+js(yt-quick-skip)',
    type: 'scriptlet',
    target: 'youtube',
    action: 'FAST_FORWARD',
    description: 'Brave media skipper: hooks video.playbackRate=16 & muting when .ad-showing is active'
  },
  {
    id: 'yt-cosm-1',
    pattern: 'youtube.com##.ytp-ad-module, .ytp-ad-overlay-container, .ytp-ad-text',
    type: 'cosmetic',
    target: 'youtube',
    action: 'HIDE',
    description: 'Cosmetic filter: CSS display:none !important on ad banner overlays'
  },
  {
    id: 'hotstar-net-1',
    pattern: '||hotstar.com/ad-service/v2/ads^*',
    type: 'network',
    target: 'jiohotstar',
    action: 'BLOCK',
    description: 'Blocks JioHotstar CSAI preroll/midroll dynamic ad decision server'
  },
  {
    id: 'hotstar-ssai-1',
    pattern: '#EXT-X-CUE-OUT:*',
    type: 'ssai_cue',
    target: 'jiohotstar',
    action: 'STRIP_TAG',
    description: 'Backend HLS rewriter: removes ad commercial breaks stitched into live cricket / video feeds'
  },
  {
    id: 'hotstar-ssai-2',
    pattern: '||hotstar-ad-akamai.akamaized.net/segments/*.ts',
    type: 'network',
    target: 'jiohotstar',
    action: 'BLOCK',
    description: 'Blocks dedicated ad CDN segment chunk downloads'
  }
];

export async function createExpressApp() {
  const app = express();
  app.use(express.json());

  // Allow CORS so Bubblewrap and external tools can fetch manifest and resources
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Explicit Manifest Endpoints
  const manifestPath = path.resolve(__dirname, 'public', 'manifest.json');
  app.get(['/manifest.json', '/manifest.webmanifest'], (req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.sendFile(manifestPath);
  });

  // Serve static public assets explicitly
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get active rule database
  app.get('/api/rules', (req, res) => {
    const { target } = req.query;
    if (target && target !== 'all') {
      return res.json(DEFAULT_RULES.filter(r => r.target === target));
    }
    res.json(DEFAULT_RULES);
  });

  // Test URL against compiled network rules
  app.post('/api/rules/test-url', (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    const startTime = performance.now();
    let matchedRule: AdFilterRule | null = null;

    // Simple rule-matcher simulation matching EasyList syntax
    for (const rule of DEFAULT_RULES.filter(r => r.type === 'network')) {
      const cleanPattern = rule.pattern
        .replace(/^\|\|/, '')
        .replace(/\^.*/, '')
        .replace(/\*.*/, '');
      
      if (url.includes(cleanPattern)) {
        matchedRule = rule;
        break;
      }
    }

    const elapsedMs = Number((performance.now() - startTime).toFixed(3));

    res.json({
      url,
      matched: !!matchedRule,
      action: matchedRule ? matchedRule.action : 'ALLOW',
      rule: matchedRule,
      latencyMs: elapsedMs,
      blockedBy: matchedRule ? 'Brave Shield / VpnService Engine' : null
    });
  });

  // HLS Manifest Sanitizer Simulation (Backend Proxy Model for JioHotstar / YouTube streams)
  app.post('/api/sanitize-manifest', (req, res) => {
    const { manifestContent, stripSSAI = true } = req.body;

    const sample = manifestContent || `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:6
#EXT-X-MEDIA-SEQUENCE:1024
#EXTINF:6.000,
content_chunk_1024.ts
#EXTINF:6.000,
content_chunk_1025.ts
#EXT-X-CUE-OUT:DURATION=15.0
#EXT-X-DISCONTINUITY
#EXTINF:5.000,
hotstar_ad_preroll_sponsored_01.ts
#EXTINF:5.000,
hotstar_ad_preroll_sponsored_02.ts
#EXTINF:5.000,
hotstar_ad_preroll_sponsored_03.ts
#EXT-X-DISCONTINUITY
#EXT-X-CUE-IN
#EXTINF:6.000,
content_chunk_1026.ts
#EXTINF:6.000,
content_chunk_1027.ts`;

    const lines = sample.split('\n');
    const sanitizedLines: string[] = [];
    let insideAdBreak = false;
    let strippedAdSegments = 0;
    let strippedTags = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (stripSSAI) {
        if (trimmed.startsWith('#EXT-X-CUE-OUT') || trimmed.includes('EXT-OATCLS-SCTE35')) {
          insideAdBreak = true;
          strippedTags++;
          continue; // Strip cue-out
        }

        if (trimmed.startsWith('#EXT-X-CUE-IN')) {
          insideAdBreak = false;
          strippedTags++;
          continue; // Strip cue-in
        }

        if (insideAdBreak) {
          if (trimmed.startsWith('#EXTINF') || trimmed.endsWith('.ts') || trimmed.includes('ad_') || trimmed.includes('sponsored')) {
            strippedAdSegments++;
            continue;
          }
          if (trimmed.startsWith('#EXT-X-DISCONTINUITY')) {
            strippedTags++;
            continue;
          }
        }
      }

      sanitizedLines.push(line);
    }

    res.json({
      originalLength: lines.length,
      sanitizedLength: sanitizedLines.length,
      strippedAdSegments,
      strippedTags,
      savedDurationSec: strippedAdSegments * 5,
      sanitizedManifest: sanitizedLines.join('\n'),
      originalManifest: sample
    });
  });

  // Code blueprints generator for mobile architectures
  app.get('/api/blueprints/:tech', (req, res) => {
    const tech = req.params.tech;

    if (tech === 'accessibility') {
      return res.json({
        title: 'Android Accessibility Service (Native App Auto-Skipper)',
        language: 'kotlin',
        scope: 'Native Apps (YouTube, JioHotstar, Twitch)',
        worksOn: 'Android 7.0 - 15+ (No Root Needed)',
        summary: 'Monitors window hierarchy changes in background, searches for "Skip Ad" button IDs and text, performs ACTION_CLICK, and mutes AudioManager when unskippable ads play.',
        code: `// AdSkipAccessibilityService.kt
package com.adshield.autoskip

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.media.AudioManager
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class AdSkipAccessibilityService : AccessibilityService() {

    private lateinit var audioManager: AudioManager
    private var isAdMuted = false

    override fun onServiceConnected() {
        super.onServiceConnected()
        audioManager = getSystemService(AUDIO_SERVICE) as AudioManager
        serviceInfo = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED or
                         AccessibilityEvent.TYPE_VIEW_CLICKED or
                         AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS or
                    AccessibilityServiceInfo.FLAG_RETRIEVE_INTERACTIVE_WINDOWS
            packageNames = arrayOf(
                "com.google.android.youtube",
                "in.startv.hotstar",
                "com.jio.media.ondemand"
            )
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        val rootNode = rootInActiveWindow ?: return

        // 1. Check for skippable ad button (YouTube & Hotstar)
        val skipButtons = rootNode.findAccessibilityNodeInfosByViewId(
            "com.google.android.youtube:id/skip_ad_button"
        )
        if (skipButtons.isNotEmpty()) {
            for (node in skipButtons) {
                if (node.isClickable && node.isEnabled) {
                    node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                    unmuteAudio()
                    return
                }
            }
        }

        // 2. Text-based heuristic search ("Skip Ad", "Skip in 5s", "Skip")
        val skipTextNodes = rootNode.findAccessibilityNodeInfosByText("Skip")
        for (node in skipTextNodes) {
            val text = node.text?.toString() ?: ""
            if (text.contains("Skip Ad", ignoreCase = true) || text.equals("Skip", ignoreCase = true)) {
                findClickableParentAndClick(node)
                unmuteAudio()
                return
            }
        }

        // 3. Detect Unskippable Ads: mute system stream until ad finishes
        val adBadgeNodes = rootNode.findAccessibilityNodeInfosByText("Ad ·")
        if (adBadgeNodes.isNotEmpty() || rootNode.findAccessibilityNodeInfosByText("Ad").isNotEmpty()) {
            muteAudioDuringUnskippableAd()
        } else if (isAdMuted) {
            unmuteAudio()
        }
    }

    private fun findClickableParentAndClick(node: AccessibilityNodeInfo) {
        var current: AccessibilityNodeInfo? = node
        while (current != null) {
            if (current.isClickable) {
                current.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                return
            }
            current = current.parent
        }
    }

    private fun muteAudioDuringUnskippableAd() {
        if (!isAdMuted) {
            audioManager.adjustStreamVolume(AudioManager.STREAM_MUSIC, AudioManager.ADJUST_MUTE, 0)
            isAdMuted = true
        }
    }

    private fun unmuteAudio() {
        if (isAdMuted) {
            audioManager.adjustStreamVolume(AudioManager.STREAM_MUSIC, AudioManager.ADJUST_UNMUTE, 0)
            isAdMuted = false
        }
    }

    override fun onInterrupt() {
        unmuteAudio()
    }
}`
      });
    }

    if (tech === 'brave-scriptlet') {
      return res.json({
        title: 'Brave Shield DOM & Video Scriptlet (Speed-Jump & Defuser)',
        language: 'javascript',
        scope: 'Web, Chromium WebViews, GeckoView Mobile Browsers',
        worksOn: 'All platforms (YouTube Web, Hotstar Web, Desktop/Mobile)',
        summary: 'How Brave Browser handles unskippable ads: 1) Sets video.playbackRate = 16.0, 2) video.muted = true, 3) jumps video.currentTime to duration, 4) triggers native skip button clicks, and 5) defuses ytInitialPlayerResponse ad config.',
        code: `// brave-shield-youtube-fastforward.user.js
// Injected into execution context at document-start before player scripts load

(function() {
  'use strict';

  // 1. Defuse ad placements in YouTube player configuration
  const defuseAdPlacements = (obj) => {
    if (!obj) return;
    if (obj.adPlacements) obj.adPlacements = [];
    if (obj.playerAds) obj.playerAds = [];
    if (obj.adSlots) obj.adSlots = [];
  };

  if (window.ytInitialPlayerResponse) {
    defuseAdPlacements(window.ytInitialPlayerResponse);
  }

  // Trap ytInitialPlayerResponse assignments
  let initialResponse = window.ytInitialPlayerResponse;
  Object.defineProperty(window, 'ytInitialPlayerResponse', {
    get() { return initialResponse; },
    set(val) {
      defuseAdPlacements(val);
      initialResponse = val;
    },
    configurable: true
  });

  // 2. High-frequency Video Fast-Forward Engine for Unskippable Ads
  const adBypassLoop = () => {
    const player = document.querySelector('#movie_player, .html5-video-player');
    const video = document.querySelector('video');

    if (!video) return;

    // Detect if YouTube has placed player into Ad mode
    const isAdShowing = player?.classList.contains('ad-showing') ||
                        document.querySelector('.ytp-ad-player-overlay') !== null;

    if (isAdShowing) {
      // Unskippable 15s/30s ad bypass:
      // Mute audio so user hears no ad blast
      video.muted = true;
      // Max out playback rate (16x is Chrome/Brave limit)
      video.playbackRate = 16.0;

      // Instantly jump to end of ad segment if duration is valid
      if (isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration - 0.05;
      }

      // Automatically trigger skip button if rendered
      const skipBtn = document.querySelector(
        '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button'
      );
      if (skipBtn) {
        skipBtn.click();
      }
    }
  };

  // Run on requestAnimationFrame or 50ms interval
  setInterval(adBypassLoop, 50);

  // 3. Cosmetic filter rule: instantly hide banners & overlays
  const style = document.createElement('style');
  style.textContent = \`
    .ytp-ad-overlay-container,
    .ytp-ad-message-container,
    ytd-banner-promo-renderer,
    ytd-ad-slot-renderer {
      display: none !important;
    }
  \`;
  document.documentElement.appendChild(style);
})();`
      });
    }

    if (tech === 'vpn-dns') {
      return res.json({
        title: 'Android VpnService Local DNS Sinkhole (AdGuard/Blokada style)',
        language: 'kotlin',
        scope: 'OS-wide Network (Background daemon)',
        worksOn: 'Android 5.0+ (No Root, System VPN Slot)',
        summary: 'Establishes a local TUN virtual interface, parses outgoing UDP/TCP port 53 DNS queries, checks against local blocklists, and responds with 0.0.0.0 for ad servers.',
        code: `// AdBlockVpnService.kt
package com.adshield.vpn

import android.net.VpnService
import android.os.ParcelFileDescriptor
import java.io.FileInputStream
import java.io.FileOutputStream
import java.net.InetAddress
import java.nio.ByteBuffer

class AdBlockVpnService : VpnService() {

    private var vpnInterface: ParcelFileDescriptor? = null
    private val blockedDomains = setOf(
        "googleads.g.doubleclick.net",
        "pagead2.googlesyndication.com",
        "pubads.g.doubleclick.net",
        "ad.doubleclick.net",
        "hotstar.ad-service.com"
    )

    override fun onStartCommand(intent: android.content.Intent?, flags: Int, startId: Int): Int {
        val builder = Builder()
            .setSession("AdShieldDNS")
            .addAddress("10.0.0.2", 32)
            .addDnsServer("10.0.0.2") // Route DNS queries into our local TUN
            .addRoute("0.0.0.0", 0)

        vpnInterface = builder.establish()
        Thread { runDnsWorker() }.start()
        return START_STICKY
    }

    private fun runDnsWorker() {
        val descriptor = vpnInterface?.fileDescriptor ?: return
        val inputStream = FileInputStream(descriptor)
        val outputStream = FileOutputStream(descriptor)
        val packet = ByteBuffer.allocate(32767)

        while (!Thread.interrupted()) {
            val length = inputStream.read(packet.array())
            if (length > 0) {
                // Parse IP header & UDP packet on Port 53 (DNS)
                val domain = extractDomainFromDnsQuery(packet, length)
                if (domain != null && isBlocked(domain)) {
                    // Craft DNS Response pointing to 0.0.0.0 (Sinkhole)
                    val sinkholeResponse = buildSinkholeDnsResponse(packet, domain)
                    outputStream.write(sinkholeResponse)
                } else {
                    // Forward legitimate query to upstream DNS (e.g., 1.1.1.1)
                    forwardToUpstream(packet, length, outputStream)
                }
                packet.clear()
            }
        }
    }

    private fun isBlocked(domain: String): Boolean {
        return blockedDomains.any { domain.endsWith(it) }
    }

    private fun extractDomainFromDnsQuery(packet: ByteBuffer, len: Int): String? {
        // Wire format DNS parsing logic
        return "googleads.g.doubleclick.net" // illustrative
    }

    private fun buildSinkholeDnsResponse(query: ByteBuffer, domain: String): ByteArray {
        // Return RFC1035 NXDOMAIN or A record = 0.0.0.0
        return ByteArray(64)
    }

    private fun forwardToUpstream(packet: ByteBuffer, len: Int, out: FileOutputStream) {
        // Forward standard traffic
    }
}`
      });
    }

    return res.status(404).json({ error: 'Tech blueprint not found' });
  });

  return app;
}

async function startServer() {
  const app = await createExpressApp();
  const PORT = Number(process.env.PORT) || 3000;

  // Mount Vite middleware for dev or serve dist in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { port: 3000 },
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
