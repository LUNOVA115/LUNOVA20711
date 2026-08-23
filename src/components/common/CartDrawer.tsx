import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Sparkles,
  Truck
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartShipping,
    cartDiscount,
    cartTax,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigate,
    formatPrice
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 500;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onProceedToCheckout();
  };

  const handleViewFullCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col justify-between text-zinc-100 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-wider uppercase font-sans">
                  Acquisition Bag
                </h3>
                <p className="text-xs text-zinc-400">
                  {cartCount} {cartCount === 1 ? 'masterpiece' : 'masterpieces'} reserved
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-zinc-900/60 border-b border-zinc-800/60 text-xs">
            <div className="flex items-center justify-between mb-1.5 text-zinc-300 font-medium">
              <span className="flex items-center space-x-1.5 text-amber-300">
                <Truck className="w-3.5 h-3.5" />
                <span>
                  {remainingForFreeShipping === 0
                    ? 'Complimentary White-Glove Shipping Unlocked!'
                    : `Add ${formatPrice(remainingForFreeShipping)} more for Complimentary Shipping`}
                </span>
              </span>
              <span className="text-zinc-400 font-mono">{progressToFreeShipping.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-zinc-900">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Your Bag is Empty</h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                    Discover illuminated 3D Moon Lamps and infinite mirror portals in our gallery.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 text-xs font-bold uppercase tracking-widest hover:bg-amber-300 transition-all"
                >
                  Explore Curations
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex space-x-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-zinc-900 border border-zinc-800 p-1 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                          {item.selectedColorTemp || item.product.colorTemperature}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono px-1 font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold font-mono text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-800/90 bg-zinc-950 space-y-4">
              
              {/* Promo code bar */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs">
                  <div className="flex items-center space-x-2 text-amber-300">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon: <strong className="font-mono">{appliedCoupon.code}</strong> ({appliedCoupon.description})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-zinc-400 hover:text-white text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo code (e.g. LUNOVA15)"
                    className="flex-grow px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 border-t border-zinc-900 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>VIP Discount</span>
                    <span className="font-mono">-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White-Glove Insured Shipping</span>
                  <span className="font-mono text-zinc-200">
                    {cartShipping === 0 ? <span className="text-emerald-400 uppercase font-semibold">Free</span> : formatPrice(cartShipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8.25%)</span>
                  <span className="font-mono text-zinc-200">{formatPrice(cartTax)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-zinc-800">
                  <span>Estimated Total</span>
                  <span className="font-mono text-amber-300 text-base">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-zinc-950 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 shadow-xl shadow-amber-400/20 hover:from-amber-300 hover:to-amber-200 transition-all transform hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleViewFullCart}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium uppercase tracking-wider transition-colors text-center"
                >
                  View Full Cart & Detailed Specs
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-zinc-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit Encrypted Optical Logistics Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
