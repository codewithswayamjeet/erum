import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { ShopifyProduct } from '@/lib/shopify';
import { useShopifyCartStore } from '@/stores/shopifyCartStore';
import { toast } from 'sonner';

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const { node } = product;
  const addItem = useShopifyCartStore(state => state.addItem);
  
  const imageUrl = node.images.edges[0]?.node.url || '/placeholder.svg';
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const currencyCode = node.priceRange.minVariantPrice.currencyCode;
  const defaultVariant = node.variants.edges[0]?.node;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!defaultVariant) {
      toast.error('Product not available');
      return;
    }

    addItem({
      product,
      variantId: defaultVariant.id,
      variantTitle: defaultVariant.title,
      price: defaultVariant.price,
      quantity: 1,
      selectedOptions: defaultVariant.selectedOptions,
    });

    toast.success('Added to cart', {
      description: node.title,
      position: 'top-center',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/shopify-product/${node.handle}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
          <img
            src={imageUrl}
            alt={node.images.edges[0]?.node.altText || node.title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
          
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-background/95 backdrop-blur-sm text-foreground text-sm tracking-wider flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
          
          <button 
            className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => {
              e.preventDefault();
              toast.info('Wishlist coming soon');
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-center">
          <h3 className="font-serif text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
            {node.title}
          </h3>
          <p className="text-primary font-medium">
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ShopifyProductCard;
