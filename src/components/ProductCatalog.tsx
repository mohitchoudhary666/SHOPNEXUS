/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, Review } from '../types';
import { Search, Star, Filter, Heart, ArrowLeft, Send, CheckCircle, Package } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  reviews: Review[];
  onAddReview: (productId: string, userName: string, rating: number, comment: string) => Promise<void>;
}

export default function ProductCatalog({
  products,
  onAddToCart,
  reviews,
  onAddReview
}: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(60000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  
  // Product Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Custom Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Get distinct categories
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter & Sort Logic
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // 'featured' leaves original order
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!reviewName || !reviewComment) return;

    setReviewSubmitting(true);
    try {
      await onAddReview(selectedProduct.id, reviewName, reviewRating, reviewComment);
      setReviewSuccess(true);
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
      // Brief success feedback then update selectedProduct state reference
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const productReviews = selectedProduct 
    ? reviews.filter((r) => r.productId === selectedProduct.id) 
    : [];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Side Filters Panel */}
      <aside className="w-full lg:w-64 shrink-0 bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl h-fit">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-sans text-sm font-bold text-white flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-400" />
            Filters & Sorting
          </h2>
          {(searchQuery || selectedCategory !== 'All' || maxPrice !== 60000) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMaxPrice(60000);
                setSortBy('featured');
              }}
              className="text-xs text-blue-400 font-bold hover:text-blue-300 hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-white/60 mb-2">Search Catalog</label>
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50 focus:bg-white/10 transition"
            />
          </div>
        </div>

        {/* Categories list */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-white/60 mb-2">Categories</label>
          <div className="flex flex-wrap lg:flex-col gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-white/60 hover:bg-white/5 border border-transparent hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-white/60 mb-2">
            <span>Price Limit</span>
            <span className="font-mono text-blue-300 font-bold">₹{maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="60000"
            step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-white/40 mt-1">
            <span>₹1K</span>
            <span>₹30K</span>
            <span>₹60K</span>
          </div>
        </div>

        {/* Sort drop flag */}
        <div>
          <label className="block text-xs font-semibold text-white/60 mb-2">Sort Results</label>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500/50 transition cursor-pointer"
          >
            <option value="featured" className="bg-[#0f172a] text-white">Featured / Default</option>
            <option value="price-low" className="bg-[#0f172a] text-white">Price: Low to High</option>
            <option value="price-high" className="bg-[#0f172a] text-white">Price: High to Low</option>
            <option value="rating" className="bg-[#0f172a] text-white">Rating: High Reviews</option>
          </select>
        </div>
      </aside>

      {/* Main E-commerce Catalog Grid */}
      <section className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-mono text-white/50">
            Showing <strong className="text-white font-bold">{filteredProducts.length}</strong> products matching your filters
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-12 text-center">
            <Package className="h-10 w-10 text-white/40 mx-auto mb-3 animate-bounce" />
            <h3 className="text-sm font-bold text-white mb-1">No products found</h3>
            <p className="text-xs text-white/50">Try adjusting your pricing filter or search criteria to view store items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300 relative backdrop-blur-xl"
              >
                {/* Category Badge */}
                <span className="absolute top-3 left-3 z-10 bg-slate-950/80 backdrop-blur shadow-sm text-white text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-lg uppercase border border-white/10">
                  {product.category}
                </span>

                {/* Stock Warning Badge */}
                {product.stock <= 10 && (
                  <span className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow">
                    Low Stock: {product.stock}
                  </span>
                )}

                {/* Image Wrap */}
                <div 
                  onClick={() => setSelectedProduct(product)} 
                  className="aspect-video w-full bg-slate-950/40 relative overflow-hidden cursor-pointer border-b border-white/5"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>

                {/* Info Text */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mb-1.5">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{product.rating}</span>
                      <span className="text-white/40 font-normal">({product.reviewCount} reviews)</span>
                    </div>

                    <h3 
                      onClick={() => setSelectedProduct(product)} 
                      className="font-sans text-sm font-bold text-white group-hover:text-blue-400 transition cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-white/40 font-semibold">MRP inclusive of tax</p>
                      <p className="text-base font-bold text-blue-300 font-mono">₹{product.price.toLocaleString()}</p>
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer ${
                        product.stock === 0
                          ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white active:scale-95 shadow-blue-500/10'
                      }`}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Detailed Modal Drawer Window --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0f172a]/95 border border-white/10 backdrop-blur-2xl h-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/5">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 text-blue-400" />
                Back to catalog
              </button>
              <span className="text-[10px] font-mono bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold px-2 py-1 rounded">
                Product Specs Drawer
              </span>
            </div>

            {/* Modal Scroll Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Product Hero Layout */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/2 aspect-video sm:aspect-square bg-slate-950/40 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="bg-white/10 border border-white/10 text-white text-[10px] font-extrabold tracking-wide px-2.5 py-1 rounded-lg uppercase">
                      {selectedProduct.category}
                    </span>
                    <h3 className="font-sans text-lg font-bold text-white mt-2">{selectedProduct.name}</h3>
                    <p className="text-xl font-bold font-mono text-blue-300 mt-1">₹{selectedProduct.price.toLocaleString()}</p>
                    
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mt-3">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{selectedProduct.rating} Out of 5</span>
                      <span className="text-white/40 font-normal">({selectedProduct.reviewCount} customer reviews)</span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-mono text-white/50 flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-blue-400" />
                      Physical Stock Count: <strong className="text-white">{selectedProduct.stock} units</strong>
                    </p>
                    <button
                      onClick={() => onAddToCart(selectedProduct)}
                      disabled={selectedProduct.stock === 0}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer ${
                        selectedProduct.stock === 0
                          ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white active:scale-95'
                      }`}
                    >
                      {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add into Shopping Cart'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Long Description */}
              <div>
                <h4 className="text-sm font-bold text-white mb-2 border-b border-white/10 pb-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Product Overview
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Technical Specifications Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 p-5 rounded-xl border border-white/10">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-white/40 tracking-wider mb-2">Bullet Highlights</h4>
                  <ul className="text-xs text-white/80 space-y-1.5 list-disc list-inside">
                    {selectedProduct.features.map((feature, idx) => (
                      <li key={idx} className="line-clamp-2">{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-white/40 tracking-wider mb-2">System Specs (Relational Map)</h4>
                  <div className="space-y-1.5">
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-xs border-b border-white/5 pb-1">
                        <span className="text-white/50 font-medium">{key}</span>
                        <span className="text-blue-300 font-bold text-right pl-2">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews & Feedback Module */}
              <div>
                <h4 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" /> Customer Reviews
                </h4>
                
                {/* Review Feed */}
                <div className="space-y-4 mb-6">
                  {productReviews.length === 0 ? (
                    <p className="text-xs text-white/40 italic">No reviews yet. Be the first to provide feedback on this academic asset!</p>
                  ) : (
                    productReviews.map((rev) => (
                      <div key={rev.id} className="bg-white/5 p-4 border border-white/10 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-white">{rev.userName}</span>
                          <span className="text-[10px] font-mono text-white/40">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400 mb-2">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-3 w-3 ${idx < rev.rating ? 'fill-current' : 'text-white/10'}`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-white/70 italic">"{rev.comment}"</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Submitting New Review Form */}
                <form onSubmit={handleReviewSubmit} className="border border-white/10 bg-white/5 p-5 rounded-2xl space-y-4">
                  <h5 className="text-xs font-bold text-white">Add Your Evaluator Review (Saves to server memory)</h5>
                  
                  {reviewSuccess && (
                     <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-emerald-300 text-xs shadow-lg">
                       <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                       <span>Review saved successfully! Ratings will recalculate dynamically on screen.</span>
                     </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-white/50 uppercase mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Satish Pal"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-white/50 uppercase mb-1">Rating Stars</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 cursor-pointer"
                      >
                        <option value="5" className="bg-[#0f172a]">⭐⭐⭐⭐⭐ 5 Stars</option>
                        <option value="4" className="bg-[#0f172a]">⭐⭐⭐⭐ 4 Stars</option>
                        <option value="3" className="bg-[#0f172a]">⭐⭐⭐ 3 Stars</option>
                        <option value="2" className="bg-[#0f172a]">⭐⭐ 2 Stars</option>
                        <option value="1" className="bg-[#0f172a]">⭐ 1 Star</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-white/50 uppercase mb-1">Review Comments</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write your feedback..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    <Send className="h-3 w-3" />
                    {reviewSubmitting ? 'Saving...' : 'Submit Review'}
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
