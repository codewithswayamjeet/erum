import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useShopifyCollections } from '@/hooks/useShopifyCollections';

const ShopifyCollections = () => {
  const { collections, isLoading, error } = useShopifyCollections(50);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Backwards compatibility with older links like /collections?category=Rings
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      navigate(`/collections/${category.toLowerCase()}`, { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <Layout>
      <section className="pt-32 pb-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-4">Shop by Collection</p>
            <h1 className="font-serif text-4xl md:text-5xl">Collections</h1>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-muted mb-4" />
                  <div className="h-4 bg-muted w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-2">Failed to load collections</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="font-serif text-2xl mb-3">No collections found</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your Shopify store has products (active), but no collections are visible to the storefront yet. Create collections in Shopify and make sure the collections are available to the Storefront/Online Store sales channel.
              </p>
              <div className="mt-8">
                <Link to="/collections/all" className="btn-luxury-outline">Browse All Products</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <Link to="/collections/all" className="btn-luxury-outline">Browse All Products</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collections.map(({ node }) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link to={`/collections/${node.handle}`} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-secondary mb-4">
                        <img
                          src={node.image?.url || '/placeholder.svg'}
                          alt={node.image?.altText || node.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-serif text-lg group-hover:text-primary transition-colors">{node.title}</h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ShopifyCollections;
