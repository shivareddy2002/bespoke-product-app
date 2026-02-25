import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Mail, Phone, UserCircle, MapPin, Package, Plus, Trash2, LogIn } from 'lucide-react';
import { formatINR } from '@/lib/currency';

export default function Profile() {
  const { user, logout, addresses, addAddress, removeAddress, orders, convertGuest } = useAuth();
  const { getProduct, getDiscount } = useApp();
  const navigate = useNavigate();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showConvert, setShowConvert] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [convEmail, setConvEmail] = useState('');
  const [convPass, setConvPass] = useState('');
  const [convError, setConvError] = useState('');

  // Not logged in state
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-24">
        <header className="pb-4 pt-6">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </header>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <UserCircle className="h-16 w-16 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Sign in to manage your profile, orders, and addresses.</p>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <LogIn className="h-4 w-4" /> Sign In
          </motion.button>
        </div>
      </div>
    );
  }

  const handleAddAddress = () => {
    if (!addrName.trim() || !addrPhone.trim() || !addrLine.trim()) return;
    addAddress({ name: addrName.trim(), phone: addrPhone.trim(), address: addrLine.trim() });
    setAddrName(''); setAddrPhone(''); setAddrLine('');
    setShowAddressForm(false);
  };

  const handleConvert = () => {
    setConvError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(convEmail)) { setConvError('Enter a valid email'); return; }
    if (convPass.length < 6) { setConvError('Password must be at least 6 characters'); return; }
    const res = convertGuest(convEmail, convPass);
    if (!res.success) setConvError(res.error || 'Failed');
    else setShowConvert(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24">
      <header className="pb-4 pt-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      </header>

      {/* User Info */}
      <div className="mb-6 rounded-xl bg-card p-4 card-shadow">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {user.loginType === 'email' ? <Mail className="h-6 w-6" /> :
             user.loginType === 'phone' ? <Phone className="h-6 w-6" /> :
             <UserCircle className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-card-foreground">
              {user.isGuest ? 'Guest User' : user.email || user.phone}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{user.loginType} account</p>
          </div>
        </div>

        {user.isGuest && !showConvert && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowConvert(true)}
            className="mt-3 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Create Account
          </motion.button>
        )}

        {showConvert && (
          <div className="mt-3 space-y-2">
            <input type="email" placeholder="Email" value={convEmail} onChange={e => setConvEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="password" placeholder="Password (min 6)" value={convPass} onChange={e => setConvPass(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            {convError && <p className="text-xs text-destructive">{convError}</p>}
            <div className="flex gap-2">
              <button onClick={handleConvert} className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground">Convert</button>
              <button onClick={() => setShowConvert(false)} className="flex-1 rounded-lg bg-secondary py-2 text-sm font-medium text-secondary-foreground">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Saved Addresses
          </h2>
          <button onClick={() => setShowAddressForm(!showAddressForm)}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>

        {showAddressForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-3 space-y-2 rounded-xl bg-card p-3 card-shadow">
            <input placeholder="Full name" value={addrName} onChange={e => setAddrName(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input placeholder="Phone" value={addrPhone} onChange={e => setAddrPhone(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input placeholder="Address" value={addrLine} onChange={e => setAddrLine(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={handleAddAddress} className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground">Save Address</button>
          </motion.div>
        )}

        {addresses.length === 0 && !showAddressForm ? (
          <p className="text-sm text-muted-foreground">No saved addresses</p>
        ) : (
          <div className="space-y-2">
            {addresses.map(a => (
              <div key={a.id} className="flex items-start justify-between rounded-xl bg-card p-3 card-shadow">
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.phone}</p>
                  <p className="text-xs text-muted-foreground">{a.address}</p>
                </div>
                <button onClick={() => removeAddress(a.id)} className="text-destructive hover:bg-destructive/10 rounded-full p-1.5">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-foreground flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" /> Orders
        </h2>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet</p>
        ) : (
          <div className="space-y-2">
            {orders.map(order => (
              <div key={order.id} className="rounded-xl bg-card p-3 card-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                  <p className="text-sm font-bold text-primary">{formatINR(order.totalUsd)}</p>
                </div>
                <div className="space-y-1">
                  {order.items.map((item, i) => {
                    const prod = getProduct(item.productId);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        {prod && <img src={prod.image} alt="" className="h-8 w-8 rounded object-contain bg-secondary/50 p-0.5" />}
                        <p className="text-xs text-card-foreground line-clamp-1 flex-1">{prod?.title || `Product #${item.productId}`}</p>
                        <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive py-3 text-sm font-semibold text-destructive hover:bg-destructive/10">
        <LogOut className="h-4 w-4" /> Logout
      </motion.button>
    </div>
  );
}
