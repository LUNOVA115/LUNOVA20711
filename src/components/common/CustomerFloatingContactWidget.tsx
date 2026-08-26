import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  MessageCircle, 
  Instagram, 
  X, 
  Send, 
  ExternalLink, 
  Sparkles, 
  Phone, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Mail,
  MapPin
} from 'lucide-react';

export const CustomerFloatingContactWidget: React.FC = () => {
  const { contactInfo, instagramSettings, currentPath } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  // Hide in admin backend so admins have a clean console
  if (currentPath.startsWith('/admin')) {
    return null;
  }

  const rawPhone = contactInfo?.whatsappNumber || contactInfo?.phone || '+92 315 0360126';
  // Clean phone for wa.me link (keep only numbers)
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '') || '923150360126';
  
  const rawHandle = instagramSettings.handle || contactInfo?.instagramHandle || 'lunova.home_decors';
  const instagramHandle = rawHandle.replace('@', '').trim();
  const instagramUrl = instagramSettings.profileUrl || contactInfo?.instagramUrl || `https://www.instagram.com/${instagramHandle}/?hl=en`;

  // Default prefilled WhatsApp message
  const defaultWhatsAppText = customMessage.trim() 
    ? encodeURIComponent(customMessage.trim()) 
    : encodeURIComponent("Hello LUNOVA Concierge, I'd like to inquire about your bespoke architectural lighting & infinity collections.");

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${defaultWhatsAppText}`;

  const handleOpenWhatsApp = (customText?: string) => {
    const textToSend = customText ? encodeURIComponent(customText) : defaultWhatsAppText;
    window.open(`https://wa.me/${cleanPhone}?text=${textToSend}`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenInstagram = () => {
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Direct Contact Popup */}
      {isOpen && (
        <div className="mb-3 w-84 sm:w-96 rounded-3xl bg-[#090A10]/95 backdrop-blur-2xl border border-zinc-800/90 shadow-2xl shadow-black/90 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-1 ring-white/10 text-xs">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-emerald-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider text-xs flex items-center space-x-1.5">
                  <span>Concierge & Support</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Direct Response • WhatsApp & Instagram
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
              aria-label="Close Contact Widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-zinc-300 leading-relaxed text-[11px] font-light">
            Connect directly with the atelier team for instant product inquiries, custom dimensions, shipping questions, or bespoke lighting consultations.
          </p>

          {/* Contact Methods */}
          <div className="space-y-2.5">
            
            {/* 1. WHATSAPP DIRECT CHAT */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 hover:border-emerald-400 text-emerald-100 flex items-center justify-between group transition-all shadow-lg shadow-emerald-950/30"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform shrink-0">
                  <MessageCircle className="w-5 h-5 fill-zinc-950" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                    <span>Chat on WhatsApp</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] uppercase font-bold">
                      Instant
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-300/80 font-mono mt-0.5">
                    {rawPhone}
                  </div>
                </div>
              </div>

              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>

            {/* 2. INSTAGRAM DIRECT MESSAGE */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3.5 rounded-2xl bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/40 hover:border-pink-400 text-pink-100 flex items-center justify-between group transition-all shadow-lg shadow-pink-950/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-pink-500/30 group-hover:scale-105 transition-transform shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                    <span>DM on Instagram</span>
                    <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-[9px] uppercase font-bold">
                      Verified
                    </span>
                  </div>
                  <div className="text-[10px] text-pink-300/80 font-mono mt-0.5">
                    @{instagramHandle}
                  </div>
                </div>
              </div>

              <div className="p-1.5 rounded-xl bg-pink-500/20 text-pink-300 group-hover:bg-pink-500 group-hover:text-zinc-950 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>

          </div>

          {/* Quick Inquiry Message Pre-builder */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block font-semibold">
              Or quick send inquiry:
            </span>
            <div className="relative">
              <input
                type="text"
                placeholder="Type your question or custom request..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customMessage.trim()) {
                    handleOpenWhatsApp();
                  }
                }}
                className="w-full pl-3 pr-10 py-2.5 bg-zinc-950 border border-zinc-700/80 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => handleOpenWhatsApp()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 transition-colors"
                title="Send via WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Synced Contact Info Card */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-1.5 text-[10px] text-zinc-300">
            <div className="flex items-center space-x-2 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{contactInfo?.hours || 'Mon – Sat, 9:00 AM – 6:00 PM PKT / EST'}</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{contactInfo?.address || '750 Madison Avenue, New York, NY / Lahore Atelier'}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono pt-1">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified Concierge & Atelier Line</span>
            </span>
            <span>Typical reply: &lt; 15 mins</span>
          </div>

        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 hover:from-zinc-800 hover:to-zinc-900 border border-amber-400/40 hover:border-amber-400 text-white shadow-2xl shadow-black/90 transition-all hover:scale-105 cursor-pointer ring-1 ring-amber-400/20"
        aria-label="Contact Concierge via WhatsApp or Instagram"
      >
        {/* Glowing aura */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-pink-500 opacity-30 group-hover:opacity-75 blur-sm transition-opacity pointer-events-none" />

        <div className="relative flex items-center space-x-2">
          {/* Dual Icon Stack */}
          <div className="flex items-center -space-x-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-md">
              <MessageCircle className="w-3.5 h-3.5 fill-zinc-950" />
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md">
              <Instagram className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-bold tracking-wider uppercase text-white font-mono flex items-center space-x-1">
              <span>Contact Us</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[9px] text-amber-300/90 font-mono -mt-0.5">
              WhatsApp & IG
            </div>
          </div>
        </div>
      </button>

    </div>
  );
};
