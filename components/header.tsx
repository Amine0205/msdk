'use client';

import Link from 'next/link';
import { ShoppingCart, Store } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

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

        {/* mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="p-2 rounded-md hover:bg-slate-100"
          >
            <svg className="h-6 w-6 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

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
      {/* Mobile menu - slide down */}
      <div className={`md:hidden transition-max-h duration-300 overflow-hidden bg-white border-b ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-3">
            <Link href="/" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-orange-600">Home</Link>
            <Link href="/products" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-orange-600">Products</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-orange-600">About</Link>
            <Link href="/faq" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-orange-600">FAQ</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-orange-600">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}