import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductGrid } from '../components/common/ProductGrid';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  Star, 
  SlidersHorizontal, 
  Sparkles,
  ArrowUpDown,
  Grid,
  Check
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, categories, filters, setFilters, resetFilters, formatPrice } = useStore();

  const handleCategorySelect = (catName: string) => {
    setFilters((prev) => ({ ...prev, category: catName }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }));
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Status filter
      if (p.status !== 'active') return false;

      // Search query
      if (filters.search.trim() !== '') {
        const q = filters.search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchDesc) return false;
      }

      // Category
      if (filters.category !== 'all') {
        const catFilter = filters.category.toLowerCase();
        const prodCat = p.category.toLowerCase();
        if (catFilter.includes('moon') && !prodCat.includes('moon')) {
          return false;
        } else if (catFilter.includes('infinity') && !prodCat.includes('infinity')) {
          return false;
        } else if (!catFilter.includes('moon') && !catFilter.includes('infinity') && prodCat !== catFilter) {
          return false;
        }
      }

      // Price
      if (p.price < filters.minPrice || p.price > filters.maxPrice) {
        return false;
      }

      // Rating
      if (filters.minRating > 0 && p.rating < filters.minRating) {
        return false;
      }

      // In stock
      if (filters.inStockOnly && p.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // Default: bestseller first
      return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    });
  }, [products, filters]);

  const activeCategoryObject = categories.find(
    (c) => c.name.toLowerCase() === filters.category.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 text-zinc-100">
      
      {/* Header Banner inside a soft light-black / dark charcoal rectangular box */}
      <div className="text-center max-w-3xl mx-auto space-y-4 p-6 sm:p-10 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl sm:rounded-3xl shadow-xl backdrop-blur-sm">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-300 uppercase tracking-widest px-3 py-1 bg-zinc-950/80 border border-amber-400/30 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>FULL VAULT CATALOGUE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
          Curated Cosmic Interiors
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
          Explore <strong className="font-semibold text-zinc-200">celestial shapes, artistic forms, and endless reflections</strong> — beautifully crafted to bring <strong className="font-semibold text-zinc-200">quiet luxury, modern elegance, and a distinctive character</strong> to every space.
        </p>
      </div>

      {/* 3 Rectangular Category Boxes in One Horizontal Row (Left-aligned & Compact) */}
      <div className="flex flex-row items-center justify-start gap-2.5 sm:gap-3 overflow-x-auto pb-1 pt-1">
        {[
          { label: 'All Categories', value: 'all' },
          { label: 'Moon Collections', value: 'Moon Collection' },
          { label: 'Infinity Collections', value: 'Infinity Collection' }
        ].map((item) => {
          const isSelected = item.value === 'all'
            ? filters.category === 'all'
            : filters.category.toLowerCase().includes(item.value.toLowerCase().split(' ')[0]);

          return (
            <button
              key={item.label}
              onClick={() => handleCategorySelect(item.value)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border text-center transition-all duration-300 cursor-pointer whitespace-nowrap text-[11px] sm:text-xs font-medium tracking-wide shadow-sm ${
                isSelected
                  ? 'bg-[#f2ece1] text-zinc-950 border-[#f2ece1] font-bold shadow-amber-900/20 scale-[1.02]'
                  : 'bg-zinc-900/90 border-zinc-800/90 text-zinc-300 hover:text-white hover:bg-zinc-800/90 hover:border-zinc-700'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Filter & Control Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800/90 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Top Search & Sort Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Bar Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search by name, material, illumination mode..."
              className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-3">
            <div className="relative min-w-[190px]">
              <select
                value={filters.sortBy}
                onChange={handleSortChange}
                className="w-full appearance-none px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-medium text-zinc-200 focus:outline-none focus:border-amber-400 pr-10 cursor-pointer"
              >
                <option value="bestseller">Sort by: Curated & Popular</option>
                <option value="price-asc">Sort by: Price: Low to High</option>
                <option value="price-desc">Sort by: Price: High to Low</option>
                <option value="rating">Sort by: Highest Rated (5★)</option>
                <option value="newest">Sort by: Newest Releases</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset Filters Button */}
            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="p-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-amber-300 rounded-2xl transition-colors text-zinc-400"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills & Quick Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-xl border transition-all shrink-0 font-medium ${
              filters.category === 'all'
                ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold shadow-lg shadow-amber-400/20'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            All Pieces ({products.filter((p) => p.status === 'active').length})
          </button>

          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.category.toLowerCase() === cat.name.toLowerCase() && p.status === 'active'
            ).length;
            const isSelected = filters.category.toLowerCase() === cat.name.toLowerCase();

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`px-4 py-2 rounded-xl border transition-all shrink-0 font-medium ${
                  isSelected
                    ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold shadow-lg shadow-amber-400/20'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Controls (Price, Rating, In-Stock) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/60 text-xs">
          
          {/* Price Range Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Maximum Price:</span>
              <span className="font-mono text-amber-300 font-bold">{formatPrice(filters.maxPrice)}</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="50"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Min Rating Filter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Minimum Rating:</span>
              <span className="font-mono text-amber-300 font-bold">
                {filters.minRating === 0 ? 'Any Rating' : `${filters.minRating}★ & Above`}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              {[0, 4.5, 4.8, 4.9].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setFilters((prev) => ({ ...prev, minRating: rate }))}
                  className={`flex-1 py-1.5 rounded-lg border text-center font-mono ${
                    filters.minRating === rate
                      ? 'bg-zinc-800 border-amber-400 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {rate === 0 ? 'All' : `${rate}★`}
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div className="flex items-center justify-between sm:justify-end space-x-3 pt-4 sm:pt-0">
            <label className="flex items-center space-x-2.5 cursor-pointer text-zinc-300 hover:text-white">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-400 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs font-medium">Vault Ready (In-Stock Only)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Result Status Count */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-2">
        <span>
          Displaying <strong className="text-white font-mono">{filteredProducts.length}</strong> architectural piece(s)
        </span>
        {filters.category !== 'all' && (
          <span className="text-amber-300">Filtered to {filters.category}</span>
        )}
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={filteredProducts}
        columns={4}
        emptyMessage="No pieces matched your selected filters. Try broadening your price or category parameters."
      />
    </div>
  );
};
