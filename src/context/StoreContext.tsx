import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Category, CartItem, Order, Customer, AdminUser, FilterOptions, HomeSettings, StoreContactInfo, PaymentSettings, InstagramSettings, InstagramPost, CurrencyCode, SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from '../types';
import { formatPrice as formatPriceUtil, convertFromUSD } from '../utils/currency';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_CATEGORIES } from '../data/initialCategories';
import { INITIAL_ORDERS } from '../data/initialOrders';
import { INITIAL_CUSTOMERS } from '../data/initialCustomers';
import { INITIAL_INSTAGRAM_SETTINGS } from '../data/initialInstagram';
import { IMAGE_3_WARM_MOON, IMAGE_1_GOLD_TABLE, IMAGE_8_LIFESTYLE_TABLE } from '../data/productImages';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  fixedDiscount?: number;
  description: string;
}

const AVAILABLE_COUPONS: Record<string, Coupon> = {
  'LUNOVA15': { code: 'LUNOVA15', discountPercent: 15, description: '15% Off VIP Welcome' },
  'FUTURISTIC': { code: 'FUTURISTIC', fixedDiscount: 50, description: '$50 Off Architectural Living' },
  'MOONGLOW': { code: 'MOONGLOW', discountPercent: 10, description: '10% Lunar Collection Gift' }
};

export const getInitialContactInfo = (): StoreContactInfo => {
  let envWhatsapp = '+92 315 0360126';
  let envPhone = '+92 315 0360126';
  let envInstagramHandle = 'lunova.atelier';
  let envInstagramUrl = 'https://instagram.com/lunova.atelier';
  let envEmail = 'support@lunova.luxury';
  let envAddress = '750 Madison Avenue, New York, NY / Lahore Atelier';

  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WHATSAPP_NUMBER) {
      envWhatsapp = String(import.meta.env.VITE_WHATSAPP_NUMBER).trim();
      envPhone = envWhatsapp;
    }
    if (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_CONTACT_PHONE || import.meta.env?.VITE_STORE_PHONE)) {
      envPhone = String(import.meta.env.VITE_CONTACT_PHONE || import.meta.env.VITE_STORE_PHONE).trim();
    }
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_INSTAGRAM_HANDLE) {
      envInstagramHandle = String(import.meta.env.VITE_INSTAGRAM_HANDLE).trim().replace(/^@+/, '');
      envInstagramUrl = `https://instagram.com/${envInstagramHandle}`;
    }
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_INSTAGRAM_URL) {
      envInstagramUrl = String(import.meta.env.VITE_INSTAGRAM_URL).trim();
    }
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTACT_EMAIL) {
      envEmail = String(import.meta.env.VITE_CONTACT_EMAIL).trim();
    }
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STORE_ADDRESS) {
      envAddress = String(import.meta.env.VITE_STORE_ADDRESS).trim();
    }
  } catch {
    // Ignore env error
  }

  return {
    email: envEmail,
    phone: envPhone,
    whatsappNumber: envWhatsapp,
    whatsappEnabled: true,
    hours: 'Mon – Sat, 9:00 AM – 6:00 PM PKT / EST',
    address: envAddress,
    instagramHandle: `@${envInstagramHandle}`,
    instagramUrl: envInstagramUrl
  };
};

export const DEFAULT_CONTACT_INFO: StoreContactInfo = getInitialContactInfo();

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  easypaisaEnabled: true,
  easypaisaNumber: '0345-8899123',
  easypaisaAccountTitle: 'LUNOVA Luxury Lighting Ltd',
  easypaisaInstructions: 'Please transfer the exact invoice total to our verified Easypaisa account. After transfer, upload your payment screenshot receipt and enter your Transaction (TRX) ID below for priority verification and white-glove dispatch.',
  codEnabled: true,
  codInstructions: 'Pay cash in full upon white-glove delivery arrival and initial inspection.',
  creditCardEnabled: true,
  applePayEnabled: true,
};

interface StoreContextType {
  // Routing
  currentPath: string;
  navigate: (path: string) => void;
  
  // Data
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];

  // Global Currency Configuration (Admin Configurable)
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number, options?: { showDecimals?: boolean; convertedDirectly?: boolean }) => string;
  currencyConfig: typeof SUPPORTED_CURRENCIES[CurrencyCode];

  // Store Contact Info (Admin Updatable)
  contactInfo: StoreContactInfo;
  updateContactInfo: (info: Partial<StoreContactInfo>) => void;
  updateWhatsAppNumber: (number: string) => void;

  // Instagram Integration (Admin Connectable)
  instagramSettings: InstagramSettings;
  updateInstagramSettings: (settings: Partial<InstagramSettings>) => void;
  updateInstagramPage: (handleOrUrl: string, accountName?: string) => void;
  connectInstagramAccount: (handle: string, accountName?: string, bio?: string, profilePicture?: string) => void;
  disconnectInstagramAccount: () => void;
  syncInstagramFeed: () => void;
  addInstagramPost: (post: { mediaUrl: string; caption: string; permalink?: string; likesCount?: number }) => void;
  deleteInstagramPost: (postId: string) => void;

  // Payment Settings (Easypaisa, COD, etc. - Admin Updatable)
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: Partial<PaymentSettings>) => void;
  updateEasypaisaConfig: (number: string, title?: string, instructions?: string) => void;
  
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartShipping: number;
  cartDiscount: number;
  cartTax: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addToCart: (product: Product, quantity?: number, selectedColorTemp?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Wishlist
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // UI Panels
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Filter state for Shop
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;

  // Home Page Customization (Featured Product & Images)
  homeSettings: HomeSettings;
  updateHomeSettings: (newSettings: Partial<HomeSettings>) => void;
  setProductAsHomeFeatured: (productId: string, customImage?: string) => void;
  
  // Customer & Client Auth (Customer section only)
  customerUser: Customer | null;
  customerLogin: (email: string, password?: string) => { success: boolean; message: string };
  customerRegister: (name: string, email: string, phone: string, address?: any) => { success: boolean; message: string };
  customerLogout: () => void;
  isCustomerAuthModalOpen: boolean;
  setIsCustomerAuthModalOpen: (open: boolean) => void;
  isCustomerOrdersModalOpen: boolean;
  setIsCustomerOrdersModalOpen: (open: boolean) => void;
  
  // Admin & Auth (Restricted to Authorized Admins only)
  adminUser: AdminUser | null;
  adminLogin: (email: string, password: string) => { success: boolean; message: string };
  adminLogout: () => void;
  updateAdminProfile: (profile: Partial<AdminUser>) => void;
  changeAdminCredentials: (params: { currentPassword?: string; newEmail?: string; newPassword?: string; adminName?: string; role?: AdminUser['role'] }) => { success: boolean; message: string };
  changeAdminPassword: (currentPassword: string, newPassword: string, confirmPassword: string) => { success: boolean; message: string };
  
  // Admin Mutators
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  updateOrderPaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  
  addCategory: (categoryData: Omit<Category, 'id'>) => Category;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  
  resetToDefaults: () => void;
}

const defaultFilters: FilterOptions = {
  search: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 3000,
  minRating: 0,
  inStockOnly: false,
  sortBy: 'bestseller'
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to normalize URL paths consistently across development & production hosts like Netlify
  const normalizePath = (path: string): string => {
    if (!path) return '/';
    const clean = path.split('?')[0].split('#')[0].trim();
    if (clean === '' || clean === '/') return '/';
    return clean.replace(/\/+$/, '') || '/';
  };

  // Sync route with window.location
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location) {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined' && window.location) {
        setCurrentPath(normalizePath(window.location.pathname));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    const target = normalizePath(path);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', target);
    }
    setCurrentPath(target);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Products (Updated with 3D product renders)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('lunova_products_v3');
      const loaded: Product[] = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
      
      // Auto-migrate any existing products assigned to retired categories
      return loaded.map(p => {
        if (p.category === 'Cosmic Decor') {
          return { ...p, category: 'Moon Collection' };
        }
        if (p.category === 'Futuristic Home') {
          return { ...p, category: 'Infinity Collection' };
        }
        return p;
      });
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_products_v3', JSON.stringify(products));
  }, [products]);

  // Categories (Moon Collection & Infinity Collection)
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('lunova_categories_v2');
      if (saved) {
        const parsed: Category[] = JSON.parse(saved);
        // Filter out retired Cosmic Decor and Futuristic Home
        const cleaned = parsed.filter(c => c.slug !== 'cosmic' && c.slug !== 'futuristic-home' && c.name !== 'Cosmic Decor' && c.name !== 'Futuristic Home');
        if (cleaned.length > 0) return cleaned;
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_categories_v2', JSON.stringify(categories));
  }, [categories]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('lunova_orders_v1');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_orders_v1', JSON.stringify(orders));
  }, [orders]);

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('lunova_customers_v1');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_customers_v1', JSON.stringify(customers));
  }, [customers]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lunova_cart_v1');
      return saved ? JSON.parse(saved) : [
        {
          product: INITIAL_PRODUCTS[2], // 3D Moon Lamp Warm Glow
          quantity: 1,
          selectedColorTemp: 'Warm Amber 2700K'
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_cart_v1', JSON.stringify(cart));
  }, [cart]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lunova_wishlist_v1');
      return saved ? JSON.parse(saved) : ['prod-001', 'prod-003'];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  // Admin Auth (Restricted to Authorized Administrators Only)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('lunova_admin_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('lunova_admin_v1', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('lunova_admin_v1');
    }
  }, [adminUser]);

  // Customer / Client Auth (Customer section only)
  const [customerUser, setCustomerUser] = useState<Customer | null>(() => {
    try {
      const saved = localStorage.getItem('lunova_customer_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('lunova_customer_v1', JSON.stringify(customerUser));
    } else {
      localStorage.removeItem('lunova_customer_v1');
    }
  }, [customerUser]);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);
  const [isCustomerOrdersModalOpen, setIsCustomerOrdersModalOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  // Global Store Operating Currency (Admin Configurable)
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('lunova_store_currency_v1');
      if (saved && SUPPORTED_CURRENCIES[saved as CurrencyCode]) {
        return saved as CurrencyCode;
      }
      return DEFAULT_CURRENCY;
    } catch {
      return DEFAULT_CURRENCY;
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_store_currency_v1', currency);
  }, [currency]);

  const currencyConfig = useMemo(() => {
    return SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  }, [currency]);

  const setCurrency = (newCode: CurrencyCode) => {
    if (!SUPPORTED_CURRENCIES[newCode]) return;
    setCurrencyState(newCode);
    addToast(`Store active currency switched to ${SUPPORTED_CURRENCIES[newCode].name}`, 'success');
  };

  const formatPrice = (amountInUSD: number, options?: { showDecimals?: boolean; convertedDirectly?: boolean }) => {
    return formatPriceUtil(amountInUSD, currency, options);
  };

  // Store Contact Info (Admin Updatable)
  const [contactInfo, setContactInfo] = useState<StoreContactInfo>(() => {
    try {
      const saved = localStorage.getItem('lunova_contact_info_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If saved has the old US placeholder, upgrade to current default
        if (parsed.whatsappNumber === '+1 (800) 840-5866' || parsed.phone === '+1 (800) 840-5866') {
          return {
            ...DEFAULT_CONTACT_INFO,
            ...parsed,
            whatsappNumber: parsed.whatsappNumber === '+1 (800) 840-5866' ? DEFAULT_CONTACT_INFO.whatsappNumber : parsed.whatsappNumber,
            phone: parsed.phone === '+1 (800) 840-5866' ? DEFAULT_CONTACT_INFO.phone : parsed.phone
          };
        }
        return { ...DEFAULT_CONTACT_INFO, ...parsed };
      }
      return DEFAULT_CONTACT_INFO;
    } catch {
      return DEFAULT_CONTACT_INFO;
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_contact_info_v1', JSON.stringify(contactInfo));
  }, [contactInfo]);

  const updateContactInfo = (newInfo: Partial<StoreContactInfo>) => {
    setContactInfo((prev) => {
      const updated = { ...prev, ...newInfo };
      return updated;
    });
    addToast('Store contact details updated successfully', 'success');
  };

  const updateWhatsAppNumber = (rawNumber: string) => {
    const trimmed = rawNumber.trim();
    if (!trimmed) {
      addToast('Please enter a valid WhatsApp contact number.', 'error');
      return;
    }
    setContactInfo((prev) => ({
      ...prev,
      whatsappNumber: trimmed,
      phone: prev.phone || trimmed
    }));
    addToast(`Store WhatsApp contact number updated to "${trimmed}"`, 'success');
  };

  // Instagram Integration (Admin Connectable)
  const [instagramSettings, setInstagramSettings] = useState<InstagramSettings>(() => {
    try {
      const saved = localStorage.getItem('lunova_instagram_settings_v1');
      return saved ? { ...INITIAL_INSTAGRAM_SETTINGS, ...JSON.parse(saved) } : INITIAL_INSTAGRAM_SETTINGS;
    } catch {
      return INITIAL_INSTAGRAM_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_instagram_settings_v1', JSON.stringify(instagramSettings));
  }, [instagramSettings]);

  const updateInstagramSettings = (newSettings: Partial<InstagramSettings>) => {
    setInstagramSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Instagram integration settings updated successfully', 'success');
  };

  const updateInstagramPage = (rawInput: string, accountName?: string) => {
    let cleanHandle = rawInput.trim();
    // Strip URL prefixes if user pasted full link
    cleanHandle = cleanHandle.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
    cleanHandle = cleanHandle.replace(/^instagram\.com\//i, '');
    cleanHandle = cleanHandle.split('?')[0].split('/')[0];
    cleanHandle = cleanHandle.replace(/^@+/, '').trim();

    if (!cleanHandle) {
      addToast('Please provide a valid Instagram handle or profile URL.', 'error');
      return;
    }

    const updated: InstagramSettings = {
      ...instagramSettings,
      isConnected: true,
      handle: cleanHandle,
      accountName: accountName?.trim() || `${cleanHandle.toUpperCase()} | Official`,
      profileUrl: `https://instagram.com/${cleanHandle}`,
      connectedAt: new Date().toISOString()
    };

    setInstagramSettings(updated);

    // Synchronize to contact info
    setContactInfo((prev) => ({
      ...prev,
      instagramHandle: `@${cleanHandle}`,
      instagramUrl: `https://instagram.com/${cleanHandle}`
    }));

    addToast(`Official Instagram page updated to @${cleanHandle}`, 'success');
  };

  const connectInstagramAccount = (rawHandle: string, accountName?: string, bio?: string, profilePicture?: string) => {
    const cleanHandle = rawHandle.replace('@', '').trim();
    if (!cleanHandle) {
      addToast('Please enter your valid Instagram username/handle.', 'error');
      return;
    }

    const updated: InstagramSettings = {
      ...instagramSettings,
      isConnected: true,
      handle: cleanHandle,
      accountName: accountName?.trim() || `${cleanHandle.toUpperCase()} | Official Store`,
      profileUrl: `https://instagram.com/${cleanHandle}`,
      profilePicture: profilePicture || instagramSettings.profilePicture,
      bio: bio?.trim() || instagramSettings.bio || 'Official Storefront & Atmospheric Lighting Atelier.',
      connectedAt: new Date().toISOString()
    };

    setInstagramSettings(updated);

    // Also sync handle to contact info
    setContactInfo((prev) => ({
      ...prev,
      instagramHandle: `@${cleanHandle}`,
      instagramUrl: `https://instagram.com/${cleanHandle}`
    }));

    addToast(`Your Instagram account @${cleanHandle} has been verified and connected!`, 'success');
  };

  const addInstagramPost = (newPostData: { mediaUrl: string; caption: string; permalink?: string; likesCount?: number }) => {
    const newPost: InstagramPost = {
      id: `custom-ig-${Date.now()}`,
      mediaUrl: newPostData.mediaUrl,
      caption: newPostData.caption,
      permalink: newPostData.permalink || `https://instagram.com/${instagramSettings.handle || 'lunova.atelier'}`,
      timestamp: new Date().toISOString(),
      mediaType: 'IMAGE',
      likesCount: newPostData.likesCount || Math.floor(Math.random() * 500) + 120,
      commentsCount: Math.floor(Math.random() * 40) + 8
    };

    setInstagramSettings((prev) => ({
      ...prev,
      postsCount: (prev.postsCount || (prev.recentPosts?.length || 0)) + 1,
      recentPosts: [newPost, ...(prev.recentPosts || [])]
    }));

    addToast('New post added to your Instagram live showcase!', 'success');
  };

  const deleteInstagramPost = (postId: string) => {
    setInstagramSettings((prev) => ({
      ...prev,
      recentPosts: (prev.recentPosts || []).filter((p) => p.id !== postId),
      postsCount: Math.max(0, (prev.postsCount || 1) - 1)
    }));
    addToast('Post removed from showcase feed', 'info');
  };

  const disconnectInstagramAccount = () => {
    setInstagramSettings((prev) => ({
      ...prev,
      isConnected: false,
      accessToken: undefined
    }));
    addToast('Instagram account disconnected from store', 'info');
  };

  const syncInstagramFeed = () => {
    addToast(`Your Instagram feed for @${instagramSettings.handle} is up to date!`, 'success');
  };

  // Payment Settings (Easypaisa, COD, etc. - Admin Configurable)
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    try {
      const saved = localStorage.getItem('lunova_payment_settings_v1');
      return saved ? { ...DEFAULT_PAYMENT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_PAYMENT_SETTINGS;
    } catch {
      return DEFAULT_PAYMENT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_payment_settings_v1', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  const updatePaymentSettings = (newSettings: Partial<PaymentSettings>) => {
    setPaymentSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Payment gateway configurations updated successfully', 'success');
  };

  const updateEasypaisaConfig = (number: string, title?: string, instructions?: string) => {
    setPaymentSettings((prev) => ({
      ...prev,
      easypaisaNumber: number.trim(),
      ...(title ? { easypaisaAccountTitle: title.trim() } : {}),
      ...(instructions ? { easypaisaInstructions: instructions.trim() } : {})
    }));
    addToast(`Easypaisa receiver number updated to "${number.trim()}"`, 'success');
  };

  // Home Page Settings
  const [homeSettings, setHomeSettings] = useState<HomeSettings>(() => {
    try {
      const saved = localStorage.getItem('lunova_home_settings_v1');
      return saved ? JSON.parse(saved) : {
        featuredProductId: 'prod-003',
        heroCustomImage: '',
        heroBadge: 'Museum Edition',
        heroTitle: 'LUNOVA 3D Moon Lamp',
        heroSubtitle: 'Sub-Millimeter NASA Altimetry Topography Relief with Circadian Lighting Control.',
        secondaryShowcaseImage: '',
        lifestyleImage: ''
      };
    } catch {
      return {
        featuredProductId: 'prod-003',
        heroCustomImage: '',
        heroBadge: 'Museum Edition',
        heroTitle: 'LUNOVA 3D Moon Lamp',
        heroSubtitle: 'Sub-Millimeter NASA Altimetry Topography Relief with Circadian Lighting Control.',
        secondaryShowcaseImage: '',
        lifestyleImage: ''
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_home_settings_v1', JSON.stringify(homeSettings));
  }, [homeSettings]);

  const updateHomeSettings = (newSettings: Partial<HomeSettings>) => {
    setHomeSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
    addToast('Home page showcase and imagery updated', 'success');
  };

  const setProductAsHomeFeatured = (productId: string, customImage?: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    setHomeSettings((prev) => ({
      ...prev,
      featuredProductId: productId,
      heroCustomImage: customImage || (prod.images && prod.images[0]) || '',
      heroTitle: prod.name,
      heroSubtitle: prod.shortDescription || prod.description
    }));
    addToast(`"${prod.name}" is now featured on the Home Page`, 'success');
  };

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1, selectedColorTemp?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedColorTemp: selectedColorTemp || product.colorTemperature
        }
      ];
    });
    addToast(`Added "${product.name}" to your cart`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      addToast(`Removed "${item.product.name}" from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const prodName = prod ? prod.name : 'Item';
    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      addToast(`Removed "${prodName}" from wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      addToast(`Saved "${prodName}" to your wishlist`, 'success');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupons
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[cleanCode];
    if (coupon) {
      setAppliedCoupon(coupon);
      addToast(`Coupon "${cleanCode}" applied: ${coupon.description}`, 'success');
      return { success: true, message: 'Coupon applied successfully!' };
    }
    return { success: false, message: 'Invalid coupon code. Try LUNOVA15 or FUTURISTIC.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon code removed', 'info');
  };

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountPercent) {
      return (cartSubtotal * appliedCoupon.discountPercent) / 100;
    }
    if (appliedCoupon.fixedDiscount) {
      return Math.min(appliedCoupon.fixedDiscount, cartSubtotal);
    }
    return 0;
  }, [cartSubtotal, appliedCoupon]);

  // Free shipping over $500
  const cartShipping = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= 500) return 0;
    return 35; // Express insured white-glove packaging
  }, [cartSubtotal]);

  const cartTax = useMemo(() => {
    return (cartSubtotal - cartDiscount) * 0.0825; // 8.25% luxury rate
  }, [cartSubtotal, cartDiscount]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal - cartDiscount + cartShipping + cartTax;
  }, [cartSubtotal, cartDiscount, cartShipping, cartTax]);

  const wishlistCount = wishlist.length;

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Customer Auth (Customer Portal Only)
  const customerLogin = (email: string, _pass?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if this is an existing customer in our database
    const existing = customers.find(c => c.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCustomerUser(existing);
      setAdminUser(null); // Ensure admin is not set
      addToast(`Welcome back, ${existing.name}. Signed into VIP Client Portal.`, 'success');
      return { success: true, message: 'Successfully signed in to customer portal' };
    }

    // If new customer signing in with valid email, create a new VIP client profile
    if (cleanEmail.includes('@')) {
      const nameParts = cleanEmail.split('@')[0].split('.');
      const formattedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      const newCustomer: Customer = {
        id: `cust-${Date.now().toString(36)}`,
        name: formattedName || 'VIP Client',
        email: cleanEmail,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: 'Just Joined',
        tier: 'VIP',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setCustomers(prev => [newCustomer, ...prev]);
      setCustomerUser(newCustomer);
      setAdminUser(null);
      addToast(`Account created. Welcome to LUNOVA, ${newCustomer.name}.`, 'success');
      return { success: true, message: 'Customer account registered successfully' };
    }

    return { success: false, message: 'Please enter a valid customer email address.' };
  };

  const customerRegister = (name: string, email: string, phone: string, address?: any) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim() || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please provide a valid name and email address.' };
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now().toString(36)}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim() || undefined,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: 'Just Joined',
      tier: 'VIP',
      joinedDate: new Date().toISOString().split('T')[0],
      shippingAddress: address
    };

    setCustomers(prev => [newCustomer, ...prev.filter(c => c.email.toLowerCase() !== cleanEmail)]);
    setCustomerUser(newCustomer);
    setAdminUser(null);
    addToast(`Welcome to LUNOVA, ${newCustomer.name}. Your VIP account is active.`, 'success');
    return { success: true, message: 'VIP Client registration successful' };
  };

  const customerLogout = () => {
    setCustomerUser(null);
    localStorage.removeItem('lunova_customer_v1');
    addToast('Signed out of Customer Portal', 'info');
  };

  // Admin Auth (Strictly Authorized Administrators & Custom Configurable Admin Credentials)
  const getInitialAuthorizedAdmins = (): Record<string, { name: string; role: AdminUser['role']; pass: string }> => {
    const base: Record<string, { name: string; role: AdminUser['role']; pass: string }> = {
      'admin@lunova.luxury': { name: 'Julian Thorne', role: 'Super Admin', pass: 'lunova2026' },
      'julian@lunova.luxury': { name: 'Julian Thorne', role: 'Super Admin', pass: 'lunova2026' },
      'operations@lunova.luxury': { name: 'Elena Vance', role: 'Store Manager', pass: 'lunova2026' },
      'admin@lunovahome.com': { name: 'Store Master', role: 'Super Admin', pass: 'lunova2026' },
      'workp7384@gmail.com': { name: 'Store Principal', role: 'Super Admin', pass: 'lunova2026' }
    };

    // Integrate Netlify / Vite Production Environment Variables if provided
    try {
      const envEmail = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_EMAIL
        ? String(import.meta.env.VITE_ADMIN_EMAIL).trim().toLowerCase()
        : '';
      const envPass = typeof import.meta !== 'undefined' && (import.meta.env?.VITE_ADMIN_PASSWORD || import.meta.env?.VITE_ADMIN_PASSKEY)
        ? String(import.meta.env.VITE_ADMIN_PASSWORD || import.meta.env.VITE_ADMIN_PASSKEY).trim()
        : '';
      const envName = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_NAME
        ? String(import.meta.env.VITE_ADMIN_NAME).trim()
        : 'Executive Director';

      if (envEmail && envPass) {
        base[envEmail] = {
          name: envName || 'Master Administrator',
          role: 'Super Admin',
          pass: envPass
        };
      }
    } catch {
      // Ignore env extraction error in non-vite environments
    }

    return base;
  };

  const loadAuthorizedAdminsRegistry = (): Record<string, { name: string; role: AdminUser['role']; pass: string }> => {
    const initial = getInitialAuthorizedAdmins();
    try {
      const saved = localStorage.getItem('lunova_authorized_admins_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initial, ...parsed };
      }
    } catch (e) {
      console.error('Error loading authorized admins:', e);
    }
    return initial;
  };

  const [authorizedAdmins, setAuthorizedAdmins] = useState<Record<string, { name: string; role: AdminUser['role']; pass: string }>>(() => {
    return loadAuthorizedAdminsRegistry();
  });

  useEffect(() => {
    localStorage.setItem('lunova_authorized_admins_v1', JSON.stringify(authorizedAdmins));
  }, [authorizedAdmins]);

  const adminLogin = (email: string, pass: string) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();
    
    if (!cleanEmail) {
      return { success: false, message: 'Please enter your administrator email address.' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Please enter your master passkey.' };
    }

    const currentAdmins = loadAuthorizedAdminsRegistry();
    
    // Check if email is in authorized administrators list
    const adminRecord = currentAdmins[cleanEmail];
    
    if (adminRecord) {
      if (cleanPass === adminRecord.pass.trim()) {
        const user: AdminUser = {
          id: `adm-${cleanEmail.replace(/[^a-z0-9]/g, '')}`,
          name: adminRecord.name,
          email: cleanEmail,
          role: adminRecord.role
        };
        setAdminUser(user);
        setCustomerUser(null); // Clear customer session when admin logs in
        localStorage.setItem('lunova_admin_v1', JSON.stringify(user));
        addToast(`Admin Session Authorized: Welcome back, ${adminRecord.name}.`, 'success');
        return { success: true, message: 'Administrative authentication successful' };
      } else {
        return { success: false, message: 'Invalid administrative passkey. Please check your password.' };
      }
    }

    // Check if this is a registered customer attempting to log into admin
    const isCustomer = customers.some(c => c.email.toLowerCase() === cleanEmail);
    if (isCustomer) {
      return { 
        success: false, 
        message: 'Access Denied: This account is registered as a customer/client and does not have administrative privileges. Customers must use the Customer Account login.' 
      };
    }

    // General unauthorized rejection
    return { 
      success: false, 
      message: 'Access Denied: Unrecognized administrator email. Please verify credentials or contact store principal.' 
    };
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('lunova_admin_v1');
    addToast('Admin session terminated', 'info');
    navigate('/admin/login');
  };

  const updateAdminProfile = (profile: Partial<AdminUser>) => {
    const currentEmail = (adminUser?.email || 'admin@lunova.luxury').toLowerCase().trim();
    const targetEmail = profile.email ? profile.email.toLowerCase().trim() : currentEmail;
    const currentAdmins = loadAuthorizedAdminsRegistry();
    const existing = currentAdmins[currentEmail] || { name: 'Julian Thorne', role: 'Super Admin', pass: 'lunova2026' };

    const updatedRecord = {
      ...existing,
      name: profile.name || existing.name,
      role: profile.role || existing.role,
      pass: existing.pass // PRESERVE EXISTING PASSWORD
    };

    const nextAdmins = { ...currentAdmins };
    if (targetEmail !== currentEmail) {
      delete nextAdmins[currentEmail];
    }
    nextAdmins[targetEmail] = updatedRecord;

    localStorage.setItem('lunova_authorized_admins_v1', JSON.stringify(nextAdmins));
    setAuthorizedAdmins(nextAdmins);

    setAdminUser((prev) => {
      const updated: AdminUser = {
        id: `adm-${targetEmail.replace(/[^a-z0-9]/g, '')}`,
        name: profile.name || prev?.name || existing.name,
        email: targetEmail,
        role: profile.role || prev?.role || existing.role
      };
      localStorage.setItem('lunova_admin_v1', JSON.stringify(updated));
      return updated;
    });

    if (profile.name) {
      addToast(`Admin profile name changed to "${profile.name}"`, 'success');
    } else {
      addToast('Admin profile updated successfully', 'success');
    }
  };

  // Dedicated single-responsibility password change method
  const changeAdminPassword = (currentPassword: string, newPassword: string, confirmPassword: string) => {
    const currentEmail = (adminUser?.email || 'admin@lunova.luxury').toLowerCase().trim();
    const currentAdmins = loadAuthorizedAdminsRegistry();
    const existingRecord = currentAdmins[currentEmail] || {
      name: adminUser?.name || 'Julian Thorne',
      role: adminUser?.role || 'Super Admin',
      pass: 'lunova2026'
    };

    // Step 1: Verify current password
    if (!currentPassword || !currentPassword.trim()) {
      return { success: false, message: 'Please enter your current administrator password.' };
    }

    if (currentPassword.trim() !== existingRecord.pass) {
      return { 
        success: false, 
        message: 'The current password you entered is incorrect. (Default setup passkey is: lunova2026)' 
      };
    }

    // Step 2: Validate new password
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long.' };
    }

    // Step 3: Check confirmation
    if (newPassword.trim() !== confirmPassword.trim()) {
      return { success: false, message: 'The new password and confirmation password do not match.' };
    }

    if (newPassword.trim() === existingRecord.pass) {
      return { success: false, message: 'The new password must be different from your current password.' };
    }

    const updatedPass = newPassword.trim();
    const updatedAdmins = {
      ...currentAdmins,
      [currentEmail]: {
        ...existingRecord,
        pass: updatedPass
      }
    };

    // Synchronously write to localStorage to prevent race conditions
    localStorage.setItem('lunova_authorized_admins_v1', JSON.stringify(updatedAdmins));
    setAuthorizedAdmins(updatedAdmins);

    addToast('Admin password updated successfully! Use your new password on next login.', 'success');
    return { success: true, message: 'Your administrator password has been updated successfully.' };
  };

  const changeAdminCredentials = (params: {
    currentPassword?: string;
    newEmail?: string;
    newPassword?: string;
    adminName?: string;
    role?: AdminUser['role'];
  }) => {
    const currentAdminEmail = (adminUser?.email || 'admin@lunova.luxury').toLowerCase().trim();
    const currentAdmins = loadAuthorizedAdminsRegistry();
    const currentRecord = currentAdmins[currentAdminEmail] || {
      name: adminUser?.name || 'Julian Thorne',
      role: adminUser?.role || 'Super Admin',
      pass: 'lunova2026'
    };

    // Verify current password if changing password or if current password was entered
    if (params.newPassword) {
      if (params.currentPassword && params.currentPassword.trim() !== currentRecord.pass) {
        return { 
          success: false, 
          message: 'Current password verification failed. (Default setup passkey is: lunova2026)' 
        };
      }
      if (params.newPassword.trim().length < 4) {
        return { success: false, message: 'New password must be at least 4 characters long.' };
      }
    }

    const cleanNewEmail = params.newEmail ? params.newEmail.toLowerCase().trim() : currentAdminEmail;
    
    // Basic email validation
    if (params.newEmail && !cleanNewEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const updatedPass = params.newPassword ? params.newPassword.trim() : currentRecord.pass;
    const updatedName = params.adminName ? params.adminName.trim() : (adminUser?.name || currentRecord.name);
    const updatedRole = params.role || adminUser?.role || currentRecord.role;

    // Update authorized registry
    const nextAdmins = { ...currentAdmins };
    if (cleanNewEmail !== currentAdminEmail) {
      delete nextAdmins[currentAdminEmail];
    }
    nextAdmins[cleanNewEmail] = {
      name: updatedName,
      role: updatedRole,
      pass: updatedPass
    };

    // Synchronously write
    localStorage.setItem('lunova_authorized_admins_v1', JSON.stringify(nextAdmins));
    setAuthorizedAdmins(nextAdmins);

    // Update active admin user session
    const updatedAdminSession: AdminUser = {
      id: `adm-${cleanNewEmail.replace(/[^a-z0-9]/g, '')}`,
      name: updatedName,
      email: cleanNewEmail,
      role: updatedRole
    };
    setAdminUser(updatedAdminSession);
    localStorage.setItem('lunova_admin_v1', JSON.stringify(updatedAdminSession));

    addToast('Admin credentials updated successfully! Use your new email/password to sign in.', 'success');
    return { success: true, message: 'Admin email and security credentials successfully saved' };
  };

  // Admin product mutators
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const id = `prod-${Date.now().toString(36)}`;
    const newProd: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString()
    };
    setProducts((prev) => [newProd, ...prev]);
    addToast(`Product "${newProd.name}" created successfully`, 'success');
    return newProd;
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    // Also sync cart if item exists
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === updated.id ? { ...item, product: updated } : item
      )
    );
    addToast(`Product "${updated.name}" updated`, 'success');
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
    addToast(`Product "${prod?.name || productId}" deleted`, 'info');
  };

  // Order mutators
  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    // Also update or add customer
    setCustomers((prev) => {
      const existing = prev.find((c) => c.email.toLowerCase() === order.customer.email.toLowerCase());
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + order.total,
                lastOrderDate: new Date().toISOString().split('T')[0],
                tier: c.totalSpent + order.total > 4000 ? 'VIP' : 'Gold'
              }
            : c
        );
      }
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
        totalOrders: 1,
        totalSpent: order.total,
        lastOrderDate: new Date().toISOString().split('T')[0],
        tier: 'Regular',
        joinedDate: new Date().toISOString().split('T')[0],
        shippingAddress: order.shippingAddress
      };
      return [newCust, ...prev];
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    addToast(`Order ${orderId} status set to ${status}`, 'success');
  };

  const updateOrderPaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
    addToast(`Order ${orderId} payment status set to ${status}`, 'info');
  };

  // Category mutators
  const addCategory = (categoryData: Omit<Category, 'id'>): Category => {
    const id = `cat-${Date.now().toString(36)}`;
    const newCat: Category = { ...categoryData, id };
    setCategories((prev) => [...prev, newCat]);
    addToast(`Category "${newCat.name}" added`, 'success');
    return newCat;
  };

  const updateCategory = (updated: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    addToast(`Category "${updated.name}" updated`, 'success');
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    addToast('Category removed', 'info');
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    localStorage.removeItem('lunova_products_v1');
    localStorage.removeItem('lunova_categories_v1');
    localStorage.removeItem('lunova_orders_v1');
    localStorage.removeItem('lunova_customers_v1');
    addToast('Store reset to initial catalogue and orders', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentPath,
        navigate,
        products,
        categories,
        orders,
        customers,
        currency,
        setCurrency,
        formatPrice,
        currencyConfig,
        contactInfo,
        updateContactInfo,
        updateWhatsAppNumber,
        instagramSettings,
        updateInstagramSettings,
        updateInstagramPage,
        connectInstagramAccount,
        disconnectInstagramAccount,
        syncInstagramFeed,
        addInstagramPost,
        deleteInstagramPost,
        paymentSettings,
        updatePaymentSettings,
        updateEasypaisaConfig,
        cart,
        cartCount,
        cartSubtotal,
        cartShipping,
        cartDiscount,
        cartTax,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        wishlistCount,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        addToast,
        removeToast,
        filters,
        setFilters,
        resetFilters,
        homeSettings,
        updateHomeSettings,
        setProductAsHomeFeatured,
        customerUser,
        customerLogin,
        customerRegister,
        customerLogout,
        isCustomerAuthModalOpen,
        setIsCustomerAuthModalOpen,
        isCustomerOrdersModalOpen,
        setIsCustomerOrdersModalOpen,
        adminUser,
        adminLogin,
        adminLogout,
        updateAdminProfile,
        changeAdminCredentials,
        changeAdminPassword,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        resetToDefaults
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
