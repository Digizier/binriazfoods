"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/cart-context';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import { Heart, X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistDrawer() {
  const { wishlist, toggleWishlist, isWishlistOpen, closeWishlist, addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadWishlistItems() {
      if (wishlist.length === 0) {
        setWishlistProducts([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', wishlist);

        if (!error && data) {
          setWishlistProducts(data as Product[]);
        }
      } catch (err) {
        console.warn('Could not fetch wishlist products:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isWishlistOpen) {
      loadWishlistItems();
    }
  }, [wishlist, isWishlistOpen]);

  if (!isWishlistOpen) return null;

  const handleAddAndNotify = (product: Product) => {
    addToCart(product);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF6EC] shadow-2xl flex flex-col border-l border-[#E5E1D6]">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#E5E1D6] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-50 text-red-500 rounded-full">
                <Heart className="w-5 h-5 fill-red-500" />
              </div>
              <div>
                <h2 className="font-bold text-base text-[#0B3826]">Saved Wishlist</h2>
                <p className="text-xs text-gray-500">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>

            <button
              onClick={closeWishlist}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close Wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-white rounded-2xl shimmer-flash" />
                ))}
              </div>
            ) : wishlist.length === 0 || wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-[#0B3826]">Your Wishlist is Empty</h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  Tap the heart icon on any pure spices, dry fruits, dates, or honey jars to save them here for later.
                </p>
                <Link
                  href="/shop"
                  onClick={closeWishlist}
                  className="px-6 py-3 bg-[#0B3826] hover:bg-[#18583A] text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              wishlistProducts.map((product) => {
                const isItemAdded = addedIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="p-3.5 bg-white rounded-2xl border border-[#E5E1D6] flex items-center gap-3 shadow-xs hover:border-[#D4AF55] transition-all"
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={closeWishlist}
                      className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[#FAF6EC] border border-[#E5E1D6]"
                    >
                      <img
                        src={product.cover_image || '/hero-banner.png'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closeWishlist}
                        className="block font-bold text-xs sm:text-sm text-[#0B3826] hover:text-[#D4AF55] truncate transition-colors"
                      >
                        {product.name}
                      </Link>
                      <div className="text-xs font-black text-[#0B3826] mt-0.5">
                        Rs. {Number(product.price).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-green-700 font-semibold">
                        In Stock
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => handleAddAndNotify(product)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isItemAdded
                            ? 'bg-green-700 text-white'
                            : 'bg-[#0B3826] hover:bg-[#18583A] text-white'
                        }`}
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-4 bg-white border-t border-[#E5E1D6] space-y-2">
              <Link
                href="/shop"
                onClick={closeWishlist}
                className="w-full py-3 bg-[#0B3826] hover:bg-[#18583A] text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
