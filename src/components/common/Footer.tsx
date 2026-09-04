import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Lock,
  MessageCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    navigate, 
    setIsCustomerOrdersModalOpen, 
    adminUser,
    contactInfo,
    instagramSettings,
    addToast
  } = useStore();

  const displayWhatsapp = contactInfo?.whatsappNumber || contactInfo?.phone || '+92 315 0360126';
  const whatsappDigits = displayWhatsapp.replace(/[^0-9]/g, '') || '923150360126';
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hello LUNOVA Concierge, I'm inquiring about an order / handcrafted piece.")}`;

  const instagramHandle = instagramSettings?.handle || contactInfo?.instagramHandle?.replace('@', '') || 'lunova.home_decors';
  const instagramUrl = instagramSettings?.profileUrl || contactInfo?.instagramUrl || `https://www.instagram.com/${instagramHandle}/?hl=en`;

  return (
    <footer className="bg-[#06070a] border-t border-amber-500/15 text-zinc-300 relative overflow-hidden transition-colors duration-300">
      
      {/* Subtle Ambient Background Luxury Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[260px] bg-radial from-amber-500/12 via-amber-700/5 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none blur-2xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 relative z-10 space-y-12 sm:space-y-14">
        
        {/* =========================================================================
            MAIN FOOTER LAYOUT: BRAND COLUMN + 3 NAVIGATION COLUMNS IN ONE HORIZONTAL ROW
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* 1. LUNOVA BRAND & LOGO COLUMN (Spans 4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-5 pr-0 lg:pr-6">
            <div 
              onClick={() => navigate('/')}
              className="flex items-center cursor-pointer group inline-block select-none"
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl sm:text-3xl font-serif tracking-[0.28em] text-white uppercase leading-none font-semibold group-hover:text-amber-100 transition-colors">
                    LU<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-bold">NOVA</span>
                  </span>
                  <span 
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 text-zinc-950 shadow-md shadow-amber-400/30 -mt-0.5" 
                    title="Verified Authentic Atelier"
                  >
                    <svg className="w-2.5 h-2.5 stroke-[3.5] stroke-current fill-none" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-300/90 leading-relaxed font-light pt-1 pr-2 max-w-sm">
              LUNOVA is a modern luxury home décor atelier where timeless craftsmanship meets contemporary design. Rooted in Pakistan’s rich artisan heritage, each piece is thoughtfully handcrafted to bring sculptural elegance to modern spaces worldwide.
            </p>
          </div>

          {/* 3 NAVIGATION SECTIONS IN ONE HORIZONTAL ROW (Spans 8 cols on desktop, grid-cols-3) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 pt-2 sm:pt-0">
            
            {/* 1. COLLECTIONS */}
            <div className="space-y-4">
              <h4 className="text-xs font-serif uppercase tracking-[0.22em] text-amber-200/95 font-bold whitespace-nowrap border-b border-zinc-800/80 pb-2 flex items-center space-x-2">
                <span>COLLECTIONS</span>
              </h4>
              <ul className="space-y-3 text-xs text-zinc-300 font-light">
                <li>
                  <button 
                    onClick={() => navigate('/collections/moon')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">Moon Lamps</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/collections/infinity')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">Infinity Table</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/shop')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">Magic Coffee Tables</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/collections')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer text-zinc-400 hover:text-amber-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-amber-400 transition-colors" />
                    <span className="group-hover:translate-x-0.5 transition-transform">View All Collections</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* 2. ATELIER & STUDIO */}
            <div className="space-y-4">
              <h4 className="text-xs font-serif uppercase tracking-[0.22em] text-amber-200/95 font-bold whitespace-nowrap border-b border-zinc-800/80 pb-2 flex items-center space-x-2">
                <span>ATELIER & STUDIO</span>
              </h4>
              <ul className="space-y-3 text-xs text-zinc-300 font-light">
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">Our Story & Heritage</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/contact')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">Custom Bespoke Atelier</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">Craft Journal & Process</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/flash-deals')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">Flash Curations & Deals</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/contact')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">Showroom & Atelier Hub</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* 3. CUSTOMER CARE */}
            <div className="space-y-4">
              <h4 className="text-xs font-serif uppercase tracking-[0.22em] text-amber-200/95 font-bold whitespace-nowrap border-b border-zinc-800/80 pb-2 flex items-center space-x-2">
                <span>CONCIERGE & CARE</span>
              </h4>
              <ul className="space-y-3 text-xs text-zinc-300 font-light">
                <li>
                  <button 
                    onClick={() => setIsCustomerOrdersModalOpen(true)} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">Track Your Order</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/contact')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">White-Glove Shipping & Returns</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">Materials & Care Guide</span>
                  </button>
                </li>
                <li className="pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 font-medium text-emerald-400 hover:text-emerald-300 transition-colors group cursor-pointer"
                    title={`Direct WhatsApp Support (${displayWhatsapp})`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-emerald-400/20 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-xs font-semibold text-emerald-400 group-hover:underline">WhatsApp: {displayWhatsapp}</span>
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/contact')} 
                    className="hover:text-amber-300 transition-colors text-left flex items-center space-x-2 group cursor-pointer text-zinc-400 hover:text-amber-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-amber-400 transition-colors" />
                    <span className="group-hover:translate-x-0.5 transition-transform">FAQs & Live Concierge</span>
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center space-x-2">
            <span>© 2026 LUNOVA ATELIER. HANDCRAFTED IN PAKISTAN. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button 
              onClick={() => navigate('/about')} 
              className="hover:text-amber-300 text-zinc-400 transition-colors cursor-pointer"
            >
              Provenance
            </button>
            <button 
              onClick={() => navigate('/contact')} 
              className="hover:text-amber-300 text-zinc-400 transition-colors cursor-pointer"
            >
              Concierge
            </button>
            <button 
              onClick={() => navigate('/shop')} 
              className="hover:text-amber-300 text-zinc-400 transition-colors cursor-pointer"
            >
              Atelier Vault
            </button>
            <button 
              onClick={() => navigate(adminUser ? '/admin/dashboard' : '/admin/login')} 
              className="hover:text-amber-300 text-amber-400/90 transition-colors cursor-pointer inline-flex items-center space-x-1 font-semibold"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>{adminUser ? 'Admin Control Panel' : 'Admin Login'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
