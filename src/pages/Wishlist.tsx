import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/hooks/useProducts';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && wishlistIds.length > 0) {
      fetchWishlistProducts();
    } else {
      setProducts([]);
      setIsLoading(false);
    }
  }, [user, wishlistIds]);

  const fetchWishlistProducts = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .in('id', wishlistIds);
    
    if (data) {
      setProducts(data);
    }
    setIsLoading(false);
  };

  if (!user) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-[70vh] bg-background">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="font-serif text-3xl mb-4">Your Wishlist</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view your wishlist
            </p>
            <Link to="/auth?redirect=/wishlist" className="btn-luxury-primary">
              Sign In
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Your <span className="italic">Wishlist</span>
            </h1>
            <p className="text-muted-foreground">
              {products.length} {products.length === 1 ? 'item' : 'items'} saved
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-secondary mb-4" />
                  <div className="h-4 bg-secondary mb-2" />
                  <div className="h-4 bg-secondary w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
              <h2 className="font-serif text-2xl mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8">
                Start adding pieces you love by clicking the heart icon
              </p>
              <Link to="/collections" className="btn-luxury-primary">
                Explore Collections
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={Number(product.price)}
                  image={product.images[0] || '/placeholder.svg'}
                  category={product.category}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Wishlist;
