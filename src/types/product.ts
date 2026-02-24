export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export type SortOption = 'none' | 'price-asc' | 'price-desc' | 'discount-desc' | 'discount-asc';

export type PriceRange = 'all' | 'under-500' | '500-1500' | 'above-1500';

export interface HistoryEntry {
  url: string;
  productId: number;
  title: string;
  visitedAt: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}
