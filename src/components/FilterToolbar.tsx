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
    <div className="space-y-2">
      {/* Row: Categories left, Sort + Price right */}
      <div className="flex items-center gap-2">
        {/* Category chips - scrollable left */}
        <div className="flex flex-1 gap-1.5 overflow-x-auto scrollbar-hide">
          {allCategories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-200 ${
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

        {/* Sort + Price right */}
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <select
            value={priceRange}
            onChange={e => setPriceRange(e.target.value as PriceRange)}
            className="h-8 rounded-lg border border-input bg-card px-2 text-[11px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All ₹</option>
            <option value="under-500">&lt;₹500</option>
            <option value="500-1500">₹500–1.5K</option>
            <option value="above-1500">&gt;₹1500</option>
          </select>

          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value as SortOption)}
            className="h-8 rounded-lg border border-input bg-card px-2 text-[11px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="none">Sort</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="discount-desc">Discount ↓</option>
            <option value="discount-asc">Discount ↑</option>
          </select>
        </div>
      </div>
    </div>
  );
}
