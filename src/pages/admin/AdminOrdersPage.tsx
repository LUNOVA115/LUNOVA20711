import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Order } from '../../types';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  FileText, 
  Eye, 
  Download, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  User,
  Check,
  X,
  RefreshCw,
  Sparkles,
  DollarSign
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderPaymentStatus, addToast, navigate, formatPrice, currencyConfig } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  
  // Selected Order for Details Drawer/Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches = 
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q) ||
          (o.customer.phone && o.customer.phone.toLowerCase().includes(q)) ||
          (o.transactionId && o.transactionId.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Status
      if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;

      // Payment
      if (paymentFilter !== 'all' && o.paymentStatus !== paymentFilter) return false;

      return true;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const handleUpdateStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
    addToast(`Order ${orderId} updated to "${newStatus}".`, 'success');
  };

  const handleUpdatePayment = (orderId: string, newPayment: Order['paymentStatus']) => {
    updateOrderPaymentStatus(orderId, newPayment);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: newPayment });
    }
    addToast(`Order ${orderId} payment status updated to "${newPayment}".`, 'success');
  };

  // Status Colors
  const getOrderStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Shipped':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'Processing':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'Pending':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const getPaymentStatusBadge = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Pending':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'Refunded':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Failed':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300';
    }
  };

  return (
    <AdminLayout
      activeSection="orders"
      title="Customer Orders"
      subtitle="Track, inspect, and fulfill VIP client purchases and Easypaisa transactions."
    >
      <div className="space-y-6 text-xs">
        
        {/* =========================================================================
            SEARCH & FILTER CONTROLS
        ========================================================================= */}
        <div className="bg-[#121318] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders by Order ID, customer name, email, or TRX #..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Fulfillment Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>

            {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPaymentFilter('all');
                }}
                className="px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            ORDERS TABLE
        ========================================================================= */}
        <div className="bg-[#121318] border border-zinc-800/80 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                  <th className="py-4 px-5">ORDER ID</th>
                  <th className="py-4 px-4">CUSTOMER</th>
                  <th className="py-4 px-4">DATE</th>
                  <th className="py-4 px-4">ITEMS</th>
                  <th className="py-4 px-4">TOTAL</th>
                  <th className="py-4 px-4">PAYMENT</th>
                  <th className="py-4 px-4">FULFILLMENT</th>
                  <th className="py-4 px-5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-zinc-500">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

                    return (
                      <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                        
                        {/* Order ID */}
                        <td className="py-4 px-5 font-mono font-bold text-amber-400">
                          {order.id}
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white truncate max-w-[150px]">{order.customer.name}</div>
                          <div className="text-[10px] text-zinc-400 truncate max-w-[150px]">{order.customer.email}</div>
                          {order.customer.phone && (
                            <div className="text-[10px] text-zinc-500 font-mono">{order.customer.phone}</div>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 font-mono text-zinc-400 text-[11px] whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>

                        {/* Items */}
                        <td className="py-4 px-4 font-mono text-zinc-300">
                          <div className="flex items-center space-x-1.5">
                            <div className="flex -space-x-2 overflow-hidden">
                              {order.items.slice(0, 3).map((item, idx) => (
                                <img
                                  key={idx}
                                  src={item.productImage}
                                  alt=""
                                  className="inline-block h-7 w-7 rounded-lg object-cover ring-2 ring-zinc-950"
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-zinc-400 font-mono">
                              ({totalItems})
                            </span>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-4 px-4 font-mono font-bold text-white whitespace-nowrap">
                          {formatPrice(order.total)}
                        </td>

                        {/* Payment Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${getPaymentStatusBadge(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                            <div className="text-[10px] text-zinc-400 font-mono">{order.paymentMethod}</div>
                          </div>
                        </td>

                        {/* Order Fulfillment Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${getOrderStatusBadge(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-amber-400 font-mono text-xs flex items-center space-x-1.5 ml-auto transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>View Details</span>
                          </button>
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

      {/* =========================================================================
          ORDER DETAILS DRAWER / MODAL
      ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-zinc-100 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  Order Invoice & Dispatch Inspection
                </div>
                <h3 className="text-xl font-bold text-white font-mono mt-0.5">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Timeline */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Fulfillment Timeline</div>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                  const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                  const currentIndex = statusOrder.indexOf(selectedOrder.orderStatus);
                  const stepIndex = statusOrder.indexOf(step);
                  const isDone = currentIndex >= stepIndex;
                  const isCurrent = selectedOrder.orderStatus === step;

                  return (
                    <div key={step} className="space-y-1.5">
                      <div className={`h-1.5 rounded-full ${
                        isCurrent
                          ? 'bg-amber-400 shadow-sm shadow-amber-400/40 animate-pulse'
                          : isDone
                          ? 'bg-emerald-500'
                          : 'bg-zinc-800'
                      }`} />
                      <div className={isCurrent ? 'text-amber-300 font-bold' : isDone ? 'text-zinc-200' : 'text-zinc-500'}>
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Modifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5">
                  Change Fulfillment Status
                </label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5">
                  Change Payment Status
                </label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => handleUpdatePayment(selectedOrder.id, e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                >
                  <option value="Paid">Paid (Verified)</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Failed">Failed / Cancelled</option>
                </select>
              </div>
            </div>

            {/* Customer & Shipping Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                <div className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Client Contact</span>
                </div>
                <div className="font-bold text-white">{selectedOrder.customer.name}</div>
                <div className="text-zinc-400 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{selectedOrder.customer.email}</span>
                </div>
                {selectedOrder.customer.phone && (
                  <div className="text-zinc-400 flex items-center space-x-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{selectedOrder.customer.phone}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                <div className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Shipping Address</span>
                </div>
                <div className="text-zinc-300 leading-relaxed">
                  {selectedOrder.shippingAddress?.street || '750 Madison Avenue, 18th Fl'}<br />
                  {selectedOrder.shippingAddress?.city || 'New York'}, {selectedOrder.shippingAddress?.state || 'NY'} {selectedOrder.shippingAddress?.postalCode || '10065'}<br />
                  {selectedOrder.shippingAddress?.country || 'United States'}
                </div>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Ordered Catalog Pieces</div>
              <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={item.productImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-zinc-800" />
                      <div>
                        <div className="font-semibold text-white">{item.productName}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Quantity: {item.quantity} × {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-white">
                      {formatPrice(item.quantity * item.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal:</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>White-Glove Shipping:</span>
                <span>{selectedOrder.shipping === 0 ? 'COMPLIMENTARY' : formatPrice(selectedOrder.shipping)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Discount Applied:</span>
                  <span>-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-zinc-700">
                <span>Final Invoiced Total:</span>
                <span className="text-amber-400">{formatPrice(selectedOrder.total)}</span>
              </div>
              <div className="text-[10px] text-zinc-500 pt-1">
                Payment Method: <span className="text-zinc-300 font-bold">{selectedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
};
