import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Star, Heart, ShoppingBag, Eye, Zap, Sparkles, Box } from 'lucide-react';


interface ProductCardProps {
  product: Product;
  featuredLayout?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, featuredLayout = false }) => {
  const { navigate, addToCart, toggleWishlist, isInWishlist, formatPrice } = useStore();

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-gradient-to-b from-[#0F1018]/90 via-[#0B0C12]/95 to-[#07080B] rounded-3xl border border-zinc-800/80 hover:border-amber-400/50 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/15 ${
        featuredLayout ? 'p-6 sm:p-7' : 'p-4 sm:p-5'
      }`}
    >
      {/* Ambient background glow on hover */}
      <div className="absolute -inset-px bg-gradient-to-tr from-amber-500/0 via-amber-400/10 to-sky-500/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-400/40 group-hover:border-amber-400 transition-colors" />
      </div>

      {/* Top Badges & Wishlist Trigger */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5 items-center">
          {product.bestseller && (
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full backdrop-blur-md flex items-center space-x-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Flagship</span>
            </span>
          )}
          {product.badge && !product.bestseller && (
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-mono font-semibold tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-full backdrop-blur-md">
              {product.badge}
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full backdrop-blur-md">
              Vault Reserved
            </span>
          )}
        </div>

        <button
          onClick={handleWishlist}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            isSaved
              ? 'bg-amber-400 text-zinc-950 shadow-lg shadow-amber-400/40 scale-105'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 hover:border-amber-400/40'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-zinc-950' : ''}`} />
        </button>
      </div>

      {/* Product Image Frame with Museum Exhibition Pedestal Glow */}
      <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-b from-[#08090D] to-[#040508] border border-white/5 overflow-hidden flex items-center justify-center p-3 mb-4 group-hover:border-amber-400/30 transition-all duration-500">
        
        {/* Soft Radial Ambient Spotlight Behind Image */}
        <div className="absolute inset-0 bg-radial from-amber-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain transform group-hover:scale-108 transition-transform duration-700 ease-out relative z-10"
        />

        {/* 3D Indicator Tag */}
        <div className="absolute bottom-2.5 left-2.5 z-15 px-2 py-0.5 rounded-md bg-zinc-950/80 border border-zinc-800 text-[9px] font-mono text-zinc-400 flex items-center space-x-1 backdrop-blur-md group-hover:border-amber-400/40 group-hover:text-amber-300 transition-colors">
          <Box className="w-2.5 h-2.5 text-amber-400" />
          <span>3D</span>
        </div>

        {/* Quick View & Action Overlay on Hover */}
        <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-3 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            className="px-3.5 py-2 rounded-xl bg-zinc-900/90 text-zinc-200 hover:text-white border border-zinc-700 hover:border-amber-400 text-[11px] tracking-widest uppercase font-mono flex items-center space-x-1.5 transition-all shadow-xl hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Details</span>
          </button>
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-zinc-950 hover:from-amber-300 hover:to-amber-200 text-[11px] tracking-widest uppercase font-mono font-bold flex items-center space-x-1.5 transition-all shadow-xl shadow-amber-400/20 hover:scale-105"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Acquire</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="relative z-10 flex flex-col flex-grow justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="uppercase tracking-[0.2em] text-[10px] text-amber-300/90 font-mono font-semibold">
              {product.category}
            </span>
            <div className="flex items-center space-x-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-zinc-200 font-mono font-bold text-xs">{product.rating}</span>
              <span className="text-zinc-500 text-[10px] font-mono">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-white tracking-wide group-hover:text-amber-300 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-light">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Primary CTA */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-white font-mono">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-500 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.stock <= 4 && product.stock > 0 && (
              <span className="text-[10px] text-amber-400/90 font-mono mt-0.5">
                ★ Only {product.stock} pieces in casting
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-amber-400 hover:text-zinc-950 text-zinc-300 border border-zinc-800 hover:border-amber-400 transition-all duration-300 shadow-md group-hover:scale-105"
            title="Add Piece to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
