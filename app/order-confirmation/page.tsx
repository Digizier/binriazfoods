"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Order } from '../../lib/types';
import { CheckCircle2, Package, Printer, MessageCircle, ArrowRight, Truck } from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get('ref');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderRef) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('order_reference', orderRef)
          .single();

        if (!error && data) {
          setOrder(data as Order);
        }
      } catch (e) {
        console.warn('Error fetching order confirmation:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderRef]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#0B3826] border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-[#0B3826] font-semibold">Verifying your order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      {/* Success Badge */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E1D6] shadow-md text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center border-2 border-green-200">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF55]">
          Order Confirmed
        </span>

        <h1 className="text-2xl sm:text-4xl font-black text-[#0B3826]">
          Thank You For Your Order!
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          Your order has been recorded successfully. Our packaging team in Sargodha will prepare your package with hygienic food-grade sealing.
        </p>

        <div className="inline-block p-4 bg-[#FAF6EC] rounded-2xl border border-[#E5E1D6] text-xs">
          <span className="text-gray-500 font-medium">Your Order Tracking Reference:</span>
          <p className="text-xl font-black font-mono text-[#0B3826] mt-0.5">
            {orderRef || 'BRF-SUCCESS'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <a
            href={`https://wa.me/923456001913?text=Salam%20Bin%20Riaz%20Foods%2C%20I%20just%20placed%20order%20%23${orderRef}.%20Please%20confirm%20dispatch.`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
          </a>

          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-[#E5E1D6] text-[#0B3826] text-xs font-bold rounded-xl hover:bg-[#FAF6EC] transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D4AF55]" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Order Details Breakdown */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D6] shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#0B3826] flex items-center space-x-2 pb-3 border-b border-[#E5E1D6]">
            <Package className="w-5 h-5 text-[#D4AF55]" />
            <span>Order Summary Snapshot</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-500 font-medium">Customer Name:</p>
              <p className="font-bold text-gray-800">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Contact Phone:</p>
              <p className="font-bold text-gray-800">{order.customer_phone}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Delivery Address:</p>
              <p className="font-bold text-gray-800">{order.shipping_address}, {order.city}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Payment Method:</p>
              <p className="font-bold text-gray-800">{order.payment_method}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Ordered Items
            </span>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2 bg-[#FAF6EC] rounded-xl">
                  <span className="font-semibold text-gray-800">
                    {item.name} ({item.variant}) &times; {item.quantity}
                  </span>
                  <span className="font-bold font-mono text-[#0B3826]">
                    Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-[#E5E1D6] flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">Total Paid/Payable:</span>
            <span className="text-xl font-black font-mono text-[#0B3826]">
              Rs. {Number(order.total_amount).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Return to Home */}
      <div className="text-center">
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#0B3826] hover:text-[#D4AF55] transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto p-16 text-center">Loading confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
