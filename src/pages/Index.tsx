import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import { Search, X, RefreshCw, AlertTriangle, PackageOpen } from 'lucide-react';
import { SortOption } from '@/types/product';

export default function Index() {
  const {
    filteredProducts, loading, error, searchQuery,
    setSearchQuery, sortOption, setSortOption, refresh,
  } = useApp();

  return (
    <div className="mx-auto max-w-3xl px-4">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 pb-3 pt-6 backdrop-blur-md">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Discover</h1>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

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

      {/* Content */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-card p-4">
              <div className="mb-3 h-48 rounded-lg bg-secondary" />
              <div className="mb-2 h-3 w-16 rounded bg-secondary" />
              <div className="mb-2 h-4 w-full rounded bg-secondary" />
              <div className="h-5 w-20 rounded bg-secondary" />
            </div>
          ))}
        </div>
      )}

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

      {!loading && !error && filteredProducts.length === 0 && (
        <EmptyState
          icon={PackageOpen}
          title="No products found"
          description={searchQuery ? 'Try a different search term.' : 'No products available.'}
        />
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
