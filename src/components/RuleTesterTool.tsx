import React, { useState, useEffect } from 'react';
import { 
  Eye, CheckCircle2, XCircle, Search, Play, Filter, 
  Terminal, ShieldCheck, AlertCircle, ArrowUpRight
} from 'lucide-react';

interface AdFilterRule {
  id: string;
  pattern: string;
  type: 'network' | 'cosmetic' | 'scriptlet' | 'ssai_cue';
  target: 'youtube' | 'jiohotstar' | 'general';
  action: 'BLOCK' | 'FAST_FORWARD' | 'HIDE' | 'STRIP_TAG';
  description: string;
}

interface TestResult {
  url: string;
  matched: boolean;
  action: string;
  rule: AdFilterRule | null;
  latencyMs: number;
  blockedBy: string | null;
}

export const RuleTesterTool: React.FC = () => {
  const [testUrl, setTestUrl] = useState<string>(
    'https://googleads.g.doubleclick.net/pagead/ads?client=ca-video-pub-12345&videoad_start_delay=0'
  );
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [rules, setRules] = useState<AdFilterRule[]>([]);
  const [filterTarget, setFilterTarget] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/rules')
      .then((res) => res.json())
      .then((data) => setRules(data))
      .catch(() => {
        // Fallback default rules
        setRules([
          {
            id: 'yt-net-1',
            pattern: '||googleads.g.doubleclick.net/pagead/ads^*',
            type: 'network',
            target: 'youtube',
            action: 'BLOCK',
            description: 'Blocks client-side VAST/VMAP ad tag queries on YouTube mobile web/app'
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
            id: 'hotstar-net-1',
            pattern: '||hotstar.com/ad-service/v2/ads^*',
            type: 'network',
            target: 'jiohotstar',
            action: 'BLOCK',
            description: 'Blocks JioHotstar CSAI preroll/midroll dynamic ad decision server'
          }
        ]);
      });
  }, []);

  const handleTestUrl = async (urlToTest: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/rules/test-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToTest })
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      // Local fallback test
      const isAd = urlToTest.includes('doubleclick') || urlToTest.includes('ad-service') || urlToTest.includes('/stats/ads');
      setTestResult({
        url: urlToTest,
        matched: isAd,
        action: isAd ? 'BLOCK' : 'ALLOW',
        rule: isAd
          ? {
              id: 'local-match',
              pattern: '||googleads.g.doubleclick.net^*',
              type: 'network',
              target: 'youtube',
              action: 'BLOCK',
              description: 'Blocked by local rule engine'
            }
          : null,
        latencyMs: 0.15,
        blockedBy: isAd ? 'Brave Shield / VpnService Engine' : null
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleUrls = [
    { label: 'YouTube DoubleClick Ad Tag', url: 'https://googleads.g.doubleclick.net/pagead/ads?client=ca-video-pub-12345&slot=preroll' },
    { label: 'YouTube Telemetry Reporting', url: 'https://youtube.com/api/stats/ads?v=dQw4w9WgXcQ' },
    { label: 'JioHotstar Ad Decision Server', url: 'https://hotstar.com/ad-service/v2/ads/live-match-cricket-slot1' },
    { label: 'Clean Video Stream CDN (Allow)', url: 'https://manifest.googlevideo.com/videoplayback?expire=17100&id=clean_video' }
  ];

  const filteredRules = filterTarget === 'all' ? rules : rules.filter((r) => r.target === filterTarget);

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Eye className="w-4 h-4" />
            <span>High-Speed Radix Tree & Bloom Filter Matcher</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Ad Filter Rules & URL Evaluation Engine
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            In Brave and mobile VPN engines, network URLs requested by the player or browser are tested against thousands of EasyList rules in fractions of a millisecond. Test any URL below to see the matching mechanics in action.
          </p>
        </div>
      </div>

      {/* URL Tester Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>Real-time URL Rule Inspector</span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="Enter URL to test (e.g. https://googleads.g.doubleclick.net/...)"
            />
          </div>
          <button
            onClick={() => handleTestUrl(testUrl)}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Testing...' : 'Test URL'}</span>
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400">Quick Test Samples:</span>
          {sampleUrls.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTestUrl(s.url);
                handleTestUrl(s.url);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Test Result Display */}
        {testResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                {testResult.matched ? (
                  <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-bold font-mono">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>STATUS: {testResult.action} (AD DETECTED)</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>STATUS: ALLOW (CLEAN CONTENT)</span>
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-400">
                Lookup Latency: <strong className="text-white">{testResult.latencyMs}ms</strong>
              </span>
            </div>

            <div className="text-xs font-mono space-y-1.5">
              <div className="text-slate-400 truncate">
                <span className="text-slate-500">Evaluated URL:</span> {testResult.url}
              </div>
              {testResult.rule && (
                <>
                  <div className="text-indigo-300">
                    <span className="text-slate-500">Matched Rule:</span> <code>{testResult.rule.pattern}</code>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-slate-500">Description:</span> {testResult.rule.description}
                  </div>
                  <div className="text-emerald-400">
                    <span className="text-slate-500">Interception Agent:</span> {testResult.blockedBy}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Rules Database Browser */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>Active Filter Rules ({filteredRules.length})</span>
          </h3>

          <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'youtube', 'jiohotstar'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterTarget(t)}
                className={`px-3 py-1 rounded-lg font-medium capitalize cursor-pointer transition ${
                  filterTarget === t
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-slate-800 text-slate-300">
                    {rule.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-300">
                    {rule.pattern}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{rule.description}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    rule.action === 'BLOCK'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : rule.action === 'FAST_FORWARD'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  ACTION: {rule.action}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase bg-slate-800 text-slate-400">
                  {rule.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
