import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  columns = 4,
  emptyMessage = "No architectural pieces match your current parameters."
}) => {
  if (products.length === 0) {
    return (
      <div className="w-full py-16 px-4 text-center rounded-2xl border border-zinc-800 bg-zinc-950/40 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
          <PackageOpen className="w-8 h-8" />
        </div>
        <p className="text-zinc-400 text-sm tracking-wide">{emptyMessage}</p>
      </div>
    );
  }

  const gridColsClass = 
    columns === 2 
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-6 sm:gap-7`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
