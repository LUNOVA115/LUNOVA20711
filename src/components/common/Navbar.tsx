import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import { CurrencySelector } from './CurrencySelector';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  Sparkles, 
  Zap,
  Mail,
  User,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Package,
  Settings,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Moon
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, isDay } = useTheme();
  const { 
    currentPath, 
    navigate, 
    cartCount, 
    wishlistCount, 
    setIsCartOpen, 
    setIsSearchOpen,
    adminUser,
    adminLogout,
    customerUser,
    customerLogout,
    setIsCustomerAuthModalOpen,
    setIsCustomerOrdersModalOpen,
    contactInfo,
    instagramSettings
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);

  // Sticky header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLinkActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && (currentPath === path || currentPath.startsWith(`${path}/`))) return true;
    return false;
  };

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setIsAccountOpen(false);
  };

  return (
    <>
      {/* Main Sticky Glassmorphism Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#08090D]/95 backdrop-blur-2xl border-b border-zinc-800/90 shadow-2xl shadow-black/80 py-3'
            : 'bg-[#08090D]/85 backdrop-blur-xl border-b border-white/5 py-4 sm:py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* LEFT SIDE: Brand Logo / Wordmark + Horizontal Navigation */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            {/* Mobile Menu Trigger (Left side on mobile) */}
            <div className="flex items-center lg:hidden mr-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-zinc-300 hover:text-amber-300 hover:bg-zinc-900/60 rounded-xl transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* LUNOVA Monogram & Typography */}
            <div 
              onClick={() => handleNav('/')}
              className="flex items-center space-x-3 cursor-pointer group select-none"
              title="LUNOVA – Futuristic Premium Home Decor"
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] text-white uppercase leading-none font-semibold">
                    LU<span className="text-gold-gradient font-bold">NOVA</span>
                  </span>
                  {/* Verified Brand Badge */}
                  <span 
                    className="inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 shadow-sm shadow-amber-400/50 -mt-0.5" 
                    title="Verified Authentic Atelier"
                  >
                    <svg className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 stroke-[3.5] stroke-current fill-none" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <div className="flex flex-col space-y-0.5 mt-1 font-mono text-[7px] sm:text-[7.5px] tracking-[0.24em] text-zinc-400 uppercase leading-tight font-medium select-none">
                  <span className="text-zinc-300 font-semibold tracking-[0.22em]">HANDMADE HOME DECOR</span>
                  <span className="text-zinc-400">MADE IN PAKISTAN</span>
                  <span className="text-amber-400/90 font-bold tracking-[0.28em]">EST. 2024</span>
                </div>
              </div>
            </div>

            {/* NAVIGATION OPTIONS NEXT TO LUNOVA LOGO: HOME, SHOP, CONTACT US */}
            <nav className="hidden sm:flex items-center space-x-5 md:space-x-8 pl-3 md:pl-6 border-l border-zinc-800/80">
              
              {/* 1. HOME */}
              <button
                onClick={() => handleNav('/')}
                className={`text-xs uppercase tracking-[0.22em] md:tracking-[0.25em] font-medium transition-all relative py-2 cursor-pointer group ${
                  isLinkActive('/')
                    ? 'text-amber-300 font-bold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <span className="group-hover:tracking-[0.28em] transition-all">HOME</span>
                {isLinkActive('/') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 rounded-full shadow-sm shadow-amber-400 animate-in fade-in duration-300" />
                )}
              </button>

              {/* 2. SHOP */}
              <button
                onClick={() => handleNav('/shop')}
                className={`text-xs uppercase tracking-[0.22em] md:tracking-[0.25em] font-medium transition-all relative py-2 cursor-pointer group ${
                  isLinkActive('/shop')
                    ? 'text-amber-300 font-bold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <span className="group-hover:tracking-[0.28em] transition-all">SHOP</span>
                {isLinkActive('/shop') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 rounded-full shadow-sm shadow-amber-400 animate-in fade-in duration-300" />
                )}
              </button>

              {/* 3. CONTACT US */}
              <button
                onClick={() => handleNav('/contact')}
                className={`text-xs uppercase tracking-[0.22em] md:tracking-[0.25em] font-medium transition-all relative py-2 cursor-pointer group ${
                  isLinkActive('/contact')
                    ? 'text-amber-300 font-bold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <span className="group-hover:tracking-[0.28em] transition-all">CONTACT US</span>
                {isLinkActive('/contact') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 rounded-full shadow-sm shadow-amber-400 animate-in fade-in duration-300" />
                )}
              </button>

            </nav>
          </div>

          {/* RIGHT SIDE HEADER ICONS: Search, Wishlist, Cart, Customer Account */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            
            {/* 1. SEARCH TRIGGER */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl text-zinc-300 hover:text-amber-300 hover:bg-zinc-900/80 transition-all cursor-pointer group"
              title="Search Catalogue (Ctrl+K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* 2. WISHLIST ICON */}
            <button
              onClick={() => handleNav('/wishlist')}
              className={`relative p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer group ${
                isLinkActive('/wishlist')
                  ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                  : 'text-zinc-300 hover:text-rose-300 hover:bg-zinc-900/80'
              }`}
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 group-hover:scale-110 transition-transform ${isLinkActive('/wishlist') ? 'fill-rose-400' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-200">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 3. CART ICON & DRAWER TRIGGER */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer group ${
                cartCount > 0
                  ? 'bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/40 text-amber-300 shadow-sm shadow-amber-400/10'
                  : 'bg-zinc-900/80 hover:bg-zinc-800/90 border-zinc-800/80 hover:border-amber-400/40 text-zinc-300 hover:text-amber-200'
              }`}
              title="View Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-300 group-hover:text-amber-300 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-mono text-[9px] font-bold flex items-center justify-center shadow-md shadow-amber-400/30 animate-in zoom-in-50 duration-200">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 4. PROFILE / ACCOUNT DROPDOWN */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="relative p-2 sm:p-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/80 hover:bg-zinc-800/90 hover:border-amber-400/40 text-zinc-300 hover:text-amber-200 transition-all flex items-center justify-center cursor-pointer shadow-sm group"
                title="Account Portal"
                aria-label="Profile"
              >
                <User className="w-4 h-4 text-zinc-300 group-hover:text-amber-300 group-hover:scale-110 transition-transform" />
              </button>

              {/* Account Dropdown Menu */}
              {isAccountOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-[#0c0d12]/98 backdrop-blur-2xl border border-zinc-800/90 rounded-2xl p-2 shadow-2xl shadow-black/90 space-y-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                  
                  {customerUser ? (
                    <div className="space-y-1.5">
                      <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                        <div className="truncate">
                          <div className="font-semibold text-zinc-100 truncate">{customerUser.name}</div>
                          <div className="text-[10px] text-zinc-400 truncate font-mono">{customerUser.email}</div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30 shrink-0">
                          {customerUser.tier || 'VIP'}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          setIsCustomerOrdersModalOpen(true);
                        }}
                        className="w-full flex items-center space-x-3 p-2.5 rounded-xl hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/80 text-left transition-all text-zinc-200 hover:text-white group cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-amber-400/40 group-hover:bg-amber-400/10 transition-all shrink-0">
                          <Package className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors">My Orders & Tracking</div>
                          <div className="text-[10px] text-zinc-400">View active deliveries and receipts</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          customerLogout();
                        }}
                        className="w-full flex items-center space-x-3 p-2 rounded-xl hover:bg-rose-500/10 text-zinc-400 hover:text-rose-300 text-left transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-zinc-500 hover:text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          setIsCustomerAuthModalOpen(true);
                        }}
                        className="w-full flex items-center space-x-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-400/10 to-amber-500/15 hover:from-amber-400/20 hover:to-amber-500/25 border border-amber-400/30 text-left transition-all text-zinc-100 hover:text-amber-200 group cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 transition-all shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-amber-300 transition-colors">Customer Sign In</div>
                          <div className="text-[10px] text-zinc-400">Access orders, tracking & VIP perks</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          setIsCustomerOrdersModalOpen(true);
                        }}
                        className="w-full flex items-center space-x-3 p-2.5 rounded-xl hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/80 text-left transition-all text-zinc-200 hover:text-white group cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-amber-400/40 group-hover:bg-amber-400/10 transition-all shrink-0">
                          <Package className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors">Track an Order</div>
                          <div className="text-[10px] text-zinc-400">Check courier delivery status</div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* ONLY VISIBLE IF ACTIVELY AUTHENTICATED AS ADMIN */}
                  {adminUser && (
                    <div className="pt-2 mt-2 border-t border-zinc-800/80">
                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          handleNav('/admin/dashboard');
                        }}
                        className="w-full flex items-center space-x-3 p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all text-amber-300 group cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 shrink-0">
                          <LayoutDashboard className="w-4 h-4 text-amber-300" />
                        </div>
                        <div>
                          <div className="font-bold text-amber-200">Admin Control Panel</div>
                          <div className="text-[10px] text-zinc-400 font-mono">Logged in as {adminUser.name}</div>
                        </div>
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* 5. CRESCENT / HALF-MOON THEME TOGGLE (Day Mode: Soft Beige / Night Mode: Soft Dark Gray) */}
            <button
              onClick={toggleTheme}
              className="relative p-2 sm:p-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/80 hover:bg-zinc-800/90 hover:border-amber-400/40 text-zinc-300 hover:text-amber-200 transition-all flex items-center justify-center cursor-pointer shadow-sm group"
              title={isDay ? "Switch to Night Mode (Soft Dark Gray)" : "Switch to Day Mode (Soft Beige)"}
              aria-label="Toggle Theme Mode"
            >
              <Moon className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${
                isDay 
                  ? 'text-amber-600 fill-amber-500/20 rotate-[-12deg]' 
                  : 'text-zinc-300 group-hover:text-amber-300 fill-amber-400/10'
              }`} />
            </button>

          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#08090D]/98 backdrop-blur-2xl border-b border-zinc-800 px-6 py-6 space-y-5 animate-in slide-in-from-top duration-300 shadow-2xl">
            
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2 font-mono text-xs uppercase tracking-widest">
              
              {/* 1. Home */}
              <button
                onClick={() => handleNav('/')}
                className={`text-left py-3 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                  isLinkActive('/')
                    ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                    : 'text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span>✦ Home</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {/* 2. Shop */}
              <button
                onClick={() => handleNav('/shop')}
                className={`text-left py-3 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                  isLinkActive('/shop')
                    ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                    : 'text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span>✦ Shop All Pieces</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {/* 3. Flash Deals */}
              <button
                onClick={() => handleNav('/flash-deals')}
                className={`text-left py-3 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                  isLinkActive('/flash-deals')
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40 shadow-sm'
                    : 'bg-amber-400/5 text-amber-300 border border-amber-400/20 hover:bg-amber-400/15'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold">
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                  <span>Flash Deals (Limited)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 font-bold">SALE</span>
              </button>

              {/* 4. Contact Us */}
              <button
                onClick={() => handleNav('/contact')}
                className={`text-left py-3 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                  isLinkActive('/contact')
                    ? 'bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30'
                    : 'text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span>✦ Contact Us & Concierge</span>
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {/* Mobile Quick Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => handleNav('/wishlist')}
                  className="py-2.5 px-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-center flex flex-col items-center justify-center space-y-1"
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span className="text-[10px]">Vault ({wishlistCount})</span>
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-center flex flex-col items-center justify-center space-y-1"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px]">Cart ({cartCount})</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="py-2.5 px-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-center flex flex-col items-center justify-center space-y-1"
                >
                  <Moon className={`w-4 h-4 ${isDay ? 'text-amber-500 fill-amber-500/20' : 'text-zinc-300'}`} />
                  <span className="text-[10px]">{isDay ? 'Day Mode' : 'Night Mode'}</span>
                </button>
              </div>

              {/* Account / Login section in mobile menu */}
              <div className="pt-3 border-t border-zinc-800/80">
                {customerUser ? (
                  <div className="space-y-2">
                    <div className="py-2 px-3 rounded-xl bg-zinc-900 text-zinc-300 text-xs flex items-center justify-between">
                      <span className="truncate">{customerUser.name}</span>
                      <span className="text-amber-400 text-[10px]">{customerUser.tier}</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsCustomerOrdersModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-2 px-3 rounded-xl bg-amber-400/10 text-amber-300 flex items-center space-x-2"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>My Orders & Tracking</span>
                    </button>
                    <button
                      onClick={() => {
                        customerLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-2 px-3 text-zinc-400 hover:text-rose-300 flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : adminUser ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNav('/admin/dashboard')}
                      className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-between"
                    >
                      <span className="flex items-center space-x-2">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </span>
                      <span className="text-[10px] bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded font-bold">CONSOLE</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsCustomerAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-400/20"
                  >
                    <User className="w-4 h-4" />
                    <span>Customer Sign In / VIP</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}
      </header>
    </>
  );
};
