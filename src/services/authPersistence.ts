import { User, Address, Order } from '@/types/auth';

const KEYS = {
  user: 'fakestore_user',
  users: 'fakestore_users_db',
  addresses: 'fakestore_addresses',
  orders: 'fakestore_orders',
} as const;

// --- Users DB (simulated) ---
interface StoredUser {
  id: string;
  loginType: 'email' | 'phone';
  email?: string;
  phone?: string;
  password?: string;
  createdAt: string;
}

function getUsersDb(): StoredUser[] {
  try {
    const d = localStorage.getItem(KEYS.users);
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

function saveUsersDb(users: StoredUser[]) {
  localStorage.setItem(KEYS.users, JSON.stringify(users));
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return getUsersDb().find(u => u.email === email);
}

export function findUserByPhone(phone: string): StoredUser | undefined {
  return getUsersDb().find(u => u.phone === phone);
}

export function createEmailUser(email: string, password: string): StoredUser {
  const user: StoredUser = {
    id: crypto.randomUUID(),
    loginType: 'email',
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  const db = getUsersDb();
  db.push(user);
  saveUsersDb(db);
  return user;
}

export function createPhoneUser(phone: string): StoredUser {
  const user: StoredUser = {
    id: crypto.randomUUID(),
    loginType: 'phone',
    phone,
    createdAt: new Date().toISOString(),
  };
  const db = getUsersDb();
  db.push(user);
  saveUsersDb(db);
  return user;
}

export function validatePassword(email: string, password: string): boolean {
  const user = findUserByEmail(email);
  return user?.password === password;
}

export function convertGuestToEmail(guestId: string, email: string, password: string): StoredUser {
  const user: StoredUser = {
    id: guestId,
    loginType: 'email',
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  const db = getUsersDb();
  db.push(user);
  saveUsersDb(db);
  return user;
}

// --- Session ---
export function loadSession(): User | null {
  try {
    const d = localStorage.getItem(KEYS.user);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
}

export function saveSession(user: User) {
  localStorage.setItem(KEYS.user, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(KEYS.user);
}

// --- Addresses ---
export function loadAddresses(userId: string): Address[] {
  try {
    const d = localStorage.getItem(`${KEYS.addresses}_${userId}`);
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

export function saveAddresses(userId: string, addresses: Address[]) {
  localStorage.setItem(`${KEYS.addresses}_${userId}`, JSON.stringify(addresses));
}

// --- Orders ---
export function loadOrders(userId: string): Order[] {
  try {
    const d = localStorage.getItem(`${KEYS.orders}_${userId}`);
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

export function saveOrders(userId: string, orders: Order[]) {
  localStorage.setItem(`${KEYS.orders}_${userId}`, JSON.stringify(orders));
}
