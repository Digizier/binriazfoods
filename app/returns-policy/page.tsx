import React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Returns & Replacement Policy | BIN RIAZ FOODS',
  description: '48-hour hygienic replacement policy for damaged or incorrect deliveries.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF55]">
          Customer Assurance
        </span>
        <h1 className="text-3xl font-black text-[#0B3826] mt-1">
          Returns & Replacement Guarantee
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Last Updated: 2026 · BIN RIAZ FOODS
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E1D6] shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826] flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-[#D4AF55]" />
            <span>1. 48-Hour Replacement Guarantee</span>
          </h2>
          <p>
            Because we sell consumable food items, opened packets cannot be accepted for general return due to strict hygiene and health safety regulations. However, if your order arrives damaged, defective, or with an incorrect item, Bin Riaz Foods will provide a <strong>100% free replacement or refund</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826] flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-[#D4AF55]" />
            <span>2. Eligible Conditions for Replacement</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Packaging was unsealed, torn, or crushed upon arrival.</li>
            <li>Glass jar (honey, desi ghee, or pickle) was broken in courier transit.</li>
            <li>Item delivered does not match what was ordered.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3826] flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-[#D4AF55]" />
            <span>3. How to File a Claim</span>
          </h2>
          <p>
            Simply take 2 to 3 photos of the damaged item along with your package shipping label, and WhatsApp them to our helpline at <strong>0345 6001913</strong> within 48 hours of delivery. Our customer support manager will process your replacement immediately without unnecessary delays.
          </p>
        </section>
      </div>
    </div>
  );
}
