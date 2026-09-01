import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Package, Clock, CheckCircle2, Truck, ShieldCheck, ExternalLink, ArrowRight, User } from 'lucide-react';

export const CustomerOrdersModal: React.FC = () => {
  const {
    isCustomerOrdersModalOpen,
    setIsCustomerOrdersModalOpen,
    customerUser,
    orders,
    navigate
  } = useStore();

  if (!isCustomerOrdersModalOpen) return null;

  // Filter orders for the logged-in customer (by customer email or customer name)
  const customerOrders = customerUser
    ? orders.filter(
        (o) =>
          (o.customer?.email && o.customer.email.toLowerCase() === customerUser.email.toLowerCase()) ||
          (o.customer?.name && o.customer.name.toLowerCase() === customerUser.name.toLowerCase()) ||
          ((o as any).customerEmail && (o as any).customerEmail.toLowerCase() === customerUser.email.toLowerCase())
      )
    : [];

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative bg-[#0d0e12] border border-zinc-800/90 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-black/90 text-zinc-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>My Orders & Purchases</span>
                {customerUser && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {customerUser.tier} Member
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">
                {customerUser ? `Signed in as ${customerUser.name} (${customerUser.email})` : 'Client order history'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCustomerOrdersModalOpen(false)}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {customerOrders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Package className="w-12 h-12 text-zinc-700 mx-auto" />
              <div className="text-white font-semibold text-sm">No purchases recorded yet</div>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Explore our luxury lighting collection to place your first bespoke order.
              </p>
              <button
                onClick={() => {
                  setIsCustomerOrdersModalOpen(false);
                  navigate('/shop');
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase text-xs tracking-wider"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            customerOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/70 pb-3">
                  <div>
                    <div className="font-mono font-bold text-white text-sm">
                      Order #{order.id}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(order.orderStatus)}
                    <span className="font-mono font-bold text-white text-sm">
                      Rs. {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item: any, idx: number) => {
                    const itemName = item.productName || item.product?.name || 'Bespoke Lighting';
                    const itemImg = item.productImage || item.product?.images?.[0] || '';
                    const itemPrice = item.price || item.product?.price || 0;
                    const itemQty = item.quantity || 1;

                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          {itemImg ? (
                            <img
                              src={itemImg}
                              alt={itemName}
                              className="w-10 h-10 rounded-lg object-cover bg-zinc-950 border border-zinc-800"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-zinc-200">{itemName}</div>
                            <div className="text-[10px] text-zinc-400">
                              Qty: {itemQty} {item.selectedColorTemp && `• ${item.selectedColorTemp}`}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono font-medium text-zinc-300">
                          Rs. {(itemPrice * itemQty).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tracking & Payment Summary */}
                <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
                  <div>
                    Payment Method: <span className="text-zinc-200 font-medium">{order.paymentMethod.toUpperCase()}</span> ({order.paymentStatus})
                  </div>
                  {order.trackingNumber && (
                    <div className="font-mono text-amber-300">
                      Tracking: <span className="text-white font-bold">{order.trackingNumber}</span> ({order.carrier || 'White-Glove Express'})
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-xs">
          <div className="text-zinc-400 text-[11px]">
            Customer Security: <span className="text-emerald-400 font-medium">Customer-Isolated Profile</span>
          </div>
          <button
            onClick={() => setIsCustomerOrdersModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
