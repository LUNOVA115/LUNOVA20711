import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Home, 
  ShoppingBag, 
  MessageCircle, 
  Phone, 
  Instagram, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface HamburgerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HamburgerDrawer: React.FC<HamburgerDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    currentPath, 
    navigate, 
    categories, 
    products, 
    filters, 
    setFilters, 
    contactInfo, 
    instagramSettings 
  } = useStore();

  const [shopExpanded, setShopExpanded] = useState(true);
  const [contactExpanded, setContactExpanded] = useState(true);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper to get active product count per category
  const getCategoryProductCount = (catName: string) => {
    return products.filter(
      (p) => p.status === 'active' && p.category.toLowerCase() === catName.toLowerCase()
    ).length;
  };

  // Helper for category navigation
  const handleCategoryClick = (catName: string) => {
    setFilters((prev) => ({ ...prev, category: catName }));
    navigate('/shop');
    onClose();
  };

  // Format clean phone/whatsapp numbers for tel: and wa.me links
  const whatsappRaw = contactInfo.whatsappNumber || '+923150360126';
  const whatsappCleaned = whatsappRaw.replace(/[^0-9]/g, '');
  const whatsappLink = `https://wa.me/${whatsappCleaned}`;

  const phoneRaw = contactInfo.phone || '+923150360126';
  const phoneCleaned = phoneRaw.replace(/[^0-9+]/g, '');
  const phoneLink = `tel:${phoneCleaned}`;

  const instagramHandle = instagramSettings.handle || contactInfo.instagramHandle || '@lunova.home_decors';
  const instagramUrl = contactInfo.instagramUrl || instagramSettings.profileUrl || `https://www.instagram.com/lunova.home_decors/`;

  const isHomeActive = currentPath === '/';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        aria-hidden="true"
      />

      {/* Side Drawer Container */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-md bg-[#08090D] border-r border-amber-500/20 shadow-2xl shadow-black flex flex-col justify-between transform transition-transform duration-300 ease-in-out animate-slideInLeft text-zinc-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/80 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-zinc-950 font-black text-xs shadow-md shadow-amber-500/30">
                L
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-serif tracking-[0.2em] text-white uppercase font-bold leading-tight">
                  LU<span className="text-amber-400">NOVA</span>
                </span>
                <span className="text-[9px] font-mono tracking-[0.2em] text-amber-400/90 uppercase font-semibold">
                  NAVIGATION MENU
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 border border-zinc-800 hover:border-amber-400/40 transition-all cursor-pointer group"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Scrollable Main Navigation Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-amber-500/20">
            
            {/* =========================================================================
                OPTION 1: HOME
            ========================================================================= */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-bold px-1">
                01. MAIN
              </span>
              <button
                onClick={() => {
                  navigate('/');
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 group cursor-pointer ${
                  isHomeActive 
                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-amber-400/50 text-amber-300 shadow-lg shadow-amber-500/10' 
                    : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80 hover:border-zinc-700 text-zinc-200 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl ${isHomeActive ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-amber-400 group-hover:bg-amber-400 group-hover:text-zinc-950'} transition-colors`}>
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] leading-tight">
                      HOME
                    </h3>
                    <p className="text-[11px] font-sans text-zinc-400 mt-0.5">
                      LUNOVA Customer Portal & Showcase
                    </p>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isHomeActive ? 'text-amber-400' : 'text-zinc-400 group-hover:text-amber-300'}`} />
              </button>
            </div>

            {/* =========================================================================
                OPTION 2: SHOP & ALL CATEGORIES
            ========================================================================= */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-bold">
                  02. CATALOG
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  {categories.length} CATEGORIES
                </span>
              </div>

              {/* SHOP Main Option Button */}
              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl overflow-hidden transition-all">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors"
                  onClick={() => setShopExpanded(!shopExpanded)}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-500/20">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">
                        SHOP
                      </h3>
                      <p className="text-[11px] font-sans text-zinc-400 mt-0.5">
                        Explore all luxury decor collections
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilters((prev) => ({ ...prev, category: 'all' }));
                        navigate('/shop');
                        onClose();
                      }}
                      className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 rounded-lg border border-amber-400/30 transition-all cursor-pointer"
                      title="View all products"
                    >
                      All Products
                    </button>
                    <button className="p-1 text-zinc-400 hover:text-amber-300 transition-colors">
                      {shopExpanded ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submenu: ALL Product Categories */}
                {shopExpanded && (
                  <div className="border-t border-zinc-800/80 bg-zinc-950/60 p-3 space-y-2 animate-fadeIn">
                    
                    {/* Category: ALL */}
                    <button
                      onClick={() => handleCategoryClick('all')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all group cursor-pointer ${
                        filters.category === 'all' 
                          ? 'bg-amber-400/15 border-amber-400/50 text-amber-300' 
                          : 'bg-zinc-900/40 hover:bg-zinc-900 border-zinc-800/60 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-mono text-xs font-bold uppercase tracking-wider">
                            View Entire Collection
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            All {products.filter(p => p.status === 'active').length} active products
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform group-hover:text-amber-400" />
                    </button>

                    {/* Dynamic List of Categories */}
                    {categories.map((cat) => {
                      const count = getCategoryProductCount(cat.name);
                      const isSelected = filters.category.toLowerCase() === cat.name.toLowerCase();

                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.name)}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all group cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-400/15 border-amber-400/50 text-amber-300 font-bold shadow-md shadow-amber-500/10' 
                              : 'bg-zinc-900/40 hover:bg-zinc-900 border-zinc-800/60 text-zinc-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            {cat.image ? (
                              <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="w-9 h-9 rounded-lg object-cover border border-zinc-700/80 shrink-0 bg-zinc-900"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0 border border-zinc-700">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-mono text-xs font-bold uppercase tracking-wider truncate">
                                {cat.name}
                              </div>
                              {cat.description && (
                                <p className="text-[10px] text-zinc-400 line-clamp-1 font-sans">
                                  {cat.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0 ml-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                              {count} {count === 1 ? 'item' : 'items'}
                            </span>
                            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform group-hover:text-amber-400" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* =========================================================================
                OPTION 3: CONTACT ADMIN (Dynamic Settings Data)
            ========================================================================= */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-bold">
                  03. CONCIERGE & SUPPORT
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SUPPORT ONLINE</span>
                </span>
              </div>

              {/* ATELIER CONCIERGE Main Box */}
              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl overflow-hidden">
                
                {/* Section Header */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors"
                  onClick={() => setContactExpanded(!contactExpanded)}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">
                        ATELIER CONCIERGE
                      </h3>
                      <p className="text-[11px] font-sans text-zinc-400 mt-0.5">
                        Direct Customer Care & Support Channels
                      </p>
                    </div>
                  </div>
                  <button className="p-1 text-zinc-400 hover:text-amber-300 transition-colors">
                    {contactExpanded ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>

                {/* Submenu: Dynamic Contact Options */}
                {contactExpanded && (
                  <div className="border-t border-zinc-800/80 bg-zinc-950/60 p-3 space-y-2.5 animate-fadeIn">
                    
                    {/* 1. WHATSAPP */}
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 hover:border-emerald-400 text-left flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                          <MessageCircle className="w-5 h-5 fill-emerald-500/20 stroke-[2.2]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                              WhatsApp Support
                            </span>
                            <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                              INSTANT
                            </span>
                          </div>
                          <div className="font-mono text-xs text-zinc-200 mt-0.5 truncate font-semibold">
                            {contactInfo.whatsappNumber || '+92 315 0360126'}
                          </div>
                          <p className="text-[10px] text-emerald-400/80 font-sans mt-0.5">
                            Click to launch official WhatsApp chat
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
                    </a>

                    {/* 2. MOBILE / PHONE NUMBER */}
                    <a
                      href={phoneLink}
                      className="w-full p-3.5 rounded-xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 hover:border-amber-400 text-left flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 border border-amber-500/30 group-hover:scale-105 transition-transform">
                          <Phone className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-amber-300">
                              Mobile Call Support
                            </span>
                            <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                              DIAL
                            </span>
                          </div>
                          <div className="font-mono text-xs text-zinc-200 mt-0.5 truncate font-semibold">
                            {contactInfo.phone || '+92 315 0360126'}
                          </div>
                          <p className="text-[10px] text-amber-400/80 font-sans mt-0.5">
                            Click to open phone dialer directly
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
                    </a>

                    {/* 3. INSTAGRAM ACCOUNT */}
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3.5 rounded-xl bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/30 hover:border-pink-400 text-left flex items-center justify-between transition-all group cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 shrink-0 border border-pink-500/30 group-hover:scale-105 transition-transform">
                          <Instagram className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-pink-300">
                              Instagram Atelier
                            </span>
                            <span className="text-[9px] font-mono font-bold bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded border border-pink-500/30">
                              ATELIER
                            </span>
                          </div>
                          <div className="font-mono text-xs text-zinc-200 mt-0.5 truncate font-semibold">
                            {instagramHandle}
                          </div>
                          <p className="text-[10px] text-pink-400/80 font-sans mt-0.5">
                            Click to view official Instagram profile
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
                    </a>

                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Drawer Footer Banner */}
          <div className="p-6 border-t border-zinc-800/80 bg-zinc-950/90 text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>HANDMADE HOME DECOR • MADE IN PAKISTAN</span>
            </div>
            <p className="text-[10px] font-mono text-zinc-400">
              © {new Date().getFullYear()} LUNOVA Luxury Atelier. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
