import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductGrid } from '../components/common/ProductGrid';
import { LightingSimulator } from '../components/common/LightingSimulator';
import { Moon, Layers, Sparkles, ArrowLeft } from 'lucide-react';

interface CollectionDetailPageProps {
  slug: string; // 'moon' | 'infinity' | 'cosmic' | 'futuristic-home'
}

export const CollectionDetailPage: React.FC<CollectionDetailPageProps> = ({ slug }) => {
  const { products, categories, navigate } = useStore();

  let targetCategoryName = 'Moon Collection';
  if (slug === 'infinity') targetCategoryName = 'Infinity Collection';
  else if (slug === 'cosmic') targetCategoryName = 'Cosmic Decor';
  else if (slug === 'futuristic-home') targetCategoryName = 'Futuristic Home';

  const category = categories.find((c) => c.name.toLowerCase() === targetCategoryName.toLowerCase()) || categories[0];
  const collectionProducts = products.filter(
    (p) => p.category.toLowerCase() === targetCategoryName.toLowerCase() && p.status === 'active'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 text-zinc-100">
      
      {/* Back button */}
      <button
        onClick={() => navigate('/collections')}
        className="text-xs uppercase tracking-widest text-zinc-400 hover:text-amber-300 transition-colors flex items-center space-x-2 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Collections</span>
      </button>

      {/* Hero Banner for Collection */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src={category.image}
            alt={category.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-300 uppercase tracking-widest px-3 py-1 bg-zinc-900/90 border border-amber-400/30 rounded-full backdrop-blur-md">
            {slug === 'moon' ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Layers className="w-3.5 h-3.5 text-sky-400" />}
            <span>{category.name}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light text-white leading-tight">
            {category.name}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            {category.description}
          </p>

          <div className="pt-2 flex items-center space-x-4 text-xs font-mono text-zinc-400">
            <span>{collectionProducts.length} Authenticated Pieces</span>
            <span>•</span>
            <span className="text-emerald-400">Insured Delivery</span>
          </div>
        </div>
      </div>

      {/* Interactive Feature for Moon or Infinity */}
      {slug === 'moon' && (
        <div className="max-w-3xl mx-auto">
          <LightingSimulator />
        </div>
      )}

      {/* Product Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-light text-white uppercase tracking-wider">
            Available Pieces in Vault
          </h2>
          <span className="text-xs font-mono text-zinc-400">
            {collectionProducts.length} Items
          </span>
        </div>

        <ProductGrid
          products={collectionProducts}
          columns={3}
          emptyMessage={`No items currently active in ${targetCategoryName}.`}
        />
      </div>
    </div>
  );
};
