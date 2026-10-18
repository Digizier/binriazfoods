"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../lib/cart-context';
import { supabase } from '../lib/supabase';
import { Category } from '../lib/types';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Phone,
  MessageCircle,
  ChevronDown,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, toggleCart, wishlist } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // If on admin routes, do NOT show the storefront header!
  if (pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await supabase
          .from('categories')
          .select('id, name, slug, parent_id, sort_order, is_active')
          .is('parent_id', null)
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .limit(12);

        if (data) setCategories(data as Category[]);
      } catch (e) {
        console.warn('Categories fetch notice:', e);
      }
    }
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E1D6] shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#0B3826] text-white py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[11px] sm:text-xs">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF55] animate-ping" />
            <span className="font-medium text-white/90">
              Nationwide Delivery Across Pakistan | <strong>Pure Goodness, Every Home</strong>
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-4 mt-1 sm:mt-0 text-white/80">
            <a
              href="https://wa.me/923456001913?text=Salam%20Bin%20Riaz%20Foods"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 hover:text-[#D4AF55] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>0345 6001913</span>
            </a>
            <span className="text-white/30">|</span>
            <Link
              href="/admin"
              className="hover:text-[#D4AF55] transition-colors flex items-center space-x-1"
              prefetch={false}
            >
              <span>Portal Access</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Branding & Search Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#0B3826] hover:bg-gray-100 rounded-xl"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Official Transparent Logo */}
          <Link href="/" className="flex items-center space-x-3 shrink-0">
            <img
              src="/logo.png"
              alt="Bin Riaz Foods Logo"
              className="h-12 sm:h-16 w-auto object-contain"
              style={{ maxHeight: '56px', width: 'auto' }}
            />
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4 relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for pure spices, dry fruits, dates, honey, desi ghee..."
              className="w-full bg-[#FAF6EC] border border-[#E5E1D6] rounded-full py-2.5 pl-5 pr-12 text-sm text-gray-800 placeholder-gray-500 focus:outline-hidden focus:border-[#D4AF55] focus:bg-white transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#0B3826] hover:bg-[#18583A] text-white rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* WhatsApp Contact Direct */}
            <a
              href="https://wa.me/923456001913?text=Salam%20Bin%20Riaz%20Foods"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF6EC] hover:bg-[#eae3d5] text-[#0B3826] rounded-full text-xs font-semibold border border-[#E5E1D6] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {/* Wishlist Icon */}
            <Link
              href="/shop"
              className="relative p-2 text-gray-700 hover:text-[#0B3826] transition-colors"
              title="Saved items"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#D4AF55] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button with Count Badge */}
            <button
              onClick={toggleCart}
              className="relative flex items-center space-x-2 bg-[#0B3826] hover:bg-[#18583A] text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-md transition-all cursor-pointer"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-xs font-bold">Bag</span>
              <span className="bg-[#D4AF55] text-[#0B3826] text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <form onSubmit={handleSearch} className="mt-3 md:hidden relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search spices, dry fruits, honey..."
            className="w-full bg-[#FAF6EC] border border-[#E5E1D6] rounded-full py-2 pl-4 pr-10 text-xs text-gray-800 placeholder-gray-500 focus:outline-hidden focus:border-[#D4AF55]"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-[#0B3826] text-white rounded-full flex items-center justify-center"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* 3. Bottom Desktop Category Navigation Bar */}
      <nav className="hidden lg:block bg-[#FAF6EC] border-t border-[#E5E1D6]">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-6 text-xs font-bold text-[#0B3826] py-2.5">
          <Link
            href="/"
            className={`hover:text-[#D4AF55] transition-colors py-1 ${
              pathname === '/' ? 'text-[#D4AF55] border-b-2 border-[#D4AF55]' : ''
            }`}
          >
            Home
          </Link>

          <Link
            href="/shop"
            className={`hover:text-[#D4AF55] transition-colors py-1 ${
              pathname === '/shop' ? 'text-[#D4AF55] border-b-2 border-[#D4AF55]' : ''
            }`}
          >
            Shop All
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button className="flex items-center space-x-1 hover:text-[#D4AF55] transition-colors py-1 cursor-pointer">
              <span>Categories</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-[#E5E1D6] rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#0B3826] transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/shop?category=gift-hampers"
            className="hover:text-[#D4AF55] transition-colors py-1 flex items-center space-x-1 text-[#0B3826]"
          >
            <Sparkles className="w-3 h-3 text-[#D4AF55]" />
            <span>Luxury Gift Hampers</span>
          </Link>

          <Link
            href="/shop?category=chocolates-confectionery"
            className="hover:text-[#D4AF55] transition-colors py-1"
          >
            Chocolates
          </Link>

          <Link
            href="/shop?category=combo-packs"
            className="hover:text-[#D4AF55] transition-colors py-1 text-red-700"
          >
            Special Offers & Combos
          </Link>

          <Link
            href="/about"
            className={`hover:text-[#D4AF55] transition-colors py-1 ${
              pathname === '/about' ? 'text-[#D4AF55] border-b-2 border-[#D4AF55]' : ''
            }`}
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className={`hover:text-[#D4AF55] transition-colors py-1 ${
              pathname === '/contact' ? 'text-[#D4AF55] border-b-2 border-[#D4AF55]' : ''
            }`}
          >
            Contact
          </Link>
        </div>
      </nav>

      {/* 4. Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full flex flex-col p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E1D6]">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 text-sm font-bold text-[#0B3826]">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 border-b border-gray-100"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 border-b border-gray-100"
              >
                Shop All Products
              </Link>
              <Link
                href="/shop?category=gift-hampers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 border-b border-gray-100 text-[#D4AF55]"
              >
                Luxury Gift Hampers
              </Link>
              <Link
                href="/shop?category=combo-packs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 border-b border-gray-100 text-red-600"
              >
                Special Offers & Combos
              </Link>

              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block mb-2">
                  All Categories
                </span>
                <div className="space-y-1 pl-2 font-medium text-xs text-gray-700">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1.5 hover:text-[#0B3826]"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-xs font-semibold text-gray-600"
                >
                  About Bin Riaz Foods
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-xs font-semibold text-gray-600"
                >
                  Contact Helpline & Location
                </Link>
              </div>
            </div>

            {/* Mobile Drawer Bottom Info */}
            <div className="pt-4 border-t border-[#E5E1D6] text-xs text-gray-500">
              <p className="font-semibold text-[#0B3826]">Customer Helpline:</p>
              <p>0345 6001913 | 0321 6001913</p>
              <p className="text-[10px] mt-1 text-gray-400">Sargodha, Punjab, Pakistan</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
