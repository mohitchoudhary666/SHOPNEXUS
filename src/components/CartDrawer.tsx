/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartItem, Coupon } from '../types';
import { X, Trash2, Plus, Minus, Tag, Check, Award } from 'lucide-react';
import { COUPONS } from '../data';

interface CartDrawerProps {
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onStartCheckout: (discountPercentage: number, couponCode: string) => void;
}

export default function CartDrawer({
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onStartCheckout
}: CartDrawerProps) {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    
    const found = COUPONS.find(c => c.code.toUpperCase() === couponCodeInput.trim().toUpperCase());
    if (found) {
      setAppliedCoupon(found);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try "SHOPNEXUS20" for 20% premium discount!');
      setAppliedCoupon(null);
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError('');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercentage) / 100 : 0;
  const deliveryFee = subtotal > 5000 || subtotal === 0 ? 0 : 150;
  const totalAmount = subtotal - discountAmount + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0f172a]/95 border-l border-white/10 h-full flex flex-col shadow-2xl relative animate-slide-in text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-white/5">
          <div className="flex items-center gap-2">
            <h2 className="font-sans text-base font-bold text-white">Your Shopping Cart</h2>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
              {cart.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/45">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Your cart is empty</h3>
              <p className="text-xs text-white/60 max-w-[220px] mx-auto">Explore our catalog of custom items and add devices to begin checkout operations.</p>
              <button
                onClick={onClose}
                className="mt-2 text-xs bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 transition text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-lg"
              >
                Back to Store
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3.5 bg-white/5 border border-white/10 rounded-2xl relative backdrop-blur-xl animate-fade-in"
              >
                {/* Thumb */}
                <div className="h-16 w-16 bg-slate-950 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate pr-5">{item.product.name}</h4>
                  <p className="text-[10px] font-mono text-white/40 uppercase mt-0.5">{item.product.category}</p>
                  
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-xs font-bold font-mono text-blue-300">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                    
                    {/* Stepper controls */}
                    <div className="flex items-center border border-white/10 bg-slate-900 rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 px-2 text-white/60 hover:bg-white/10 cursor-pointer text-xs"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 px-2 text-white/60 hover:bg-white/10 cursor-pointer text-xs"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="absolute top-2 right-2 p-1 text-white/40 hover:text-rose-455 transition cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5 hover:text-rose-400" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Area */}
        {cart.length > 0 && (
          <div className="border-t border-white/10 p-6 bg-white/5 space-y-4">
            
            {/* Promo coupon engine */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wide">
                Apply Promo code / Discount coupon
              </label>
              
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute top-2 left-2.5 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="e.g. SHOPNEXUS20"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs uppercase text-white outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-white hover:bg-blue-50 text-black font-bold text-xs px-3.5 rounded-lg cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-blue-500/20 border border-blue-500/30 h-9 px-3 rounded-lg">
                  <div className="flex items-center gap-1.5 text-blue-300 text-xs font-bold">
                    <Check className="h-3.5 w-3.5 stroke-[3px] text-blue-400" />
                    <span>Coupon '{appliedCoupon.code}' Applied ({appliedCoupon.discountPercentage}% Off!)</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearCoupon}
                    className="text-[10px] font-bold uppercase text-white/60 hover:text-white cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && <p className="text-[10px] text-rose-400 font-medium">{couponError}</p>}
              {!appliedCoupon && !couponError && (
                <p className="text-[10px] text-white/40 font-medium">💡 Hint: Enter <span className="font-bold font-mono bg-white/10 text-white/80 border border-white/10 px-1 rounded">SHOPNEXUS20</span> for 20% off.</p>
              )}
            </form>

            {/* Bill Summary map */}
            <div className="space-y-1.5 border-t border-b border-white/10 py-3 text-xs text-white/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    Discount ({appliedCoupon.discountPercentage}%)
                  </span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono text-white">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-white font-bold pt-1.5 text-sm">
                <span>Total Amount</span>
                <span className="font-mono text-blue-300">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                onStartCheckout(
                  appliedCoupon ? appliedCoupon.discountPercentage : 0, 
                  appliedCoupon ? appliedCoupon.code : ''
                );
                onClose();
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-[1.01] text-white font-bold py-2.5 rounded-xl transition active:scale-98 cursor-pointer flex justify-center items-center gap-2 text-xs shadow-lg"
            >
              Securely Proceed to Checkout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
