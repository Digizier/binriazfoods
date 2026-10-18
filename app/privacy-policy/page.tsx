import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | BIN RIAZ FOODS',
  description: 'How BIN RIAZ FOODS protects customer information and order privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF55]">
          Data Security
        </span>
        <h1 className="text-3xl font-black text-[#0B3826] mt-1">
          Privacy & Data Protection Policy
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          BIN RIAZ FOODS · A Brand by BIN RIAZ GROUP OF COMPANIES
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E1D6] shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826] flex items-center space-x-2">
            <Lock className="w-5 h-5 text-[#D4AF55]" />
            <span>1. Information We Collect</span>
          </h2>
          <p>
            When you place an order on binriazfoods.com, we collect your name, phone number, shipping address, and optional email solely for the purpose of processing, fulfilling, and dispatching your food parcel.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826] flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF55]" />
            <span>2. No Third-Party Data Selling</span>
          </h2>
          <p>
            BIN RIAZ FOODS will never sell, rent, or trade your contact information to third-party telemarketers or external advertising companies. Your details are shared solely with our authorized courier partners for delivery completion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826]">3. Payment Data Security</h2>
          <p>
            For manual mobile account transfers (JazzCash/EasyPaisa/Bank Transfer), transaction screenshots are stored in encrypted cloud storage accessible only to authorized administrators for order verification.
          </p>
        </section>
      </div>
    </div>
  );
}
