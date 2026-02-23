import { Product } from '@/types/product';
import { useApp } from '@/context/AppContext';
import { Heart, ThumbsDown, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { likedIds, dislikedIds, toggleLike, toggleDislike, addHistory } = useApp();
  const navigate = useNavigate();
  const isLiked = likedIds.has(product.id);
  const isDisliked = dislikedIds.has(product.id);

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
      className="group cursor-pointer rounded-xl bg-card p-4 card-shadow transition-shadow hover:card-shadow-hover"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative mb-3 flex h-48 items-center justify-center overflow-hidden rounded-lg bg-secondary/50 p-4">
        <img
          src={product.image}
          alt={product.title}
          className="h-full max-h-40 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {product.category}
      </p>
      <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight text-card-foreground">
        {product.title}
      </h3>
      <p className="mb-3 text-lg font-bold text-primary">${product.price.toFixed(2)}</p>

      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={e => { e.stopPropagation(); toggleLike(product.id); }}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            isLiked ? 'bg-success text-success-foreground' : 'bg-secondary text-muted-foreground hover:text-success'
          }`}
          aria-label="Like"
        >
          <Heart className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={e => { e.stopPropagation(); toggleDislike(product.id); }}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            isDisliked ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-muted-foreground hover:text-destructive'
          }`}
          aria-label="Dislike"
        >
          <ThumbsDown className="h-4 w-4" fill={isDisliked ? 'currentColor' : 'none'} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={openInBrowser}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          aria-label="Open in browser"
        >
          <ExternalLink className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
