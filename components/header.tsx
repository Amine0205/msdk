'use client';

import Link from 'next/link';
import { ShoppingCart, Store } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-orange-600" />
          <span className="text-2xl font-bold text-slate-900">MDSK</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors">
            Products
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors">
            About
          </Link>
          <Link href="/faq" className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors">
            FAQ
          </Link>
          <Link href="/contact" className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors">
            Contact
          </Link>
        </nav>

        <Link href="/cart">
          <Button variant="outline" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-semibold">
                {itemCount}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}