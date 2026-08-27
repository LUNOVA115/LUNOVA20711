import React, { useMemo } from 'react';
import { Category } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Moon, Layers } from 'lucide-react';

interface CollectionCardProps {
  category: Category;
  index?: number;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ category, index = 0 }) => {
  const { navigate, products } = useStore();

  const handleOpen = () => {
    navigate(`/collections/${category.slug}`);
  };

  const catProducts = products.filter(
    p => p.category.toLowerCase() === category.name.toLowerCase() || p.category.toLowerCase() === category.slug.toLowerCase()
  );
  const uniqueSubs = Array.from(new Set(catProducts.map(p => p.subcategory).filter(Boolean)));
  const subCount = category.subcategories?.length || uniqueSubs.length || (index === 0 ? 4 : 3);
  const displayImage = category.image || (category.slug === 'moon' ? 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&q=80&w=800' : 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800');
  
  const isEven = index % 2 === 0;
  const accentColor = isEven ? 'amber' : 'sky';

  return (
    <div
      onClick={handleOpen}
      className={`group relative rounded-3xl overflow-hidden bg-[#0A0B10] border border-zinc-800/80 hover:border-${accentColor}-400/50 p-8 sm:p-12 cursor-pointer transition-all duration-500 shadow-2xl flex flex-col justify-between min-h-[480px]`}
    >
      <div className={`absolute inset-0 bg-radial from-${accentColor}-500/10 via-transparent to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className={`px-3 py-1 rounded-full bg-${accentColor}-400/15 border border-${accentColor}-400/30 text-${accentColor}-300 text-[10px] font-mono uppercase font-bold tracking-widest`}>
            Series {index + 1} • {category.slug.toUpperCase()}
          </span>
          <h3 className={`text-2xl sm:text-3xl font-serif text-white mt-3 group-hover:text-${accentColor}-300 transition-colors`}>
            {category.name}
          </h3>
          {/* Subcategories count display */}
          <div className="mt-2.5 inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono">
            <span className="text-zinc-400 uppercase tracking-wider font-semibold">Subcategories</span>
            <span className={`text-${accentColor}-300 font-bold`}>{subCount}</span>
          </div>
        </div>
        <div className={`p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-${accentColor}-400 group-hover:bg-${accentColor}-400 group-hover:text-zinc-950 transition-colors`}>
          {index === 0 ? <Moon className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
        </div>
      </div>

      {/* Visual Centerpiece */}
      <div className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 mx-auto my-6 transform group-hover:scale-110 transition-transform duration-700 ease-out">
        <img
          src={displayImage}
          alt={category.name}
          className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(245,158,11,0.25)]"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-zinc-800/80">
        <span className="text-xs font-mono text-zinc-400 truncate max-w-[240px] sm:max-w-xs">
          {category.description || 'Mastercrafted Artisanal Living Edition'}
        </span>
        <span className={`text-xs font-mono uppercase tracking-widest text-${accentColor}-300 flex items-center space-x-1 group-hover:translate-x-1 transition-transform shrink-0`}>
          <span>View Archive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
