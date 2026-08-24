import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { TwinklingStars } from '../components/common/TwinklingStars';
import { 
  ArrowRight, 
  Sparkles, 
  Moon, 
  Layers,
  Smartphone,
  Download
} from 'lucide-react';
import { 
  IMAGE_1_GOLD_TABLE, 
  IMAGE_3_WARM_MOON
} from '../data/productImages';

export const HomePage: React.FC = () => {
  const { navigate, products, addToast } = useStore();

  // Dynamically retrieve the flagship or first product of each category to display synchronized images
  const moonProduct = useMemo(() => {
    return products.find(p => p.category === 'Moon Collection' && p.status === 'active') || products.find(p => p.category === 'Moon Collection');
  }, [products]);

  const infinityProduct = useMemo(() => {
    return products.find(p => p.category === 'Infinity Collection' && p.status === 'active') || products.find(p => p.category === 'Infinity Collection');
  }, [products]);

  const moonImage = moonProduct?.images?.[0] || IMAGE_3_WARM_MOON;
  const infinityImage = infinityProduct?.images?.[0] || IMAGE_1_GOLD_TABLE;

  // Dynamic halo lighting
  const haloColor = 'rgba(251, 191, 36, 0.4)';

  return (
    <div className="space-y-24 sm:space-y-36 pb-24 overflow-hidden stardust-bg relative">
      
      {/* Dynamic Animated Twinkling & Blinking Starfield */}
      <TwinklingStars count={110} showShootingStars={true} />
      
      {/* =========================================================================
          HERO SECTION: CINEMATIC ATMOSPHERIC ARCHITECTURE
      ========================================================================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 sm:pt-14 pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Interactive Radial Lighting Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full blur-3xl pointer-events-none transition-all duration-700 -z-10 animate-pulse-glow"
          style={{
            background: `radial-gradient(circle, ${haloColor} 0%, rgba(8, 9, 13, 0) 70%)`,
            opacity: 0.9
          }}
        />

        <div className="max-w-4xl mx-auto w-full text-center space-y-8 relative z-10">
          
          {/* Centered Luxury LUNOVA Logo Typography */}
          <div className="flex flex-col items-center justify-center space-y-2 pt-2 pb-1">
            {/* LUNOVA Typography */}
            <div className="flex flex-col items-center space-y-1">
              <span className="text-3xl sm:text-5xl font-serif tracking-[0.3em] text-white uppercase leading-none font-bold">
                LU<span className="text-gold-gradient">NOVA</span>
              </span>
              <div className="flex items-center space-x-3 text-[9px] sm:text-[10px] tracking-[0.3em] font-mono text-zinc-400 uppercase pt-1">
                <span className="text-amber-400 font-semibold">HANDMADE HOME DECOR</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span>EST. 2024</span>
              </div>
            </div>
          </div>

          {/* Refined Small Headline */}
          <h1 className="text-lg sm:text-2xl font-serif tracking-[0.08em] text-zinc-200 font-light max-w-xl mx-auto">
            Illuminate Your <span className="text-gold-gradient font-medium">Imagination.</span>
          </h1>

          {/* Architectural Sub-copy */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
            Where refined design meets modern luxury, LUNOVA brings timeless pieces crafted to transform ordinary spaces into something truly exceptional.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {/* Shop All Collections Button */}
            <button
              onClick={() => navigate('/collections')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-zinc-950 text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl shadow-amber-400/25 hover:shadow-amber-400/40 hover:scale-105 flex items-center justify-center space-x-2 group cursor-pointer"
              title="Shop All Collections"
            >
              <span>Shop All Collections</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CURATED COLLECTIONS EDITORIAL
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400 block">
            TWO ARCHITECTURAL REALMS
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white">
            Curated Collections
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            From the high-tactile topography of our celestial sphere series to the infinite geometric depth of our optical tables.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Collection 1: Moon Lamp Series */}
          <div 
            onClick={() => navigate('/collections/moon')}
            className="group relative rounded-3xl overflow-hidden bg-[#0A0B10] border border-zinc-800/80 hover:border-amber-400/50 p-8 sm:p-12 cursor-pointer transition-all duration-500 shadow-2xl flex flex-col justify-between min-h-[460px]"
          >
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-mono uppercase font-bold tracking-widest">
                  Series I • Cartography
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white mt-3 group-hover:text-amber-300 transition-colors">
                  The Moon Collection
                </h3>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-amber-400 group-hover:bg-amber-400 group-hover:text-zinc-950 transition-colors">
                <Moon className="w-5 h-5" />
              </div>
            </div>

            {/* Visual Centerpiece */}
            <div className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 mx-auto my-6 transform group-hover:scale-110 transition-transform duration-700 ease-out">
              <img
                src={moonImage}
                alt="Moon Lamp Collection"
                className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(245,158,11,0.25)]"
              />
            </div>

            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-zinc-800/80">
              <span className="text-xs font-mono text-zinc-400">
                Precision NASA Altimetry • 3D Basalt Polymer
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-300 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>View Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Collection 2: Infinity Mirror Table Series */}
          <div 
            onClick={() => navigate('/collections/infinity')}
            className="group relative rounded-3xl overflow-hidden bg-[#0A0B10] border border-zinc-800/80 hover:border-sky-400/50 p-8 sm:p-12 cursor-pointer transition-all duration-500 shadow-2xl flex flex-col justify-between min-h-[460px]"
          >
            <div className="absolute inset-0 bg-radial from-sky-500/10 via-transparent to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-sky-400/15 border border-sky-400/30 text-sky-300 text-[10px] font-mono uppercase font-bold tracking-widest">
                  Series II • Hyper-Depth
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white mt-3 group-hover:text-sky-300 transition-colors">
                  The Infinity Collection
                </h3>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-sky-400 group-hover:bg-sky-400 group-hover:text-zinc-950 transition-colors">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            {/* Visual Centerpiece */}
            <div className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 mx-auto my-6 transform group-hover:scale-110 transition-transform duration-700 ease-out">
              <img
                src={infinityImage}
                alt="Infinity Mirror Collection"
                className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(56,189,248,0.25)]"
              />
            </div>

            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-zinc-800/80">
              <span className="text-xs font-mono text-zinc-400">
                Dielectric Optical Abyss • 6061 Aerospace Aluminum
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-sky-300 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>View Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>


      </section>

    </div>
  );
};
