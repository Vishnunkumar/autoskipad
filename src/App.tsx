import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { PlayerSimulator } from './components/PlayerSimulator.tsx';
import { BraveMechanicsExplainer } from './components/BraveMechanicsExplainer.tsx';
import { MobileArchitecturePlan } from './components/MobileArchitecturePlan.tsx';
import { ManifestSanitizerTool } from './components/ManifestSanitizerTool.tsx';
import { RuleTesterTool } from './components/RuleTesterTool.tsx';
import { CodeBlueprints } from './components/CodeBlueprints.tsx';
import { ApkInstallGuide } from './components/ApkInstallGuide.tsx';
import { Shield, Sparkles, Terminal, Smartphone, Server } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('simulator');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'simulator' && <PlayerSimulator />}
        {activeTab === 'brave-logic' && <BraveMechanicsExplainer />}
        {activeTab === 'mobile-plan' && <MobileArchitecturePlan />}
        {activeTab === 'manifest-sanitizer' && <ManifestSanitizerTool />}
        {activeTab === 'rule-tester' && <RuleTesterTool />}
        {activeTab === 'code-blueprints' && <CodeBlueprints />}
        {activeTab === 'apk-install' && <ApkInstallGuide />}
      </main>

      {/* Global Bottom Engineering Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-400">AdShield Architecture Lab</span>
            <span>—</span>
            <span>Brave Shield Scriptlet Engine, Android Accessibility Service & SSAI Manifest Proxy</span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span className="text-slate-400">Target Platforms: Android • iOS • Chromium WebEngine</span>
            <span className="text-emerald-400">● Engine Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
