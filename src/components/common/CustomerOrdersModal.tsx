import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  Copy, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';

export const CustomerOrdersModal: React.FC = () => {
  const {
    isCustomerOrdersModalOpen,
    setIsCustomerOrdersModalOpen,
    orders,
    navigate,
    addToast,
    contactInfo
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  if (!isCustomerOrdersModalOpen) return null;

  const cleanQuery = searchQuery.trim().toLowerCase();

  // Find matching orders by ID, Phone, Email, or Tracking Number
  const matchedOrders = cleanQuery
    ? orders.filter((o) => {
        const idMatch = o.id.toLowerCase().includes(cleanQuery);
        const nameMatch = o.customer?.name?.toLowerCase().includes(cleanQuery);
        const emailMatch = o.customer?.email?.toLowerCase().includes(cleanQuery);
        const phoneMatch = o.customer?.phone?.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, ''));
        const trackingMatch = o.trackingNumber?.toLowerCase().includes(cleanQuery);
        return idMatch || nameMatch || emailMatch || (cleanQuery.length > 3 && phoneMatch) || trackingMatch;
      })
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanQuery) {
      addToast('Please enter an Order ID, Phone number, or Email.', 'info');
      return;
    }
    setHasSearched(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    addToast(`Copied ${label} to clipboard`, 'success');
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'delivered':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/40">
            <Truck className="w-3 h-3" />
            <span>In Transit</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
            <Clock className="w-3 h-3" />
            <span>Processing</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-700/50 text-zinc-300 border border-zinc-700">
            <Clock className="w-3 h-3" />
            <span>Received</span>
          </span>
        );
    }
  };

  const whatsappNumber = contactInfo?.whatsappNumber || '+92 315 0360126';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative bg-[#0d0e12] border border-zinc-800/90 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-black/90 text-zinc-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Track Your Order & Delivery</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Live courier status & dispatch updates for your bespoke piece
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCustomerOrdersModalOpen(false);
              setSearchQuery('');
              setHasSearched(false);
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar Bar */}
        <div className="p-4 sm:p-6 bg-zinc-950/40 border-b border-zinc-800/60">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setHasSearched(true);
                  }
                }}
                placeholder="Enter Order ID (e.g. ORD-78241), Phone, or Email..."
                className="w-full pl-10 pr-4 py-3 bg-zinc-900/90 border border-zinc-700/80 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-amber-400/20 flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
          </form>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {cleanQuery && matchedOrders.length > 0 ? (
            matchedOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700 transition-all space-y-4 text-xs shadow-lg"
              >
                {/* Top Details */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3.5">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-white text-sm">
                        Order #{order.id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(order.id, 'Order ID')}
                        className="p-1 text-zinc-400 hover:text-amber-300 transition-colors"
                        title="Copy Order ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      Commissioned on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    {getStatusBadge(order.orderStatus)}
                    <span className="font-mono font-bold text-amber-300 text-sm">
                      Rs. {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Tracking Code & Carrier */}
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/70 flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Insured Courier Carrier
                    </div>
                    <div className="text-zinc-200 font-medium flex items-center space-x-1.5">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{order.carrier || 'FedEx Insured White-Glove'}</span>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="text-right space-y-0.5">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                        Waybill Tracking #
                      </div>
                      <div className="font-mono font-bold text-white flex items-center space-x-1.5">
                        <span>{order.trackingNumber}</span>
                        <button
                          onClick={() => copyToClipboard(order.trackingNumber || '', 'Tracking Number')}
                          className="text-zinc-400 hover:text-amber-300 transition-colors"
                          title="Copy Tracking Number"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    Purchased Pieces ({order.items.length})
                  </div>
                  {order.items.map((item: any, idx: number) => {
                    const itemName = item.productName || item.product?.name || 'Handcrafted Lighting';
                    const itemImg = item.productImage || item.product?.images?.[0] || '';
                    const itemPrice = item.price || item.product?.price || 0;
                    const itemQty = item.quantity || 1;

                    return (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/40 border border-zinc-800/50">
                        <div className="flex items-center space-x-3">
                          {itemImg ? (
                            <img
                              src={itemImg}
                              alt={itemName}
                              className="w-11 h-11 rounded-lg object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 shrink-0">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-zinc-200 line-clamp-1">{itemName}</div>
                            <div className="text-[10px] text-zinc-400">
                              Qty: {itemQty} {item.selectedColorTemp && `• ${item.selectedColorTemp}`}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono font-medium text-zinc-300 text-right shrink-0">
                          Rs. {(itemPrice * itemQty).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shipping Coordinates & Payment Method */}
                <div className="pt-2 border-t border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-400">
                  <div className="flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      Destination: {order.shippingAddress?.street ? `${order.shippingAddress.street}, ${order.shippingAddress.city}` : 'Atelier Direct Dispatch'}
                    </span>
                  </div>
                  <div className="sm:text-right">
                    Payment: <span className="text-zinc-200 font-medium">{order.paymentMethod}</span> ({order.paymentStatus})
                  </div>
                </div>
              </div>
            ))
          ) : cleanQuery && hasSearched ? (
            <div className="py-12 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto" />
              <div className="text-white font-semibold text-sm">No matching order found for "{searchQuery}"</div>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Please verify your Order ID (format: ORD-XXXXX) or the phone number / email entered during checkout.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Contact Atelier WhatsApp Support</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white">Instant Guest Order Tracking</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  No account or login required. Simply enter your Order ID, contact phone number, or email address above.
                </p>
              </div>

              {/* Recent Orders in System preview if any */}
              {orders.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider px-1">
                    Recently Commissioned Orders (Click to View)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {orders.slice(0, 4).map((recentOrder) => (
                      <button
                        key={recentOrder.id}
                        type="button"
                        onClick={() => {
                          setSearchQuery(recentOrder.id);
                          setHasSearched(true);
                        }}
                        className="p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-400/40 text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="font-mono font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                            #{recentOrder.id}
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate max-w-[140px]">
                            {recentOrder.customer?.name || 'Valued Client'}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          {getStatusBadge(recentOrder.orderStatus)}
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-amber-300 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/90 flex items-center justify-between text-xs">
          <div className="text-zinc-400 text-[11px] flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Guest Lookup</span>
          </div>
          <button
            onClick={() => {
              setIsCustomerOrdersModalOpen(false);
              setSearchQuery('');
              setHasSearched(false);
            }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
