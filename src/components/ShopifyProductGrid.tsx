import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import ShopifyProductCard from './ShopifyProductCard';
import { resolveImageUrl } from '@/lib/imageUtils';

interface ShopifyProductGridProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  query?: string;
}

const parseFallbackCategory = (query?: string): string | undefined => {
  if (!query) return undefined;
  const match = query.match(/product_type:([^\s]+)/i);
  if (!match?.[1]) return undefined;
  const raw = match[1].toLowerCase();
  if (raw.startsWith('ring')) return 'Rings';
  if (raw.startsWith('necklace')) return 'Necklaces';
  if (raw.startsWith('earring')) return 'Earrings & Studs';
  if (raw.startsWith('bracelet')) return 'Bracelets & Bangles';
  return undefined;
};

const ShopifyProductGrid = ({ 
  title = "Shop from Shopify", 
  subtitle = "Premium products from our store",
  limit = 20,
  query
}: ShopifyProductGridProps) => {
  const { products: shopifyProducts, isLoading: shopifyLoading, error } = useShopifyProducts(limit, query);

  // If Shopify is not accessible (401/403), silently fall back to local catalog products.
  const fallbackCategory = parseFallbackCategory(query);
  const { products: localProducts, isLoading: localLoading } = useProducts(
    fallbackCategory ? { category: fallbackCategory } : {}
  );

  const showLocalFallback = !!error;
  const isLoading = showLocalFallback ? localLoading : shopifyLoading;

  const localGridItems = localProducts.slice(0, limit);

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
        ) : showLocalFallback ? (
          localGridItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="font-serif text-2xl text-foreground mb-4">No products found</h3>
              <p className="text-muted-foreground">Please add products to your catalog.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {localGridItems.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={Number(p.price)}
                  image={resolveImageUrl(p.images?.[0])}
                  category={p.category}
                />
              ))}
            </div>
          )
        ) : shopifyProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="font-serif text-2xl text-foreground mb-4">No products found</h3>
            <p className="text-muted-foreground mb-4">No storefront products are visible yet.</p>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              If Shopify shows products as{' '}
              <span className="font-medium text-foreground">Active</span> but nothing appears here, make sure they’re
              published to the{' '}
              <span className="font-medium text-foreground">Storefront / Online Store</span> sales channel.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {shopifyProducts.map((product) => (
              <ShopifyProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopifyProductGrid;
