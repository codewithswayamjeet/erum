import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import ShopifyProductCard from './ShopifyProductCard';

interface ShopifyProductGridProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  query?: string;
}

const ShopifyProductGrid = ({ 
  title = "Shop from Shopify", 
  subtitle = "Premium products from our store",
  limit = 20,
  query
}: ShopifyProductGridProps) => {
  const { products, isLoading, error } = useShopifyProducts(limit, query);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load products</p>
      </div>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-4">{subtitle}</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">{title}</h2>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted mb-4" />
                <div className="h-4 bg-muted mb-2 mx-auto w-32" />
                <div className="h-4 bg-muted mx-auto w-24" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="font-serif text-2xl text-foreground mb-4">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Your Shopify store doesn't have any products yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Tell us what products you'd like to add and we'll create them for you!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ShopifyProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopifyProductGrid;
