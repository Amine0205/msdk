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

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
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
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        localStorage.setItem('msdk-cart', JSON.stringify(cart));
        this.notifyListeners();
      }
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