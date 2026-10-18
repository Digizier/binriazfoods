import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | BIN RIAZ FOODS',
  description: 'Terms of service and purchasing terms for BIN RIAZ FOODS.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF55]">
          Legal Terms
        </span>
        <h1 className="text-3xl font-black text-[#0B3826] mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          BIN RIAZ FOODS · Effective 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E1D6] shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826]">1. Ordering & Contract</h2>
          <p>
            By placing an order on binriazfoods.com, you agree that all information provided is accurate and complete. An order confirmation constitutes acceptance of delivery and payment obligations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826]">2. Product Availability & Pricing</h2>
          <p>
            All prices listed on the website are in Pakistani Rupees (PKR) and include packaging. Bin Riaz Foods reserves the right to modify prices based on seasonal harvest fluctuations without retroactive changes to existing confirmed orders.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826]">3. Cash on Delivery Fair Usage</h2>
          <p>
            Cash on Delivery is provided in good faith. Refusal to accept verified parcels upon courier arrival causes significant transit losses. We reserve the right to restrict future COD privileges for repeated unverified cancellations.
          </p>
        </section>
      </div>
    </div>
  );
}
