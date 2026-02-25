import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft } from 'lucide-react';

export default function SectionView() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { featuredProducts, topDeals, trendingProducts, bestSellers, recommendedProducts } = useApp();

  const sectionMap: Record<string, { title: string; products: typeof featuredProducts }> = {
    featured: { title: '⭐ Featured Products', products: featuredProducts },
    deals: { title: '🔥 Top Deals', products: topDeals },
    trending: { title: '📈 Trending Now', products: trendingProducts },
    bestsellers: { title: '🏆 Best Sellers', products: bestSellers },
    recommended: { title: '💡 Recommended for You', products: recommendedProducts },
  };

  const section = sectionMap[type || ''] || { title: 'Products', products: [] };
  const title = section.title;
  const products = section.products;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-4">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="mb-4 text-2xl font-bold text-foreground">{title}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
