'use client';

import { useState, useEffect } from 'react';
import { cartStore } from '@/lib/cart-store';
import { CartItem } from '@/lib/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCart(cartStore.getCart());

    const unsubscribe = cartStore.subscribe(() => {
      setCart(cartStore.getCart());
    });

    return unsubscribe;
  }, []);

  if (!mounted) {
    return {
      cart: [],
      total: 0,
      itemCount: 0,
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
    };
  }

  return {
    cart,
    total: cartStore.getTotal(),
    itemCount: cartStore.getItemCount(),
    addToCart: cartStore.addToCart.bind(cartStore),
    removeFromCart: cartStore.removeFromCart.bind(cartStore),
    updateQuantity: cartStore.updateQuantity.bind(cartStore),
    clearCart: cartStore.clearCart.bind(cartStore),
  };
}