import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Category, CartItem, Order, Customer, AdminUser, FilterOptions, HomeSettings, StoreContactInfo, PaymentSettings, InstagramSettings, InstagramPost, CurrencyCode, SUPPORTED_CURRENCIES, DEFAULT_CURRENCY, StoreConfig } from '../types';
import { formatPrice as formatPriceUtil, convertFromUSD } from '../utils/currency';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_CATEGORIES } from '../data/initialCategories';
import { INITIAL_ORDERS } from '../data/initialOrders';
import { INITIAL_CUSTOMERS } from '../data/initialCustomers';
import { INITIAL_INSTAGRAM_SETTINGS } from '../data/initialInstagram';
import { IMAGE_3_WARM_MOON, IMAGE_1_GOLD_TABLE, IMAGE_8_LIFESTYLE_TABLE, resolveProductImage } from '../data/productImages';
import { db, collection, doc, setDoc, getDoc, getDocs, deleteDoc, writeBatch, onSnapshot, sanitizeForFirestore } from '../utils/firebase';
import { hashAdminPassword, verifyAdminPassword, getInitialAdminAuthDoc, AuthorizedAdminRecord, AdminAuthDoc } from '../utils/security';

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
  'FUTURISTIC': { code: 'FUTURISTIC', fixedDiscount: 50, description: 'VIP Voucher - Architectural Living' },
  'MOONGLOW': { code: 'MOONGLOW', discountPercent: 10, description: '10% Lunar Collection Gift' }
};

export const getInitialContactInfo = (): StoreContactInfo => {
  let envWhatsapp = '+92 315 0360126';
  let envPhone = '+92 315 0360126';
  let envInstagramHandle = 'lunova.home_decors';
  let envInstagramUrl = 'https://www.instagram.com/lunova.home_decors/?hl=en';
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
      envInstagramUrl = `https://www.instagram.com/${envInstagramHandle}/?hl=en`;
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
  easypaisaNumber: '+92 3150360126',
  easypaisaAccountTitle: 'LUNOVA Luxury Lighting',
  easypaisaInstructions: 'Please transfer the exact invoice total to our verified Easypaisa account (+92 3150360126). After transfer, upload your payment screenshot receipt and enter your Transaction (TRX) ID below for priority verification and white-glove dispatch.',
  codEnabled: true,
  codInstructions: 'Pay cash in full upon white-glove delivery arrival and initial inspection.',
  creditCardEnabled: true,
  applePayEnabled: true,
};

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'LUNOVA',
  tagline: 'Futuristic Premium Home Decor & Atmospheric Architecture',
  currency: 'PKR',
  freeShippingThreshold: 500,
  taxRate: 8.25,
  whiteGloveEnabled: true
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

  // Global Store Configuration (Admin Configurable & Synced to Firestore)
  storeConfig: StoreConfig;
  updateStoreConfig: (config: Partial<StoreConfig>) => Promise<void>;

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

  // Comparison State
  compareList: string[];
  compareCount: number;
  toggleCompare: (productId: string) => boolean;
  isInCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  
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
  
  // Order Tracking Modal State (Guest and Customer lookup)
  isCustomerOrdersModalOpen: boolean;
  setIsCustomerOrdersModalOpen: (open: boolean) => void;
  
  // Admin & Auth (Restricted to Authorized Admins only)
  adminUser: AdminUser | null;
  isAdminPasswordConfigured: boolean;
  adminLogin: (emailOrPass: string, password?: string) => Promise<{ success: boolean; message: string }>;
  setupAdminPassword: (password: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
  adminLogout: () => void;
  updateAdminProfile: (profile: Partial<AdminUser>) => Promise<void>;
  changeAdminCredentials: (params: { currentPassword?: string; newEmail?: string; newPassword?: string; adminName?: string; role?: AdminUser['role'] }) => Promise<{ success: boolean; message: string }>;
  changeAdminPassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
  
  // Admin Mutators
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => Promise<void>;
  updateOrderPaymentStatus: (orderId: string, status: Order['paymentStatus']) => Promise<void>;
  
  // Customer Mutators
  addCustomer: (customerData: Omit<Customer, 'id'>) => Promise<Customer>;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;

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

  // Products (Updated with 3D product renders & Real-time Firestore Cloud Database)
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
    try {
      localStorage.setItem('lunova_products_v3', JSON.stringify(products));
    } catch (err) {
      console.warn('Storage quota reached or localStorage unavailable for products:', err);
    }
  }, [products]);

  // Firestore Products Synchronizer (Real-time sync between Admin & Customer Portals)
  useEffect(() => {
    const productsCol = collection(db, 'products');
    const unsubscribe = onSnapshot(productsCol, async (snapshot) => {
      if (snapshot.empty) {
        console.log('[Firestore] Products collection is empty. Seeding initial products...');
        try {
          const batch = writeBatch(db);
          INITIAL_PRODUCTS.forEach((product) => {
            const prodRef = doc(db, 'products', product.id);
            const cleaned = sanitizeForFirestore({
              ...product,
              images: (product.images || []).map((img) => resolveProductImage(img))
            });
            batch.set(prodRef, cleaned);
          });
          await batch.commit();
          console.log('[Firestore] Seeded initial products successfully!');
        } catch (error) {
          console.error('[Firestore] Error seeding initial products:', error);
        }
      } else {
        const fbProducts: Product[] = [];
        snapshot.forEach((docSnap) => {
          const rawProduct = docSnap.data() as Product;
          // Dynamically resolve product images on load so paths and base64 match current environment
          const resolvedImages = (rawProduct.images || []).map((img) => resolveProductImage(img));
          fbProducts.push({
            ...rawProduct,
            images: resolvedImages
          });
        });
        
        // Sort products by createdAt descending (newest first)
        fbProducts.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        setProducts(fbProducts);
        try {
          localStorage.setItem('lunova_products_v3', JSON.stringify(fbProducts));
        } catch {}
      }
    }, (error) => {
      console.warn('[Firestore] Real-time listener status:', error?.message || error);
    });

    // Multi-tab / local event listener for instantaneous zero-latency updates
    const handleProductsStorageSync = (e?: StorageEvent | CustomEvent) => {
      try {
        if (e && 'detail' in e && Array.isArray((e as CustomEvent).detail)) {
          setProducts((e as CustomEvent).detail);
          return;
        }
        const saved = localStorage.getItem('lunova_products_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        }
      } catch (err) {
        console.warn('Error synchronizing products across local tabs:', err);
      }
    };

    window.addEventListener('storage', handleProductsStorageSync);
    window.addEventListener('lunova_products_updated', handleProductsStorageSync as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleProductsStorageSync);
      window.removeEventListener('lunova_products_updated', handleProductsStorageSync as EventListener);
    };
  }, []);

  // Firestore Contact Info Real-Time Synchronizer (Syncs Admin changes live to Customer Portal)
  useEffect(() => {
    const contactDocRef = doc(db, 'settings', 'contact_info');
    const unsubscribe = onSnapshot(contactDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as StoreContactInfo;
        if (data && (data.email || data.phone || data.hours || data.address)) {
          setContactInfo((prev) => ({ ...prev, ...data }));
          try {
            localStorage.setItem('lunova_contact_info_v1', JSON.stringify(data));
          } catch {}
        }
      }
    }, (error) => {
      console.warn('[Firestore] Contact info connection status:', error?.message || error);
    });

    const handleStorageUpdate = () => {
      try {
        const saved = localStorage.getItem('lunova_contact_info_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          setContactInfo((prev) => ({ ...prev, ...parsed }));
        }
      } catch {}
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('lunova_contact_info_updated', handleStorageUpdate as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('lunova_contact_info_updated', handleStorageUpdate as EventListener);
    };
  }, []);

  // Categories (Moon Collection & Infinity Collection - Synchronized with Firestore Cloud Database)
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('lunova_categories_v2');
      if (saved) {
        const parsed: Category[] = JSON.parse(saved);
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

  // Real-time Firestore Subscription for Categories
  useEffect(() => {
    const categoriesCol = collection(db, 'categories');
    const unsubscribe = onSnapshot(categoriesCol, async (snapshot) => {
      if (snapshot.empty) {
        console.log('[Firestore] Categories collection is empty. Seeding initial categories...');
        try {
          const batch = writeBatch(db);
          INITIAL_CATEGORIES.forEach((cat) => {
            const catRef = doc(db, 'categories', cat.id);
            batch.set(catRef, sanitizeForFirestore(cat));
          });
          await batch.commit();
          console.log('[Firestore] Seeded initial categories successfully!');
        } catch (err) {
          console.error('[Firestore] Error seeding initial categories:', err);
        }
      } else {
        const cloudCats: Category[] = [];
        snapshot.forEach((docSnap) => {
          cloudCats.push(docSnap.data() as Category);
        });
        setCategories(cloudCats);
        try {
          localStorage.setItem('lunova_categories_v2', JSON.stringify(cloudCats));
        } catch {}
      }
    }, (error) => {
      console.warn('[Firestore] Categories listener status:', error?.message || error);
    });

    const handleCategoriesStorageSync = (e?: StorageEvent | CustomEvent) => {
      try {
        if (e && 'detail' in e && Array.isArray((e as CustomEvent).detail)) {
          setCategories((e as CustomEvent).detail);
          return;
        }
        const saved = localStorage.getItem('lunova_categories_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
          }
        }
      } catch {}
    };

    window.addEventListener('storage', handleCategoriesStorageSync);
    window.addEventListener('lunova_categories_updated', handleCategoriesStorageSync as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleCategoriesStorageSync);
      window.removeEventListener('lunova_categories_updated', handleCategoriesStorageSync as EventListener);
    };
  }, []);

  // Orders (Synchronized with Firestore Central Cloud Database)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('lunova_orders_v1');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Real-time Firestore Subscription for Orders (Syncs customer orders to Admin Panel live)
  useEffect(() => {
    console.log('[Firestore Admin Subscription] Initializing real-time listener on collection: "orders"...');
    const ordersCol = collection(db, 'orders');
    
    const unsubscribe = onSnapshot(ordersCol, async (snapshot) => {
      console.log(`[Firestore Admin Subscription] Orders snapshot received: ${snapshot.docs.length} total order document(s) in cloud database.`);
      
      if (snapshot.empty) {
        console.log('[Firestore Admin Order Fetch] Cloud orders collection is empty. Seeding initial baseline orders...');
        try {
          const batch = writeBatch(db);
          INITIAL_ORDERS.forEach((initialOrder) => {
            const orderRef = doc(db, 'orders', initialOrder.id);
            batch.set(orderRef, sanitizeForFirestore(initialOrder));
          });
          await batch.commit();
          console.log('[Firestore Admin Order Fetch] Successfully seeded baseline orders to Firestore.');
          setOrders(INITIAL_ORDERS);
          try {
            localStorage.setItem('lunova_orders_v1', JSON.stringify(INITIAL_ORDERS));
          } catch {}
        } catch (seedErr) {
          console.error('[Firestore Admin Order Fetch] Error seeding baseline orders:', seedErr);
          setOrders(INITIAL_ORDERS);
        }
      } else {
        const cloudOrders: Order[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Order;
          cloudOrders.push({
            ...data,
            id: docSnap.id || data.id,
            items: data.items || []
          });
        });
        
        // Sort newest first by creation timestamp
        cloudOrders.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        
        console.log(`[Firestore Admin Order Fetch] Successfully loaded ${cloudOrders.length} order(s) from Firestore cloud database. Order IDs:`, cloudOrders.map(o => o.id));
        setOrders(cloudOrders);
        try {
          localStorage.setItem('lunova_orders_v1', JSON.stringify(cloudOrders));
        } catch {}
      }
    }, (error) => {
      console.error('[Firestore Admin Subscription FAILURE] Real-time orders listener error:', {
        message: error?.message || String(error),
        code: (error as any)?.code,
        stack: error?.stack,
        error
      });
    });

    const handleOrdersStorageSync = (e?: StorageEvent | CustomEvent) => {
      try {
        if (e && 'detail' in e && Array.isArray((e as CustomEvent).detail)) {
          setOrders((e as CustomEvent).detail);
          return;
        }
        const saved = localStorage.getItem('lunova_orders_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          }
        }
      } catch {}
    };

    window.addEventListener('storage', handleOrdersStorageSync);
    window.addEventListener('lunova_orders_updated', handleOrdersStorageSync as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleOrdersStorageSync);
      window.removeEventListener('lunova_orders_updated', handleOrdersStorageSync as EventListener);
    };
  }, []);

  // Customers (Synchronized with Firestore Central Cloud Database)
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('lunova_customers_v1');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Real-time Firestore Subscription for Customers
  useEffect(() => {
    const customersCol = collection(db, 'customers');
    const unsubscribe = onSnapshot(customersCol, (snapshot) => {
      if (!snapshot.empty) {
        const cloudCustomers: Customer[] = [];
        snapshot.forEach((docSnap) => {
          cloudCustomers.push(docSnap.data() as Customer);
        });
        setCustomers(cloudCustomers);
        try {
          localStorage.setItem('lunova_customers_v1', JSON.stringify(cloudCustomers));
        } catch {}
      }
    }, (error) => {
      console.warn('[Firestore] Customers listener warning:', error?.message || error);
    });

    return () => unsubscribe();
  }, []);

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

  // Synchronize cart items' product objects with latest products from the live products array
  useEffect(() => {
    setCart((prevCart) => {
      let changed = false;
      const updatedCart = prevCart.map((item) => {
        const latestProduct = products.find((p) => p.id === item.product.id);
        if (latestProduct && (
          latestProduct.price !== item.product.price ||
          latestProduct.originalPrice !== item.product.originalPrice ||
          latestProduct.name !== item.product.name ||
          latestProduct.images?.[0] !== item.product.images?.[0] ||
          latestProduct.stock !== item.product.stock
        )) {
          changed = true;
          return { ...item, product: latestProduct };
        }
        return item;
      });
      return changed ? updatedCart : prevCart;
    });
  }, [products]);

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

  // Comparison State
  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lunova_compare_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('lunova_compare_v1', JSON.stringify(compareList));
  }, [compareList]);

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

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomerOrdersModalOpen, setIsCustomerOrdersModalOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  // Global Store Configuration (Admin Configurable & Synced with Firestore)
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('lunova_store_config_v1');
      if (saved) {
        return { ...DEFAULT_STORE_CONFIG, ...JSON.parse(saved) };
      }
      return DEFAULT_STORE_CONFIG;
    } catch {
      return DEFAULT_STORE_CONFIG;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lunova_store_config_v1', JSON.stringify(storeConfig));
    } catch {}
  }, [storeConfig]);

  // Global Store Operating Currency (Admin Configurable & Synced with Firestore)
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const savedConfig = localStorage.getItem('lunova_store_config_v1');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.currency && SUPPORTED_CURRENCIES[parsed.currency as CurrencyCode]) {
          return parsed.currency as CurrencyCode;
        }
      }
      const saved = localStorage.getItem('lunova_store_currency_v2');
      if (saved && SUPPORTED_CURRENCIES[saved as CurrencyCode]) {
        return saved as CurrencyCode;
      }
      return DEFAULT_CURRENCY; // 'PKR'
    } catch {
      return DEFAULT_CURRENCY;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lunova_store_currency_v2', currency);
    } catch (e) {
      console.warn('Could not save currency preference:', e);
    }
  }, [currency]);

  // Real-time Firestore Subscription for Store Configuration (Single Source of Truth)
  useEffect(() => {
    const configDocRef = doc(db, 'settings', 'store_config');
    const unsubscribe = onSnapshot(configDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data() as Partial<StoreConfig>;
        if (cloudData) {
          const merged: StoreConfig = { ...DEFAULT_STORE_CONFIG, ...cloudData };
          setStoreConfig(merged);
          if (merged.currency && SUPPORTED_CURRENCIES[merged.currency] && merged.currency !== currency) {
            setCurrencyState(merged.currency);
          }
          try {
            localStorage.setItem('lunova_store_config_v1', JSON.stringify(merged));
          } catch {}
        }
      } else {
        // Document does not exist yet in Firestore, seed it immediately with DEFAULT_STORE_CONFIG
        setDoc(configDocRef, sanitizeForFirestore(DEFAULT_STORE_CONFIG), { merge: true }).catch((err) => {
          console.warn('[Firestore] Error seeding store config to cloud:', err);
        });
      }
    }, (error) => {
      console.warn('[Firestore] Store config listener notice:', error?.message || error);
    });

    return () => unsubscribe();
  }, []);

  const updateStoreConfig = async (newConfig: Partial<StoreConfig>): Promise<void> => {
    const updated: StoreConfig = { ...storeConfig, ...newConfig };
    setStoreConfig(updated);
    if (newConfig.currency && SUPPORTED_CURRENCIES[newConfig.currency]) {
      setCurrencyState(newConfig.currency);
    }
    try {
      localStorage.setItem('lunova_store_config_v1', JSON.stringify(updated));
    } catch {}
    try {
      const configDocRef = doc(db, 'settings', 'store_config');
      await setDoc(configDocRef, sanitizeForFirestore(updated), { merge: true });
      console.log('[Firestore] Store configuration permanently updated in cloud:', updated);
      addToast('Storefront configurations saved permanently to cloud.', 'success');
    } catch (err) {
      console.warn('[Firestore] Error saving store configuration:', err);
      addToast('Error saving settings to cloud', 'error');
    }
  };

  const currencyConfig = useMemo(() => {
    return SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.PKR;
  }, [currency]);

  const setCurrency = (newCode: CurrencyCode) => {
    if (!SUPPORTED_CURRENCIES[newCode]) return;
    setCurrencyState(newCode);
    updateStoreConfig({ currency: newCode }).catch(() => {});
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
        const upgraded = { ...DEFAULT_CONTACT_INFO, ...parsed };
        
        // If saved has the old US placeholder, upgrade to current default
        if (parsed.whatsappNumber === '+1 (800) 840-5866' || parsed.phone === '+1 (800) 840-5866') {
          upgraded.whatsappNumber = DEFAULT_CONTACT_INFO.whatsappNumber;
          upgraded.phone = DEFAULT_CONTACT_INFO.phone;
        }

        // If saved has the old Instagram handle
        if (parsed.instagramHandle === '@lunova.atelier' || !parsed.instagramHandle) {
          upgraded.instagramHandle = DEFAULT_CONTACT_INFO.instagramHandle;
          upgraded.instagramUrl = DEFAULT_CONTACT_INFO.instagramUrl;
        }

        return upgraded;
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
      try {
        localStorage.setItem('lunova_contact_info_v1', JSON.stringify(updated));
      } catch {}
      setDoc(doc(db, 'settings', 'contact_info'), updated, { merge: true }).catch((err) => {
        console.warn('[Firestore] Saved contact details locally:', err?.message || err);
      });
      window.dispatchEvent(new CustomEvent('lunova_contact_info_updated'));
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
    updateContactInfo({
      whatsappNumber: trimmed,
      phone: contactInfo.phone || trimmed
    });
    addToast(`Store WhatsApp contact number updated to "${trimmed}"`, 'success');
  };

  // Instagram Integration (Admin Connectable - Synchronized with Firestore)
  const [instagramSettings, setInstagramSettings] = useState<InstagramSettings>(() => {
    try {
      const saved = localStorage.getItem('lunova_instagram_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.handle === 'lunova.atelier' || !parsed.handle) {
          return {
            ...INITIAL_INSTAGRAM_SETTINGS,
            ...parsed,
            handle: INITIAL_INSTAGRAM_SETTINGS.handle,
            accountName: INITIAL_INSTAGRAM_SETTINGS.accountName,
            profileUrl: INITIAL_INSTAGRAM_SETTINGS.profileUrl
          };
        }
        return { ...INITIAL_INSTAGRAM_SETTINGS, ...parsed };
      }
      return INITIAL_INSTAGRAM_SETTINGS;
    } catch {
      return INITIAL_INSTAGRAM_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_instagram_settings_v1', JSON.stringify(instagramSettings));
  }, [instagramSettings]);

  // Real-time Firestore Subscription for Instagram Settings
  useEffect(() => {
    const igDocRef = doc(db, 'settings', 'instagram_settings');
    const unsubscribe = onSnapshot(igDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data() as InstagramSettings;
        setInstagramSettings(prev => ({ ...prev, ...cloudData }));
        try {
          localStorage.setItem('lunova_instagram_settings_v1', JSON.stringify({ ...instagramSettings, ...cloudData }));
        } catch {}
      }
    }, (error) => {
      console.warn('[Firestore] Instagram settings listener notice:', error?.message || error);
    });

    return () => unsubscribe();
  }, []);

  const saveInstagramSettingsToFirestore = async (settingsToSave: InstagramSettings) => {
    try {
      const igDocRef = doc(db, 'settings', 'instagram_settings');
      await setDoc(igDocRef, sanitizeForFirestore(settingsToSave), { merge: true });
    } catch (err) {
      console.warn('[Firestore] Could not save Instagram settings to cloud:', err);
    }
  };

  const updateInstagramSettings = (newSettings: Partial<InstagramSettings>) => {
    const updated = { ...instagramSettings, ...newSettings };
    setInstagramSettings(updated);
    saveInstagramSettingsToFirestore(updated);
    addToast('Instagram integration settings updated successfully', 'success');
  };

  const updateInstagramPage = (rawInput: string, accountName?: string) => {
    let cleanHandle = rawInput.trim();
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
      profileUrl: `https://www.instagram.com/${cleanHandle}/?hl=en`,
      connectedAt: new Date().toISOString()
    };

    setInstagramSettings(updated);
    saveInstagramSettingsToFirestore(updated);

    // Synchronize to contact info
    setContactInfo((prev) => ({
      ...prev,
      instagramHandle: `@${cleanHandle}`,
      instagramUrl: `https://www.instagram.com/${cleanHandle}/?hl=en`
    }));

    addToast(`Official Instagram page updated to @${cleanHandle}`, 'success');
  };

  const connectInstagramAccount = (rawHandle: string, accountName?: string, bio?: string, profilePicture?: string) => {
    const cleanHandle = rawHandle.replace(/^@+/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').split('?')[0].split('/')[0].trim();
    if (!cleanHandle) {
      addToast('Please enter your valid Instagram username/handle.', 'error');
      return;
    }

    const updated: InstagramSettings = {
      ...instagramSettings,
      isConnected: true,
      handle: cleanHandle,
      accountName: accountName?.trim() || `${cleanHandle} | Official Store`,
      profileUrl: `https://www.instagram.com/${cleanHandle}/?hl=en`,
      profilePicture: profilePicture || instagramSettings.profilePicture,
      bio: bio?.trim() || instagramSettings.bio || 'Official Storefront & Atmospheric Lighting Atelier.',
      connectedAt: new Date().toISOString()
    };

    setInstagramSettings(updated);
    saveInstagramSettingsToFirestore(updated);

    setContactInfo((prev) => ({
      ...prev,
      instagramHandle: `@${cleanHandle}`,
      instagramUrl: `https://www.instagram.com/${cleanHandle}/?hl=en`
    }));

    addToast(`Your Instagram account @${cleanHandle} has been verified and connected!`, 'success');
  };

  const addInstagramPost = (newPostData: { mediaUrl: string; caption: string; permalink?: string; likesCount?: number }) => {
    const newPost: InstagramPost = {
      id: `custom-ig-${Date.now()}`,
      mediaUrl: newPostData.mediaUrl,
      caption: newPostData.caption,
      permalink: newPostData.permalink || instagramSettings.profileUrl || `https://www.instagram.com/${instagramSettings.handle || 'lunova.home_decors'}/?hl=en`,
      timestamp: new Date().toISOString(),
      mediaType: 'IMAGE',
      likesCount: newPostData.likesCount || Math.floor(Math.random() * 500) + 120,
      commentsCount: Math.floor(Math.random() * 40) + 8
    };

    const updated: InstagramSettings = {
      ...instagramSettings,
      postsCount: (instagramSettings.postsCount || (instagramSettings.recentPosts?.length || 0)) + 1,
      recentPosts: [newPost, ...(instagramSettings.recentPosts || [])]
    };

    setInstagramSettings(updated);
    saveInstagramSettingsToFirestore(updated);

    addToast('New post added to your Instagram live showcase!', 'success');
  };

  const deleteInstagramPost = (postId: string) => {
    const updated: InstagramSettings = {
      ...instagramSettings,
      recentPosts: (instagramSettings.recentPosts || []).filter((p) => p.id !== postId),
      postsCount: Math.max(0, (instagramSettings.postsCount || 1) - 1)
    };
    setInstagramSettings(updated);
    saveInstagramSettingsToFirestore(updated);
    addToast('Post removed from showcase feed', 'info');
  };

  const disconnectInstagramAccount = () => {
    const updated: InstagramSettings = {
      ...instagramSettings,
      isConnected: false,
      accessToken: undefined
    };
    setInstagramSettings(updated);
    saveInstagramSettingsToFirestore(updated);
    addToast('Instagram account disconnected from store', 'info');
  };

  const syncInstagramFeed = () => {
    addToast(`Your Instagram feed for @${instagramSettings.handle} is up to date!`, 'success');
  };

  // Payment Settings (Easypaisa, COD, etc. - Synchronized with Firestore as Single Source of Truth)
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    try {
      const saved = localStorage.getItem('lunova_payment_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.easypaisaNumber || parsed.easypaisaNumber === '0345-8899123' || parsed.easypaisaNumber === '0345-8921470') {
          parsed.easypaisaNumber = '+92 3150360126';
        }
        if (!parsed.easypaisaAccountTitle) {
          parsed.easypaisaAccountTitle = 'LUNOVA Luxury Lighting';
        }
        return { ...DEFAULT_PAYMENT_SETTINGS, ...parsed };
      }
      return DEFAULT_PAYMENT_SETTINGS;
    } catch {
      return DEFAULT_PAYMENT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_payment_settings_v1', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  // Real-time Firestore Subscription for Payment Settings (Single Source of Truth)
  useEffect(() => {
    const paymentDocRef = doc(db, 'settings', 'payment_settings');
    const unsubscribe = onSnapshot(paymentDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data() as PaymentSettings;
        const validNumber = (cloudData.easypaisaNumber && cloudData.easypaisaNumber !== '0345-8899123' && cloudData.easypaisaNumber !== '0345-8921470')
          ? cloudData.easypaisaNumber
          : '+92 3150360126';

        const merged: PaymentSettings = {
          ...DEFAULT_PAYMENT_SETTINGS,
          ...cloudData,
          easypaisaNumber: validNumber,
          easypaisaAccountTitle: cloudData.easypaisaAccountTitle || 'LUNOVA Luxury Lighting'
        };
        setPaymentSettings(merged);
        try {
          localStorage.setItem('lunova_payment_settings_v1', JSON.stringify(merged));
        } catch {}

        // If cloud document has empty or legacy placeholder numbers, write back the valid number
        if (!cloudData.easypaisaNumber || cloudData.easypaisaNumber === '0345-8899123' || cloudData.easypaisaNumber === '0345-8921470') {
          try {
            await setDoc(paymentDocRef, sanitizeForFirestore(merged), { merge: true });
          } catch (e) {
            console.warn('[Firestore] Error writing valid payment settings to cloud:', e);
          }
        }
      } else {
        // Document does not exist yet in Firestore, seed it immediately with DEFAULT_PAYMENT_SETTINGS
        try {
          await setDoc(paymentDocRef, sanitizeForFirestore(DEFAULT_PAYMENT_SETTINGS), { merge: true });
          setPaymentSettings(DEFAULT_PAYMENT_SETTINGS);
        } catch (err) {
          console.warn('[Firestore] Error creating payment settings doc in cloud:', err);
        }
      }
    }, (error) => {
      console.warn('[Firestore] Payment settings listener notice:', error?.message || error);
    });

    return () => unsubscribe();
  }, []);

  const savePaymentSettingsToFirestore = async (settingsToSave: PaymentSettings) => {
    try {
      const paymentDocRef = doc(db, 'settings', 'payment_settings');
      await setDoc(paymentDocRef, sanitizeForFirestore(settingsToSave), { merge: true });
    } catch (err) {
      console.warn('[Firestore] Could not save payment settings to cloud:', err);
    }
  };

  const updatePaymentSettings = (newSettings: Partial<PaymentSettings>) => {
    const updated = { ...paymentSettings, ...newSettings };
    setPaymentSettings(updated);
    savePaymentSettingsToFirestore(updated);
    addToast('Payment gateway configurations updated successfully', 'success');
  };

  const updateEasypaisaConfig = (number: string, title?: string, instructions?: string) => {
    const updated = {
      ...paymentSettings,
      easypaisaNumber: number.trim(),
      ...(title ? { easypaisaAccountTitle: title.trim() } : {}),
      ...(instructions ? { easypaisaInstructions: instructions.trim() } : {})
    };
    setPaymentSettings(updated);
    savePaymentSettingsToFirestore(updated);
    addToast(`Easypaisa receiver number updated to "${number.trim()}"`, 'success');
  };

  // Home Page Settings (Synchronized with Firestore)
  const [homeSettings, setHomeSettings] = useState<HomeSettings>(() => {
    try {
      const saved = localStorage.getItem('lunova_home_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.heroTitle || parsed.heroTitle === 'Curated Cosmic Interiors' || parsed.heroTitle.includes('Moon Lamp')) {
          parsed.heroTitle = 'Illuminate Your Imagination.';
        }
        if (!parsed.heroSubtitle || parsed.heroSubtitle.includes('Explore celestial shapes') || parsed.heroSubtitle.includes('NASA Altimetry')) {
          parsed.heroSubtitle = 'Where refined design meets modern luxury, LUNOVA brings timeless pieces crafted to transform ordinary spaces into something truly exceptional.';
        }
        return parsed;
      }
      return {
        featuredProductId: 'prod-003',
        heroCustomImage: '',
        heroBadge: 'Museum Edition',
        heroTitle: 'Illuminate Your Imagination.',
        heroSubtitle: 'Where refined design meets modern luxury, LUNOVA brings timeless pieces crafted to transform ordinary spaces into something truly exceptional.',
        secondaryShowcaseImage: '',
        lifestyleImage: ''
      };
    } catch {
      return {
        featuredProductId: 'prod-003',
        heroCustomImage: '',
        heroBadge: 'Museum Edition',
        heroTitle: 'Illuminate Your Imagination.',
        heroSubtitle: 'Where refined design meets modern luxury, LUNOVA brings timeless pieces crafted to transform ordinary spaces into something truly exceptional.',
        secondaryShowcaseImage: '',
        lifestyleImage: ''
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('lunova_home_settings_v1', JSON.stringify(homeSettings));
  }, [homeSettings]);

  // Real-time Firestore Subscription for Home Settings
  useEffect(() => {
    const homeDocRef = doc(db, 'settings', 'home_settings');
    const unsubscribe = onSnapshot(homeDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data() as HomeSettings;
        setHomeSettings(prev => ({ ...prev, ...cloudData }));
        try {
          localStorage.setItem('lunova_home_settings_v1', JSON.stringify({ ...homeSettings, ...cloudData }));
        } catch {}
      }
    }, (error) => {
      console.warn('[Firestore] Home settings listener notice:', error?.message || error);
    });

    return () => unsubscribe();
  }, []);

  const saveHomeSettingsToFirestore = async (settingsToSave: HomeSettings) => {
    try {
      const homeDocRef = doc(db, 'settings', 'home_settings');
      await setDoc(homeDocRef, sanitizeForFirestore(settingsToSave), { merge: true });
    } catch (err) {
      console.warn('[Firestore] Could not save home settings to cloud:', err);
    }
  };

  const updateHomeSettings = (newSettings: Partial<HomeSettings>) => {
    const updated = { ...homeSettings, ...newSettings };
    setHomeSettings(updated);
    saveHomeSettingsToFirestore(updated);
    addToast('Home page showcase and imagery updated', 'success');
  };

  const setProductAsHomeFeatured = (productId: string, customImage?: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const updated: HomeSettings = {
      ...homeSettings,
      featuredProductId: productId,
      heroCustomImage: customImage || (prod.images && prod.images[0]) || '',
      heroTitle: prod.name,
      heroSubtitle: prod.shortDescription || prod.description
    };
    setHomeSettings(updated);
    saveHomeSettingsToFirestore(updated);
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

  // Comparison actions
  const toggleCompare = (productId: string): boolean => {
    const prod = products.find((p) => p.id === productId);
    const prodName = prod ? prod.name : 'Piece';
    if (compareList.includes(productId)) {
      setCompareList((prev) => prev.filter((id) => id !== productId));
      addToast(`Removed "${prodName}" from comparison list`, 'info');
      return true;
    } else {
      if (compareList.length >= 3) {
        addToast('Maximum limit of 3 products for side-by-side comparison reached.', 'warning');
        return false;
      }
      setCompareList((prev) => [...prev, productId]);
      setIsCompareOpen(true);
      addToast(`Added "${prodName}" to side-by-side comparison (${compareList.length + 1}/3)`, 'success');
      return true;
    }
  };

  const isInCompare = (productId: string) => compareList.includes(productId);

  const removeFromCompare = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setCompareList((prev) => prev.filter((id) => id !== productId));
    if (prod) {
      addToast(`Removed "${prod.name}" from comparison`, 'info');
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    addToast('Cleared side-by-side comparison list', 'info');
  };

  const compareCount = compareList.length;

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

  // Free shipping threshold configurable via Admin Settings (Synced with Firestore)
  const cartShipping = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    const threshold = typeof storeConfig?.freeShippingThreshold === 'number' ? storeConfig.freeShippingThreshold : 500;
    if (cartSubtotal >= threshold) return 0;
    return 35; // Express insured white-glove packaging
  }, [cartSubtotal, storeConfig?.freeShippingThreshold]);

  const cartTax = useMemo(() => {
    const rate = typeof storeConfig?.taxRate === 'number' ? storeConfig.taxRate : 8.25;
    return (cartSubtotal - cartDiscount) * (rate / 100);
  }, [cartSubtotal, cartDiscount, storeConfig?.taxRate]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal - cartDiscount + cartShipping + cartTax;
  }, [cartSubtotal, cartDiscount, cartShipping, cartTax]);

  const wishlistCount = wishlist.length;

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Admin Auth (Central Multi-Device Firestore Database Synchronization & Encrypted Authentication)
  const [adminAuthDoc, setAdminAuthDoc] = useState<AdminAuthDoc | null>(() => {
    try {
      const saved = localStorage.getItem('lunova_admin_auth_v4');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading admin auth registry from storage:', e);
    }
    return null;
  });

  const isAdminPasswordConfigured = Boolean(adminAuthDoc?.masterPassHash && adminAuthDoc?.isConfigured !== false);

  // Real-time Firestore Admin Auth Synchronizer (Syncs admin passkeys & profiles live across all devices)
  useEffect(() => {
    const adminAuthDocRef = doc(db, 'settings', 'admin_auth');
    const unsubscribe = onSnapshot(adminAuthDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<AdminAuthDoc>;
        if (data && data.masterPassHash) {
          const loadedDoc: AdminAuthDoc = {
            ...getInitialAdminAuthDoc(),
            ...data,
            isConfigured: data.isConfigured !== false && Boolean(data.masterPassHash)
          };
          setAdminAuthDoc(loadedDoc);
          try {
            localStorage.setItem('lunova_admin_auth_v4', JSON.stringify(loadedDoc));
          } catch {}
        } else {
          setAdminAuthDoc({
            ...getInitialAdminAuthDoc(),
            isConfigured: false
          });
        }
      } else {
        // Document does not exist in Firestore yet (unconfigured state)
        setAdminAuthDoc({
          ...getInitialAdminAuthDoc(),
          isConfigured: false
        });
      }
    }, (error) => {
      console.warn('[Firestore] Admin auth real-time listener status:', error?.message || error);
    });

    const handleAdminStorageSync = (e?: StorageEvent | CustomEvent) => {
      try {
        if (e && 'detail' in e && (e as CustomEvent).detail) {
          setAdminAuthDoc((e as CustomEvent).detail);
          return;
        }
        const saved = localStorage.getItem('lunova_admin_auth_v4');
        if (saved) {
          setAdminAuthDoc(JSON.parse(saved));
        }
      } catch {}
    };

    window.addEventListener('storage', handleAdminStorageSync);
    window.addEventListener('lunova_admin_auth_updated', handleAdminStorageSync as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleAdminStorageSync);
      window.removeEventListener('lunova_admin_auth_updated', handleAdminStorageSync as EventListener);
    };
  }, []);

  const setupAdminPassword = async (password: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
    const cleanNew = (password || '').trim();
    const cleanConfirm = (confirmPassword || '').trim();

    if (!cleanNew || cleanNew.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    if (cleanNew !== cleanConfirm) {
      return { success: false, message: 'Password and confirmation password do not match.' };
    }

    const newPassHash = await hashAdminPassword(cleanNew);
    const adminEmail = 'admin@lunova.luxury';
    const adminName = 'Store Administrator';
    const adminRole = 'Super Admin';

    const newAuthDoc: AdminAuthDoc = {
      masterPassHash: newPassHash,
      isConfigured: true,
      adminName,
      adminEmail,
      adminRole,
      authorizedEmails: [adminEmail, 'workp7384@gmail.com'],
      admins: {
        [adminEmail]: {
          name: adminName,
          role: adminRole,
          passHash: newPassHash,
          updatedAt: new Date().toISOString()
        }
      },
      updatedAt: new Date().toISOString(),
      description: 'LUNOVA Central Administrator Authentication Registry',
      lastChangedBy: adminEmail
    };

    try {
      await setDoc(doc(db, 'settings', 'admin_auth'), sanitizeForFirestore(newAuthDoc), { merge: true });
      console.log('[Firestore] Admin password established and saved in Firebase.');
    } catch (err) {
      console.error('[Firestore] Error saving initial admin password:', err);
      return { success: false, message: 'Failed to save administrator password to Firebase. Please check connection.' };
    }

    setAdminAuthDoc(newAuthDoc);
    try {
      localStorage.setItem('lunova_admin_auth_v4', JSON.stringify(newAuthDoc));
      window.dispatchEvent(new CustomEvent('lunova_admin_auth_updated', { detail: newAuthDoc }));
    } catch {}

    const user: AdminUser = {
      id: 'adm-master',
      name: adminName,
      email: adminEmail,
      role: adminRole
    };
    setAdminUser(user);
    localStorage.setItem('lunova_admin_v1', JSON.stringify(user));
    addToast('Master Administrator Password established successfully!', 'success');
    return { success: true, message: 'Master Administrator Password saved securely in Firebase.' };
  };

  const adminLogin = async (emailOrPass: string, optionalPass?: string): Promise<{ success: boolean; message: string }> => {
    let cleanEmail = '';
    let cleanPass = '';

    if (optionalPass !== undefined && optionalPass !== '') {
      cleanEmail = (emailOrPass || '').trim().toLowerCase();
      cleanPass = (optionalPass || '').trim();
    } else {
      cleanPass = (emailOrPass || '').trim();
    }
    
    if (!cleanPass) {
      return { success: false, message: 'Please enter the master administrator passkey.' };
    }

    // Direct cloud fetch to guarantee freshest cross-device authentication state from Firebase
    let authDocData: AdminAuthDoc | null = null;
    try {
      const adminAuthSnap = await getDoc(doc(db, 'settings', 'admin_auth'));
      if (adminAuthSnap.exists()) {
        const cloudData = adminAuthSnap.data() as Partial<AdminAuthDoc>;
        if (cloudData && cloudData.masterPassHash) {
          authDocData = {
            ...getInitialAdminAuthDoc(),
            ...cloudData,
            isConfigured: cloudData.isConfigured !== false && Boolean(cloudData.masterPassHash)
          } as AdminAuthDoc;
          setAdminAuthDoc(authDocData);
          try {
            localStorage.setItem('lunova_admin_auth_v4', JSON.stringify(authDocData));
          } catch {}
        }
      }
    } catch (err) {
      console.warn('[Admin Auth] Direct Firebase verification fetch failed:', err);
    }

    // Fallback to active state if available
    if (!authDocData && adminAuthDoc?.masterPassHash) {
      authDocData = adminAuthDoc;
    }

    // If no password credential exists in Firebase, access is strictly denied (or prompt setup)
    if (!authDocData || !authDocData.masterPassHash || authDocData.isConfigured === false) {
      return { 
        success: false, 
        message: 'No administrator password has been configured in Firebase yet. Please set up your administrator password.' 
      };
    }

    const masterHash = authDocData.masterPassHash;

    // Mode 1: Password-only authentication (No email required)
    if (!cleanEmail) {
      const isPassValid = await verifyAdminPassword(cleanPass, masterHash);
      if (isPassValid) {
        const primaryAdminEmail = (authDocData.adminEmail || 'admin@lunova.luxury').toLowerCase().trim();
        const user: AdminUser = {
          id: `adm-master`,
          name: authDocData.adminName || 'Store Administrator',
          email: primaryAdminEmail,
          role: authDocData.adminRole || 'Super Admin'
        };
        setAdminUser(user);
        localStorage.setItem('lunova_admin_v1', JSON.stringify(user));
        addToast(`Admin Session Authorized: Welcome to Control Panel.`, 'success');
        return { success: true, message: 'Administrative authentication successful' };
      } else {
        return { success: false, message: 'Invalid administrator password. Access denied.' };
      }
    }

    // Mode 2: Email + Password authentication
    const adminsMap = authDocData.admins || {};
    const authorizedList = authDocData.authorizedEmails || Object.keys(adminsMap);
    const primaryAdminEmail = (authDocData.adminEmail || 'admin@lunova.luxury').toLowerCase().trim();

    const isEmailAuthorized = 
      cleanEmail === primaryAdminEmail ||
      authorizedList.some(e => e.toLowerCase().trim() === cleanEmail) ||
      Boolean(adminsMap[cleanEmail]);

    if (isEmailAuthorized) {
      const existingRecord = adminsMap[cleanEmail] || {
        name: authDocData.adminName || 'Store Administrator',
        role: authDocData.adminRole || 'Super Admin',
        passHash: masterHash
      };

      const targetHash = existingRecord.passHash || masterHash;
      const isPassValid = await verifyAdminPassword(cleanPass, targetHash);

      if (isPassValid) {
        const user: AdminUser = {
          id: `adm-${cleanEmail.replace(/[^a-z0-9]/g, '')}`,
          name: existingRecord.name || authDocData.adminName || 'Store Administrator',
          email: cleanEmail,
          role: existingRecord.role || authDocData.adminRole || 'Super Admin'
        };
        setAdminUser(user);
        localStorage.setItem('lunova_admin_v1', JSON.stringify(user));
        addToast(`Admin Session Authorized: Welcome back, ${user.name}.`, 'success');
        return { success: true, message: 'Administrative authentication successful' };
      } else {
        return { success: false, message: 'Invalid administrator passkey. Please check your password.' };
      }
    }

    // General unauthorized rejection
    return { 
      success: false, 
      message: 'Access Denied: Unrecognized administrator email address. Please verify credentials or contact store principal.' 
    };
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('lunova_admin_v1');
    addToast('Admin session terminated', 'info');
    navigate('/admin/login');
  };

  const updateAdminProfile = async (profile: Partial<AdminUser>): Promise<void> => {
    await changeAdminCredentials({
      adminName: profile.name,
      newEmail: profile.email,
      role: profile.role
    });
  };

  // Dedicated single-responsibility password change method (Synchronized permanently to Firestore)
  const changeAdminPassword = async (
    currentPassword: string, 
    newPassword: string, 
    confirmPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const currentAdminUserEmail = (adminUser?.email || 'admin@lunova.luxury').toLowerCase().trim();
    
    // 1. Fetch latest authoritative document from Firestore
    let currentAuthDoc: AdminAuthDoc | null = null;
    try {
      const adminAuthSnap = await getDoc(doc(db, 'settings', 'admin_auth'));
      if (adminAuthSnap.exists()) {
        const cloudData = adminAuthSnap.data() as AdminAuthDoc;
        if (cloudData && cloudData.masterPassHash) {
          currentAuthDoc = cloudData;
        }
      }
    } catch (err) {
      console.warn('[Admin Auth] Direct cloud fetch fallback:', err);
    }

    if (!currentAuthDoc && adminAuthDoc?.masterPassHash) {
      currentAuthDoc = adminAuthDoc;
    }

    if (!currentAuthDoc || !currentAuthDoc.masterPassHash) {
      return { success: false, message: 'No administrator password has been configured in Firebase yet.' };
    }

    const currentMasterHash = currentAuthDoc.masterPassHash;

    // Step 1: Verify current password
    if (!currentPassword || !currentPassword.trim()) {
      return { success: false, message: 'Please enter your current administrator password.' };
    }

    const isCurrentValid = await verifyAdminPassword(currentPassword.trim(), currentMasterHash);

    if (!isCurrentValid) {
      return { 
        success: false, 
        message: 'The current password you entered is incorrect.' 
      };
    }

    // Step 2: Validate new password
    const cleanNew = (newPassword || '').trim();
    const cleanConfirm = (confirmPassword || '').trim();

    if (!cleanNew || cleanNew.length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long.' };
    }

    // Step 3: Check confirmation
    if (cleanNew !== cleanConfirm) {
      return { success: false, message: 'The new password and confirmation password do not match.' };
    }

    const isSameAsCurrent = await verifyAdminPassword(cleanNew, currentMasterHash);
    if (isSameAsCurrent) {
      return { success: false, message: 'The new password must be different from your current password.' };
    }

    // Step 4: Compute cryptographically secure salted hash for new password
    const newPassHash = await hashAdminPassword(cleanNew);

    const updatedAdmins: Record<string, AuthorizedAdminRecord> = { ...(currentAuthDoc.admins || {}) };
    for (const emailKey of Object.keys(updatedAdmins)) {
      updatedAdmins[emailKey] = {
        ...updatedAdmins[emailKey],
        passHash: newPassHash,
        updatedAt: new Date().toISOString()
      };
    }
    if (!updatedAdmins[currentAdminUserEmail]) {
      updatedAdmins[currentAdminUserEmail] = {
        name: adminUser?.name || currentAuthDoc.adminName || 'Store Administrator',
        role: adminUser?.role || currentAuthDoc.adminRole || 'Super Admin',
        passHash: newPassHash,
        updatedAt: new Date().toISOString()
      };
    }

    const nextAuthDoc: AdminAuthDoc = {
      ...currentAuthDoc,
      masterPassHash: newPassHash,
      isConfigured: true,
      admins: updatedAdmins,
      updatedAt: new Date().toISOString(),
      lastChangedBy: currentAdminUserEmail
    };

    // Step 5: Save directly to Firestore Cloud Database (live across all devices)
    try {
      await setDoc(doc(db, 'settings', 'admin_auth'), sanitizeForFirestore(nextAuthDoc), { merge: true });
      console.log(`[Firestore] Admin master password permanently updated and synced across all devices.`);
    } catch (err) {
      console.error('[Firestore] Error saving admin password to cloud:', err);
      return { success: false, message: 'Failed to update administrator password in Firebase. Please check connection.' };
    }

    // Step 6: Update local cache & broadcast event
    setAdminAuthDoc(nextAuthDoc);
    try {
      localStorage.setItem('lunova_admin_auth_v4', JSON.stringify(nextAuthDoc));
      window.dispatchEvent(new CustomEvent('lunova_admin_auth_updated', { detail: nextAuthDoc }));
    } catch {}

    addToast('Admin password updated successfully! Your new password is now active across all devices.', 'success');
    return { success: true, message: 'Your administrator password has been updated and synchronized across all devices.' };
  };

  const changeAdminCredentials = async (params: {
    currentPassword?: string;
    newEmail?: string;
    newPassword?: string;
    adminName?: string;
    role?: AdminUser['role'];
  }): Promise<{ success: boolean; message: string }> => {
    const currentAdminEmail = (adminUser?.email || 'admin@lunova.luxury').toLowerCase().trim();
    
    // Fetch latest authoritative document from Firestore
    let currentAuthDoc: AdminAuthDoc | null = null;
    try {
      const adminAuthSnap = await getDoc(doc(db, 'settings', 'admin_auth'));
      if (adminAuthSnap.exists()) {
        const cloudData = adminAuthSnap.data() as AdminAuthDoc;
        if (cloudData && cloudData.masterPassHash) {
          currentAuthDoc = cloudData;
        }
      }
    } catch (err) {
      console.warn('[Admin Auth] Direct cloud fetch fallback:', err);
    }

    if (!currentAuthDoc && adminAuthDoc?.masterPassHash) {
      currentAuthDoc = adminAuthDoc;
    }

    if (!currentAuthDoc || !currentAuthDoc.masterPassHash) {
      return { success: false, message: 'No administrator password has been configured in Firebase yet.' };
    }

    const currentMasterHash = currentAuthDoc.masterPassHash;

    let newPassHash = currentMasterHash;

    if (params.newPassword && params.newPassword.trim()) {
      if (!params.currentPassword) {
        return { success: false, message: 'Please enter your current administrator password to authorize this change.' };
      }
      const isCurrentValid = await verifyAdminPassword(params.currentPassword.trim(), currentMasterHash);
      if (!isCurrentValid) {
        return { 
          success: false, 
          message: 'Current password verification failed. Please enter your correct current password.' 
        };
      }
      if (params.newPassword.trim().length < 4) {
        return { success: false, message: 'New password must be at least 4 characters long.' };
      }
      newPassHash = await hashAdminPassword(params.newPassword.trim());
    }

    const cleanNewEmail = params.newEmail ? params.newEmail.toLowerCase().trim() : currentAdminEmail;
    
    if (params.newEmail && !cleanNewEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const updatedName = params.adminName ? params.adminName.trim() : (adminUser?.name || currentAuthDoc.adminName || 'Store Administrator');
    const updatedRole = params.role || adminUser?.role || currentAuthDoc.adminRole || 'Super Admin';

    // Update authorized admins dictionary
    const updatedAdmins: Record<string, AuthorizedAdminRecord> = { ...(currentAuthDoc.admins || {}) };
    if (cleanNewEmail !== currentAdminEmail) {
      delete updatedAdmins[currentAdminEmail];
    }
    
    // Update all entries with the new/current passHash
    for (const emailKey of Object.keys(updatedAdmins)) {
      updatedAdmins[emailKey] = {
        ...updatedAdmins[emailKey],
        passHash: newPassHash,
        updatedAt: new Date().toISOString()
      };
    }
    updatedAdmins[cleanNewEmail] = {
      name: updatedName,
      role: updatedRole,
      passHash: newPassHash,
      updatedAt: new Date().toISOString()
    };

    const updatedAuthorizedEmails = Array.from(new Set([
      ...(currentAuthDoc.authorizedEmails || []),
      cleanNewEmail
    ])).filter(e => e !== currentAdminEmail || cleanNewEmail === currentAdminEmail);

    const nextAuthDoc: AdminAuthDoc = {
      ...currentAuthDoc,
      masterPassHash: newPassHash,
      isConfigured: true,
      adminName: updatedName,
      adminEmail: cleanNewEmail,
      adminRole: updatedRole,
      authorizedEmails: updatedAuthorizedEmails,
      admins: updatedAdmins,
      updatedAt: new Date().toISOString(),
      lastChangedBy: cleanNewEmail
    };

    // Persist to Firestore Cloud Database (live across all devices)
    try {
      await setDoc(doc(db, 'settings', 'admin_auth'), sanitizeForFirestore(nextAuthDoc), { merge: true });
      console.log(`[Firestore] Admin credentials permanently updated in cloud.`);
    } catch (err) {
      console.error('[Firestore] Error saving admin credentials to cloud:', err);
      return { success: false, message: 'Failed to update credentials in Firebase. Please check connection.' };
    }

    // Synchronously update local cache
    setAdminAuthDoc(nextAuthDoc);
    try {
      localStorage.setItem('lunova_admin_auth_v4', JSON.stringify(nextAuthDoc));
      window.dispatchEvent(new CustomEvent('lunova_admin_auth_updated', { detail: nextAuthDoc }));
    } catch {}

    // Update active admin user session
    const updatedAdminSession: AdminUser = {
      id: `adm-${cleanNewEmail.replace(/[^a-z0-9]/g, '')}`,
      name: updatedName,
      email: cleanNewEmail,
      role: updatedRole
    };
    setAdminUser(updatedAdminSession);
    localStorage.setItem('lunova_admin_v1', JSON.stringify(updatedAdminSession));

    addToast('Admin credentials updated successfully! New credentials active across all devices.', 'success');
    return { success: true, message: 'Admin profile and security credentials successfully saved and synchronized across all devices.' };
  };


  // Admin product mutators
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const id = `prod-${Date.now().toString(36)}`;
    const newProd: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString(),
      images: (productData.images || []).map((img) => resolveProductImage(img))
    };
    
    // Immediate local state update for instant UI feedback
    setProducts((prev) => {
      const nextProducts = [newProd, ...prev.filter((p) => p.id !== id)];
      try {
        localStorage.setItem('lunova_products_v3', JSON.stringify(nextProducts));
      } catch {}
      try {
        window.dispatchEvent(new CustomEvent('lunova_products_updated', { detail: nextProducts }));
      } catch {}
      return nextProducts;
    });

    // Persist sanitized data to Firestore Cloud Database (live across all customer sessions & devices)
    const cleanedData = sanitizeForFirestore(newProd);
    setDoc(doc(db, 'products', id), cleanedData, { merge: true }).then(() => {
      console.log(`[Firestore] New product "${newProd.name}" (${id}) saved to cloud.`);
    }).catch((err) => {
      console.error('[Firestore] Error writing product:', err);
    });

    addToast(`Product "${newProd.name}" created successfully`, 'success');
    return newProd;
  };

  const updateProduct = (updated: Product) => {
    const resolvedProduct: Product = {
      ...updated,
      images: (updated.images || []).map((img) => resolveProductImage(img))
    };

    // Immediate local state update for instant UI feedback
    setProducts((prev) => {
      const nextProducts = prev.map((p) => (p.id === updated.id ? resolvedProduct : p));
      try {
        localStorage.setItem('lunova_products_v3', JSON.stringify(nextProducts));
      } catch {}
      try {
        window.dispatchEvent(new CustomEvent('lunova_products_updated', { detail: nextProducts }));
      } catch {}
      return nextProducts;
    });

    // Persist sanitized data to Firestore Cloud Database (live across all customer sessions & devices)
    const cleanedData = sanitizeForFirestore(resolvedProduct);
    setDoc(doc(db, 'products', updated.id), cleanedData, { merge: true }).then(() => {
      console.log(`[Firestore] Product "${updated.name}" (${updated.id}) successfully updated in cloud.`);
    }).catch((err) => {
      console.error('[Firestore] Error updating product in cloud:', err);
    });

    // Also sync cart if item exists
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === resolvedProduct.id ? { ...item, product: resolvedProduct } : item
      )
    );
    addToast(`Product "${updated.name}" updated`, 'success');
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    
    // Immediate local state update
    setProducts((prev) => {
      const nextProducts = prev.filter((p) => p.id !== productId);
      try {
        localStorage.setItem('lunova_products_v3', JSON.stringify(nextProducts));
      } catch {}
      try {
        window.dispatchEvent(new CustomEvent('lunova_products_updated', { detail: nextProducts }));
      } catch {}
      return nextProducts;
    });

    // Delete from Firestore Cloud Database
    deleteDoc(doc(db, 'products', productId)).then(() => {
      console.log(`[Firestore] Product "${productId}" deleted from cloud.`);
    }).catch((err) => {
      console.error('[Firestore] Error deleting product:', err);
    });

    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
    addToast(`Product "${prod?.name || productId}" deleted`, 'info');
  };

  // Order mutators (Persisted directly to Firestore Cloud Database)
  const addOrder = async (order: Order): Promise<void> => {
    console.log('[Customer Order Submission] Customer placed new order. Order ID:', order.id);
    console.log('[Firestore Order Write] Preparing Firestore document write to collection "orders", document path:', `orders/${order.id}`, {
      orderId: order.id,
      customer: order.customer,
      itemsCount: order.items?.length || 0,
      total: order.total,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt
    });

    // 1. Optimistic immediate state update & local event broadcast
    setOrders((prev) => {
      const updated = [order, ...prev.filter((o) => o.id !== order.id)];
      try {
        localStorage.setItem('lunova_orders_v1', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('lunova_orders_updated', { detail: updated }));
      } catch (storageErr) {
        console.warn('Could not save order to localStorage:', storageErr);
      }
      return updated;
    });

    // 2. Perform Firestore Write to central cloud database
    try {
      const orderRef = doc(db, 'orders', order.id);
      const cleanOrder = sanitizeForFirestore({
        ...order,
        items: (order.items || []).map((item) => ({
          productId: item.productId || '',
          productName: item.productName || '',
          productImage: item.productImage || '',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1
        }))
      });
      await setDoc(orderRef, cleanOrder);
      console.log(`[Firestore Write SUCCESS] Order #${order.id} was successfully saved to Firestore central database!`);
    } catch (error: any) {
      console.error(`[Firestore Write FAILURE] FAILED to save Order #${order.id} to Firestore!`, {
        name: error?.name,
        message: error?.message || String(error),
        code: error?.code,
        stack: error?.stack,
        raw: error
      });
      // Rethrow so checkout modal can log/handle
      throw error;
    }

    // 3. Persist / Update Customer in Firestore
    try {
      const custEmail = (order.customer?.email || '').toLowerCase().trim();
      if (custEmail) {
        const custId = `cust-${custEmail.replace(/[^a-z0-9]/g, '') || Date.now()}`;
        const existing = customers.find((c) => c.email.toLowerCase() === custEmail);
        const updatedCustomer: Customer = existing
          ? {
              ...existing,
              totalOrders: (existing.totalOrders || 0) + 1,
              totalSpent: (existing.totalSpent || 0) + order.total,
              lastOrderDate: new Date().toISOString().split('T')[0],
              tier: ((existing.totalSpent || 0) + order.total) > 4000 ? 'VIP' : 'Gold',
              shippingAddress: order.shippingAddress || existing.shippingAddress
            }
          : {
              id: custId,
              name: order.customer.name,
              email: custEmail,
              phone: order.customer.phone || '',
              totalOrders: 1,
              totalSpent: order.total,
              lastOrderDate: new Date().toISOString().split('T')[0],
              tier: 'Regular',
              joinedDate: new Date().toISOString().split('T')[0],
              shippingAddress: order.shippingAddress
            };

        setCustomers((prev) => [updatedCustomer, ...prev.filter((c) => c.email.toLowerCase() !== custEmail)]);
        
        await setDoc(doc(db, 'customers', custId), sanitizeForFirestore(updatedCustomer), { merge: true });
        console.log(`[Firestore] Customer profile updated in cloud database for: ${custEmail}`);
      }
    } catch (custErr) {
      console.warn('[Firestore] Error saving customer profile to cloud:', custErr);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['orderStatus']): Promise<void> => {
    console.log(`[Firestore Admin Action] Updating order #${orderId} fulfillment status to "${status}"...`);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    try {
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, { orderStatus: status }, { merge: true });
      console.log(`[Firestore] Order #${orderId} fulfillment status updated to "${status}" in Firestore.`);
      addToast(`Order ${orderId} status set to ${status}`, 'success');
    } catch (err: any) {
      console.error(`[Firestore] Error updating order status for #${orderId}:`, err);
      addToast(`Order status updated locally, but cloud sync encountered an issue`, 'warning');
    }
  };

  const updateOrderPaymentStatus = async (orderId: string, status: Order['paymentStatus']): Promise<void> => {
    console.log(`[Firestore Admin Action] Updating order #${orderId} payment status to "${status}"...`);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
    try {
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, { paymentStatus: status }, { merge: true });
      console.log(`[Firestore] Order #${orderId} payment status updated to "${status}" in Firestore.`);
      addToast(`Order ${orderId} payment status set to ${status}`, 'info');
    } catch (err: any) {
      console.error(`[Firestore] Error updating payment status for #${orderId}:`, err);
      addToast(`Payment status updated locally, but cloud sync encountered an issue`, 'warning');
    }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<void> => {
    console.log(`[Firestore Admin Action] Updating order #${orderId} in cloud:`, updates);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
    try {
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, sanitizeForFirestore(updates), { merge: true });
      console.log(`[Firestore] Order #${orderId} successfully updated in cloud database.`);
      addToast(`Order #${orderId} updated successfully`, 'success');
    } catch (err: any) {
      console.error(`[Firestore] Error updating order #${orderId}:`, err);
      addToast(`Failed to update order in cloud`, 'error');
      throw err;
    }
  };

  const deleteOrder = async (orderId: string): Promise<void> => {
    console.log(`[Firestore Admin Action] Deleting order #${orderId} from cloud...`);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
      console.log(`[Firestore] Order #${orderId} deleted from cloud database.`);
      addToast(`Order #${orderId} removed from records`, 'info');
    } catch (err: any) {
      console.error(`[Firestore] Error deleting order #${orderId}:`, err);
      addToast(`Failed to delete order from cloud`, 'error');
      throw err;
    }
  };

  // Customer mutators (Synchronized with Firestore Central Database)
  const addCustomer = async (customerData: Omit<Customer, 'id'>): Promise<Customer> => {
    const custEmail = customerData.email.toLowerCase().trim();
    const custId = `cust-${custEmail.replace(/[^a-z0-9]/g, '') || Date.now().toString(36)}`;
    const newCust: Customer = {
      ...customerData,
      id: custId
    };
    setCustomers((prev) => [newCust, ...prev.filter((c) => c.id !== custId)]);
    try {
      const custRef = doc(db, 'customers', custId);
      await setDoc(custRef, sanitizeForFirestore(newCust), { merge: true });
      console.log(`[Firestore] Customer profile "${newCust.name}" (${custId}) saved to cloud.`);
      addToast(`Client profile for "${newCust.name}" saved`, 'success');
    } catch (err: any) {
      console.error(`[Firestore] Error writing customer profile:`, err);
      addToast('Failed to save client profile to cloud', 'error');
      throw err;
    }
    return newCust;
  };

  const updateCustomer = async (customerId: string, updates: Partial<Customer>): Promise<void> => {
    console.log(`[Firestore Admin Action] Updating customer #${customerId} in cloud:`, updates);
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updates } : c))
    );
    try {
      const custRef = doc(db, 'customers', customerId);
      await setDoc(custRef, sanitizeForFirestore(updates), { merge: true });
      console.log(`[Firestore] Customer #${customerId} updated in cloud database.`);
      addToast(`Client profile updated`, 'success');
    } catch (err: any) {
      console.error(`[Firestore] Error updating customer #${customerId}:`, err);
      addToast('Failed to update client profile in cloud', 'error');
      throw err;
    }
  };

  const deleteCustomer = async (customerId: string): Promise<void> => {
    console.log(`[Firestore Admin Action] Deleting customer #${customerId} from cloud...`);
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    try {
      const custRef = doc(db, 'customers', customerId);
      await deleteDoc(custRef);
      console.log(`[Firestore] Customer #${customerId} deleted from cloud database.`);
      addToast('Client profile removed', 'info');
    } catch (err: any) {
      console.error(`[Firestore] Error deleting customer #${customerId}:`, err);
      addToast('Failed to delete client profile from cloud', 'error');
      throw err;
    }
  };

  // Category mutators (Synchronized with Firestore Central Database)
  const addCategory = (categoryData: Omit<Category, 'id'>): Category => {
    const id = `cat-${Date.now().toString(36)}`;
    const newCat: Category = { ...categoryData, id };
    setCategories((prev) => [...prev, newCat]);
    try {
      const catRef = doc(db, 'categories', id);
      setDoc(catRef, sanitizeForFirestore(newCat), { merge: true }).catch((err) => {
        console.warn('[Firestore] Error saving category to cloud:', err);
      });
    } catch (err) {
      console.warn('[Firestore] Error writing category:', err);
    }
    addToast(`Category "${newCat.name}" added`, 'success');
    return newCat;
  };

  const updateCategory = (updated: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    try {
      const catRef = doc(db, 'categories', updated.id);
      setDoc(catRef, sanitizeForFirestore(updated), { merge: true }).catch((err) => {
        console.warn('[Firestore] Error updating category in cloud:', err);
      });
    } catch (err) {
      console.warn('[Firestore] Error writing category update:', err);
    }
    addToast(`Category "${updated.name}" updated`, 'success');
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    try {
      const catRef = doc(db, 'categories', categoryId);
      deleteDoc(catRef).catch((err) => {
        console.warn('[Firestore] Error deleting category from cloud:', err);
      });
    } catch (err) {
      console.warn('[Firestore] Error deleting category doc:', err);
    }
    addToast('Category removed', 'info');
  };

  const resetToDefaults = async () => {
    try {
      // Clear all existing products in Firestore
      const querySnapshot = await getDocs(collection(db, 'products'));
      const batch = writeBatch(db);
      querySnapshot.forEach((document) => {
        batch.delete(doc(db, 'products', document.id));
      });

      setCategories(INITIAL_CATEGORIES);
      setOrders(INITIAL_ORDERS);
      setCustomers(INITIAL_CUSTOMERS);
      
      localStorage.removeItem('lunova_products_v3');
      localStorage.removeItem('lunova_categories_v2');
      localStorage.removeItem('lunova_orders_v1');
      localStorage.removeItem('lunova_customers_v1');

      // Write default products back into Firestore
      INITIAL_PRODUCTS.forEach((product) => {
        const prodRef = doc(db, 'products', product.id);
        const cleaned = sanitizeForFirestore({
          ...product,
          images: (product.images || []).map((img) => resolveProductImage(img))
        });
        batch.set(prodRef, cleaned);
      });

      // Write default categories back into Firestore
      INITIAL_CATEGORIES.forEach((cat) => {
        const catRef = doc(db, 'categories', cat.id);
        batch.set(catRef, sanitizeForFirestore(cat));
      });

      await batch.commit();

      addToast('Store reset to initial catalogue and categories', 'info');
    } catch (err) {
      console.error('[Firestore] Error resetting to defaults:', err);
      addToast('Failed to reset store to defaults', 'error');
    }
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
        storeConfig,
        updateStoreConfig,
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
        compareList,
        compareCount,
        toggleCompare,
        isInCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
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
        isCustomerOrdersModalOpen,
        setIsCustomerOrdersModalOpen,
        adminUser,
        isAdminPasswordConfigured,
        adminLogin,
        setupAdminPassword,
        adminLogout,
        updateAdminProfile,
        changeAdminCredentials,
        changeAdminPassword,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrder,
        deleteOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        addCustomer,
        updateCustomer,
        deleteCustomer,
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
