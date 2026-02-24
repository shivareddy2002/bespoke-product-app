import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
      >
        <CheckCircle className="h-20 w-20 text-success" />
      </motion.div>
      <h1 className="text-2xl font-bold text-foreground">Order Placed!</h1>
      <p className="text-sm text-muted-foreground max-w-xs">
        Your order has been placed successfully. You can view it in your profile.
      </p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/')}
        className="mt-2 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        <ShoppingBag className="h-4 w-4" /> Continue Shopping
      </motion.button>
    </motion.div>
  );
}
