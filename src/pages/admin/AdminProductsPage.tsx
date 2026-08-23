import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Product } from '../../types';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  Check, 
  X, 
  Filter, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Link as LinkIcon, 
  Crown, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sliders, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Plus,
  Zap,
  Tag
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

export const AdminProductsPage: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetToDefaults,
    formatPrice,
    currencyConfig,
    navigate,
    addToast
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [flashDealsOnly, setFlashDealsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'stock' | 'name'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quickPhotoProduct, setQuickPhotoProduct] = useState<Product | null>(null);

  // New Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0]?.name || 'Infinity Mirrors & Tables',
    subcategory: 'Architectural Tables',
    price: 2400,
    originalPrice: 2800,
    stock: 15,
    lowStockThreshold: 5,
    sku: '',
    shortDescription: '',
    description: '',
    status: 'active' as Product['status'],
    featured: false,
    bestseller: false,
    isFlashDeal: false,
    discountPercentage: 25,
    salePrice: 1800,
    images: [IMAGE_3_WARM_MOON] as string[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const quickPhotoInputRef = useRef<HTMLInputElement>(null);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      // Search by product name or subcategory or SKU
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches = 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) || 
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Flash Deals filter
      if (flashDealsOnly && !p.isFlashDeal) return false;

      // Stock Status filter
      const threshold = p.lowStockThreshold || 5;
      if (selectedStockStatus === 'out_of_stock' && p.stock !== 0) return false;
      if (selectedStockStatus === 'low_stock' && (p.stock === 0 || p.stock > threshold)) return false;
      if (selectedStockStatus === 'in_stock' && p.stock <= 0) return false;

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [products, searchTerm, selectedCategory, selectedStockStatus, flashDealsOnly, sortBy]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Quick Flash Deal Toggle
  const handleToggleFlashDeal = (product: Product) => {
    const isNowFlash = !product.isFlashDeal;
    const discount = product.discountPercentage || 25;
    const original = product.originalPrice || Math.round(product.price * 1.25);
    const sale = Math.round(original * (1 - discount / 100));

    updateProduct({
      ...product,
      isFlashDeal: isNowFlash,
      discountPercentage: discount,
      salePrice: isNowFlash ? (product.salePrice || sale) : undefined,
      originalPrice: original
    });

    addToast(
      isNowFlash 
        ? `"${product.name}" assigned to Flash Deals (-${discount}% off).`
        : `"${product.name}" removed from Flash Deals.`,
      'success'
    );
  };

  // Handle Quick Stock Adjustments
  const handleQuickStockUpdate = (productId: string, delta: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    updateProduct({ ...prod, stock: newStock });
    addToast(`Stock for "${prod.name}" updated to ${newStock}.`, 'success');
  };

  // Handle Delete
  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      addToast(`Product "${productToDelete.name}" removed from catalog.`, 'success');
      setProductToDelete(null);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(p)));
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    addToast(`Product "${editingProduct.name}" updated successfully.`, 'success');
    setEditingProduct(null);
  };

  // Save New Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Please enter a product name.', 'error');
      return;
    }

    const created = addProduct({
      name: formData.name.trim(),
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: formData.category,
      subcategory: formData.subcategory,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock),
      lowStockThreshold: Number(formData.lowStockThreshold) || 5,
      sku: formData.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      shortDescription: formData.shortDescription || `${formData.name} - Luxury edition crafted with aerospace materials.`,
      description: formData.description || `The ${formData.name} represents pinnacle atmospheric interior lighting and modern sculptural luxury.`,
      status: formData.status,
      featured: formData.featured,
      bestseller: formData.bestseller,
      isFlashDeal: formData.isFlashDeal,
      discountPercentage: formData.isFlashDeal ? formData.discountPercentage : undefined,
      salePrice: formData.isFlashDeal ? formData.salePrice : undefined,
      images: formData.images.length > 0 ? formData.images : [IMAGE_3_WARM_MOON],
      rating: 5.0,
      reviewCount: 1,
      dimensions: '40cm × 40cm × 45cm',
      material: 'Anodized Aircraft Aluminum, Optical Smoked Glass',
      powerSource: 'Concealed Magnetic 24V Bus',
      lightingType: 'Multi-Spectrum Architectural LEDs',
      colorTemperature: '2700K Warm Tungsten',
      inBox: ['Product Unit & Display Cradle', 'Braided Power Cable', 'Authentication Certificate'],
      specifications: [
        { label: 'Craftsmanship', value: 'Hand-assembled in limited artisan batches' },
        { label: 'Warranty', value: '5-Year Structural & Optical Guarantee' }
      ]
    });

    addToast(`Product "${created.name}" added to live catalog.`, 'success');
    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      category: categories[0]?.name || 'Infinity Mirrors & Tables',
      subcategory: 'Architectural Tables',
      price: 2400,
      originalPrice: 2800,
      stock: 15,
      lowStockThreshold: 5,
      sku: '',
      shortDescription: '',
      description: '',
      status: 'active',
      featured: false,
      bestseller: false,
      images: [IMAGE_3_WARM_MOON]
    });
  };

  // Upload image from computer
  const handleUploadImageToFileState = (file: File, target: 'new' | 'edit' | 'quickPhoto') => {
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (JPG, PNG, WEBP).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (target === 'new') {
        setFormData((prev) => ({ ...prev, images: [dataUrl, ...prev.images] }));
        addToast('Photo uploaded to new piece draft.', 'success');
      } else if (target === 'edit' && editingProduct) {
        setEditingProduct({ ...editingProduct, images: [dataUrl, ...editingProduct.images] });
        addToast('Photo added to piece gallery.', 'success');
      } else if (target === 'quickPhoto' && quickPhotoProduct) {
        const updated = { ...quickPhotoProduct, images: [dataUrl, ...quickPhotoProduct.images.slice(1)] };
        updateProduct(updated);
        setQuickPhotoProduct(null);
        addToast(`Primary photo updated for "${quickPhotoProduct.name}".`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout
      activeSection="products"
      title={
        <div className="flex items-center space-x-3">
          <span>Product Inventory Catalog</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
            {products.length} Products
          </span>
        </div>
      }
      subtitle={`Comprehensive catalog management with live real-time stock updates, photo uploading, and instant store sync.`}
      actionButton={
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (confirm('Reset entire catalog to initial factory presets?')) {
                resetToDefaults();
                addToast('Catalog reset to factory presets.', 'info');
              }
            }}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Catalog</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Product</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6 text-xs">
        
        {/* =========================================================================
            SEARCH & FILTER CONTROLS BAR
        ========================================================================= */}
        <div className="bg-[#121318] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md">
          
          {/* Search Input for product name & subcategory */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by product name or subcategory..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Category Dropdown Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Stock Status Dropdown */}
            <select
              value={selectedStockStatus}
              onChange={(e) => {
                setSelectedStockStatus(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">Available / In Stock</option>
              <option value="low_stock">Low Stock Alerts</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock">Stock Level</option>
              <option value="name">Product Name (A-Z)</option>
            </select>

            {/* Flash Deals Quick Filter */}
            <button
              onClick={() => {
                setFlashDealsOnly(!flashDealsOnly);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                flashDealsOnly
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-zinc-900 border border-zinc-700/80 text-amber-300 hover:bg-zinc-800'
              }`}
              title="Filter only products with active Flash Deals"
            >
              <Zap className={`w-3.5 h-3.5 ${flashDealsOnly ? 'fill-zinc-950' : 'fill-amber-400'}`} />
              <span>Flash Deals</span>
            </button>

            {(searchTerm || selectedCategory !== 'all' || selectedStockStatus !== 'all' || flashDealsOnly) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedStockStatus('all');
                  setFlashDealsOnly(false);
                  setSortBy('newest');
                }}
                className="px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            PRODUCT INVENTORY TABLE
        ========================================================================= */}
        <div className="bg-[#121318] border border-zinc-800/80 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/90 border-b border-zinc-800 text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                  <th className="py-4 px-4 text-center">THUMBNAIL</th>
                  <th className="py-4 px-4">PRODUCT NAME</th>
                  <th className="py-4 px-4">SUBCATEGORY</th>
                  <th className="py-4 px-4">CATEGORY</th>
                  <th className="py-4 px-4">PRICE</th>
                  <th className="py-4 px-4 text-center">FLASH DEAL</th>
                  <th className="py-4 px-4">STOCK STATUS</th>
                  <th className="py-4 px-4">PHOTO</th>
                  <th className="py-4 px-5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-zinc-500">
                      <div className="max-w-xs mx-auto space-y-3">
                        <Boxes className="w-10 h-10 text-zinc-600 mx-auto" />
                        <div className="font-semibold text-white">No matching products in catalog</div>
                        <p className="text-zinc-400 text-xs">Try adjusting your search query or category filter.</p>
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase text-[11px]"
                        >
                          + Add New Product
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((p) => {
                    const threshold = p.lowStockThreshold || 5;
                    const isOutOfStock = p.stock === 0;
                    const isLowStock = p.stock > 0 && p.stock <= threshold;
                    const sku = p.sku || `SKU-${p.id.replace('prod-', 'LN-')}`;

                    return (
                      <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                        
                        {/* 1. Thumbnail */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="relative inline-block group">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-zinc-800 bg-zinc-950 shadow-sm"
                            />
                            {p.featured && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center text-[9px] font-bold" title="Featured Product">
                                ★
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 2. Product Name */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white max-w-[220px] truncate" title={p.name}>
                            {p.name}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono mt-0.5 flex items-center space-x-1.5">
                            <span className="text-amber-400/90">{sku}</span>
                            <span>•</span>
                            <span className={p.status === 'active' ? 'text-emerald-400' : 'text-zinc-500'}>
                              {p.status === 'active' ? 'Active' : 'Draft'}
                            </span>
                          </div>
                        </td>

                        {/* 3. Subcategory */}
                        <td className="py-3.5 px-4 text-zinc-300 font-medium">
                          {p.subcategory || <span className="text-zinc-600 italic">None</span>}
                        </td>

                        {/* 4. Category */}
                        <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium text-[11px]">
                            {p.category}
                          </span>
                        </td>

                        {/* 5. Price */}
                        <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                          <div className="font-bold text-white text-sm">{formatPrice(p.salePrice || p.price)}</div>
                          {p.originalPrice && p.originalPrice > (p.salePrice || p.price) && (
                            <div className="text-[10px] text-zinc-500 line-through">
                              {formatPrice(p.originalPrice)}
                            </div>
                          )}
                        </td>

                        {/* 6. Flash Deal Quick Status & Toggle */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleFlashDeal(p)}
                            className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-mono text-[10px] font-bold transition-all cursor-pointer ${
                              p.isFlashDeal
                                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/50 shadow-sm shadow-amber-500/10'
                                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                            }`}
                            title={p.isFlashDeal ? "Active on Flash Deals. Click to deactivate." : "Not on Flash Deals. Click to activate."}
                          >
                            <Zap className={`w-3 h-3 ${p.isFlashDeal ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
                            <span>{p.isFlashDeal ? `Active (${p.discountPercentage || 25}%)` : 'Off'}</span>
                          </button>
                        </td>

                        {/* 7. Stock Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {isOutOfStock ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                                <X className="w-3 h-3" />
                                <span>Out of Stock (0)</span>
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Low Stock ({p.stock})</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>In Stock ({p.stock})</span>
                              </span>
                            )}

                            {/* Quick stock adjusters (+ / -) */}
                            <div className="inline-flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
                              <button
                                onClick={() => handleQuickStockUpdate(p.id, -1)}
                                className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded text-xs font-mono transition-colors"
                                title="Decrease stock by 1"
                              >
                                -
                              </button>
                              <span className="px-1.5 text-[10px] font-mono text-zinc-300 font-bold">
                                {p.stock}
                              </span>
                              <button
                                onClick={() => handleQuickStockUpdate(p.id, 1)}
                                className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded text-xs font-mono transition-colors"
                                title="Increase stock by 1"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 7. Upload Photo Button */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setQuickPhotoProduct(p);
                              quickPhotoInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-amber-400/20 border border-zinc-700/80 hover:border-amber-400/50 text-[11px] text-zinc-200 hover:text-amber-300 font-medium flex items-center space-x-1.5 transition-all shadow-sm group"
                            title="Upload new primary photo from your computer"
                          >
                            <Upload className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                            <span>Upload Photo</span>
                          </button>
                        </td>

                        {/* 8. Actions (Edit & Red Remove Button) */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center space-x-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-amber-300 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                              title="Edit product specs, prices, and imagery"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Edit</span>
                            </button>

                            {/* View on Store button */}
                            <button
                              onClick={() => navigate(`/product/${p.id}`)}
                              className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                              title="View on Storefront"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Red Remove Button */}
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-600 text-rose-400 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm group"
                              title="Remove Product"
                            >
                              <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* =========================================================================
              PAGINATION FOOTER
          ========================================================================= */}
          <div className="p-4 sm:p-5 bg-zinc-900/80 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-zinc-400 font-mono">
              Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-mono text-xs transition-all ${
                    currentPage === page
                      ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Hidden Quick Photo Input */}
      <input
        type="file"
        ref={quickPhotoInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUploadImageToFileState(file, 'quickPhoto');
        }}
        accept="image/*"
        className="hidden"
      />

      {/* =========================================================================
          MODAL: ADD NEW PRODUCT
      ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-zinc-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <span>Add New Product to Live Catalog</span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Complete specs, pricing, and upload images from your device.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              
              {/* Product Name */}
              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Lotus Flower Pedestal Candle Duo"
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g. Sculpted Vessels"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Price, Compare Price, Stock, SKU */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Price ({currencyConfig.symbol}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Compare Price ({currencyConfig.symbol})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="LN-1024"
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Product Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="active">Active (Visible on Store)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center space-x-6 pt-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-400 bg-zinc-900 border-zinc-700"
                    />
                    <span className="text-zinc-300 font-medium">Featured Showcase</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bestseller}
                      onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-400 bg-zinc-900 border-zinc-700"
                    />
                    <span className="text-zinc-300 font-medium">Bestseller Badge</span>
                  </label>
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                  Short Summary
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Concise overview of materials and dimensions..."
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Image Uploader & Previews */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider">
                    Product Images ({formData.images.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-mono text-xs flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload From Device</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImageToFileState(file, 'new');
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-800 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/80 text-rose-400 hover:text-rose-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      {idx === 0 && (
                        <span className="absolute bottom-1 inset-x-1 bg-amber-400/90 text-zinc-950 text-[8px] font-mono font-bold text-center rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white uppercase font-semibold text-xs tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Product</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT EXISTING PRODUCT
      ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-zinc-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  <span>Edit Product: {editingProduct.name}</span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Update live pricing, stock levels, specifications, and imagery.
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={editingProduct.subcategory || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                    placeholder="e.g. Vanity Dishes"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Price ({currencyConfig.symbol}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Compare Price ({currencyConfig.symbol})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Product Status
                  </label>
                  <select
                    value={editingProduct.status}
                    onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="active">Active (Live on Store)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center space-x-6 pt-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-400 bg-zinc-900 border-zinc-700"
                    />
                    <span className="text-zinc-300 font-medium">Featured Showcase</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.bestseller}
                      onChange={(e) => setEditingProduct({ ...editingProduct, bestseller: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-400 bg-zinc-900 border-zinc-700"
                    />
                    <span className="text-zinc-300 font-medium">Bestseller Badge</span>
                  </label>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider">
                    Gallery Images ({editingProduct.images.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-mono text-xs flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                  </button>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImageToFileState(file, 'edit');
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  {editingProduct.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-800 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {editingProduct.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setEditingProduct({
                            ...editingProduct,
                            images: editingProduct.images.filter((_, i) => i !== idx)
                          })}
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/80 text-rose-400 hover:text-rose-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white uppercase font-semibold text-xs tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Changes</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DELETE PRODUCT CONFIRMATION (PROTECTED WITH UNDO PREVENTION)
      ========================================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-zinc-100 ring-1 ring-rose-500/20">
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Delete Product?
                </h3>
                <p className="text-xs text-rose-400/90 mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to permanently remove <span className="font-bold text-white font-mono">"{productToDelete.name}"</span> from your live store catalog? All client views will immediately remove this piece.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white uppercase font-semibold text-xs tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-1.5 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
};
