import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const { likedProducts } = useApp();

  return (
    <div className="mx-auto max-w-3xl px-4">
      <header className="pb-3 pt-6">
        <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
        <p className="text-sm text-muted-foreground">{likedProducts.length} liked products</p>
      </header>

      {likedProducts.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Like products to save them here."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 pt-2">
          {likedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
