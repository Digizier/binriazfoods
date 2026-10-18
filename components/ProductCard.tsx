"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '../lib/types';
import { useCart } from '../lib/cart-context';
import { calculatePriceForWeight } from '../lib/price-calculator';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const defaultWeight =
    product.weight_options && product.weight_options.length > 0
      ? product.weight_options[0]
      : 'Standard';
  const [selectedWeight, setSelectedWeight] = useState(defaultWeight);
  const [isAdded, setIsAdded] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const isLiked = wishlist.includes(product.id);

  // Dynamic price calculated instantly for selected weight
  const currentPrice = calculatePriceForWeight(product.price, defaultWeight, selectedWeight);
  const currentComparePrice = product.compare_price
    ? calculatePriceForWeight(product.compare_price, defaultWeight, selectedWeight)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        ...product,
        price: currentPrice,
        compare_price: currentComparePrice,
      },
      selectedWeight,
      1
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent =
    currentComparePrice && currentComparePrice > currentPrice
      ? Math.round(
          ((currentComparePrice - currentPrice) / currentComparePrice) * 100
        )
      : null;

  return (
    <div className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-[#E5E1D6] hover:border-[#D4AF55] hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Discount Badge & Wishlist Button */}
      <div className="absolute top-5 left-5 z-10 flex flex-col space-y-1">
        {discountPercent ? (
          <span className="px-2 py-0.5 bg-[#D4AF55] text-white text-[10px] font-bold rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        ) : null}
        {product.is_featured ? (
          <span className="px-2 py-0.5 bg-[#0B3826] text-white text-[10px] font-bold rounded-full shadow-sm">
            FEATURED
          </span>
        ) : null}
      </div>

      <button
        onClick={handleLike}
        className={`absolute top-5 right-5 z-10 p-2 rounded-full transition-all cursor-pointer ${
          isLiked
            ? 'bg-red-50 text-red-500 shadow-sm'
            : 'bg-white/80 backdrop-blur-xs text-gray-400 hover:text-red-500 hover:bg-white shadow-xs'
        }`}
        title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
      </button>

      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF6EC] mb-3">
        {!isImgLoaded && (
          <div className="absolute inset-0 shimmer-flash" />
        )}
        <img
          src={product.cover_image || '/hero-banner.png'}
          alt={product.name}
          onLoad={() => setIsImgLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isImgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-1 text-xs">
            <div className="flex items-center text-[#D4AF55]">
              <Star className="w-3.5 h-3.5 fill-[#D4AF55]" />
              <span className="font-semibold text-gray-800 ml-1">
                {product.rating || '5.0'}
              </span>
            </div>
            <span className="text-gray-400 text-[11px]">
              ({product.review_count || 12})
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-[#0B3826] text-sm sm:text-base leading-snug line-clamp-2 hover:text-[#D4AF55] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Weight Options Picker */}
          {product.weight_options && product.weight_options.length > 1 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.weight_options.slice(0, 3).map((w) => (
                <button
                  key={w}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedWeight(w);
                  }}
                  className={`px-2 py-0.5 text-[11px] rounded-md transition-colors cursor-pointer ${
                    selectedWeight === w
                      ? 'bg-[#0B3826] text-white font-semibold'
                      : 'bg-[#FAF6EC] text-gray-700 hover:bg-[#eae3d5]'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Pricing and Cart Button */}
        <div className="mt-4 pt-3 border-t border-[#E5E1D6]/60 flex items-center justify-between">
          <div>
            <div className="text-base sm:text-lg font-black text-[#0B3826] transition-all">
              Rs. {Number(currentPrice).toLocaleString()}
            </div>
            {currentComparePrice && currentComparePrice > currentPrice ? (
              <span className="text-xs text-gray-400 line-through">
                Rs. {Number(currentComparePrice).toLocaleString()}
              </span>
            ) : null}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer ${
              isAdded
                ? 'bg-green-700 text-white'
                : 'bg-[#0B3826] hover:bg-[#18583A] text-white hover:shadow-md'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
