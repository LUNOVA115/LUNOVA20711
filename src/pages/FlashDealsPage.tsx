import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Zap, 
  Sparkles, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Truck, 
  Star, 
  ArrowRight, 
  ShoppingBag, 
  Heart, 
  SlidersHorizontal,
  Layers,
  Moon,
  CheckCircle2,
  Lock,
  MessageCircle
} from 'lucide-react';
import { Product } from '../types';

export const FlashDealsPage: React.FC = () => {
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigate, 
    addToast,
    contactInfo,
    formatPrice 
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'discount' | 'price-asc' | 'price-desc' | 'rating'>('discount');

  // Live Flash Deal Countdown Timer (simulated rolling 48-hour event)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 42
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products that are marked as flash deals, or have a discounted original price
  const flashProducts = useMemo(() => {
    let list = products.filter(p => p.status === 'active' && (p.isFlashDeal || (p.originalPrice && p.originalPrice > p.price)));
    
    // If none are explicitly tagged, curate the active catalog with simulated flash privilege
    if (list.length === 0) {
      list = products.filter(p => p.status === 'active').slice(0, 4);
    }

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    return list.sort((a, b) => {
      const discountA = a.discountPercentage || (a.originalPrice ? Math.round(((a.originalPrice - (a.salePrice || a.price)) / a.originalPrice) * 100) : 15);
      const discountB = b.discountPercentage || (b.originalPrice ? Math.round(((b.originalPrice - (b.salePrice || b.price)) / b.originalPrice) * 100) : 15);
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === 'discount') return discountB - discountA;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, sortBy]);

  const categories = [
    { id: 'all', label: 'All Flash Deals' },
    { id: 'infinity', label: 'Infinity Tables' },
    { id: 'moon', label: 'Moon Lamps' }
  ];

  const rawPhone = contactInfo?.whatsappNumber || contactInfo?.phone || '+92 315 0360126';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '') || '923150360126';

  return (
    <div className="min-h-screen bg-[#07080b] text-zinc-100 pb-24 selection:bg-amber-400 selection:text-zinc-950">
      
      {/* 1. HERO PROMOTIONAL BANNER */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:py-20 border-b border-amber-500/20 bg-gradient-to-b from-amber-950/20 via-[#0a0c10] to-[#07080b]">
        {/* Ambient atmospheric backdrop lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-purple-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-orange-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono tracking-[0.2em] uppercase shadow-lg shadow-amber-500/10 animate-pulse">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Limited Architectural Vault Release</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Flash <span className="text-gold-gradient font-light italic">Privilege</span> Deals
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Direct atelier allocations offered at private promotional privileges. Each piece includes serialized authentication, custom crate packaging, and insured white-glove transit.
          </p>

          {/* Premium Countdown Clock */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center space-x-3 bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-4 px-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono uppercase tracking-wider mr-2">
                <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
                <span className="hidden sm:inline">Event Window:</span>
              </div>
              
              <div className="flex items-center space-x-2 font-mono">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <span className="text-[9px] text-zinc-500 uppercase mt-1">HRS</span>
                </div>
                <span className="text-amber-400 font-bold text-lg pb-4">:</span>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-[9px] text-zinc-500 uppercase mt-1">MIN</span>
                </div>
                <span className="text-amber-400 font-bold text-lg pb-4">:</span>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg font-bold text-amber-300 shadow-inner">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-[9px] text-amber-400 uppercase mt-1">SEC</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 bg-zinc-900/60 border border-zinc-800 px-4 py-3 rounded-2xl">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Up to <strong className="text-amber-300">30% Privilege</strong> on Select Showpieces</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FILTER & SORT BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Sort By:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="discount">Highest Discount %</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated (Stars)</option>
            </select>
          </div>

        </div>
      </section>

      {/* 3. FLASH DEALS PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {flashProducts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950/40 rounded-3xl border border-zinc-800/80 p-8 space-y-4">
            <Zap className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-xl font-serif text-white">No Active Flash Deals in this Category</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Check back soon for the next promotional cycle, or explore our complete catalog in the Shop.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider text-xs font-mono"
            >
              Explore Full Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flashProducts.map((product) => {
              const currentPrice = product.salePrice || product.price;
              const original = product.originalPrice || Math.round(currentPrice * 1.25);
              const discountPct = product.discountPercentage || Math.round(((original - currentPrice) / original) * 100);
              const savings = original - currentPrice;
              const inWish = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  className="group relative bg-[#0d0e14] rounded-3xl border border-zinc-800/90 hover:border-amber-500/50 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 flex flex-col overflow-hidden"
                >
                  {/* Top Image Container */}
                  <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-mono text-[11px] font-extrabold uppercase tracking-wider shadow-lg flex items-center space-x-1">
                        <Zap className="w-3 h-3 fill-zinc-950" />
                        <span>-{discountPct}% OFF</span>
                      </span>

                      {product.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 text-zinc-300 font-mono text-[10px]">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Quick Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-md transition-all z-10 ${
                        inWish 
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                          : 'bg-zinc-950/70 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-900'
                      }`}
                      title={inWish ? "Remove from wishlist" : "Save to wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                    </button>

                    {/* Stock Alert Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-[10px] font-mono flex items-center justify-between text-zinc-300">
                      <span className="flex items-center space-x-1.5 text-amber-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>Vault Stock: {product.stock} Units</span>
                      </span>
                      <span className="text-zinc-500">Limited Allocation</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-400/90 font-mono uppercase tracking-wider text-[11px]">
                          {product.category}
                        </span>
                        <div className="flex items-center space-x-1 text-amber-300 font-mono">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold">{product.rating}</span>
                          <span className="text-[10px] text-zinc-500">({product.reviewCount})</span>
                        </div>
                      </div>

                      <h3 
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="text-lg font-serif font-semibold text-white group-hover:text-amber-200 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Pricing & Savings calculation */}
                    <div className="pt-2 border-t border-zinc-800/80 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Flash Acquisition</div>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-white font-mono">
                              {formatPrice(currentPrice)}
                            </span>
                            <span className="text-xs text-zinc-500 line-through font-mono">
                              {formatPrice(original)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
                            Save {formatPrice(savings)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                            addToast(`"${product.name}" added to acquisition bag.`, 'success');
                          }}
                          className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-zinc-950 font-bold uppercase tracking-wider text-[11px] font-mono flex items-center justify-center space-x-1.5 shadow-md shadow-amber-400/20 transition-all hover:scale-[1.02] cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Acquire Deal</span>
                        </button>

                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="py-3 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-[11px] font-mono uppercase tracking-wider flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                        >
                          <span>View Specs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. LUXURY TRUST & CONCIERGE FOOTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900 border border-amber-500/20 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase font-mono tracking-wider">
                  Insured White-Glove Transit
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Every flash deal piece is securely crated and fully insured against transit shock.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase font-mono tracking-wider">
                  5-Year Atelier Warranty
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Full coverage on LED light guide plates, dielectric mirrors, and aerospace frames.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase font-mono tracking-wider">
                  Direct WhatsApp Inquiries
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Need custom dimensions or reserve a piece before allocation runs out?
                </p>
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello LUNOVA Concierge, I'd like to reserve a Flash Deal piece.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-emerald-400 text-xs font-mono font-bold mt-2 hover:underline"
                >
                  <span>Chat with Concierge →</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
