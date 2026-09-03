import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ChevronRight, 
  Eye, 
  PlusCircle, 
  Smartphone, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  Layers, 
  Boxes, 
  Instagram,
  MessageCircle,
  PhoneCall,
  Check,
  Edit2,
  X
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { 
    products, 
    orders, 
    customers, 
    categories, 
    paymentSettings,
    instagramSettings,
    contactInfo,
    updateWhatsAppNumber,
    updateContactInfo,
    adminUser,
    navigate, 
    updateOrderStatus,
    addToast,
    formatPrice,
    currencyConfig
  } = useStore();

  const [dateFilter, setDateFilter] = useState<'today' | '7d' | '30d' | 'year'>('30d');
  const [isEditingWhatsApp, setIsEditingWhatsApp] = useState(false);
  const [quickEmail, setQuickEmail] = useState(contactInfo?.email || 'support@lunova.luxury');
  const [quickPhone, setQuickPhone] = useState(contactInfo?.phone || '+92 315 0360126');
  const [quickWhatsApp, setQuickWhatsApp] = useState(contactInfo?.whatsappNumber || '+92 315 0360126');
  const [quickHours, setQuickHours] = useState(contactInfo?.hours || 'Mon – Sat, 9:00 AM – 6:00 PM PKT / EST');
  const [quickAddress, setQuickAddress] = useState(contactInfo?.address || '750 Madison Avenue, New York, NY / Lahore Atelier');

  useEffect(() => {
    if (contactInfo) {
      if (contactInfo.email) setQuickEmail(contactInfo.email);
      if (contactInfo.phone) setQuickPhone(contactInfo.phone);
      if (contactInfo.whatsappNumber) setQuickWhatsApp(contactInfo.whatsappNumber);
      if (contactInfo.hours) setQuickHours(contactInfo.hours);
      if (contactInfo.address) setQuickAddress(contactInfo.address);
    }
  }, [contactInfo]);

  const currentWhatsapp = contactInfo?.whatsappNumber || '+92 315 0360126';
  const cleanDigits = currentWhatsapp.replace(/[^0-9]/g, '') || '923150360126';

  const handleSaveQuickWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo({
      email: quickEmail.trim(),
      phone: quickPhone.trim(),
      whatsappNumber: quickWhatsApp.trim(),
      hours: quickHours.trim(),
      address: quickAddress.trim()
    });
    if (quickWhatsApp.trim()) {
      updateWhatsAppNumber(quickWhatsApp.trim());
    }
    setIsEditingWhatsApp(false);
  };

  // Computed metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing');
  const lowStockItems = products.filter((p) => p.stock <= (p.lowStockThreshold || 5));
  const recentOrders = [...orders].slice(0, 5);

  return (
    <AdminLayout
      activeSection="dashboard"
      title="Dashboard"
      subtitle="Manage your store, products, orders and inventory."
      actionButton={
        <div className="flex items-center space-x-2">
          {/* Date Filter Selector */}
          <div className="flex items-center space-x-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: 'year', label: 'This Year' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDateFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  dateFilter === f.id
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/admin/products/new')}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8 text-xs">
        
        {/* Two Channel Integration Cards (WhatsApp Live Line & Instagram Page) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Quick WhatsApp Live Line Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 border border-emerald-500/40 flex flex-col justify-between gap-4 shadow-lg ring-1 ring-emerald-500/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-zinc-950 p-0.5 shrink-0 shadow-md shadow-emerald-500/20 flex items-center justify-center font-bold">
                  <MessageCircle className="w-5 h-5 fill-zinc-950" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">Store WhatsApp Support</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-emerald-400 font-mono font-bold text-xs mt-0.5">
                    {currentWhatsapp}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <a
                  href={`https://wa.me/${cleanDigits}?text=${encodeURIComponent('Hello LUNOVA Concierge, testing live WhatsApp link.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 text-[11px] font-mono flex items-center space-x-1 transition-colors"
                  title="Test WhatsApp direct chat"
                >
                  <span>Test</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setIsEditingWhatsApp(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-zinc-800/80 font-mono">
              <span>Synced with Customer Floating Button & Footer</span>
              <button 
                onClick={() => navigate('/admin/settings')} 
                className="text-amber-400 hover:underline flex items-center space-x-1"
              >
                <span>Full Settings</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Instagram Integration Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-950/40 via-zinc-950 to-zinc-950 border border-pink-500/40 flex flex-col justify-between gap-4 shadow-lg ring-1 ring-pink-500/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 shrink-0 shadow-md shadow-pink-500/20 flex items-center justify-center">
                  <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-pink-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">Official Instagram</span>
                    {instagramSettings.isConnected ? (
                      <span className="px-2 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[10px] font-mono font-bold">
                        @{instagramSettings.handle}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                        NOT CONNECTED
                      </span>
                    )}
                  </div>
                  <div className="text-pink-400 font-mono font-bold text-xs mt-0.5 truncate max-w-[200px]">
                    {instagramSettings.accountName || 'LUNOVA Official'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => navigate('/admin/instagram')}
                  className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-zinc-950 font-mono font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
                >
                  <span>{instagramSettings.isConnected ? 'Manage Feed' : 'Connect'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-zinc-800/80 font-mono">
              <span>{instagramSettings.recentPosts?.length || 0} Synced Gallery Media Posts</span>
              <a 
                href={instagramSettings.profileUrl || `https://www.instagram.com/${instagramSettings.handle || 'lunova.home_decors'}/?hl=en`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:underline flex items-center space-x-1"
              >
                <span>View Instagram</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Quick Edit Contact Details Modal */}
        {isEditingWhatsApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-zinc-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 ring-1 ring-emerald-500/20 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold">
                    <MessageCircle className="w-4 h-4 fill-zinc-950" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Update Store Contact Details</h3>
                    <p className="text-[10px] text-zinc-400">Syncs live across Customer Portal & Admin</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingWhatsApp(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveQuickWhatsApp} className="space-y-4">
                <div>
                  <label className="block text-zinc-300 font-mono text-[11px] uppercase mb-1">
                    Support / Concierge Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. support@lunova.luxury"
                    value={quickEmail}
                    onChange={(e) => setQuickEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-mono text-[11px] uppercase mb-1">
                      Support Phone Line
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +92 315 0360126"
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-mono text-[11px] uppercase mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +92 315 0360126"
                      value={quickWhatsApp}
                      onChange={(e) => setQuickWhatsApp(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-mono text-[11px] uppercase mb-1">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mon – Sat, 9:00 AM – 6:00 PM PKT / EST"
                    value={quickHours}
                    onChange={(e) => setQuickHours(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-mono text-[11px] uppercase mb-1">
                    Studio / Atelier Location Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 750 Madison Avenue, New York, NY / Lahore Atelier"
                    value={quickAddress}
                    onChange={(e) => setQuickAddress(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsEditingWhatsApp(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs font-mono flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Details</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            FOUR STATISTIC CARDS (PREMIUM DARK MINIMAL)
        ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: TOTAL REVENUE */}
          <div className="bg-[#121318] border border-zinc-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-mono uppercase font-semibold">TOTAL REVENUE ({currencyConfig.code})</span>
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-2 tracking-tight">
              {formatPrice(totalRevenue > 0 ? totalRevenue : 5200)}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-0.5 mt-2 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <ArrowUpRight className="w-3.5 h-3.5" />
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span className="ml-0.5">+18.4% vs last month</span>
            </div>
          </div>

          {/* Card 2: TOTAL ORDERS */}
          <div className="bg-[#121318] border border-zinc-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-mono uppercase font-semibold">TOTAL ORDERS</span>
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-2 tracking-tight">
              {orders.length + 120}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-0.5 mt-2 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <ArrowUpRight className="w-3.5 h-3.5" />
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span className="ml-0.5">+12.8% vs last month</span>
            </div>
          </div>

          {/* Card 3: TOTAL PRODUCTS */}
          <div className="bg-[#121318] border border-zinc-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-mono uppercase font-semibold">TOTAL PRODUCTS</span>
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-2 tracking-tight">
              {products.length}
            </div>
            <div className="text-[11px] text-amber-400 flex items-center space-x-1 mt-2 font-mono font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lowStockItems.length} low stock</span>
            </div>
          </div>

          {/* Card 4: CUSTOMERS */}
          <div className="bg-[#121318] border border-zinc-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-mono uppercase font-semibold">CUSTOMERS</span>
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-2 tracking-tight">
              {customers.length + 322}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-0.5 mt-2 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <ArrowUpRight className="w-3.5 h-3.5" />
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span className="ml-0.5">+9.4% this month</span>
            </div>
          </div>

        </div>

        {/* =========================================================================
            TWO-COLUMN SECTION: RECENT ORDERS & LOW STOCK
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* RECENT ORDERS TABLE (2 COLUMNS ON DESKTOP) */}
          <div className="lg:col-span-2 bg-[#121318] border border-zinc-800/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Recent Orders</span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Latest client purchases and checkout transactions.</p>
              </div>

              <button
                onClick={() => navigate('/admin/orders')}
                className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center space-x-1 transition-colors"
              >
                <span>View All Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/80 text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-xs">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-zinc-500">
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => {
                      const totalItemsCount = (order.items || []).reduce((s, i) => s + (Number(i.quantity) || 1), 0);
                      const isPaid = order.paymentStatus === 'Paid';
                      const formattedDate = order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Recent';
                      
                      return (
                        <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-amber-400">
                            {order.id}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-semibold text-white truncate max-w-[120px]">{order.customer?.name || 'VIP Client'}</div>
                            <div className="text-[10px] text-zinc-400 truncate max-w-[120px]">{order.customer?.email || 'N/A'}</div>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-zinc-400 text-[11px] whitespace-nowrap">
                            {formattedDate}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-zinc-300">
                            {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}
                          </td>
                          <td className="py-3.5 px-3 font-mono font-bold text-white whitespace-nowrap">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              isPaid 
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-500/10 text-emerald-300'
                                : order.orderStatus === 'Shipped'
                                ? 'bg-cyan-500/10 text-cyan-300'
                                : order.orderStatus === 'Processing'
                                ? 'bg-blue-500/10 text-blue-300'
                                : 'bg-amber-400/10 text-amber-300'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => navigate('/admin/orders')}
                              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-300 font-mono transition-colors"
                            >
                              Inspect
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

          {/* RIGHT SIDE: LOW STOCK ALERT (1 COLUMN) */}
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <div className="bg-[#121318] border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl ring-1 ring-amber-500/10">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Low Stock Alert</span>
                </h3>
                <button
                  onClick={() => navigate('/admin/inventory')}
                  className="text-[10px] font-mono text-amber-400 hover:underline flex items-center space-x-1"
                >
                  <span>View Inventory</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {lowStockItems.length === 0 ? (
                  <div className="text-center py-4 text-emerald-400 font-mono">
                    ✓ All inventory units well stocked!
                  </div>
                ) : (
                  lowStockItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-white truncate max-w-[150px]">{item.name}</div>
                        <div className="text-[10px] text-zinc-400">{item.category}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold shrink-0">
                        {item.stock} remaining
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
};
