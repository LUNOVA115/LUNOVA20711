import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { LightingSimulator } from '../components/common/LightingSimulator';
import { Interactive3DViewer } from '../components/common/Interactive3DViewer';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Box, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  Layers,
  Award,
  Maximize2,
  MessageCircle,
  Instagram
} from 'lucide-react';
import { INITIAL_REVIEWS } from '../data/initialCustomers';
import { ProductReview } from '../types';

interface ProductDetailPageProps {
  productId: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigate,
    addToast,
    contactInfo,
    instagramSettings,
    formatPrice
  } = useStore();

  const product = products.find((p) => p.id === productId) || products[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [is3DMode, setIs3DMode] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColorTemp, setSelectedColorTemp] = useState(product?.colorTemperature || 'Warm Amber 2700K');
  const [activeTab, setActiveTab] = useState<'specs' | 'inbox' | 'shipping' | 'reviews'>('specs');

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 text-zinc-100">
        <h2 className="text-2xl sm:text-3xl font-serif text-white">Piece Not Found</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          The requested archival piece may have been retired or its identifier updated.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 rounded-xl bg-amber-400 text-zinc-950 font-mono font-bold text-xs uppercase tracking-widest hover:bg-amber-300 transition-colors"
        >
          Explore All Available Pieces
        </button>
      </div>
    );
  }

  const rawPhone = contactInfo?.whatsappNumber || contactInfo?.phone || '+92 315 0360126';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '') || '923150360126';
  const productWhatsAppMessage = encodeURIComponent(
    `Hello LUNOVA Concierge, I'm inquiring about "${product.name}" (${formatPrice(product.price)}). Are custom specifications or expedited crate delivery available?`
  );
  const productWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${productWhatsAppMessage}`;
  const instagramUrl = instagramSettings?.profileUrl || contactInfo?.instagramUrl || `https://www.instagram.com/${instagramSettings?.handle?.replace(/^@+/, '') || 'lunova.home_decors'}/?hl=en`;

  
  // Review form modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>(INITIAL_REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Active simulated light
  const [simulatedLight, setSimulatedLight] = useState('2700K');
  const [simulatedBrightness, setSimulatedBrightness] = useState(90);

  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  // Related products in same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.status === 'active')
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity, selectedColorTemp);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity, selectedColorTemp);
      navigate('/checkout');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      addToast('Please enter your name and review comment.', 'warning');
      return;
    }

    const review: ProductReview = {
      id: `rev-${Date.now()}`,
      userName: newReviewAuthor,
      rating: newReviewRating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment: newReviewComment,
      verified: true
    };

    setReviews([review, ...reviews]);
    setIsReviewModalOpen(false);
    setNewReviewAuthor('');
    setNewReviewComment('');
    addToast('Thank you for submitting your architectural review.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 text-zinc-100">
      
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center space-x-1.5 hover:text-amber-300 transition-colors uppercase tracking-wider font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono">
          <span className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>HOME</span>
          <span>/</span>
          <span className="cursor-pointer hover:text-white" onClick={() => navigate('/shop')}>SHOP</span>
          <span>/</span>
          <span className="text-amber-300 uppercase">{product.category}</span>
        </div>
      </div>

      {/* Main Product Presentation (Gallery + Buy Box) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left Column: Multi-Image Gallery & 3D Interactive Viewport (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* View Mode Tabs (3D Studio Gallery vs 360° Orbit Viewport) */}
          <div className="flex items-center justify-between bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800 backdrop-blur-md">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIs3DMode(false)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                  !is3DMode
                    ? 'bg-amber-400 text-zinc-950 shadow-md font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Photo Gallery</span>
              </button>

              <button
                onClick={() => setIs3DMode(true)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                  is3DMode
                    ? 'bg-amber-400 text-zinc-950 shadow-md font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>360° Interactive 3D Model</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-1 text-[11px] font-mono text-amber-400/90 px-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>3D Render Engine</span>
            </div>
          </div>

          {/* Conditional Display: 360° Interactive 3D Viewport or High-Res 3D Image Display */}
          {is3DMode ? (
            <Interactive3DViewer
              product={product}
              activeLighting={simulatedLight}
              brightness={simulatedBrightness}
            />
          ) : (
            <>
              {/* Main Large Display Image Frame */}
              <div className="relative w-full aspect-square rounded-3xl bg-zinc-950 border border-zinc-800 p-6 overflow-hidden flex items-center justify-center shadow-2xl group">
                
                {/* Ambient Lighting Backlight Glow */}
                <div 
                  className="absolute inset-4 rounded-full blur-3xl transition-all duration-700 pointer-events-none"
                  style={{
                    backgroundColor: simulatedLight === 'CYAN' ? '#06b6d4' : simulatedLight === '6000K' ? '#38bdf8' : '#f59e0b',
                    opacity: (simulatedBrightness / 100) * 0.35
                  }}
                />

                {/* Main Image */}
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="relative z-10 w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Badges Overlay */}
                <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                  {product.bestseller && (
                    <span className="px-3 py-1 text-xs uppercase font-bold tracking-widest bg-amber-400 text-zinc-950 rounded-full shadow-lg">
                      Bestseller
                    </span>
                  )}
                  {product.badge && (
                    <span className="px-3 py-1 text-xs uppercase font-semibold tracking-wider bg-zinc-900/90 text-zinc-200 border border-zinc-700 rounded-full backdrop-blur-md">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* 3D Interactive Quick-Launch Pill */}
                <button
                  onClick={() => setIs3DMode(true)}
                  className="absolute top-6 right-6 z-20 px-3 py-1 rounded-full bg-zinc-900/90 hover:bg-amber-400 hover:text-zinc-950 text-amber-300 border border-amber-400/40 text-[11px] font-mono font-medium backdrop-blur-md transition-all flex items-center space-x-1.5 shadow-lg group/btn"
                >
                  <Box className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
                  <span>Launch 3D Orbit</span>
                </button>

                {/* Image zoom indicator */}
                <div className="absolute bottom-6 right-6 z-20 text-[10px] uppercase font-mono text-zinc-400 bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800 backdrop-blur-md">
                  3D View {selectedImageIndex + 1} of {product.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery Row */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square rounded-2xl bg-zinc-950 p-2 border transition-all duration-300 overflow-hidden ${
                        selectedImageIndex === idx
                          ? 'border-amber-400 ring-2 ring-amber-400/20 scale-[1.02]'
                          : 'border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Embedded Lighting Simulator for Moon/Infinity Lamp */}
          <div className="pt-2">
            <LightingSimulator
              activeMode={simulatedLight}
              onLightChange={(preset, intensity) => {
                setSimulatedLight(preset);
                setSimulatedBrightness(intensity);
              }}
            />
          </div>
        </div>

        {/* Right Column: Information & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header & Category */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-amber-300 font-semibold">
                {product.category}
              </span>
              <div className="flex items-center space-x-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-white font-bold text-sm font-mono">{product.rating}</span>
                <span className="text-zinc-500 text-xs">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-light text-white leading-tight tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-semibold text-white font-mono">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-zinc-500 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-amber-300 uppercase px-2.5 py-1 rounded bg-zinc-900 border border-amber-400/30">
              Tax & Insured Crate Included
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-300 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Color Temperature Selector */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-800">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Illumination Spectrum Selection:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Warm Amber 2700K', 'Neutral Lunar 4000K', 'Arctic White 6000K', 'Cyber Neon 480nm'].map((temp) => (
                <button
                  key={temp}
                  onClick={() => setSelectedColorTemp(temp)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedColorTemp === temp
                      ? 'bg-zinc-800 border-amber-400 text-amber-300 font-semibold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {temp}
                </button>
              ))}
            </div>
          </div>

          {/* Stock indicator */}
          <div className="flex items-center space-x-2 text-xs">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span className={product.stock > 0 ? 'text-emerald-400 font-medium' : 'text-rose-400'}>
              {product.stock > 0 ? `${product.stock} units currently reserved in manufacturing vault` : 'Pre-order Allocation'}
            </span>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex space-x-3">
              {/* Quantity selector */}
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-400/80 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Add to Acquisition Bag</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isSaved
                    ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-lg shadow-amber-400/30'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-zinc-950' : ''}`} />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-zinc-950 text-xs uppercase tracking-[0.2em] font-extrabold shadow-xl shadow-amber-400/20 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instant Acquisition & White-Glove Dispatch</span>
            </button>

            {/* Direct WhatsApp & Instagram Concierge Consultation */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <a
                href={productWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 hover:border-emerald-400 text-emerald-200 text-[11px] font-mono font-medium flex items-center justify-center space-x-1.5 transition-all group"
                title="Inquire about this specific piece on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform fill-emerald-400" />
                <span>WhatsApp Atelier</span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/40 hover:border-pink-400 text-pink-200 text-[11px] font-mono font-medium flex items-center justify-center space-x-1.5 transition-all group"
                title="Direct message or view showcase on Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
                <span>DM on Instagram</span>
              </a>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800 text-xs text-zinc-400">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-amber-300" />
              <span>Complimentary insured shipping</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>5-Year comprehensive warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-amber-300" />
              <span>30-Night in-home trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Numbered certificate of origin</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DETAILED TABS: SPECIFICATIONS / IN THE BOX / SHIPPING / REVIEWS
      ========================================================================= */}
      <div className="space-y-8 pt-8 border-t border-zinc-900">
        
        {/* Tab Headers */}
        <div className="flex items-center space-x-4 sm:space-x-8 border-b border-zinc-800 overflow-x-auto text-xs uppercase tracking-widest font-semibold pb-1">
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Technical Specifications
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'inbox'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            In the Crate ({product.inBox.length})
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            White-Glove Logistics & Warranty
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Verified Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab 1: Specifications Table */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                Physical Dimensions & Metallurgy
              </h4>
              <div className="divide-y divide-zinc-900 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-zinc-400">Dimensions</span>
                  <span className="text-white font-mono">{product.dimensions}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-zinc-400">Chassis Material</span>
                  <span className="text-white">{product.material}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-zinc-400">Power Input</span>
                  <span className="text-white font-mono">{product.powerSource}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-zinc-400">Lighting Architecture</span>
                  <span className="text-white">{product.lightingType}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                Optical & Performance Metrics
              </h4>
              <div className="divide-y divide-zinc-900 text-xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="py-2.5 flex justify-between">
                    <span className="text-zinc-400">{spec.label}</span>
                    <span className="text-amber-300 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: In the Box Checklist */}
        {activeTab === 'inbox' && (
          <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Included Packaging Inventory
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.inBox.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Shipping & Warranty Accordion */}
        {activeTab === 'shipping' && (
          <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6 text-xs text-zinc-300 leading-relaxed font-light">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-2">
                Shock-Proof Crated Transit
              </h4>
              <p>
                Each LUNOVA piece is suspended inside high-density expanded polyethylene dampeners inside a reinforced maritime composite crate. Dispatched via premium couriers (FedEx Freight / UPS White Glove) with full insurance coverage.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-900">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-2">
                5-Year Comprehensive Warranty
              </h4>
              <p>
                All optical beam-splitter coatings, LED modules, capacitive switches, and structural frames are warranted against defects and degradation for 60 months from date of delivery.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Verified Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-light text-white">Architectural & Collector Reviews</h3>
                <p className="text-xs text-zinc-400">{reviews.length} Verified Endorsements</p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-400 text-xs text-amber-300 font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">{rev.date}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-xs">
                    <span className="font-semibold text-white">{rev.userName}</span>
                    <span className="text-emerald-400 text-[10px] font-mono flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Client</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      <div className="space-y-6 pt-12 border-t border-zinc-900">
        <h3 className="text-xl sm:text-2xl font-light text-white uppercase tracking-wider">
          Complementary Masterpieces
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            onClick={() => setIsReviewModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-base font-semibold text-white uppercase tracking-wider">
                Submit Client Review
              </h4>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Your Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan R., Interior Designer"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className={`p-1.5 rounded-lg border ${
                        newReviewRating >= star
                          ? 'border-amber-400 text-amber-300 bg-zinc-900'
                          : 'border-zinc-800 text-zinc-600'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Review Comments</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe optical qualities, ambient lighting presence, and build quality..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
