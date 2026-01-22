import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(id);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to your wishlist',
      });
      return;
    }
    
    await toggleWishlist(id);
    toast({
      title: inWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
      description: inWishlist ? `${name} removed from your wishlist` : `${name} added to your wishlist`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group relative"
    >
      <Link to={`/product/${id}`} className="block">
        <div className="image-zoom aspect-square bg-secondary mb-4 overflow-hidden relative">
          <img
            src={image || '/placeholder.svg'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== '/placeholder.svg' && !target.src.endsWith('/placeholder.svg')) {
                target.src = '/placeholder.svg';
              }
            }}
          />
          <button
            onClick={handleWishlistClick}
            className={`absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 ${
              inWishlist ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="text-center">
          {category && (
            <p className="text-xs text-muted-foreground tracking-luxury uppercase mb-1">
              {category}
            </p>
          )}
          <h3 className="font-serif text-lg font-medium mb-1 group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <p className="text-muted-foreground">
            ${price.toLocaleString('en-US')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
