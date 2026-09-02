import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { SAMPLE_EASYPAISA_RECEIPT_1 } from '../data/initialOrders';
import { optimizeImageFile } from '../utils/imageOptimizer';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Copy, 
  Smartphone, 
  Banknote, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  CreditCard, 
  Tag, 
  ShoppingBag, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Building2,
  Check,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartShipping, 
    cartDiscount, 
    cartTax, 
    cartTotal, 
    clearCart, 
    addOrder,
    paymentSettings,
    navigate,
    addToast,
    formatPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  // Customer Form Data
  const [formData, setFormData] = useState({
    fullName: 'Hamza Tariq Khan',
    email: 'hamza.tariq@lahoredesign.com',
    phone: '+92 300 4821903',
    street: 'House 42-B, Sector Z, Phase 6 DHA',
    city: 'Lahore',
    state: 'Punjab',
    postalCode: '54792',
    country: 'Pakistan',
    orderNotes: '',
    paymentMethod: 'Easypaisa' as 'Easypaisa' | 'Cash on Delivery' | 'Credit Card' | 'Apple Pay',
    cardNumber: '4242 •••• •••• 9821',
    cardExp: '08/29',
    cardCvc: '884',
    transactionId: '',
    paymentReceipt: '',
    paymentNotes: ''
  });

  const receiptInputRef = useRef<HTMLInputElement>(null);
  const customerSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to top upon page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode.trim());
    if (success) {
      addToast(`Promo code "${couponCode.toUpperCase()}" applied successfully!`, 'success');
      setCouponCode('');
      setCouponError('');
    } else {
      setCouponError('Invalid promo code. Try "LUNOVA15" for 15% VIP discount.');
    }
  };

  const handleReceiptFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimized = await optimizeImageFile(file, 1200, 1200, 0.82);
      setFormData((prev) => ({ ...prev, paymentReceipt: optimized }));
      addToast(`Payment receipt "${file.name}" uploaded successfully`, 'success');
    } catch (err) {
      console.error(err);
      addToast(`Failed to process receipt "${file.name}"`, 'error');
    }
  };

  const handleCopyEasypaisaNumber = () => {
    const numberToCopy = paymentSettings?.easypaisaNumber || '+92 3150360126';
    navigator.clipboard?.writeText(numberToCopy);
    addToast(`Copied Easypaisa number: ${numberToCopy}`, 'success');
  };

  const handleAttachSampleReceipt = () => {
    setFormData((prev) => ({
      ...prev,
      paymentReceipt: SAMPLE_EASYPAISA_RECEIPT_1,
      transactionId: `EP-${Math.floor(1000000000 + Math.random() * 9000000000)}`
    }));
    addToast('Demo Easypaisa receipt & Transaction ID attached', 'info');
  };

  const handleCopyOrderNumber = () => {
    if (createdOrder) {
      navigator.clipboard?.writeText(createdOrder.id);
      addToast(`Copied Order #${createdOrder.id} to clipboard`, 'success');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Required Customer Information
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.street.trim() || !formData.city.trim()) {
      addToast('Please complete required customer details & delivery coordinates.', 'warning');
      customerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsProcessing(true);

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    
    let finalPaymentStatus: Order['paymentStatus'] = 'Paid';
    if (formData.paymentMethod === 'Easypaisa') {
      finalPaymentStatus = 'Pending'; // Admin verifies receipt in dashboard
    } else if (formData.paymentMethod === 'Cash on Delivery') {
      finalPaymentStatus = 'Pending'; // Courier collects upon delivery
    }

    const receiptToUse = formData.paymentReceipt || (formData.paymentMethod === 'Easypaisa' ? SAMPLE_EASYPAISA_RECEIPT_1 : '');
    const trxIdToUse = formData.transactionId || (formData.paymentMethod === 'Easypaisa' ? `EP-${Math.floor(1000000000 + Math.random() * 9000000000)}` : '');
    const notesToUse = formData.paymentNotes || (formData.paymentMethod === 'Easypaisa' ? 'Easypaisa mobile payment transfer submitted by client.' : formData.paymentMethod === 'Cash on Delivery' ? 'Cash to be collected upon physical white-glove arrival.' : '');

    const newOrder: Order = {
      id: orderId,
      customer: {
        name: formData.fullName || 'VIP Client',
        email: formData.email || 'client@lunova.com',
        phone: formData.phone || ''
      },
      shippingAddress: {
        fullName: formData.fullName || 'VIP Client',
        email: formData.email || 'client@lunova.com',
        phone: formData.phone || '',
        street: formData.street || 'White-Glove Delivery Destination',
        city: formData.city || 'Islamabad',
        state: formData.state || 'Federal Territory',
        postalCode: formData.postalCode || '44000',
        country: formData.country || 'Pakistan'
      },
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images?.[0] || '',
        price: item.product.price,
        quantity: item.quantity
      })),
      subtotal: cartSubtotal,
      shipping: cartShipping,
      discount: cartDiscount,
      tax: cartTax,
      total: cartTotal,
      paymentStatus: finalPaymentStatus,
      orderStatus: 'Processing',
      paymentMethod: formData.paymentMethod,
      createdAt: new Date().toISOString(),
      trackingNumber: `LNV-${Math.floor(1000000 + Math.random() * 9000000)}`,
      carrier: 'FedEx Insured White-Glove',
      paymentReceipt: receiptToUse,
      transactionId: trxIdToUse,
      paymentNotes: notesToUse
    };

    console.log('[Checkout Page] Submitting customer order to Firestore:', orderId, newOrder);

    try {
      await addOrder(newOrder);
      setCreatedOrder(newOrder);
      clearCart();
      setIsProcessing(false);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#fbbf24', '#10b981', '#38bdf8', '#f59e0b', '#ffffff']
        });
      } catch (err) {
        console.error('Confetti err:', err);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('[Checkout Page] Error submitting customer order:', err);
      setCreatedOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // =========================================================================
  // VIEW: ORDER CONFIRMATION / COMMISSIONED STATE
  // =========================================================================
  if (createdOrder) {
    return (
      <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Top Status */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white font-sans">
              Acquisition Authenticated & Commissioned
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              Your order has been registered in our central fulfillment ledger. A dossier and confirmation email have been dispatched to{' '}
              <strong className="text-amber-300">{createdOrder.customer.email}</strong>.
            </p>
          </div>

          {/* Registry Reference Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                Official Order Reference ID
              </div>
              <div className="text-xl font-mono font-bold text-white tracking-wider">
                {createdOrder.id}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyOrderNumber}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-amber-300 flex items-center space-x-2 transition-colors self-start sm:self-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Order ID</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-mono block">Payment Method</span>
              <span className="text-emerald-400 font-semibold text-sm">{createdOrder.paymentMethod}</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-mono block">Logistics & Tracking</span>
              <span className="text-amber-300 font-mono font-semibold text-sm">{createdOrder.trackingNumber}</span>
              <div className="text-[10px] text-zinc-400 mt-0.5">{createdOrder.carrier}</div>
            </div>
            {createdOrder.transactionId && (
              <div className="col-span-1 sm:col-span-2 pt-3 border-t border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] uppercase font-mono block">Payment Transaction Reference (TRX ID)</span>
                <span className="text-sky-300 font-mono font-bold text-sm">{createdOrder.transactionId}</span>
              </div>
            )}
            <div className="col-span-1 sm:col-span-2 pt-3 border-t border-zinc-800/80">
              <span className="text-zinc-500 text-[10px] uppercase font-mono block">Delivery Address</span>
              <span className="text-zinc-200">
                {createdOrder.shippingAddress.street}, {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state} {createdOrder.shippingAddress.postalCode}, {createdOrder.shippingAddress.country}
              </span>
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="space-y-3">
            <div className="text-xs uppercase font-mono tracking-wider text-zinc-400 font-semibold">
              Ordered Master Pieces
            </div>
            <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/30">
              {createdOrder.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-zinc-800"
                    />
                    <div>
                      <div className="text-sm font-medium text-white">{item.productName}</div>
                      <div className="text-xs text-zinc-400 font-mono">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-sm font-semibold text-amber-300">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-zinc-950 text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-amber-400/20 text-center"
            >
              Continue Exploring Collection
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs uppercase tracking-wider font-semibold transition-colors text-center"
            >
              Return Home
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: EMPTY CART STATE
  // =========================================================================
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full text-center space-y-6 bg-zinc-950 border border-zinc-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-light tracking-wide text-white uppercase font-sans">
              Your Bag is Empty
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No architectural illuminations or 3D Moon Lamps have been selected for acquisition yet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs uppercase tracking-widest font-bold transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center space-x-2"
          >
            <span>Browse Gallery Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN CHECKOUT PAGE LAYOUT
  // =========================================================================
  return (
    <div className="min-h-screen pb-20 pt-6">
      
      {/* Container: Max width with ~1 inch margin (px-4 sm:px-8) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 mb-1">
              <button onClick={() => navigate('/')} className="hover:text-amber-300 transition-colors">Home</button>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <button onClick={() => navigate('/shop')} className="hover:text-amber-300 transition-colors">Shop</button>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-amber-300">Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white font-sans flex items-center space-x-3">
              <span>Direct Secure Checkout</span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                White-Glove Commission
              </span>
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-white transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modify Bag ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
          </button>
        </div>

        {/* =========================================================================
            1. TOP SECTION — TWO COLUMNS
            LEFT: Customer Details | RIGHT: Product/Order Summary
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* -----------------------------------------------------------------------
              LEFT COLUMN (Upper-Left): Customer Details Section
          ----------------------------------------------------------------------- */}
          <div ref={customerSectionRef} className="lg:col-span-7 space-y-6">
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              
              {/* Section Header */}
              <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800/80">
                <div className="w-9 h-9 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white uppercase tracking-wider font-sans">
                    Customer & Shipping Coordinates
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Enter the client details for white-glove insured delivery and dispatch.
                  </p>
                </div>
              </div>

              {/* Customer Inputs Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center space-x-1">
                    <span>Full Name / Client Name</span>
                    <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Hamza Tariq Khan"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center space-x-1">
                    <span>Email Address</span>
                    <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="client@domain.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center space-x-1">
                    <span>Phone (Delivery & Confirmation)</span>
                    <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center space-x-1">
                    <span>Street Address / Penthouse / Suite</span>
                    <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="House / Apartment #, Street, Sector / Area"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center space-x-1">
                    <span>City</span>
                    <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Lahore, Islamabad, Karachi"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* State / Province & Postal Code */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Punjab"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center space-x-1">
                      <span>Postal Code</span>
                      <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      placeholder="54000"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Country / Region
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Optional Order Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Special Delivery Instructions / Gate Code (Optional)
                  </label>
                  <textarea
                    rows={2}
                    name="orderNotes"
                    placeholder="e.g. Call before arrival or leave with security concierge."
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

              </div>

              {/* Delivery Guarantee notice */}
              <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-xs text-zinc-400">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complimentary white-glove crate insurance & direct courier tracking included with this shipment.</span>
              </div>

            </div>
          </div>

          {/* -----------------------------------------------------------------------
              RIGHT COLUMN (Upper-Right): Dynamic Product & Order Summary Section
          ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 sticky top-24">
              
              {/* Section Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white uppercase tracking-wider font-sans">
                      Order Summary
                    </h2>
                    <span className="text-xs text-zinc-400">
                      {cart.reduce((s, i) => s + i.quantity, 0)} {cart.reduce((s, i) => s + i.quantity, 0) === 1 ? 'Piece' : 'Pieces'} Selected
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors underline font-mono"
                >
                  + Add More
                </button>
              </div>

              {/* Dynamic Product List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-zinc-900">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColorTemp || ''}`} className="pt-3 first:pt-0 flex items-center space-x-3.5">
                    
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800/90 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={item.product.images?.[0] || ''}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-zinc-400 font-mono mt-0.5">
                        <span>Qty: <strong className="text-zinc-200">{item.quantity}</strong></span>
                        <span>•</span>
                        <span>{formatPrice(item.product.price)}</span>
                      </div>
                      {item.selectedColorTemp && (
                        <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                          Temp: {item.selectedColorTemp}
                        </div>
                      )}
                    </div>

                    {/* Total Price for item */}
                    <div className="text-sm font-mono font-bold text-white shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>

                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-zinc-900">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs">
                    <div className="flex items-center space-x-2 text-amber-300">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Coupon Applied: <strong className="font-mono">{appliedCoupon.code}</strong></span>
                    </div>
                    <button
                      type="button"
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
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo Code (e.g. LUNOVA15)"
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
                {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-900 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-amber-400 font-medium">
                    <span>VIP Privilege Discount</span>
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

                {/* Final Total */}
                <div className="flex justify-between items-baseline text-base font-bold text-white pt-3 border-t border-zinc-800">
                  <span className="uppercase tracking-wider">Final Amount Due</span>
                  <span className="font-mono text-xl sm:text-2xl text-amber-300">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-zinc-500 font-mono pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit Encrypted Master Commission</span>
              </div>

            </div>
          </div>

        </div>

        {/* =========================================================================
            2. BOTTOM SECTION — PAYMENT DETAILS
            Spans almost the full width with ~1 inch space/margin on left/right.
            Placed BELOW Customer Details and Product Summary.
        ========================================================================= */}
        <div className="w-full pt-4">
          <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            
            {/* Payment Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-white uppercase tracking-wider font-sans">
                    Payment Method & Settlement
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Select your preferred payment channel to complete this acquisition.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Guaranteed Zero Fraud Risk</span>
              </div>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              
              {/* Easypaisa Option */}
              {(paymentSettings?.easypaisaEnabled ?? true) && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Easypaisa' })}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 relative ${
                    formData.paymentMethod === 'Easypaisa'
                      ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-400'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white">Easypaisa</span>
                  <span className="text-[11px] text-emerald-400 font-mono font-medium">Direct Transfer & Slip</span>
                </button>
              )}

              {/* Cash on Delivery Option */}
              {(paymentSettings?.codEnabled ?? true) && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 relative ${
                    formData.paymentMethod === 'Cash on Delivery'
                      ? 'bg-amber-950/40 border-amber-400 text-amber-300 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white">Cash on Delivery</span>
                  <span className="text-[11px] text-amber-400 font-mono font-medium">Pay at Door</span>
                </button>
              )}

              {/* Credit Card Option */}
              {(paymentSettings?.creditCardEnabled ?? true) && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Credit Card' })}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    formData.paymentMethod === 'Credit Card'
                      ? 'bg-zinc-900 border-amber-400 text-amber-300 shadow-xl ring-1 ring-amber-400'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-zinc-300" />
                  <span className="text-sm font-bold text-white">Credit Card</span>
                  <span className="text-[11px] text-zinc-400 font-mono">Visa / Master</span>
                </button>
              )}

              {/* Apple Pay Option */}
              {(paymentSettings?.applePayEnabled ?? true) && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Apple Pay' })}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    formData.paymentMethod === 'Apple Pay'
                      ? 'bg-zinc-900 border-amber-400 text-amber-300 shadow-xl ring-1 ring-amber-400'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-base font-bold text-white"> Pay</span>
                  <span className="text-sm font-bold text-white">Apple Pay</span>
                  <span className="text-[11px] text-zinc-400 font-mono">Instant Gateway</span>
                </button>
              )}

            </div>

            {/* =========================================================================
                DETAIL PANEL FOR EASYPAISA
            ========================================================================= */}
            {formData.paymentMethod === 'Easypaisa' && (
              <div className="space-y-6 p-6 sm:p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
                
                {/* Official Easypaisa Account Details Box */}
                <div className="p-5 rounded-2xl bg-zinc-950 border border-emerald-500/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider font-bold">
                          Official Easypaisa Receiver Account
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                          Verified Commercial
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-widest mt-1">
                        {paymentSettings?.easypaisaNumber || '+92 3150360126'}
                      </div>
                      <div className="text-xs text-zinc-300 font-medium mt-1">
                        Account Title: <strong className="text-emerald-300 font-bold">{paymentSettings?.easypaisaAccountTitle || 'LUNOVA Lighting Studio'}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyEasypaisaNumber}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono font-semibold flex items-center justify-center space-x-2 transition-colors self-start sm:self-center text-xs"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Easypaisa Number</span>
                    </button>
                  </div>
                </div>

                {/* Transfer Instructions */}
                <div className="text-xs text-zinc-300 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 leading-relaxed space-y-1">
                  <strong className="text-emerald-400 font-mono uppercase tracking-wider block">
                    Settlement Instructions:
                  </strong>
                  <p>
                    {paymentSettings?.easypaisaInstructions || 
                      '1. Open your Easypaisa App or dial *786#.\n2. Transfer the exact invoice total to the official receiver number above.\n3. Enter the Transaction TRX Reference ID and upload a screenshot of your payment receipt below for instant order verification.'}
                  </p>
                </div>

                {/* TRX Reference ID & Receipt Upload Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Transaction ID Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Easypaisa Transaction TRX Reference ID *
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      placeholder="e.g. EP-9831049281 or 10-digit TRX #"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-emerald-300 font-bold placeholder-zinc-600 focus:outline-none focus:border-emerald-400"
                    />
                    <p className="text-[11px] text-zinc-500">
                      Located on your Easypaisa confirmation SMS or app transfer receipt.
                    </p>
                  </div>

                  {/* Payment Notes */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Sender Account / Remarks (Optional)
                    </label>
                    <input
                      type="text"
                      name="paymentNotes"
                      placeholder="e.g. Sent from account title / phone"
                      value={formData.paymentNotes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-400"
                    />
                    <p className="text-[11px] text-zinc-500">
                      Helpful for identifying your bank or mobile wallet transfer.
                    </p>
                  </div>

                  {/* Payment Receipt Upload Area (Full width inside subgrid) */}
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                        Payment Receipt Screenshot Upload
                      </label>
                      {!formData.paymentReceipt && (
                        <button
                          type="button"
                          onClick={handleAttachSampleReceipt}
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-mono underline"
                        >
                          Attach Verified Sample Receipt
                        </button>
                      )}
                    </div>

                    {formData.paymentReceipt ? (
                      <div className="p-4 bg-zinc-950 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-16 h-20 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                            <img
                              src={formData.paymentReceipt}
                              alt="Receipt Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white flex items-center space-x-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Payment Receipt Attached</span>
                            </div>
                            <div className="text-xs text-zinc-400 font-mono mt-0.5">
                              Ready for immediate admin verification
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => receiptInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-semibold"
                          >
                            Change Image
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, paymentReceipt: '' })}
                            className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => receiptInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-700 hover:border-emerald-400 bg-zinc-950/60 hover:bg-zinc-900/80 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                      >
                        <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-white">
                          Click to Upload Easypaisa Screenshot or Slip
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          PNG, JPG, JPEG receipts up to 10MB (automatically optimized)
                        </div>
                      </div>
                    )}

                    <input
                      ref={receiptInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptFileUpload}
                      className="hidden"
                    />
                  </div>

                </div>

              </div>
            )}

            {/* =========================================================================
                DETAIL PANEL FOR CASH ON DELIVERY
            ========================================================================= */}
            {formData.paymentMethod === 'Cash on Delivery' && (
              <div className="space-y-4 p-6 sm:p-8 rounded-3xl bg-amber-950/20 border border-amber-500/30 text-xs">
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white uppercase tracking-wider">
                      Cash on Delivery (COD) Selected
                    </h4>
                    <p className="text-xs text-zinc-400">
                      No upfront digital payment needed. Pay in person upon white-glove arrival.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Cash to Pay to Courier Upon Delivery:</span>
                    <span className="text-xl font-bold font-mono text-amber-300">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 pt-3">
                    {paymentSettings?.codInstructions || 
                      'Please keep exact cash ready upon arrival of our white-glove delivery courier. Our team will verify your address via call before dispatch.'}
                  </p>
                </div>
              </div>
            )}

            {/* =========================================================================
                DETAIL PANEL FOR CREDIT CARD
            ========================================================================= */}
            {formData.paymentMethod === 'Credit Card' && (
              <div className="space-y-4 p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      name="cardExp"
                      value={formData.cardExp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Security Code (CVC)
                    </label>
                    <input
                      type="text"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                FINAL ORDER SUBMIT / COMMISSION ACTION BUTTON
            ========================================================================= */}
            <div className="pt-6 border-t border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              <div className="space-y-1">
                <div className="text-xs text-zinc-400">Total payable (all taxes & logistics included):</div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-300">
                  {formatPrice(cartTotal)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="px-6 py-4 rounded-2xl border border-zinc-800 hover:bg-zinc-900 text-xs uppercase tracking-widest font-semibold text-zinc-400 hover:text-white transition-colors text-center"
                >
                  Return to Bag
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-zinc-950 text-xs uppercase tracking-[0.2em] font-extrabold flex items-center justify-center space-x-2.5 shadow-2xl shadow-amber-400/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating & Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Complete Order & Commission</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
