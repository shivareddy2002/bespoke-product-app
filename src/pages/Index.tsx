import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import HeroBanner from '@/components/HeroBanner';
import SectionHeader from '@/components/SectionHeader';
import HorizontalProductScroll from '@/components/HorizontalProductScroll';
import SearchBar from '@/components/SearchBar';
import FilterToolbar from '@/components/FilterToolbar';
import { RefreshCw, AlertTriangle, PackageOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' as const },
  }),
};

export default function Index() {
  const {
    filteredProducts, loading, error, searchQuery,
    sortOption, priceRange, selectedCategory, refresh,
    featuredProducts, topDeals, recentlyViewed, categories, getProductsByCategory,
  } = useApp();
  const { user } = useAuth();

  const isFiltering = searchQuery.trim().length > 0 || sortOption !== 'none' || priceRange !== 'all' || selectedCategory !== 'all';

  const greeting = user?.isGuest ? 'Welcome, Guest 👋' :
    user?.email ? `Welcome back, ${user.email.split('@')[0]} 👋` :
    user?.phone ? `Welcome back 👋` : 'Discover';

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 pb-3 pt-6 backdrop-blur-md space-y-3">
        <h1 className="text-2xl font-bold text-foreground">{greeting}</h1>
        <SearchBar />
        <FilterToolbar />
      </header>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-card p-4">
              <div className="mb-3 h-40 rounded-lg bg-secondary" />
              <div className="mb-2 h-3 w-16 rounded bg-secondary" />
              <div className="mb-2 h-4 w-full rounded bg-secondary" />
              <div className="h-5 w-20 rounded bg-secondary" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-warning" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      {/* Filtered results */}
      {!loading && !error && isFiltering && (
        <>
          {filteredProducts.length === 0 ? (
            <EmptyState icon={PackageOpen} title="No products found" description="Try different filters or search term." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 pb-4">
              {filteredProducts.map((product, i) => (
                <motion.div key={product.id} custom={i} initial="hidden" animate="visible" variants={cardVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Sectioned Homepage */}
      {!loading && !error && !isFiltering && (
        <div className="space-y-8 pt-4 pb-4">
          <HeroBanner />

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <section>
              <SectionHeader title="🕐 Recently Viewed" />
              <HorizontalProductScroll products={recentlyViewed} />
            </section>
          )}

          {/* Featured */}
          {featuredProducts.length > 0 && (
            <section>
              <SectionHeader title="⭐ Featured Products" viewAllPath="/section/featured" />
              <HorizontalProductScroll products={featuredProducts} />
            </section>
          )}

          {/* Top Deals */}
          {topDeals.length > 0 && (
            <section>
              <SectionHeader title="🔥 Top Deals" viewAllPath="/section/deals" />
              <HorizontalProductScroll products={topDeals} />
            </section>
          )}

          {/* Categories */}
          {categories.map(cat => {
            const catProducts = getProductsByCategory(cat);
            return (
              <section key={cat}>
                <SectionHeader
                  title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                  viewAllPath={`/category/${encodeURIComponent(cat)}`}
                />
                <HorizontalProductScroll products={catProducts.slice(0, 6)} />
              </section>
            );
          })}

          {/* All Products */}
          <section>
            <SectionHeader title="All Products" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product, i) => (
                <motion.div key={product.id} custom={i} initial="hidden" animate="visible" variants={cardVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
