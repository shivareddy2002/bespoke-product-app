import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Product, SortOption, HistoryEntry } from '@/types/product';
import { fetchProducts } from '@/services/api';
import {
  loadLiked, saveLiked,
  loadDisliked, saveDisliked,
  loadHistory, saveHistory,
} from '@/services/persistence';

interface AppState {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  sortOption: SortOption;
  likedIds: Set<number>;
  dislikedIds: Set<number>;
  history: HistoryEntry[];
  filteredProducts: Product[];
  likedProducts: Product[];
  setSearchQuery: (q: string) => void;
  setSortOption: (s: SortOption) => void;
  toggleLike: (id: number) => void;
  toggleDislike: (id: number) => void;
  addHistory: (entry: Omit<HistoryEntry, 'visitedAt'>) => void;
  refresh: () => Promise<void>;
  getProduct: (id: number) => Product | undefined;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('none');
  const [likedIds, setLikedIds] = useState<Set<number>>(() => loadLiked());
  const [dislikedIds, setDislikedIds] = useState<Set<number>>(() => loadDisliked());
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => { saveLiked(likedIds); }, [likedIds]);
  useEffect(() => { saveDisliked(dislikedIds); }, [dislikedIds]);
  useEffect(() => { saveHistory(history); }, [history]);

  const toggleLike = useCallback((id: number) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
    setDislikedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleDislike = useCallback((id: number) => {
    setDislikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
    setLikedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const addHistory = useCallback((entry: Omit<HistoryEntry, 'visitedAt'>) => {
    setHistory(prev => [
      { ...entry, visitedAt: new Date().toISOString() },
      ...prev.filter(h => !(h.productId === entry.productId)),
    ].slice(0, 100));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }
    if (sortOption === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [products, searchQuery, sortOption]);

  const likedProducts = useMemo(
    () => products.filter(p => likedIds.has(p.id)),
    [products, likedIds]
  );

  const getProduct = useCallback(
    (id: number) => products.find(p => p.id === id),
    [products]
  );

  const value: AppState = {
    products, loading, error, searchQuery, sortOption,
    likedIds, dislikedIds, history, filteredProducts, likedProducts,
    setSearchQuery, setSortOption, toggleLike, toggleDislike,
    addHistory, refresh: loadProducts, getProduct,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
