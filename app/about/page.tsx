import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Truck, Sparkles, Heart, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About Us | BIN RIAZ FOODS',
  description:
    'Learn about BIN RIAZ FOODS — A Brand by BIN RIAZ GROUP OF COMPANIES. Our commitment to pure spices, luxury dry fruits, authentic dates, and quality food products.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF55]">
          A Brand by BIN RIAZ GROUP OF COMPANIES
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0B3826] tracking-tight">
          Pure Goodness, Every Home.
        </h1>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          <strong>BIN RIAZ FOODS</strong> was founded with a singular, uncompromising vision: to bring genuine purity, unadulterated taste, and luxury food presentation to Pakistani families nationwide.
        </p>
      </div>

      {/* Brand Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-[#E5E1D6] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0B3826] text-[#D4AF55] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0B3826]">Uncompromising Purity</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We reject all artificial food dyes, chemical additives, and fillers. Every pinch of our red chili, turmeric, and garam masala carries pure aroma and authentic farm-fresh essence.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#E5E1D6] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0B3826] text-[#D4AF55] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0B3826]">Airtight Food-Grade Sealing</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Our multi-layered moisture-lock pouches and rigid gift boxes ensure that natural volatile oils and freshness remain sealed until opened in your kitchen.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#E5E1D6] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0B3826] text-[#D4AF55] flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0B3826]">Thoughtful Food Gifting</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            From wedding and Eid hampers to luxury Ajwa date presentation boxes and dry fruit jars, we elevate everyday food into meaningful celebratory gifts.
          </p>
        </div>
      </div>

      {/* Detailed Story & Heritage */}
      <div className="bg-[#0B3826] text-white rounded-3xl p-8 sm:p-14 border border-[#D4AF55]/40 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF55]">
              Heritage & Foundation
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              Rooted in Sargodha, Serving Families Across Pakistan
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Based at our central facility in Sargodha, Punjab, Bin Riaz Foods operates with full transparency. Whether you are sourcing pure Desi Ghee for family nutrition, aromatic aged Basmati Rice for festive biryani, or raw mountain Sidr honey, every product is handled with utmost care.
            </p>
            <div className="space-y-2 pt-2 text-xs text-white/90 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF55]" />
                <span>Head Office: Main Khushab Road, Opposite Qureshi Arcade, Sargodha</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF55]" />
                <span>Customer Helpline: 0345 6001913 / 0321 6001913</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <img
              src="/logo.png"
              alt="Bin Riaz Foods Emblem"
              className="max-h-60 w-auto object-contain brightness-110"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-xl font-bold text-[#0B3826]">Ready to experience authentic purity?</h3>
        <Link
          href="/shop"
          className="inline-block px-8 py-3.5 bg-[#D4AF55] hover:bg-[#E8CB7A] text-[#06291B] font-black rounded-full shadow-lg transition-all text-xs"
        >
          Explore Our Complete Catalog
        </Link>
      </div>
    </div>
  );
}
