"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import { useCart } from '../lib/cart-context';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Check,
  ArrowRight,
  PackageCheck,
  Play,
} from 'lucide-react';

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string>('Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeMedia, setActiveMedia] = useState<'video' | number>('video');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (!error && data) {
          const prod = data as Product;
          setProduct(prod);
          if (prod.weight_options && prod.weight_options.length > 0) {
            setSelectedVariant(prod.weight_options[0]);
          }
          if (prod.youtube_url) {
            setActiveMedia('video');
          } else {
            setActiveMedia(0);
          }
        }
      } catch (e) {
        console.warn('Error fetching product detail:', e);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-3xl shimmer-flash" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded-xl shimmer-flash" />
            <div className="h-6 w-1/4 rounded-lg shimmer-flash" />
            <div className="h-24 w-full rounded-2xl shimmer-flash" />
            <div className="h-12 w-1/2 rounded-full shimmer-flash" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#0B3826]">Product Not Found</h2>
        <p className="text-sm text-gray-500">
          The requested product may have been moved or is currently unavailable.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-[#0B3826] text-white font-bold rounded-xl text-xs hover:bg-[#18583A] transition-all"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isLiked = wishlist.includes(product.id);

  // Helper to extract YouTube embed URL
  const getYouTubeEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0`
      : null;
  };

  const embedUrl = getYouTubeEmbedUrl(product.youtube_url);

  const allImages = [
    product.cover_image || '/hero-banner.png',
    ...(Array.isArray(product.gallery_images) ? product.gallery_images : []),
  ];

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center space-x-2">
        <Link href="/" className="hover:text-[#0B3826]">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#0B3826]">
          Shop
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#0B3826] truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Media Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#E5E1D6] shadow-sm flex items-center justify-center">
            {activeMedia === 'video' && embedUrl ? (
              <iframe
                src={embedUrl}
                title={`Video for ${product.name}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={
                  typeof activeMedia === 'number'
                    ? allImages[activeMedia]
                    : allImages[0]
                }
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            )}
          </div>

          {/* Thumbnails row */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {embedUrl && (
              <button
                type="button"
                onClick={() => setActiveMedia('video')}
                className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all flex flex-col items-center justify-center bg-[#0B3826] text-white cursor-pointer ${
                  activeMedia === 'video'
                    ? 'border-[#D4AF55] shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Play className="w-6 h-6 text-[#D4AF55]" />
                <span className="text-[10px] font-bold mt-1">Video</span>
              </button>
            )}

            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveMedia(idx)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all bg-white cursor-pointer ${
                  activeMedia === idx
                    ? 'border-[#0B3826] shadow-md'
                    : 'border-[#E5E1D6] opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF55]">
                SKU: {product.sku || 'BR-FOODS'}
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : 'bg-white text-gray-400 border-gray-200 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0B3826] mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center text-[#D4AF55]">
                <Star className="w-4 h-4 fill-[#D4AF55]" />
                <span className="font-bold text-sm text-gray-800 ml-1">
                  {product.rating || '5.0'}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                ({product.review_count || 12} Verified Customer Reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-white rounded-2xl border border-[#E5E1D6] flex items-baseline space-x-3">
            <span className="text-3xl font-black text-[#0B3826]">
              Rs. {Number(product.price).toLocaleString()}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-sm text-gray-400 line-through">
                Rs. {Number(product.compare_price).toLocaleString()}
              </span>
            )}
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              In Stock & Ready for Dispatch
            </span>
          </div>

          {/* Weight / Pack Variant Selector */}
          {product.weight_options && product.weight_options.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Select Package Size:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.weight_options.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSelectedVariant(w)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedVariant === w
                        ? 'bg-[#0B3826] text-white border-[#0B3826] shadow-sm'
                        : 'bg-white text-gray-700 border-[#E5E1D6] hover:bg-[#FAF6EC]'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-[#E5E1D6] bg-white rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-black font-bold text-base"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-black font-bold text-base"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer ${
                  isAdded
                    ? 'bg-green-700 text-white'
                    : 'bg-[#0B3826] hover:bg-[#18583A] text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-[#D4AF55] hover:bg-[#E8CB7A] text-[#06291B] font-black rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Buy Now — Instant Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Food Safety & Packaging Details */}
          <div className="p-4 bg-white rounded-2xl border border-[#E5E1D6] space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-[#0B3826] font-semibold">
              <PackageCheck className="w-4 h-4 text-[#D4AF55]" />
              <span>Packaging: {product.packaging_type || 'Airtight Food-Grade Protective Pouch'}</span>
            </div>
            {product.ingredients && (
              <div className="flex items-start space-x-2 text-gray-600">
                <ShieldCheck className="w-4 h-4 text-[#D4AF55] shrink-0 mt-0.5" />
                <span>Ingredients: {product.ingredients}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-gray-600">
              <Truck className="w-4 h-4 text-[#D4AF55]" />
              <span>Nationwide Express Courier Dispatch across Pakistan</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-sm text-[#0B3826] uppercase tracking-wider">
              Product Overview
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
