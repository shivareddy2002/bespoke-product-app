import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Mail, Phone, X } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type View = 'options' | 'email' | 'phone' | 'otp';

export default function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const { loginWithEmail, loginWithPhone } = useAuth();
  const [view, setView] = useState<View>('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setView('options');
    setEmail('');
    setPassword('');
    setPhone('');
    setOtpInput('');
    setGeneratedOtp('');
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSuccess = () => {
    reset();
    onSuccess?.();
    onClose();
  };

  const handleEmail = () => {
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const result = loginWithEmail(email, password);
    if (!result.success) setError(result.error || 'Login failed');
    else handleSuccess();
  };

  const handleSendOtp = () => {
    setError('');
    if (!/^\+?\d{7,15}$/.test(phone.replace(/\s/g, ''))) { setError('Enter a valid phone number'); return; }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(otp);
    setView('otp');
  };

  const handleVerifyOtp = () => {
    setError('');
    if (otpInput !== generatedOtp) { setError('Incorrect OTP. Please try again.'); return; }
    const result = loginWithPhone(phone.replace(/\s/g, ''));
    if (!result.success) setError(result.error || 'Login failed');
    else handleSuccess();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm rounded-2xl bg-card p-6 card-shadow"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={handleClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>

          {view === 'options' && (
            <div className="space-y-5 text-center">
              <div>
                <h2 className="text-lg font-bold text-card-foreground">Sign in to continue</h2>
                <p className="text-sm text-muted-foreground mt-1">Login to add items to cart & favorites</p>
              </div>
              <div className="space-y-2.5">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setView('email'); setError(''); }}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  <Mail className="h-5 w-5" /> Continue with Email
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setView('phone'); setError(''); }}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-secondary py-3 text-sm font-semibold text-secondary-foreground hover:bg-accent">
                  <Phone className="h-5 w-5" /> Continue with Phone
                </motion.button>
              </div>
            </div>
          )}

          {view === 'email' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-card-foreground">Email Login</h2>
                <p className="text-sm text-muted-foreground">Sign in or create a new account</p>
              </div>
              <div className="space-y-3">
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                {error && <p className="text-xs font-medium text-destructive">{error}</p>}
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleEmail}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Continue</motion.button>
                <button onClick={() => { setView('options'); setError(''); }} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">← Back to options</button>
              </div>
            </div>
          )}

          {view === 'phone' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-card-foreground">Phone Login</h2>
                <p className="text-sm text-muted-foreground">Enter your phone number to receive OTP</p>
              </div>
              <div className="space-y-3">
                <input type="tel" placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                {error && <p className="text-xs font-medium text-destructive">{error}</p>}
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSendOtp}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Send OTP</motion.button>
                <button onClick={() => { setView('options'); setError(''); }} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">← Back to options</button>
              </div>
            </div>
          )}

          {view === 'otp' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-card-foreground">Verify OTP</h2>
                <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to {phone}</p>
                <p className="mt-2 rounded-lg bg-accent px-3 py-2 text-xs font-mono text-accent-foreground text-center">
                  Demo OTP: <span className="font-bold tracking-widest">{generatedOtp}</span>
                </p>
              </div>
              <div className="space-y-3">
                <input type="text" maxLength={6} placeholder="Enter 6-digit OTP" value={otpInput}
                  onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-11 w-full rounded-xl border border-input bg-background px-4 text-center text-lg font-bold tracking-[0.3em] text-foreground placeholder:text-muted-foreground placeholder:tracking-normal placeholder:text-sm placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-ring" />
                {error && <p className="text-xs font-medium text-destructive">{error}</p>}
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleVerifyOtp}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Verify & Login</motion.button>
                <button onClick={() => { setView('phone'); setError(''); setOtpInput(''); }} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">← Change number</button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
