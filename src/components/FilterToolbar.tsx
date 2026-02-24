import { useApp } from '@/context/AppContext';
import { SortOption, PriceRange } from '@/types/product';
import { motion } from 'framer-motion';

export default function FilterToolbar() {
  const {
    sortOption, setSortOption,
    priceRange, setPriceRange,
    selectedCategory, setSelectedCategory,
    categories,
  } = useApp();

  const allCategories = ['all', ...categories];

  return (
    <div className="space-y-3">
      {/* Sort + Price Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value as SortOption)}
          className="h-9 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="none">Default order</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="discount-desc">Discount: High → Low</option>
          <option value="discount-asc">Discount: Low → High</option>
        </select>

        <select
          value={priceRange}
          onChange={e => setPriceRange(e.target.value as PriceRange)}
          className="h-9 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Prices</option>
          <option value="under-500">Under ₹500</option>
          <option value="500-1500">₹500 – ₹1500</option>
          <option value="above-1500">Above ₹1500</option>
        </select>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
        {allCategories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
