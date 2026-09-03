import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Product, PriceHistoryRecord } from '../../types';
import { PriceHistoryModal } from '../../components/admin/PriceHistoryModal';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  Check, 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Link as LinkIcon, 
  Crown, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Boxes,
  Plus,
  Zap,
  Star,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  FolderOpen,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
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
import { optimizeImageFile } from '../../utils/imageOptimizer';

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
    addToast,
    adminUser
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [flashDealsOnly, setFlashDealsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'stock' | 'name'>('newest');

  // Price History Modal state
  const [priceHistoryProduct, setPriceHistoryProduct] = useState<Product | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Dedicated Image Studio Modal
  const [imageStudioProduct, setImageStudioProduct] = useState<Product | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [previewZoomImage, setPreviewZoomImage] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Dedicated Quick Price Editor Modal
  const [quickPriceProduct, setQuickPriceProduct] = useState<Product | null>(null);
  const [quickPriceForm, setQuickPriceForm] = useState({
    price: 0,
    originalPrice: 0,
    salePrice: 0,
    isFlashDeal: false,
    discountPercentage: 25,
    note: ''
  });

  const handleOpenQuickPrice = (product: Product) => {
    setQuickPriceProduct(product);
    const orig = product.originalPrice || Math.round(product.price * 1.25);
    const disc = product.discountPercentage || 25;
    const sale = product.salePrice || Math.round(orig * (1 - disc / 100));
    setQuickPriceForm({
      price: product.price,
      originalPrice: product.originalPrice || 0,
      salePrice: sale,
      isFlashDeal: !!product.isFlashDeal,
      discountPercentage: disc,
      note: ''
    });
  };

  const handleSaveQuickPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPriceProduct) return;

    const basePrice = Number(quickPriceForm.price);
    const origPrice = quickPriceForm.originalPrice > 0 ? Number(quickPriceForm.originalPrice) : undefined;
    const isFlash = quickPriceForm.isFlashDeal;
    const discPct = Number(quickPriceForm.discountPercentage) || 25;
    const sPrice = isFlash ? Number(quickPriceForm.salePrice) : undefined;

    const todayDate = new Date().toISOString().split('T')[0];
    const newRecord: PriceHistoryRecord = {
      id: `ph-${quickPriceProduct.id}-${Date.now().toString(36)}`,
      price: basePrice,
      originalPrice: origPrice,
      salePrice: sPrice,
      date: todayDate,
      changedBy: adminUser?.name || 'Store Admin',
      note: quickPriceForm.note.trim() || `Price updated: ${formatPrice(sPrice || basePrice)}`
    };

    const existingHistory = quickPriceProduct.priceHistory || [];
    const updatedHistory = [...existingHistory, newRecord].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const updatedProduct: Product = {
      ...quickPriceProduct,
      price: basePrice,
      originalPrice: origPrice,
      salePrice: sPrice,
      isFlashDeal: isFlash,
      discountPercentage: isFlash ? discPct : undefined,
      priceHistory: updatedHistory
    };

    updateProduct(updatedProduct);
    addToast(`Price for "${quickPriceProduct.name}" updated and saved live!`, 'success');
    setQuickPriceProduct(null);
  };

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
  const studioFileInputRef = useRef<HTMLInputElement>(null);
  const studioReplaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

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

    const originalProduct = products.find((p) => p.id === editingProduct.id);
    let updatedProduct = { ...editingProduct };

    if (originalProduct) {
      const priceChanged = originalProduct.price !== editingProduct.price;
      const originalPriceChanged = originalProduct.originalPrice !== editingProduct.originalPrice;
      const salePriceChanged = originalProduct.salePrice !== editingProduct.salePrice;

      if (priceChanged || originalPriceChanged || salePriceChanged) {
        const todayDate = new Date().toISOString().split('T')[0];
        const newRecord: PriceHistoryRecord = {
          id: `ph-${editingProduct.id}-${Date.now().toString(36)}`,
          price: editingProduct.price,
          originalPrice: editingProduct.originalPrice,
          salePrice: editingProduct.salePrice,
          date: todayDate,
          changedBy: adminUser?.name || 'Store Admin',
          note: `Price updated: ${formatPrice(editingProduct.salePrice || editingProduct.price)}`
        };

        const existingHistory = editingProduct.priceHistory || originalProduct.priceHistory || [];
        updatedProduct.priceHistory = [...existingHistory, newRecord].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }
    }

    updateProduct(updatedProduct);
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

    const todayDate = new Date().toISOString().split('T')[0];
    const initialPriceRecord: PriceHistoryRecord = {
      id: `ph-new-${Date.now().toString(36)}`,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      salePrice: formData.isFlashDeal ? formData.salePrice : undefined,
      date: todayDate,
      changedBy: adminUser?.name || 'Store Admin',
      note: 'Initial Catalog Product Release'
    };

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
      ],
      priceHistory: [initialPriceRecord]
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
      isFlashDeal: false,
      discountPercentage: 25,
      salePrice: 1800,
      images: [IMAGE_3_WARM_MOON]
    });
  };

  // Upload image from computer with automatic web optimization
  const handleUploadImageToFileState = async (files: FileList | null, target: 'new' | 'edit' | 'studio') => {
    if (!files || files.length === 0) return;
    setIsOptimizing(true);

    try {
      const optimizedImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const optimized = await optimizeImageFile(file, 1600, 1600, 0.86);
          optimizedImages.push(optimized);
        }
      }

      if (optimizedImages.length === 0) {
        addToast('No valid image files found.', 'warning');
        return;
      }

      if (target === 'new') {
        setFormData((prev) => ({ ...prev, images: [...optimizedImages, ...prev.images] }));
        addToast(`${optimizedImages.length} photo(s) added to piece draft.`, 'success');
      } else if (target === 'edit' && editingProduct) {
        setEditingProduct({ ...editingProduct, images: [...optimizedImages, ...editingProduct.images] });
        addToast(`${optimizedImages.length} photo(s) added to gallery.`, 'success');
      } else if (target === 'studio' && imageStudioProduct) {
        const updatedImages = [...imageStudioProduct.images, ...optimizedImages];
        const updated = { ...imageStudioProduct, images: updatedImages };
        updateProduct(updated);
        setImageStudioProduct(updated);
        addToast(`${optimizedImages.length} photo(s) uploaded and saved for "${imageStudioProduct.name}".`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to optimize and upload image.', 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Replace single image at index in Studio
  const handleReplaceSpecificImage = async (file: File) => {
    if (!imageStudioProduct || replacingIndex === null) return;
    setIsOptimizing(true);
    try {
      const optimized = await optimizeImageFile(file, 1600, 1600, 0.86);
      const newImages = [...imageStudioProduct.images];
      newImages[replacingIndex] = optimized;
      const updated = { ...imageStudioProduct, images: newImages };
      updateProduct(updated);
      setImageStudioProduct(updated);
      addToast(`Image #${replacingIndex + 1} replaced successfully!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to replace image.', 'error');
    } finally {
      setIsOptimizing(false);
      setReplacingIndex(null);
    }
  };

  // Add photo via URL
  const handleAddImageFromUrl = (target: 'new' | 'edit' | 'studio') => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      addToast('Please enter a valid image URL link.', 'warning');
      return;
    }

    if (target === 'new') {
      setFormData((prev) => ({ ...prev, images: [trimmed, ...prev.images] }));
      setUrlInput('');
      addToast('Photo URL added to draft.', 'success');
    } else if (target === 'edit' && editingProduct) {
      setEditingProduct({ ...editingProduct, images: [trimmed, ...editingProduct.images] });
      setUrlInput('');
      addToast('Photo URL added to piece.', 'success');
    } else if (target === 'studio' && imageStudioProduct) {
      const updatedImages = [...imageStudioProduct.images, trimmed];
      const updated = { ...imageStudioProduct, images: updatedImages };
      updateProduct(updated);
      setImageStudioProduct(updated);
      setUrlInput('');
      addToast('Photo URL linked and saved to live storefront.', 'success');
    }
  };

  // Set image as primary / cover photo
  const handleSetPrimaryImage = (index: number) => {
    if (!imageStudioProduct || index === 0) return;
    const images = [...imageStudioProduct.images];
    const selected = images.splice(index, 1)[0];
    const newImages = [selected, ...images];
    const updated = { ...imageStudioProduct, images: newImages };
    updateProduct(updated);
    setImageStudioProduct(updated);
    addToast('Cover photo updated! Customers will now see this image first.', 'success');
  };

  // Reorder image (move left or right)
  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    if (!imageStudioProduct) return;
    const images = [...imageStudioProduct.images];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const temp = images[index];
    images[index] = images[targetIdx];
    images[targetIdx] = temp;

    const updated = { ...imageStudioProduct, images };
    updateProduct(updated);
    setImageStudioProduct(updated);
  };

  // Remove single image from Studio
  const handleRemoveImageFromStudio = (index: number) => {
    if (!imageStudioProduct) return;
    if (imageStudioProduct.images.length <= 1) {
      addToast('Product must have at least 1 display image.', 'warning');
      return;
    }
    const newImages = imageStudioProduct.images.filter((_, i) => i !== index);
    const updated = { ...imageStudioProduct, images: newImages };
    updateProduct(updated);
    setImageStudioProduct(updated);
    addToast('Image removed from piece gallery.', 'info');
  };

  return (
    <AdminLayout
      activeSection="products"
      title={
        <div className="flex items-center space-x-3">
          <span>Product Inventory & Image Studio</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
            {products.length} Products
          </span>
        </div>
      }
      subtitle={`Live management console: update prices, stock, and change product photos anytime from any device.`}
      actionButton={
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (confirm('Reset entire catalog to initial factory presets?')) {
                resetToDefaults();
                addToast('Catalog reset to factory presets.', 'info');
              }
            }}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Catalog</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-2 transition-all cursor-pointer"
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
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products by name, subcategory, or SKU..."
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
                  <th className="py-4 px-4">CATEGORY</th>
                  <th className="py-4 px-4">PRICE</th>
                  <th className="py-4 px-4 text-center">FLASH DEAL</th>
                  <th className="py-4 px-4">STOCK STATUS</th>
                  <th className="py-4 px-4 text-center">PHOTOS & IMAGERY</th>
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
                          className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase text-[11px] cursor-pointer"
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
                        
                        {/* 1. Thumbnail (Click to open Image Studio) */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setImageStudioProduct(p)}
                            className="relative inline-block group cursor-pointer"
                            title="Click to manage or change images"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-14 h-14 rounded-2xl object-cover border border-zinc-800 group-hover:border-amber-400 transition-all bg-zinc-950 shadow-md group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center text-amber-300 transition-opacity">
                              <ImageIcon className="w-4 h-4" />
                              <span className="text-[8px] font-mono font-bold mt-0.5">Edit</span>
                            </div>
                            {p.featured && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center text-[9px] font-bold shadow" title="Featured Product">
                                ★
                              </span>
                            )}
                          </button>
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
                            {p.subcategory && (
                              <>
                                <span>•</span>
                                <span className="text-zinc-400 truncate max-w-[100px]">{p.subcategory}</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* 3. Category */}
                        <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium text-[11px]">
                            {p.category}
                          </span>
                        </td>

                        {/* 4. Price & History */}
                        <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleOpenQuickPrice(p)}
                              className="text-left group cursor-pointer hover:opacity-90"
                              title="Click to quickly change price, sale price, or flash discount"
                            >
                              <div className="font-bold text-white text-sm group-hover:text-amber-300 flex items-center space-x-1 transition-colors">
                                <span>{formatPrice(p.salePrice || p.price)}</span>
                                <Edit3 className="w-3 h-3 text-zinc-500 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              {p.originalPrice && p.originalPrice > (p.salePrice || p.price) && (
                                <div className="text-[10px] text-zinc-500 line-through">
                                  {formatPrice(p.originalPrice)}
                                </div>
                              )}
                            </button>
                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={() => handleOpenQuickPrice(p)}
                                className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-amber-400/20 text-zinc-300 hover:text-amber-300 border border-zinc-700/80 hover:border-amber-400/40 text-[10px] font-mono font-bold flex items-center space-x-1 transition-all cursor-pointer shadow-sm shrink-0"
                                title="Change Price / Set Discounts"
                              >
                                <DollarSign className="w-3 h-3 text-amber-400" />
                                <span>Change Price</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPriceHistoryProduct(p)}
                                className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center space-x-1 transition-all cursor-pointer group shadow-sm shrink-0"
                                title="View Price History Line Graph"
                              >
                                <TrendingUp className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
                                <span>History</span>
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 5. Flash Deal Quick Status & Toggle */}
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

                        {/* 6. Stock Status */}
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
                                className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded text-xs font-mono transition-colors cursor-pointer"
                                title="Decrease stock by 1"
                              >
                                -
                              </button>
                              <span className="px-1.5 text-[10px] font-mono text-zinc-300 font-bold">
                                {p.stock}
                              </span>
                              <button
                                onClick={() => handleQuickStockUpdate(p.id, 1)}
                                className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded text-xs font-mono transition-colors cursor-pointer"
                                title="Increase stock by 1"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 7. Image Studio Quick Button */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => setImageStudioProduct(p)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400/15 to-amber-500/20 hover:from-amber-400/25 hover:to-amber-500/30 border border-amber-400/40 text-amber-300 font-medium text-[11px] flex items-center space-x-1.5 mx-auto transition-all cursor-pointer shadow-sm group"
                            title="Open Image Studio to change cover photo, upload device photos, or paste image URL"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                            <span>Change Photos ({p.images?.length || 1})</span>
                          </button>
                        </td>

                        {/* 8. Actions */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center space-x-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-amber-300 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                              title="Edit product specs, prices, and imagery"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Edit</span>
                            </button>

                            {/* View on Store button */}
                            <button
                              onClick={() => navigate(`/product/${p.id}`)}
                              className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                              title="View on Storefront"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Red Remove Button */}
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-600 text-rose-400 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm group cursor-pointer"
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
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-mono text-xs transition-all cursor-pointer ${
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
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MODAL: DEDICATED PRODUCT IMAGE STUDIO (INSTANT LIVE SYNC)
      ========================================================================= */}
      {imageStudioProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-[#0c0d12] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 text-zinc-100 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/30">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">
                      Product Image Studio
                    </h3>
                    <p className="text-xs text-amber-400 font-mono">
                      {imageStudioProduct.name}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setImageStudioProduct(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Storefront Sync Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Changes made here update immediately across customer catalogue & product page.</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/80 uppercase font-bold">
                Live Auto-Saved
              </span>
            </div>

            {/* Add Images Methods (Upload, URL, Presets) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Method 1: Upload from Device */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">Upload from Device</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">JPG, PNG, WEBP</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Select photos from your phone camera roll, tablet, or desktop. Photos are automatically compressed for lightning-fast loading.
                </p>
                <button
                  type="button"
                  disabled={isOptimizing}
                  onClick={() => studioFileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isOptimizing ? 'Compressing & Saving...' : 'Browse & Upload Images'}</span>
                </button>
                <input
                  type="file"
                  multiple
                  ref={studioFileInputRef}
                  onChange={(e) => handleUploadImageToFileState(e.target.files, 'studio')}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Method 2: Add via URL Link */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-white text-xs uppercase tracking-wider">Paste Image URL Link</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Web Link</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Link images from Netlify assets, Cloudinary, AWS S3, Imgur, or your CDN.
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImageFromUrl('studio');
                      }
                    }}
                    placeholder="https://images.example.com/photo.jpg"
                    className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImageFromUrl('studio')}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

            </div>

            {/* Current Product Image Gallery Grid with Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-zinc-200 font-bold uppercase tracking-wider text-xs flex items-center space-x-2">
                  <span>Current Gallery Images ({imageStudioProduct.images.length})</span>
                  <span className="text-zinc-500 font-normal text-[11px]">(Image #1 is the Primary Cover)</span>
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imageStudioProduct.images.map((img, idx) => {
                  const isPrimary = idx === 0;

                  return (
                    <div 
                      key={idx} 
                      className={`relative rounded-2xl overflow-hidden border p-1 bg-zinc-950 transition-all ${
                        isPrimary 
                          ? 'border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40' 
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-black group">
                        <img 
                          src={img} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        
                        {/* Hover Overlay with Zoom Preview */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setPreviewZoomImage(img)}
                            className="p-2 rounded-lg bg-zinc-900/90 text-white hover:text-amber-300 transition-colors"
                            title="Zoom Preview"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setReplacingIndex(idx);
                              studioReplaceInputRef.current?.click();
                            }}
                            className="p-2 rounded-lg bg-zinc-900/90 text-white hover:text-amber-300 transition-colors"
                            title="Replace this photo"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Badges */}
                        {isPrimary ? (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-400 text-zinc-950 text-[9px] font-mono font-bold uppercase flex items-center space-x-1 shadow-md">
                            <Crown className="w-3 h-3" />
                            <span>Primary Cover</span>
                          </div>
                        ) : (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-700 text-zinc-300 text-[9px] font-mono font-semibold">
                            #{idx + 1}
                          </div>
                        )}
                      </div>

                      {/* Controls Toolbar under each image */}
                      <div className="p-2 space-y-1.5">
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="w-full py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                          >
                            <Star className="w-3 h-3" />
                            <span>Make Primary</span>
                          </button>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-zinc-900 text-zinc-400">
                          {/* Reorder Arrows */}
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, 'left')}
                              className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 cursor-pointer"
                              title="Move photo earlier"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === imageStudioProduct.images.length - 1}
                              onClick={() => handleMoveImage(idx, 'right')}
                              className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 cursor-pointer"
                              title="Move photo later"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Delete Photo */}
                          {imageStudioProduct.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveImageFromStudio(idx)}
                              className="p-1 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
                              title="Delete this image"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Method 3: Pick from Preset Luxury Asset Library */}
            <div className="pt-3 border-t border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-zinc-300 font-semibold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick Add from LUNOVA 3D Render Library</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">1-Click Insert</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {PRESET_ASSET_IMAGES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...imageStudioProduct,
                        images: [...imageStudioProduct.images, preset.src]
                      };
                      updateProduct(updated);
                      setImageStudioProduct(updated);
                      addToast(`Added "${preset.name}" render to gallery.`, 'success');
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-400 transition-all cursor-pointer"
                    title={`Add ${preset.name}`}
                  >
                    <img src={preset.src} alt={preset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-amber-400/20 transition-colors flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => navigate(`/product/${imageStudioProduct.id}`)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono flex items-center space-x-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Preview Customer View</span>
              </button>

              <button
                type="button"
                onClick={() => setImageStudioProduct(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                Done & Close Studio
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DEDICATED QUICK PRICE & DISCOUNT MANAGER
      ========================================================================= */}
      {quickPriceProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-[#0c0d12] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 text-zinc-100 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">
                    Quick Price & Discount Editor
                  </h3>
                  <p className="text-xs text-amber-400 font-mono">
                    {quickPriceProduct.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickPriceProduct(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Storefront Sync Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Price changes sync directly to Firestore & all live customer carts.</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/80 uppercase font-bold">
                Cloud Synced
              </span>
            </div>

            {/* Price Form */}
            <form onSubmit={handleSaveQuickPrice} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard Store Price */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Selling Price ({currencyConfig.symbol}) *</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={Math.round(quickPriceForm.price * currencyConfig.rateAgainstUSD)}
                    onChange={(e) => {
                      const activeVal = Number(e.target.value);
                      const inUSD = activeVal / currencyConfig.rateAgainstUSD;
                      setQuickPriceForm({ ...quickPriceForm, price: inUSD });
                    }}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-amber-400"
                  />
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Base: ${quickPriceForm.price.toFixed(2)} USD
                  </div>
                </div>

                {/* Original MSRP / Strikethrough Price */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                    <span>MSRP / Strikethrough ({currencyConfig.symbol})</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Optional original price"
                    value={quickPriceForm.originalPrice > 0 ? Math.round(quickPriceForm.originalPrice * currencyConfig.rateAgainstUSD) : ''}
                    onChange={(e) => {
                      const activeVal = Number(e.target.value);
                      const inUSD = activeVal ? activeVal / currencyConfig.rateAgainstUSD : 0;
                      setQuickPriceForm({ ...quickPriceForm, originalPrice: inUSD });
                    }}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono text-base focus:outline-none focus:border-amber-400"
                  />
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {quickPriceForm.originalPrice > 0 ? `Base: $${quickPriceForm.originalPrice.toFixed(2)} USD` : 'Leave empty if no strikethrough'}
                  </div>
                </div>
              </div>

              {/* Flash Deal Toggle & Sale Price Section */}
              <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quickPriceForm.isFlashDeal}
                      onChange={(e) => {
                        const isNow = e.target.checked;
                        const disc = quickPriceForm.discountPercentage || 25;
                        const base = quickPriceForm.originalPrice || quickPriceForm.price;
                        const sPrice = Math.round(base * (1 - disc / 100));
                        setQuickPriceForm({
                          ...quickPriceForm,
                          isFlashDeal: isNow,
                          salePrice: sPrice
                        });
                      }}
                      className="w-4 h-4 rounded text-amber-400 bg-zinc-950 border-zinc-700"
                    />
                    <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                      <Zap className={`w-3.5 h-3.5 ${quickPriceForm.isFlashDeal ? 'fill-amber-400 text-amber-400' : 'text-zinc-500'}`} />
                      <span>Activate Flash Deal Promotion</span>
                    </span>
                  </label>
                  {quickPriceForm.isFlashDeal && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold uppercase">
                      Live on Flash Bar
                    </span>
                  )}
                </div>

                {quickPriceForm.isFlashDeal && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">
                        Discount Percentage (%)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max="95"
                          value={quickPriceForm.discountPercentage}
                          onChange={(e) => {
                            const disc = Number(e.target.value);
                            const base = quickPriceForm.originalPrice || quickPriceForm.price;
                            const sPrice = Math.round(base * (1 - disc / 100));
                            setQuickPriceForm({
                              ...quickPriceForm,
                              discountPercentage: disc,
                              salePrice: sPrice
                            });
                          }}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                        <span className="text-zinc-400 font-mono font-bold">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">
                        Flash Sale Price ({currencyConfig.symbol})
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={Math.round(quickPriceForm.salePrice * currencyConfig.rateAgainstUSD)}
                        onChange={(e) => {
                          const activeVal = Number(e.target.value);
                          const inUSD = activeVal / currencyConfig.rateAgainstUSD;
                          setQuickPriceForm({
                            ...quickPriceForm,
                            salePrice: inUSD
                          });
                        }}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Price Note / Audit Log */}
              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                  Change Note / Audit Log (Optional)
                </label>
                <input
                  type="text"
                  value={quickPriceForm.note}
                  onChange={(e) => setQuickPriceForm({ ...quickPriceForm, note: e.target.value })}
                  placeholder="e.g. Seasonal architectural promotion / Manufacturer price adjustment"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Customer Display Live Preview */}
              <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-2">
                <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                  Customer Storefront Live Preview
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-bold text-white font-mono">
                    {formatPrice(quickPriceForm.isFlashDeal ? quickPriceForm.salePrice : quickPriceForm.price)}
                  </div>
                  {quickPriceForm.originalPrice > (quickPriceForm.isFlashDeal ? quickPriceForm.salePrice : quickPriceForm.price) && (
                    <div className="text-xs text-zinc-500 line-through font-mono">
                      {formatPrice(quickPriceForm.originalPrice)}
                    </div>
                  )}
                  {quickPriceForm.isFlashDeal && (
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-zinc-950 text-[10px] font-mono font-bold uppercase">
                      Save {quickPriceForm.discountPercentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setQuickPriceProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider shadow-lg shadow-amber-400/20 cursor-pointer flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Price to Live Storefront</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Hidden file replacer input for Studio */}
      <input
        type="file"
        ref={studioReplaceInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReplaceSpecificImage(file);
        }}
        accept="image/*"
        className="hidden"
      />

      {/* =========================================================================
          ZOOM LIGHTBOX MODAL
      ========================================================================= */}
      {previewZoomImage && (
        <div 
          onClick={() => setPreviewZoomImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={previewZoomImage} alt="Zoom Preview" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-zinc-800" />
            <button
              onClick={() => setPreviewZoomImage(null)}
              className="absolute -top-3 -right-3 p-2 rounded-full bg-zinc-900 border border-zinc-700 text-white hover:text-amber-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

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
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
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
                    value={Math.round(formData.price * currencyConfig.rateAgainstUSD)}
                    onChange={(e) => {
                      const activeVal = Number(e.target.value);
                      const inUSD = activeVal / currencyConfig.rateAgainstUSD;
                      setFormData({ ...formData, price: inUSD });
                    }}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <div className="text-[10px] text-zinc-500 mt-1">
                    Base Price: ${formData.price.toFixed(2)} USD
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Compare Price ({currencyConfig.symbol})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.originalPrice ? Math.round(formData.originalPrice * currencyConfig.rateAgainstUSD) : ''}
                    onChange={(e) => {
                      const activeVal = Number(e.target.value);
                      const inUSD = activeVal ? activeVal / currencyConfig.rateAgainstUSD : 0;
                      setFormData({ ...formData, originalPrice: inUSD || undefined });
                    }}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  {formData.originalPrice && (
                    <div className="text-[10px] text-zinc-500 mt-1">
                      Base: ${formData.originalPrice.toFixed(2)} USD
                    </div>
                  )}
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
                    className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-mono text-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload From Device</span>
                  </button>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={(e) => handleUploadImageToFileState(e.target.files, 'new')}
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
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/80 text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      {idx === 0 && (
                        <span className="absolute bottom-1 inset-x-1 bg-amber-400/90 text-zinc-950 text-[8px] font-mono font-bold text-center rounded">
                          Primary Cover
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
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white uppercase font-semibold text-xs tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-1.5 transition-all cursor-pointer"
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
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
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
                    value={Math.round(editingProduct.price * currencyConfig.rateAgainstUSD)}
                    onChange={(e) => {
                      const activeVal = Number(e.target.value);
                      const inUSD = activeVal / currencyConfig.rateAgainstUSD;
                      setEditingProduct({ ...editingProduct, price: inUSD });
                    }}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <div className="text-[10px] text-zinc-500 mt-1">
                    Base: ${editingProduct.price.toFixed(2)} USD
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1.5">
                    Compare Price ({currencyConfig.symbol})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.originalPrice ? Math.round(editingProduct.originalPrice * currencyConfig.rateAgainstUSD) : ''}
                    onChange={(e) => {
                      const activeVal = Number(e.target.value);
                      const inUSD = activeVal ? activeVal / currencyConfig.rateAgainstUSD : 0;
                      setEditingProduct({ ...editingProduct, originalPrice: inUSD || undefined });
                    }}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  {editingProduct.originalPrice && (
                    <div className="text-[10px] text-zinc-500 mt-1">
                      Base: ${editingProduct.originalPrice.toFixed(2)} USD
                    </div>
                  )}
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
                    className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-mono text-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                  </button>
                  <input
                    type="file"
                    multiple
                    ref={editFileInputRef}
                    onChange={(e) => handleUploadImageToFileState(e.target.files, 'edit')}
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
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/80 text-rose-400 hover:text-rose-300 cursor-pointer"
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

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white uppercase font-semibold text-xs tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-1.5 transition-all cursor-pointer"
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
          MODAL: DELETE PRODUCT CONFIRMATION
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
                className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white uppercase font-semibold text-xs tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PRICE HISTORY CHART & ADJUSTMENT LOGS
      ========================================================================= */}
      {priceHistoryProduct && (
        <PriceHistoryModal
          product={products.find((p) => p.id === priceHistoryProduct.id) || priceHistoryProduct}
          onClose={() => setPriceHistoryProduct(null)}
        />
      )}

    </AdminLayout>
  );
};
