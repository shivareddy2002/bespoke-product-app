import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, products } = useApp();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const suggestions = searchQuery.trim().length > 1
    ? products
        .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
        .map(p => p.title)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative mb-3" ref={ref}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
        onFocus={() => setShowSuggestions(true)}
        className="h-10 w-full rounded-xl border border-input bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {searchQuery && (
        <button
          onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-11 z-50 rounded-xl border border-border bg-card p-1 shadow-lg">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { setSearchQuery(s); setShowSuggestions(false); }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-card-foreground hover:bg-secondary truncate"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
