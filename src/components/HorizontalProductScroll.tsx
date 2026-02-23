import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
}

export default function HorizontalProductScroll({ products }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      {products.map(p => (
        <div key={p.id} className="min-w-[160px] max-w-[180px] flex-shrink-0">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
