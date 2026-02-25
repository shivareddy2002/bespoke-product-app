import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Clock, ShoppingCart, User, Search, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const tabs = [
  { to: '/', icon: ShoppingBag, label: 'Home' },
  { to: '/favorites', icon: Heart, label: 'Favorites', badgeType: 'likes' as const },
  { to: '/cart', icon: ShoppingCart, label: 'Cart', badgeType: 'cart' as const },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Layout() {
  const { cartCount, likedIds, searchQuery, setSearchQuery, products } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = searchQuery.trim().length > 1
    ? products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5).map(p => p.title)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getBadgeCount = (type?: 'likes' | 'cart') => {
    if (type === 'cart') return cartCount;
    if (type === 'likes') return likedIds.size;
    return 0;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              B
            </div>
            <span className="hidden sm:block text-base font-bold text-foreground">Beespoke</span>
          </NavLink>

          {/* Search - Desktop */}
          <div className="hidden sm:block flex-1 max-w-xl mx-auto relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-10 z-50 rounded-xl border border-border bg-card p-1 shadow-lg">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { setSearchQuery(s); setShowSuggestions(false); }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-card-foreground hover:bg-secondary truncate">{s}</button>
                ))}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Mobile search toggle */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="sm:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
              <Search className="h-5 w-5" />
            </button>

            <button onClick={() => navigate('/favorites')} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
              <Heart className="h-5 w-5" />
              {likedIds.size > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-success px-1 text-[9px] font-bold text-success-foreground">
                  {likedIds.size}
                </span>
              )}
            </button>

            <button onClick={() => navigate('/cart')} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {user ? (
              <button onClick={() => navigate('/profile')} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
                <User className="h-5 w-5" />
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="flex h-8 items-center rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90">
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Expandable */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="sm:hidden overflow-hidden border-t border-border">
              <div className="relative px-4 py-2">
                <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search products..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)} autoFocus
                  className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}
                    className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {tabs.map(({ to, icon: Icon, label, badgeType }) => {
            const count = getBadgeCount(badgeType);
            return (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`
                }>
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  <AnimatePresence>
                    {count > 0 && (
                      <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className={`absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                          badgeType === 'cart' ? 'bg-destructive text-destructive-foreground' : 'bg-success text-success-foreground'
                        }`}>{count}</motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
