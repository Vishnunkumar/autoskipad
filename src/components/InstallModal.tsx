import React from 'react';
import { 
  Download, Smartphone, X, CheckCircle2, 
  ExternalLink, ArrowRight, Sparkles, Layers, ShieldCheck
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewManual: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose, onViewManual }) => {
  const { isInstallable, install, isIOS, isAndroid } = usePWAInstall();

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Install AdShield on Your Device</h3>
            <p className="text-xs text-slate-400">Install as a standalone app without an app store</p>
          </div>
        </div>

        {/* Option 1: Native Chrome 1-Tap WebAPK Prompt */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
              Option 1: Direct Android WebAPK
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Zero Download Required
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Installs directly into your Android app drawer with hardware acceleration and full background media support.
          </p>

          {isInstallable ? (
            <button
              onClick={handleNativeInstall}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Click to Trigger Android Install Dialog</span>
            </button>
          ) : (
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <span className="font-semibold text-white block">To install from this phone right now:</span>
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center font-mono text-[10px] shrink-0">1</span>
                <span>Tap Chrome's <strong>three dots menu (⋮)</strong> at the top right of your browser.</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center font-mono text-[10px] shrink-0">2</span>
                <span>Select <strong>"Install app"</strong> (or <strong>"Add to Home screen"</strong>).</span>
              </div>
              <p className="text-[11px] text-emerald-400 pt-1">
                ✓ Android will mint the official WebAPK directly to your home screen!
              </p>
            </div>
          )}
        </div>

        {/* Option 2: Direct Source Code & Manifest Package Download */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
              Option 2: Native Android Source & Manifest Package
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              For Android Studio / CLI
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Download the complete Android project package including <code>AdSkipAccessibilityService.kt</code>, <code>AndroidManifest.xml</code>, <code>build.gradle.kts</code>, and configuration files.
          </p>

          <a
            href="/AdShield-Android-Project.zip"
            download="AdShield-Android-Project.zip"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Android Project Package (.zip)</span>
          </a>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => {
              onClose();
              onViewManual();
            }}
            className="text-slate-400 hover:text-indigo-400 font-mono transition flex items-center space-x-1 cursor-pointer"
          >
            <span>View Full Manual & Bubblewrap Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
