import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Address, Order } from '@/types/auth';
import {
  loadSession, saveSession, clearSession,
  findUserByEmail, findUserByPhone,
  createEmailUser, createPhoneUser,
  validatePassword, convertGuestToEmail,
  loadAddresses, saveAddresses,
  loadOrders, saveOrders,
} from '@/services/authPersistence';

interface AuthState {
  user: User | null;
  addresses: Address[];
  orders: Order[];
  loginWithEmail: (email: string, password: string) => { success: boolean; error?: string };
  loginWithPhone: (phone: string) => { success: boolean; error?: string };
  continueAsGuest: () => void;
  logout: () => void;
  convertGuest: (email: string, password: string) => { success: boolean; error?: string };
  addAddress: (addr: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  placeOrder: (items: Order['items'], totalUsd: number) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadSession());
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load user-specific data
  useEffect(() => {
    if (user) {
      setAddresses(loadAddresses(user.id));
      setOrders(loadOrders(user.id));
    } else {
      setAddresses([]);
      setOrders([]);
    }
  }, [user?.id]);

  const setAndPersist = useCallback((u: User) => {
    setUser(u);
    saveSession(u);
  }, []);

  const loginWithEmail = useCallback((email: string, password: string) => {
    const existing = findUserByEmail(email);
    if (existing) {
      if (!validatePassword(email, password)) return { success: false, error: 'Incorrect password' };
      const u: User = { id: existing.id, loginType: 'email', email, isGuest: false, createdAt: existing.createdAt };
      setAndPersist(u);
      return { success: true };
    }
    // New user
    const created = createEmailUser(email, password);
    const u: User = { id: created.id, loginType: 'email', email, isGuest: false, createdAt: created.createdAt };
    setAndPersist(u);
    return { success: true };
  }, [setAndPersist]);

  const loginWithPhone = useCallback((phone: string) => {
    const existing = findUserByPhone(phone);
    if (existing) {
      const u: User = { id: existing.id, loginType: 'phone', phone, isGuest: false, createdAt: existing.createdAt };
      setAndPersist(u);
      return { success: true };
    }
    const created = createPhoneUser(phone);
    const u: User = { id: created.id, loginType: 'phone', phone, isGuest: false, createdAt: created.createdAt };
    setAndPersist(u);
    return { success: true };
  }, [setAndPersist]);

  const continueAsGuest = useCallback(() => {
    const u: User = { id: crypto.randomUUID(), loginType: 'guest', isGuest: true, createdAt: new Date().toISOString() };
    setAndPersist(u);
  }, [setAndPersist]);

  const logout = useCallback(() => {
    if (user?.isGuest) {
      // Clear guest-specific data
      localStorage.removeItem(`fakestore_addresses_${user.id}`);
      localStorage.removeItem(`fakestore_orders_${user.id}`);
    }
    clearSession();
    setUser(null);
  }, [user]);

  const convertGuest = useCallback((email: string, password: string) => {
    if (!user?.isGuest) return { success: false, error: 'Not a guest' };
    const existing = findUserByEmail(email);
    if (existing) return { success: false, error: 'Email already in use' };
    convertGuestToEmail(user.id, email, password);
    const u: User = { id: user.id, loginType: 'email', email, isGuest: false, createdAt: user.createdAt };
    setAndPersist(u);
    return { success: true };
  }, [user, setAndPersist]);

  const addAddress = useCallback((addr: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddr = { ...addr, id: crypto.randomUUID() };
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    saveAddresses(user.id, updated);
  }, [user, addresses]);

  const removeAddress = useCallback((id: string) => {
    if (!user) return;
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    saveAddresses(user.id, updated);
  }, [user, addresses]);

  const placeOrder = useCallback((items: Order['items'], totalUsd: number) => {
    if (!user) return;
    const order: Order = { id: crypto.randomUUID(), items, totalUsd, date: new Date().toISOString() };
    const updated = [order, ...orders];
    setOrders(updated);
    saveOrders(user.id, updated);
  }, [user, orders]);

  return (
    <AuthContext.Provider value={{
      user, addresses, orders,
      loginWithEmail, loginWithPhone, continueAsGuest,
      logout, convertGuest, addAddress, removeAddress, placeOrder,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
