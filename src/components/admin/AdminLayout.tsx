import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import { AdminProfileModal } from './AdminProfileModal';
import { AdminHamburgerDrawer } from './AdminHamburgerDrawer';
import { 
  LayoutDashboard, 
  Package, 
  Boxes,
  ShoppingBag, 
  Users, 
  FolderTree, 
  Sparkles, 
  BarChart3,
  Settings, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Edit2,
  Menu,
  X,
  Search,
  Bell,
  Check,
  AlertTriangle,
  ChevronDown,
  User,
  Shield,
  SlidersHorizontal,
  Home,
  ArrowLeft,
  Store,
  Instagram,
  Moon
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: 'dashboard' | 'products' | 'products-new' | 'inventory' | 'orders' | 'customers' | 'categories' | 'homepage' | 'analytics' | 'settings' | 'instagram';
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actionButton?: React.ReactNode;
  breadcrumb?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeSection,
  title,
  subtitle,
  actionButton,
  breadcrumb
}) => {
  const { theme, toggleTheme, isDay } = useTheme();
  const { adminUser, adminLogout, navigate, orders, products, customers } = useStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
  const lowStockCount = products.filter((p) => p.stock <= (p.lowStockThreshold || 5)).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', path: '/admin/products', icon: Package },
    { 
      id: 'inventory', 
      label: 'Inventory', 
      path: '/admin/inventory', 
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
      badgeType: 'warning' as const
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      path: '/admin/orders', 
      icon: ShoppingBag, 
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
      badgeType: 'accent' as const
    },
    { id: 'customers', label: 'Customers', path: '/admin/customers', icon: Users },
    { id: 'categories', label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { id: 'homepage', label: 'Homepage', path: '/admin/homepage', icon: Home },
    { id: 'instagram', label: 'Instagram', path: '/admin/instagram', icon: Instagram },
    { id: 'analytics', label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global search matching
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { products: [], orders: [], customers: [] };
    const q = searchQuery.toLowerCase();
    return {
      products: products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)).slice(0, 3),
      orders: orders.filter(o => o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q)).slice(0, 3),
      customers: customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 3)
    };
  }, [searchQuery, products, orders, customers]);

  const defaultSectionName = activeSection ? activeSection.charAt(0).toUpperCase() + activeSection.slice(1) : 'Overview';
  const breadcrumbText = breadcrumb || (typeof title === 'string' && title.trim() ? `Admin / ${title.trim().split(' ')[0]}` : `Admin / ${defaultSectionName}`);

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-amber-500 selection:text-zinc-950">
      
      {/* =========================================================================
          DESKTOP SIDEBAR
      ========================================================================= */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-[#0e0f14] border-r border-zinc-800/80 flex-col justify-between shrink-0 p-5 z-20">
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60">
            <div 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 font-bold shadow-lg shadow-amber-500/20">
                <span className="font-mono text-sm tracking-tighter">LV</span>
              </div>
              <div>
                <span className="text-base font-semibold tracking-[0.2em] text-white uppercase font-sans">
                  LU<span className="text-amber-400">NOVA</span>
                </span>
                <span className="block text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                  Admin Console
                </span>
              </div>
            </div>
          </div>

          {/* BACK TO STORE BUTTON (Sidebar) */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-amber-400 hover:text-zinc-950 border border-zinc-800 hover:border-amber-400 text-zinc-300 font-medium text-xs transition-all shadow-sm group"
            title="Return to Public Luxury Storefront"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <Store className="w-3.5 h-3.5 text-amber-400 group-hover:text-zinc-950" />
            <span className="font-semibold">Back to Store</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id || (activeSection === 'products-new' && item.id === 'products');
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 font-semibold border-l-2 border-amber-400 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        item.badgeType === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-amber-400 text-zinc-950 font-bold'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Profile Widget */}
        <div className="pt-4 border-t border-zinc-800/60 space-y-3">
          {/* Admin User Card */}
          <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold font-mono text-xs shrink-0">
                {adminUser ? adminUser.name.charAt(0) : 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white truncate">{adminUser?.name || 'Administrator'}</div>
                <div className="text-[10px] text-zinc-400 font-mono flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate">{adminUser?.role || 'Store Owner'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-amber-400/20 hover:text-amber-300 text-zinc-400 transition-colors shrink-0"
              title="Edit Admin Profile"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Footer Links */}
          <div className="flex items-center justify-between text-xs px-1 text-zinc-400">
            <button
              onClick={() => navigate('/')}
              className="hover:text-amber-400 flex items-center space-x-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
            <button
              onClick={adminLogout}
              className="hover:text-rose-400 flex items-center space-x-1 transition-colors font-mono text-[11px]"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE HEADER & SLIDE-OUT DRAWER
      ========================================================================= */}
      <div className="md:hidden bg-[#0e0f14] border-b border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsAdminDrawerOpen(true)}
            className="p-2 text-zinc-300 hover:text-amber-300 bg-zinc-900 border border-zinc-800 hover:border-amber-400/40 rounded-xl transition-all cursor-pointer flex items-center justify-center group shrink-0 shadow-sm"
            aria-label="Open Navigation Drawer"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-zinc-300 group-hover:text-amber-300 transition-transform" />
          </button>

          <div 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 font-bold text-xs">
              LV
            </div>
            <div>
              <span className="text-sm font-semibold tracking-widest text-white uppercase">LUNOVA</span>
              <span className="text-[9px] block font-mono text-amber-400">ADMIN</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
            title={isDay ? "Switch to Night Mode" : "Switch to Day Mode"}
          >
            <Moon className={`w-4 h-4 ${isDay ? 'text-amber-500 fill-amber-500/20' : 'text-zinc-300'}`} />
          </button>
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#0e0f14] border-r border-zinc-800 p-5 flex flex-col justify-between z-50 h-full overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-bold text-xs">
                    LV
                  </div>
                  <span className="text-sm font-semibold tracking-wider text-white">LUNOVA CONSOLE</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Back to Store Button */}
              <button
                onClick={() => {
                  navigate('/');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-amber-400/15 hover:bg-amber-400 hover:text-zinc-950 border border-amber-400/30 text-amber-300 text-xs font-bold transition-all shadow-sm group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <Store className="w-3.5 h-3.5" />
                <span>Back to Store</span>
              </button>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                        isActive
                          ? 'bg-amber-400 text-zinc-950 font-bold'
                          : 'text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-amber-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <button
                onClick={() => {
                  setIsProfileModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl bg-zinc-900 text-xs text-zinc-300"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>{adminUser?.name || 'Administrator'}</span>
              </button>
              <button
                onClick={() => {
                  navigate('/');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Storefront</span>
              </button>
              <button
                onClick={adminLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN ADMIN CONTENT & TOP HEADER
      ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP DESKTOP & TABLET HEADER */}
        <header className="bg-[#0e0f14]/80 backdrop-blur-md border-b border-zinc-800/80 px-6 sm:px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          
          {/* Breadcrumb, Title & Hamburger Icon */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => setIsAdminDrawerOpen(true)}
              className="p-2 sm:p-2.5 text-zinc-300 hover:text-amber-300 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/90 hover:border-amber-400/50 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center group shadow-sm shrink-0"
              aria-label="Open Navigation Drawer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-zinc-300 group-hover:text-amber-300 group-hover:scale-110 transition-transform" />
            </button>

            <div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center space-x-1.5">
                <span>Admin</span>
                <span>/</span>
                <span className="text-amber-400 font-semibold capitalize">{activeSection}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                {title}
              </h1>
            </div>
          </div>

          {/* Header Action Items */}
          <div className="flex items-center space-x-3">
            
            {/* Global Search Button */}
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-white transition-all shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Search products, orders, customers...</span>
              <kbd className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-400">⌘K</kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {(pendingOrdersCount > 0 || lowStockCount > 0) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
                {(pendingOrdersCount > 0 || lowStockCount > 0) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-2xl z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-white">System Notifications</div>
                    <span className="text-[10px] font-mono text-amber-400">{pendingOrdersCount + lowStockCount} pending alerts</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                    {pendingOrdersCount > 0 && (
                      <div 
                        onClick={() => {
                          navigate('/admin/orders');
                          setIsNotificationOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-amber-500/20 cursor-pointer flex items-start space-x-3 transition-colors"
                      >
                        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{pendingOrdersCount} New Orders Awaiting Processing</div>
                          <div className="text-[10px] text-zinc-400">Inspect client delivery addresses and payment receipts.</div>
                        </div>
                      </div>
                    )}

                    {lowStockCount > 0 && (
                      <div 
                        onClick={() => {
                          navigate('/admin/inventory');
                          setIsNotificationOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-orange-500/20 cursor-pointer flex items-start space-x-3 transition-colors"
                      >
                        <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 mt-0.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{lowStockCount} Products Running Low On Stock</div>
                          <div className="text-[10px] text-zinc-400">Replenish pieces in inventory before stockouts occur.</div>
                        </div>
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-start space-x-3">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-300">Easypaisa Gateway Active</div>
                        <div className="text-[10px] text-zinc-400">Official receiver number and automated proof receipt sync operational.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Back to Store Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-zinc-900/90 hover:bg-amber-400 hover:text-zinc-950 border border-zinc-800 hover:border-amber-400 text-xs font-semibold text-zinc-300 transition-all shadow-sm group"
              title="Return to the Main Storefront"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <Store className="w-3.5 h-3.5 text-amber-400 group-hover:text-zinc-950" />
              <span className="hidden sm:inline">Back to Store</span>
            </button>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 font-bold text-xs font-mono">
                  {adminUser ? adminUser.name.charAt(0) : 'A'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white truncate max-w-[100px] leading-tight">
                    {adminUser?.name || 'Admin'}
                  </div>
                  <div className="text-[9px] text-zinc-400 font-mono leading-tight">
                    {adminUser?.role || 'Owner'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-zinc-950 border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 space-y-1 text-xs">
                  <div className="p-2 border-b border-zinc-800">
                    <div className="font-bold text-white truncate">{adminUser?.name || 'Julian Thorne'}</div>
                    <div className="text-[10px] text-amber-400 font-mono">{adminUser?.email || 'admin@lunova.luxury'}</div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Admin Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/admin/instagram');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span>Instagram Connect</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/admin/settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-amber-400" />
                    <span>Store Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                    <span>Client Storefront</span>
                  </button>

                  <div className="pt-1 border-t border-zinc-800">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        adminLogout();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Crescent Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
              title={isDay ? "Switch to Night Mode" : "Switch to Day Mode"}
              aria-label="Toggle Theme Mode"
            >
              <Moon className={`w-4 h-4 transition-all duration-300 ${
                isDay ? 'text-amber-600 fill-amber-500/20 rotate-[-12deg]' : 'text-zinc-300 fill-amber-400/10'
              }`} />
            </button>

          </div>
        </header>

        {/* MAIN PAGE BODY */}
        <main className="p-5 sm:p-8 lg:p-10 space-y-8 flex-1">
          
          {/* Subtitle & Action Button Banner (if provided) */}
          {(subtitle || actionButton) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              {subtitle && (
                <p className="text-xs sm:text-sm text-zinc-400">
                  {subtitle}
                </p>
              )}
              {actionButton && (
                <div className="flex items-center space-x-3 shrink-0">
                  {actionButton}
                </div>
              )}
            </div>
          )}

          {/* Injected Content */}
          {children}
        </main>
      </div>

      {/* Global Search Modal */}
      {isGlobalSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search catalog, order #, customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <button 
                onClick={() => {
                  setIsGlobalSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Search Quick Results */}
            <div className="space-y-4 max-h-80 overflow-y-auto text-xs">
              {searchQuery && (
                <>
                  {/* Products */}
                  {searchResults.products.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-mono text-zinc-500">Products ({searchResults.products.length})</div>
                      {searchResults.products.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            navigate('/admin/products');
                            setIsGlobalSearchOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2.5">
                            <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <div className="font-semibold text-white">{p.name}</div>
                              <div className="text-[10px] text-zinc-400">{p.category} • ${p.price}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-amber-400">Stock: {p.stock}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Orders */}
                  {searchResults.orders.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-mono text-zinc-500">Orders ({searchResults.orders.length})</div>
                      {searchResults.orders.map(o => (
                        <div
                          key={o.id}
                          onClick={() => {
                            navigate('/admin/orders');
                            setIsGlobalSearchOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-white">{o.id} • {o.customer.name}</div>
                            <div className="text-[10px] text-zinc-400">{o.paymentMethod} • ${o.total.toLocaleString()}</div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                            {o.orderStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Customers */}
                  {searchResults.customers.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-mono text-zinc-500">Customers ({searchResults.customers.length})</div>
                      {searchResults.customers.map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            navigate('/admin/customers');
                            setIsGlobalSearchOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-white">{c.name}</div>
                            <div className="text-[10px] text-zinc-400">{c.email}</div>
                          </div>
                          <span className="text-[10px] font-mono text-amber-400">${c.totalSpent.toLocaleString()} spent</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.products.length === 0 && searchResults.orders.length === 0 && searchResults.customers.length === 0 && (
                    <div className="text-center py-6 text-zinc-500">
                      No matches found for "{searchQuery}".
                    </div>
                  )}
                </>
              )}

              {!searchQuery && (
                <div className="text-zinc-500 text-center py-6">
                  Type product name, SKU, Order ID, or client email to search across the entire store.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Profile Modal */}
      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Admin Side Hamburger Drawer Navigation */}
      <AdminHamburgerDrawer
        isOpen={isAdminDrawerOpen}
        onClose={() => setIsAdminDrawerOpen(false)}
      />
    </div>
  );
};
