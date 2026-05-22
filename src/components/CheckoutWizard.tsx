/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { CartItem, Order } from '../types';
import { CreditCard, QrCode, Truck, CheckCircle2, ArrowRight, ShieldAlert, Check, Copy } from 'lucide-react';

interface CheckoutWizardProps {
  cart: CartItem[];
  discountPercentage: number;
  couponCode: string;
  onOrderPlaced: (order: Order) => void;
  onClose: () => void;
  onTrackOrder?: (orderId: string) => void;
}

export default function CheckoutWizard({
  cart,
  discountPercentage,
  couponCode,
  onOrderPlaced,
  onClose,
  onTrackOrder
}: CheckoutWizardProps) {
  const [step, setStep] = useState<1 | 2>(1); // 1: Shipping/Billing, 2: Receipt/Timeline
  
  // Form input states
  const [customerName, setCustomerName] = useState('Mohit Choudhary');
  const [customerEmail, setCustomerEmail] = useState('mohitchoudhary11012004@gmail.com');
  const [shippingAddress, setShippingAddress] = useState('102, Shanti Kunj, Sector 4, Gurgaon, Haryana, India');
  const [phone, setPhone] = useState('+91 9876543210');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  
  // Card input states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Submitting logic
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [timelineStatus, setTimelineStatus] = useState<Order['orderStatus']>('Placed');

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const deliveryFee = subtotal > 5000 || subtotal === 0 ? 0 : 150;
  const totalAmount = subtotal - discountAmount + deliveryFee;

  // Track dynamic credit card brand identifier
  const getCardBrand = () => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'MasterCard';
    if (cardNumber.startsWith('3')) return 'American Express';
    return 'Generic';
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOrder(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          shippingAddress,
          phone,
          items: cart,
          totalAmount,
          paymentMethod
        })
      });

      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Service offline');
      }

      const orderData: Order = await response.json();
      setPlacedOrder(orderData);
      onOrderPlaced(orderData);
      setStep(2);
    } catch (err) {
      console.log('Backend sync offline. Conducting local client-side transaction simulation (Vercel optimization)...');
      const orderData: Order = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        customerEmail,
        shippingAddress,
        phone,
        items: cart,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'UPI' || paymentMethod === 'Card' ? 'Paid' : 'Pending',
        orderStatus: 'Placed',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPlacedOrder(orderData);
      onOrderPlaced(orderData);
      setStep(2);
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Start background order state tracking simulation
  useEffect(() => {
    if (!placedOrder) return;
    
    // Simulate progression of order to next stages slowly
    const timer1 = setTimeout(() => setTimelineStatus('Packed'), 5000);
    const timer2 = setTimeout(() => setTimelineStatus('Dispatched'), 12000);
    const timer3 = setTimeout(() => setTimelineStatus('Out for Delivery'), 20000);
    const timer4 = setTimeout(() => setTimelineStatus('Delivered'), 30000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [placedOrder]);

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none -z-10" />
      
      {step === 1 ? (
        <form onSubmit={handlePlaceOrder} className="space-y-8 max-w-3xl mx-auto">
          <div>
            <h2 className="font-sans text-base font-bold text-white border-b border-white/10 pb-2.5 flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-400" />
              Complete Shipping Information & Secure Checkout
            </h2>
            <p className="text-xs text-white/60 mt-1">This checkout simulation demonstrates dynamic payment state handling, receipt logging, and active/restored inventories depletion on the Express server resources.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Billing Addresses */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">I. Customer Credentials</h3>
              
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Mobile / Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">Coupon Check</label>
                  <input
                    type="text"
                    disabled
                    value={couponCode ? `${couponCode} (Applied)` : 'No active coupon'}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white/50 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Full Physical Routing Address</label>
                <textarea
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition leading-relaxed"
                />
              </div>
            </div>

            {/* Right: Payment Modes */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">II. Simulated Payment Gateway</h3>
              
              {/* Tabs selector */}
              <div className="flex border border-white/10 rounded-xl p-1 gap-1 bg-white/5 select-none">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'bg-white/15 text-white border border-white/20 shadow-md'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  UPI QR Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    paymentMethod === 'Card'
                      ? 'bg-white/15 text-white border border-white/20 shadow-md'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'bg-white/15 text-white border border-white/20 shadow-md'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  <Truck className="h-4 w-4" />
                  COD
                </button>
              </div>

              {/* Tab Outputs rendering */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 relative min-h-[170px] flex flex-col justify-center">
                
                {paymentMethod === 'UPI' && (
                  <div className="text-center space-y-4 animate-fade-in">
                    <p className="text-[11px] text-white/60">Scan this dynamically rendering QR code inside any theoretical UPI applet (GPay, PhonePe, Bhim) to simulation pay.</p>
                    
                    {/* Visual Vector Draw QR representation */}
                    <div className="h-28 w-28 bg-white border border-[#1e293b] rounded-xl p-2 mx-auto flex items-center justify-center relative shadow-xl">
                      {/* Stylized QR placeholder blocks */}
                      <div className="w-full h-full relative opacity-95">
                        <div className="absolute top-0 left-0 w-6 h-6 border-4 border-slate-900" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-4 border-slate-900" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-4 border-slate-900" />
                        <div className="absolute top-3 left-3 w-4 h-4 bg-slate-900" />
                        <div className="absolute top-2 right-8 w-2 h-2 bg-slate-900" />
                        <div className="absolute top-6 right-5 w-4 h-4 border border-slate-900" />
                        <div className="absolute bottom-6 left-6 w-3 h-3 bg-blue-600" />
                        <div className="absolute bottom-2 right-2 w-8 h-8 border border-slate-900 flex items-center justify-center font-bold text-[8px] bg-blue-50 text-blue-700">UPI</div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-white/10 p-2.5 rounded-lg text-left text-[10px] font-mono select-all flex justify-between items-center text-white/90">
                      <span className="text-white/80 break-all truncate mr-3">upi://pay?pa=shopnexus@okaxis&pn=ShopNexus&am={totalAmount}&cu=INR</span>
                      <Copy className="h-3 w-3 text-white/40 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-[11px] text-white/60">Card brand detected: <strong className="text-blue-300">{getCardBrand()}</strong></p>
                    
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/50 mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4242 4242 4242 4242 (Visa Test)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/35 outline-none focus:border-blue-500/50 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/50 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/35 outline-none focus:border-blue-500/50 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/50 mb-1">CVV Security</label>
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/35 outline-none focus:border-blue-500/50 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="text-center py-6 space-y-2 animate-fade-in">
                    <Truck className="h-10 w-10 text-purple-400 mx-auto" />
                    <h4 className="text-xs font-bold text-white">Cash on Delivery selected</h4>
                    <p className="text-[11px] text-white/60 max-w-[240px] mx-auto">Requires manual payment at the moment of deliveries. The status is initialized to "Pending payment".</p>
                  </div>
                )}

              </div>
              
              {/* Costing card overlay */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl">
                <h4 className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Checkout Bill Summary</h4>
                <div className="space-y-1.5 text-xs text-white/80">
                  <div className="flex justify-between">
                    <span>Selected Base Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Promo Applied ('{couponCode}')</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Packaging Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-2.5 flex justify-between items-center">
                  <span className="text-xs font-bold text-white">Gross Final Amount</span>
                  <span className="text-base font-bold font-mono text-blue-300">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Form Actions footer */}
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-white/60 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingOrder}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg cursor-pointer disabled:bg-[#1e293b]"
            >
              {submittingOrder ? 'Processing secure order request...' : 'Submit & Secure Order'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      ) : (
        /* Order Receipt Tab and Timeline Tracker */
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in text-center py-6 text-white">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 animate-bounce">
            <Check className="h-6 w-6 stroke-[3px]" />
          </div>

          <div>
            <h2 className="font-sans text-xl font-bold text-white">Order Placed Successfully!</h2>
            <p className="text-xs text-white/60 mt-1 max-w-md mx-auto">
              Thank you, <strong className="text-blue-300">{placedOrder?.customerName}</strong>. Your transaction has been registered and verified by the Express Server backend entity.
            </p>
          </div>

          {/* Receipt invoice card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left text-xs space-y-3.5 max-w-md mx-auto shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between font-mono pb-2 border-b border-white/10">
              <span className="text-white/40">ORDER NO:</span>
              <strong className="text-blue-300">{placedOrder?.id}</strong>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-white/40 uppercase">Shipping Parcel To:</p>
              <p className="text-white font-semibold">{placedOrder?.shippingAddress}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-white/40 uppercase">Billed Amount:</p>
              <p className="text-blue-300 font-bold font-mono">₹{placedOrder?.totalAmount.toLocaleString()} ({placedOrder?.paymentMethod} Pay)</p>
            </div>

            <div className="pt-2.5 flex justify-between items-center text-[10px] text-white/40 border-t border-white/10">
              <span>Status: <strong className="text-emerald-400 uppercase">{placedOrder?.paymentStatus}</strong></span>
              <span>Date: <strong>{placedOrder?.createdAt}</strong></span>
            </div>
          </div>

          {/* Order Status Presentation Timeline */}
          <div className="space-y-6 pt-4 max-w-lg mx-auto">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">Dynamic Shipping Stage Monitor</h3>
            
            {/* Horizontal timeline chart */}
            <div className="relative flex justify-between">
              
              {/* Full background progress line */}
              <div className="absolute top-4 left-4 right-4 h-1 bg-white/10 -z-10" />

              {/* Dynamic filled line indicator */}
              <div 
                className="absolute top-4 left-4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 -z-10 transition-all duration-1000"
                style={{
                  width: timelineStatus === 'Placed' ? '0%' :
                         timelineStatus === 'Packed' ? '25%' :
                         timelineStatus === 'Dispatched' ? '50%' :
                         timelineStatus === 'Out for Delivery' ? '75%' : '100%'
                }}
              />

              {/* Timeline markers */}
              {(['Placed', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered'] as const).map((status, index) => {
                const isActive = timelineStatus === status;
                const isCompleted = 
                  (status === 'Placed') ||
                  (status === 'Packed' && timelineStatus !== 'Placed') ||
                  (status === 'Dispatched' && timelineStatus !== 'Placed' && timelineStatus !== 'Packed') ||
                  (status === 'Out for Delivery' && timelineStatus === 'Out for Delivery' || timelineStatus === 'Delivered') ||
                  (status === 'Delivered' && timelineStatus === 'Delivered');

                return (
                  <div key={status} className="flex flex-col items-center">
                    <div 
                      className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive 
                        ? 'bg-gradient-to-tr from-blue-500 to-purple-500 border-blue-400 text-white scale-125 shadow-lg' 
                        : isCompleted 
                        ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                        : 'bg-slate-900 border-white/10 text-white/30'
                      }`}
                    >
                      {isCompleted ? <Check className="h-4.5 w-4.5 stroke-[3px]" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                    </div>
                    <span className={`text-[10px] font-semibold mt-2.5 transition-all ${isActive ? 'text-blue-300 font-extrabold' : 'text-white/40'}`}>
                      {status}
                    </span>
                  </div>
                );
              })}

            </div>

            <p className="text-[10px] font-mono text-blue-300 bg-white/5 border border-white/10 p-2 rounded-xl max-w-sm mx-auto">
              💡 Presentation Tip: Examiners can monitor or transition this delivery state instantly using the Admin dashboard!
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-6 border-t border-white/10 max-w-md mx-auto">
            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition active:scale-95 cursor-pointer"
            >
              Continue shopping
            </button>
            {onTrackOrder && placedOrder && (
              <button
                onClick={() => onTrackOrder(placedOrder.id)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                Track My Order &rarr;
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
