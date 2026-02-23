import { useApp } from '@/context/AppContext';
import EmptyState from '@/components/EmptyState';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { formatINR } from '@/lib/currency';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cartItems, getProduct, updateCartQuantity, removeFromCart, cartTotal } = useApp();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-4">
      <header className="pb-3 pt-6">
        <h1 className="text-2xl font-bold text-foreground">Cart</h1>
        <p className="text-sm text-muted-foreground">{cartItems.length} items</p>
      </header>

      {cartItems.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Add products to your cart to see them here." />
      ) : (
        <div className="space-y-3 pt-2 pb-32">
          {cartItems.map(item => {
            const product = getProduct(item.productId);
            if (!product) return null;
            return (
              <motion.div
                key={item.productId}
                layout
                className="flex items-center gap-3 rounded-xl bg-card p-3 card-shadow"
              >
                <div
                  className="h-16 w-16 flex-shrink-0 rounded-lg bg-secondary/50 p-2 flex items-center justify-center cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img src={product.image} alt={product.title} className="h-full w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-card-foreground line-clamp-1">{product.title}</h3>
                  <p className="text-sm font-bold text-primary">{formatINR(product.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-muted"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-muted"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Total bar */}
          <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-primary">{formatINR(cartTotal)}</p>
              </div>
              <button className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
