import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Product } from '../../types';
import { 
  Boxes, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Minus, 
  TrendingDown, 
  PackageCheck,
  RefreshCw,
  Edit2,
  Sliders,
  DollarSign
} from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const { products, updateProduct, categories, addToast, navigate } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [editingThresholdId, setEditingThresholdId] = useState<string | null>(null);
  const [customThresholdVal, setCustomThresholdVal] = useState<number>(5);

  // Quick Stock adjuster
  const handleAdjustStock = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    const updated: Product = {
      ...product,
      stock: newStock
    };
    updateProduct(updated);
    addToast(
      `${product.name}: Stock updated to ${newStock} units (${delta > 0 ? `+${delta}` : delta})`,
      newStock === 0 ? 'warning' : 'success'
    );
  };

  // Direct Stock Input
  const handleDirectStockChange = (product: Product, value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 0) return;
    updateProduct({ ...product, stock: parsed });
  };

  // Update Low Stock Threshold
  const handleSaveThreshold = (product: Product) => {
    updateProduct({ ...product, lowStockThreshold: customThresholdVal });
    setEditingThresholdId(null);
    addToast(`Threshold for ${product.name} set to ${customThresholdVal} units`, 'info');
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const threshold = p.lowStockThreshold || 5;

      // Search match
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches = 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category match
      if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Stock status filter
      if (stockFilter === 'out_of_stock' && p.stock !== 0) return false;
      if (stockFilter === 'low_stock' && (p.stock === 0 || p.stock > threshold)) return false;
      if (stockFilter === 'in_stock' && p.stock <= threshold) return false;

      return true;
    });
  }, [products, searchTerm, selectedCategory, stockFilter]);

  // Inventory Statistics
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5)).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const inventoryValuation = products.reduce((acc, p) => acc + (p.stock * p.price), 0);

  return (
    <AdminLayout
      activeSection="inventory"
      title="Inventory & Stock Operations"
      subtitle="Live warehouse telemetry, threshold automation, and rapid stock adjustments."
      actionButton={
        <button
          onClick={() => navigate('/admin/products/new')}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Piece</span>
        </button>
      }
    >
      <div className="space-y-6 text-xs">
        
        {/* =========================================================================
            INVENTORY KPI METRIC CARDS
        ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Units */}
          <div className="bg-[#121318] border border-zinc-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-mono uppercase font-semibold">Total Vault Units</span>
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-2">
              {totalUnits.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Across {products.length} catalog items</div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-[#121318] border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden ring-1 ring-amber-500/10">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[11px] font-mono uppercase font-semibold">Low Stock Threshold</span>
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono mt-2">
              {lowStockCount} Items
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Requires factory replenishment</div>
          </div>

          {/* Out of Stock */}
          <div className="bg-[#121318] border border-rose-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden ring-1 ring-rose-500/10">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-[11px] font-mono uppercase font-semibold">Stockouts (Zero Units)</span>
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono mt-2">
              {outOfStockCount} Items
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Disabled on public client store</div>
          </div>

          {/* Inventory Valuation */}
          <div className="bg-[#121318] border border-zinc-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-mono uppercase font-semibold">Inventory Valuation</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-300 font-mono mt-2">
              Rs. {inventoryValuation.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Real-time MSRP asset capital</div>
          </div>

        </div>

        {/* =========================================================================
            SEARCH & FILTER CONTROLS
        ========================================================================= */}
        <div className="bg-[#121318] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, SKU, category..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Stock Level Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock Only</option>
              <option value="low_stock">Low Stock Alerts Only ({lowStockCount})</option>
              <option value="out_of_stock">Out of Stock ({outOfStockCount})</option>
            </select>

            {(searchTerm || selectedCategory !== 'all' || stockFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setStockFilter('all');
                }}
                className="px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            INVENTORY TABLE
        ========================================================================= */}
        <div className="bg-[#121318] border border-zinc-800/80 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                  <th className="py-4 px-5">PRODUCT & SKU</th>
                  <th className="py-4 px-4">CATEGORY</th>
                  <th className="py-4 px-4 text-center">CURRENT STOCK</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4">LOW STOCK THRESHOLD</th>
                  <th className="py-4 px-4 text-right">QUICK STOCK ADJUSTERS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500">
                      No inventory items match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const threshold = p.lowStockThreshold || 5;
                    const sku = p.sku || `SKU-${p.id.replace('prod-', 'LN-')}`;
                    
                    const isOutOfStock = p.stock === 0;
                    const isLowStock = p.stock > 0 && p.stock <= threshold;

                    return (
                      <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                        
                        {/* Product & SKU */}
                        <td className="py-4 px-5">
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-zinc-800 shrink-0 bg-zinc-950"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-white truncate max-w-xs">{p.name}</div>
                              <div className="text-[10px] font-mono text-amber-400 mt-0.5">{sku}</div>
                              <div className="text-[10px] text-zinc-400 font-mono">Rs. {p.price.toLocaleString()}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 text-zinc-300 font-medium">
                          {p.category}
                        </td>

                        {/* Current Stock */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center space-x-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-700/80">
                            <input
                              type="number"
                              min="0"
                              value={p.stock}
                              onChange={(e) => handleDirectStockChange(p, e.target.value)}
                              className="w-12 bg-transparent text-center font-mono font-bold text-white focus:outline-none focus:text-amber-400"
                            />
                            <span className="text-[10px] text-zinc-500 font-mono">units</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                              <XCircle className="w-3 h-3" />
                              <span>OUT OF STOCK</span>
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
                              <AlertTriangle className="w-3 h-3" />
                              <span>LOW STOCK ({p.stock} left)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>IN STOCK</span>
                            </span>
                          )}
                        </td>

                        {/* Threshold Control */}
                        <td className="py-4 px-4">
                          {editingThresholdId === p.id ? (
                            <div className="flex items-center space-x-1.5">
                              <input
                                type="number"
                                min="1"
                                value={customThresholdVal}
                                onChange={(e) => setCustomThresholdVal(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-14 px-2 py-1 bg-zinc-900 border border-amber-400 rounded-lg text-white font-mono text-center focus:outline-none"
                              />
                              <button
                                onClick={() => handleSaveThreshold(p)}
                                className="px-2 py-1 rounded-lg bg-amber-400 text-zinc-950 font-bold font-mono text-[10px]"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={() => {
                                setEditingThresholdId(p.id);
                                setCustomThresholdVal(threshold);
                              }}
                              className="group inline-flex items-center space-x-2 cursor-pointer text-zinc-400 hover:text-amber-300 font-mono"
                              title="Click to edit warning threshold"
                            >
                              <span>≤ {threshold} units</span>
                              <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </td>

                        {/* Quick Stock Adjust Buttons */}
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center space-x-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
                            <button
                              onClick={() => handleAdjustStock(p, -5)}
                              disabled={p.stock === 0}
                              className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-rose-500/20 hover:text-rose-300 text-zinc-400 font-mono text-[10px] font-semibold disabled:opacity-40 disabled:pointer-events-none transition-colors"
                              title="Decrease 5"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleAdjustStock(p, -1)}
                              disabled={p.stock === 0}
                              className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-rose-500/20 hover:text-rose-300 text-zinc-400 font-mono text-[10px] font-semibold disabled:opacity-40 disabled:pointer-events-none transition-colors"
                              title="Decrease 1"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleAdjustStock(p, 1)}
                              className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-400 font-mono text-[10px] font-semibold transition-colors"
                              title="Add 1"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleAdjustStock(p, 5)}
                              className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-400 font-mono text-[10px] font-semibold transition-colors"
                              title="Add 5"
                            >
                              +5
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
