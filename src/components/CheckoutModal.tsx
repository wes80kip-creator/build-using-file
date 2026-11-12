import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, Order } from '../types';
import {
  X,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Wallet,
  CheckCircle2,
  Lock,
  Tag,
  Loader2,
  Receipt,
  Download,
  AlertCircle,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    checkoutItem,
    isCheckoutOpen,
    closeCheckout,
    currency,
    formatPrice,
    convertPrice,
    createOrderFromCheckout,
    user,
    setActiveOrder,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState('');

  // M-Pesa Form State
  const [mpesaPhone, setMpesaPhone] = useState('254712345678');
  const [isProcessingMpesa, setIsProcessingMpesa] = useState(false);
  const [mpesaCountdown, setMpesaCountdown] = useState(20);
  const [mpesaStage, setMpesaStage] = useState<'idle' | 'push_sent' | 'pin_prompt' | 'success'>('idle');

  // Stripe Card State
  const [cardName, setCardName] = useState(user.name);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');
  const [isProcessingCard, setIsProcessingCard] = useState(false);

  // PayPal State
  const [isProcessingPaypal, setIsProcessingPaypal] = useState(false);

  // Success Confirmation State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mpesaStage === 'push_sent' && mpesaCountdown > 0) {
      timer = setTimeout(() => {
        setMpesaCountdown(prev => prev - 1);
        if (mpesaCountdown === 15) {
          setMpesaStage('pin_prompt');
        }
      }, 1000);
    } else if (mpesaStage === 'pin_prompt' && mpesaCountdown > 0) {
      timer = setTimeout(() => {
        setMpesaCountdown(prev => prev - 1);
        if (mpesaCountdown <= 5) {
          completeMpesaPayment();
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [mpesaStage, mpesaCountdown]);

  if (!isCheckoutOpen || !checkoutItem) return null;

  const basePrice = checkoutItem.amount;
  const discountAmount = (basePrice * discountPercent) / 100;
  const escrowProtectionFee = 2.50;
  const finalPrice = Math.max(0, basePrice - discountAmount + escrowProtectionFee);

  const applyVoucher = () => {
    setDiscountError('');
    const code = discountCode.trim().toUpperCase();
    if (code === 'GIGPRO20' || code === 'PRO20') {
      setDiscountPercent(20);
    } else if (code === 'WELCOME10' || code === 'GIGWORK') {
      setDiscountPercent(10);
    } else {
      setDiscountError('Invalid voucher code. Try "GIGPRO20" or "WELCOME10"');
    }
  };

  const completeMpesaPayment = () => {
    setMpesaStage('success');
    setIsProcessingMpesa(false);
    const txRef = 'QHK' + Math.floor(1000000 + Math.random() * 9000000);
    const order = createOrderFromCheckout('mpesa', txRef);
    setConfirmedOrder(order);
  };

  const handleStartMpesaSTK = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingMpesa(true);
    setMpesaStage('push_sent');
    setMpesaCountdown(20);
  };

  const handleStripePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingCard(true);
    setTimeout(() => {
      setIsProcessingCard(false);
      const txRef = 'ch_strp_' + Math.floor(1000000 + Math.random() * 9000000);
      const order = createOrderFromCheckout('stripe', txRef);
      setConfirmedOrder(order);
    }, 1500);
  };

  const handlePaypalPay = () => {
    setIsProcessingPaypal(true);
    setTimeout(() => {
      setIsProcessingPaypal(false);
      const txRef = 'PAYID-' + Math.floor(1000000 + Math.random() * 9000000);
      const order = createOrderFromCheckout('paypal', txRef);
      setConfirmedOrder(order);
    }, 1500);
  };

  const handleWalletPay = () => {
    if (user.balance < finalPrice) {
      alert('Insufficient wallet balance. Please choose M-Pesa or Card.');
      return;
    }
    const order = createOrderFromCheckout('wallet', 'WLT-INTERNAL');
    setConfirmedOrder(order);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 text-left">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">
              GIGWORK SITE &bull; 256-Bit SSL Escrow Checkout
            </h3>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          /* Confirmation Receipt View */
          <div className="p-6 sm:p-10 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                Payment Authorized &amp; Escrow Activated
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Order {confirmedOrder.orderNumber}
              </h2>
              <p className="text-xs text-slate-500">
                A receipt and notification have been sent to <strong>{confirmedOrder.buyer.email}</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Service / Item:</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">
                  {confirmedOrder.title}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-black text-slate-900">{formatPrice(confirmedOrder.paidAmount)}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="font-bold text-teal-700 uppercase">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Escrow Security:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Funds Held in Escrow
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expected Delivery:</span>
                <span className="font-bold text-slate-800">
                  {new Date(confirmedOrder.deliveryDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveOrder(confirmedOrder);
                  closeCheckout();
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Track Order &amp; Message Seller
              </button>
              <button
                onClick={closeCheckout}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Multi-gateway Checkout Body */
          <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Payment Methods Selection */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-900">Choose Payment Method</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your preferred regional or international payment gateway.
                </p>
              </div>

              {/* Gateway Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* M-Pesa Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'mpesa'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-[11px] mb-2 shadow-xs">
                    M
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      Lipa Na M-Pesa
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Instant STK</span>
                  </div>
                </button>

                {/* Stripe / Card Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'stripe'
                      ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      Stripe / Card
                    </span>
                    <span className="text-[10px] text-indigo-600 font-semibold">Visa, MC, Amex</span>
                  </div>
                </button>

                {/* PayPal Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs mb-2 shadow-xs">
                    P
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      PayPal
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">Global Checkout</span>
                  </div>
                </button>

                {/* Wallet Balance Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'wallet'
                      ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center mb-2 shadow-xs">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      Wallet
                    </span>
                    <span className="text-[10px] text-teal-600 font-semibold">
                      {formatPrice(user.balance)}
                    </span>
                  </div>
                </button>
              </div>

              {/* Gateway-specific Content Forms */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                {paymentMethod === 'mpesa' && (
                  <form onSubmit={handleStartMpesaSTK} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Safaricom M-Pesa Online STK Push
                        </span>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        KENYA KES
                      </span>
                    </div>

                    {mpesaStage === 'idle' && (
                      <>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Enter your Safaricom registered mobile number. A prompt will be automatically sent to your phone to enter your M-Pesa PIN.
                        </p>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Safaricom Phone Number (Format: 2547XXXXXXXX)
                          </label>
                          <input
                            type="text"
                            value={mpesaPhone}
                            onChange={e => setMpesaPhone(e.target.value)}
                            placeholder="e.g. 254712345678"
                            className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            required
                          />
                        </div>

                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                          <span>Amount in KES (Daraja):</span>
                          <span className="text-sm font-black text-emerald-950">
                            KSh {Math.round(convertPrice(finalPrice) * (currency === 'KES' ? 1 : 132.5)).toLocaleString()}
                          </span>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black py-3 px-4 rounded-xl shadow-md text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Send M-Pesa STK Push Prompt</span>
                        </button>
                      </>
                    )}

                    {mpesaStage === 'push_sent' && (
                      <div className="p-6 text-center space-y-3">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                        <h4 className="text-sm font-bold text-slate-900">
                          Sending STK Prompt to {mpesaPhone}...
                        </h4>
                        <p className="text-xs text-slate-500">
                          Please keep your phone unlocked. Waiting for Safaricom Daraja API response ({mpesaCountdown}s)...
                        </p>
                      </div>
                    )}

                    {mpesaStage === 'pin_prompt' && (
                      <div className="p-6 text-center space-y-3 bg-white rounded-xl border border-emerald-300">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                          <Smartphone className="w-6 h-6 animate-bounce" />
                        </div>
                        <h4 className="text-sm font-black text-emerald-950">
                          Check Phone Screen &amp; Enter M-Pesa PIN!
                        </h4>
                        <p className="text-xs text-slate-600">
                          &quot;Do you want to pay KSh {Math.round(finalPrice * 132.5).toLocaleString()} to GIGWORK SITE ESCROW?&quot;
                        </p>
                        <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-mono font-bold">
                          Awaiting PIN ({mpesaCountdown}s)
                        </div>
                      </div>
                    )}
                  </form>
                )}

                {paymentMethod === 'stripe' && (
                  <form onSubmit={handleStripePay} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Credit or Debit Card (Stripe 3DS)
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">256-Bit Encrypted</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessingCard}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isProcessingCard ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing 3D-Secure...</span>
                        </>
                      ) : (
                        <span>Pay {formatPrice(finalPrice)} via Stripe</span>
                      )}
                    </button>
                  </form>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="space-y-4 text-center p-4">
                    <p className="text-xs text-slate-600">
                      You will be redirected to PayPal to complete your purchase securely.
                    </p>
                    <button
                      type="button"
                      onClick={handlePaypalPay}
                      disabled={isProcessingPaypal}
                      className="w-full bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-black py-3 px-6 rounded-xl shadow-md text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isProcessingPaypal ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
                          <span>Authorizing PayPal...</span>
                        </>
                      ) : (
                        <span>PayPal Express &bull; {formatPrice(finalPrice)}</span>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400 block">
                      Buyer Protection eligible with PayPal
                    </span>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Available Wallet Balance:</span>
                      <span className="font-bold text-emerald-600">{formatPrice(user.balance)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Order Deductions:</span>
                      <span className="font-bold text-slate-900">{formatPrice(finalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t border-slate-200">
                      <span className="text-slate-500">Balance After Payment:</span>
                      <span className="font-bold text-slate-800">
                        {formatPrice(Math.max(0, user.balance - finalPrice))}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleWalletPay}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm cursor-pointer shadow-md"
                    >
                      Confirm Payment with Wallet Balance
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Invoice Breakdown */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Order Summary
                </h4>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{checkoutItem.title}</h3>
                  <span className="text-xs text-teal-600 font-medium block mt-0.5">
                    {checkoutItem.subtitle}
                  </span>
                </div>

                {/* Features Pill */}
                {checkoutItem.features && (
                  <ul className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                    {checkoutItem.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Voucher code box */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={e => setDiscountCode(e.target.value)}
                      placeholder="Promo code (e.g. GIGPRO20)"
                      className="flex-1 p-2 text-xs bg-white border border-slate-300 rounded-lg uppercase font-mono"
                    />
                    <button
                      type="button"
                      onClick={applyVoucher}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {discountError && (
                    <span className="text-[10px] text-rose-500 mt-1 block">{discountError}</span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                      ✓ {discountPercent}% discount code applied!
                    </span>
                  )}
                </div>

                {/* Cost Calculations */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(basePrice)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({discountPercent}%):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Escrow Protection &amp; Handling:</span>
                    <span>{formatPrice(escrowProtectionFee)}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-base font-black text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-xl text-teal-600">{formatPrice(finalPrice)}</span>
                  </div>
                </div>

                {/* Escrow Guarantee Note */}
                <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-xl flex items-start gap-2.5 text-[11px] text-teal-900">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    Your funds are held securely by GIGWORK SITE escrow. Sellers only receive payment when you approve their work.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
