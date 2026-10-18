"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../lib/cart-context';
import { supabase } from '../../lib/supabase';
import { Product } from '../../lib/types';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, clearCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', wishlist);

        if (!error && data) {
          setProducts(data as Product[]);
        }
      } catch (err) {
        console.warn('Error fetching wishlist products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlistProducts();
  }, [wishlist]);

  const handleAddSingle = (product: Product) => {
    addToCart(product);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  const handleAddAllToCart = () => {
    products.forEach((p) => addToCart(p, undefined, 1, false));
    alert('All wishlist items moved to your shopping bag!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-14 space-y-8">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="text-xs text-gray-500 flex items-center space-x-2 mb-3">
          <Link href="/" className="hover:text-[#0B3826]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#0B3826] font-semibold">Wishlist</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E5E1D6]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-xs">
              <Heart className="w-6 h-6 fill-red-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B3826]">
                My Saved Wishlist
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {products.length} {products.length === 1 ? 'product' : 'products'} saved in your list
              </p>
            </div>
          </div>

          {products.length > 0 && (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddAllToCart}
                className="px-5 py-2.5 bg-[#0B3826] hover:bg-[#18583A] text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Bag</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading Shimmer */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 sm:h-72 bg-white rounded-2xl shimmer-flash" />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B3826]">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            You haven&apos;t saved any pure spices, luxury dry fruits, dates, or honey jars yet. Browse our catalog and click the heart icon on any product to save it here.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-7 py-3.5 bg-[#0B3826] hover:bg-[#18583A] text-white rounded-full text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Products Grid (2 columns on mobile, matching homepage bestseller cards) */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => {
            const isAdded = addedIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl p-2.5 sm:p-4 border border-[#E5E1D6] hover:border-[#D4AF55] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative">
                  {/* Remove Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 p-1.5 sm:p-2 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full shadow-xs transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Image */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="block relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF6EC] mb-2 sm:mb-3"
                  >
                    <img
                      src={product.cover_image || '/hero-banner.png'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#D4AF55]">
                    {product.weight_options && product.weight_options[0]}
                  </span>

                  <Link href={`/product/${product.slug}`} className="block">
                    <h3 className="font-bold text-[#0B3826] text-xs sm:text-sm leading-tight sm:leading-snug line-clamp-2 min-h-[2rem] hover:text-[#D4AF55] transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 pt-1 sm:pt-2">
                    <div>
                      <div className="text-xs sm:text-base font-black text-[#0B3826]">
                        Rs. {Number(product.price).toLocaleString()}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-green-700">
                        In Stock
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddSingle(product)}
                      className={`w-full sm:w-auto px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center space-x-1 sm:space-x-1.5 shadow-xs cursor-pointer ${
                        isAdded
                          ? 'bg-green-700 text-white'
                          : 'bg-[#0B3826] hover:bg-[#18583A] text-white hover:shadow-md'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
