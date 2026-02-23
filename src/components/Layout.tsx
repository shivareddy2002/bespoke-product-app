import { NavLink, Outlet } from 'react-router-dom';
import { ShoppingBag, Heart, Clock, ShoppingCart } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const tabs = [
  { to: '/', icon: ShoppingBag, label: 'Home' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: true },
  { to: '/history', icon: Clock, label: 'History' },
];

export default function Layout() {
  const { cartCount, likedIds } = useApp();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {tabs.map(({ to, icon: Icon, label, badge }) => (
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
                {badge && cartCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                    {cartCount}
                  </span>
                )}
                {label === 'Favorites' && likedIds.size > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-success px-1 text-[9px] font-bold text-success-foreground">
                    {likedIds.size}
                  </span>
                )}
              </div>
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
