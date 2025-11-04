'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import DynamicHero from '@/components/DynamicHero';

interface FAQItem {
  question: string;
  answer: string;
}

const faqCategories: Record<string, FAQItem[]> = {
  'Ordering & Shipping': [
    {
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, and proceed to checkout. Fill in your delivery information and submit your order. You will receive a confirmation email with your order details.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to many countries worldwide. Shipping costs and delivery times vary by location. You can see exact shipping details at checkout.',
    },
    {
      question: 'What is Cash on Delivery (COD)?',
      answer: 'Cash on Delivery means you pay for your order when it is delivered to your address. No advance payment is required. This is our primary payment method to ensure your security and peace of mind.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery times depend on your location. Typically, orders within Morocco arrive within 3-5 business days. International orders may take 10-20 business days. You will receive tracking information with your order.',
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes, after your order is shipped, you will receive an email with a tracking number. You can use this to monitor your delivery status in real-time.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 14 days of delivery for unused items in original packaging. Please contact our support team to initiate a return process.',
    },
  ],
  'Products & Authenticity': [
    {
      question: 'Are all products authentic?',
      answer: 'Yes, 100% authentic. We source directly from verified Moroccan artisans and suppliers. Every product undergoes quality inspection to ensure authenticity and excellence.',
    },
    {
      question: 'How are products verified for authenticity?',
      answer: 'Our team personally verifies each supplier and product batch. We maintain direct relationships with artisans and conduct regular quality audits to guarantee authenticity.',
    },
    {
      question: 'Can I get a certificate of authenticity?',
      answer: 'For premium items like handcrafted goods and antiques, certificates of authenticity can be provided. Please inquire when placing your order.',
    },
    {
      question: 'What is your product sourcing policy?',
      answer: 'We work exclusively with verified Moroccan artisans, cooperatives, and suppliers. We ensure fair wages, ethical practices, and support for traditional craftsmanship.',
    },
    {
      question: 'Do you offer customized or bespoke products?',
      answer: 'Yes! For certain handcrafted items, we can arrange customizations. Contact our team with your requirements and we will connect you with the appropriate artisans.',
    },
  ],
  'Payments & Security': [
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, your information is fully encrypted and secure. We use industry-standard SSL encryption and do not store payment details. Cash on Delivery eliminates the need to share sensitive payment information online.',
    },
    {
      question: 'Do you accept other payment methods?',
      answer: 'Currently, we offer Cash on Delivery as our primary payment method for maximum security and convenience. We may add additional payment options in the future.',
    },
    {
      question: 'Is there a transaction fee?',
      answer: 'No hidden fees. The price you see includes all costs. With Cash on Delivery, you pay exactly what is quoted during checkout.',
    },
    {
      question: 'What if my order does not arrive?',
      answer: 'If your order does not arrive within the estimated delivery window, contact our support team immediately. We will investigate and arrange a replacement or refund.',
    },
  ],
  'Customer Support': [
    {
      question: 'How can I contact customer support?',
      answer: 'You can reach our team via email at contact@mdsk.ma or through the contact form on our website. We typically respond within 24 hours.',
    },
    {
      question: 'What are your business hours?',
      answer: 'We operate Monday through Friday, 9:00 AM to 6:00 PM (GMT+1). We respond to emails throughout these hours.',
    },
    {
      question: 'Do you offer support in multiple languages?',
      answer: 'Yes, we provide support in Arabic, French, and English to serve our diverse customer base.',
    },
    {
      question: 'What if I have a problem with my order?',
      answer: 'Contact our support team immediately with your order number and details of the issue. We will work quickly to resolve any problems and ensure your satisfaction.',
    },
    {
      question: 'Can I modify my order after placing it?',
      answer: 'If you need to make changes, contact us immediately. We can often modify orders before they are dispatched. Once shipped, modifications are not possible.',
    },
  ],
  'Warranty & Quality': [
    {
      question: 'Do products come with a warranty?',
      answer: 'All products are inspected for quality before shipping. Handcrafted items are guaranteed to be authentic. For electronics, manufacturer warranties apply as indicated in product details.',
    },
    {
      question: 'What if my product arrives damaged?',
      answer: 'If your item arrives damaged, contact us immediately with photos. We will arrange a replacement or refund at no cost to you.',
    },
    {
      question: 'How should I care for handcrafted items?',
      answer: 'Each product comes with care instructions. Generally, handcrafted leather goods should be kept away from moisture and heat. Rugs should be aired regularly and cleaned gently.',
    },
    {
      question: 'Are there any quality guarantees?',
      answer: 'Yes, all items are guaranteed to be authentic and of high quality. If you are not satisfied, we offer returns within 14 days of delivery.',
    },
  ],
};

export default function FAQPage() {
  const [expandedCategory, setExpandedCategory] = useState<string>('Ordering & Shipping');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div>
      <DynamicHero
        title="Frequently Asked Questions"
        description="Find answers to common questions about our products, orders, and services"
        image="/faq.jpg"
        color="white"
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {Object.keys(faqCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setExpandedCategory(category)}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    expandedCategory === category
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {faqCategories[expandedCategory].map((item, index) => {
                const key = `${expandedCategory}-${index}`;
                const isExpanded = expandedItems[key];

                return (
                  <div
                    key={key}
                    className="border border-slate-200 rounded-lg overflow-hidden hover:border-orange-300 transition-colors"
                  >
                    <button
                      onClick={() => toggleItem(key)}
                      className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                      <h3 className="text-left font-semibold text-slate-900">
                        {item.question}
                      </h3>
                      <ChevronDown
                        className={`h-5 w-5 text-orange-600 flex-shrink-0 ml-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                        <p className="text-slate-700 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Our customer support team is ready to help. Reach out to us anytime.
            </p>
            <a
              href="mailto:contact@mdsk.ma"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}