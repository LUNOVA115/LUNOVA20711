import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminInstagramConnectCard } from '../../components/admin/AdminInstagramConnectCard';
import { CurrencyCode, SUPPORTED_CURRENCIES } from '../../types';
import { 
  Settings, 
  RotateCcw, 
  Check, 
  DollarSign, 
  Mail, 
  Phone, 
  Clock, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  Home, 
  Image as ImageIcon, 
  Upload, 
  Crown, 
  Eye, 
  EyeOff,
  Trash2,
  Wallet,
  Smartphone,
  Banknote,
  FileCheck,
  CreditCard,
  User,
  Shield,
  Lock,
  Key,
  ShieldCheck,
  Instagram,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { 
  IMAGE_1_GOLD_TABLE, 
  IMAGE_2_BLUE_TABLE, 
  IMAGE_3_WARM_MOON, 
  IMAGE_4_CRATER_MOON, 
  IMAGE_5_LUNAR_SURFACE, 
  IMAGE_6_DETAILED_LUNAR, 
  IMAGE_7_COOL_WHITE_MOON, 
  IMAGE_8_LIFESTYLE_TABLE 
} from '../../data/productImages';

const PRESET_ASSET_IMAGES = [
  { id: 'img-1', name: 'Golden Infinity Table', src: IMAGE_1_GOLD_TABLE },
  { id: 'img-2', name: 'Deep Blue Infinity Table', src: IMAGE_2_BLUE_TABLE },
  { id: 'img-3', name: '3D Moon Lamp Warm', src: IMAGE_3_WARM_MOON },
  { id: 'img-4', name: 'Crater Moon Lamp', src: IMAGE_4_CRATER_MOON },
  { id: 'img-5', name: 'Lunar Surface Topography', src: IMAGE_5_LUNAR_SURFACE },
  { id: 'img-6', name: 'Detailed High-Res Lunar', src: IMAGE_6_DETAILED_LUNAR },
  { id: 'img-7', name: 'Cool White Moon Lamp', src: IMAGE_7_COOL_WHITE_MOON },
  { id: 'img-8', name: 'Lifestyle Living Edition', src: IMAGE_8_LIFESTYLE_TABLE },
];

export const AdminSettingsPage: React.FC = () => {
  const { 
    products, 
    homeSettings, 
    updateHomeSettings, 
    contactInfo, 
    updateContactInfo, 
    updateWhatsAppNumber,
    instagramSettings,
    updateInstagramPage,
    paymentSettings,
    updatePaymentSettings,
    adminUser,
    updateAdminProfile,
    changeAdminCredentials,
    changeAdminPassword,
    currency: activeStoreCurrency,
    setCurrency: setStoreCurrency,
    formatPrice,
    resetToDefaults, 
    addToast, 
    navigate 
  } = useStore();

  // Admin Profile Local State
  const [adminName, setAdminName] = useState(adminUser?.name || 'Julian Thorne');
  const [adminEmail, setAdminEmail] = useState(adminUser?.email || 'admin@lunova.luxury');
  const [adminRole, setAdminRole] = useState<'Super Admin' | 'Store Manager' | 'Editor'>(adminUser?.role || 'Super Admin');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Security Credentials & Password Change Local State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [storeName, setStoreName] = useState('LUNOVA');
  const [tagline, setTagline] = useState('Futuristic Premium Home Decor & Atmospheric Architecture');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(activeStoreCurrency || 'USD');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(500);
  const [taxRate, setTaxRate] = useState(8.25);
  const [whiteGloveEnabled, setWhiteGloveEnabled] = useState(true);

  // Store Contact & Social Channels Details
  const [contactEmail, setContactEmail] = useState(contactInfo?.email || 'support@lunova.luxury');
  const [contactPhone, setContactPhone] = useState(contactInfo?.phone || '+92 315 0360126');
  const [contactWhatsapp, setContactWhatsapp] = useState(contactInfo?.whatsappNumber || '+92 315 0360126');
  const [instagramHandle, setInstagramHandle] = useState(instagramSettings?.handle || 'lunova.home_decors');
  const [instagramAccountTitle, setInstagramAccountTitle] = useState(instagramSettings?.accountName || 'LUNOVA Home Decors');
  const [contactHours, setContactHours] = useState(contactInfo?.hours || 'Mon – Sat, 9:00 AM – 6:00 PM PKT / EST');
  const [contactAddress, setContactAddress] = useState(contactInfo?.address || '750 Madison Avenue, New York, NY / Lahore Atelier');

  // Payment Gateways Settings Local State
  const [easypaisaEnabled, setEasypaisaEnabled] = useState(paymentSettings?.easypaisaEnabled ?? true);
  const [easypaisaNumber, setEasypaisaNumber] = useState(paymentSettings?.easypaisaNumber || '0345-8899123');
  const [easypaisaAccountTitle, setEasypaisaAccountTitle] = useState(paymentSettings?.easypaisaAccountTitle || 'LUNOVA Luxury Lighting Ltd');
  const [easypaisaInstructions, setEasypaisaInstructions] = useState(
    paymentSettings?.easypaisaInstructions || 
    'Please transfer the exact invoice total to our verified Easypaisa account. After transfer, upload your payment screenshot receipt and enter your Transaction (TRX) ID below for priority verification and white-glove dispatch.'
  );

  const [codEnabled, setCodEnabled] = useState(paymentSettings?.codEnabled ?? true);
  const [codInstructions, setCodInstructions] = useState(
    paymentSettings?.codInstructions || 
    'Pay cash in full to the white-glove courier agent upon delivery arrival and initial inspection. Please keep exact change ready. A confirmation call will precede dispatch.'
  );
  const [creditCardEnabled, setCreditCardEnabled] = useState(paymentSettings?.creditCardEnabled ?? true);
  const [applePayEnabled, setApplePayEnabled] = useState(paymentSettings?.applePayEnabled ?? true);

  // Home Page Customizer Local State
  const [selectedFeaturedProduct, setSelectedFeaturedProduct] = useState(homeSettings.featuredProductId || 'prod-003');
  const [heroCustomImage, setHeroCustomImage] = useState(homeSettings.heroCustomImage || '');
  const [lifestyleImage, setLifestyleImage] = useState(homeSettings.lifestyleImage || '');
  const [heroUrlInput, setHeroUrlInput] = useState('');
  const [lifestyleUrlInput, setLifestyleUrlInput] = useState('');

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const lifestyleFileInputRef = useRef<HTMLInputElement>(null);

  const currentFeaturedProductObj = products.find((p) => p.id === selectedFeaturedProduct) || products[0];

  const handleSaveAdminProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setProfileStatus(null);
    setProfileLoading(true);

    if (!adminName.trim()) {
      setProfileStatus({ type: 'error', message: 'Please enter a valid administrator profile name.' });
      addToast('Please enter a valid administrator profile name.', 'error');
      setProfileLoading(false);
      return;
    }
    if (!adminEmail.trim() || !adminEmail.includes('@')) {
      setProfileStatus({ type: 'error', message: 'Please enter a valid administrator email address (e.g. admin@lunova.luxury).' });
      addToast('Please enter a valid administrator email address.', 'error');
      setProfileLoading(false);
      return;
    }

    const res = changeAdminCredentials({
      adminName: adminName.trim(),
      newEmail: adminEmail.trim(),
      role: adminRole
    });

    setProfileLoading(false);
    if (res.success) {
      setProfileStatus({ type: 'success', message: '✓ Administrator profile name and login email updated successfully.' });
    } else {
      setProfileStatus({ type: 'error', message: res.message });
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);
    setPasswordLoading(true);

    if (!currentPassword || !currentPassword.trim()) {
      setPasswordStatus({ type: 'error', message: 'Please enter your current administrator password.' });
      setPasswordLoading(false);
      return;
    }

    if (!newPassword || newPassword.trim().length < 4) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 4 characters long.' });
      setPasswordLoading(false);
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setPasswordStatus({ type: 'error', message: 'New password and confirmation password do not match.' });
      setPasswordLoading(false);
      return;
    }

    const res = changeAdminPassword(currentPassword.trim(), newPassword.trim(), confirmPassword.trim());
    setPasswordLoading(false);

    if (res.success) {
      setPasswordStatus({ 
        type: 'success', 
        message: '✓ Password changed successfully! You can now use your new password on the Admin Login portal.' 
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordStatus({ type: 'error', message: res.message });
    }
  };

  const handleSaveWhatsAppQuick = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!contactWhatsapp.trim()) {
      addToast('Please enter a valid WhatsApp contact number.', 'error');
      return;
    }
    updateWhatsAppNumber(contactWhatsapp.trim());
  };

  const handleSaveInstagramQuick = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!instagramHandle.trim()) {
      addToast('Please enter your Instagram handle or URL.', 'error');
      return;
    }
    updateInstagramPage(instagramHandle.trim(), instagramAccountTitle.trim());
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setStoreCurrency(selectedCurrency);
    updateAdminProfile({
      name: adminName.trim(),
      email: adminEmail.trim(),
      role: adminRole
    });
    updateHomeSettings({
      featuredProductId: selectedFeaturedProduct,
      heroCustomImage: heroCustomImage,
      lifestyleImage: lifestyleImage
    });
    updateContactInfo({
      email: contactEmail.trim(),
      phone: contactPhone.trim(),
      whatsappNumber: contactWhatsapp.trim(),
      hours: contactHours.trim(),
      address: contactAddress.trim(),
      instagramHandle: `@${instagramHandle.replace(/^@+/, '').trim()}`,
      instagramUrl: `https://instagram.com/${instagramHandle.replace(/^@+/, '').trim()}`
    });
    if (instagramHandle.trim()) {
      updateInstagramPage(instagramHandle.trim(), instagramAccountTitle.trim());
    }
    if (contactWhatsapp.trim()) {
      updateWhatsAppNumber(contactWhatsapp.trim());
    }
    updatePaymentSettings({
      easypaisaEnabled,
      easypaisaNumber: easypaisaNumber.trim(),
      easypaisaAccountTitle: easypaisaAccountTitle.trim(),
      easypaisaInstructions: easypaisaInstructions.trim(),
      codEnabled,
      codInstructions: codInstructions.trim(),
      creditCardEnabled,
      applePayEnabled
    });
    addToast('Global Store Configurations, Currency & Payment Gateways saved successfully', 'success');
  };

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setHeroCustomImage(dataUrl);
        addToast(`Uploaded custom Home Hero photo "${file.name}"`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLifestyleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setLifestyleImage(dataUrl);
        addToast(`Uploaded custom Lifestyle Section photo "${file.name}"`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all store catalog, orders, and customer data to default initial seeds?')) {
      resetToDefaults();
    }
  };

  return (
    <AdminLayout
      activeSection="settings"
      title="Store Settings & Payment Gateways"
      subtitle="Configure Easypaisa receiving number, Cash on Delivery options, customer checkout receipt workflow, and flagship showcase visual."
    >
      <div className="max-w-4xl space-y-8 text-xs">
        
        {/* =========================================================================
            SECTION: ADMINISTRATOR PROFILE & CREDENTIALS (EMAIL & PASSWORD CHANGE)
        ========================================================================= */}
        <div className="space-y-6">
          {/* Card 1: Admin Profile & Sign-In Email */}
          <div className="bg-zinc-950 border border-amber-400/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden ring-1 ring-amber-400/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-amber-400/15 text-amber-400 border border-amber-400/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
                    <span>Admin Profile & Login Email</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-mono font-bold">
                      Master Clearance
                    </span>
                  </h3>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Configure your administrative identity, clearance authority, and sign-in email.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-zinc-400 font-mono">
                  Active Admin: <span className="text-amber-300 font-semibold">{adminUser?.email || 'admin@lunova.luxury'}</span>
                </span>
              </div>
            </div>

            {profileStatus && (
              <div className={`p-4 rounded-2xl text-xs flex items-center space-x-3 ${
                profileStatus.type === 'success' 
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
              }`}>
                {profileStatus.type === 'success' ? <Check className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                <span className="font-medium">{profileStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveAdminProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                
                {/* Live Profile Monogram & Clearance Preview */}
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-mono text-2xl font-bold shadow-lg shadow-amber-400/20">
                      {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center">
                      <Check className="w-3 h-3 text-zinc-950" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white tracking-wide">{adminName || 'Admin Name'}</div>
                    <div className="text-[10px] text-amber-400 font-mono mt-0.5 uppercase tracking-wider font-semibold">
                      {adminRole}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate max-w-[180px]">
                      {adminEmail || 'admin@lunova.luxury'}
                    </div>
                  </div>

                  <div className="w-full pt-3 border-t border-zinc-800/80 text-[10px] text-zinc-400 text-left space-y-1">
                    <div className="flex justify-between">
                      <span>Role Clearance:</span>
                      <span className="text-amber-300 font-mono font-semibold">{adminRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Status:</span>
                      <span className="text-emerald-400 font-mono font-semibold">Protected</span>
                    </div>
                  </div>
                </div>

                {/* Profile & Email Input Controls */}
                <div className="sm:col-span-2 space-y-4">
                  <div>
                    <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>Administrator Profile Name *</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">Live Across Portal</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Julian Thorne, Alexander Vance, etc."
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                    
                    {/* Quick Name Presets */}
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-[10px] text-zinc-500 font-mono">Suggestions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Julian Thorne', 'Alexander Vance', 'Elena Rostova', 'Executive Director'].map((namePreset) => (
                          <button
                            key={namePreset}
                            type="button"
                            onClick={() => {
                              setAdminName(namePreset);
                              addToast(`Selected name: ${namePreset}`, 'info');
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-lg border font-mono transition-colors cursor-pointer ${
                              adminName === namePreset
                                ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                            }`}
                          >
                            {namePreset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span>Admin Sign-In Email *</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@lunova.luxury"
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">This email is used to log into the Admin Console.</p>
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>Clearance Authority Tier</span>
                      </label>
                      <select
                        value={adminRole}
                        onChange={(e) => setAdminRole(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                      >
                        <option value="Super Admin">Super Admin (Full Root Clearance)</option>
                        <option value="Store Manager">Store Manager (Catalog & Fulfillment)</option>
                        <option value="Editor">Editor (Catalog & Media)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Admin Profile Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                <p className="text-[11px] text-zinc-400">
                  Updates your display name and login email address immediately.
                </p>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-amber-400/50 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>{profileLoading ? 'Saving Profile...' : 'Save Profile & Email'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Dedicated Administrator Password Change */}
          <div className="bg-zinc-950 border border-amber-400/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden ring-1 ring-amber-400/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-amber-400/15 text-amber-400 border border-amber-400/30">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
                    <span>Change Admin Login Password</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                      Passkey Security
                    </span>
                  </h3>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Update your master administrative passkey password. Requires entering your current password for security verification.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                  Initial Default Passkey: <strong className="text-amber-300">lunova2026</strong>
                </span>
              </div>
            </div>

            {/* Password Feedback Alert Banner */}
            {passwordStatus && (
              <div className={`p-4 rounded-2xl text-xs flex items-center space-x-3 animate-in fade-in ${
                passwordStatus.type === 'success' 
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
              }`}>
                {passwordStatus.type === 'success' ? (
                  <Check className="w-5 h-5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                )}
                <div>
                  <div className="font-bold">{passwordStatus.type === 'success' ? 'Password Changed Successfully' : 'Password Update Error'}</div>
                  <div className="mt-0.5">{passwordStatus.message}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Current Password */}
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px] flex items-center justify-between">
                    <span>1. Current Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full pl-3 pr-10 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                      title={showCurrentPassword ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono">Default setup is <span className="text-amber-400">lunova2026</span></p>
                </div>

                {/* 2. New Password */}
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
                    2. New Password (Min 4 chars) *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new passkey"
                      className="w-full pl-3 pr-10 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                      title={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">Must be at least 4 characters</p>
                </div>

                {/* 3. Confirm New Password */}
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 text-[11px]">
                    3. Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new passkey"
                      className="w-full pl-3 pr-10 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <p className={`text-[10px] mt-1 font-mono ${newPassword === confirmPassword ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                <p className="text-[11px] text-zinc-400">
                  After updating, your new password will be immediately active for future logins on the Admin Login portal.
                </p>
                <button
                  type="submit"
                  disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-amber-400/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  <span>{passwordLoading ? 'Updating Password...' : 'Update Admin Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* =========================================================================
            SECTION: INSTAGRAM PAGE CONNECTION & LIVE FEED INTEGRATION
        ========================================================================= */}
        <AdminInstagramConnectCard />

        {/* =========================================================================
            SECTION: PAYMENT METHODS CONFIGURATION (EASYPAISA & CASH ON DELIVERY)
        ========================================================================= */}
        <div className="bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden ring-1 ring-amber-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
                  <span>Payment Methods & Settlement Gateways</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-normal">
                    Customer Checkout
                  </span>
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Configure your official Easypaisa receiving number, Cash on Delivery terms, and receipt verification settings.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => navigate('/admin/orders')}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors font-mono"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Client Receipts</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* --- Easypaisa Gateway Card --- */}
            <div className={`p-6 rounded-2xl border transition-all ${
              easypaisaEnabled 
                ? 'bg-emerald-950/15 border-emerald-500/30 ring-1 ring-emerald-500/20' 
                : 'bg-zinc-900/40 border-zinc-800 opacity-75'
            }`}>
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                      <span>Easypaisa Mobile Payment Gateway</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-normal">Direct Digital Transfer</span>
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Customers will see your account number and upload their payment screenshot receipt at checkout.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={easypaisaEnabled}
                    onChange={(e) => setEasypaisaEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {easypaisaEnabled && (
                <div className="space-y-5">
                  {/* Presets & Quick Fill */}
                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold">
                        Quick Preset Fill / Test Numbers:
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">Click to autofill</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: '0345-8899123', title: 'LUNOVA Luxury Lighting Ltd' },
                        { label: '0300-1234567', title: 'Julian Thorne Atelier' },
                        { label: '0312-9876543', title: 'LUNOVA Direct Vault' },
                        { label: '0333-5566778', title: 'LUNOVA Finance Dept' },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setEasypaisaNumber(item.label);
                            setEasypaisaAccountTitle(item.title);
                            addToast(`Populated: ${item.label}`, 'info');
                          }}
                          className={`p-2 rounded-lg border text-left font-mono transition-all ${
                            easypaisaNumber === item.label
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          <div className="font-bold text-[11px]">{item.label}</div>
                          <div className="text-[9px] truncate opacity-70">{item.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span className="flex items-center space-x-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Easypaisa Account / Mobile Number *</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">Live on Checkout</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 0345-8899123 or +92 345 8899123"
                        value={easypaisaNumber}
                        onChange={(e) => setEasypaisaNumber(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-emerald-300 font-mono font-bold text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">This number is shown to customers with a one-click copy button.</p>
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Easypaisa Account Title / Registered Name *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LUNOVA Luxury Lighting or Julian Thorne"
                        value={easypaisaAccountTitle}
                        onChange={(e) => setEasypaisaAccountTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-semibold text-sm focus:outline-none focus:border-emerald-400"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">Customer verifies this name before transferring money.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                      Customer Payment Instructions & Receipt Upload Guidelines
                    </label>
                    <textarea
                      rows={3}
                      value={easypaisaInstructions}
                      onChange={(e) => setEasypaisaInstructions(e.target.value)}
                      placeholder="Step-by-step instructions for the customer..."
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-200 text-xs focus:outline-none focus:border-emerald-400 resize-y"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Shown to the customer on checkout when they select Easypaisa.
                    </p>
                  </div>

                  {/* Direct Save Easypaisa button inside this block */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        updatePaymentSettings({
                          easypaisaEnabled: true,
                          easypaisaNumber: easypaisaNumber.trim(),
                          easypaisaAccountTitle: easypaisaAccountTitle.trim(),
                          easypaisaInstructions: easypaisaInstructions.trim()
                        });
                        addToast(`Easypaisa settings saved! Active number: ${easypaisaNumber.trim()}`, 'success');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Easypaisa Gateway Details</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* --- Cash on Delivery (COD) Card --- */}
            <div className={`p-6 rounded-2xl border transition-all ${
              codEnabled 
                ? 'bg-amber-950/15 border-amber-500/30 ring-1 ring-amber-500/20' 
                : 'bg-zinc-900/40 border-zinc-800 opacity-75'
            }`}>
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                      <span>Cash on Delivery (COD)</span>
                      <span className="text-[10px] font-mono text-amber-400 font-normal">Physical Settlement</span>
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Allows customers to pay in cash to the white-glove courier upon physical package delivery.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={codEnabled}
                    onChange={(e) => setCodEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {codEnabled && (
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Cash on Delivery Policy & Terms for Customers
                  </label>
                  <textarea
                    rows={2}
                    value={codInstructions}
                    onChange={(e) => setCodInstructions(e.target.value)}
                    placeholder="Instructions for Cash on Delivery..."
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-200 text-xs focus:outline-none focus:border-amber-400 resize-y"
                  />
                </div>
              )}
            </div>

            {/* Other Payment Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <label className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700">
                <div className="flex items-center space-x-2.5">
                  <DollarSign className="w-4 h-4 text-sky-400" />
                  <div>
                    <div className="font-semibold text-white">Credit / Debit Card Vault</div>
                    <div className="text-[10px] text-zinc-500">Accept Visa, MasterCard, Amex</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={creditCardEnabled}
                  onChange={(e) => setCreditCardEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-400"
                />
              </label>

              <label className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700">
                <div className="flex items-center space-x-2.5">
                  <span className="font-bold text-white text-sm"></span>
                  <div>
                    <div className="font-semibold text-white">Apple Pay & Digital Wallets</div>
                    <div className="text-[10px] text-zinc-500">1-Touch biometric mobile checkout</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={applePayEnabled}
                  onChange={(e) => setApplePayEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-400"
                />
              </label>
            </div>

          </div>
        </div>

        {/* =========================================================================
            SECTION: HOME PAGE PRODUCT IMAGE & HERO SHOWCASE CUSTOMIZER
        ========================================================================= */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold uppercase tracking-wider text-white">
                  Home Page Showcase & Hero Imagery
                </h3>
                <p className="text-zinc-400 text-xs">
                  Configure which product and visuals command the flagship home page hero and lifestyle section.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Preview Live Home</span>
            </button>
          </div>

          <div className="space-y-6">
            
            {/* 1. Select Featured Product */}
            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-2">
                1. Select Flagship Product Featured on Home Page
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setSelectedFeaturedProduct(prod.id);
                      setHeroCustomImage(prod.images[0]);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                      selectedFeaturedProduct === prod.id
                        ? 'bg-zinc-900 border-amber-400 ring-2 ring-amber-400/20'
                        : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 p-1 shrink-0 overflow-hidden">
                      <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">{prod.name}</div>
                      <div className="text-[11px] text-zinc-400 flex items-center space-x-2">
                        <span className="font-mono text-amber-300 font-bold">${prod.price}</span>
                        <span>•</span>
                        <span>{prod.category}</span>
                      </div>
                    </div>
                    {selectedFeaturedProduct === prod.id && (
                      <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Hero Visual Customizer */}
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Hero Product Artwork Image</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Active on Home Page hero banner with the interactive lighting halo.
                  </p>
                </div>

                {heroCustomImage && (
                  <button
                    type="button"
                    onClick={() => setHeroCustomImage('')}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center space-x-1 font-mono"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Reset to Product Default</span>
                  </button>
                )}
              </div>

              {/* Current Hero Image Live Preview */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-36 h-36 rounded-2xl bg-zinc-950 border border-amber-400/40 p-2 shrink-0 flex items-center justify-center relative group overflow-hidden">
                  <img
                    src={heroCustomImage || (currentFeaturedProductObj && currentFeaturedProductObj.images[0]) || IMAGE_3_WARM_MOON}
                    alt="Hero Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-zinc-900/90 text-[9px] font-mono text-amber-300 border border-zinc-800">
                    HERO ACTIVE
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <span className="text-[11px] font-semibold text-zinc-300 block">
                    Choose from LUNOVA Master Gallery Presets:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESET_ASSET_IMAGES.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => setHeroCustomImage(preset.src)}
                        className={`p-1 rounded-xl bg-zinc-950 border cursor-pointer hover:border-amber-400 transition-all flex flex-col items-center group ${
                          heroCustomImage === preset.src ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-zinc-800'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.src} alt={preset.name} className="w-10 h-10 object-contain" />
                      </div>
                    ))}
                  </div>

                  {/* Upload or URL */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <div className="flex-1 flex gap-2">
                      <input
                        type="url"
                        placeholder="Or paste custom image URL..."
                        value={heroUrlInput}
                        onChange={(e) => setHeroUrlInput(e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (heroUrlInput.trim()) {
                            setHeroCustomImage(heroUrlInput.trim());
                            setHeroUrlInput('');
                            addToast('Applied custom image URL to Home Hero', 'success');
                          }
                        }}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs uppercase font-semibold"
                      >
                        Apply
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
                    >
                      <Upload className="w-3 h-3 text-sky-400" />
                      <span>Upload Photo</span>
                    </button>

                    <input
                      ref={heroFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Lifestyle Room Image Customizer */}
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Home Page Lifestyle Room Showcase Image</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Background architectural shot in the &quot;Designed for Spaces That Command Wonder&quot; section.
                  </p>
                </div>

                {lifestyleImage && (
                  <button
                    type="button"
                    onClick={() => setLifestyleImage('')}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center space-x-1 font-mono"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-44 h-24 rounded-2xl bg-zinc-950 border border-zinc-800 p-1 shrink-0 overflow-hidden flex items-center justify-center relative">
                  <img
                    src={lifestyleImage || IMAGE_8_LIFESTYLE_TABLE}
                    alt="Lifestyle Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                    <span className="text-[9px] font-mono text-zinc-200 font-bold">LIFESTYLE BANNER</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <span className="text-[11px] font-semibold text-zinc-300 block">
                    Choose Lifestyle Background:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESET_ASSET_IMAGES.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => setLifestyleImage(preset.src)}
                        className={`p-1 rounded-xl bg-zinc-950 border cursor-pointer hover:border-amber-400 transition-all flex flex-col items-center ${
                          lifestyleImage === preset.src ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-zinc-800'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.src} alt={preset.name} className="w-10 h-10 object-contain" />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <div className="flex-1 flex gap-2">
                      <input
                        type="url"
                        placeholder="Paste custom lifestyle image URL..."
                        value={lifestyleUrlInput}
                        onChange={(e) => setLifestyleUrlInput(e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (lifestyleUrlInput.trim()) {
                            setLifestyleImage(lifestyleUrlInput.trim());
                            setLifestyleUrlInput('');
                            addToast('Applied custom lifestyle image URL', 'success');
                          }
                        }}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs uppercase font-semibold"
                      >
                        Apply
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => lifestyleFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
                    >
                      <Upload className="w-3 h-3 text-sky-400" />
                      <span>Upload Banner</span>
                    </button>

                    <input
                      ref={lifestyleFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLifestyleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Global Store Settings Form */}
        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* =========================================================================
              SECTION: OFFICIAL WHATSAPP SUPPORT LINE & INSTAGRAM SOCIAL PAGE
          ========================================================================= */}
          <div className="bg-zinc-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden ring-1 ring-emerald-500/20">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
                    <span>Official WhatsApp & Instagram Channels</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                      Live Storefront Sync
                    </span>
                  </h3>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Update your official WhatsApp receiving phone number and Instagram profile page at any time. Changes reflect immediately across the entire store.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => navigate('/admin/instagram')}
                  className="px-3.5 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 border border-pink-500/30 font-mono font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram Media Feed Hub</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* WhatsApp Configuration Block */}
              <div className="p-5 rounded-2xl bg-zinc-900/70 border border-emerald-500/30 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold">
                        <MessageCircle className="w-4 h-4 fill-zinc-950" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                          WhatsApp Contact Number
                        </h4>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Floating Concierge & Footer Direct Chat
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${contactWhatsapp.replace(/[^0-9]/g, '') || '923150360126'}?text=${encodeURIComponent('Hello LUNOVA Concierge, testing live WhatsApp integration.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-300 text-[10px] font-mono flex items-center space-x-1 transition-colors border border-zinc-700"
                      title="Test live WhatsApp chat in new window"
                    >
                      <span>Test Chat</span>
                      <Eye className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold uppercase tracking-wider text-[11px] mb-1">
                      Phone Number (with Country Code)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +92 315 0360126 or +1 (800) 840-5866"
                      value={contactWhatsapp}
                      onChange={(e) => setContactWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                      Accepts Pakistani (+92...) or international formats. Used for the 1-click floating WhatsApp customer widget, order inquiry routing, and customer care footer.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                  <span className="text-[10px] font-mono text-zinc-400">
                    Active: <strong className="text-emerald-400">{contactInfo?.whatsappNumber || contactWhatsapp}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSaveWhatsAppQuick()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Instagram Page Configuration Block */}
              <div className="p-5 rounded-2xl bg-zinc-900/70 border border-pink-500/30 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center font-bold">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                          Official Instagram Page
                        </h4>
                        <span className="text-[10px] text-pink-400 font-mono">
                          Gallery Sync, DM Link & Social Footer
                        </span>
                      </div>
                    </div>

                    <a
                      href={instagramSettings?.profileUrl || `https://www.instagram.com/${instagramHandle.replace(/^@+/, '').trim() || 'lunova.home_decors'}/?hl=en`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-pink-300 text-[10px] font-mono flex items-center space-x-1 transition-colors border border-zinc-700"
                      title="Open Instagram page in new window"
                    >
                      <span>Open Page</span>
                      <Eye className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-zinc-300 font-semibold uppercase tracking-wider text-[11px] mb-1">
                        Instagram Username / Profile URL
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs">@</span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. lunova.home_decors or instagram.com/lunova.home_decors"
                          value={instagramHandle}
                          onChange={(e) => setInstagramHandle(e.target.value)}
                          className="w-full pl-7 pr-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-pink-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-semibold uppercase tracking-wider text-[11px] mb-1">
                        Display Account Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. LUNOVA Lighting Atelier | Official"
                        value={instagramAccountTitle}
                        onChange={(e) => setInstagramAccountTitle(e.target.value)}
                        className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-pink-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                  <span className="text-[10px] font-mono text-zinc-400">
                    Live: <strong className="text-pink-400">@{instagramSettings?.handle || instagramHandle}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSaveInstagramQuick()}
                    className="px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-mono font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-pink-500/20 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Instagram</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Details Settings */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-base font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Store Contact Details (Phone & Email)</span>
              </h3>
              <span className="text-[11px] text-amber-300 font-mono">Synced to Live Site</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Official Support / Concierge Email</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. support@lunova.luxury"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
                <p className="text-[11px] text-zinc-500 mt-1">Displayed on Contact page, footer, and inquiry forms.</p>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Official Support Phone Number</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +92 315 0360126 or +1 (800) 840-5866"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                />
                <p className="text-[11px] text-zinc-500 mt-1">Used for customer care and direct line calls.</p>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Number (Synced)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +92 315 0360126"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400 font-mono"
                />
                <p className="text-[11px] text-zinc-500 mt-1">Directly syncs with the WhatsApp channel manager above.</p>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Business & Support Hours</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mon – Sat, 9:00 AM – 6:00 PM PKT / EST"
                  value={contactHours}
                  onChange={(e) => setContactHours(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Studio & Atelier Address</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 750 Madison Avenue, New York, NY / Lahore Atelier"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-base font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>General Storefront Properties</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                  Brand Identity Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider">
                    Operating Store Currency
                  </label>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Preview: {formatPrice(340, { convertedDirectly: false })}
                  </span>
                </div>
                <select
                  value={selectedCurrency}
                  onChange={(e) => {
                    const newCurr = e.target.value as CurrencyCode;
                    setSelectedCurrency(newCurr);
                    setStoreCurrency(newCurr);
                  }}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                >
                  {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) — {curr.name} [1 USD = {curr.rateAgainstUSD} {curr.code}]
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-400 mt-1.5 leading-normal">
                  All catalog pieces, checkout totals, inventory valuations, and orders will automatically reflect the selected currency ({SUPPORTED_CURRENCIES[selectedCurrency]?.name}).
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                  Maison Brand Mission Statement
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-base font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Commerce, Tax & Crate Logistics Thresholds</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                  Complimentary Shipping Minimum ($)
                </label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                  Estimated Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2.5 text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whiteGloveEnabled}
                  onChange={(e) => setWhiteGloveEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-400"
                />
                <span>Enable Automated White-Glove Crate Delivery Protocol</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-widest shadow-xl shadow-amber-400/20 transition-all hover:scale-105"
            >
              Save All Settings & Payment Gateways
            </button>
          </div>
        </form>

        {/* Danger Zone / Data Management */}
        <div className="bg-zinc-950 border border-rose-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-semibold uppercase tracking-wider text-white">
              Data Engine Ledger Reset
            </h3>
          </div>

          <p className="text-zinc-400 leading-relaxed">
            Re-populate initial sample database entries (products, orders with Easypaisa receipts, customers, categories).
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetData}
              className="px-6 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-mono font-semibold uppercase tracking-wider flex items-center space-x-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Store Data to Default Seeds</span>
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
