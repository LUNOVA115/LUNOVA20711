import React, { useState } from 'react';
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
  const { currentPath, adminUser } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const isAdminRoute = currentPath.startsWith('/admin');

  // Route Resolver
  const renderRoute = () => {
    // 1. Admin Route Guard & Protection
    if (isAdminRoute) {
      // If admin is not logged in, all /admin and /admin/* routes render AdminLoginPage
      if (!adminUser) {
        return <AdminLoginPage />;
      }

      // Authenticated Admin Routes
      if (currentPath === '/admin' || currentPath === '/admin/dashboard' || currentPath === '/admin/login') {
        return <AdminDashboardPage />;
      }
      if (currentPath === '/admin/products/new') {
        return <AdminProductNewPage />;
      }
      if (currentPath === '/admin/products') {
        return <AdminProductsPage />;
      }
      if (currentPath === '/admin/inventory') {
        return <AdminInventoryPage />;
      }
      if (currentPath === '/admin/orders') {
        return <AdminOrdersPage />;
      }
      if (currentPath === '/admin/customers') {
        return <AdminCustomersPage />;
      }
      if (currentPath === '/admin/categories') {
        return <AdminCategoriesPage />;
      }
      if (currentPath === '/admin/homepage') {
        return <AdminHomepagePage />;
      }
      if (currentPath === '/admin/analytics') {
        return <AdminAnalyticsPage />;
      }
      if (currentPath === '/admin/settings') {
        return <AdminSettingsPage />;
      }
      if (currentPath === '/admin/instagram') {
        return <AdminInstagramPage />;
      }

      // Default to Dashboard for any other /admin sub-route
      return <AdminDashboardPage />;
    }

    // 2. Public Routes
    if (currentPath === '/') {
      return <HomePage />;
    }
    if (currentPath === '/shop') {
      return <ShopPage />;
    }
    if (currentPath === '/flash-deals') {
      return <FlashDealsPage />;
    }
    if (currentPath === '/collections') {
      return <CollectionsPage />;
    }
    if (currentPath === '/collections/moon') {
      return <CollectionDetailPage slug="moon" />;
    }
    if (currentPath === '/collections/infinity') {
      return <CollectionDetailPage slug="infinity" />;
    }
    if (currentPath === '/collections/cosmic') {
      return <CollectionDetailPage slug="cosmic" />;
    }
    if (currentPath === '/collections/futuristic-home') {
      return <CollectionDetailPage slug="futuristic-home" />;
    }
    if (currentPath.startsWith('/product/')) {
      const productId = currentPath.replace('/product/', '');
      return <ProductDetailPage productId={productId} />;
    }
    if (currentPath === '/about') {
      return <AboutPage />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }
    if (currentPath === '/cart') {
      return <CartPage />;
    }
    if (currentPath === '/wishlist') {
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
