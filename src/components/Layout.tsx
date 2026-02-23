import { NavLink, Outlet } from 'react-router-dom';
import { ShoppingBag, Heart, Clock } from 'lucide-react';

const tabs = [
  { to: '/', icon: ShoppingBag, label: 'Products' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/history', icon: Clock, label: 'History' },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
