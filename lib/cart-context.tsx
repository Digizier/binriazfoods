"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon } from './types';
import { supabase } from './supabase';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant?: string, quantity?: number) => void;
  updateQuantity: (productId: string, variant: string, newQuantity: number) => void;
  removeFromCart: (productId: string, variant: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate client-side cart & wishlist once mounted
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('binriaz_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('binriaz_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.warn('Could not read saved user session:', e);
    }
    setIsHydrated(true);
  }, []);

  // Save changes to client cart
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('binriaz_cart', JSON.stringify(cart));
      } catch (e) {
        console.warn('Failed to save cart:', e);
      }
    }
  }, [cart, isHydrated]);

  // Save changes to wishlist
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('binriaz_wishlist', JSON.stringify(wishlist));
      } catch (e) {
        console.warn('Failed to save wishlist:', e);
      }
    }
  }, [wishlist, isHydrated]);

  const addToCart = (product: Product, variant?: string, quantity: number = 1) => {
    const selectedVariant = variant || (product.weight_options && product.weight_options[0]) || 'Standard';

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.variant === selectedVariant
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, variant: selectedVariant, quantity }];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, variant: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.variant === variant
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, variant: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.variant === variant))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  const discountAmount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? Math.round((cartSubtotal * appliedCoupon.discount_value) / 100)
      : Math.min(appliedCoupon.discount_value, cartSubtotal)
    : 0;

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Please enter a coupon code.' };

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('id, code, discount_type, discount_value, min_spend, is_active')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return { success: false, message: 'Invalid or expired coupon code.' };
      }

      if (cartSubtotal < data.min_spend) {
        return {
          success: false,
          message: `Minimum order value of Rs. ${data.min_spend.toLocaleString()} required for this coupon.`,
        };
      }

      setAppliedCoupon(data as Coupon);
      return {
        success: true,
        message: `Coupon "${cleanCode}" applied! You saved Rs. ${
          data.discount_type === 'percentage'
            ? Math.round((cartSubtotal * data.discount_value) / 100)
            : data.discount_value
        }`,
      };
    } catch (err: any) {
      return { success: false, message: 'Could not apply coupon at this moment.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
