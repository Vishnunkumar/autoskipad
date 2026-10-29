import React, { useState } from 'react';
import { Shield, Zap, Smartphone, Server, Eye, Sparkles, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { InstallModal } from './InstallModal.tsx';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { isInstallable, install } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  const navItems = [
    { id: 'simulator', label: 'Live Ad-Bypass Simulator', icon: Zap },
    { id: 'brave-logic', label: 'How Brave Does It', icon: Shield },
    { id: 'mobile-plan', label: 'Mobile Architecture Plan', icon: Smartphone },
    { id: 'manifest-sanitizer', label: 'HLS Manifest Sanitizer (SSAI)', icon: Server },
    { id: 'rule-tester', label: 'Rule Matcher & Engine', icon: Eye },
    { id: 'code-blueprints', label: 'Exportable Code Blueprints', icon: Sparkles },
    { id: 'apk-install', label: 'Install as APK', icon: Download },
  ];

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowInstallModal(true);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  return (
    <>
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Shield className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg tracking-tight text-white">AdShield</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-medium">
                    Architecture & Lab
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Mobile Native Ad-Skipping • Brave Shield Fast-Forward • Backend SSAI Stripper
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install as APK</span>
              </button>
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Bypass Engine Active
              </span>
            </div>
          </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto pb-2 -mb-px scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>

    <InstallModal
      isOpen={showInstallModal}
      onClose={() => setShowInstallModal(false)}
      onViewManual={() => setActiveTab('apk-install')}
    />
  </>
  );
};
