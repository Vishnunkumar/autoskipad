import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, FastForward, Volume2, VolumeX, 
  ShieldCheck, AlertTriangle, Cpu, Terminal, CheckCircle2, 
  Smartphone, MousePointer, Filter, Sparkles, Layers
} from 'lucide-react';

export type BypassMode = 'brave-fastforward' | 'accessibility-service' | 'vpn-dns' | 'disabled';
export type AppPreset = 'youtube' | 'jiohotstar';
export type AdType = 'unskippable-15s' | 'skippable-5s' | 'bumper-6s' | 'ssai-stream';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'success' | 'action';
  message: string;
}

export const PlayerSimulator: React.FC = () => {
  const [appPreset, setAppPreset] = useState<AppPreset>('youtube');
  const [bypassMode, setBypassMode] = useState<BypassMode>('brave-fastforward');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isMutedByEngine, setIsMutedByEngine] = useState<boolean>(false);
  
  // Video state
  const [currentSegment, setCurrentSegment] = useState<'content' | 'ad'>('content');
  const [selectedAdType, setSelectedAdType] = useState<AdType>('unskippable-15s');
  const [playbackTime, setPlaybackTime] = useState<number>(12); // seconds
  const [adDuration, setAdDuration] = useState<number>(15);
  const [adTimeRemaining, setAdTimeRemaining] = useState<number>(15);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [canSkipManually, setCanSkipManually] = useState<boolean>(false);
  
  // Metrics & Stats
  const [totalAdsBlocked, setTotalAdsBlocked] = useState<number>(3);
  const [totalSecondsSaved, setTotalSecondsSaved] = useState<number>(45);
  const [lastBypassTimeMs, setLastBypassTimeMs] = useState<number>(78);

  // Animation frame & Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Real-time logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '11:00:01',
      level: 'info',
      message: 'AdShield Engine initialized. Monitoring media DOM & network hooks.'
    },
    {
      id: '2',
      timestamp: '11:00:02',
      level: 'info',
      message: 'Attached mutation observers for [class*="ad-showing"] & HTMLMediaElement.prototype'
    }
  ]);

  const addLog = (level: LogEntry['level'], message: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    setLogs((prev) => [{ id: Math.random().toString(), timestamp: timeStr, level, message }, ...prev.slice(0, 40)]);
  };

  // Sound synthesis to demonstrate auto-mute
  useEffect(() => {
    if (!soundEnabled) {
      if (gainNodeRef.current) gainNodeRef.current.gain.value = 0;
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.value = isMutedByEngine ? 0 : 0.05;
        gainNode.connect(audioCtxRef.current.destination);
        gainNodeRef.current = gainNode;

        const osc = audioCtxRef.current.createOscillator();
        osc.type = currentSegment === 'ad' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(currentSegment === 'ad' ? 440 : 220, audioCtxRef.current.currentTime);
        osc.connect(gainNode);
        osc.start();
        oscillatorRef.current = osc;
      } else {
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.value = isMutedByEngine ? 0 : 0.05;
        }
        if (oscillatorRef.current && audioCtxRef.current) {
          oscillatorRef.current.type = currentSegment === 'ad' ? 'sawtooth' : 'sine';
          oscillatorRef.current.frequency.setValueAtTime(
            currentSegment === 'ad' ? 520 : 260,
            audioCtxRef.current.currentTime
          );
        }
      }
    } catch {
      // AudioContext fallback
    }

    return () => {
      // Cleanup on unmount handled gracefully
    };
  }, [soundEnabled, isMutedByEngine, currentSegment]);

  // Main canvas animation loop (draws animated video scenes)
  useEffect(() => {
    let animationId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      if (currentSegment === 'content') {
        // Draw Main Content Scene
        if (appPreset === 'youtube') {
          // Cyberpunk/Travel Document Scene
          const grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.5, '#1e1b4b');
          grad.addColorStop(1, '#312e81');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Animated mountains & sun
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.arc(w / 2, h / 2 - 20, 60 + Math.sin(frame * 0.05) * 5, 0, Math.PI * 2);
          ctx.fill();

          // Cyber grid
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 1;
          for (let i = 0; i < w; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, h / 2 + 30);
            ctx.lineTo((i - w / 2) * 2 + w / 2, h);
            ctx.stroke();
          }

          // Content Title HUD
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('Exploring Neo Tokyo 4K HDR • Documentaries', 20, 35);
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(`Frame: ${frame} | Buffer: Healthy | Status: Normal Playback`, 20, 58);
        } else {
          // JioHotstar Cricket Live Scene
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, '#064e3b');
          grad.addColorStop(1, '#022c22');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Stadium lights & pitch
          ctx.fillStyle = '#d97706';
          ctx.fillRect(w / 2 - 30, h / 2 - 20, 60, 110);

          // Scoreboard Graphic
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.roundRect ? ctx.roundRect(20, 20, 260, 65, 8) : ctx.fillRect(20, 20, 260, 65);
          ctx.fill();

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('IND vs AUS • FINAL LIVE 🔴', 35, 42);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px "JetBrains Mono", monospace';
          ctx.fillText('186/3 (17.4 ov) • 8.6 RPO', 35, 68);
        }
      } else {
        // Draw Ad Scene
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#7f1d1d');
        grad.addColorStop(0.5, '#450a0a');
        grad.addColorStop(1, '#1c1917');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Flashy sponsor branding
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('⚡ MEGA BRAND INSURANCE ⚡', 40, h / 2 - 20);
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#fca5a5';
        ctx.fillText(
          selectedAdType === 'unskippable-15s'
            ? 'Forced Non-Skippable Commercial Break (15s)'
            : 'Sponsored Partner Spot',
          40,
          h / 2 + 10
        );

        // Progress bar for ad
        const progress = (adDuration - adTimeRemaining) / adDuration;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(40, h / 2 + 35, w - 80, 8);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(40, h / 2 + 35, (w - 80) * progress, 8);

        // Speed badge if fast forwarding
        if (playbackRate > 1.0) {
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 16px "JetBrains Mono", monospace';
          ctx.fillText(`⚡ WARP SPEED: ${playbackRate}x (Brave Hack Active)`, 40, h / 2 + 75);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [currentSegment, appPreset, selectedAdType, adDuration, adTimeRemaining, playbackRate]);

  // Trigger an Ad Break
  const triggerAd = (type: AdType = 'unskippable-15s') => {
    const dur = type === 'unskippable-15s' ? 15 : type === 'bumper-6s' ? 6 : 10;
    setSelectedAdType(type);
    setAdDuration(dur);
    setAdTimeRemaining(dur);
    setCurrentSegment('ad');
    setCanSkipManually(type === 'skippable-5s');

    addLog('warn', `Ad Placement Triggered: [${type.toUpperCase()}] Duration: ${dur}s.`);

    // If Bypass is active, execute strategy
    if (bypassMode === 'brave-fastforward') {
      executeBraveFastforward(dur);
    } else if (bypassMode === 'accessibility-service') {
      executeAccessibilityAutomation(dur, type);
    } else if (bypassMode === 'vpn-dns') {
      executeVpnDnsBlock();
    } else {
      addLog('info', 'Engine: Bypass Disabled. User subjected to standard playback delay.');
      setPlaybackRate(1.0);
      setIsMutedByEngine(false);
    }
  };

  // Strategy 1: Brave Browser DOM & Media Speed-up Hack
  const executeBraveFastforward = (dur: number) => {
    const startTime = performance.now();
    addLog('action', 'Brave Engine: Target element .ad-showing identified.');
    addLog('action', 'Brave Engine: Step 1 -> video.muted = true (Silence ad blast)');
    setIsMutedByEngine(true);

    addLog('action', 'Brave Engine: Step 2 -> video.playbackRate = 16.0 (Hardware max rate)');
    setPlaybackRate(16.0);

    // After 80ms, jump currentTime to duration and dispatch end event
    setTimeout(() => {
      addLog('action', `Brave Engine: Step 3 -> video.currentTime = ${dur - 0.05}s (Seek forward)`);
      addLog('action', 'Brave Engine: Step 4 -> Dispatch "ended" event & click .ytp-ad-skip-button');
      
      const elapsed = Number((performance.now() - startTime).toFixed(1));
      setLastBypassTimeMs(elapsed);
      setTotalAdsBlocked((prev) => prev + 1);
      setTotalSecondsSaved((prev) => prev + dur);

      // Return to content
      finishAd(`Bypassed in ${elapsed}ms via Brave 16x Playback Acceleration!`);
    }, 90);
  };

  // Strategy 2: Android Accessibility Service (UI Node Inspector + Click + Stream Mute)
  const executeAccessibilityAutomation = (dur: number, type: AdType) => {
    addLog('action', 'AccessibilityService: onAccessibilityEvent(TYPE_WINDOW_CONTENT_CHANGED)');
    addLog('action', 'AccessibilityService: Root window traversal for package ' + (appPreset === 'youtube' ? 'com.google.android.youtube' : 'in.startv.hotstar'));

    if (type === 'skippable-5s') {
      // Countdown for 5s then click
      addLog('info', 'AccessibilityService: Found "Skip in 5s" countdown timer node. Polling node tree.');
      setTimeout(() => {
        addLog('action', 'AccessibilityService: Node found: android.widget.Button [text="Skip Ad"]');
        addLog('success', 'AccessibilityService: performAction(AccessibilityNodeInfo.ACTION_CLICK) executed!');
        setTotalAdsBlocked((prev) => prev + 1);
        setTotalSecondsSaved((prev) => prev + (dur - 5));
        finishAd('Auto-clicked "Skip Ad" button via Android AccessibilityService!');
      }, 1200);
    } else {
      // Unskippable 15s ad! Accessibility CANNOT fast-forward native ExoPlayer video.
      addLog('warn', 'AccessibilityService Notice: Native ExoPlayer has no accessible seekbar in ad mode.');
      addLog('action', 'AccessibilityService Fallback: Muting AudioManager.STREAM_MUSIC to protect user ears.');
      setIsMutedByEngine(true);

      // Simulated fast finish or user wait
      setTimeout(() => {
        addLog('info', 'AccessibilityService: Ad node disappeared. Restoring AudioManager stream volume.');
        setIsMutedByEngine(false);
        setTotalAdsBlocked((prev) => prev + 1);
        setTotalSecondsSaved((prev) => prev + 15);
        finishAd('Muted audio during unskippable ad; resumed main program seamlessly.');
      }, 2500);
    }
  };

  // Strategy 3: Local VPN / DNS Sinkhole (AdGuard / Blokada style)
  const executeVpnDnsBlock = () => {
    addLog('action', 'VpnService (tun0): Intercepted UDP packet dst=53 (DNS Query)');
    addLog('action', 'VpnService: Query domain: "googleads.g.doubleclick.net"');
    addLog('success', 'VpnService: Rule Match! Returned Sinkhole A-Record 0.0.0.0 (TTL 0)');
    addLog('info', 'Player: Ad request failed (NET::ERR_CONNECTION_REFUSED). Player skips fallback.');
    
    setTotalAdsBlocked((prev) => prev + 1);
    setTotalSecondsSaved((prev) => prev + 15);
    setLastBypassTimeMs(12);

    setTimeout(() => {
      finishAd('Ad socket dropped by Local VpnService DNS Sinkhole before buffer loaded!');
    }, 150);
  };

  const finishAd = (summaryMsg: string) => {
    setCurrentSegment('content');
    setPlaybackRate(1.0);
    setIsMutedByEngine(false);
    setAdTimeRemaining(0);
    addLog('success', summaryMsg);
  };

  // Timer loop for normal playback and unbypassed ads
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (currentSegment === 'content') {
        setPlaybackTime((prev) => prev + 1);
      } else {
        // In ad mode without instant bypass
        if (bypassMode === 'disabled') {
          setAdTimeRemaining((prev) => {
            if (prev <= 1) {
              finishAd('Commercial ended after full playback duration.');
              return 0;
            }
            if (prev <= 10 && selectedAdType === 'skippable-5s') {
              setCanSkipManually(true);
            }
            return prev - 1;
          });
        }
      }
    }, 1000 / (playbackRate || 1));

    return () => clearInterval(interval);
  }, [isPlaying, currentSegment, bypassMode, playbackRate, selectedAdType]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Concept Pill */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Real-time Execution Engine & Sandbox</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Interactive Ad-Bypass & Fast-Forward Simulator
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Experience firsthand how <strong>Brave Browser</strong> bypasses unskippable ads in ~80ms using DOM scriptlets, versus how <strong>Android Accessibility Services</strong> and <strong>Local VPNs</strong> operate inside native mobile operating systems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-2 rounded-xl text-center min-w-[90px]">
              <span className="block text-xs text-slate-400">Ads Defused</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{totalAdsBlocked}</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-2 rounded-xl text-center min-w-[90px]">
              <span className="block text-xs text-slate-400">Time Saved</span>
              <span className="text-lg font-bold text-indigo-400 font-mono">{totalSecondsSaved}s</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 px-3 py-2 rounded-xl text-center min-w-[90px]">
              <span className="block text-xs text-slate-400">Skip Latency</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">{lastBypassTimeMs}ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Player on Left, Control Rack & Engine on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Simulated Mobile Screen & Video Player */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Phone/Device Header Bar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-300">
                  {appPreset === 'youtube' ? 'YouTube Android / Web Player' : 'JioHotstar Sports VOD / Live'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {currentSegment === 'content' ? 'STREAMING' : 'AD_INTERCEPT'}
                </span>
              </div>

              {/* Preset Selector */}
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => { setAppPreset('youtube'); addLog('info', 'Switched preset to YouTube (InnerTube / CSAI Player)'); }}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                    appPreset === 'youtube'
                      ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  YouTube
                </button>
                <button
                  onClick={() => { setAppPreset('jiohotstar'); addLog('info', 'Switched preset to JioHotstar (SSAI Cricket Live)'); }}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                    appPreset === 'jiohotstar'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  JioHotstar
                </button>
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="relative aspect-video bg-black overflow-hidden group">
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="w-full h-full object-cover"
              />

              {/* Overlay: Accessibility Service Inspector Bounding Boxes */}
              {bypassMode === 'accessibility-service' && currentSegment === 'ad' && (
                <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/60 bg-emerald-500/5">
                  <div className="absolute top-2 left-2 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono px-2 py-1 rounded shadow">
                    [AccessibilityService] Node: FrameLayout#ad-overlay
                  </div>
                  {canSkipManually && (
                    <div className="absolute bottom-6 right-6 border-2 border-dashed border-yellow-400 bg-yellow-400/20 p-2 rounded flex items-center space-x-1 animate-pulse">
                      <MousePointer className="w-4 h-4 text-yellow-300" />
                      <span className="text-[11px] font-mono font-bold text-yellow-200">
                        TARGET: performAction(ACTION_CLICK)
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Status Badge Over Video */}
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                {isMutedByEngine && (
                  <span className="flex items-center space-x-1 px-2 py-1 rounded bg-red-950/90 border border-red-500/40 text-red-300 text-xs font-mono">
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>AUDIO MUTED BY SHIELD</span>
                  </span>
                )}
                {playbackRate > 1 && (
                  <span className="flex items-center space-x-1 px-2 py-1 rounded bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 text-xs font-mono animate-bounce">
                    <FastForward className="w-3.5 h-3.5" />
                    <span>{playbackRate}x SPEED-WARP</span>
                  </span>
                )}
              </div>

              {/* Skip Button (Simulated Native Overlay) */}
              {currentSegment === 'ad' && (
                <div className="absolute bottom-4 right-4 z-20">
                  {canSkipManually ? (
                    <button
                      onClick={() => finishAd('User manually clicked skip button.')}
                      className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-xl cursor-pointer transition"
                    >
                      <span>Skip Ad</span>
                      <FastForward className="w-4 h-4 text-indigo-400" />
                    </button>
                  ) : (
                    <div className="bg-black/80 backdrop-blur border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono">
                      {selectedAdType === 'unskippable-15s' ? (
                        <span>Video will play after ad • {adTimeRemaining}s</span>
                      ) : (
                        <span>Skip in {adTimeRemaining > 10 ? adTimeRemaining - 10 : 0}s</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <div className="text-xs font-mono text-slate-300">
                  {currentSegment === 'content' ? (
                    <span>00:{String(playbackTime).padStart(2, '0')} / 12:45</span>
                  ) : (
                    <span className="text-amber-400 font-bold">
                      AD: 00:{String(adDuration - adTimeRemaining).padStart(2, '0')} / 00:{String(adDuration).padStart(2, '0')}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition ${
                    soundEnabled
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                  title="Enable test audio oscillator to hear auto-mute"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{soundEnabled ? (isMutedByEngine ? 'Muted by Shield' : 'Audio On') : 'Test Audio'}</span>
                </button>
              </div>

              {/* Force Trigger Ad Button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => triggerAd(selectedAdType)}
                  disabled={currentSegment === 'ad'}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer ${
                    currentSegment === 'ad'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Simulate Ad Insertion</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ad Type Selector Pills */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-400 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simulated Ad Format:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'unskippable-15s', label: '15s Non-Skippable Ad', color: 'text-red-400' },
                { id: 'bumper-6s', label: '6s Forced Bumper', color: 'text-amber-400' },
                { id: 'skippable-5s', label: '5s Skippable Pre-Roll', color: 'text-emerald-400' },
                { id: 'ssai-stream', label: 'SSAI Cricket Midroll', color: 'text-blue-400' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => {
                    setSelectedAdType(fmt.id as AdType);
                    addLog('info', `Selected ad format: ${fmt.label}`);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition ${
                    selectedAdType === fmt.id
                      ? 'bg-slate-800 text-white border border-slate-600 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className={fmt.color}>●</span> {fmt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Engine Selector & Execution Telemetry Console */}
        <div className="lg:col-span-5 space-y-4">
          {/* Engine Selector Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2 mb-3">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Select Active Bypass Architecture</span>
            </h3>

            <div className="space-y-2.5">
              {/* Option 1: Brave Shield Fast-Forward */}
              <label
                onClick={() => {
                  setBypassMode('brave-fastforward');
                  addLog('info', 'Active Engine: Brave Shield DOM + 16x Media Fast-Forward');
                }}
                className={`flex items-start p-3 rounded-xl border transition cursor-pointer ${
                  bypassMode === 'brave-fastforward'
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="bypass-engine"
                  checked={bypassMode === 'brave-fastforward'}
                  onChange={() => {}}
                  className="mt-1 mr-3 text-indigo-500 focus:ring-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">Brave Shield DOM Scriptlet</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                      Fastest (~80ms)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Forces <code>video.playbackRate = 16</code>, mutes audio, jumps <code>currentTime = duration</code>, and suppresses player ad-tracking events.
                  </p>
                </div>
              </label>

              {/* Option 2: Android Accessibility Service */}
              <label
                onClick={() => {
                  setBypassMode('accessibility-service');
                  addLog('info', 'Active Engine: Android AccessibilityService UI Node Clicker');
                }}
                className={`flex items-start p-3 rounded-xl border transition cursor-pointer ${
                  bypassMode === 'accessibility-service'
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="bypass-engine"
                  checked={bypassMode === 'accessibility-service'}
                  onChange={() => {}}
                  className="mt-1 mr-3 text-emerald-500 focus:ring-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">Android Accessibility Service</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      Native Apps
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Scans native view hierarchy, clicks <code>ACTION_CLICK</code> on "Skip Ad" buttons. For non-skippable ads, mutes system audio volume.
                  </p>
                </div>
              </label>

              {/* Option 3: Local VPN / DNS Sinkhole */}
              <label
                onClick={() => {
                  setBypassMode('vpn-dns');
                  addLog('info', 'Active Engine: Android VpnService (Local DNS Sinkhole)');
                }}
                className={`flex items-start p-3 rounded-xl border transition cursor-pointer ${
                  bypassMode === 'vpn-dns'
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="bypass-engine"
                  checked={bypassMode === 'vpn-dns'}
                  onChange={() => {}}
                  className="mt-1 mr-3 text-cyan-500 focus:ring-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">Local VPN / DNS Sinkhole</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      Network TUN
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Routes port 53 DNS requests through local Android VpnService. Returns <code>0.0.0.0</code> for known ad domains before video starts.
                  </p>
                </div>
              </label>

              {/* Option 4: Disabled */}
              <label
                onClick={() => {
                  setBypassMode('disabled');
                  addLog('warn', 'Active Engine: DISABLED. Standard ad experience.');
                }}
                className={`flex items-start p-3 rounded-xl border transition cursor-pointer ${
                  bypassMode === 'disabled'
                    ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="bypass-engine"
                  checked={bypassMode === 'disabled'}
                  onChange={() => {}}
                  className="mt-1 mr-3 text-rose-500 focus:ring-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">Bypass Disabled (Control Baseline)</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Simulates standard unskippable wait time (15s delay with full volume).
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Real-time Telemetry & Hook Logs */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-[320px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
              <div className="flex items-center space-x-2 text-slate-300 text-xs font-mono">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>ENGINE EXECUTION HOOK LOGS</span>
              </div>
              <button
                onClick={() => setLogs([])}
                className="text-[11px] text-slate-500 hover:text-slate-300 font-mono cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
              {logs.length === 0 ? (
                <div className="text-slate-600 italic py-4 text-center">No recent engine events.</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-2 leading-relaxed">
                    <span className="text-slate-500 text-[10px] whitespace-nowrap">{log.timestamp}</span>
                    <span
                      className={`text-[10px] px-1 rounded uppercase font-bold whitespace-nowrap ${
                        log.level === 'success'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : log.level === 'action'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/50'
                          : log.level === 'warn'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span
                      className={`break-words ${
                        log.level === 'success'
                          ? 'text-emerald-300 font-semibold'
                          : log.level === 'action'
                          ? 'text-indigo-200'
                          : log.level === 'warn'
                          ? 'text-amber-200'
                          : 'text-slate-300'
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
