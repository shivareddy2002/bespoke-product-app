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

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/products`, TIMEOUT_MS);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: Product[] = await response.json();
    // Cache successful response
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {}
    return data;
  } catch (error) {
    // Try cached data
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as Product[];
    }
    throw error;
  }
}
