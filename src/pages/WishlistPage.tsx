import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, addToCart, toggleWishlist, navigate } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    savedProducts.forEach((p) => {
      if (p.stock > 0) {
        addToCart(p, 1);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 text-zinc-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-300 uppercase tracking-widest mb-1">
            <Heart className="w-3.5 h-3.5 fill-amber-400" />
            <span>SAVED CURATIONS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-white">Your Curated Wishlist</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/shop')}
            className="text-xs uppercase tracking-wider text-zinc-400 hover:text-amber-300 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore More</span>
          </button>

          {savedProducts.length > 0 && (
            <button
              onClick={handleAddAllToCart}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All to Bag</span>
            </button>
          )}
        </div>
      </div>

      {savedProducts.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl bg-zinc-950 border border-zinc-800 max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-light text-white">Your Wishlist is Empty</h2>
          <p className="text-xs text-zinc-400">
            Save your favorite 3D Moon Lamps and Infinity Tables here by clicking the heart icon on any piece.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs uppercase tracking-widest font-bold transition-all shadow-lg"
          >
            Discover Collection
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-xs font-mono text-zinc-400">
            {savedProducts.length} Saved Architectural Piece(s)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
