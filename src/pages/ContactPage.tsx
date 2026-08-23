import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  Edit3, 
  Save, 
  X, 
  MapPin, 
  Sparkles, 
  Instagram, 
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { 
    addToast, 
    contactInfo, 
    updateContactInfo, 
    instagramSettings,
    updateInstagramPage,
    updateWhatsAppNumber 
  } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Quick edit mode for contact details
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editForm, setEditForm] = useState({
    email: contactInfo?.email || 'support@lunova.luxury',
    phone: contactInfo?.phone || '+92 315 0360126',
    whatsappNumber: contactInfo?.whatsappNumber || contactInfo?.phone || '+92 315 0360126',
    instagramHandle: instagramSettings?.handle || 'lunova.atelier',
    hours: contactInfo?.hours || 'Mon – Sat, 9:00 AM – 6:00 PM PKT / EST',
    address: contactInfo?.address || '750 Madison Avenue, New York, NY / Lahore Atelier'
  });

  const email = contactInfo?.email || 'support@lunova.luxury';
  const phone = contactInfo?.phone || '+92 315 0360126';
  const whatsappNumber = contactInfo?.whatsappNumber || phone;
  const hours = contactInfo?.hours || 'Mon – Sat, 9:00 AM – 6:00 PM PKT / EST';
  const address = contactInfo?.address || '750 Madison Avenue, New York, NY / Lahore Atelier';
  
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '') || '923150360126';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello LUNOVA Concierge, I'm reaching out with an inquiry regarding your lighting collections.")}`;
  const instagramUrl = instagramSettings.profileUrl || `https://instagram.com/${instagramSettings.handle || 'lunova.atelier'}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Please fill in all fields.', 'warning');
      return;
    }
    setSubmitted(true);
    addToast('Your message has been sent successfully.', 'success');
  };

  const handleSaveContactDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.email.trim() || !editForm.phone.trim()) {
      addToast('Email and phone number are required.', 'warning');
      return;
    }
    updateContactInfo({
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
      whatsappNumber: editForm.whatsappNumber.trim(),
      hours: editForm.hours.trim(),
      address: editForm.address.trim(),
      instagramHandle: `@${editForm.instagramHandle.replace(/^@+/, '').trim()}`,
      instagramUrl: `https://instagram.com/${editForm.instagramHandle.replace(/^@+/, '').trim()}`
    });
    if (editForm.whatsappNumber.trim()) {
      updateWhatsAppNumber(editForm.whatsappNumber.trim());
    }
    if (editForm.instagramHandle.trim()) {
      updateInstagramPage(editForm.instagramHandle.trim());
    }
    setIsEditingContact(false);
    addToast('Contact phone, WhatsApp, and Instagram have been updated live across the site!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-zinc-100 space-y-10">
      
      {/* Simple Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client Concierge & Atelier Relations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-white font-semibold">
          Contact Our Concierge
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light">
          Connect directly via WhatsApp, Instagram DM, or send our architectural lighting team a detailed brief.
        </p>
      </div>

      {/* Quick Direct Connect Action Cards (WhatsApp & Instagram) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WhatsApp Direct */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-zinc-950 border border-emerald-500/40 hover:border-emerald-400 shadow-xl transition-all group flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform shrink-0">
              <MessageCircle className="w-6 h-6 fill-zinc-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Direct WhatsApp Chat
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                  FAST RESPONSE
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Instant inquiry via official WhatsApp line: <span className="text-emerald-300 font-mono">{whatsappNumber}</span>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors text-xs font-mono font-bold shrink-0">
            <span>Open Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </a>

        {/* Instagram Direct */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/20 to-zinc-950 border border-pink-500/40 hover:border-pink-400 shadow-xl transition-all group flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform shrink-0">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Instagram DM & Feed
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[10px] font-mono font-bold">
                  OFFICIAL PAGE
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Direct message our verified profile: <span className="text-pink-300 font-mono">@{instagramSettings.handle || 'lunova.atelier'}</span>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-pink-500/20 text-pink-300 group-hover:bg-pink-500 group-hover:text-white transition-colors text-xs font-mono font-bold shrink-0">
            <span>Open Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Simple Contact Form (7 Cols) */}
        <div className="md:col-span-7 bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
          <div className="mb-5 pb-3 border-b border-zinc-800/80">
            <h2 className="text-base font-semibold text-white uppercase font-mono tracking-wider">
              Send an Architectural Inquiry
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Fill out this form and our private concierge will respond to your email.
            </p>
          </div>

          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-medium text-white">Thank You!</h3>
              <p className="text-sm text-zinc-300">
                Your message has been received. We will respond to <span className="text-amber-300">{formData.email}</span> as soon as possible.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', message: '' });
                }}
                className="mt-2 px-6 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-white uppercase tracking-wider hover:bg-zinc-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you? (Inquire about custom dimensions, moon lamp models, or shipping)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-zinc-950 font-bold uppercase tracking-wider text-xs font-mono flex items-center justify-center space-x-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Direct Edit Panel (5 Cols) */}
        <div className="md:col-span-5 bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md relative">
          
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h2 className="text-base font-semibold text-white uppercase font-mono tracking-wider">
              Concierge Directory
            </h2>
            
            {/* Quick Edit Button */}
            {!isEditingContact ? (
              <button
                onClick={() => {
                  setEditForm({
                    email: contactInfo?.email || email,
                    phone: contactInfo?.phone || phone,
                    whatsappNumber: contactInfo?.whatsappNumber || whatsappNumber,
                    hours: contactInfo?.hours || hours,
                    address: contactInfo?.address || address
                  });
                  setIsEditingContact(true);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-mono transition-all cursor-pointer"
                title="Edit Store Phone, WhatsApp & Email"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Info</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingContact(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors"
                title="Cancel Edit"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* If In Editing Mode */}
          {isEditingContact ? (
            <form onSubmit={handleSaveContactDetails} className="space-y-4 text-xs animate-in fade-in duration-200">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] leading-relaxed flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Changes saved here instantly update customer WhatsApp & live website contact channels.</span>
              </div>

              <div>
                <label className="block text-zinc-300 font-mono uppercase mb-1 flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+1 (800) 840-5866"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-mono uppercase mb-1 flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  <span>WhatsApp Number (with Country Code) *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+92 315 0360126"
                  value={editForm.whatsappNumber}
                  onChange={(e) => setEditForm({ ...editForm, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-400 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-mono uppercase mb-1 flex items-center space-x-1">
                  <Instagram className="w-3 h-3 text-pink-400" />
                  <span>Instagram Handle / Page *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="lunova.atelier"
                  value={editForm.instagramHandle}
                  onChange={(e) => setEditForm({ ...editForm, instagramHandle: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-pink-400 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-mono uppercase mb-1 flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-amber-400" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="support@lunova.luxury"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-mono uppercase mb-1 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Business Hours</span>
                </label>
                <input
                  type="text"
                  placeholder="Mon – Sat, 9:00 AM – 6:00 PM EST"
                  value={editForm.hours}
                  onChange={(e) => setEditForm({ ...editForm, hours: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-mono uppercase mb-1 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Atelier Address</span>
                </label>
                <input
                  type="text"
                  placeholder="750 Madison Avenue, New York, NY"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold font-mono uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Info</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingContact(false)}
                  className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Live Display View */
            <div className="space-y-4 text-sm">
              
              {/* WhatsApp Direct */}
              <div className="flex items-start space-x-3 text-zinc-300 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 fill-emerald-400" />
                <div className="flex-1">
                  <div className="text-xs text-emerald-300 font-mono uppercase font-bold flex items-center space-x-1.5">
                    <span>WhatsApp Direct Support</span>
                  </div>
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-emerald-300 font-mono text-xs font-semibold flex items-center space-x-1 mt-0.5 transition-colors"
                  >
                    <span>{whatsappNumber}</span>
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </a>
                </div>
              </div>

              {/* Instagram Direct */}
              <div className="flex items-start space-x-3 text-zinc-300 p-3 rounded-xl bg-pink-950/20 border border-pink-500/20">
                <Instagram className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs text-pink-300 font-mono uppercase font-bold flex items-center space-x-1.5">
                    <span>Instagram Page</span>
                  </div>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-pink-300 font-mono text-xs flex items-center space-x-1 font-semibold transition-colors mt-0.5"
                  >
                    <span>@{instagramSettings.handle || 'lunova.atelier'}</span>
                    <ExternalLink className="w-3 h-3 text-pink-400" />
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-zinc-300 pt-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-400 font-mono uppercase">Email</div>
                  <a href={`mailto:${email}`} className="hover:text-amber-300 transition-colors break-all">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-zinc-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-400 font-mono uppercase">Phone</div>
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-amber-300 transition-colors">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-zinc-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-400 font-mono uppercase">Hours</div>
                  <div>{hours}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-zinc-300 pt-2 border-t border-zinc-900">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-400 font-mono uppercase">Atelier & HQ</div>
                  <div>{address}</div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
