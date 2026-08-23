import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertTriangle, ShieldAlert, LogOut, Eye, EyeOff } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, navigate, customerUser, customerLogout } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const res = adminLogin(email, password);
      setLoading(false);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message);
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 text-zinc-100">
      
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl space-y-7 backdrop-blur-2xl">
        
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl border border-amber-400/40 bg-zinc-900 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider mb-2 font-bold">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>Admin Personnel Only</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light tracking-wide text-white uppercase font-sans">
              LUNOVA <span className="font-semibold text-amber-300">Management</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Secured Store Administration & Ledger Console
            </p>
          </div>
        </div>

        {/* CUSTOMER ACCOUNT RESTRICTION NOTICE (If a customer is currently logged in) */}
        {customerUser && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 space-y-2.5 text-xs">
            <div className="flex items-center space-x-2 text-rose-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Customer Account Detected</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              You are currently signed in as customer <strong className="text-white">{customerUser.name}</strong> ({customerUser.email}). Customer accounts are strictly prohibited from accessing administrative controls.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-medium text-[11px] transition-colors flex items-center justify-center space-x-1"
              >
                <span>Return to Storefront</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  customerLogout();
                }}
                className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium text-[11px] border border-rose-500/30 transition-colors flex items-center space-x-1"
                title="Sign out of customer account to log in with admin passkey"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out Client</span>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
              Authorized Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@lunova.luxury"
                className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
              Master Passkey
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-zinc-950 text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 shadow-xl shadow-amber-400/20 hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying Clearance...</span>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-1">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wider font-mono"
          >
            ← Return to Public Gallery
          </button>
        </div>

      </div>
    </div>
  );
};
