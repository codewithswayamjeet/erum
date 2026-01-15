import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { Loader2 } from 'lucide-react';

interface UnifiedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  source: 'local' | 'shopify';
  handle?: string;
}

interface UnifiedProductGridProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showSource?: boolean;
}

const UnifiedProductGrid = ({ 
  title = "All Products", 
  subtitle = "From store & inventory",
  limit = 12,
  showSource = false
}: UnifiedProductGridProps) => {
  const { products: localProducts, isLoading: localLoading } = useProducts({});
  const { products: shopifyProducts, isLoading: shopifyLoading } = useShopifyProducts(limit);

  const isLoading = localLoading || shopifyLoading;

  // Combine products from both sources
  const unifiedProducts: UnifiedProduct[] = [
    // Shopify products
    ...shopifyProducts.map(p => ({
      id: p.node.id,
      name: p.node.title,
      price: parseFloat(p.node.priceRange.minVariantPrice.amount),
      image: p.node.images.edges[0]?.node.url || '/placeholder.svg',
      category: 'Shopify',
      source: 'shopify' as const,
      handle: p.node.handle,
    })),
    // Local products
    ...localProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      image: p.images?.[0] || '/placeholder.svg',
      category: p.category,
      source: 'local' as const,
    })),
  ].slice(0, limit);

  if (isLoading) {
    return (
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (unifiedProducts.length === 0) {
    return (
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-muted-foreground">No products available.</p>
        </div>
      </section>
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
          className="text-center mb-12"
        >
          <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-4">{subtitle}</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">{title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {unifiedProducts.map((product, index) => (
            <motion.div
              key={`${product.source}-${product.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link 
                to={product.source === 'shopify' ? `/shopify-product/${product.handle}` : `/product/${product.id}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden bg-secondary mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {showSource && (
                    <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded ${
                      product.source === 'shopify' 
                        ? 'bg-green-500/90 text-white' 
                        : 'bg-primary/90 text-primary-foreground'
                    }`}>
                      {product.source === 'shopify' ? 'Shopify' : 'Local'}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs tracking-luxury uppercase text-muted-foreground mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-serif text-lg mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium">
                    ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UnifiedProductGrid;
