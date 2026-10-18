import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E1D6] shadow-md text-center max-w-md w-full space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF6EC] flex items-center justify-center text-[#D4AF55] border border-[#E5E1D6]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <span className="text-4xl font-black text-[#0B3826]">404</span>
        <h1 className="text-xl font-bold text-[#0B3826]">Page Not Found</h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          The food category, product, or page you were looking for does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0B3826] hover:bg-[#18583A] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
