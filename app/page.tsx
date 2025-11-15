import { Button } from '@/components/ui/button';
import { ArrowRight, Package, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import BestSellers from './components/BestSellers';
import NewIn from './components/NewIn';
import ChatWidget from './components/ChatWidget';

export default async function Home() {
  const categories = [
    {
      name: 'Fashion',
      description: 'Authentic Moroccan fashion and accessories',
      color: 'bg-gradient-to-br from-orange-400 to-red-500',
    },
    {
      name: 'Tech',
      description: 'Latest gadgets and electronics',
      color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    },
    {
      name: 'Home Decor',
      description: 'Beautiful pieces for your home',
      color: 'bg-gradient-to-br from-amber-400 to-yellow-500',
    },
    {
      name: 'Artisanal',
      description: 'Handcrafted Moroccan treasures',
      color: 'bg-gradient-to-br from-green-400 to-teal-500',
    },
  ];

  const features = [
    {
      icon: Package,
      title: 'Quality Products',
      description: 'Carefully selected authentic items',
    },
    {
      icon: Truck,
      title: 'Cash on Delivery',
      description: 'Pay when you receive your order',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Shopping',
      description: 'Your information is protected',
    },
  ];

  return (
    <div>
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Discover Authentic
              <span className="text-orange-600"> Moroccan </span>
              Treasures
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Fashion accessories, tech gadgets, home decor, and artisanal products delivered to your door
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-6">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOTczMTYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnptLTI0IDBjMy4zMSAwIDYtMi42OSA2LTZzLTIuNjktNi02LTYtNiAyLjY5LTYgNiAyLjY5IDYgNiA2em0wIDI0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnptMjQgMGMzLjMxIDAgNi0yLjY5IDYtNnMtMi42OS02LTYtNi02IDIuNjktNiA2IDIuNjkgNiA2IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
      </section>

      {/* Categories section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/products?category=${category.name}`}
                className="group relative overflow-hidden rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`absolute inset-0 ${category.color}`}></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/90">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers horizontal scroll section */}
      <BestSellers />

      {/* New in horizontal scroll section */}
      <NewIn />

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-16 bg-gradient-to-br from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our collection of authentic Moroccan products and modern essentials
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      <ChatWidget />
    </div>
  );
}
