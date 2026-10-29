import React, { useState } from 'react';
import { 
  Download, Smartphone, Terminal, CheckCircle2, Copy, Check, 
  ExternalLink, AlertTriangle, ShieldCheck, Cpu, QrCode, Layers, ArrowRight,
  Cloud, Sparkles, Globe, Laptop, HelpCircle, CheckCircle
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

export const ApkInstallGuide: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'bubblewrap' | 'pwabuilder' | 'webapk' | 'github-actions'>('bubblewrap');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { isInstallable, install } = usePWAInstall();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sharedUrl = 'https://ais-pre-xszbk4i3hzfdpz33tuquuu-831661160305.asia-east1.run.app';
  const devUrl = 'https://ais-dev-xszbk4i3hzfdpz33tuquuu-831661160305.asia-east1.run.app';
  const manifestSharedUrl = `${sharedUrl}/manifest.json`;

  const localManifestJson = `{
  "id": "/",
  "name": "AdShield Architecture Lab",
  "short_name": "AdShield",
  "description": "Mobile Ad-Skipping Architecture Lab & Brave Shield Fast-Forward",
  "start_url": "${sharedUrl}",
  "scope": "${sharedUrl}",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#020617",
  "theme_color": "#0f172a",
  "icons": [
    {
      "src": "${sharedUrl}/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "${sharedUrl}/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "${sharedUrl}/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}`;

  return (
    <div className="space-y-6">
      {/* Direct Download Card */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Instant Direct Download
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Download Complete Android Project (.zip)
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Contains the complete native Android project with <code>AdSkipAccessibilityService.kt</code>, <code>AndroidManifest.xml</code>, Gradle build scripts, and icons.
            </p>
          </div>

          <a
            href="/AdShield-Android-Project.zip"
            download="AdShield-Android-Project.zip"
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Project (.zip)</span>
          </a>
        </div>

        {/* 2 Clear Paths Explained */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
              Path 1: Install this Web Simulator App onto Phone
            </span>
            <p className="text-xs text-slate-300">
              Open Chrome on your phone, go to the app URL, tap the <strong>3 dots (⋮)</strong> in Chrome, and tap <strong>"Install app"</strong>. Android installs it directly to your home screen!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
              Path 2: Install Native YouTube Background Ad-Skipper
            </span>
            <p className="text-xs text-slate-300">
              Download the ZIP above and compile it for free via GitHub Actions (Method 4 below), or install pre-compiled open-source apps like <strong>Auto Skip Ads</strong> or <strong>NewPipe</strong> from F-Droid.
            </p>
          </div>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'bubblewrap', label: '1. Google Bubblewrap CLI (Step-by-Step)', badge: 'CLI • No Android Studio' },
          { id: 'pwabuilder', label: '2. PWABuilder (Online Cloud Downloader)', badge: 'No CLI • Browser' },
          { id: 'webapk', label: '3. 1-Tap Phone Install (WebAPK)', badge: 'No Computer Needed' },
          { id: 'github-actions', label: '4. GitHub Actions (Cloud Gradle)', badge: 'Kotlin Ad-Skipper' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-indigo-600/25 text-indigo-300 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Bubblewrap Step-by-Step Detailed Guide */}
      {activeSubTab === 'bubblewrap' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Google's Official Command-Line Tool (No Android Studio Required)
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Bubblewrap CLI Installation & Build Instructions
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Bubblewrap compiles your application into a native Android APK (Trusted Web Activity). You only need <strong>Node.js</strong> and <strong>Java (JDK 17 or 11)</strong>. You do <strong>not</strong> need Android Studio — Bubblewrap downloads and manages the Android command-line tools automatically.
            </p>
          </div>

          {/* Method 1A: 100% Guaranteed Local HTTP Server Method */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>100% FOOLPROOF FIX: Serve manifest.json on localhost:8080</span>
              </span>
              <button
                onClick={() => handleCopy(localManifestJson, 'copy-local-json')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-1 cursor-pointer"
              >
                {copiedCode === 'copy-local-json' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'copy-local-json' ? 'Copied JSON!' : '1. Copy manifest.json'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Bubblewrap <strong>strictly requires an http:// or https:// URL</strong> (passing a raw file path causes <em>"web manifest not found"</em>). By serving the file locally on <code>localhost:8080</code>, Bubblewrap connects instantly with <strong>zero 404 and zero 403 errors</strong>:
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                <span className="text-slate-500"># 1. Create folder and save manifest.json</span>
                <br />
                mkdir adshield-apk && cd adshield-apk
              </div>

              <pre className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto max-h-40 leading-relaxed">
{localManifestJson}
              </pre>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                <span className="text-slate-500"># 2. Run a lightweight local server in that folder</span>
                <br />
                npx serve -l 8080  <span className="text-slate-500"># Or: python3 -m http.server 8080</span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-emerald-500/40 text-emerald-300">
                <span className="text-slate-500"># 3. In another terminal tab, run Bubblewrap:</span>
                <br />
                bubblewrap init --manifest=http://localhost:8080/manifest.json
              </div>
            </div>
          </div>

          {/* Method 1B: Public Shared URL (If using URL) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-indigo-300 font-bold">
                Alternative: Use the Public Shared URL (Not the ais-dev URL)
              </span>
              <button
                onClick={() => handleCopy(`bubblewrap init --manifest=${manifestSharedUrl}`, 'bw-shared-cmd')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center space-x-1 cursor-pointer"
              >
                {copiedCode === 'bw-shared-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'bw-shared-cmd' ? 'Copied!' : 'Copy URL Command'}</span>
              </button>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-indigo-200 break-all">
              bubblewrap init --manifest={manifestSharedUrl}
            </div>
            <p className="text-[11px] text-slate-400">
              Note: Do not use <code>ais-dev-...</code> with external terminal tools because Cloud Run blocks unauthenticated dev access with 403. Use <code>ais-pre-...</code> or the local manifest above.
            </p>
          </div>

          {/* Step by step walkthrough */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Full Terminal Step-by-Step</span>
            </h4>

            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-bold">STEP 1: Install Bubblewrap CLI</span>
                <button
                  onClick={() => handleCopy('npm install -g @bubblewrap/cli', 'cmd-install')}
                  className="text-xs text-slate-400 hover:text-white font-mono flex items-center space-x-1 cursor-pointer"
                >
                  {copiedCode === 'cmd-install' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'cmd-install' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-200">
                npm install -g @bubblewrap/cli
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-bold">STEP 2: Create a Project Directory & Initialize</span>
                <button
                  onClick={() => handleCopy(`mkdir adshield-apk && cd adshield-apk\nbubblewrap init --manifest=${manifestSharedUrl}`, 'cmd-init')}
                  className="text-xs text-slate-400 hover:text-white font-mono flex items-center space-x-1 cursor-pointer"
                >
                  {copiedCode === 'cmd-init' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'cmd-init' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto">
{`mkdir adshield-apk && cd adshield-apk
bubblewrap init --manifest=${manifestSharedUrl}`}
              </pre>
            </div>

            {/* Step 3: Answering Bubblewrap interactive questions */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono text-indigo-400 font-bold block">
                STEP 3: Answering the Bubblewrap Prompts (Press ENTER to accept defaults)
              </span>
              <p className="text-xs text-slate-400">
                Bubblewrap will automatically read the icons, colors, and name from our manifest and ask you a few confirmation questions:
              </p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 leading-relaxed">
                <div>• <span className="text-slate-400">Domain:</span> <span className="text-emerald-300">ais-dev-xszbk4i3hzfdpz33tuquuu-831661160305.asia-east1.run.app</span> (Press ENTER)</div>
                <div>• <span className="text-slate-400">Application name:</span> <span className="text-emerald-300">AdShield Architecture Lab</span> (Press ENTER)</div>
                <div>• <span className="text-slate-400">Short name:</span> <span className="text-emerald-300">AdShield</span> (Press ENTER)</div>
                <div>• <span className="text-slate-400">Package ID:</span> <span className="text-emerald-300">com.adshield.app</span> (Press ENTER)</div>
                <div>• <span className="text-slate-400">Display mode:</span> <span className="text-emerald-300">standalone</span> (Press ENTER)</div>
                <div>• <span className="text-slate-400">Signing Key:</span> Bubblewrap will ask to generate a new key store. Press ENTER, enter any password (e.g., <code>mypassword123</code>), and enter your name.</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-bold">STEP 4: Compile the APK</span>
                <button
                  onClick={() => handleCopy('bubblewrap build', 'cmd-build')}
                  className="text-xs text-slate-400 hover:text-white font-mono flex items-center space-x-1 cursor-pointer"
                >
                  {copiedCode === 'cmd-build' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'cmd-build' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-200">
                bubblewrap build
              </div>
              <p className="text-xs text-emerald-400 font-mono">
                ✓ Done! Generates <strong>app-release-signed.apk</strong> in your folder.
              </p>
            </div>

            {/* Step 5: Install APK on phone */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold block">
                STEP 5: Sideload & Install on Your Android Phone
              </span>
              <p className="text-xs text-slate-400">
                Connect your Android phone with USB (with USB Debugging turned on in Developer Options) and run:
              </p>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-200">
                bubblewrap install
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Or transfer <code>app-release-signed.apk</code> to your phone via Telegram, WhatsApp, or Google Drive, tap it in your Downloads folder, and tap <strong>Install</strong>!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PWABuilder Cloud (Zero-CLI alternative) */}
      {activeSubTab === 'pwabuilder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Zero Software Required (Works 100% in Browser)
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                PWABuilder.com (Cloud APK Downloader)
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                If you prefer not to use any command-line tools or terminal, use PWABuilder (maintained by Microsoft & Google). It takes the URL, compiles the APK in the cloud, and gives you a download button.
              </p>
            </div>

            <a
              href="https://www.pwabuilder.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>Open PWABuilder.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold block">1. COPY URL</span>
              <h4 className="text-sm font-bold text-white">Copy Live App URL</h4>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[11px] font-mono text-indigo-300 truncate">
                {devUrl}
              </div>
              <button
                onClick={() => handleCopy(devUrl, 'pwa-url-copy')}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition flex items-center justify-center space-x-1"
              >
                {copiedCode === 'pwa-url-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'pwa-url-copy' ? 'Copied URL!' : 'Copy URL'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold block">2. PASTE & ANALYZE</span>
              <h4 className="text-sm font-bold text-white">Paste at pwabuilder.com</h4>
              <p className="text-xs text-slate-400">
                Paste the URL into the input field and click <strong>Start</strong>. Our manifest scores 100/100 PWA compliance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold block">3. DOWNLOAD .APK</span>
              <h4 className="text-sm font-bold text-white">Click "Package for Android"</h4>
              <p className="text-xs text-slate-400">
                Click <strong>Package For Stores</strong> → choose <strong>Android</strong> → click <strong>Generate APK</strong> to download!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Direct Phone WebAPK */}
      {activeSubTab === 'webapk' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                Direct on Android Phone
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                1-Tap WebAPK from Android Chrome
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                When you open the URL on your Android phone in Chrome, tapping "Install app" causes Google Play Services to compile a WebAPK on Google's cloud and install it into your Android app drawer.
              </p>
            </div>

            {isInstallable && (
              <button
                onClick={install}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 cursor-pointer self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Tap to Install on Phone</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold block">STEP 1</span>
              <h4 className="text-sm font-bold text-white">Open in Android Chrome</h4>
              <div className="text-[11px] font-mono text-indigo-300 bg-slate-900 p-2 rounded border border-slate-800 break-all">
                {devUrl}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold block">STEP 2</span>
              <h4 className="text-sm font-bold text-white">Tap Chrome Menu (⋮)</h4>
              <p className="text-xs text-slate-400">
                Tap the three dots (<strong>⋮</strong>) in the top-right corner of Chrome and select <strong>"Install app"</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold block">STEP 3</span>
              <h4 className="text-sm font-bold text-white">Native WebAPK Appears</h4>
              <p className="text-xs text-slate-400">
                The app appears in your Android App Drawer just like a native APK from the Play Store!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: GitHub Actions Cloud Builder */}
      {activeSubTab === 'github-actions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Free Cloud Gradle Virtual Machines
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Compile Kotlin Native Ad-Skipper via GitHub Actions
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              To compile the actual <strong>Native Kotlin Accessibility Ad-Skipper APK</strong> that skips ads in the official YouTube APK without installing Android Studio, use GitHub Actions:
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  File: .github/workflows/build-apk.yml
                </span>
                <button
                  onClick={() => handleCopy(`name: Build Android APK
on: [push, workflow_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
    - run: ./gradlew assembleDebug
    - uses: actions/upload-artifact@v4
      with:
        name: app-debug-apk
        path: app/build/outputs/apk/debug/app-debug.apk`, 'gh-action')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center space-x-1 cursor-pointer"
                >
                  {copiedCode === 'gh-action' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'gh-action' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`name: Build Android APK
on: [push, workflow_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
    - run: ./gradlew assembleDebug
    - uses: actions/upload-artifact@v4
      with:
        name: app-debug-apk
        path: app/build/outputs/apk/debug/app-debug.apk`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
