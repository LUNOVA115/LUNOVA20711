export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  avatar?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface PriceHistoryRecord {
  id: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  date: string;
  changedBy?: string;
  note?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  stock: number;
  lowStockThreshold?: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  status: 'active' | 'draft' | 'archived';
  specifications: ProductSpecification[];
  dimensions: string;
  material: string;
  powerSource: string;
  lightingType: string;
  colorTemperature: string;
  inBox: string[];
  badge?: string;
  isFlashDeal?: boolean;
  discountPercentage?: number;
  salePrice?: number;
  flashDealEndsAt?: string;
  createdAt: string;
  priceHistory?: PriceHistoryRecord[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  enabled: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColorTemp?: string;
  customEngraving?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface CustomerAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: CustomerAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Klarna' | 'Crypto' | 'Easypaisa' | 'Cash on Delivery';
  createdAt: string;
  trackingNumber?: string;
  carrier?: string;
  paymentReceipt?: string;
  transactionId?: string;
  paymentNotes?: string;
}

export interface PaymentSettings {
  easypaisaEnabled: boolean;
  easypaisaNumber: string;
  easypaisaAccountTitle: string;
  easypaisaInstructions: string;
  codEnabled: boolean;
  codInstructions: string;
  creditCardEnabled: boolean;
  applePayEnabled: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  tier: 'VIP' | 'Gold' | 'Regular';
  joinedDate: string;
  shippingAddress?: CustomerAddress;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Store Manager' | 'Editor';
}

export interface InstagramPost {
  id: string;
  mediaUrl: string;
  caption: string;
  permalink: string;
  timestamp: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  likesCount?: number;
  commentsCount?: number;
}

export interface InstagramSettings {
  isConnected: boolean;
  handle: string;
  accountName?: string;
  profilePicture?: string;
  bio?: string;
  followersCount?: number;
  postsCount?: number;
  profileUrl: string;
  displayFeedOnHome: boolean;
  displayOnFooter: boolean;
  displayOnContact: boolean;
  accessToken?: string;
  connectedAt?: string;
  recentPosts?: InstagramPost[];
}

export interface StoreContactInfo {
  email: string;
  phone: string;
  whatsappNumber?: string;
  whatsappEnabled?: boolean;
  hours?: string;
  address?: string;
  instagramHandle?: string;
  instagramUrl?: string;
}

export interface HomeSettings {
  featuredProductId: string;
  heroCustomImage?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  secondaryShowcaseImage?: string;
  lifestyleImage?: string;
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  currency: import('./currency').CurrencyCode;
  freeShippingThreshold: number;
  taxRate: number;
  whiteGloveEnabled: boolean;
}

export interface FilterOptions {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'bestseller';
}

export * from './currency';
