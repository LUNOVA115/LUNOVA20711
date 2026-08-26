import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  Home, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Sparkles, 
  Eye, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  Sliders, 
  Link as LinkIcon,
  Crown,
  Trash2
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

const PRESET_HERO_ASSETS = [
  { id: 'img-3', title: '3D Moon Lamp (Warm Amber)', url: IMAGE_3_WARM_MOON },
  { id: 'img-1', title: 'Golden Infinity Table (Flagship)', url: IMAGE_1_GOLD_TABLE },
  { id: 'img-8', title: 'Architectural Living Edition', url: IMAGE_8_LIFESTYLE_TABLE },
  { id: 'img-2', title: 'Oceanic Blue Infinity Table', url: IMAGE_2_BLUE_TABLE },
  { id: 'img-7', title: 'Lunar White Minimalist', url: IMAGE_7_COOL_WHITE_MOON },
  { id: 'img-4', title: 'Crater Moon Sculpture', url: IMAGE_4_CRATER_MOON }
];

export const AdminHomepagePage: React.FC = () => {
  const { homeSettings, updateHomeSettings, products, addToast, navigate } = useStore();

  const [heroCustomImage, setHeroCustomImage] = useState<string>(homeSettings.heroCustomImage || IMAGE_3_WARM_MOON);
  const [heroTitle, setHeroTitle] = useState(homeSettings.heroTitle || 'Illuminate Your Imagination.');
  const [heroSubtitle, setHeroSubtitle] = useState(homeSettings.heroSubtitle || 'Where refined design meets modern luxury, LUNOVA brings timeless pieces crafted to transform ordinary spaces into something truly exceptional.');
  const [heroBadge, setHeroBadge] = useState(homeSettings.heroBadge || '✦ 2026 ARCHITECTURAL ARCHIVE');
  const [featuredProductId, setFeaturedProductId] = useState(homeSettings.featuredProductId || products[0]?.id || 'prod-001');
  const [ctaText, setCtaText] = useState('Explore Collection');
  const [ctaLink, setCtaLink] = useState('/shop');
  const [customUrlInput, setCustomUrlInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler (Converts file to base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please upload a valid image file (JPG, PNG, WEBP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const result = event.target.result as string;
        setHeroCustomImage(result);
        addToast('Hero image uploaded successfully from your device.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setHeroCustomImage(customUrlInput.trim());
    setCustomUrlInput('');
    addToast('Hero image URL applied.', 'success');
  };

  const handleSaveHomepage = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomeSettings({
      heroCustomImage,
      heroTitle,
      heroSubtitle,
      heroBadge,
      featuredProductId
    });
    addToast('Homepage front image and hero content saved to live storefront.', 'success');
  };

  const handleResetDefaults = () => {
    setHeroCustomImage(IMAGE_3_WARM_MOON);
    setHeroTitle('Illuminate Your Imagination.');
    setHeroSubtitle('Where refined design meets modern luxury, LUNOVA brings timeless pieces crafted to transform ordinary spaces into something truly exceptional.');
    setHeroBadge('✦ 2026 ARCHITECTURAL ARCHIVE');
    setFeaturedProductId('prod-001');
    updateHomeSettings({
      heroCustomImage: IMAGE_3_WARM_MOON,
      heroTitle: 'Illuminate Your Imagination.',
      heroSubtitle: 'Where refined design meets modern luxury, LUNOVA brings timeless pieces crafted to transform ordinary spaces into something truly exceptional.',
      heroBadge: '✦ 2026 ARCHITECTURAL ARCHIVE',
      featuredProductId: 'prod-001'
    });
    addToast('Homepage reset to default flagship theme.', 'info');
  };

  return (
    <AdminLayout
      activeSection="homepage"
      title="Homepage & Front Image Management"
      subtitle="Customize the hero front-page visual image, headlines, featured showcase piece, and live storefront typography."
      actionButton={
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Public Store</span>
          </button>
          <button
            type="button"
            onClick={handleSaveHomepage}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-1.5 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Publish Changes</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSaveHomepage} className="space-y-8 text-xs max-w-5xl">
        
        {/* =========================================================================
            SECTION 1: HERO VISUAL IMAGE SHOWCASE & UPLOADER
        ========================================================================= */}
        <div className="bg-[#121318] border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <span>Primary Front-Page Hero Image</span>
              </h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                The high-resolution centerpiece visual displayed at the very top of the public website.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 font-mono text-xs font-semibold flex items-center space-x-2 transition-colors self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Upload From Computer</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Large Live Interactive Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[16/8] sm:aspect-[21/9] flex items-center justify-center group">
            <img
              src={heroCustomImage}
              alt="Homepage Hero Preview"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Dark Gradient Overlay for Realistic Frontend Feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />

            {/* Overlay Simulated Headline Content */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 text-white space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                {heroBadge}
              </span>
              <h4 className="text-base sm:text-xl font-bold tracking-tight text-white line-clamp-1">
                {heroTitle}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-1">
                {heroSubtitle}
              </p>
            </div>

            {/* Change Image Floating Button */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-zinc-700 hover:border-amber-400 text-white font-mono text-xs flex items-center space-x-1.5 transition-all shadow-lg"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Replace Image</span>
              </button>
            </div>
          </div>

          {/* Custom URL Input */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="Or paste external image URL (e.g. https://images.unsplash.com/...)"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyCustomUrl}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono font-medium"
            >
              Apply URL
            </button>
          </div>

          {/* Preset Luxury Asset Library */}
          <div className="space-y-3 pt-2">
            <div className="text-[11px] font-mono uppercase text-zinc-400 font-semibold flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Or Select From Curated Luxury Studio Assets</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {PRESET_HERO_ASSETS.map((asset) => {
                const isSelected = heroCustomImage === asset.url;
                return (
                  <div
                    key={asset.id}
                    onClick={() => {
                      setHeroCustomImage(asset.url);
                      addToast(`Selected: ${asset.title}`, 'info');
                    }}
                    className={`relative rounded-xl overflow-hidden border cursor-pointer group aspect-square transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-400/20'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center font-bold">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 p-1.5 text-[9px] text-zinc-300 truncate font-mono">
                      {asset.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: EDITABLE HOMEPAGE COPY & HEADLINES
        ========================================================================= */}
        <div className="bg-[#121318] border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>Hero Copy, Typography & Call-To-Action</span>
            </h3>
            <p className="text-zinc-400 text-xs mt-0.5">
              Live text elements rendered across the primary homepage greeting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Hero Badge */}
            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Hero Pill Badge
              </label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                placeholder="e.g. ✦ 2026 ARCHITECTURAL ARCHIVE"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Featured Product Centerpiece */}
            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Featured Centerpiece Piece</span>
                <span className="text-[10px] text-amber-400 font-mono">Flagship Showcase</span>
              </label>
              <select
                value={featuredProductId}
                onChange={(e) => setFeaturedProductId(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Rs. {p.price.toLocaleString()} • {p.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Hero Main Headline */}
            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Hero Main Headline (H1) *
              </label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="e.g. Elevate Your Space with Atmospheric Light"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Hero Subtitle Description */}
            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Hero Subtitle & Atmosphere Description *
              </label>
              <textarea
                rows={3}
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Curated pieces designed for modern living..."
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* CTA Button Text */}
            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Explore Collection"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* CTA Button Link */}
            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                CTA Target Route
              </label>
              <select
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
              >
                <option value="/shop">All Products (/shop)</option>
                <option value="/collections">Collections Gallery (/collections)</option>
                <option value="/collections/moon">Moon Collection (/collections/moon)</option>
                <option value="/collections/infinity">Infinity Mirror Collection (/collections/infinity)</option>
              </select>
            </div>

          </div>
        </div>

        {/* =========================================================================
            BOTTOM ACTIONS
        ========================================================================= */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white uppercase font-semibold text-xs tracking-wider flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset To Default Theme</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-xl shadow-amber-400/20 flex items-center space-x-2 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Save & Publish to Live Website</span>
          </button>
        </div>

      </form>
    </AdminLayout>
  );
};
