import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroBanner() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-4 sm:p-5 cursor-pointer"
      onClick={() => navigate('/section/deals')}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/80">
            Limited Time
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-primary-foreground mb-0.5">
          Big Sale — Up to 60% Off
        </h2>
        <p className="text-xs text-primary-foreground/80 mb-2">
          Trending deals on top-rated products
        </p>
        <span className="inline-block rounded-lg bg-primary-foreground/20 px-3 py-1.5 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
          Shop Now →
        </span>
      </div>
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-foreground/10" />
      <div className="absolute -bottom-4 -right-2 h-16 w-16 rounded-full bg-primary-foreground/5" />
    </motion.div>
  );
}
