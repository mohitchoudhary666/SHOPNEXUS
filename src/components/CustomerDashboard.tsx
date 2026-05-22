/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Package, MapPin, Truck, ChevronRight, CheckCircle2, 
  Map, Calendar, ShieldCheck, Clock, RefreshCw, ShoppingBag, PhoneCall
} from 'lucide-react';
import { Order } from '../types';

interface CustomerDashboardProps {
  orders: Order[];
  onBackToShop: () => void;
  initialTrackingId?: string;
}

export default function CustomerDashboard({
  orders,
  onBackToShop,
  initialTrackingId = ''
}: CustomerDashboardProps) {
  const [searchId, setSearchId] = useState(initialTrackingId);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize tracking
  useEffect(() => {
    if (initialTrackingId) {
      setSearchId(initialTrackingId);
      const match = orders.find(
        (o) => o.id.toLowerCase() === initialTrackingId.toLowerCase()
      );
      if (match) {
        setTrackedOrder(match);
        setSearchError(false);
      } else {
        setTrackedOrder(null);
        setSearchError(true);
      }
    } else if (orders.length > 0) {
      // Default to the first order to create a friendly active state
      setTrackedOrder(orders[0]);
      setSearchId(orders[0].id);
    }
  }, [initialTrackingId, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const match = orders.find(
      (o) => o.id.trim().toLowerCase() === searchId.trim().toLowerCase()
    );

    if (match) {
      setTrackedOrder(match);
      setSearchError(false);
    } else {
      setTrackedOrder(null);
      setSearchError(true);
    }
  };

  const handleSelectOrder = (order: Order) => {
    setTrackedOrder(order);
    setSearchId(order.id);
    setSearchError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const simulateRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (trackedOrder) {
        const updated = orders.find((o) => o.id === trackedOrder.id);
        if (updated) {
          setTrackedOrder(updated);
        }
      }
    }, 600);
  };

  // Status mapping
  const statusSteps = [
    { label: 'Placed', text: 'Order Registered', desc: 'Secure payment received', icon: ShoppingBag },
    { label: 'Packed', text: 'Parcel Prepared', desc: 'Packed at distribution hub', icon: Package },
    { label: 'Dispatched', text: 'In Transit', desc: 'Sailing through shipping network', icon: Truck },
    { label: 'Out for Delivery', text: 'With Courier', desc: 'With delivery executive', icon: MapPin },
    { label: 'Delivered', text: 'Delivered', desc: 'Verification OTP completed', icon: CheckCircle2 }
  ] as const;

  const currentStatusIndex = trackedOrder 
    ? statusSteps.findIndex((s) => s.label === trackedOrder.orderStatus)
    : 0;

  const progressPercent = trackedOrder 
    ? (currentStatusIndex / (statusSteps.length - 1)) * 100
    : 0;

  return (
    <div className="space-y-8 animate-fade-in text-white pb-12 w-full max-w-7xl mx-auto px-4">
      
      {/* Title Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Package className="h-6 w-6 text-emerald-400" />
            Customer Order & Transit Portal
          </h2>
          <p className="text-xs text-white/50 font-mono mt-1">
            Real-time tracking, order verification ledger, and static transit routing.
          </p>
        </div>
        <button
          onClick={onBackToShop}
          className="px-4 py-2 text-xs font-bold text-blue-400 hover:text-blue-300 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 rounded-xl transition-all cursor-pointer"
        >
          &larr; Return to Store Catalog
        </button>
      </div>

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns: Order Tracking Console */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tracking Lookup Box */}
          <div className="bg-slate-900/60 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
              <Search className="h-4 w-4 text-emerald-400" />
              Trace Parcel by Order Identifier
            </h3>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. ord-101)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/50 transition font-mono"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                Track Now
              </button>
            </form>

            {searchError && (
              <p className="text-xs text-rose-400 font-medium animate-pulse font-mono">
                ⚠️ Order ID not found. Check spelling or select from the Order History ledger.
              </p>
            )}
          </div>

          {/* Core Tracking Screen */}
          <AnimatePresence mode="wait">
            {trackedOrder ? (
              <motion.div
                key={trackedOrder.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Active Parcel Status Card */}
                <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none -z-10" />

                  {/* Header Row of Order Details */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-md">
                        Tracking Code: {trackedOrder.id}
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1">
                        Est. Delivery: {trackedOrder.orderStatus === 'Delivered' ? 'Delivered' : 'Ready within 2-4 Business Days'}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={simulateRefresh}
                        className="text-xs text-white/60 hover:text-white bg-slate-950 border border-white/10 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Sync Courier Records"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="font-mono">{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
                      </button>
                    </div>
                  </div>

                  {/* High Contrast Stepper Timeline */}
                  <div className="space-y-8 py-2">
                    <div className="relative">
                      {/* Grey track */}
                      <div className="absolute top-4 left-4 right-4 h-1 bg-white/5 rounded-full -z-10" />
                      {/* Active gradient progress tracker bar */}
                      <div 
                        className="absolute top-4 left-4 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 rounded-full -z-10 transition-all duration-1000 shadow-[0_0_12px_#10b981]"
                        style={{ width: `calc(${progressPercent}% - 32px)` }}
                      />

                      <div className="flex justify-between">
                        {statusSteps.map((step, idx) => {
                          const StepIcon = step.icon;
                          const isVisited = idx <= currentStatusIndex;
                          const isCurrent = idx === currentStatusIndex;

                          return (
                            <div key={step.label} className="flex flex-col items-center text-center max-w-[80px] sm:max-w-[120px]">
                              {/* Pulsing indicator circle */}
                              <div
                                className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${
                                  isCurrent
                                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 border-emerald-400 text-white scale-125 shadow-lg shadow-emerald-500/30'
                                    : isVisited
                                    ? 'bg-teal-950 border-teal-400 text-teal-300'
                                    : 'bg-slate-950 border-white/10 text-white/30'
                                }`}
                              >
                                {isCurrent && (
                                  <span className="absolute inset-0 rounded-full animate-ping bg-emerald-500/20 -z-10" />
                                )}
                                <StepIcon className="h-4 w-4" />
                              </div>

                              <span className={`text-[10px] sm:text-xs font-semibold mt-3 ${isCurrent ? 'text-emerald-300 font-extrabold' : 'text-white/50'}`}>
                                {step.label}
                              </span>
                              <span className="text-[8px] sm:text-[9px] text-white/30 leading-snug mt-1 hidden sm:block">
                                {step.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Parcel Details / Info Strip */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950 border border-white/5 rounded-xl p-4 text-xs font-mono">
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/40 uppercase">Carrier</p>
                      <p className="text-white font-semibold flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5 text-emerald-400" />
                        DHL Logistics Ltd
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/40 uppercase">Item Count</p>
                      <p className="text-white font-semibold flex items-center gap-1">
                        <Package className="h-3.5 w-3.5 text-teal-400" />
                        {trackedOrder.items.reduce((acc, item) => acc + item.quantity, 0)} Units
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/40 uppercase">Shipping Destination</p>
                      <p className="text-white font-semibold truncate max-w-[120px]" title={trackedOrder.shippingAddress}>
                        {trackedOrder.shippingAddress}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/40 uppercase">Payment Sync</p>
                      <p className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        {trackedOrder.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Routing / Waypoints map */}
                <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5 font-mono">
                      <Map className="h-4 w-4 text-emerald-400" />
                      Shipment Route & Logistics Center Chain
                    </h3>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-6 relative overflow-hidden h-44 flex items-center justify-center border border-white/5">
                    {/* SVG Map Lines and Vehicles */}
                    <svg className="w-full h-full absolute inset-0 text-white/5" overflow="visible" viewBox="0 0 500 150">
                      
                      {/* Grey road connector path */}
                      <path 
                        d="M 50 110 Q 150 30 250 120 T 450 110"
                        fill="none" 
                        stroke="rgba(255, 255, 255, 0.08)" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                      
                      {/* Active green progress path overlay */}
                      <path 
                        d="M 50 110 Q 150 30 250 120 T 450 110"
                        fill="none" 
                        stroke="url(#map-linear-grad)" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                        strokeDasharray="500"
                        strokeDashoffset={500 - (progressPercent * 4.5)}
                        className="transition-all duration-1000 ease-out"
                      />

                      {/* Map gradient definitions */}
                      <defs>
                        <linearGradient id="map-linear-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>

                      {/* Reference City Dots */}
                      <g className="text-white/30">
                        <circle cx="50" cy="110" r="4.5" fill="#10b981" />
                        <text x="50" y="130" fontSize="8" fill="rgba(255,255,255,0.4)" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Delhi Depot</text>
                        
                        <circle cx="160" cy="50" r="4.5" fill={currentStatusIndex >= 1 ? "#3b82f6" : "currentColor"} />
                        <text x="160" y="35" fontSize="8" fill="rgba(255,255,255,0.4)" textAnchor="middle" fontFamily="monospace">Sort Base</text>

                        <circle cx="280" cy="98" r="4.5" fill={currentStatusIndex >= 2 ? "#6366f1" : "currentColor"} />
                        <text x="280" y="115" fontSize="8" fill="rgba(255,255,255,0.4)" textAnchor="middle" fontFamily="monospace">Central Sector</text>

                        <circle cx="450" cy="110" r="5.5" fill={currentStatusIndex >= 4 ? "#3b82f6" : "currentColor"} className="animate-pulse" />
                        <text x="450" y="130" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Recipient Delivery Address</text>
                      </g>

                      {/* Moving Motorist Vehicle Marker */}
                      {progressPercent > 0 && (
                        <g 
                          className="text-emerald-400 transition-all duration-1000"
                          style={{
                            transform: `translate(${
                              50 + (400 * (progressPercent / 100)) - 10
                            }px, ${
                              (progressPercent < 50) 
                                ? 110 - (2.2 * progressPercent) + (0.02 * Math.pow(progressPercent, 2))
                                : 120 - 0.2 * (progressPercent - 50)
                            }px)`
                          }}
                        >
                          <circle cx="0" cy="0" r="10" fill="#10b981" className="animate-pulse opacity-30" />
                          <circle cx="0" cy="0" r="6" fill="#059669" className="stroke-white" strokeWidth="0.5" />
                        </g>
                      )}
                    </svg>

                    {/* Left overlay location banner */}
                    <div className="absolute top-3 left-3 bg-slate-950/90 border border-white/10 px-3 py-1.5 rounded-xl text-[9px] font-mono leading-tight space-y-0.5">
                      <div className="text-white/40">TRANSIT LOCATION:</div>
                      <div className="text-emerald-300 font-bold flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-emerald-450 animate-bounce" />
                        {currentStatusIndex === 0 && 'Delhi Main Dispatch Center'}
                        {currentStatusIndex === 1 && 'Sorting Warehouses - NH Road Corridor'}
                        {currentStatusIndex === 2 && 'Regional Express Route Hub'}
                        {currentStatusIndex === 3 && 'Out for door-to-door delivery'}
                        {currentStatusIndex === 4 && 'Safely Handed over at customer address'}
                      </div>
                    </div>

                    {/* Custom Courier Info Banner */}
                    {trackedOrder.orderStatus !== 'Placed' && (
                      <div className="absolute bottom-3 right-3 bg-slate-950 border border-white/10 p-2 rounded-xl text-[9px] font-mono flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/30">
                          <Truck className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white leading-none">Rakesh Kumar</p>
                          <p className="text-[8px] text-white/40 mt-1">Lead Delivery Professional</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub items / Invoice details card */}
                <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5 font-mono">
                    <Package className="h-4 w-4 text-emerald-400" />
                    Audited Shipment Item Ledger ({trackedOrder.items.length})
                  </h3>

                  <div className="divide-y divide-white/5 font-mono text-sm">
                    {trackedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex justify-between gap-4 items-center">
                        <div>
                          <p className="text-white font-semibold text-xs sm:text-sm">{item.productName}</p>
                          <p className="text-[10px] text-white/40 mt-0.5">Quantity Order: {item.quantity}</p>
                        </div>
                        <span className="text-xs text-emerald-400 font-bold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="pt-3 flex justify-between items-center text-xs sm:text-sm border-t border-white/10">
                      <span className="font-bold text-white/60">Grand Transaction Amount:</span>
                      <span className="text-emerald-400 font-extrabold text-base">
                        ₹{trackedOrder.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

              </motion.div>
            ) : (
              // Empty selection state
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-12 text-center text-white/40 space-y-3">
                <Package className="h-12 w-12 mx-auto text-white/20" />
                <h4 className="font-bold text-white/60 text-sm">No Active Order Selected</h4>
                <p className="text-xs max-w-xs mx-auto">
                  Type an Order ID above or pick one from the historical list to start auditing its live shipping stages.
                </p>
              </div>
            )}
          </AnimatePresence>
          
        </div>

        {/* Right 1 Column: Customers Order Ledger / List */}
        <div className="space-y-6">
          
          {/* Order history block list */}
          <div className="bg-slate-900/60 border border-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5 font-mono">
                <Calendar className="h-4 w-4 text-teal-400" />
                Customer Order History ({orders.length})
              </h3>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {orders.length === 0 ? (
                <p className="text-xs text-center text-white/30 py-6 font-mono">
                  No orders found in cached databases.
                </p>
              ) : (
                orders.map((o) => {
                  const isTracked = trackedOrder?.id === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => handleSelectOrder(o)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isTracked
                          ? 'bg-emerald-500/10 border-emerald-500/40 shadow-inner'
                          : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-xs font-bold text-white">
                            {o.id}
                          </span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                            o.orderStatus === 'Delivered' 
                              ? 'bg-emerald-500/15 text-emerald-400' 
                              : o.orderStatus === 'Out for Delivery'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-blue-500/15 text-blue-400'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/50 truncate font-sans">
                          {o.customerName} &bull; {o.items.reduce((acc, it) => acc + it.quantity, 0)} Items
                        </p>
                        <p className="text-[9px] font-mono text-emerald-300 font-semibold">
                          ₹{o.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/30 shrink-0" />
                    </button>
                  );
                })
              )}
            </div>

            <div className="bg-slate-950/80 border border-white/5 p-3.5 rounded-xl text-[10px] text-white/40 leading-relaxed text-left font-sans">
              <span className="font-bold text-white/60">💡 Real-time Status Sync:</span>
              <p className="mt-1 leading-normal">
                If you have an Admin account or switch to the Store Admin persona at the top right, any updates made to the order shipping pipeline status will propagate here automatically!
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
