import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CollectionCard } from '../components/common/CollectionCard';
import { AppDownloadModal } from '../components/common/AppDownloadModal';
import { handleAppDownload } from '../utils/appStore';
import { Sparkles, Compass, Smartphone, Download } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const { categories } = useStore();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleAppDownload({
      onDesktopFallback: () => setIsDownloadModalOpen(true)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 text-zinc-100">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-300 uppercase tracking-widest px-3 py-1 bg-zinc-900/80 border border-amber-400/30 rounded-full">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>DESIGN ARCHITECTURES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
          LUNOVA Collections
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light max-w-xl mx-auto">
          Explore curated series categorized by optical physical concepts, lunar topographic models, and smart architectural ambient lighting.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <CollectionCard key={category.id} category={category} />
        ))}
      </div>

      {/* Download App Section */}
      <div className="pt-8 border-t border-zinc-800/80 flex flex-col items-center justify-center space-y-3 text-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-semibold">
          LUNOVA LUXURY MOBILE EXPERIENCE
        </span>
        <button
          onClick={handleDownloadClick}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 text-xs font-sans font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md shadow-amber-500/20 hover:scale-105 transition-all duration-300 cursor-pointer border border-amber-300/80"
          title="Download Official LUNOVA Mobile App"
        >
          <Smartphone className="w-4 h-4 text-zinc-950 shrink-0 stroke-[2.5]" />
          <span className="font-extrabold text-xs tracking-wider text-zinc-950">DOWNLOAD APP</span>
          <Download className="w-4 h-4 text-zinc-950 shrink-0 stroke-[2.5]" />
        </button>
        <p className="text-[10px] font-mono text-zinc-400">
          Official LUNOVA App for iOS & Android • Version 2.4.0
        </p>
      </div>

      {/* App Download Selection Modal */}
      <AppDownloadModal 
        isOpen={isDownloadModalOpen} 
        onClose={() => setIsDownloadModalOpen(false)} 
      />
    </div>
  );
};

