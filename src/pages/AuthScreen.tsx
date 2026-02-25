import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowLeft, ShoppingBag } from 'lucide-react';

type View = 'options' | 'email' | 'phone' | 'otp';

export default function AuthScreen() {
  const { loginWithEmail, loginWithPhone } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');

  const handleEmail = () => {
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const result = loginWithEmail(email, password);
    if (!result.success) setError(result.error || 'Login failed');
    else navigate('/');
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
    else navigate('/');
  };

  const slideIn = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.25, ease: 'easeOut' as const },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <AnimatePresence mode="wait">
        {view === 'options' && (
          <motion.div key="options" {...slideIn} className="w-full max-w-sm space-y-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Beespoke</h1>
              <p className="text-sm text-muted-foreground">Shop smart. Save more.</p>
            </div>
            <div className="space-y-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setView('email'); setError(''); }}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                <Mail className="h-5 w-5" /> Continue with Email
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setView('phone'); setError(''); }}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-secondary py-3.5 text-sm font-semibold text-secondary-foreground hover:bg-accent">
                <Phone className="h-5 w-5" /> Continue with Phone
              </motion.button>
              <button onClick={() => navigate('/')} className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-2">
                ← Continue browsing without login
              </button>
            </div>
          </motion.div>
        )}

        {view === 'email' && (
          <motion.div key="email" {...slideIn} className="w-full max-w-sm space-y-5">
            <button onClick={() => setView('options')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
              <h2 className="text-xl font-bold text-foreground">Email Login</h2>
              <p className="text-sm text-muted-foreground">Sign in or create a new account</p>
            </div>
            <div className="space-y-3">
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              {error && <p className="text-xs font-medium text-destructive">{error}</p>}
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleEmail}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Continue</motion.button>
            </div>
          </motion.div>
        )}

        {view === 'phone' && (
          <motion.div key="phone" {...slideIn} className="w-full max-w-sm space-y-5">
            <button onClick={() => setView('options')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
              <h2 className="text-xl font-bold text-foreground">Phone Login</h2>
              <p className="text-sm text-muted-foreground">Enter your phone number to receive OTP</p>
            </div>
            <div className="space-y-3">
              <input type="tel" placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              {error && <p className="text-xs font-medium text-destructive">{error}</p>}
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSendOtp}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Send OTP</motion.button>
            </div>
          </motion.div>
        )}

        {view === 'otp' && (
          <motion.div key="otp" {...slideIn} className="w-full max-w-sm space-y-5">
            <button onClick={() => { setView('phone'); setOtpInput(''); setError(''); }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Change number
            </button>
            <div>
              <h2 className="text-xl font-bold text-foreground">Verify OTP</h2>
              <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to {phone}</p>
              <p className="mt-2 rounded-lg bg-accent px-3 py-2 text-xs font-mono text-accent-foreground text-center">
                Demo OTP: <span className="font-bold tracking-widest">{generatedOtp}</span>
              </p>
            </div>
            <div className="space-y-3">
              <input type="text" maxLength={6} placeholder="Enter 6-digit OTP" value={otpInput}
                onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="h-11 w-full rounded-xl border border-input bg-card px-4 text-center text-lg font-bold tracking-[0.3em] text-foreground placeholder:text-muted-foreground placeholder:tracking-normal placeholder:text-sm placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-ring" />
              {error && <p className="text-xs font-medium text-destructive">{error}</p>}
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleVerifyOtp}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Verify & Login</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
