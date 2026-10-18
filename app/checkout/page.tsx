"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../lib/cart-context';
import { supabase } from '../../lib/supabase';
import { StoreSettings } from '../../lib/types';
import { uploadMediaToStorage } from '../../lib/image-compressor';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Upload,
  ArrowRight,
  AlertCircle,
  CreditCard,
  Building,
  Smartphone,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, discountAmount, appliedCoupon, clearCart } = useCart();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'JazzCash' | 'EasyPaisa' | 'Bank Transfer'>('COD');

  // Payment Proof Upload
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 1)
          .single();
        if (data) setSettings(data as StoreSettings);
      } catch (e) {
        console.warn('Error loading store settings:', e);
      }
    }
    loadSettings();
  }, []);

  const shippingFee =
    cartSubtotal >= (settings?.free_shipping_threshold || 3000)
      ? 0
      : settings?.shipping_fee || 250;

  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (cart.length === 0) {
      setErrorMsg('Your bag is empty. Please add products before placing an order.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim() || !city.trim()) {
      setErrorMsg('Please fill in all required shipping fields (Name, Phone, Address, City).');
      return;
    }

    setLoading(true);

    try {
      let uploadedProofUrl: string | null = null;

      // If manual payment method with proof uploaded, upload to Supabase storage
      if (proofFile && paymentMethod !== 'COD') {
        setIsUploadingProof(true);
        uploadedProofUrl = await uploadMediaToStorage(proofFile, 'proofs');
        setIsUploadingProof(false);
      }

      // Generate clean Order Reference
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const orderRef = `BRF-${randomDigits}`;

      // Snapshot items
      const itemsSnapshot = cart.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        variant: item.variant,
        price: Number(item.product.price),
        quantity: item.quantity,
        image_url: item.product.cover_image,
      }));

      // Insert directly into Supabase orders table
      const { data, error } = await supabase.from('orders').insert({
        order_reference: orderRef,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || null,
        shipping_address: shippingAddress.trim(),
        city: city.trim(),
        province: province.trim(),
        delivery_notes: deliveryNotes.trim() || null,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'COD' ? 'Pending' : uploadedProofUrl ? 'Pending Verification' : 'Pending',
        order_status: 'Pending',
        payment_proof_url: uploadedProofUrl,
        subtotal: cartSubtotal,
        shipping_fee: shippingFee,
        discount: discountAmount,
        total_amount: grandTotal,
        items: itemsSnapshot,
      }).select().single();

      if (error) {
        console.error('Order creation error:', error);
        throw new Error(error.message);
      }

      // Clear shopping bag
      clearCart();

      // Redirect to confirmation page
      router.push(`/order-confirmation?ref=${orderRef}`);
    } catch (err: any) {
      console.error('Failed to create order:', err);
      setErrorMsg(err.message || 'Failed to place order. Please check your network and try again.');
    } finally {
      setLoading(false);
      setIsUploadingProof(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center border border-[#E5E1D6]">
          <ShoppingBag className="w-8 h-8 text-[#D4AF55]" />
        </div>
        <h2 className="text-2xl font-black text-[#0B3826]">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Add fresh spices, pure honey, dates, or gift boxes to your bag to proceed with checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-[#0B3826] text-white text-xs font-bold rounded-xl hover:bg-[#18583A] transition-all"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF55]">
          Secure Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B3826] mt-0.5">
          Complete Your Order
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Customer & Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Contact & Delivery Info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D6] shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#0B3826] flex items-center space-x-2">
                <Truck className="w-5 h-5 text-[#D4AF55]" />
                <span>Shipping & Delivery Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full px-4 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#D4AF55] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Mobile Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full px-4 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#D4AF55] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Email Address (Optional — for invoice receipt)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#D4AF55] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Full Street Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House/Plot #, Street, Block, Area..."
                  className="w-full px-4 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#D4AF55] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lahore, Sargodha, Karachi"
                    className="w-full px-4 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#D4AF55] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Province</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#D4AF55] focus:bg-white"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad Capital">Islamabad Capital Territory</option>
                    <option value="Azad Kashmir">Azad Kashmir</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, ring side bell..."
                  className="w-full px-4 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#D4AF55] focus:bg-white"
                />
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D6] shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#0B3826] flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-[#D4AF55]" />
                <span>Select Payment Option</span>
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-[#0B3826] bg-[#FAF6EC]'
                      : 'border-[#E5E1D6] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-[#0B3826] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#0B3826]">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-xs text-gray-500">
                        Pay with cash when courier delivers the package to your doorstep.
                      </p>
                    </div>
                  </div>
                </label>

                {/* JazzCash */}
                <label
                  className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'JazzCash'
                      ? 'border-red-600 bg-red-50/40'
                      : 'border-[#E5E1D6] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'JazzCash'}
                      onChange={() => setPaymentMethod('JazzCash')}
                      className="accent-red-600 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-red-600 flex items-center">
                        <Smartphone className="w-4 h-4 mr-1.5" />
                        <span>JazzCash Mobile Account</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Title: <strong>{settings?.jazzcash_title || 'BIN RIAZ GROUP'}</strong> | Number: <strong>{settings?.jazzcash_number || '0321 6001913'}</strong>
                      </p>
                    </div>
                  </div>

                  {paymentMethod === 'JazzCash' && (
                    <div className="mt-4 pt-3 border-t border-red-200 space-y-2">
                      <p className="text-xs text-gray-700">
                        Transfer <strong>Rs. {grandTotal.toLocaleString()}</strong> to the JazzCash number above and attach your payment receipt screenshot below:
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofChange}
                        className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                      />
                      {proofPreview && (
                        <div className="mt-2 w-28 h-28 rounded-lg overflow-hidden border border-red-300">
                          <img src={proofPreview} alt="Screenshot" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </label>

                {/* EasyPaisa */}
                <label
                  className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'EasyPaisa'
                      ? 'border-green-600 bg-green-50/40'
                      : 'border-[#E5E1D6] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'EasyPaisa'}
                      onChange={() => setPaymentMethod('EasyPaisa')}
                      className="accent-green-600 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-green-700 flex items-center">
                        <Smartphone className="w-4 h-4 mr-1.5" />
                        <span>EasyPaisa Account</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Title: <strong>{settings?.easypaisa_title || 'BIN RIAZ GROUP'}</strong> | Number: <strong>{settings?.easypaisa_number || '0345 6001913'}</strong>
                      </p>
                    </div>
                  </div>

                  {paymentMethod === 'EasyPaisa' && (
                    <div className="mt-4 pt-3 border-t border-green-200 space-y-2">
                      <p className="text-xs text-gray-700">
                        Transfer <strong>Rs. {grandTotal.toLocaleString()}</strong> to the EasyPaisa account above and attach your payment receipt screenshot below:
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofChange}
                        className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-800 cursor-pointer"
                      />
                      {proofPreview && (
                        <div className="mt-2 w-28 h-28 rounded-lg overflow-hidden border border-green-300">
                          <img src={proofPreview} alt="Screenshot" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </label>

                {/* Bank Transfer */}
                <label
                  className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'Bank Transfer'
                      ? 'border-[#0B3826] bg-[#FAF6EC]'
                      : 'border-[#E5E1D6] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Bank Transfer'}
                      onChange={() => setPaymentMethod('Bank Transfer')}
                      className="accent-[#0B3826] w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#0B3826] flex items-center">
                        <Building className="w-4 h-4 mr-1.5 text-[#D4AF55]" />
                        <span>Online Bank Transfer (Meezan Bank)</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Bank: <strong>{settings?.bank_name || 'Meezan Bank Ltd'}</strong> | Title: <strong>{settings?.bank_title || 'BIN RIAZ FOODS'}</strong>
                      </p>
                      <p className="text-xs text-gray-600">
                        IBAN: <span className="font-mono font-semibold">{settings?.bank_iban || 'PK00MEZN0000000000000000'}</span>
                      </p>
                    </div>
                  </div>

                  {paymentMethod === 'Bank Transfer' && (
                    <div className="mt-4 pt-3 border-t border-[#E5E1D6] space-y-2">
                      <p className="text-xs text-gray-700">
                        Transfer <strong>Rs. {grandTotal.toLocaleString()}</strong> to the IBAN above and attach your payment receipt screenshot below:
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofChange}
                        className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0B3826] file:text-white cursor-pointer"
                      />
                      {proofPreview && (
                        <div className="mt-2 w-28 h-28 rounded-lg overflow-hidden border border-[#D4AF55]">
                          <img src={proofPreview} alt="Screenshot" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D6] shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#0B3826] pb-3 border-b border-[#E5E1D6]">
                Order Summary ({cart.length} items)
              </h2>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2">
                      <img
                        src={item.product.cover_image || '/hero-banner.png'}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-[#0B3826] line-clamp-1">{item.product.name}</p>
                        <p className="text-gray-500 text-[11px]">{item.variant} &times; {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold font-mono text-gray-900 shrink-0">
                      Rs. {(Number(item.product.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-[#E5E1D6] text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-green-700 font-bold">FREE</span>
                    ) : (
                      `Rs. ${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-[#0B3826] pt-3 border-t border-[#E5E1D6]">
                  <span>Total Payable:</span>
                  <span>Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={loading || isUploadingProof}
                className="w-full py-4 bg-[#0B3826] hover:bg-[#18583A] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-50"
              >
                {loading || isUploadingProof ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isUploadingProof ? 'Uploading Receipt...' : 'Confirming Order...'}</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF55]" />
                <span>100% Purity Guarantee · Safe Nationwide Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
