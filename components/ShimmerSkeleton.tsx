"use client";

import React from 'react';

export function ShimmerBox({ className = '' }: { className?: string }) {
  return (
    <div
      className={`shimmer-flash rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E5E1D6] shadow-sm flex flex-col space-y-3">
      {/* Image container flash */}
      <div className="w-full aspect-square rounded-xl shimmer-flash" />

      {/* Title flash */}
      <div className="h-4 w-3/4 rounded shimmer-flash" />
      <div className="h-3 w-1/2 rounded shimmer-flash" />

      {/* Price & Button flash */}
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-20 rounded shimmer-flash" />
        <div className="h-9 w-24 rounded-full shimmer-flash" />
      </div>
    </div>
  );
}

export function CategoryCircleSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full shimmer-flash border-2 border-[#E5E1D6]" />
      <div className="h-3 w-16 rounded shimmer-flash" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-[#E5E1D6]/60">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-3">
          <div className="h-4 w-full rounded shimmer-flash" />
        </td>
      ))}
    </tr>
  );
}
