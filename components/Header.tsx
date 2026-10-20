"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../lib/cart-context';
import { supabase } from '../lib/supabase';
import { Category, Product } from '../lib/types';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  MessageCircle,
  ChevronDown,
  Sparkles,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, toggleCart, wishlist, openWishlist } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Real-time search state
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

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

  // Real-time debounced product search
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await supabase
          .from('products')
          .select('id, name, slug, price, compare_price, cover_image, is_active, rating, weight_options')
          .eq('is_active', true)
          .ilike('name', `%${q}%`)
          .limit(6);

        if (data) {
          setSearchResults(data as Product[]);
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.warn('Real-time search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(target)
      ) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSelectProduct = (slug: string) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    router.push(`/product/${slug}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0E3D2B] border-b border-[#1A573D] shadow-md">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#072418] text-white py-1.5 px-4 text-xs border-b border-white/5">
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
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 relative">
        <div className="relative flex items-center justify-between gap-2 sm:gap-4 h-14 sm:h-20">
          {/* Mobile Menu Toggle (Left on Mobile) */}
          <div className="lg:hidden flex items-center z-10">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-[#FAF6EC] hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Official Transparent Logo (Desktop Left-Aligned) */}
          <div className="hidden lg:flex items-center">
            <Link href="/" className="flex items-center space-x-3 shrink-0 py-1">
              <img
                src="/logo.png"
                alt="Bin Riaz Foods Logo"
                className="h-16 sm:h-20 w-auto object-contain transition-all duration-300 hover:scale-105"
                style={{
                  maxHeight: '74px',
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.4)) drop-shadow(0 0 10px rgba(212,175,85,0.35))',
                }}
              />
            </Link>
          </div>

          {/* Mobile Logo: Contained strictly inside the top row (centered vertically & horizontally, completely above search bar) */}
          <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-auto z-10 flex items-center justify-center">
            <Link href="/" className="flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Bin Riaz Foods Logo"
                className="h-13 sm:h-14 w-auto object-contain transition-all"
                style={{
                  maxHeight: '52px',
                  width: 'auto',
                  filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.5)) drop-shadow(0 0 8px rgba(212,175,85,0.4))',
                }}
              />
            </Link>
          </div>

          {/* Search Bar with Instant Real-Time Dropdown (Desktop) */}
          <div ref={desktopSearchRef} className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setShowSearchDropdown(true);
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pure spices, dry fruits, dates, honey, desi ghee..."
                className="w-full bg-white/95 text-gray-900 placeholder-gray-500 rounded-full py-2.5 pl-5 pr-12 text-sm border border-[#D4AF55]/40 focus:outline-hidden focus:border-[#D4AF55] focus:bg-white transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#D4AF55] hover:bg-[#c29e46] text-[#06291B] rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer font-bold"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#06291B]" />
                ) : (
                  <Search className="w-4 h-4 text-[#06291B]" />
                )}
              </button>
            </form>

            {/* Desktop Real-Time Search Results Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E5E1D6] overflow-hidden z-50 animate-fadeIn">
                <div className="p-3 bg-[#FAF6EC] border-b border-[#E5E1D6] flex items-center justify-between text-xs font-bold text-[#0B3826]">
                  <span>Matching Products ({searchResults.length})</span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-gray-400 hover:text-red-500 text-[11px] cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E1D6]/50">
                  {searchResults.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-500">
                      No products found for &ldquo;{searchQuery}&rdquo;.
                      <div className="mt-2 text-[11px] text-[#0B3826] font-semibold">
                        Try searching: Garam Masala, Badam, Ajwa, Sidr Honey
                      </div>
                    </div>
                  ) : (
                    searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod.slug)}
                        className="p-3 flex items-center gap-3 hover:bg-[#FAF6EC] transition-colors cursor-pointer group"
                      >
                        <img
                          src={prod.cover_image || '/hero-banner.png'}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover bg-white border border-[#E5E1D6] group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#0B3826] group-hover:text-[#D4AF55] truncate transition-colors">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] text-gray-400">
                            {prod.weight_options && prod.weight_options.join(' • ')}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-[#0B3826]">
                            Rs. {Number(prod.price).toLocaleString()}
                          </div>
                          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                            In Stock
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {searchResults.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full p-2.5 bg-[#0B3826] hover:bg-[#18583A] text-white text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                  >
                    <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* WhatsApp Contact Direct */}
            <a
              href="https://wa.me/923456001913?text=Salam%20Bin%20Riaz%20Foods"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#FAF6EC] rounded-full text-xs font-semibold border border-[#D4AF55]/40 transition-colors shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {/* Saved Wishlist Link to Full Page */}
            <Link
              href="/wishlist"
              className="relative p-2 text-[#FAF6EC] hover:text-red-400 transition-colors cursor-pointer"
              title="Saved wishlist items"
            >
              <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${wishlist.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button with Count Badge */}
            <button
              onClick={toggleCart}
              className="relative flex items-center space-x-2 bg-[#D4AF55] hover:bg-[#c29e46] text-[#06291B] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-md transition-all cursor-pointer font-bold"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#06291B]" />
              <span className="hidden sm:inline text-xs font-bold">Bag</span>
              <span className="bg-[#0B3826] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Real-Time Search Bar cleanly separated below */}
        <div ref={mobileSearchRef} className="mt-2.5 md:hidden relative pb-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setShowSearchDropdown(true);
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spices, dry fruits, honey, dates..."
              className="w-full bg-white text-gray-900 placeholder-gray-500 border border-[#D4AF55]/40 rounded-full py-2.5 pl-4 pr-10 text-xs focus:outline-hidden focus:border-[#D4AF55] shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#D4AF55] text-[#06291B] rounded-full flex items-center justify-center font-bold"
            >
              {isSearching ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#06291B]" />
              ) : (
                <Search className="w-3.5 h-3.5 text-[#06291B]" />
              )}
            </button>
          </form>

          {/* Mobile Real-Time Search Results Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E5E1D6] overflow-hidden z-50 animate-fadeIn">
              <div className="p-2.5 bg-[#FAF6EC] border-b border-[#E5E1D6] flex items-center justify-between text-[11px] font-bold text-[#0B3826]">
                <span>Matching Products ({searchResults.length})</span>
                <button
                  onClick={() => setShowSearchDropdown(false)}
                  className="text-gray-400 hover:text-red-500 text-[10px]"
                >
                  Close
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-[#E5E1D6]/50">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    No products found for &ldquo;{searchQuery}&rdquo;.
                  </div>
                ) : (
                  searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod.slug)}
                      className="p-2.5 flex items-center gap-2.5 hover:bg-[#FAF6EC] transition-colors cursor-pointer"
                    >
                      <img
                        src={prod.cover_image || '/hero-banner.png'}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover bg-white border border-[#E5E1D6]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#0B3826] truncate">
                          {prod.name}
                        </h4>
                        <div className="text-[11px] font-black text-[#0B3826]">
                          Rs. {Number(prod.price).toLocaleString()}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                        In Stock
                      </span>
                    </div>
                  ))
                )}
              </div>

              {searchResults.length > 0 && (
                <button
                  onClick={handleSearchSubmit}
                  className="w-full p-2 bg-[#0B3826] text-white text-[11px] font-bold flex items-center justify-center space-x-1"
                >
                  <span>View all results &rarr;</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Desktop Category Navigation Bar */}
      <nav className="hidden lg:block bg-[#092D20] border-t border-[#174F37]">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-6 text-xs font-bold text-white/90 py-2.5">
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
              <div className="absolute top-full left-0 w-64 bg-white border border-[#E5E1D6] rounded-xl shadow-xl py-2 z-50 animate-fadeIn text-gray-800">
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
            className="hover:text-[#D4AF55] transition-colors py-1 flex items-center space-x-1 text-white/90"
          >
            <Sparkles className="w-3 h-3 text-[#D4AF55]" />
            <span>Luxury Gift Hampers</span>
          </Link>

          <Link
            href="/shop?category=chocolates-confectionery"
            className="hover:text-[#D4AF55] transition-colors py-1 text-white/90"
          >
            Chocolates
          </Link>

          <Link
            href="/shop?category=combo-packs"
            className="hover:text-[#E8CB7A] transition-colors py-1 text-[#D4AF55] font-black"
          >
            Special Offers & Combos
          </Link>

          <Link
            href="/about"
            className={`hover:text-[#D4AF55] transition-colors py-1 text-white/90 ${
              pathname === '/about' ? 'text-[#D4AF55] border-b-2 border-[#D4AF55]' : ''
            }`}
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className={`hover:text-[#D4AF55] transition-colors py-1 text-white/90 ${
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
              <div className="p-1.5 bg-[#0E3D2B] rounded-2xl shadow-sm flex items-center">
                <img
                  src="/logo.png"
                  alt="Bin Riaz Foods Logo"
                  className="h-12 w-auto object-contain"
                  style={{
                    maxHeight: '50px',
                    width: 'auto',
                    filter: 'drop-shadow(0 2px 8px rgba(212,175,85,0.4))',
                  }}
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-bold text-[#0B3826] hover:bg-[#FAF6EC] rounded-xl"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-bold text-[#0B3826] hover:bg-[#FAF6EC] rounded-xl"
              >
                Shop All Products
              </Link>
              <Link
                href="/shop?category=gift-hampers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-bold text-[#0B3826] hover:bg-[#FAF6EC] rounded-xl"
              >
                Luxury Gift Hampers
              </Link>
              <Link
                href="/shop?category=combo-packs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50 rounded-xl"
              >
                Special Offers & Combos
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-bold text-[#0B3826] hover:bg-[#FAF6EC] rounded-xl"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-bold text-[#0B3826] hover:bg-[#FAF6EC] rounded-xl"
              >
                Contact
              </Link>
              <Link
                href="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-bold text-[#0B3826] hover:bg-[#FAF6EC] rounded-xl"
              >
                Track Order
              </Link>

              <div className="pt-4 border-t border-[#E5E1D6]">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  Top Categories
                </h4>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#0B3826]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="pt-4 border-t border-[#E5E1D6] space-y-2">
              <a
                href="https://wa.me/923456001913?text=Salam%20Bin%20Riaz%20Foods"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Order Support</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
