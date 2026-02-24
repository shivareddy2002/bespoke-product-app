import { Product } from '@/types/product';
import { useApp } from '@/context/AppContext';
import { Heart, ShoppingCart, ExternalLink, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatINR, getOriginalPrice, toINR } from '@/lib/currency';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { likedIds, toggleLike, addToCart, addHistory, getDiscount } = useApp();
  const navigate = useNavigate();
  const isLiked = likedIds.has(product.id);
  const discount = getDiscount(product.id);
  const isHotDeal = discount > 50;

  const openInBrowser = (e: React.MouseEvent) => {
    e.stopPropagation();
    addHistory({
      url: `https://fakestoreapi.com/products/${product.id}`,
      productId: product.id,
      title: product.title,
    });
    window.open(`https://fakestoreapi.com/products/${product.id}`, '_blank');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group cursor-pointer rounded-xl bg-card p-3 card-shadow transition-shadow duration-200 hover:card-shadow-hover flex flex-col"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative mb-2 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-secondary/50 p-3">
        <img
          src={product.image}
          alt={product.title}
          className="h-full max-h-32 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
            {discount}% OFF
          </span>
        )}
        {isHotDeal && (
          <span className="absolute right-2 top-2 flex items-center gap-0.5 rounded-md bg-warning px-1.5 py-0.5 text-[10px] font-bold text-warning-foreground">
            <Flame className="h-3 w-3" /> Hot Deal
          </span>
        )}
      </div>

      <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {product.category}
      </p>
      <h3 className="mb-1.5 line-clamp-2 text-xs font-semibold leading-tight text-card-foreground flex-1">
        {product.title}
      </h3>

      <div className="mb-2">
        <span className="text-sm font-bold text-primary">{formatINR(product.price)}</span>
        {discount > 0 && (
          <span className="ml-1.5 text-[10px] text-muted-foreground line-through">
            ₹{toINR(getOriginalPrice(product.price, discount)).toFixed(0)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={e => { e.stopPropagation(); toggleLike(product.id); }}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ${
            isLiked ? 'bg-success text-success-foreground' : 'bg-secondary text-muted-foreground hover:text-success'
          }`}
          aria-label="Like"
        >
          <Heart className="h-3.5 w-3.5" fill={isLiked ? 'currentColor' : 'none'} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={e => { e.stopPropagation(); addToCart(product.id); }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={openInBrowser}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
          aria-label="Open in browser"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
