"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Order } from '../../lib/types';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  MessageCircle,
} from 'lucide-react';

export default function TrackOrderPage() {
  const [orderRef, setOrderRef] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setOrder(null);
    setSearched(true);

    if (!orderRef.trim()) {
      setErrorMsg('Please enter your Order Reference (e.g. BRF-12345).');
      return;
    }

    setLoading(true);

    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('order_reference', orderRef.trim().toUpperCase());

      if (phone.trim()) {
        query = query.eq('customer_phone', phone.trim());
      }

      const { data, error } = await query.single();

      if (error || !data) {
        setErrorMsg('No order found matching the provided reference number.');
      } else {
        setOrder(data as Order);
      }
    } catch (err: any) {
      setErrorMsg('Error tracking order. Please verify your reference and try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { label: 'Order Placed', key: 'Pending' },
    { label: 'Confirmed', key: 'Confirmed' },
    { label: 'Processing & Packed', key: 'Processing' },
    { label: 'Dispatched / Courier', key: 'Shipped' },
    { label: 'Delivered', key: 'Delivered' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.order_status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF55]">
          Live Parcel Tracking
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0B3826]">
          Track Your Bin Riaz Foods Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Enter your Order Reference number below to monitor your package fulfillment and courier dispatch status.
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D6] shadow-xs">
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="text"
              required
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              placeholder="Order Reference (e.g. BRF-12345)"
              className="w-full px-4 py-3 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs font-semibold focus:outline-hidden focus:border-[#D4AF55] focus:bg-white uppercase"
            />
          </div>
          <div className="sm:col-span-4">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile # (Optional)"
              className="w-full px-4 py-3 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs font-semibold focus:outline-hidden focus:border-[#D4AF55] focus:bg-white"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0B3826] hover:bg-[#18583A] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Order Status Result */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D6] shadow-sm space-y-8 animate-fadeIn">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E1D6] gap-2">
            <div>
              <span className="text-xs font-bold text-[#D4AF55] uppercase">
                Status: {order.order_status}
              </span>
              <h2 className="text-xl font-black text-[#0B3826]">
                Order #{order.order_reference}
              </h2>
              <p className="text-xs text-gray-500">
                Placed on {new Date(order.created_at).toLocaleDateString('en-GB')}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-500">Total Amount:</span>
              <p className="text-lg font-black font-mono text-[#0B3826]">
                Rs. {Number(order.total_amount).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Visual Tracking Progress Bar */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
              Delivery Milestones
            </h3>
            <div className="relative flex justify-between">
              {/* Connector line */}
              <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 z-0" />
              <div
                className="absolute top-4 left-6 h-1 bg-[#0B3826] transition-all duration-500 z-0"
                style={{
                  width: `${(currentStep / (statusSteps.length - 1)) * 90}%`,
                }}
              />

              {statusSteps.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-[#0B3826] text-white shadow-md'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-2 font-semibold max-w-[80px] leading-tight ${
                        isCurrent
                          ? 'text-[#0B3826] font-bold'
                          : isPassed
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Summary */}
          <div className="p-4 bg-[#FAF6EC] rounded-2xl border border-[#E5E1D6] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-semibold text-gray-500">Recipient:</p>
              <p className="font-bold text-[#0B3826]">{order.customer_name} ({order.customer_phone})</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500">Destination:</p>
              <p className="font-bold text-[#0B3826]">{order.shipping_address}, {order.city}</p>
            </div>
          </div>

          {/* WhatsApp Follow-up */}
          <div className="text-center pt-2">
            <a
              href={`https://wa.me/923456001913?text=Salam%20Bin%20Riaz%20Foods%2C%20inquiring%20about%20Order%20%23${order.order_reference}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#25D366] hover:underline"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Have questions about dispatch? Inquire with our helpline</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
