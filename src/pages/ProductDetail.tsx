import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Heart, ThumbsDown, ExternalLink, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, likedIds, dislikedIds, toggleLike, toggleDislike, addHistory } = useApp();

  const product = getProduct(Number(id));
  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const isLiked = likedIds.has(product.id);
  const isDisliked = dislikedIds.has(product.id);

  const openInBrowser = () => {
    addHistory({
      url: `https://fakestoreapi.com/products/${product.id}`,
      productId: product.id,
      title: product.title,
    });
    window.open(`https://fakestoreapi.com/products/${product.id}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-2xl px-4 pb-24 pt-4"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Image */}
      <div className="mb-6 flex h-72 items-center justify-center rounded-2xl bg-card p-8 card-shadow">
        <img
          src={product.image}
          alt={product.title}
          className="h-full max-h-56 w-auto object-contain"
        />
      </div>

      {/* Category & Rating */}
      <div className="mb-2 flex items-center gap-3">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          {product.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-warning text-warning" />
          {product.rating.rate} ({product.rating.count})
        </span>
      </div>

      {/* Title & Price */}
      <h1 className="mb-2 text-xl font-bold text-foreground">{product.title}</h1>
      <p className="mb-4 text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>

      {/* Description */}
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleLike(product.id)}
          className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
            isLiked
              ? 'bg-success text-success-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-success/10 hover:text-success'
          }`}
        >
          <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
          {isLiked ? 'Liked' : 'Like'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleDislike(product.id)}
          className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
            isDisliked
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-destructive/10 hover:text-destructive'
          }`}
        >
          <ThumbsDown className="h-5 w-5" fill={isDisliked ? 'currentColor' : 'none'} />
          {isDisliked ? 'Disliked' : 'Dislike'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={openInBrowser}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90"
          aria-label="Open in browser"
        >
          <ExternalLink className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
