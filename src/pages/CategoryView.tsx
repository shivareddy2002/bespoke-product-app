import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft } from 'lucide-react';

export default function CategoryView() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { getProductsByCategory } = useApp();
  const decoded = decodeURIComponent(category || '');
  const products = getProductsByCategory(decoded);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-4">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="mb-4 text-2xl font-bold text-foreground capitalize">{decoded}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
