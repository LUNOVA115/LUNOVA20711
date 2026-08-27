import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { TwinklingStars } from '../components/common/TwinklingStars';
import { 
  ArrowRight, 
  Sparkles, 
  Moon, 
  Layers,
  ShieldCheck,
  Award
} from 'lucide-react';
import { 
  IMAGE_1_GOLD_TABLE, 
  IMAGE_3_WARM_MOON
} from '../data/productImages';

export const HomePage: React.FC = () => {
  const { navigate, products, categories, homeSettings, resetFilters, setFilters } = useStore();

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
      <section className="relative min-h-[85vh] flex items-center justify-center pt-12 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Dynamic Interactive Radial Lighting Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full blur-3xl pointer-events-none transition-all duration-700 -z-10 animate-pulse-glow"
          style={{
            background: `radial-gradient(circle, ${haloColor} 0%, rgba(8, 9, 13, 0) 70%)`,
            opacity: 0.85
          }}
        />

        <div className="max-w-4xl mx-auto w-full text-center space-y-8 relative z-10">
          
          {/* Centered Luxury LUNOVA Header */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-3xl sm:text-5xl font-serif tracking-[0.3em] text-white uppercase font-bold drop-shadow-md">
              LU<span className="text-gold-gradient">NOVA</span>
            </span>
            <div className="flex items-center space-x-3 text-[9px] sm:text-[11px] tracking-[0.3em] font-mono text-zinc-300 uppercase">
              <span className="text-amber-400 font-semibold drop-shadow">HANDMADE HOME DECOR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
              <span className="text-zinc-200">EST. 2024</span>
            </div>
          </div>

          {/* Refined Headline */}
          <h1 className="text-xl sm:text-3xl font-serif tracking-[0.08em] text-zinc-100 font-light max-w-xl mx-auto drop-shadow-lg">
            Illuminate Your <span className="text-gold-gradient font-medium">Imagination.</span>
          </h1>

          {/* Architectural Sub-copy */}
          <p className="text-base sm:text-lg text-zinc-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
            Where refined design meets modern luxury, LUNOVA brings timeless pieces crafted to transform ordinary spaces into something truly exceptional.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            {/* Shop All Collections Button */}
            <button
              onClick={() => navigate('/collections')}
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-zinc-950 text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl shadow-amber-400/35 hover:shadow-amber-400/50 hover:scale-105 flex items-center justify-center space-x-2 group cursor-pointer"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Two-Column Header */}
        <div className="flex flex-row items-center justify-between pb-4 border-b border-zinc-800/60">
          <h2 className="text-xl sm:text-3xl font-serif text-white tracking-tight font-normal">
            Refined Artisanal Creations
          </h2>
          <button
            onClick={() => {
              if (resetFilters) {
                resetFilters();
              } else {
                setFilters((prev) => ({ ...prev, category: 'all', search: '', inStockOnly: false, minRating: 0 }));
              }
              navigate('/shop');
            }}
            className="text-xs sm:text-sm font-mono tracking-widest uppercase text-amber-300 hover:text-amber-200 flex items-center space-x-1.5 group cursor-pointer transition-colors shrink-0"
          >
            <span>Explore All Collections</span>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories.map((cat, idx) => {
            const catProducts = products.filter(
              p => p.category.toLowerCase() === cat.name.toLowerCase() || p.category.toLowerCase() === cat.slug.toLowerCase()
            );
            const uniqueSubs = Array.from(new Set(catProducts.map(p => p.subcategory).filter(Boolean)));
            const subCount = cat.subcategories?.length || uniqueSubs.length || (idx === 0 ? 4 : 3);
            const catImage = cat.image || (cat.slug === 'moon' ? moonImage : infinityImage);
            const isEven = idx % 2 === 0;
            const accentColor = isEven ? 'amber' : 'sky';

            return (
              <div 
                key={cat.id || idx}
                onClick={() => navigate(`/collections/${cat.slug}`)}
                className={`group relative rounded-3xl overflow-hidden bg-[#0A0B10] border border-zinc-800/80 hover:border-${accentColor}-400/50 p-8 sm:p-12 cursor-pointer transition-all duration-500 shadow-2xl flex flex-col justify-between min-h-[480px]`}
              >
                <div className={`absolute inset-0 bg-radial from-${accentColor}-500/10 via-transparent to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className={`px-3 py-1 rounded-full bg-${accentColor}-400/15 border border-${accentColor}-400/30 text-${accentColor}-300 text-[10px] font-mono uppercase font-bold tracking-widest`}>
                      Series {idx + 1} • {cat.slug.toUpperCase()}
                    </span>
                    <h3 className={`text-2xl sm:text-3xl font-serif text-white mt-3 group-hover:text-${accentColor}-300 transition-colors`}>
                      {cat.name}
                    </h3>
                    {/* Subcategories count display */}
                    <div className="mt-2.5 inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono">
                      <span className="text-zinc-400 uppercase tracking-wider font-semibold">Subcategories</span>
                      <span className={`text-${accentColor}-300 font-bold`}>{subCount}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-${accentColor}-400 group-hover:bg-${accentColor}-400 group-hover:text-zinc-950 transition-colors`}>
                    {idx === 0 ? <Moon className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                  </div>
                </div>

                {/* Visual Centerpiece */}
                <div className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 mx-auto my-6 transform group-hover:scale-110 transition-transform duration-700 ease-out">
                  <img
                    src={catImage}
                    alt={cat.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(245,158,11,0.25)]"
                  />
                </div>

                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-zinc-800/80">
                  <span className="text-xs font-mono text-zinc-400 truncate max-w-[240px] sm:max-w-xs">
                    {cat.description || 'Mastercrafted Artisanal Living Edition'}
                  </span>
                  <span className={`text-xs font-mono uppercase tracking-widest text-${accentColor}-300 flex items-center space-x-1 group-hover:translate-x-1 transition-transform shrink-0`}>
                    <span>View Archive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          ATELIER GUARANTEES & CRAFT SUPPORT
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-md backdrop-blur-md relative overflow-hidden group hover:border-amber-400/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-serif text-white tracking-wide">30-Day Guarantee</h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">Hassle-free artisanal returns</p>
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-md backdrop-blur-md relative overflow-hidden group hover:border-amber-400/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-serif text-white tracking-wide">Lifetime Craft Support</h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">100% authentic craftsmanship</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
