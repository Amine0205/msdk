import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Globe, Award, Users } from 'lucide-react';
import DynamicHero from '@/components/DynamicHero';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Authenticity',
      description: 'We carefully source authentic Moroccan products directly from artisans and trusted suppliers',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Bringing Moroccan treasures to customers worldwide with reliable delivery',
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'Every product meets our high standards for craftsmanship and durability',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Supporting local artisans and traditional Moroccan craftsmanship',
    },
  ];

  const team = [
    {
      name: 'Amine',
      role: 'Co-Founder & CEO',
      bio: 'Passionate about connecting Moroccan culture around the country',
    }, 
    {
      name: 'Ray',
      role: 'Co-Founder & CTO',
      bio: 'Dedicated to sourcing the finest authentic Moroccan products',
    },
    {
      name: 'Marty',
      role: 'Head of Marketing',
      bio: 'Dedicated to promoting authentic Moroccan products and culture worldwide',
    },
  ];

  return (
    <div>
      <DynamicHero
        title="About MDSK"
        description="Discover our story, values, and the team dedicated to bringing you authentic Moroccan products."
        color="white"
        image="/faq.jpg"
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                MDSK was founded with a simple mission: to share the beauty and authenticity of Moroccan culture with the world. What started as a passion project has grown into a thriving online marketplace connecting customers globally with authentic Moroccan products.
              </p>
              <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                We believe that every product tells a story. From traditional leather goods crafted by skilled artisans in the medinas of Fez and Marrakech, to modern tech gadgets that enhance daily life, each item in our collection has been carefully selected for its quality, authenticity, and cultural significance.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Our commitment goes beyond commerce. We are dedicated to supporting local communities, preserving traditional craftsmanship, and providing a reliable platform where customers can discover and celebrate the richness of Moroccan heritage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 text-orange-600 mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-orange-600 mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-slate-600">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the magic of authentic Moroccan products. Shop with us today and become part of our growing global family.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Explore Our Products
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Why Choose MDSK?</h2>
            <ul className="space-y-4">
              {[
                'Authentic products sourced directly from Moroccan artisans',
                'Rigorous quality control for every item',
                'Competitive pricing with fast, reliable shipping',
                'Cash on Delivery for your convenience and security',
                'Dedicated customer support in multiple languages',
                'Secure and encrypted checkout process',
                'Supporting traditional Moroccan craftsmanship',
                'Transparent business practices and fair pricing',
              ].map((reason, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600">
                      ✓
                    </div>
                  </div>
                  <span className="text-lg text-slate-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}