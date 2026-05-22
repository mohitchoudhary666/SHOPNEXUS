/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCatalog from './components/ProductCatalog';
import CartDrawer from './components/CartDrawer';
import CheckoutWizard from './components/CheckoutWizard';
import AssistantChat from './components/AssistantChat';
import AdminPanel from './components/AdminPanel';
import CustomerDashboard from './components/CustomerDashboard';
import { Product, CartItem, Order, Review } from './types';
import { INITIAL_PRODUCTS } from './data';
import { Sparkles, MessageSquare, X, ShieldAlert, ShoppingBag, Eye, HelpCircle, MapPin } from 'lucide-react';

export default function App() {
  // Navigation & Persona Selection states
  const [activeTab, setActiveTab] = useState<'shop' | 'admin' | 'track'>('shop');
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer');
  const [selectedTrackingId, setSelectedTrackingId] = useState<string>('');
  
  // Real Server synced Data lists (with local database fallback)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('shopnexus_products_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing cached products:', e);
      }
    }
    localStorage.setItem('shopnexus_products_db', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shopnexus_orders_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing cached orders:', e);
      }
    }
    const defaultOrders: Order[] = [
      {
        id: 'ord-102',
        customerName: 'Samir Verma',
        customerEmail: 'samir.verma@gmail.com',
        shippingAddress: 'Sector 62, Electronic City, Noida, Uttar Pradesh, India',
        phone: '+91 80021 54321',
        items: [],
        totalAmount: 1890,
        paymentMethod: 'UPI Simulator',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
      }
    ];
    localStorage.setItem('shopnexus_orders_db', JSON.stringify(defaultOrders));
    return defaultOrders;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('shopnexus_reviews_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing cached reviews:', e);
      }
    }
    const defaultReviews: Review[] = [
      {
        id: 'rev-1',
        productId: 'prod-1',
        userName: 'Aanya Sen',
        rating: 5,
        comment: 'Brilliant phone! Flagship level performance, battery backup handles coders schedules effortlessly.',
        date: '2026-05-19'
      },
      {
        id: 'rev-2',
        productId: 'prod-2',
        userName: 'Kunal Kapoor',
        rating: 4,
        comment: 'Extremely silent, featherlight weight. Ideal notebook for modern development presentation.',
        date: '2026-05-20'
      }
    ];
    localStorage.setItem('shopnexus_reviews_db', JSON.stringify(defaultReviews));
    return defaultReviews;
  });
  
  // Floating AI drawer toggle
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutWizard, setShowCheckoutWizard] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutCoupon, setCheckoutCoupon] = useState('');

  // Local Storage responsive shopping cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shopnexus_cart_cache');
    return saved ? JSON.parse(saved) : [];
  });

  // Simple Notification Toast Overlay
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize cart with localStorage
  useEffect(() => {
    localStorage.setItem('shopnexus_cart_cache', JSON.stringify(cart));
  }, [cart]);

  // Initial Boot: fetch items from Node Express endpoints if online
  useEffect(() => {
    async function fetchStoreData() {
      try {
        const [pRes, oRes, rRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/reviews')
        ]);
        
        if (pRes.ok && pRes.headers.get('content-type')?.includes('application/json')) {
          const pData = await pRes.json();
          setProducts(pData);
          localStorage.setItem('shopnexus_products_db', JSON.stringify(pData));
        } else {
          throw new Error('Vercel static index redirect fallback');
        }
        if (oRes.ok && oRes.headers.get('content-type')?.includes('application/json')) {
          const oData = await oRes.json();
          setOrders(oData);
          localStorage.setItem('shopnexus_orders_db', JSON.stringify(oData));
        }
        if (rRes.ok && rRes.headers.get('content-type')?.includes('application/json')) {
          const rData = await rRes.json();
          setReviews(rData);
          localStorage.setItem('shopnexus_reviews_db', JSON.stringify(rData));
        }
      } catch (err) {
        console.log('App hydrated using robust client-side localStorage fallback databases (Vercel optimization).');
      }
    }
    fetchStoreData();
  }, []);

  // --- CART MANAGEMENT HANDLERS ---
  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      triggerToast('⚠️ Sorry, product is out of stock!');
      return;
    }

    setCart((prevCart) => {
      const matchIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (matchIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[matchIndex].quantity + 1;
        if (newQty > product.stock) {
          triggerToast(`⚠️ Max available stock is ${product.stock} units`);
          return prevCart;
        }
        updated[matchIndex] = {
          ...updated[matchIndex],
          quantity: newQty
        };
        triggerToast(`Added one more ${product.name} to cart!`);
        return updated;
      } else {
        triggerToast(`Added ${product.name} to cart!`);
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    
    // Check stock boundaries
    const prod = products.find((p) => p.id === productId);
    if (prod && quantity > prod.stock) {
      triggerToast(`⚠️ Stock limits reached! Max ${prod.stock} items`);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    triggerToast('Item removed from cart');
  };

  const handleStartCheckout = (discountPct: number, couponCodeText: string) => {
    setCheckoutDiscount(discountPct);
    setCheckoutCoupon(couponCodeText);
    setShowCheckoutWizard(true);
  };

  // --- BACKEND WRITER ACTIONS ---

  // Order submission
  const handleOrderPlacedCallback = (newOrder: Order) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('shopnexus_orders_db', JSON.stringify(updated));
      return updated;
    });
    setCart([]); // Clear cart
    triggerToast('🎉 Order placed successfully!');
    
    // Refresh products catalog lists or update stock state immediately
    fetch('/api/products')
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
        throw new Error('Offline fallback stock update');
      })
      .then((data) => {
        setProducts(data);
        localStorage.setItem('shopnexus_products_db', JSON.stringify(data));
      })
      .catch((err) => {
        // Fallback local stock update for serverless
        setProducts((prev) => {
          const updated = prev.map((p) => {
            const boughtItem = newOrder.items.find((item) => item.product.id === p.id);
            if (boughtItem) {
              return { ...p, stock: Math.max(0, p.stock - boughtItem.quantity) };
            }
            return p;
          });
          localStorage.setItem('shopnexus_products_db', JSON.stringify(updated));
          return updated;
        });
      });
  };

  // Admin: update delivery state pipeline
  const handleUpdateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    // Optimistic / local update first
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o));
      localStorage.setItem('shopnexus_orders_db', JSON.stringify(updated));
      return updated;
    });
    triggerToast(`Order status updated to "${status}"`);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status })
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Offline');
      }
    } catch (err) {
      console.log('Using persistent local database.');
    }
  };

  // Review: submit review comments
  const handleAddReviewCallback = async (productId: string, userName: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews((prev) => {
      const updated = [newReview, ...prev];
      localStorage.setItem('shopnexus_reviews_db', JSON.stringify(updated));
      return updated;
    });

    // Update rating composite counts locally
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          const totalRating = p.rating * p.reviewCount + rating;
          const newCount = p.reviewCount + 1;
          return {
            ...p,
            reviewCount: newCount,
            rating: Number((totalRating / newCount).toFixed(1))
          };
        }
        return p;
      });
      localStorage.setItem('shopnexus_products_db', JSON.stringify(updated));
      return updated;
    });
    triggerToast('Thank you for leaving a product review!');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userName, rating, comment })
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Offline');
      }
    } catch (err) {
      console.log('Persistent local storage updated.');
    }
  };

  // Admin Product CRUD APIs
  const handleAddProduct = async (prodPayload: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const created: Product = {
      ...prodPayload,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0
    };

    setProducts((prev) => {
      const updated = [...prev, created];
      localStorage.setItem('shopnexus_products_db', JSON.stringify(updated));
      return updated;
    });
    triggerToast(`Master Product "${created.name}" created!`);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodPayload)
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Offline');
      }
    } catch (err) {
      console.log('Saved to local storage.');
    }
  };

  const handleUpdateProduct = async (id: string, updatedParams: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedParams } : p));
      localStorage.setItem('shopnexus_products_db', JSON.stringify(updated));
      return updated;
    });
    const nameText = updatedParams.name || 'Product';
    triggerToast(`Product "${nameText}" specifications updated!`);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedParams)
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Offline');
      }
    } catch (err) {
      console.log('Saved changes locally.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem('shopnexus_products_db', JSON.stringify(updated));
      return updated;
    });
    triggerToast('Product deleted from master lists');

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Offline');
      }
    } catch (err) {
      console.log('Deleted locally.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Absolute Ambient Glowing Radial Blur Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
      </div>
      
      {/* Top sticky Navigation Header */}
      <div className="relative z-10">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cart={cart}
          setIsCartOpen={setIsCartOpen}
          userRole={userRole}
          setUserRole={setUserRole}
        />
      </div>

      {/* Main Responsive Body Canvas wrapper */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 print:p-0">
        
        {/* --- TAB VIEW 1: SHOPSTORE CATALOG --- */}
        {activeTab === 'shop' && (
          <div className="space-y-8">
            
            {/* Conditional Checkout panel banner */}
            {showCheckoutWizard ? (
              <div className="space-y-4">
                <button
                  onClick={() => setShowCheckoutWizard(false)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  &larr; Back to catalog browsing
                </button>
                <CheckoutWizard
                  cart={cart}
                  discountPercentage={checkoutDiscount}
                  couponCode={checkoutCoupon}
                  onClose={() => setShowCheckoutWizard(false)}
                  onOrderPlaced={handleOrderPlacedCallback}
                  onTrackOrder={(id) => {
                    setSelectedTrackingId(id);
                    setActiveTab('track');
                    setShowCheckoutWizard(false);
                  }}
                />
              </div>
            ) : (
              /* Simple Retail Hero Banner */
              <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 -z-10" />
                  <div className="max-w-xl space-y-3.5 text-left">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-widest uppercase">
                      ✨ Intelligent E-Commerce Portfolio
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                      Experience Smart <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Retail Shopping.</span>
                    </h2>
                    <p className="text-xs text-white/60 leading-relaxed max-w-lg">
                      ShopNexus implements a comprehensive product catalog layout, cart checkout triggers, secure CRUD, and an intuitive GenAI smart customer agent.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => setIsAiOpen(true)}
                        className="bg-white hover:bg-blue-50 text-black font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition flex items-center gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                        Consult Store AI
                      </button>
                      <button
                        onClick={() => setActiveTab('track')}
                        className="bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition flex items-center gap-1.5"
                      >
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        Track My Order
                      </button>
                    </div>
                  </div>

                  <div className="h-32 w-32 shrink-0 hidden md:flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md relative shadow-inner">
                    <ShoppingBag className="h-16 w-16 text-blue-400 rotate-12" />
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow">
                      VER 1.2
                    </span>
                  </div>
                </div>

                {/* Primary store list catalog */}
                <ProductCatalog
                  products={products}
                  onAddToCart={handleAddToCart}
                  reviews={reviews}
                  onAddReview={handleAddReviewCallback}
                />
              </div>
            )}

          </div>
        )}

        {/* --- TAB VIEW 2: ADMIN OPERATIONS PANEL --- */}
        {activeTab === 'admin' && (
          <AdminPanel
            products={products}
            orders={orders}
            reviews={reviews}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* --- TAB VIEW 3: CUSTOMER DASHBOARD & ORDER TRACKING --- */}
        {activeTab === 'track' && (
          <CustomerDashboard
            orders={orders}
            onBackToShop={() => setActiveTab('shop')}
            initialTrackingId={selectedTrackingId}
          />
        )}

      </main>

      {/* --- FLOATING SECURE CHAT DECK TRIGGER (Hidden on print) --- */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 print:hidden select-none">
        
        {isAiOpen && (
          <div className="animate-slide-in shadow-2xl rounded-2xl overflow-hidden border border-white/10">
            <AssistantChat onClose={() => setIsAiOpen(false)} />
          </div>
        )}

        {!isAiOpen && (
          <button
            onClick={() => setIsAiOpen(true)}
            className="h-12 w-12 bg-gradient-to-tr from-blue-500 to-purple-500 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer relative"
            title="Ask ShopNexus Advisor"
          >
            <MessageSquare className="h-5.5 w-5.5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 text-[8px] font-bold text-white items-center justify-center">AI</span>
            </span>
          </button>
        )}

      </div>

      {/* --- CART DRAWER SECTION --- */}
      {isCartOpen && (
        <CartDrawer
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onStartCheckout={handleStartCheckout}
        />
      )}

      {/* --- TOAST ALERTS NOTIFICATIONS --- */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0f172a]/90 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-4.5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer disclaimer (Hidden on print) */}
      <footer className="relative z-10 bg-white/5 border-t border-white/10 backdrop-blur-md py-6 mt-12 text-center text-xs text-white/40 print:hidden select-none">
        <p className="font-semibold text-white/60">ShopNexus Premium Smart Store Portfolio</p>
        <p className="mt-1">Handcrafted with modern design patterns, powered by React, Tailwind, and Gemini AI.</p>
      </footer>

    </div>
  );
}
