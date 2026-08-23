import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { User, Check, X, Shield, Mail, Crown, Sparkles, Instagram, ArrowRight, Key, Eye, EyeOff, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({ isOpen, onClose }) => {
  const { adminUser, changeAdminCredentials, changeAdminPassword, updateAdminProfile, addToast } = useStore();

  const [name, setName] = useState(adminUser?.name || 'Julian Thorne');
  const [email, setEmail] = useState(adminUser?.email || 'admin@lunova.luxury');
  const [role, setRole] = useState<AdminUser['role']>(adminUser?.role || 'Super Admin');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminUser) {
      setName(adminUser.name);
      setEmail(adminUser.email);
      setRole(adminUser.role);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      setErrorMsg('');
    }
  }, [adminUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!name.trim()) {
      setErrorMsg('Please provide a valid admin display name.');
      addToast('Please provide a valid admin display name.', 'error');
      setLoading(false);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email format (e.g. admin@lunova.luxury).');
      addToast('Please provide a valid admin login email.', 'error');
      setLoading(false);
      return;
    }

    if (isChangingPassword) {
      if (!currentPassword) {
        setErrorMsg('Please enter your current administrator password.');
        setLoading(false);
        return;
      }
      if (!newPassword || newPassword.length < 4) {
        setErrorMsg('New password must be at least 4 characters long.');
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New password and confirmation do not match.');
        setLoading(false);
        return;
      }
    }

    // Process credentials update
    const result = changeAdminCredentials({
      adminName: name.trim(),
      newEmail: email.trim(),
      currentPassword: isChangingPassword && currentPassword ? currentPassword.trim() : undefined,
      newPassword: isChangingPassword && newPassword ? newPassword.trim() : undefined,
      role
    });

    setLoading(false);

    if (result.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      onClose();
    } else {
      setErrorMsg(result.message);
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-zinc-950 border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-amber-950/40 space-y-6 text-zinc-100 ring-1 ring-amber-400/20 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Admin Profile & Passkey</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Change your admin email and login password.
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

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

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
              <span className="text-[10px] text-amber-400 font-mono">Console Display</span>
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
            <label className="block font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>Admin Login Email *</span>
              <span className="text-[10px] text-zinc-400 font-mono">Sign-in ID</span>
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

          {/* PASSWORD CHANGE TOGGLE */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-zinc-200">Change Admin Password</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(!isChangingPassword);
                  setErrorMsg('');
                }}
                className={`text-[10px] px-2.5 py-1 rounded-lg font-mono transition-colors cursor-pointer ${
                  isChangingPassword 
                    ? 'bg-amber-400 text-zinc-950 font-bold' 
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                {isChangingPassword ? 'Cancel Password Change' : 'Set New Password'}
              </button>
            </div>

            {isChangingPassword && (
              <div className="space-y-3 pt-2 border-t border-zinc-800/80 animate-in fade-in">
                {/* Current Password */}
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1 flex items-center justify-between">
                    <span>Current Password *</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Default: lunova2026</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required={isChangingPassword}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current master password"
                      className="w-full pl-3 pr-9 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    >
                      {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">
                    New Master Password (Min 4 chars) *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required={isChangingPassword}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-3 pr-9 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-zinc-400 mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required={isChangingPassword}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full pl-3 pr-9 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white uppercase font-semibold text-xs tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Updating...' : 'Save Admin Credentials'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
