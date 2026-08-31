import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Mail,
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Instagram, 
  ExternalLink,
  MessageCircle,
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { 
    addToast, 
    contactInfo, 
    instagramSettings,
    adminUser
  } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const email = contactInfo?.email || 'support@lunova.luxury';
  const phone = contactInfo?.phone || '+92 315 0360126';
  const whatsappNumber = contactInfo?.whatsappNumber || phone;
  const hours = contactInfo?.hours || 'Mon – Sat, 9:00 AM – 6:00 PM PKT / EST';
  const address = contactInfo?.address || '750 Madison Avenue, New York, NY / Lahore Atelier';
  
  const cleanPhone = whatsappNumber.replace(/[^0-9+]/g, '') || '923150360126';
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent("Hello LUNOVA Concierge, I'm reaching out with an inquiry regarding your lighting collections.")}`;
  const instagramUrl = instagramSettings?.profileUrl || contactInfo?.instagramUrl || `https://www.instagram.com/${instagramSettings?.handle?.replace(/^@+/, '') || 'lunova.home_decors'}/?hl=en`;
  const instagramHandle = instagramSettings?.handle?.replace(/^@+/, '') || 'lunova.home_decors';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Please fill in all fields.', 'warning');
      return;
    }
    setSubmitted(true);
    addToast('Your message has been sent successfully.', 'success');
  };

  const faqs = [
    {
      question: 'Are LUNOVA products handmade?',
      answer: 'Yes. Every LUNOVA piece is thoughtfully crafted with attention to detail, combining traditional artisanal techniques with contemporary design to create distinctive and timeless home décor.'
    },
    {
      question: 'Where are LUNOVA products made?',
      answer: 'LUNOVA is proudly made in Pakistan. Our collections bring together local craftsmanship, artistic expression, and modern design to create premium décor for contemporary spaces.'
    },
    {
      question: 'Do you offer customization or bespoke pieces?',
      answer: 'Yes. Selected LUNOVA pieces can be customized or created as bespoke designs. You can contact our team with your preferred dimensions, finish, or design requirements, and we’ll guide you through the available options.'
    }
  ];

  return (
    <div className="w-full max-w-[calc(100%-2in)] mx-auto py-8 sm:py-10 text-zinc-100">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-400 font-semibold block">
          ATELIER SUPPORT & CONCIERGE
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif text-white font-light tracking-tight">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
          Have a question about our collections, custom orders, or delivery? We’re here to help.
        </p>
      </div>

      {/* Concierge & Send Message Dual Side-by-Side Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch mb-10">
        
        {/* 1. FIRST SECTION (Left): Mobile Number / LUNOVA Concierge */}
        <div className="bg-[#0b0c10] border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden group flex flex-col justify-between min-h-[412px] h-full">
          {/* Ambient Glow Accent */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            {/* Card Header & WhatsApp Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-zinc-800/80">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-amber-400/90 font-bold block mb-1">
                  DIRECT CLIENT RELATIONS
                </span>
                <h2 className="text-xl sm:text-2xl font-serif text-white font-normal">
                  LUNOVA Concierge
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5 font-light leading-relaxed">
                  Dedicated assistance for bespoke architectural illuminations & custom orders.
                </p>
              </div>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all duration-200 cursor-pointer group hover:scale-[1.01] shrink-0"
              >
                <MessageCircle className="w-4 h-4 fill-zinc-950" />
                <span>Chat on WhatsApp →</span>
              </a>
            </div>

            {/* Directory Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs flex-1 content-center">
              
              {/* Phone / Mobile Hotline */}
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/70">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    Mobile Hotline
                  </div>
                  <a 
                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`} 
                    className="text-zinc-200 hover:text-amber-300 transition-colors text-xs font-mono font-medium mt-0.5 block truncate"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/70">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-pink-400 shrink-0">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    Official Instagram
                  </div>
                  <a 
                    href={instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-zinc-200 hover:text-pink-300 transition-colors text-xs font-mono font-medium mt-0.5 inline-flex items-center space-x-1 truncate"
                  >
                    <span className="truncate">@{instagramHandle}</span>
                    <ExternalLink className="w-3 h-3 text-pink-400/80 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/70">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    Concierge Hours
                  </div>
                  <div className="text-zinc-200 text-xs font-sans mt-0.5 leading-snug">
                    {hours}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/70">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    Atelier & Showroom
                  </div>
                  <div className="text-zinc-200 text-xs font-sans mt-0.5 leading-snug">
                    {address}
                  </div>
                </div>
              </div>

              {/* Email Address - VISIBLE ONLY ON ADMIN SIDE */}
              {adminUser && (
                <div className="sm:col-span-2 flex items-start space-x-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                        Email Address
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold">
                        ADMIN ONLY
                      </span>
                    </div>
                    <a 
                      href={`mailto:${email}`} 
                      className="text-amber-300 hover:text-amber-200 transition-colors text-xs font-mono break-all font-medium mt-0.5 block"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* 2. SECOND SECTION (Right): Send a Message */}
        <div className="bg-[#F5F2EB] text-zinc-900 rounded-2xl p-5 sm:p-6 shadow-2xl border border-stone-200/80 relative flex flex-col justify-between min-h-[412px] h-full">
          <div className="w-full flex flex-col justify-between h-full">
            {/* Card Header */}
            <div className="mb-3.5 pb-3 border-b border-stone-300/70 text-left">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-stone-500 font-bold block mb-1">
                ELECTRONIC BRIEF
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-zinc-900 font-normal">
                Send a Message
              </h2>
              <p className="text-xs text-stone-600 font-light mt-0.5">
                Submit your project details or inquiries directly to our engineering and design team.
              </p>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-3 my-auto">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-serif text-zinc-900">Thank You</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Your message has been received by our client concierge. We will respond to <strong className="text-zinc-900">{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 flex flex-col justify-between flex-1">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Your Name */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-zinc-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-sans text-xs shadow-sm"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. eleanor@atelier.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-zinc-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-sans text-xs shadow-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex-1 flex flex-col">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Specify your inquiry details, custom dimension requests, or installation timelines..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full flex-1 min-h-[76px] px-3 py-2 bg-white border border-stone-300 rounded-xl text-zinc-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-sans text-xs shadow-sm resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-[1.002] mt-auto"
                >
                  <span>SEND MESSAGE →</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>

              </form>
            )}
          </div>
        </div>

      </div>

      {/* 0.5 inch space before FAQ section */}
      <div className="h-[0.5in]" />

      {/* 3. FAQ SECTION: Frameless / Cardless on Textured Background */}
      <div className="w-full">
        {/* Section Header */}
        <div className="mb-8 pb-4 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-semibold block mb-1">
              CURATED ANSWERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-light max-w-md">
            Everything you need to know about our handcrafted collections, materials, and bespoke commissions.
          </p>
        </div>

        {/* FAQs List rendered directly on textured page background without enclosing boxes/cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="space-y-2.5 pb-6 border-b border-zinc-800/50 md:border-b-0 md:border-r md:border-zinc-800/40 md:pr-8 last:border-b-0 md:last:border-r-0 md:last:pr-0"
            >
              <h3 className="text-base sm:text-lg font-serif text-white font-normal flex items-start space-x-2.5">
                <span className="text-amber-400/80 font-mono text-xs mt-1 shrink-0">
                  0{index + 1}.
                </span>
                <span className="leading-snug">{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
