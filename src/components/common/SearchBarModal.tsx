import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, Star, ArrowRight, Sparkles } from 'lucide-react';

export const SearchBarModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, navigate } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim() === ''
    ? products.slice(0, 4) // Show top items
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleCategoryShortcut = (cat: string) => {
    setIsSearchOpen(false);
    if (cat === 'moon') navigate('/collections/moon');
    else if (cat === 'infinity') navigate('/collections/infinity');
    else navigate('/shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 3D Moon Lamps, Infinity Tables, Topography..."
            className="w-full bg-transparent border-none text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <span className="text-xs font-mono uppercase bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">ESC</span>
          </button>
        </div>

        {/* Quick Category Tags */}
        <div className="px-5 py-3 bg-zinc-900/50 border-b border-zinc-800/60 flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-zinc-400 text-[11px] uppercase tracking-wider shrink-0 font-medium">
            Quick Explorations:
          </span>
          <button
            onClick={() => handleCategoryShortcut('moon')}
            className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-amber-300 hover:border-amber-400 hover:bg-zinc-800 transition-colors shrink-0"
          >
            3D Moon Lamps
          </button>
          <button
            onClick={() => handleCategoryShortcut('infinity')}
            className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-sky-300 hover:border-sky-400 hover:bg-zinc-800 transition-colors shrink-0"
          >
            Infinity Tables
          </button>
          <button
            onClick={() => handleCategoryShortcut('all')}
            className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
          >
            All Pieces
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 sm:p-5 divide-y divide-zinc-900">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-3">
            {query ? `Search Results (${filtered.length})` : 'Curated Featured Pieces'}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-10 text-zinc-400 text-sm">
              No matching pieces found for "{query}". Try "Moon", "Infinity", or "Gold".
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectProduct(item.id)}
                className="py-3 first:pt-0 flex items-center justify-between group cursor-pointer hover:bg-zinc-900/40 p-2 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-14 rounded-lg bg-zinc-900 border border-zinc-800 p-1 shrink-0 overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-zinc-400 mt-0.5">
                      <span className="text-amber-400/80 uppercase text-[10px] tracking-wider font-semibold">
                        {item.category}
                      </span>
                      <span>•</span>
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-mono text-xs">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold font-mono text-white">
                    ${item.price.toLocaleString()}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 group-hover:bg-amber-400 group-hover:text-zinc-950 text-zinc-400 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 text-xs flex items-center justify-between text-zinc-400">
          <span className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct museum fulfillment with certificate of authenticity</span>
          </span>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              navigate('/shop');
            }}
            className="text-amber-300 hover:underline uppercase text-[11px] tracking-wider font-semibold"
          >
            Open Full Filtered Shop →
          </button>
        </div>
      </div>
    </div>
  );
};
