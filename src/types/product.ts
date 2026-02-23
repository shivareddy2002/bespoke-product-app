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

export type SortOption = 'none' | 'price-asc' | 'price-desc';

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
