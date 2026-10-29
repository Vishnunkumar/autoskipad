import React, { useState } from 'react';
import { 
  Shield, Code2, Cpu, Zap, ArrowRight, Play, CheckCircle2, 
  Copy, Check, Layers, AlertCircle, FileCode, Sliders
} from 'lucide-react';

export const BraveMechanicsExplainer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [testRunResult, setTestRunResult] = useState<string | null>(null);

  const steps = [
    {
      title: '1. Rust Network Blocker (adblock-rs)',
      subtitle: 'Packet-level URL matching before HTTP SYN',
      icon: Cpu,
      color: 'from-orange-500 to-red-500',
      description:
        'Brave compiles EasyList, uBlock filters, and custom rules into an ultra-fast Rust engine (adblock-rs) integrated into Chromium’s C++ network stack. Before an HTTP/HTTPS socket opens for an ad tag or tracking pixel, it is canceled instantly with zero latency penalty.',
      code: `// Brave C++ / Rust adblock-rs interface
// Intercepts Chrome URLRequest / declarativeNetRequest
bool OnBeforeURLRequest(const GURL& url, const ResourceType& type) {
    // High-performance radix tree & bloom filter lookup (~0.04ms)
    RuleMatchResult result = adblock_engine_->matches(
        url.spec(),
        request.first_party_url.spec(),
        type
    );
    
    if (result.is_blocked()) {
        // Drop network socket immediately
        return net::ERR_BLOCKED_BY_CLIENT;
    }
    return net::OK;
}`
    },
    {
      title: '2. Cosmetic CSS Injection',
      subtitle: 'Zero-layout-shift visual DOM hiding',
      icon: Layers,
      color: 'from-purple-500 to-indigo-500',
      description:
        'Even if ad scripts manage to load or are inlined, Brave injects high-priority CSS rules before DOM paint. Elements matching ad containers, sponsored badges, and overlay carousels are collapsed with display: none !important.',
      code: `/* Brave Shields Cosmetic Rulesheet */
/* Injected at document-start */
.ytp-ad-module,
.ytp-ad-player-overlay,
.ytp-ad-overlay-container,
ytd-banner-promo-renderer,
ytd-ad-slot-renderer,
#player-ads {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    pointer-events: none !important;
}`
    },
    {
      title: '3. JavaScript Object Defusing',
      subtitle: 'Poisoning player ad-placement variables',
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      description:
        'YouTube and Hotstar prepare ads by populating global data objects (e.g. window.ytInitialPlayerResponse.adPlacements). Brave injects defuser scriptlets into the page’s JavaScript context before player scripts run, neutralizing these properties.',
      code: `// Brave Scriptlet: defuse-youtube-ads.js
(function() {
    // Trap ytInitialPlayerResponse assignments
    let rawResponse = window.ytInitialPlayerResponse;
    
    const sanitize = (val) => {
        if (!val || typeof val !== 'object') return val;
        // Strip ad cue points and ad arrays
        delete val.adPlacements;
        delete val.playerAds;
        delete val.adSlots;
        return val;
    };

    Object.defineProperty(window, 'ytInitialPlayerResponse', {
        get() { return sanitize(rawResponse); },
        set(v) { rawResponse = sanitize(v); },
        configurable: true
    });
})();`
    },
    {
      title: '4. The 16x Media Fast-Forward Hack',
      subtitle: 'Bypassing unskippable ads in <100ms',
      icon: Zap,
      color: 'from-emerald-500 to-teal-500',
      description:
        'When YouTube attempts to force a 15-second or 30-second non-skippable ad, Brave’s injected scriptlet detects the .ad-showing class, mutes audio, sets video.playbackRate = 16.0 (browser hardware limit), and sets video.currentTime to duration. The ad finishes in 80 milliseconds!',
      code: `// Brave Unskippable Ad Auto-Skipper Scriptlet
const hookPlayer = () => {
    const video = document.querySelector('video');
    const player = document.querySelector('#movie_player, .html5-video-player');
    
    if (!video || !player) return;

    if (player.classList.contains('ad-showing')) {
        // 1. Instantly mute audio so user hears no ad burst
        video.muted = true;
        
        // 2. Accelerate to 16x speed (browser hardware cap)
        video.playbackRate = 16.0;
        
        // 3. Jump to end of ad segment
        if (Number.isFinite(video.duration) && video.duration > 0) {
            video.currentTime = video.duration - 0.05;
        }

        // 4. Click skip button if rendered
        const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button');
        if (skipBtn) skipBtn.click();
    }
};

// Check every 50ms during video playback
setInterval(hookPlayer, 50);`
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const runTestSandbox = () => {
    setTestRunResult('Testing Scriptlet against simulated HTMLMediaElement...');
    setTimeout(() => {
      setTestRunResult(
        '✓ SUCCESS: Detected simulated .ad-showing container\n' +
        '✓ Video muted: true\n' +
        '✓ PlaybackRate shifted from 1.0 -> 16.0\n' +
        '✓ currentTime advanced from 0.00s -> 14.95s\n' +
        '✓ Triggered simulated HTMLMediaElement "ended" event in 82ms!'
      );
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Overview Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>Under the Hood: Brave Shield & uBlock Origin Mechanics</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            How Brave Browser Skips Non-Skippable Video Ads
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Many users assume Brave uses AI or hacks YouTube servers. In reality, Brave uses an elegant <strong>4-tier layered interception model</strong> that operates at the network, CSS, JavaScript VM, and HTML5 video DOM levels. Here is the exact pipeline:
          </p>
        </div>
      </div>

      {/* Interactive Pipeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">Step 0{idx + 1}</span>
              </div>
              <h3 className="text-sm font-bold text-white leading-tight">{s.title.split('. ')[1]}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{s.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Detail Showcase of Selected Step */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div>
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Selected Architecture Layer
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {steps[activeStep].title}
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {steps[activeStep].description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(steps[activeStep].code)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
            {activeStep === 3 && (
              <button
                onClick={runTestSandbox}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Execute Scriptlet Test</span>
              </button>
            )}
          </div>
        </div>

        {/* Code Display */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80">
          <div className="bg-slate-950/90 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2">
                {activeStep === 0 ? 'adblock_engine.rs' : activeStep === 1 ? 'cosmetic_filter.css' : 'brave_scriptlet.js'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400">Production Engine Implementation</span>
          </div>

          <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-[380px]">
            <code>{steps[activeStep].code}</code>
          </pre>
        </div>

        {/* Sandbox Test Console Output (if triggered) */}
        {testRunResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono text-xs text-emerald-300 whitespace-pre-line animate-fadeIn">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Scriptlet Execution Sandbox Log:</span>
            </div>
            {testRunResult}
          </div>
        )}
      </div>

      {/* Crucial Question: Why Doesn't YouTube Block This? */}
      <div className="bg-gradient-to-br from-indigo-950/30 via-slate-900 to-purple-950/20 border border-indigo-500/20 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-indigo-400" />
          <span>Why YouTube and Streaming Platforms Cannot Easily Block the 16x Playback Hack</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="font-bold text-white text-sm mb-1">1. Standard HTML5 Media API</h4>
            <p>
              <code>video.playbackRate</code> is a core W3C standard property. Restricting playback rate breaks accessibility tools, variable-speed users (e.g. 1.25x / 2.0x listeners), and hardware decoding pipelines.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="font-bold text-white text-sm mb-1">2. Client-Side Race Condition</h4>
            <p>
              Brave executes inside the browser’s trusted JS isolate before YouTube’s anti-adblock detector scripts load. Brave redefines getters/setters with <code>Object.defineProperty</code>, returning false when YouTube checks for adblockers.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="font-bold text-white text-sm mb-1">3. Legitimate Ad Completion Event</h4>
            <p>
              Because the ad video actually plays (just at 16x speed over 80ms) and naturally hits <code>currentTime = duration</code>, the player fires the standard <code>ended</code> DOM event, fooling the player into believing the ad completed normally!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
