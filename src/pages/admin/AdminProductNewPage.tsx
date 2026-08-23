import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  PlusCircle, 
  ArrowLeft, 
  Sparkles, 
  Image as ImageIcon, 
  Layers, 
  CheckCircle2,
  Box,
  Sliders,
  Upload,
  Link,
  Trash2,
  Crown,
  RefreshCw
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
  { id: 'img-5', name: 'Lunar Surface Detail', src: IMAGE_5_LUNAR_SURFACE },
  { id: 'img-6', name: 'Detailed Lunar Topography', src: IMAGE_6_DETAILED_LUNAR },
  { id: 'img-7', name: 'Cool White Moon Lamp', src: IMAGE_7_COOL_WHITE_MOON },
  { id: 'img-8', name: 'Lifestyle Living Edition', src: IMAGE_8_LIFESTYLE_TABLE },
];

export const AdminProductNewPage: React.FC = () => {
  const { categories, addProduct, navigate, setProductAsHomeFeatured, addToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const [imagesList, setImagesList] = useState<string[]>([IMAGE_3_WARM_MOON, IMAGE_5_LUNAR_SURFACE]);
  const [replacingImageIndex, setReplacingImageIndex] = useState<number | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [featureOnHomePage, setFeatureOnHomePage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Orbital Horizon 3D Lamp',
    slug: 'orbital-horizon-3d-lamp',
    category: 'Moon Collection',
    price: 340,
    originalPrice: 420,
    stock: 8,
    shortDescription: 'Precision CNC lunar hemisphere with circadian twilight warm glow.',
    description: 'Engineered from precision lunar elevation cartography, this piece captures the rim of Tycho crater in high tactile definition with integrated ambient LED array.',
    material: 'Aerospace-Grade 6061-T6 Aluminum, Basalt Polymer',
    dimensions: 'Ø 350 mm x 85 mm',
    lightingType: 'Circadian Tunable White LED Array (CRI 98+)',
    colorTemperature: 'Warm Amber 2700K',
    powerSource: 'Concealed 24V DC Ultra-Low-Noise Bus',
    bestseller: false,
    badge: 'New Release',
    status: 'active' as 'active' | 'draft'
  });

  const handleAddPreset = (presetSrc: string) => {
    if (replacingImageIndex !== null) {
      const updated = [...imagesList];
      updated[replacingImageIndex] = presetSrc;
      setImagesList(updated);
      setReplacingImageIndex(null);
      addToast(`Image #${replacingImageIndex + 1} replaced`, 'success');
      return;
    }

    if (imagesList.includes(presetSrc)) {
      addToast('Image already in list', 'info');
      return;
    }
    setImagesList((prev) => [...prev, presetSrc]);
    addToast('Preset artwork attached', 'success');
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customImageUrl.trim()) return;
    if (replacingImageIndex !== null) {
      const updated = [...imagesList];
      updated[replacingImageIndex] = customImageUrl.trim();
      setImagesList(updated);
      setReplacingImageIndex(null);
      setCustomImageUrl('');
      addToast(`Image #${replacingImageIndex + 1} replaced with custom URL`, 'success');
      return;
    }
    setImagesList((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
    addToast('Custom image URL added', 'success');
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        addToast(`Skipped non-image "${file.name}"`, 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setImagesList((prev) => [...prev, dataUrl]);
          addToast(`Uploaded "${file.name}"`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReplaceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacingImageIndex === null) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updated = [...imagesList];
        updated[replacingImageIndex] = dataUrl;
        setImagesList(updated);
        setReplacingImageIndex(null);
        addToast(`Replaced Image #${replacingImageIndex + 1} with "${file.name}"`, 'success');
      }
    };
    reader.readAsDataURL(file);
    if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemoveImage = (index: number) => {
    if (imagesList.length <= 1) {
      addToast('At least one artwork image is required', 'warning');
      return;
    }
    setImagesList((prev) => prev.filter((_, idx) => idx !== index));
    if (replacingImageIndex === index) setReplacingImageIndex(null);
    addToast('Image removed from gallery', 'info');
  };

  const handleSetPrimary = (index: number) => {
    const target = imagesList[index];
    const rest = imagesList.filter((_, idx) => idx !== index);
    setImagesList([target, ...rest]);
    addToast('Primary display image set', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imagesList.length === 0) {
      addToast('Please attach at least one visual image', 'warning');
      return;
    }

    const newPiece = addProduct({
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock),
      rating: 5.0,
      reviewCount: 1,
      shortDescription: formData.shortDescription,
      description: formData.description,
      images: imagesList,
      material: formData.material,
      dimensions: formData.dimensions,
      lightingType: formData.lightingType,
      colorTemperature: formData.colorTemperature,
      powerSource: formData.powerSource,
      bestseller: formData.bestseller,
      badge: formData.badge,
      status: formData.status,
      specifications: [
        { label: 'Topographic Accuracy', value: '0.2 mm NASA altimetry model' },
        { label: 'Optical Transmittance', value: '99.4% Dielectric' },
        { label: 'Chassis Metallurgy', value: 'Anodized 6061 Aerospace Aluminum' },
        { label: 'Luminous Lifespan', value: '50,000 continuous hours' },
        { label: 'Warranty', value: '5-Year Master Architectural Guarantee' }
      ],
      inBox: [
        '1x Masterpiece Sculptural Unit',
        '1x Magnetic Low-Profile Power Feed',
        '1x RF Precision Dimmer Controller',
        '1x Laser-Etched Numbered Certificate of Origin',
        '1x Microfiber Optical Polish Cloth'
      ]
    });

    if (featureOnHomePage) {
      setProductAsHomeFeatured(newPiece.id, imagesList[0]);
    }

    navigate('/admin/products');
  };

  return (
    <AdminLayout
      activeSection="products-new"
      title="Commission New Vault Product"
      subtitle="Register an architectural piece into the LUNOVA global store ledger with multi-image gallery."
      actionButton={
        <button
          onClick={() => navigate('/admin/products')}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vault</span>
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 text-xs">
        
        {/* Step 1: Core Details Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="text-base font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>1. Core Identification & Category</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Piece Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Curated Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Price ($ USD) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Original Reference Price ($ USD)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Vault Stock Allocation *
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Promotional Badge Label
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Flagship / Limited Edition"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Summary Tagline
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Full Architectural Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Multi-Image Artwork Suite with Upload, Change & Delete */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>2. Piece Visual Gallery ({imagesList.length} Selected)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Upload new photos, change existing images, or delete unwanted visuals. First image is the primary store catalog view.
              </p>
            </div>

            <label className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer text-amber-300 font-semibold">
              <Crown className="w-3.5 h-3.5" />
              <input
                type="checkbox"
                checked={featureOnHomePage}
                onChange={(e) => setFeatureOnHomePage(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-400"
              />
              <span className="text-xs">Feature on Home Hero upon save</span>
            </label>
          </div>

          {/* Changing Image Banner */}
          {replacingImageIndex !== null && (
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-xs text-amber-300 font-semibold">
                  Replacing Image #{replacingImageIndex + 1}: Select preset below or upload a file.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReplacingImageIndex(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Current selected images grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {imagesList.map((img, idx) => (
              <div
                key={idx}
                className={`relative aspect-square rounded-2xl bg-zinc-900 border p-2 flex flex-col justify-between overflow-hidden group ${
                  idx === 0
                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                    : replacingImageIndex === idx
                    ? 'border-sky-400 ring-2 ring-sky-400/30'
                    : 'border-zinc-800'
                }`}
              >
                <img src={img} alt="piece photo" className="w-full h-full object-contain" />
                
                {idx === 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono bg-amber-400 text-zinc-950">
                    Primary
                  </span>
                )}

                <div className="absolute inset-0 bg-zinc-950/85 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between items-center text-center">
                  <span className="text-[10px] text-zinc-300 font-mono">Image #{idx + 1}</span>

                  <div className="flex flex-col gap-1 w-full">
                    {/* Change / Replace */}
                    <button
                      type="button"
                      onClick={() => setReplacingImageIndex(idx)}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-sky-300 text-[10px] font-semibold uppercase flex items-center justify-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Change Image</span>
                    </button>

                    {/* Make Primary */}
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="px-2 py-1 rounded bg-amber-400 text-zinc-950 text-[10px] font-semibold uppercase"
                      >
                        Make Primary
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="px-2 py-1 rounded bg-rose-500 text-white text-[10px] font-semibold uppercase flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
              isDragOver 
                ? 'border-amber-400 bg-amber-400/10' 
                : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-white text-xs">
                  Upload Product Artwork Files
                </div>
                <div className="text-[11px] text-zinc-400">
                  Drag and drop image files or browse from device (PNG, JPG, SVG, WebP)
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-400/20 flex items-center space-x-1.5 shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Local Files</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <input
              ref={replaceFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleReplaceFileUpload}
              className="hidden"
            />
          </div>

          {/* Preset Asset Picker */}
          <div className="pt-4 border-t border-zinc-800 space-y-3">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              {replacingImageIndex !== null
                ? `Click Preset to Replace Image #${replacingImageIndex + 1}:`
                : 'Or Add from Master Preset Assets:'}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_ASSET_IMAGES.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleAddPreset(preset.src)}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-400 cursor-pointer transition-all flex flex-col items-center space-y-1 group"
                >
                  <img src={preset.src} alt={preset.name} className="w-14 h-14 object-contain" />
                  <span className="text-[10px] text-zinc-300 font-medium truncate w-full text-center group-hover:text-amber-300">
                    {replacingImageIndex !== null ? `Swap with ${preset.name}` : `+ ${preset.name}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Custom URL */}
            <div className="pt-2 flex gap-2">
              <input
                type="url"
                placeholder={replacingImageIndex !== null ? `Paste URL to replace image #${replacingImageIndex + 1}...` : "Or paste custom image URL (https://...)"}
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!customImageUrl.trim()}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white text-xs font-semibold rounded-xl uppercase"
              >
                {replacingImageIndex !== null ? 'Replace' : 'Attach'}
              </button>
            </div>
          </div>
        </div>

        {/* Step 3: Material & Specs */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="text-base font-semibold uppercase tracking-wider text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>3. Technical Specifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Primary Metallurgy & Materials
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Dimensions
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Lighting Array Tech
              </label>
              <input
                type="text"
                value={formData.lightingType}
                onChange={(e) => setFormData({ ...formData, lightingType: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                Default Color Temperature
              </label>
              <input
                type="text"
                value={formData.colorTemperature}
                onChange={(e) => setFormData({ ...formData, colorTemperature: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Publish Action Footer */}
        <div className="flex items-center justify-between p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl">
          <label className="flex items-center space-x-3 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.bestseller}
              onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-400"
            />
            <span className="font-semibold">Highlight with Bestseller Crest</span>
          </label>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-5 py-3 rounded-2xl border border-zinc-800 text-zinc-400 hover:text-white uppercase font-bold tracking-wider"
            >
              Discard
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-zinc-950 font-bold uppercase tracking-widest shadow-xl shadow-amber-400/25 hover:shadow-amber-400/40 hover:scale-105 transition-all"
            >
              Commission Piece
            </button>
          </div>
        </div>

      </form>
    </AdminLayout>
  );
};
