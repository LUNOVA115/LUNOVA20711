import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchBarModal } from './components/common/SearchBarModal';
import { CheckoutModal } from './components/common/CheckoutModal';
import { CustomerAuthModal } from './components/common/CustomerAuthModal';
import { CustomerOrdersModal } from './components/common/CustomerOrdersModal';
import { CustomerFloatingContactWidget } from './components/common/CustomerFloatingContactWidget';
import { ComparePanel } from './components/common/ComparePanel';


// Public Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { FlashDealsPage } from './pages/FlashDealsPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductNewPage } from './pages/admin/AdminProductNewPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminHomepagePage } from './pages/admin/AdminHomepagePage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminInstagramPage } from './pages/admin/AdminInstagramPage';

const AppContent: React.FC = () => {
  const { currentPath, adminUser, navigate } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Normalize path by stripping query params, hash and trailing slashes
  const normalizedPath = (currentPath || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  const isAdminRoute = normalizedPath === '/admin' || normalizedPath.startsWith('/admin/');

  // Route Resolver
  const renderRoute = () => {
    // 1. Admin Route Guard & Protection
    if (isAdminRoute) {
      // If admin is not logged in, all /admin and /admin/* routes render AdminLoginPage
      if (!adminUser) {
        return <AdminLoginPage />;
      }

      // Authenticated Admin Routes
      if (normalizedPath === '/admin' || normalizedPath === '/admin/dashboard' || normalizedPath === '/admin/login') {
        return <AdminDashboardPage />;
      }
      if (normalizedPath === '/admin/products/new') {
        return <AdminProductNewPage />;
      }
      if (normalizedPath === '/admin/products') {
        return <AdminProductsPage />;
      }
      if (normalizedPath === '/admin/inventory') {
        return <AdminInventoryPage />;
      }
      if (normalizedPath === '/admin/orders') {
        return <AdminOrdersPage />;
      }
      if (normalizedPath === '/admin/customers') {
        return <AdminCustomersPage />;
      }
      if (normalizedPath === '/admin/categories') {
        return <AdminCategoriesPage />;
      }
      if (normalizedPath === '/admin/homepage') {
        return <AdminHomepagePage />;
      }
      if (normalizedPath === '/admin/analytics') {
        return <AdminAnalyticsPage />;
      }
      if (normalizedPath === '/admin/settings') {
        return <AdminSettingsPage />;
      }
      if (normalizedPath === '/admin/instagram') {
        return <AdminInstagramPage />;
      }

      // Default to Dashboard for any other /admin sub-route
      return <AdminDashboardPage />;
    }

    // 2. Public Routes
    if (normalizedPath === '/') {
      return <HomePage />;
    }
    if (normalizedPath === '/shop') {
      return <ShopPage />;
    }
    if (normalizedPath === '/flash-deals') {
      return <FlashDealsPage />;
    }
    if (normalizedPath === '/collections') {
      return <CollectionsPage />;
    }
    if (normalizedPath === '/collections/moon') {
      return <CollectionDetailPage slug="moon" />;
    }
    if (normalizedPath === '/collections/infinity') {
      return <CollectionDetailPage slug="infinity" />;
    }
    if (normalizedPath === '/collections/cosmic') {
      return <CollectionDetailPage slug="cosmic" />;
    }
    if (normalizedPath === '/collections/futuristic-home') {
      return <CollectionDetailPage slug="futuristic-home" />;
    }
    if (normalizedPath.startsWith('/product/')) {
      const productId = normalizedPath.replace('/product/', '');
      return <ProductDetailPage productId={productId} />;
    }
    if (normalizedPath === '/about') {
      return <AboutPage />;
    }
    if (normalizedPath === '/contact') {
      return <ContactPage />;
    }
    if (normalizedPath === '/cart') {
      return <CartPage />;
    }
    if (normalizedPath === '/wishlist') {
      return <WishlistPage />;
    }

    // Fallback to Home if unknown route
    return <HomePage />;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950 transition-colors duration-300">
      
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Search Bar Modal */}
      <SearchBarModal />

      {/* Customer VIP Auth & Portal Modals */}
      <CustomerAuthModal />
      <CustomerOrdersModal />

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      {/* Global Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Public Navigation */}
      {!isAdminRoute && <Navbar />}

      {/* Active Page View */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Customer Floating WhatsApp & Instagram Contact Widget */}
      {!isAdminRoute && <CustomerFloatingContactWidget />}

      {/* Side-by-Side Product Comparison Panel */}
      {!isAdminRoute && <ComparePanel />}



      {/* Public Footer */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ThemeProvider>
  );
}
