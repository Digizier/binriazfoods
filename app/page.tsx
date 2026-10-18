"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { Product, Category, HeroBanner } from '../lib/types';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton, CategoryCircleSkeleton } from '../components/ShimmerSkeleton';
import {
  ArrowRight,
  Sparkles,
  Gift,
  Heart,
  Award,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      try {
        // 1. Fetch categories
        const { data: cats } = await supabase
          .from('categories')
          .select('id, name, slug, image_url, parent_id, sort_order, is_active')
          .is('parent_id', null)
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .limit(12);

        if (cats) setCategories(cats as Category[]);

        // 2. Fetch featured bestselling products
        const { data: prods } = await supabase
          .from('products')
          .select('id, name, slug, sku, category_id, description, price, compare_price, stock, weight_options, cover_image, is_featured, is_active, rating, review_count')
          .eq('is_active', true)
          .order('is_featured', { ascending: false })
          .limit(8);

        if (prods) setBestsellers(prods as Product[]);

        // 3. Fetch active hero banners
        const { data: banners } = await supabase
          .from('hero_banners')
          .select('id, title, subtitle, image_url, cta_text, cta_link, sort_order, is_active')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .limit(1);

        if (banners && banners.length > 0) setHeroBanners(banners as HeroBanner[]);
      } catch (err) {
        console.warn('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const activeBanner = heroBanners[0] || {
    title: 'Pure Goodness, Every Home',
    subtitle:
      'Discover carefully selected food essentials, premium treats and thoughtful gifts for every occasion.',
    image_url: '/hero-banner.png',
    cta_text: 'Shop All Products',
    cta_link: '/shop',
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* SECTION 1: LUXURY HERO BANNER */}
      <section className="relative bg-[#06291B] text-[#FAF6EC] overflow-hidden border-b-2 border-[#D4AF55]">
        <div className="absolute inset-0 bg-radial from-[#18583A]/30 via-transparent to-transparent opacity-60" />

        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full border border-[#D4AF55]/40 text-[#D4AF55] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premium Packaged Food Brand</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Pure Goodness, <br />
                <span className="text-[#D4AF55] italic">Every Home.</span>
              </h1>

              <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
                {activeBanner.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href={activeBanner.cta_link || '/shop'}
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#D4AF55] hover:bg-[#E8CB7A] text-[#06291B] font-black rounded-full shadow-lg transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
                >
                  <span>{activeBanner.cta_text || 'Shop All Products'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/shop?category=gift-hampers"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-[#D4AF55]/60 transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Gift className="w-4 h-4 text-[#D4AF55]" />
                  <span>Explore Gift Hampers</span>
                </Link>
              </div>

              {/* Quick Perks */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-white/70">
                <span className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF55] mr-1.5" />
                  100% Food-Grade Packaging
                </span>
                <span className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF55] mr-1.5" />
                  Cash on Delivery & JazzCash
                </span>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-lg aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF55]/30 bg-[#0B3826]">
                <img
                  src={activeBanner.image_url || '/hero-banner.png'}
                  alt="Bin Riaz Foods Premium Range"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs p-3 bg-black/40 backdrop-blur-xs rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-[#D4AF55]">BIN RIAZ FOODS</p>
                    <p className="text-[11px] text-white/80">Authentic Taste · Trusted by Families</p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#D4AF55] text-[#06291B] font-black text-[10px] rounded-md">
                    PAKISTAN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SHOP BY CATEGORY (CIRCULAR ICONS) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF55]">
            Handpicked Selections
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B3826] mt-1">
            Shop by Category
          </h2>
          <div className="w-16 h-1 bg-[#D4AF55] mx-auto mt-2 rounded-full" />
        </div>

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategoryCircleSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => {
              const fallbackImg =
                cat.slug.includes('spice') || cat.slug.includes('masala')
                  ? '/categories/spices-masalas.jpg'
                  : cat.slug.includes('dry') || cat.slug.includes('nut')
                  ? '/categories/dry-fruits-nuts.jpg'
                  : cat.slug.includes('date')
                  ? '/categories/dates.jpg'
                  : cat.slug.includes('honey')
                  ? '/categories/honey-natural-foods.jpg'
                  : cat.slug.includes('ghee') || cat.slug.includes('oil') || cat.slug.includes('butter')
                  ? '/categories/desi-ghee-edible-oils.jpg'
                  : cat.slug.includes('pulse') || cat.slug.includes('grain') || cat.slug.includes('rice') || cat.slug.includes('lentil')
                  ? '/categories/pulses-grains.jpg'
                  : cat.slug.includes('hamper') || cat.slug.includes('gift')
                  ? '/categories/luxury-gift-hampers.jpg'
                  : cat.slug.includes('choc') || cat.slug.includes('sweet') || cat.slug.includes('tea')
                  ? '/categories/chocolates-confectionery.jpg'
                  : cat.slug.includes('pickle') || cat.slug.includes('achar')
                  ? '/categories/pickles-condiments.jpg'
                  : cat.slug.includes('combo')
                  ? '/categories/combos-super-savers.jpg'
                  : '/categories/spices-masalas.jpg';

              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group flex flex-col items-center text-center space-y-2 p-2 rounded-2xl transition-all hover:bg-white hover:shadow-md border border-transparent hover:border-[#E5E1D6]"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FAF6EC] border-2 border-[#E5E1D6] group-hover:border-[#D4AF55] group-hover:scale-105 transition-all flex items-center justify-center overflow-hidden shadow-xs relative">
                    <img
                      src={cat.image_url || fallbackImg}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#0B3826] group-hover:text-[#D4AF55] transition-colors line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 3: BESTSELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-[#E5E1D6] pb-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF55]">
              <Sparkles className="w-4 h-4" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B3826] mt-0.5">
              Bestselling Products
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#0B3826] hover:text-[#D4AF55] transition-colors"
          >
            <span>View All Products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4: 4 PROMOTIONAL HIGHLIGHT CARDS (AS IN VISUAL BLUEPRINT) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Luxury Gift Hampers */}
          <Link
            href="/shop?category=gift-hampers"
            className="group relative bg-[#0B3826] text-white rounded-2xl p-6 overflow-hidden shadow-lg border border-[#D4AF55]/40 hover:shadow-2xl transition-all"
          >
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF55]">
                Special Celebrations
              </span>
              <h3 className="text-lg font-black leading-tight">
                Luxury Gift Hampers
              </h3>
              <p className="text-xs text-white/70">Perfect for every occasion & wedding</p>
              <div className="pt-2">
                <span className="inline-flex items-center text-xs font-bold text-[#D4AF55] group-hover:underline">
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all pointer-events-none">
              <Gift className="w-full h-full text-[#D4AF55]" />
            </div>
          </Link>

          {/* Card 2: Chocolates */}
          <Link
            href="/shop?category=chocolates-confectionery"
            className="group relative bg-[#18583A] text-white rounded-2xl p-6 overflow-hidden shadow-lg border border-[#D4AF55]/40 hover:shadow-2xl transition-all"
          >
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF55]">
                Sweet Indulgence
              </span>
              <h3 className="text-lg font-black leading-tight">
                Chocolate Collection
              </h3>
              <p className="text-xs text-white/70">Premium chocolates for special moments</p>
              <div className="pt-2">
                <span className="inline-flex items-center text-xs font-bold text-[#D4AF55] group-hover:underline">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all pointer-events-none">
              <Sparkles className="w-full h-full text-[#D4AF55]" />
            </div>
          </Link>

          {/* Card 3: Seasonal Collections */}
          <Link
            href="/shop?category=dates"
            className="group relative bg-[#06291B] text-white rounded-2xl p-6 overflow-hidden shadow-lg border border-[#D4AF55]/40 hover:shadow-2xl transition-all"
          >
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF55]">
                Blessed Seasons
              </span>
              <h3 className="text-lg font-black leading-tight">
                Seasonal Collections
              </h3>
              <p className="text-xs text-white/70">Eid, Ramadan & Umrah selections</p>
              <div className="pt-2">
                <span className="inline-flex items-center text-xs font-bold text-[#D4AF55] group-hover:underline">
                  <span>View Collections</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all pointer-events-none">
              <Heart className="w-full h-full text-[#D4AF55]" />
            </div>
          </Link>

          {/* Card 4: Combo Packs */}
          <Link
            href="/shop?category=combo-packs"
            className="group relative bg-[#202820] text-white rounded-2xl p-6 overflow-hidden shadow-lg border border-[#D4AF55]/40 hover:shadow-2xl transition-all"
          >
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF55]">
                Smart Value
              </span>
              <h3 className="text-lg font-black leading-tight">
                Combo Packs & Offers
              </h3>
              <p className="text-xs text-white/70">More value, more goodness in one bundle</p>
              <div className="pt-2">
                <span className="inline-flex items-center text-xs font-bold text-[#D4AF55] group-hover:underline">
                  <span>Shop Combos</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all pointer-events-none">
              <Award className="w-full h-full text-[#D4AF55]" />
            </div>
          </Link>
        </div>
      </section>

      {/* SECTION 5: BRAND STORY & FOOD SAFETY GUARANTEE */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E1D6] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <img
                src="/logo.png"
                alt="Bin Riaz Foods Seal"
                className="max-h-56 w-auto object-contain"
              />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF55]">
                Our Quality Commitment
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B3826]">
                Real Taste, Real Goodness — For a Healthier Tomorrow
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                At <strong>BIN RIAZ FOODS</strong>, our mission is to deliver authentic purity from Pakistan’s fertile soils directly to your kitchen. We never compromise on ingredients, hygiene, or packaging standards. Every single batch of our spices, dry fruits, honey, and rice is inspected and sealed with food-grade protective material.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-[#0B3826]">
                <div className="flex items-center space-x-2 p-2 bg-[#FAF6EC] rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF55]" />
                  <span>Airtight Sealing</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-[#FAF6EC] rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF55]" />
                  <span>No Artificial Dyes</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-[#FAF6EC] rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF55]" />
                  <span>Zero Preservatives</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
