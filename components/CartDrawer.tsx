"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../lib/cart-context';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, CheckCircle2, MessageCircle } from 'lucide-react';

export default function CartDrawer() {
  const pathname = usePathname();
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen || pathname === '/checkout') return null;

  const freeShippingThreshold = 3000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeeded = freeShippingThreshold - cartSubtotal;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    setIsApplying(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponInput);
    setIsApplying(false);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  const finalTotal = cartSubtotal - discountAmount;

  const getWhatsAppCartUrl = () => {
    const itemsList = cart
      .map(
        (item, i) =>
          `${i + 1}. *${item.product.name}* (${item.variant}) x ${item.quantity} = Rs. ${(
            Number(item.product.price) * item.quantity
          ).toLocaleString()}`
      )
      .join('\n');

    const shippingLabel = cartSubtotal >= freeShippingThreshold ? 'FREE' : 'Rs. 200';
    const totalAmount = cartSubtotal >= freeShippingThreshold ? finalTotal : finalTotal + 200;

    const message = `Salam Bin Riaz Foods! I want to order the following items from my shopping bag:\n\n${itemsList}\n\n*Subtotal:* Rs. ${cartSubtotal.toLocaleString()}${
      discountAmount > 0 ? `\n*Coupon Discount:* -Rs. ${discountAmount.toLocaleString()}` : ''
    }\n*Delivery:* ${shippingLabel}\n*Total Payable:* Rs. ${totalAmount.toLocaleString()}\n\nPlease confirm my order.`;

    return `https://wa.me/923456001913?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-[100dvh] max-h-screen overflow-hidden">
          {/* Header */}
          <div className="shrink-0 p-4 sm:p-5 border-b border-[#E5E1D6] flex items-center justify-between bg-[#FAF6EC]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#0B3826]" />
              <h2 className="text-base sm:text-lg font-bold text-[#0B3826]">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="shrink-0 bg-[#FAF6EC] px-4 sm:px-5 py-2.5 sm:py-3 border-b border-[#E5E1D6]">
            <div className="flex justify-between text-xs font-semibold mb-1 text-[#0B3826]">
              {amountNeeded > 0 ? (
                <span>
                  Add <strong className="text-[#D4AF55]">Rs. {amountNeeded.toLocaleString()}</strong> more for FREE Shipping!
                </span>
              ) : (
                <span className="flex items-center text-green-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Congratulations! FREE Nationwide Shipping!
                </span>
              )}
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0B3826] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List (Strict flex-1 min-h-0 so it scrolls independently without breaking screen) */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 overscroll-contain">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF6EC] flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8 text-[#D4AF55]" />
                </div>
                <h3 className="text-base font-bold text-[#0B3826]">Your bag is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our pure spices, luxury dry fruits, organic honey, and gift hampers.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 px-5 py-2.5 bg-[#0B3826] text-white text-xs font-bold rounded-xl hover:bg-[#18583A] transition-all cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant}`}
                  className="flex space-x-3 p-3 bg-[#FAF6EC]/60 rounded-xl border border-[#E5E1D6]/80"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.cover_image || '/hero-banner.png'}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-white shrink-0 border border-[#E5E1D6]"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs sm:text-sm font-bold text-[#0B3826] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="inline-block px-1.5 py-0.5 bg-white text-gray-600 text-[10px] rounded border border-[#E5E1D6] font-medium mt-0.5">
                        {item.variant}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs sm:text-sm font-black text-[#0B3826]">
                        Rs. {(Number(item.product.price) * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-1.5 bg-white border border-[#E5E1D6] rounded-lg px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-[#0B3826] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-[#0B3826] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area (Shrink-0 with WhatsApp & Checkout) */}
          {cart.length > 0 && (
            <div className="shrink-0 p-4 border-t border-[#E5E1D6] bg-[#FAF6EC] space-y-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E5E1D6] rounded-xl focus:outline-hidden focus:border-[#D4AF55] uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-3.5 py-1.5 bg-[#0B3826] text-white text-xs font-bold rounded-xl hover:bg-[#18583A] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isApplying ? 'Applying...' : 'Apply'}
                </button>
              </form>

              {/* Coupon Feedback */}
              {couponMsg && (
                <p className={`text-[11px] ${couponMsg.isError ? 'text-red-600' : 'text-green-700 font-semibold'}`}>
                  {couponMsg.text}
                </p>
              )}

              {appliedCoupon && (
                <div className="flex justify-between items-center bg-green-50 border border-green-200 px-3 py-1 rounded-lg text-xs text-green-800">
                  <span className="font-semibold">Coupon: {appliedCoupon.code}</span>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:underline text-[11px] font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Subtotals */}
              <div className="space-y-0.5 text-xs pt-0.5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Discount:</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Delivery:</span>
                  <span>{cartSubtotal >= freeShippingThreshold ? 'FREE' : 'Calculated at checkout'}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-[#0B3826] pt-1.5 border-t border-[#E5E1D6]">
                  <span>Total:</span>
                  <span>Rs. {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Dual Action Buttons: Proceed to Checkout + WhatsApp Order */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3 bg-[#0B3826] hover:bg-[#18583A] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={getWhatsAppCartUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>Order Entire Bag on WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
