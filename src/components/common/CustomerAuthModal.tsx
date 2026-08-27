import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, User, Mail, Lock, Phone, Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const {
    isCustomerAuthModalOpen,
    setIsCustomerAuthModalOpen,
    customerLogin,
    customerRegister,
    customerUser,
    customers,
    navigate
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isCustomerAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const res = customerLogin(email, password);
        setLoading(false);
        if (res.success) {
          setIsCustomerAuthModalOpen(false);
          setEmail('');
          setPassword('');
        } else {
          setError(res.message);
        }
      } else {
        const res = customerRegister(name, email, phone);
        setLoading(false);
        if (res.success) {
          setIsCustomerAuthModalOpen(false);
          setName('');
          setEmail('');
          setPhone('');
          setPassword('');
        } else {
          setError(res.message);
        }
      }
    }, 350);
  };

  const handleQuickCustomerLogin = (customerEmail: string) => {
    setError('');
    customerLogin(customerEmail);
    setIsCustomerAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative bg-[#0d0e12] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-black/80 space-y-6 text-zinc-200">
        
        {/* Close Button */}
        <button
          onClick={() => setIsCustomerAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20 font-mono font-bold">
            <Sparkles className="w-6 h-6 text-zinc-950" />
          </div>
          <div>
            <h2 className="text-xl font-light tracking-wide text-white uppercase font-sans">
              LUNOVA <span className="font-semibold text-amber-300">Client Portal</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {mode === 'login' 
                ? 'Sign in to access your orders, saved lighting vault & VIP benefits' 
                : 'Create your private LUNOVA VIP client profile'}
            </p>
          </div>
        </div>

        {/* Tabs: Sign In / Create Account */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-amber-400 text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Client Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-amber-400 text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            New VIP Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {mode === 'register' && (
            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sophia Vance"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sophia.v@luxurydwell.com"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
                Phone (Optional for White-Glove Updates)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-400/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Client Account' : 'Create VIP Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Login for Existing Client */}
        {mode === 'login' && customers.length > 0 && (
          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
              Quick Client Profiles (1-Click Login):
            </div>
            <div className="grid grid-cols-2 gap-2">
              {customers.slice(0, 2).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleQuickCustomerLogin(c.email)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-400/40 text-left transition-all group"
                >
                  <div className="font-semibold text-white truncate text-[11px] group-hover:text-amber-300">{c.name}</div>
                  <div className="text-[9px] text-amber-400/80 font-mono">{c.tier} Client</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500 font-mono">
          Client VIP Authentication Portal
        </div>

      </div>
    </div>
  );
};
