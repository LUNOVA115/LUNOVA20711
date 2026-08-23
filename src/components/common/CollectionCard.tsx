import React from 'react';
import { Category } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ArrowUpRight } from 'lucide-react';

interface CollectionCardProps {
  category: Category;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ category }) => {
  const { navigate } = useStore();

  const handleOpen = () => {
    navigate(`/collections/${category.slug}`);
  };

  return (
    <div
      onClick={handleOpen}
      className="group relative h-96 sm:h-[440px] rounded-3xl overflow-hidden border border-zinc-800 hover:border-amber-400/50 transition-all duration-700 cursor-pointer bg-zinc-950 flex flex-col justify-end p-6 sm:p-8 shadow-2xl"
    >
      {/* Background Image with Zoom & Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={category.image}
          alt={category.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-transparent transition-colors duration-500" />
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-widest text-amber-300 uppercase px-3 py-1 bg-zinc-900/80 border border-amber-400/30 rounded-full backdrop-blur-md">
            {category.itemCount} Masterpieces
          </span>
          <div className="w-10 h-10 rounded-full bg-zinc-900/80 border border-white/10 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-zinc-950 text-white flex items-center justify-center transition-all duration-300">
            <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white group-hover:text-amber-200 transition-colors">
          {category.name}
        </h3>

        <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed font-light">
          {category.description}
        </p>

        <div className="pt-2 flex items-center space-x-2 text-xs uppercase tracking-widest text-amber-300 font-semibold">
          <span>Explore Collection</span>
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
};
