import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroBanner() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-6 cursor-pointer mb-6"
      onClick={() => navigate('/section/deals')}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
            Limited Time
          </span>
        </div>
        <h2 className="text-2xl font-bold text-primary-foreground mb-1">
          Big Sale — Up to 60% Off
        </h2>
        <p className="text-sm text-primary-foreground/80 mb-3">
          Trending deals on top-rated products
        </p>
        <span className="inline-block rounded-lg bg-primary-foreground/20 px-4 py-2 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
          Shop Now →
        </span>
      </div>
      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-foreground/10" />
      <div className="absolute -bottom-6 -right-2 h-20 w-20 rounded-full bg-primary-foreground/5" />
    </motion.div>
  );
}
