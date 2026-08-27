import React from 'react';
import { useStore } from '../context/StoreContext';
import { CollectionCard } from '../components/common/CollectionCard';
import { Compass } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const { categories } = useStore();

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
        {categories.map((category, idx) => (
          <CollectionCard key={category.id} category={category} index={idx} />
        ))}
      </div>
    </div>
  );
};

