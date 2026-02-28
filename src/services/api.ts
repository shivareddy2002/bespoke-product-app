import { Product } from '@/types/product';

const BASE_URL = 'https://fakestoreapi.com';
const TIMEOUT_MS = 10000;
const CACHE_KEY = 'fakestore_products_cache';

async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

function expandProducts(products: Product[]): Product[] {
  const expanded = [...products];
  const prefixes = ['Premium', 'Classic', 'Modern', 'Luxury', 'Essential'];
  let nextId = 100;
  
  products.forEach(p => {
    for (let i = 0; i < 2; i++) {
      expanded.push({
        ...p,
        id: nextId++,
        title: `${prefixes[i % prefixes.length]} ${p.title}`,
        price: +(p.price * (0.7 + Math.random() * 0.6)).toFixed(2),
        rating: { rate: +(3.5 + Math.random() * 1.5).toFixed(1), count: Math.floor(50 + Math.random() * 500) },
      });
    }
  });
  
  return expanded;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/products`, TIMEOUT_MS);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: Product[] = await response.json();
    const expanded = expandProducts(data);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(expanded));
    } catch {}
    return expanded;
  } catch (error) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as Product[];
    }
    throw error;
  }
}
