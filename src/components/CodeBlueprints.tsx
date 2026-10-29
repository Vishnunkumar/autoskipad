import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Copy, Check, Smartphone, Shield, Terminal, 
  FileCode, Download, ExternalLink, CheckCircle2
} from 'lucide-react';

interface BlueprintData {
  title: string;
  language: string;
  scope: string;
  worksOn: string;
  summary: string;
  code: string;
}

export const CodeBlueprints: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<string>('accessibility');
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/blueprints/${selectedTech}`)
      .then((res) => res.json())
      .then((data) => {
        setBlueprint(data);
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedTech]);

  const handleCopy = () => {
    if (blueprint?.code) {
      navigator.clipboard.writeText(blueprint.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const techs = [
    { id: 'accessibility', label: 'Android Accessibility Service', icon: Smartphone, tag: 'Native Apps' },
    { id: 'brave-scriptlet', label: 'Brave 16x Fast-Forward Scriptlet', icon: Shield, tag: 'Brave Engine' },
    { id: 'vpn-dns', label: 'Android VpnService Local DNS', icon: Terminal, tag: 'Network TUN' },
  ];

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Production-Ready Implementation Blueprints</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Mobile & Backend Code Generators
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Copy production-tested source code for each mobile architecture pattern. These modules can be dropped directly into an Android Studio Kotlin project or custom mobile browser app.
          </p>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {techs.map((t) => {
          const Icon = t.icon;
          const isActive = selectedTech === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTech(t.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                {t.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Blueprint Content */}
      {blueprint && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header Metadata */}
          <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                Target Platform: {blueprint.worksOn}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {blueprint.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {blueprint.summary}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 cursor-pointer self-start lg:self-auto"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Code Copied to Clipboard!' : 'Copy Implementation Code'}</span>
            </button>
          </div>

          {/* Code Viewer */}
          <div className="relative bg-slate-950">
            <div className="bg-slate-950/90 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>
                  {selectedTech === 'accessibility'
                    ? 'AdSkipAccessibilityService.kt'
                    : selectedTech === 'brave-scriptlet'
                    ? 'brave-fastforward.user.js'
                    : 'AdBlockVpnService.kt'}
                </span>
              </div>
              <span className="uppercase text-[11px] text-slate-400">
                Language: {blueprint.language}
              </span>
            </div>

            <pre className="p-5 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-[520px]">
              <code>{blueprint.code}</code>
            </pre>
          </div>

          {/* Android Manifest Integration Guide */}
          {selectedTech === 'accessibility' && (
            <div className="p-6 bg-slate-950/60 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider">
                Android Manifest & Configuration XML Setup:
              </h4>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
                <code>{`<!-- AndroidManifest.xml -->
<service
    android:name=".AdSkipAccessibilityService"
    android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
    android:exported="true">
    <intent-filter>
        <action android:name="android.accessibilityservice.AccessibilityService" />
    </intent-filter>
    <meta-data
        android:name="android.accessibilityservice"
        android:resource="@xml/accessibility_service_config" />
</service>`}</code>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
