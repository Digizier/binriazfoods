"use client";

import React from 'react';
import { X, ExternalLink, Download, FileText } from 'lucide-react';

interface PaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  proofUrl?: string | null;
  orderReference: string;
  customerName: string;
  amount: number;
}

export default function PaymentProofModal({
  isOpen,
  onClose,
  proofUrl,
  orderReference,
  customerName,
  amount,
}: PaymentProofModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5E1D6] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E1D6]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D4AF55]">
              Payment Verification Proof
            </span>
            <h3 className="text-lg font-bold text-[#0B3826]">
              Order #{orderReference} — Rs. {amount.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Customer: {customerName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview Container */}
        <div className="flex-1 overflow-auto py-4 flex items-center justify-center min-h-[300px] bg-[#FAF6EC] rounded-xl border border-dashed border-[#E5E1D6]">
          {proofUrl ? (
            <img
              src={proofUrl}
              alt={`Payment proof for ${orderReference}`}
              className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-md"
            />
          ) : (
            <div className="text-center p-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="font-medium text-sm">No payment proof uploaded for this order.</p>
              <p className="text-xs text-gray-400 mt-1">
                Customer chose Cash on Delivery or pending manual confirmation.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E5E1D6] flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {proofUrl ? 'Verify transaction ID against your mobile account.' : ''}
          </div>
          <div className="flex space-x-2">
            {proofUrl ? (
              <a
                href={proofUrl}
                target="_blank"
                rel="noreferrer"
                download={`receipt_${orderReference}.jpg`}
                className="px-4 py-2 text-xs font-semibold bg-[#0B3826] text-white rounded-lg hover:bg-[#18583A] transition-colors flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Full Size</span>
              </a>
            ) : null}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
