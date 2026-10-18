"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin dashboard
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#06291B] text-[#FAF6EC] pt-14 pb-24 lg:pb-14 border-t-2 border-[#D4AF55]">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#0B3826] border border-[#D4AF55]/40 flex items-center justify-center text-[#D4AF55]">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#D4AF55]">100% Authentic Quality</h4>
            <p className="text-xs text-white/70">Pure natural taste, strictly no adulteration</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#0B3826] border border-[#D4AF55]/40 flex items-center justify-center text-[#D4AF55]">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#D4AF55]">Nationwide Delivery</h4>
            <p className="text-xs text-white/70">Safe courier dispatch across all cities of Pakistan</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#0B3826] border border-[#D4AF55]/40 flex items-center justify-center text-[#D4AF55]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#D4AF55]">Hygienic Packaging</h4>
            <p className="text-xs text-white/70">Airtight, food-grade materials preserving freshness</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#0B3826] border border-[#D4AF55]/40 flex items-center justify-center text-[#D4AF55]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#D4AF55]">Customer Priority</h4>
            <p className="text-xs text-white/70">Friendly WhatsApp support & easy order tracking</p>
          </div>
        </div>
      </div>

      {/* Main Links Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Bin Riaz Foods Logo"
                className="h-16 w-auto object-contain brightness-110"
                style={{ maxHeight: '64px', width: 'auto' }}
              />
            </Link>
            <p className="text-xs text-white/80 leading-relaxed">
              <strong>BIN RIAZ FOODS</strong> is a premium Pakistani food brand under the umbrella of <strong>BIN RIAZ GROUP OF COMPANIES</strong>. Providing pure spices, luxury dry fruits, organic honey, authentic dates, and celebratory food hampers.
            </p>
            <p className="text-xs text-[#D4AF55] font-semibold italic">
              &ldquo;Pure Goodness, Every Home&rdquo;
            </p>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h3 className="font-bold text-sm text-[#D4AF55] uppercase tracking-wider mb-4">
              Explore Collections
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/shop?category=spices-masalas" className="hover:text-[#D4AF55] transition-colors">
                  Pure Spices & Masala Mixes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=dry-fruits-nuts" className="hover:text-[#D4AF55] transition-colors">
                  Dry Fruits & Premium Nuts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=dates" className="hover:text-[#D4AF55] transition-colors">
                  Ajwa, Medjool & Royal Dates
                </Link>
              </li>
              <li>
                <Link href="/shop?category=honey-natural-foods" className="hover:text-[#D4AF55] transition-colors">
                  Raw Sidr Mountain Honey
                </Link>
              </li>
              <li>
                <Link href="/shop?category=desi-ghee-butter" className="hover:text-[#D4AF55] transition-colors">
                  Pure Desi Ghee
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gift-hampers" className="hover:text-[#D4AF55] transition-colors font-semibold text-[#D4AF55]">
                  Luxury Gift Boxes & Hampers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=combo-packs" className="hover:text-[#D4AF55] transition-colors">
                  Family Combo Packs & Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h3 className="font-bold text-sm text-[#D4AF55] uppercase tracking-wider mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/about" className="hover:text-[#D4AF55] transition-colors">
                  About Bin Riaz Foods
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF55] transition-colors">
                  Contact Customer Helpline
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-[#D4AF55] transition-colors">
                  Track Your Parcel
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#D4AF55] transition-colors">
                  Shipping & Delivery Information
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-[#D4AF55] transition-colors">
                  Returns & Replacement Guarantee
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#D4AF55] transition-colors">
                  Privacy & Data Protection Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D4AF55] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Official Warehouse */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#D4AF55] uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <div className="flex items-start space-x-2 text-xs text-white/80">
              <MapPin className="w-4 h-4 text-[#D4AF55] shrink-0 mt-0.5" />
              <span>Main Khushab Road, Opposite Qureshi Arcade, Sargodha, Punjab, Pakistan</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-white/80">
              <Phone className="w-4 h-4 text-[#D4AF55] shrink-0" />
              <span>0345 6001913 / 0321 6001913</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-white/80">
              <Mail className="w-4 h-4 text-[#D4AF55] shrink-0" />
              <span>binriazgroup@gmail.com</span>
            </div>

            <div className="pt-3">
              <a
                href="https://wa.me/923456001913?text=Salam%20Bin%20Riaz%20Foods"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Payment Methods Accepted */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-white/60 mb-1.5 uppercase tracking-wider">
                Payment Options Accepted:
              </p>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                <span className="px-2 py-0.5 bg-white/10 rounded border border-white/20">Cash on Delivery</span>
                <span className="px-2 py-0.5 bg-red-600/80 rounded text-white">JazzCash</span>
                <span className="px-2 py-0.5 bg-green-600/80 rounded text-white">EasyPaisa</span>
                <span className="px-2 py-0.5 bg-white/10 rounded border border-white/20">Bank Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        <p>
          &copy; {new Date().getFullYear()} BIN RIAZ FOODS. A Brand by BIN RIAZ GROUP OF COMPANIES. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
