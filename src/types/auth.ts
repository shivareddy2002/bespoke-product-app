export interface User {
  id: string;
  loginType: 'email' | 'phone' | 'guest';
  email?: string;
  phone?: string;
  name?: string;
  isGuest: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  items: { productId: number; quantity: number; priceUsd: number }[];
  totalUsd: number;
  date: string;
}
