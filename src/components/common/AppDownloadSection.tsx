import React from 'react';
import { Smartphone, ExternalLink, Play } from 'lucide-react';
import { LUNOVA_PLAY_STORE_URL, LUNOVA_APP_STORE_URL } from '../../utils/appStore';

export const AppDownloadSection: React.FC = () => {
  return (
    <section 
      id="app-download-section"
      className="w-full relative z-10 py-12 sm:py-16 overflow-hidden border-t border-zinc-800/80 bg-gradient-to-b from-[#08090d] via-[#0b0c12] to-[#06070a]"
      aria-label="Download Official LUNOVA Mobile App"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[280px] bg-radial from-amber-500/10 via-amber-700/5 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-zinc-950/90 border border-amber-400/25 p-8 sm:p-12 shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Subtle decorative background gradient */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-amber-300 uppercase tracking-[0.25em] px-3.5 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full shadow-sm">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>LUNOVA LUXURY MOBILE EXPERIENCE</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-tight font-light">
              Elevate Your Living Space <span className="text-gold-gradient font-medium">on Mobile</span>
            </h2>

            {/* Sub-copy */}
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-xl mx-auto">
              Unlock real-time smart illumination synchronization, bespoke color temperature atmosphere controls, and private access to limited artisanal collector drops.
            </p>

            {/* Download Buttons: Google Play & App Store (iOS) */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              
              {/* 1. Download on Google Play */}
              <a
                href={LUNOVA_PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-download-google-play"
                className="w-full sm:w-auto min-w-[240px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-850 hover:from-zinc-850 hover:to-zinc-800 border border-emerald-500/40 hover:border-emerald-400/80 text-left flex items-center justify-between space-x-4 transition-all duration-300 group cursor-pointer shadow-xl hover:shadow-emerald-500/15 hover:scale-[1.02]"
                title="Download LUNOVA on Google Play Store (Android)"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/25 transition-all">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                      GET IT ON
                    </div>
                    <div className="text-sm font-sans font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Google Play
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </a>

              {/* 2. Download on the App Store (iOS) */}
              <a
                href={LUNOVA_APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-download-app-store"
                className="w-full sm:w-auto min-w-[240px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-850 hover:from-zinc-850 hover:to-zinc-800 border border-sky-500/40 hover:border-sky-400/80 text-left flex items-center justify-between space-x-4 transition-all duration-300 group cursor-pointer shadow-xl hover:shadow-sky-500/15 hover:scale-[1.02]"
                title="Download LUNOVA on Apple App Store (iOS)"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:bg-sky-500/25 transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.03.62-2.67 1.37-.56.65-.99 1.7-0.87 2.72 1.02.08 2.05-.51 2.62-1.24z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                      DOWNLOAD ON THE
                    </div>
                    <div className="text-sm font-sans font-bold text-white group-hover:text-sky-300 transition-colors">
                      App Store (iOS)
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
              </a>

            </div>

            {/* Version & Compatibility Footer text */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-zinc-400 tracking-wider">
                Official LUNOVA App • Version 2.4.0 • iOS & Android Compatible
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
