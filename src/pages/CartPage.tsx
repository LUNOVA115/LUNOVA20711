import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Sparkles, 
  Truck,
  ArrowLeft
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    cartShipping, 
    cartDiscount, 
    cartTax, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigate,
    formatPrice
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponCode('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 text-zinc-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-300 uppercase tracking-widest mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ACQUISITION REGISTRY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-white">Your Shopping Bag</h1>
        </div>

        <button
          onClick={() => navigate('/shop')}
          className="text-xs uppercase tracking-wider text-zinc-400 hover:text-amber-300 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Exploration</span>
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl bg-zinc-950 border border-zinc-800 max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-light text-white">Your Bag is Empty</h2>
          <p className="text-xs text-zinc-400">
            You have not yet added any 3D Moon Lamps or Infinity Mirror Tables to your order.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs uppercase tracking-widest font-bold transition-all shadow-lg"
          >
            Explore Catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Items List (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 divide-y divide-zinc-900">
              {cart.map((item) => (
                <div key={item.product.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      onClick={() => navigate(`/product/${item.product.id}`)}
                      className="w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-800 p-2 shrink-0 cursor-pointer overflow-hidden group"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 
                        onClick={() => navigate(`/product/${item.product.id}`)}
                        className="text-sm sm:text-base font-medium text-white hover:text-amber-300 cursor-pointer transition-colors"
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-amber-300/80 font-mono">
                        Illumination: {item.selectedColorTemp || item.product.colorTemperature}
                      </p>
                      <p className="text-xs text-zinc-500 font-mono">
                        Unit Price: {formatPrice(item.product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-900">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-xs text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-base font-bold font-mono text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-zinc-500 hover:text-rose-400 transition-colors p-2"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart link */}
            <div className="flex justify-between items-center px-2">
              <button
                onClick={clearCart}
                className="text-xs text-zinc-500 hover:text-rose-400 underline font-mono"
              >
                Clear entire bag
              </button>
              <span className="text-xs text-zinc-400">{cartCount} Total Item(s)</span>
            </div>
          </div>

          {/* Order Summary & Checkout Box (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6 shadow-2xl">
              <h3 className="text-base font-semibold uppercase tracking-wider text-white">
                Acquisition Summary
              </h3>

              {/* Promo input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-xs">
                  <div className="flex items-center space-x-2 text-amber-300">
                    <Tag className="w-4 h-4" />
                    <div>
                      <div className="font-bold font-mono">{appliedCoupon.code}</div>
                      <div className="text-[10px] opacity-80">{appliedCoupon.description}</div>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="text-zinc-400 hover:text-white text-xs underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. LUNOVA15)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-grow px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white uppercase font-mono placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl uppercase tracking-wider"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
                </form>
              )}

              {/* Pricing Breakdown */}
              <div className="space-y-3 text-xs text-zinc-400 divide-y divide-zinc-900">
                <div className="flex justify-between pt-1">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200 font-semibold">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between pt-3 text-amber-400">
                    <span>VIP Member Savings</span>
                    <span className="font-mono font-semibold">-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3">
                  <span className="flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>White-Glove Crate Delivery</span>
                  </span>
                  <span className="font-mono text-zinc-200 font-semibold">
                    {cartShipping === 0 ? <span className="text-emerald-400 uppercase">Complimentary</span> : formatPrice(cartShipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-3">
                  <span>Estimated Tax (8.25%)</span>
                  <span className="font-mono text-zinc-200 font-semibold">{formatPrice(cartTax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-4 border-t border-zinc-800">
                  <span>Total Due</span>
                  <span className="font-mono text-amber-300 text-lg">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-zinc-950 text-xs uppercase tracking-[0.2em] font-extrabold flex items-center justify-center space-x-2 shadow-xl shadow-amber-400/20 hover:scale-[1.01] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-zinc-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit Encrypted Master Fulfillment</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
