'use client';
import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { supabase } from '@/lib/supabase';

export default function BestSellers() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(4); // now responsive

    useEffect(() => {
        // responsive page size: mobile=1, small=2, md+ =4
        function updatePageSize() {
            if (typeof window === 'undefined') return;
            const w = window.innerWidth;
            if (w < 640) setPageSize(1);
            else if (w < 768) setPageSize(2);
            else setPageSize(4);
        }
        updatePageSize();
        window.addEventListener('resize', updatePageSize);
        return () => window.removeEventListener('resize', updatePageSize);
    }, []);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const { data } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_best_seller', true)
                    .order('id', { ascending: false })
                    .limit(12);
                if (!mounted) return;
                setProducts(data ?? []);
            } catch (e) {
                console.error('Failed to load best sellers', e);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    // adjust current page if pageSize / products change
    const pages = Math.max(1, Math.ceil(products.length / pageSize));
    useEffect(() => {
        setPage((p) => Math.min(p, pages - 1));
    }, [pages]);

    if (loading) return (
        <section className="py-8">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
                    Best Sellers
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2 px-2">
                    <div className="w-64 h-40 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="w-64 h-40 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="w-64 h-40 bg-gray-100 rounded-lg animate-pulse" />
                </div>
            </div>
        </section>
    );

    if (!products.length) return null;

    function prev() {
        setPage((s) => (s - 1 + pages) % pages);
    }

    function next() {
        setPage((s) => (s + 1) % pages);
    }

    return (
        <section className="py-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Best Sellers</h2>
                </div>

                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500"
                        style={{ width: `${pages * 100}%`, transform: `translateX(-${(page * 100) / pages}%)` }}
                    >
                        {Array.from({ length: pages }).map((_, i) => {
                            const start = i * pageSize;
                            const slice = products.slice(start, start + pageSize);
                            return (
                                <div key={i} className="w-full px-2" style={{ width: `${100 / pages}%` }}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        {slice.map((p) => (
                                            <ProductCard key={p.id} product={p} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* dots */}
                    {pages > 1 && (
                        <div className="flex items-center justify-center mt-4 gap-2">
                            {Array.from({ length: pages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`h-2 w-8 rounded-full ${page === i ? 'bg-orange-600' : 'bg-slate-300'}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}