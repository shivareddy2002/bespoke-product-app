import { HistoryEntry } from '@/types/product';

const KEYS = {
  liked: 'fakestore_liked',
  disliked: 'fakestore_disliked',
  history: 'fakestore_history',
} as const;

function getSet(key: string): Set<number> {
  try {
    const data = localStorage.getItem(key);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch {
    return new Set();
  }
}

function saveSet(key: string, set: Set<number>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

export function loadLiked(): Set<number> {
  return getSet(KEYS.liked);
}

export function saveLiked(ids: Set<number>) {
  saveSet(KEYS.liked, ids);
}

export function loadDisliked(): Set<number> {
  return getSet(KEYS.disliked);
}

export function saveDisliked(ids: Set<number>) {
  saveSet(KEYS.disliked, ids);
}

export function loadHistory(): HistoryEntry[] {
  try {
    const data = localStorage.getItem(KEYS.history);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(KEYS.history, JSON.stringify(entries));
}
