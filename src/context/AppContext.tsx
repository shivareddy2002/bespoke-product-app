import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Product, SortOption, HistoryEntry, CartItem } from '@/types/product';
import { fetchProducts } from '@/services/api';
import {
  loadLiked, saveLiked,
  loadDisliked, saveDisliked,
  loadHistory, saveHistory,
  loadCart, saveCart,
  loadDiscounts, saveDiscounts,
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
  cartItems: CartItem[];
  discountMap: Record<number, number>;
  categories: string[];
  setSearchQuery: (q: string) => void;
  setSortOption: (s: SortOption) => void;
  toggleLike: (id: number) => void;
  toggleDislike: (id: number) => void;
  addHistory: (entry: Omit<HistoryEntry, 'visitedAt'>) => void;
  refresh: () => Promise<void>;
  getProduct: (id: number) => Product | undefined;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  cartCount: number;
  cartTotal: number;
  getDiscount: (id: number) => number;
  getProductsByCategory: (category: string) => Product[];
  featuredProducts: Product[];
  topDeals: Product[];
}

const AppContext = createContext<AppState | null>(null);

function generateDiscounts(products: Product[], existing: Record<number, number>): Record<number, number> {
  const map = { ...existing };
  let changed = false;
  products.forEach(p => {
    if (!(p.id in map)) {
      map[p.id] = Math.floor(Math.random() * 41) + 20; // 20-60
      changed = true;
    }
  });
  if (changed) saveDiscounts(map);
  return map;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('none');
  const [likedIds, setLikedIds] = useState<Set<number>>(() => loadLiked());
  const [dislikedIds, setDislikedIds] = useState<Set<number>>(() => loadDisliked());
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCart());
  const [discountMap, setDiscountMap] = useState<Record<number, number>>(() => loadDiscounts());

  const loadProductsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
      setDiscountMap(prev => generateDiscounts(data, prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProductsData(); }, [loadProductsData]);
  useEffect(() => { saveLiked(likedIds); }, [likedIds]);
  useEffect(() => { saveDisliked(dislikedIds); }, [dislikedIds]);
  useEffect(() => { saveHistory(history); }, [history]);
  useEffect(() => { saveCart(cartItems); }, [cartItems]);

  const toggleLike = useCallback((id: number) => {
    setLikedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setDislikedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  }, []);

  const toggleDislike = useCallback((id: number) => {
    setDislikedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setLikedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  }, []);

  const addHistory = useCallback((entry: Omit<HistoryEntry, 'visitedAt'>) => {
    setHistory(prev => [
      { ...entry, visitedAt: new Date().toISOString() },
      ...prev.filter(h => h.productId !== entry.productId),
    ].slice(0, 100));
  }, []);

  const addToCart = useCallback((productId: number) => {
    setCartItems(prev => {
      const existing = prev.find(c => c.productId === productId);
      if (existing) return prev.map(c => c.productId === productId ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { productId, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems(prev => prev.filter(c => c.productId !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(c => c.productId !== productId));
    } else {
      setCartItems(prev => prev.map(c => c.productId === productId ? { ...c, quantity } : c));
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }
    if (sortOption === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [products, searchQuery, sortOption]);

  const likedProducts = useMemo(() => products.filter(p => likedIds.has(p.id)), [products, likedIds]);

  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  const featuredProducts = useMemo(() => products.filter(p => p.rating.rate >= 4).slice(0, 8), [products]);

  const topDeals = useMemo(() => {
    return [...products].sort((a, b) => (discountMap[b.id] || 0) - (discountMap[a.id] || 0)).slice(0, 8);
  }, [products, discountMap]);

  const getProduct = useCallback((id: number) => products.find(p => p.id === id), [products]);
  const getDiscount = useCallback((id: number) => discountMap[id] || 0, [discountMap]);
  const getProductsByCategory = useCallback((category: string) => products.filter(p => p.category === category), [products]);

  const cartCount = useMemo(() => cartItems.reduce((s, c) => s + c.quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => {
    return cartItems.reduce((s, c) => {
      const p = products.find(pr => pr.id === c.productId);
      return s + (p ? p.price * c.quantity : 0);
    }, 0);
  }, [cartItems, products]);

  const value: AppState = {
    products, loading, error, searchQuery, sortOption,
    likedIds, dislikedIds, history, filteredProducts, likedProducts,
    cartItems, discountMap, categories, featuredProducts, topDeals,
    setSearchQuery, setSortOption, toggleLike, toggleDislike,
    addHistory, refresh: loadProductsData, getProduct,
    addToCart, removeFromCart, updateCartQuantity,
    cartCount, cartTotal, getDiscount, getProductsByCategory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
