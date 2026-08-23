import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminInstagramConnectCard } from '../../components/admin/AdminInstagramConnectCard';
import { 
  Instagram, 
  Sparkles, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  HelpCircle,
  ArrowRight,
  Eye
} from 'lucide-react';

export const AdminInstagramPage: React.FC = () => {
  const { instagramSettings, navigate } = useStore();

  return (
    <AdminLayout
      activeSection="instagram"
      title="Instagram Page Integration"
      subtitle="Connect, authenticate, and manage your brand's official Instagram profile and storefront showcase"
      breadcrumb="Admin / Instagram"
      actionButton={
        <div className="flex items-center space-x-2">
          <a
            href={instagramSettings.profileUrl || `https://instagram.com/${instagramSettings.handle || 'lunova.atelier'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-mono font-bold text-white flex items-center space-x-2 transition-all shadow-sm"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>Open @{instagramSettings.handle || 'page'}</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Top Info Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/20 to-zinc-950 border border-pink-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 shrink-0 shadow-lg shadow-pink-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Instagram className="w-6 h-6 text-pink-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Connect Your Store's Instagram Page</span>
                {instagramSettings.isConnected ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                    CONNECTED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono">
                    PENDING CONNECTION
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Link your official Instagram account to synchronize posts with your home page gallery, footer, and contact details.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono font-medium text-zinc-300 hover:text-white flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Preview Storefront Feed</span>
          </button>
        </div>

        {/* Main Connect Card Component */}
        <AdminInstagramConnectCard />

        {/* Instructions & Features Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Instagram className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">1. Connect Handle</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Enter your Instagram username or paste your profile link. It will automatically update all public store links.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">2. Curate Your Showcase</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Add your own high-resolution product photos and reels or delete default items to highlight your bespoke creations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">3. Storefront Integration</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Live synchronized feeds render seamlessly on the Home page, Contact page, and the universal luxury footer.
            </p>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
