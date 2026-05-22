/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ShoppingCart, User, Award, FileText, Settings, Sparkles, MapPin } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  activeTab: 'shop' | 'admin' | 'track';
  setActiveTab: (tab: 'shop' | 'admin' | 'track') => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  userRole: 'customer' | 'admin';
  setUserRole: (role: 'customer' | 'admin') => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  cart,
  setIsCartOpen,
  userRole,
  setUserRole
}: HeaderProps) {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [animateCart, setAnimateCart] = useState(false);
  const prevCountRef = useRef(cartCount);

  useEffect(() => {
    if (cartCount > prevCountRef.current) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    prevCountRef.current = cartCount;
  }, [cartCount]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/5 backdrop-blur-md text-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-xl">
            <ShoppingBag className="h-5.5 w-5.5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              ShopNexus <span className="hidden sm:inline bg-gradient-to-r from-blue-500 to-purple-500 text-[10px] font-bold px-2.5 py-0.5 rounded border border-white/10 uppercase tracking-wider">Premium</span>
            </h1>
            <p className="text-[10px] font-mono text-white/40 hidden sm:block">Intelligent Retail & Portfolio Hub</p>
          </div>
        </div>

        {/* Center Tabs Navigation */}
        <nav className="flex space-x-1 select-none">
          <button
            id="tab-shop"
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-white/15 text-white border border-white/20 shadow-lg'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ShoppingCart className="h-4 w-4 text-blue-400" />
            <span className="hidden md:inline">Browse Shop</span>
          </button>

          <button
            id="tab-track"
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'track'
                ? 'bg-white/15 text-white border border-white/20 shadow-lg'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <MapPin className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Track Order</span>
          </button>
          
          <button
            id="tab-admin"
            onClick={() => {
              setActiveTab('admin');
              if (userRole === 'customer') {
                // Elevate automatically to Admin for fluid demo
                setUserRole('admin');
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white/15 text-white border border-white/20 shadow-lg'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings className="h-4 w-4 text-purple-400" />
            <span>Dashboard</span>
          </button>
        </nav>

        {/* Right Actions & Persona Switcher */}
        <div className="flex items-center space-x-4">
          
          {/* Persona Switcher Dropdown */}
          <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 rounded-xl p-1.5">
            <User className="h-3.5 w-3.5 text-white/50 ml-1.5 hidden lg:block" />
            <select
              value={userRole}
              onChange={(e) => {
                const newRole = e.target.value as 'customer' | 'admin';
                setUserRole(newRole);
                if (newRole === 'admin') setActiveTab('admin');
                if (newRole === 'customer' && activeTab !== 'shop') setActiveTab('shop');
              }}
              className="bg-slate-900 border-0 text-xs font-semibold text-white/90 outline-none pr-1 pl-1 cursor-pointer"
              title="Change User Scenario"
            >
              <option value="customer" className="bg-[#0f172a] text-white">Role: Customer</option>
              <option value="admin" className="bg-[#0f172a] text-white">Role: Store Admin</option>
            </select>
          </div>

          {/* Cart Icon Toggle */}
          <motion.button
            onClick={() => setIsCartOpen(true)}
            animate={animateCart ? {
              scale: [1, 1.25, 0.95, 1.15, 1],
              rotate: [0, -8, 8, -4, 4, 0]
            } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl border text-white shadow-lg cursor-pointer transition ${
              animateCart
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-white/10 bg-white/5 hover:bg-white/15'
            }`}
            aria-label="View Cart"
          >
            <ShoppingCart className={`h-4.5 w-4.5 transition-colors ${animateCart ? 'text-blue-400' : 'text-white'}`} />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-[10px] font-bold text-white shadow-md ring-2 ring-slate-900"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>
        </div>

      </div>
    </header>
  );
}
