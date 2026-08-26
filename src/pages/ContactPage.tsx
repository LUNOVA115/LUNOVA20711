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
  ArrowRight
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
    <div className="w-full max-w-[calc(100%-1cm)] mx-auto py-8 sm:py-12 text-zinc-100">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-amber-400 font-semibold block">
          ATELIER SUPPORT & CONCIERGE
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-white font-light tracking-tight">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
          Have a question about our collections, custom orders, or delivery? We’re here to help.
        </p>
      </div>

      {/* Two-Column Contact Section (Compact Height) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Dark Contact-Information Card */}
        <div className="lg:col-span-5 bg-[#0b0c10] border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          {/* Ambient Glow Accent */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            {/* Card Header */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400/90 font-bold block mb-0.5">
                DIRECT CLIENT RELATIONS
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-white font-normal">
                LUNOVA Concierge
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                Dedicated assistance for bespoke architectural illuminations & custom orders.
              </p>
            </div>

            {/* Directory Details List */}
            <div className="space-y-3 text-xs pt-2 border-t border-zinc-800/80">
              
              {/* Email Address - VISIBLE ONLY ON ADMIN SIDE */}
              {adminUser && (
                <div className="flex items-start space-x-3 group/item">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                        Email Address
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold">
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

              {/* Phone */}
              <div className="flex items-start space-x-3 group/item">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    Mobile Hotline
                  </div>
                  <a 
                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`} 
                    className="text-zinc-200 hover:text-amber-300 transition-colors text-xs font-mono font-medium mt-0.5 block"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start space-x-3 group/item">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-pink-400 shrink-0 mt-0.5">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    Official Instagram
                  </div>
                  <a 
                    href={instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-zinc-200 hover:text-pink-300 transition-colors text-xs font-mono font-medium mt-0.5 inline-flex items-center space-x-1"
                  >
                    <span>@{instagramHandle}</span>
                    <ExternalLink className="w-3 h-3 text-pink-400/80" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3 group/item">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    Concierge Hours
                  </div>
                  <div className="text-zinc-200 text-xs font-sans mt-0.5">
                    {hours}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3 group/item pt-0.5">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 shrink-0 mt-0.5">
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

            </div>
          </div>

          {/* Bottom WhatsApp CTA Button */}
          <div className="relative z-10 mt-5 pt-4 border-t border-zinc-800/80">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all duration-200 cursor-pointer group hover:scale-[1.005]"
            >
              <MessageCircle className="w-4 h-4 fill-zinc-950" />
              <span>Chat on WhatsApp →</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Light Contact-Form Card */}
        <div className="lg:col-span-7 bg-[#F5F2EB] text-zinc-900 rounded-2xl p-5 sm:p-6 shadow-2xl border border-stone-200/80 flex flex-col justify-between relative">
          
          <div>
            {/* Card Header */}
            <div className="mb-4 pb-2 border-b border-stone-300/60">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-500 font-bold block mb-0.5">
                ELECTRONIC BRIEF
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-zinc-900 font-normal">
                Send a Message
              </h2>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-serif text-zinc-900">Thank You</h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Your message has been received by our client concierge. We will respond to <strong className="text-zinc-900">{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Your Name */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-600 font-bold mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-zinc-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-sans text-xs shadow-sm"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-600 font-bold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. eleanor@atelier.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-zinc-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-sans text-xs shadow-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-600 font-bold mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Specify your inquiry details, custom dimension requests, or installation timelines..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-zinc-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-sans text-xs shadow-sm resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group hover:scale-[1.002]"
                >
                  <span>SEND MESSAGE →</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>

              </form>
            )}
          </div>

        </div>

      </div>

      {/* Frequently Asked Questions Section (Directly below Contact sections with 1 cm vertical gap) */}
      <div className="mt-[1cm] w-full bg-[#0b0c10] border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 pb-3 border-b border-zinc-800/80 flex items-center space-x-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block">
            CLIENT INQUIRIES
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-white font-normal">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-amber-400/30 transition-all"
            >
              <div className="space-y-2">
                <h3 className="text-xs sm:text-sm font-semibold text-amber-300 leading-snug">
                  {faq.question}
                </h3>
                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
