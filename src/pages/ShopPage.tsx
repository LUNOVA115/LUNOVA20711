import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductGrid } from '../components/common/ProductGrid';
import { 
  Filter, 
  RotateCcw, 
  Star, 
  SlidersHorizontal, 
  Sparkles,
  ArrowUpDown,
  Grid,
  Check,
  ChevronDown
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, categories, filters, setFilters, resetFilters, formatPrice } = useStore();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="w-full max-w-[calc(100%-1cm)] mx-auto py-8 sm:py-12 space-y-6 text-zinc-100">
      
      {/* Header Banner inside a soft light-black / dark charcoal rectangular box */}
      <div className="text-center w-full mx-auto space-y-2 py-3.5 sm:py-5 px-4 sm:px-8 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl shadow-xl backdrop-blur-sm">
        <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-amber-300 uppercase tracking-widest px-2.5 py-0.5 bg-zinc-950/80 border border-amber-400/30 rounded-full">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>FULL VAULT CATALOGUE</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-light text-white tracking-tight">
          Curated Cosmic Interiors
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
          Explore <strong className="font-semibold text-zinc-200">celestial shapes, artistic forms, and endless reflections</strong> — beautifully crafted to bring <strong className="font-semibold text-zinc-200">quiet luxury, modern elegance, and a distinctive character</strong> to every space.
        </p>
      </div>

      {/* 3 Rectangular Category Boxes in One Horizontal Row (Left-aligned & Compact, Short Height) */}
      <div className="w-full flex flex-row items-center justify-start gap-2 overflow-x-auto pb-0.5 pt-0.5">
        {[
          { label: `All Categories (${products.filter((p) => p.status === 'active').length})`, value: 'all' },
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
              className={`px-3 py-1 rounded-md border text-center transition-all duration-300 cursor-pointer whitespace-nowrap text-[11px] font-medium tracking-wide shadow-sm ${
                isSelected
                  ? 'bg-[#f2ece1] text-zinc-950 border-[#f2ece1] font-bold shadow-amber-900/20 scale-[1.01]'
                  : 'bg-zinc-900/90 border-zinc-800/90 text-zinc-300 hover:text-white hover:bg-zinc-800/90 hover:border-zinc-700'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Filter & Control Bar (Shorter in height & wider) */}
      <div className="w-full py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 shadow-2xl backdrop-blur-xl">
        
        {/* Top Status & Sort Row with Maximum Price on Far Right */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Results Count Display */}
          <div className="flex items-center text-xs sm:text-sm text-zinc-200 font-semibold tracking-wide">
            Showing {filteredProducts.length} results
          </div>

          {/* Right Group: Maximum Price Line & In Stock Only */}
          <div className="flex flex-wrap items-center justify-end gap-4 sm:gap-6">

            {/* Maximum Price Line (Far Right, 1.5cm slider, price at far right) */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-400 whitespace-nowrap">
                Max Price:
              </span>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                style={{ width: '3cm' }}
                className="h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400 shrink-0"
                title="Maximum Price"
              />
              <span className="font-mono text-amber-300 font-bold whitespace-nowrap">
                {formatPrice(filters.maxPrice)}
              </span>
            </div>

            {/* In Stock Only Checkbox */}
            <label className="flex items-center space-x-1.5 cursor-pointer text-zinc-300 hover:text-white text-xs select-none">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                className="w-3 h-3 rounded border-zinc-700 bg-zinc-900 text-amber-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-400"
              />
              <span className="text-xs font-medium whitespace-nowrap">In Stock only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 text-xs relative" ref={sortRef}>
              <span className="font-semibold text-zinc-400 whitespace-nowrap">Sort:</span>
              
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center justify-between space-x-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-200 hover:border-zinc-700 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>
                  {
                    [
                      { label: 'Popularity & Rating', value: 'bestseller' },
                      { label: 'Newest Arrivals', value: 'newest' },
                      { label: 'Price: Low to High', value: 'price-asc' },
                      { label: 'Price: High to Low', value: 'price-desc' }
                    ].find((o) => o.value === filters.sortBy)?.label || 'Popularity & Rating'
                  }
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-max min-w-full bg-zinc-900/95 border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-xl z-50 py-1.5 overflow-hidden text-xs">
                  {[
                    { label: 'Popularity & Rating', value: 'bestseller' },
                    { label: 'Newest Arrivals', value: 'newest' },
                    { label: 'Price: Low to High', value: 'price-asc' },
                    { label: 'Price: High to Low', value: 'price-desc' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, sortBy: opt.value as any }));
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 transition-colors flex items-center justify-between space-x-3 whitespace-nowrap cursor-pointer ${
                        filters.sortBy === opt.value
                          ? 'bg-zinc-800/80 text-amber-300 font-semibold'
                          : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {filters.sortBy === opt.value && (
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
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
