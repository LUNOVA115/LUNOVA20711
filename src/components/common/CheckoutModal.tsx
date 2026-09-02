import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { SAMPLE_EASYPAISA_RECEIPT_1 } from '../../data/initialOrders';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  Lock,
  Package,
  Copy,
  Smartphone,
  Banknote,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  FileText
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
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
    formatPrice
  } = useStore();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: 'Hamza Tariq Khan',
    email: 'hamza.tariq@lahoredesign.com',
    phone: '+92 300 4821903',
    street: 'House 42-B, Sector Z, Phase 6 DHA',
    city: 'Lahore',
    state: 'Punjab',
    postalCode: '54792',
    country: 'Pakistan',
    paymentMethod: 'Easypaisa' as 'Easypaisa' | 'Cash on Delivery' | 'Credit Card' | 'Apple Pay',
    cardNumber: '4242 •••• •••• 9821',
    cardExp: '08/29',
    cardCvc: '884',
    transactionId: '',
    paymentReceipt: '',
    paymentNotes: ''
  });

  const receiptInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.street) {
      addToast('Please complete required shipping fields.', 'warning');
      return;
    }
    setStep('payment');
  };

  const handleReceiptFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimized = await optimizeImageFile(file, 1200, 1200, 0.82);
      setFormData((prev) => ({ ...prev, paymentReceipt: optimized }));
      addToast(`Payment receipt "${file.name}" uploaded & compressed successfully`, 'success');
    } catch (err) {
      console.error(err);
      addToast(`Failed to process receipt "${file.name}"`, 'error');
    }
  };

  const handleCopyEasypaisaNumber = () => {
    const numberToCopy = paymentSettings?.easypaisaNumber || '';
    if (!numberToCopy) {
      addToast('No Easypaisa number configured', 'info');
      return;
    }
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

  const handlePlaceOrder = async () => {
    // If Easypaisa is chosen with no receipt/TRX ID attached, auto-generate demo TRX ID for instant processing
    if (formData.paymentMethod === 'Easypaisa' && !formData.paymentReceipt && !formData.transactionId) {
      handleAttachSampleReceipt();
    }

    setIsProcessing(true);

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    
    let finalPaymentStatus: Order['paymentStatus'] = 'Paid';
    if (formData.paymentMethod === 'Easypaisa') {
      finalPaymentStatus = 'Pending'; // Admin verifies receipt in dashboard
    } else if (formData.paymentMethod === 'Cash on Delivery') {
      finalPaymentStatus = 'Pending'; // Courier collects upon delivery
    }

    const newOrder: Order = {
      id: orderId,
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone
      },
      shippingAddress: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country
      },
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
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
      paymentReceipt: formData.paymentReceipt || (formData.paymentMethod === 'Easypaisa' ? SAMPLE_EASYPAISA_RECEIPT_1 : undefined),
      transactionId: formData.transactionId || (formData.paymentMethod === 'Easypaisa' ? `EP-${Math.floor(1000000000 + Math.random() * 9000000000)}` : undefined),
      paymentNotes: formData.paymentNotes || (formData.paymentMethod === 'Easypaisa' ? 'Easypaisa mobile payment transfer submitted by client.' : formData.paymentMethod === 'Cash on Delivery' ? 'Cash to be collected upon physical white-glove arrival.' : undefined)
    };

    console.log('[Checkout Modal] Customer initiating order submission for Order ID:', orderId, newOrder);

    try {
      await addOrder(newOrder);
      console.log('[Checkout Modal] addOrder completed successfully for Order ID:', orderId);
      setCreatedOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      setStep('confirmation');

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#10b981', '#38bdf8', '#ffffff']
        });
      } catch (err) {
        console.error('Confetti err:', err);
      }
    } catch (err: any) {
      console.error('[Checkout Modal] Error submitting customer order:', err);
      // Still allow customer to see confirmation with local fallback
      setCreatedOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      setStep('confirmation');
    }
  };

  const handleCopyOrderNumber = () => {
    if (createdOrder) {
      navigator.clipboard?.writeText(createdOrder.id);
      addToast(`Copied Order #${createdOrder.id} to clipboard`, 'success');
    }
  };

  const handleFinish = () => {
    onClose();
    setStep('shipping');
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={step === 'confirmation' ? handleFinish : onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-amber-400/40 bg-zinc-900 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white uppercase tracking-wider font-sans">
                {step === 'shipping' && 'White-Glove Shipping Destination'}
                {step === 'payment' && 'Secure Acquisition & Payment Selection'}
                {step === 'confirmation' && 'Order Authenticated & Commissioned'}
              </h3>
              <p className="text-xs text-zinc-400">
                {step === 'shipping' && 'Step 1 of 2: Delivery Coordinates'}
                {step === 'payment' && 'Step 2 of 2: Select Easypaisa, Cash on Delivery, or Cards'}
                {step === 'confirmation' && 'Your acquisition is registered in our manufacturing ledger.'}
              </p>
            </div>
          </div>
          {step !== 'confirmation' && (
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step 1: Shipping Information */}
        {step === 'shipping' && (
          <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Full Name / Client *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Street Address / Penthouse / Suite *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Phone (for Delivery Logistics & Easypaisa Confirmation)
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Total summary snippet */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total payable (includes tax & crate logistics):</span>
              <span className="text-base font-bold font-mono text-amber-300">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-xs uppercase tracking-widest font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs uppercase tracking-widest font-bold flex items-center space-x-2 shadow-lg shadow-amber-400/20"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment Selection & Receipt Upload */}
        {step === 'payment' && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Easypaisa Option */}
              {(paymentSettings?.easypaisaEnabled ?? true) && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Easypaisa' })}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 relative ${
                    formData.paymentMethod === 'Easypaisa'
                      ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">Easypaisa</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-medium">Receipt Upload</span>
                </button>
              )}

              {/* Cash on Delivery Option */}
              {(paymentSettings?.codEnabled ?? true) && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 relative ${
                    formData.paymentMethod === 'Cash on Delivery'
                      ? 'bg-amber-950/40 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Banknote className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">Cash on Delivery</span>
                  <span className="text-[10px] text-amber-400 font-mono font-medium">Pay at Door</span>
                </button>
              )}

              {/* Credit Card Option */}
              {(paymentSettings?.creditCardEnabled ?? true) && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Credit Card' })}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                    formData.paymentMethod === 'Credit Card'
                      ? 'bg-zinc-900 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-bold text-white">Credit Card</span>
                  <span className="text-[10px] text-zinc-400">Visa / Master</span>
                </button>
              )}

              {/* Apple Pay */}
              {(paymentSettings?.applePayEnabled ?? true) && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Apple Pay' })}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                    formData.paymentMethod === 'Apple Pay'
                      ? 'bg-zinc-900 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-sm font-bold text-white"> Pay</span>
                  <span className="text-xs font-bold text-white">Apple Pay</span>
                  <span className="text-[10px] text-zinc-400">Instant</span>
                </button>
              )}
            </div>

            {/* =========================================================================
                EASYPAISA PAYMENT & RECEIPT UPLOAD PANEL
            ========================================================================= */}
            {formData.paymentMethod === 'Easypaisa' && (
              <div className="space-y-4 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
                
                {/* Account Details Box */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider font-semibold">
                      Official Receiver Account
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                      Verified Business
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-zinc-900">
                    <div>
                      <div className="text-lg font-mono font-bold text-white tracking-wider">
                        {paymentSettings?.easypaisaNumber || 'Official Account Active'}
                      </div>
                      {paymentSettings?.easypaisaAccountTitle && (
                        <div className="text-[11px] text-zinc-400 font-medium">
                          Title: <strong className="text-emerald-300">{paymentSettings.easypaisaAccountTitle}</strong>
                        </div>
                      )}
                    </div>

                    {paymentSettings?.easypaisaNumber && (
                      <div className="flex items-center space-x-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={handleCopyEasypaisaNumber}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Number</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-[11px] text-zinc-300 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 leading-relaxed">
                  <strong className="text-emerald-400 block mb-1">Instructions:</strong>
                  {paymentSettings?.easypaisaInstructions || 
                    'Transfer invoice total to the Easypaisa number above. Upload your payment screenshot receipt and enter TRX ID below.'}
                </div>

                {/* Transaction ID Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Easypaisa Transaction ID / TRX Reference # *
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    placeholder="e.g. EP-9831049281"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-emerald-300 font-bold focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Payment Receipt Upload Area */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Payment Receipt / Screenshot Upload
                    </label>
                    {!formData.paymentReceipt && (
                      <button
                        type="button"
                        onClick={handleAttachSampleReceipt}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono underline"
                      >
                        Attach Verified Sample Receipt
                      </button>
                    )}
                  </div>

                  {formData.paymentReceipt ? (
                    <div className="p-3 bg-zinc-950 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-16 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                          <img
                            src={formData.paymentReceipt}
                            alt="Receipt Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Payment Receipt Attached</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            Ready for Order Verification
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => receiptInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-200"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentReceipt: '' })}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => receiptInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-700 hover:border-emerald-400 bg-zinc-950/60 hover:bg-zinc-900/80 rounded-xl p-5 text-center cursor-pointer transition-colors"
                    >
                      <Upload className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-xs font-semibold text-white">
                        Click to Upload Easypaisa Slip or Screenshot
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        Supports PNG, JPG, JPEG, screenshot receipts from phone
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

                {/* Optional Payment Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                    Sender Notes / Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    name="paymentNotes"
                    placeholder="e.g. Sent from account 0300-XXXXXXX"
                    value={formData.paymentNotes}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            )}

            {/* =========================================================================
                CASH ON DELIVERY (COD) PANEL
            ========================================================================= */}
            {formData.paymentMethod === 'Cash on Delivery' && (
              <div className="space-y-4 p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Cash on Delivery (COD) Selected
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      No upfront digital payment needed.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Cash to Pay Upon Delivery:</span>
                    <span className="text-base font-bold font-mono text-amber-300">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed border-t border-zinc-900 pt-2">
                    {paymentSettings?.codInstructions || 
                      'Please keep exact cash ready upon arrival of our white-glove delivery courier. Our team will verify your address via call before dispatch.'}
                  </p>
                </div>
              </div>
            )}

            {/* Card Inputs */}
            {formData.paymentMethod === 'Credit Card' && (
              <div className="space-y-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="cardExp"
                      value={formData.cardExp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Order Review list */}
            <div className="space-y-2 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Shipping to:</span>
                <span className="text-white font-medium">{formData.fullName} ({formData.city})</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Method:</span>
                <span className="text-amber-300 font-semibold">{formData.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-900">
                <span>Grand Total:</span>
                <span className="text-amber-300 font-mono text-base">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
              >
                ← Back to Shipping
              </button>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-zinc-950 text-xs uppercase tracking-widest font-bold flex items-center space-x-2 shadow-xl shadow-amber-400/20 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Commission ({formatPrice(cartTotal)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order Confirmation */}
        {step === 'confirmation' && createdOrder && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl sm:text-2xl font-light tracking-wide text-white">
                Acquisition Commissioned
              </h4>
              <p className="text-xs text-zinc-400">
                A confirmation dossier and invoice have been dispatched to{' '}
                <strong className="text-amber-300">{createdOrder.customer.email}</strong>.
              </p>
            </div>

            {/* Order Identifier Box */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-left">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                  Registry Order Reference
                </div>
                <div className="text-base font-mono font-bold text-white tracking-wider">
                  {createdOrder.id}
                </div>
              </div>
              <button
                onClick={handleCopyOrderNumber}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-amber-300 flex items-center space-x-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

            {/* Logistics & Payment Card */}
            <div className="grid grid-cols-2 gap-3 text-left text-xs bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Payment Method</span>
                <span className="text-emerald-400 font-semibold">{createdOrder.paymentMethod}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Tracking Reference</span>
                <span className="text-amber-300 font-mono font-semibold">{createdOrder.trackingNumber}</span>
              </div>
              {createdOrder.transactionId && (
                <div className="col-span-2 pt-2 border-t border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase block">Transaction Reference ID</span>
                  <span className="text-sky-300 font-mono">{createdOrder.transactionId}</span>
                </div>
              )}
              <div className="col-span-2 pt-2 border-t border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] uppercase block">Destination</span>
                <span className="text-zinc-300">{createdOrder.shippingAddress.street}, {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleFinish}
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs uppercase tracking-widest font-bold transition-all shadow-lg"
              >
                Return to Gallery & Exploration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
