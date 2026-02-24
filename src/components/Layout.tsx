import { NavLink, Outlet } from 'react-router-dom';
import { ShoppingBag, Heart, Clock, ShoppingCart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { to: '/', icon: ShoppingBag, label: 'Home' },
  { to: '/favorites', icon: Heart, label: 'Favorites', badgeType: 'likes' as const },
  { to: '/cart', icon: ShoppingCart, label: 'Cart', badgeType: 'cart' as const },
  { to: '/history', icon: Clock, label: 'History' },
];

export default function Layout() {
  const { cartCount, likedIds } = useApp();

  const getBadgeCount = (type?: 'likes' | 'cart') => {
    if (type === 'cart') return cartCount;
    if (type === 'likes') return likedIds.size;
    return 0;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {tabs.map(({ to, icon: Icon, label, badgeType }) => {
            const count = getBadgeCount(badgeType);
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  <AnimatePresence>
                    {count > 0 && (
                      <motion.span
                        key={count}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className={`absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                          badgeType === 'cart' ? 'bg-destructive text-destructive-foreground' : 'bg-success text-success-foreground'
                        }`}
                      >
                        {count}
                      </motion.span>
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
