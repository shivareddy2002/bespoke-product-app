import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import EmptyState from '@/components/EmptyState';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, MapPin } from 'lucide-react';
import { formatINR, toINR, getOriginalPrice } from '@/lib/currency';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import LoginModal from '@/components/LoginModal';
import { useState } from 'react';

export default function Cart() {
  const { cartItems, getProduct, updateCartQuantity, removeFromCart, cartTotal, cartOriginalTotal, getDiscount } = useApp();
  const { user, placeOrder, addresses, addAddress } = useAuth();
  const navigate = useNavigate();
  const { showLogin, requireAuth, onLoginSuccess, onLoginClose } = useRequireAuth();
  const [showAddressPrompt, setShowAddressPrompt] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddr, setNewAddr] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const savingsUsd = cartOriginalTotal - cartTotal;

  const proceedToCheckout = () => {
    if (addresses.length === 0) {
      setShowAddressPrompt(true);
      return;
    }
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
    }
    doPlaceOrder();
  };

  const handleSaveAddress = () => {
    if (!newName.trim() || !newPhone.trim() || !newAddr.trim()) return;
    addAddress({ name: newName.trim(), phone: newPhone.trim(), address: newAddr.trim() });
    setNewName(''); setNewPhone(''); setNewAddr('');
    setShowAddressPrompt(false);
    // Place order after saving address
    setTimeout(() => doPlaceOrder(), 100);
  };

  const doPlaceOrder = () => {
    const orderItems = cartItems.map(c => {
      const p = getProduct(c.productId);
      return { productId: c.productId, quantity: c.quantity, priceUsd: p?.price || 0 };
    });
    placeOrder(orderItems, cartTotal);
    cartItems.forEach(c => removeFromCart(c.productId));
    navigate('/order-success');
  };

  const handleCheckout = () => {
    requireAuth(() => proceedToCheckout());
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24">
      <header className="pb-3 pt-6">
        <h1 className="text-2xl font-bold text-foreground">Cart</h1>
        <p className="text-sm text-muted-foreground">{cartItems.length} items</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="space-y-4">
          <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Add products to your cart to see them here." />
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 pt-2 pb-44">
          {cartItems.map((item, i) => {
            const product = getProduct(item.productId);
            if (!product) return null;
            const discount = getDiscount(item.productId);
            return (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-sm font-bold text-primary">{formatINR(product.price)}</p>
                    {discount > 0 && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        ₹{toINR(getOriginalPrice(product.price, discount)).toFixed(0)}
                      </span>
                    )}
                  </div>
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

          {/* Total bar with savings */}
          <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md">
            <div className="mx-auto max-w-3xl space-y-2">
              {savingsUsd > 0 && (
                <p className="text-xs font-semibold text-success text-center">
                  🎉 You saved ₹{toINR(savingsUsd).toFixed(0)} on this order!
                </p>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold text-primary">{formatINR(cartTotal)}</p>
                    {savingsUsd > 0 && (
                      <span className="text-xs text-muted-foreground line-through">₹{toINR(cartOriginalTotal).toFixed(0)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/')}
                    className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    Continue Shopping
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCheckout}
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Place Order
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address prompt modal */}
      {showAddressPrompt && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4"
          onClick={() => setShowAddressPrompt(false)}>
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="w-full max-w-sm rounded-2xl bg-card p-6 card-shadow space-y-4"
            onClick={e => e.stopPropagation()}>
            <div>
              <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Add Delivery Address
              </h2>
              <p className="text-sm text-muted-foreground">Add an address before placing your order</p>
            </div>
            <input placeholder="Full name" value={newName} onChange={e => setNewName(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input placeholder="Phone number" value={newPhone} onChange={e => setNewPhone(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input placeholder="Full address" value={newAddr} onChange={e => setNewAddr(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <div className="flex gap-2">
              <button onClick={handleSaveAddress}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Save & Order</button>
              <button onClick={() => setShowAddressPrompt(false)}
                className="flex-1 rounded-lg bg-secondary py-2.5 text-sm font-medium text-secondary-foreground">Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <LoginModal open={showLogin} onClose={onLoginClose} onSuccess={onLoginSuccess} />
    </div>
  );
}
