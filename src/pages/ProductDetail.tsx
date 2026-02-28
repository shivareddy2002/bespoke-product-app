import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Heart, ThumbsDown, ExternalLink, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatINR, toINR, getOriginalPrice } from '@/lib/currency';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import LoginModal from '@/components/LoginModal';
import { useEffect } from 'react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, likedIds, dislikedIds, toggleLike, toggleDislike, addHistory, addToCart, getDiscount } = useApp();
  const { showLogin, requireAuth, onLoginSuccess, onLoginClose } = useRequireAuth();

  const product = getProduct(Number(id));

  const isLiked = product ? likedIds.has(product.id) : false;
  const isDisliked = product ? dislikedIds.has(product.id) : false;
  const discount = product ? getDiscount(product.id) : 0;

  // Track product view in history
  useEffect(() => {
    if (product) {
      addHistory({
        url: `/product/${product.id}`,
        productId: product.id,
        title: product.title,
      });
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const openInBrowser = () => {
    addHistory({
      url: `https://fakestoreapi.com/products/${product.id}`,
      productId: product.id,
      title: product.title,
    });
    window.open(`https://fakestoreapi.com/products/${product.id}`, '_blank');
  };

  return (
    <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-2xl px-4 pb-32 pt-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-6 flex h-72 items-center justify-center rounded-2xl bg-card p-8 card-shadow relative">
        <img src={product.image} alt={product.title} className="h-full max-h-56 w-auto object-contain" />
        {discount > 0 && (
          <span className="absolute left-4 top-4 rounded-lg bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="mb-2 flex items-center gap-3">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          {product.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-warning text-warning" />
          {product.rating.rate} ({product.rating.count})
        </span>
      </div>

      <h1 className="mb-2 text-xl font-bold text-foreground">{product.title}</h1>

      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-primary">{formatINR(product.price)}</span>
        {discount > 0 && (
          <span className="text-sm text-muted-foreground line-through">
            ₹{toINR(getOriginalPrice(product.price, discount)).toFixed(0)}
          </span>
        )}
      </div>

      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

      <div className="flex items-center gap-3 flex-wrap mb-8">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => requireAuth(() => toggleLike(product.id))}
          className={`flex h-12 flex-1 min-w-[100px] items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
            isLiked ? 'bg-success text-success-foreground' : 'bg-secondary text-secondary-foreground hover:bg-success/10 hover:text-success'
          }`}
        >
          <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
          {isLiked ? 'Liked' : 'Like'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => requireAuth(() => toggleDislike(product.id))}
          className={`flex h-12 flex-1 min-w-[100px] items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
            isDisliked ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-secondary-foreground hover:bg-destructive/10 hover:text-destructive'
          }`}
        >
          <ThumbsDown className="h-5 w-5" fill={isDisliked ? 'currentColor' : 'none'} />
          {isDisliked ? 'Disliked' : 'Dislike'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={openInBrowser}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground hover:opacity-90"
          aria-label="Open in browser"
        >
          <ExternalLink className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Sticky Add-to-Cart bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">{formatINR(product.price)}</p>
            {discount > 0 && (
              <p className="text-xs text-success font-medium">{discount}% off</p>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => requireAuth(() => addToCart(product.id))}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
    <LoginModal open={showLogin} onClose={onLoginClose} onSuccess={onLoginSuccess} />
    </>
  );
}
