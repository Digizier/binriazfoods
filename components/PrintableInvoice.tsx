"use client";

import React from 'react';
import { Order, StoreSettings } from '../lib/types';
import { Printer, X } from 'lucide-react';

interface PrintableInvoiceProps {
  order: Order;
  settings?: StoreSettings | null;
  onClose: () => void;
}

export default function PrintableInvoice({
  order,
  settings,
  onClose,
}: PrintableInvoiceProps) {
  const storeName = settings?.store_name || 'BIN RIAZ FOODS';
  const phone = settings?.phone_number || '0345 6001913';
  const email = settings?.email || 'binriazgroup@gmail.com';
  const address =
    settings?.address ||
    'Main Khushab Road, Opposite Qureshi Arcade, Sargodha, Punjab, Pakistan';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl relative text-black">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-[#0B3826]">
              Invoice Preview — Order #{order.order_reference}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#0B3826] text-white text-xs font-semibold rounded-lg hover:bg-[#18583A] transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Invoice Container */}
        <div id="printable-invoice" className="bg-white text-black p-4">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
            <div>
              <div className="flex items-center space-x-3">
                <img
                  src="/logo.png"
                  alt="Bin Riaz Foods"
                  className="h-14 w-auto object-contain"
                />
                <div>
                  <h1 className="text-2xl font-black tracking-wide text-black uppercase">
                    {storeName}
                  </h1>
                  <p className="text-xs text-gray-700 tracking-wider font-semibold">
                    A Brand by BIN RIAZ GROUP OF COMPANIES
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 max-w-sm">{address}</p>
              <p className="text-xs text-gray-600">
                Helpline: {phone} | Email: {email}
              </p>
              <p className="text-xs text-gray-600">NTN / Registration: 812934-7</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-widest rounded">
                TAX INVOICE
              </span>
              <p className="text-sm font-bold mt-2">
                Invoice #: <span className="font-mono">{order.order_reference}</span>
              </p>
              <p className="text-xs text-gray-600">
                Date: {new Date(order.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Payment Method:{' '}
                <span className="font-semibold">{order.payment_method}</span>
              </p>
              <p className="text-xs font-semibold mt-0.5">
                Payment Status:{' '}
                <span className="uppercase text-black underline">
                  {order.payment_status}
                </span>
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6 text-xs">
            <div>
              <p className="font-bold text-gray-900 uppercase tracking-wider mb-1">
                BILLED TO / CUSTOMER:
              </p>
              <p className="font-semibold text-sm text-black">{order.customer_name}</p>
              <p className="text-gray-700">Phone: {order.customer_phone}</p>
              {order.customer_email && (
                <p className="text-gray-700">Email: {order.customer_email}</p>
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900 uppercase tracking-wider mb-1">
                DELIVERY ADDRESS:
              </p>
              <p className="text-gray-800 leading-relaxed font-medium">
                {order.shipping_address}
              </p>
              <p className="text-gray-800 font-semibold">
                {order.city} {order.province ? `, ${order.province}` : ''}
              </p>
              {order.delivery_notes && (
                <p className="text-gray-500 italic mt-1">
                  Notes: {order.delivery_notes}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse mb-6 text-xs">
            <thead>
              <tr className="border-b-2 border-black bg-gray-100 font-bold text-black uppercase">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3">Size/Variant</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-2.5 px-3 text-gray-500">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-black">{item.name}</td>
                  <td className="py-2.5 px-3 text-gray-600">{item.variant}</td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    Rs. {Number(item.price).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold">
                    {item.quantity}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold font-mono">
                    Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-mono">
                  Rs. {Number(order.subtotal).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Charges:</span>
                <span className="font-mono">
                  {Number(order.shipping_fee) === 0
                    ? 'FREE'
                    : `Rs. ${Number(order.shipping_fee).toLocaleString()}`}
                </span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Discount Applied:</span>
                  <span className="font-mono">
                    - Rs. {Number(order.discount).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black border-t-2 border-black pt-2 text-black">
                <span>Grand Total:</span>
                <span className="font-mono">
                  Rs. {Number(order.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notice & Terms */}
          <div className="border-t border-gray-300 pt-4 text-[10px] text-gray-500 leading-relaxed">
            <p className="font-bold text-gray-700 mb-0.5">
              BIN RIAZ FOODS GUARANTEE & RETURN POLICY:
            </p>
            <p>
              All products are packed hygienically using premium food-grade materials.
              Please inspect parcel upon arrival. In case of any damaged or incorrect
              product, contact our customer helpline (0345 6001913) within 48 hours
              with this invoice copy. Thank you for trusting Bin Riaz Foods!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
