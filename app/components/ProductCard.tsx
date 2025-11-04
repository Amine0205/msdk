'use client';
import Link from 'next/link';

type Props = { product: any };

export default function ProductCard({ product }: Props) {
  const img = product.image_url ?? '';
  const price =
    typeof product.price === 'number'
      ? product.price.toFixed(2)
      : product.price ?? '';

  return (
    <div className="w-64 flex-shrink-0 bg-white rounded-lg shadow-sm hover:shadow-md transition">
      <Link href={`/products/${product.id}`} className="block">
        <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
          <img src={img} alt={product.name} className="object-contain h-full w-full" />
        </div>
        <div className="p-3">
          <h4 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h4>
          <p className="text-sm text-slate-600 mt-1">{price} MAD</p>
        </div>
      </Link>
    </div>
  );
}