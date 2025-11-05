'use client';

import { CartItem, Product } from './types';

class CartStore {
  private listeners: (() => void)[] = [];

  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('msdk-cart');
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: Product): void {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === product.id);

    // determine max quantity from product fields
    const max = Number((product as any).max_quantity ?? (product as any).maxQuantity ?? 0) || 0;

    if (existingItem) {
      // try to increment by 1 but respect max
      const desired = existingItem.quantity + 1;
      if (max > 0 && desired > max) {
        existingItem.quantity = max; // cap to max
      } else {
        existingItem.quantity = desired;
      }
    } else {
      const initialQty = 1;
      const qty = (max > 0 && initialQty > max) ? max : initialQty;
      // store max_quantity on item so later updates can enforce it
      const item: CartItem = {
        ...product,
        quantity: qty,
        // @ts-ignore allow storing max on item
        max_quantity: max > 0 ? max : undefined
      } as unknown as CartItem;
      cart.push(item);
    }

    localStorage.setItem('msdk-cart', JSON.stringify(cart));
    this.notifyListeners();
  }

  removeFromCart(productId: string): void {
    const cart = this.getCart();
    const filteredCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('msdk-cart', JSON.stringify(filteredCart));
    this.notifyListeners();
  }

  updateQuantity(productId: string, quantity: number): void {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
      // determine max from stored item or alternate field
      const max = Number((item as any).max_quantity ?? (item as any).maxQuantity ?? 0) || 0;

      if (quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }

      let newQty = Math.floor(quantity);
      if (newQty < 1) newQty = 1;

      if (max > 0 && newQty > max) {
        newQty = max; // enforce cap
      }

      // if qty unchanged, do nothing
      if (item.quantity === newQty) return;

      item.quantity = newQty;
      localStorage.setItem('msdk-cart', JSON.stringify(cart));
      this.notifyListeners();
    }
  }

  clearCart(): void {
    localStorage.removeItem('msdk-cart');
    this.notifyListeners();
  }

  getTotal(): number {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getItemCount(): number {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const cartStore = new CartStore();