import React from 'react';
import Link from 'next/link';
import { Truck, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | BIN RIAZ FOODS',
  description: 'Nationwide delivery across Pakistan, dispatch timelines, and free shipping thresholds.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF55]">
          Delivery Guidelines
        </span>
        <h1 className="text-3xl font-black text-[#0B3826] mt-1">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Last Updated: 2026 · BIN RIAZ FOODS
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E1D6] shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826] flex items-center space-x-2">
            <Truck className="w-5 h-5 text-[#D4AF55]" />
            <span>1. Nationwide Delivery Coverage</span>
          </h2>
          <p>
            Bin Riaz Foods delivers premium packaged foods, dry fruits, spices, honey, and gift hampers across all cities, towns, and verified postal zones of Pakistan via leading courier partners (TCS, Leopards, M&P, Trax).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826] flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#D4AF55]" />
            <span>2. Delivery Timeframes</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Punjab major cities (Lahore, Rawalpindi, Faisalabad, Sargodha, Multan):</strong> 2 to 3 business days.</li>
            <li><strong>Karachi & Sindh:</strong> 3 to 4 business days.</li>
            <li><strong>Khyber Pakhtunkhwa & Islamabad:</strong> 2 to 4 business days.</li>
            <li><strong>Balochistan, Azad Kashmir & Remote areas:</strong> 4 to 6 business days.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826] flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF55]" />
            <span>3. Shipping Charges & Free Delivery Threshold</span>
          </h2>
          <p>
            Standard nationwide courier delivery charge is <strong>Rs. 250</strong> per order. Orders exceeding <strong>Rs. 3,000</strong> qualify for <strong>100% FREE Nationwide Shipping</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826] flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-[#D4AF55]" />
            <span>4. Packaging & Temperature Safety</span>
          </h2>
          <p>
            All products are sealed in multi-layer food-grade barrier pouches and rigid cartons to protect against transit shocks and humidity. During hot weather, confectionery and chocolates are dispatched with protective insulating wrap.
          </p>
        </section>

        <div className="pt-4 border-t border-[#E5E1D6] text-xs text-gray-500">
          Have an urgent delivery or corporate hamper inquiry? Reach our helpline at <strong>0345 6001913</strong> or message us on WhatsApp.
        </div>
      </div>
    </div>
  );
}
