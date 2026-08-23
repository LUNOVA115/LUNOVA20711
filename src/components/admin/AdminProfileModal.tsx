import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { User, Check, X, Shield, Mail, Crown, Sparkles, Instagram, ArrowRight } from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({ isOpen, onClose }) => {
  const { adminUser, updateAdminProfile, instagramSettings, navigate, addToast } = useStore();

  const [name, setName] = useState(adminUser?.name || 'Julian Thorne');
  const [email, setEmail] = useState(adminUser?.email || 'admin@lunova.luxury');
  const [role, setRole] = useState<AdminUser['role']>(adminUser?.role || 'Super Admin');

  useEffect(() => {
    if (adminUser) {
      setName(adminUser.name);
      setEmail(adminUser.email);
      setRole(adminUser.role);
    }
  }, [adminUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please provide a valid admin display name.', 'error');
      return;
    }
    updateAdminProfile({
      name: name.trim(),
      email: email.trim(),
      role
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-zinc-950 border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-amber-950/40 space-y-6 text-zinc-100 ring-1 ring-amber-400/20">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Edit Admin Profile</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Update your administrative display name and credentials.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Avatar Preview */}
          <div className="flex items-center space-x-4 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold font-mono text-lg shadow-inner">
              {name ? name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{name || 'Admin Name'}</div>
              <div className="text-[11px] text-amber-400/90 font-mono">{role} • {email || 'admin@lunova.luxury'}</div>
            </div>
          </div>

          {/* Admin Name */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>Admin Profile Name *</span>
              <span className="text-[10px] text-amber-400 font-mono">Displayed in Console</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julian Thorne"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Admin Email */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Admin Contact Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lunova.luxury"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Administrative Authority Role
            </label>
            <div className="relative">
              <Crown className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminUser['role'])}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
              >
                <option value="Super Admin">Super Admin (Full Root Clearance)</option>
                <option value="Store Manager">Store Manager (Catalog & Fulfillment)</option>
                <option value="Editor">Editor (Catalog & Media)</option>
              </select>
            </div>
          </div>

          {/* Quick presets for name */}
          <div className="pt-1">
            <div className="text-[10px] uppercase font-mono text-zinc-500 mb-1.5">Quick Name Suggestions:</div>
            <div className="flex flex-wrap gap-1.5">
              {['Julian Thorne', 'Alexander Vance', 'Elena Rostova', 'Chief Executive', 'Store Principal'].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setName(n)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 font-mono transition-colors"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Instagram Account Connection Quick Link */}
          <div className="p-3 rounded-2xl bg-zinc-900 border border-pink-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Instagram className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white text-xs">Official Instagram Page</div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  {instagramSettings.isConnected ? `@${instagramSettings.handle} (Connected)` : 'Not Connected'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/admin/instagram');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-[11px] font-mono font-semibold flex items-center space-x-1 transition-colors"
            >
              <span>{instagramSettings.isConnected ? 'Manage' : 'Connect'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white uppercase font-semibold text-xs tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
