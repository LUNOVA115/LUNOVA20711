import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { X, Trash2, ShoppingBag, Eye, Star, Sparkles, Check, ChevronUp, ChevronDown, SlidersHorizontal, ArrowLeftRight } from 'lucide-react';

export const ComparePanel: React.FC = () => {
  const { 
    products, 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    isCompareOpen, 
    setIsCompareOpen, 
    formatPrice, 
    addToCart, 
    navigate 
  } = useStore();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  if (!isCompareOpen || compareList.length === 0) {
    return null;
  }

  const compareProducts: Product[] = compareList
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);

  const emptySlotCount = Math.max(0, 3 - compareProducts.length);

  return (
    <>
      {/* Bottom Sticky Comparison Panel (4-5cm tall bar) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          isMinimized ? 'translate-y-[calc(100%-42px)]' : 'translate-y-0'
        }`}
      >
        <div className="w-full bg-[#12131A]/95 border-t border-zinc-800/90 shadow-[0_-15px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-white">
          
          {/* Header Bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-zinc-800/50">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-100 flex items-center space-x-2">
                <span>Side-by-Side Product Comparison</span>
                <span className="font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 text-xs">
                  ({compareProducts.length}/3)
                </span>
              </h3>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {compareProducts.length >= 2 && (
                <button
                  onClick={() => setIsMatrixModalOpen(true)}
                  className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-zinc-950 font-mono text-[11px] font-bold tracking-wider uppercase flex items-center space-x-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Compare Full Specs</span>
                  <span className="sm:hidden">Compare</span>
                </button>
              )}

              <button
                onClick={clearCompare}
                className="px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-rose-400 transition-colors flex items-center space-x-1 cursor-pointer"
                title="Clear all selected items"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Clear All</span>
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                title={isMinimized ? "Expand Panel" : "Minimize Panel"}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                title="Close Comparison Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panel Content Body (Selected Products Grid) */}
          {!isMinimized && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Active Selected Products */}
                {compareProducts.map((prod) => (
                  <div 
                    key={prod.id}
                    className="relative bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-2.5 flex items-center space-x-3 group hover:border-amber-400/40 transition-all"
                  >
                    {/* Image Thumbnail */}
                    <div 
                      onClick={() => navigate(`/product/${prod.id}`)}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 shrink-0 flex items-center justify-center p-1 cursor-pointer overflow-hidden group-hover:border-amber-400/30"
                    >
                      <img 
                        src={prod.images[0]} 
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Basic Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-amber-300/80 block line-clamp-1">
                        {prod.category}
                      </span>
                      <h4 
                        onClick={() => navigate(`/product/${prod.id}`)}
                        className="text-xs font-semibold text-white truncate hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        {prod.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {formatPrice(prod.price)}
                        </span>
                        <div className="flex items-center space-x-0.5 text-[10px] text-zinc-400">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                          <span>{prod.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Remove Button */}
                    <button
                      onClick={() => removeFromCompare(prod.id)}
                      className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-rose-400 rounded-full hover:bg-zinc-900 transition-colors cursor-pointer"
                      title="Remove product from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: emptySlotCount }).map((_, idx) => (
                  <div 
                    key={`empty-${idx}`}
                    className="border border-dashed border-zinc-800/80 rounded-2xl p-2.5 flex items-center justify-center space-x-2 text-zinc-500 bg-zinc-950/20"
                  >
                    <SlidersHorizontal className="w-4 h-4 opacity-40 text-amber-400" />
                    <span className="text-xs font-mono tracking-wide text-zinc-500">
                      Select item to compare ({compareProducts.length + idx + 1}/3)
                    </span>
                  </div>
                ))}

              </div>
            </div>
          )}

        </div>
      </div>

      {/* Side-by-Side Detailed Comparison Matrix Modal */}
      {isMatrixModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#12131A] border border-zinc-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 text-white space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    Side-by-Side Product Specifications
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    Comparing {compareProducts.length} architectural lighting pieces
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMatrixModalOpen(false)}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-Side Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px] grid grid-cols-3 gap-4 divide-x divide-zinc-800/80">
                {compareProducts.map((p) => (
                  <div key={p.id} className="px-3 first:pl-0 space-y-4">
                    {/* Header Image & Title */}
                    <div className="space-y-2 text-center">
                      <div className="w-full aspect-square rounded-2xl bg-zinc-950 border border-zinc-800/80 p-4 flex items-center justify-center">
                        <img 
                          src={p.images[0]} 
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-mono uppercase text-amber-300 tracking-widest block">
                        {p.category}
                      </span>
                      <h3 className="font-semibold text-sm text-white line-clamp-1">
                        {p.name}
                      </h3>
                      <div className="text-base font-mono font-bold text-amber-400">
                        {formatPrice(p.price)}
                      </div>
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="w-full py-2 px-3 rounded-xl bg-amber-400 text-zinc-950 hover:bg-amber-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-amber-400/20"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Acquire Piece</span>
                      </button>
                    </div>

                    {/* Spec Attributes List */}
                    <div className="space-y-3 pt-2 text-xs border-t border-zinc-800/60">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">
                          Rating & Reviews
                        </span>
                        <div className="flex items-center space-x-1 text-amber-400 font-mono font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{p.rating}</span>
                          <span className="text-zinc-500 font-normal">({p.reviewCount} reviews)</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">
                          Short Description
                        </span>
                        <p className="text-zinc-300 leading-relaxed text-[11px] font-light">
                          {p.shortDescription}
                        </p>
                      </div>

                      {p.dimensions && (
                        <div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">
                            Dimensions
                          </span>
                          <span className="text-zinc-200 font-mono">{p.dimensions}</span>
                        </div>
                      )}

                      {p.material && (
                        <div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">
                            Craft & Material
                          </span>
                          <span className="text-zinc-200">{p.material}</span>
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">
                          Status
                        </span>
                        <span className={p.stock > 0 ? "text-emerald-400 font-mono font-semibold" : "text-rose-400 font-mono"}>
                          {p.stock > 0 ? `In Stock (${p.stock} available)` : "Vault Reserved"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setIsMatrixModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs cursor-pointer"
              >
                Close Comparison
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
