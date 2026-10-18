"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../lib/cart-context';
import { Home, Grid, ShoppingBag, Heart, MessageCircle } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, toggleCart, wishlist, openWishlist } = useCart();

  // Hide on admin panel
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D4AF55]/40 rounded-t-2xl py-2 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around text-[10px] font-bold text-[#0B3826]">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center space-y-1 py-1 transition-colors ${
            pathname === '/' ? 'text-[#0B3826] font-black' : 'text-gray-500 hover:text-[#0B3826]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${pathname === '/' ? 'bg-[#D4AF55]/20 text-[#0B3826]' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span>Home</span>
        </Link>

        {/* Shop Catalog */}
        <Link
          href="/shop"
          className={`flex flex-col items-center space-y-1 py-1 transition-colors ${
            pathname.startsWith('/shop')
              ? 'text-[#0B3826] font-black'
              : 'text-gray-500 hover:text-[#0B3826]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${pathname.startsWith('/shop') ? 'bg-[#D4AF55]/20 text-[#0B3826]' : ''}`}>
            <Grid className="w-5 h-5" />
          </div>
          <span>Shop</span>
        </Link>

        {/* Cart Drawer Trigger */}
        <button
          onClick={toggleCart}
          className="flex flex-col items-center space-y-1 py-1 text-gray-500 hover:text-[#0B3826] relative cursor-pointer"
        >
          <div className="p-1 rounded-xl relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF55] text-[#06291B] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span>Bag</span>
        </button>

        {/* Saved Wishlist Drawer Trigger */}
        <button
          onClick={openWishlist}
          className="flex flex-col items-center space-y-1 py-1 text-gray-500 hover:text-red-500 relative cursor-pointer"
        >
          <div className="p-1 rounded-xl relative">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </div>
          <span>Saved</span>
        </button>

        {/* 1-Tap WhatsApp Support */}
        <a
          href="https://wa.me/923456001913?text=Salam%20Bin%20Riaz%20Foods"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center space-y-1 text-[#25D366] hover:opacity-80"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Support</span>
        </a>
      </div>
    </div>
  );
}
