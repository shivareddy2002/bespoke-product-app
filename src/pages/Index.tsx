import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import HeroBanner from '@/components/HeroBanner';
import SectionHeader from '@/components/SectionHeader';
import HorizontalProductScroll from '@/components/HorizontalProductScroll';
import SearchBar from '@/components/SearchBar';
import { RefreshCw, AlertTriangle, PackageOpen } from 'lucide-react';
import { SortOption } from '@/types/product';

export default function Index() {
  const {
    filteredProducts, loading, error, searchQuery,
    sortOption, setSortOption, refresh,
    featuredProducts, topDeals, categories, getProductsByCategory,
  } = useApp();

  const isSearching = searchQuery.trim().length > 0 || sortOption !== 'none';

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 pb-3 pt-6 backdrop-blur-md">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Discover</h1>
        <SearchBar />

        {/* Sort */}
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value as SortOption)}
          className="h-9 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="none">Default order</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
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

      {/* Search/Sort results view */}
      {!loading && !error && isSearching && (
        <>
          {filteredProducts.length === 0 ? (
            <EmptyState icon={PackageOpen} title="No products found" description="Try a different search term." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Sectioned Homepage */}
      {!loading && !error && !isSearching && (
        <div className="space-y-8 pt-4 pb-4">
          <HeroBanner />

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
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
