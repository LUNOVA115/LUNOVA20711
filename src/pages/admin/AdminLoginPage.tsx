import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  AlertTriangle, 
  ShieldAlert, 
  LogOut, 
  Eye, 
  EyeOff,
  KeyRound
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminUser, adminLogin, navigate, customerUser, customerLogout } = useStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated as admin, automatically redirect to admin dashboard
  useEffect(() => {
    if (adminUser) {
      navigate('/admin/dashboard');
    }
  }, [adminUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // If customer was logged in, log them out cleanly
    if (customerUser) {
      customerLogout();
    }

    try {
      // Authenticate directly with website master password
      const res = await adminLogin(password);
      setLoading(false);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred during administrative verification. Please try again.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 text-zinc-100 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="relative bg-[#0b0c10]/95 border border-zinc-800/90 rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6 backdrop-blur-2xl">
        
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl border border-amber-400/40 bg-zinc-900 mx-auto flex items-center justify-center shadow-xl shadow-amber-500/10 group">
            <ShieldCheck className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono uppercase tracking-wider mb-2 font-bold shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Access Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wide text-white font-semibold">
              LUNOVA <span className="font-sans font-light text-amber-300">Management</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              Enter the master website password to access the administrative control panel.
            </p>
          </div>
        </div>

        {/* CUSTOMER ACCOUNT RESTRICTION NOTICE (If a customer is currently logged in on this device) */}
        {customerUser && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 space-y-2.5 text-xs">
            <div className="flex items-center space-x-2 text-rose-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Customer Session Active on Device</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Signed in as client <strong className="text-white">{customerUser.name}</strong>. Signing in with the administrator password will automatically activate the master management console.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => customerLogout()}
                className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium text-[11px] border border-rose-500/30 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch to Administrator</span>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
                Website Admin Password
              </label>
              <span className="text-[10px] text-amber-400/80 font-mono">Master Passkey</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-11 pr-12 py-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 font-mono tracking-wider transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1.5 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-zinc-950 text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 shadow-xl shadow-amber-400/20 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>Enter Admin Control Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice & Storefront Return */}
        <div className="pt-4 border-t border-zinc-800/80 text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-[11px] text-zinc-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Encrypted Authorization Portal</span>
          </div>

          <div>
            <button
              onClick={() => navigate('/')}
              className="text-xs text-zinc-400 hover:text-amber-300 transition-colors uppercase tracking-wider font-mono cursor-pointer"
            >
              ← Return to Public Gallery
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
