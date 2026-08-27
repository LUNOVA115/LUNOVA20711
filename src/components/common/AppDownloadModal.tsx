import React from 'react';
import { X, Smartphone, ExternalLink, Apple, Play } from 'lucide-react';
import { LUNOVA_PLAY_STORE_URL, LUNOVA_APP_STORE_URL } from '../../utils/appStore';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0e1017] border border-amber-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-100 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif tracking-wide text-white">
            Download LUNOVA Mobile App
          </h3>
          <p className="text-xs text-zinc-400 font-light max-w-xs mx-auto">
            Experience handcrafted luxury lighting and smart atmospheric controls directly on your mobile device. Choose your platform:
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Android Google Play Store Button */}
          <a
            href={LUNOVA_PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-400/60 hover:bg-amber-400/5 transition-all duration-300 group cursor-pointer shadow-lg"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div className="text-left">
                <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">Google Play</div>
                <div className="text-sm font-sans font-semibold text-white group-hover:text-amber-300 transition-colors">Download for Android</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
          </a>

          {/* iOS Apple App Store Button */}
          <a
            href={LUNOVA_APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-sky-400/60 hover:bg-sky-400/5 transition-all duration-300 group cursor-pointer shadow-lg"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                <Apple className="w-5 h-5 fill-current" />
              </div>
              <div className="text-left">
                <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">Apple App Store</div>
                <div className="text-sm font-sans font-semibold text-white group-hover:text-sky-300 transition-colors">Download for iOS</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-sky-400 transition-colors" />
          </a>
        </div>

        <div className="text-center pt-2 border-t border-zinc-800/80">
          <span className="text-[10px] font-mono text-zinc-300 tracking-wider">
            Official LUNOVA App • v2.4.0 • Secure Official Store Link
          </span>
        </div>
      </div>
    </div>
  );
};
