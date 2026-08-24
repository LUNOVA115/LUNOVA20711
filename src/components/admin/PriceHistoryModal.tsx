import React, { useState } from 'react';
import { Product, PriceHistoryRecord } from '../../types';
import { PriceHistoryChart } from './PriceHistoryChart';
import { X, TrendingUp, Plus, DollarSign, Calendar, Tag, Trash2, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface PriceHistoryModalProps {
  product: Product;
  onClose: () => void;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({ product, onClose }) => {
  const { updateProduct, formatPrice, adminUser, addToast } = useStore();

  // New Price Log Form State
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newPrice, setNewPrice] = useState<number>(product.price);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(product.originalPrice || Math.round(product.price * 1.2));
  const [newSalePrice, setNewSalePrice] = useState<number | undefined>(product.salePrice);
  const [note, setNote] = useState<string>('');
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Submit new price record
  const handleAddPriceRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrice || newPrice <= 0) {
      addToast('Please enter a valid product price.', 'warning');
      return;
    }

    const newRecord: PriceHistoryRecord = {
      id: `ph-${product.id}-${Date.now().toString(36)}`,
      price: Number(newPrice),
      originalPrice: newOriginalPrice ? Number(newOriginalPrice) : undefined,
      salePrice: newSalePrice ? Number(newSalePrice) : undefined,
      date: logDate || new Date().toISOString().split('T')[0],
      changedBy: adminUser?.name || 'Store Admin',
      note: note.trim() || 'Manual Price Adjustment'
    };

    const currentHistory = product.priceHistory || [];
    const updatedHistory = [...currentHistory, newRecord].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const updatedProduct: Product = {
      ...product,
      price: Number(newPrice),
      originalPrice: newOriginalPrice ? Number(newOriginalPrice) : undefined,
      salePrice: newSalePrice ? Number(newSalePrice) : undefined,
      priceHistory: updatedHistory
    };

    updateProduct(updatedProduct);
    addToast(`Price adjustment recorded for "${product.name}".`, 'success');
    
    // Reset form
    setNote('');
    setIsAddFormOpen(false);
  };

  // Remove a log entry
  const handleRemoveRecord = (recordId: string) => {
    const currentHistory = product.priceHistory || [];
    if (currentHistory.length <= 1) {
      addToast('Cannot remove the only price history log record.', 'warning');
      return;
    }

    const updatedHistory = currentHistory.filter((r) => r.id !== recordId);
    
    // Determine last price from remaining history
    const lastRecord = updatedHistory[updatedHistory.length - 1];

    const updatedProduct: Product = {
      ...product,
      price: lastRecord ? lastRecord.price : product.price,
      priceHistory: updatedHistory
    };

    updateProduct(updatedProduct);
    addToast('Price history entry removed.', 'info');
  };

  const historyList = [...(product.priceHistory || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#121318] border border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
          <div className="flex items-center space-x-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover border border-zinc-700 bg-zinc-950"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white max-w-md truncate">{product.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {product.category}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5 flex items-center space-x-2">
                <span>SKU: {product.sku || product.id}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">Active: {formatPrice(product.salePrice || product.price)}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Main Line Graph Chart */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Price History & Trend Analysis
                </h4>
              </div>
              
              <button
                onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isAddFormOpen
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    : 'bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-md shadow-amber-400/20'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddFormOpen ? 'Cancel' : '+ Log Price Adjustment'}</span>
              </button>
            </div>

            {/* Line Chart */}
            <PriceHistoryChart product={product} height={220} showStats={true} />
          </div>

          {/* New Price Adjustment Entry Form */}
          {isAddFormOpen && (
            <form onSubmit={handleAddPriceRecord} className="bg-zinc-900 border border-amber-400/40 rounded-2xl p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Log New Price Adjustment Record
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    New Active Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    Original MSRP Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={newOriginalPrice || ''}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono focus:border-amber-400 focus:outline-none"
                    placeholder="Optional list price"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Adjustment Reason / Note
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. End of Summer Promotion, Vendor Material Reduction, Catalog Realignment"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-sans focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-mono text-xs hover:bg-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Price Adjustment</span>
                </button>
              </div>
            </form>
          )}

          {/* Historical Logs Table */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden">
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Historical Adjustments Timeline ({historyList.length})</span>
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/80 border-b border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase">
                    <th className="py-3 px-4">DATE</th>
                    <th className="py-3 px-4">EFFECTIVE PRICE</th>
                    <th className="py-3 px-4">LIST / MSRP</th>
                    <th className="py-3 px-4">REASON & REASONING</th>
                    <th className="py-3 px-4">LOGGED BY</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono text-xs">
                  {historyList.map((rec) => (
                    <tr key={rec.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-4 text-zinc-300 font-bold whitespace-nowrap">
                        {rec.date}
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-300 whitespace-nowrap">
                        {formatPrice(rec.salePrice || rec.price)}
                      </td>
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {rec.originalPrice ? formatPrice(rec.originalPrice) : '—'}
                      </td>
                      <td className="py-3 px-4 text-zinc-300 font-sans">
                        <span className="bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-[11px] inline-block">
                          {rec.note || 'Manual price revision'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap text-[11px]">
                        {rec.changedBy || 'Admin'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveRecord(rec.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-colors cursor-pointer"
                          title="Remove entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
