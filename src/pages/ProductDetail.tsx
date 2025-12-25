import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Shield, Truck, Award } from 'lucide-react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import ProductReviews from '@/components/ProductReviews';
import StarRating from '@/components/StarRating';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { getProductReviews, getProductRating } from '@/data/reviews';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { product, isLoading } = useProduct(id || '');
  const { products: relatedProducts } = useProducts({ category: product?.category });
  
  const reviews = id ? getProductReviews(id) : [];
  const { average: averageRating, total: totalReviews } = id ? getProductRating(id) : { average: 0, total: 0 };

  const inWishlist = id ? isInWishlist(id) : false;

  const handleWishlistClick = async () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to add items to your wishlist' });
      return;
    }
    if (id) {
      await toggleWishlist(id);
      toast({
        title: inWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
        description: inWishlist ? `${product?.name} removed from your wishlist` : `${product?.name} added to your wishlist`,
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="pt-28 pb-20 bg-background">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="animate-pulse">
                <div className="aspect-square bg-secondary mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => <div key={i} className="aspect-square bg-secondary" />)}
                </div>
              </div>
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-secondary w-24" />
                <div className="h-10 bg-secondary w-3/4" />
                <div className="h-8 bg-secondary w-32" />
                <div className="h-24 bg-secondary" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl mb-4">Product Not Found</h1>
            <p className="text-muted-foreground">The product you are looking for does not exist.</p>
          </div>
        </section>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images[0] || '/placeholder.svg',
      });
    }
    toast({ title: 'Added to Cart', description: `${product.name} has been added to your cart.` });
  };

  const images = product.images.length > 0 ? product.images : ['/placeholder.svg'];
  const filteredRelated = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

  const productDetails = [
    { label: 'Metal', value: product.material },
    { label: 'Stone', value: product.stone },
    { label: 'Weight', value: product.weight },
  ].filter(d => d.value);

  return (
    <Layout>
      <section className="pt-28 pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="aspect-square bg-secondary mb-4 overflow-hidden">
                <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-secondary overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-transparent hover:border-border'}`}
                    >
                      <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="lg:py-8">
              <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-2">{product.category}</p>
              <h1 className="font-serif text-3xl md:text-4xl mb-2">{product.name}</h1>
              {product.short_description && <p className="text-muted-foreground italic mb-4">{product.short_description}</p>}
              
              {totalReviews > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <StarRating rating={averageRating} size={16} />
                  <span className="text-sm text-muted-foreground">{averageRating.toFixed(1)} ({totalReviews} reviews)</span>
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-8">
                <p className="text-2xl font-medium">₹{Number(product.price).toLocaleString('en-IN')}</p>
                {product.original_price && (
                  <p className="text-lg text-muted-foreground line-through">₹{Number(product.original_price).toLocaleString('en-IN')}</p>
                )}
              </div>

              {product.description && <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>}

              {productDetails.length > 0 && (
                <div className="border-t border-b border-border py-6 mb-8">
                  <h3 className="font-medium mb-4">Product Details</h3>
                  <dl className="grid grid-cols-2 gap-4">
                    {productDetails.map((detail) => (
                      <div key={detail.label}>
                        <dt className="text-sm text-muted-foreground">{detail.label}</dt>
                        <dd className="font-medium">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-border">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-secondary transition-colors" aria-label="Decrease quantity"><Minus className="w-4 h-4" /></button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-secondary transition-colors" aria-label="Increase quantity"><Plus className="w-4 h-4" /></button>
                </div>
                <button onClick={handleAddToCart} className="btn-luxury-primary flex-1">Add to Cart</button>
                <button onClick={handleWishlistClick} className={`p-4 border transition-colors ${inWishlist ? 'border-primary text-primary' : 'border-border hover:border-primary hover:text-primary'}`} aria-label="Add to wishlist">
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[{ icon: Shield, label: 'Certified' }, { icon: Truck, label: 'Free Shipping' }, { icon: Award, label: '30-Day Returns' }].map((badge) => (
                  <div key={badge.label} className="flex flex-col items-center gap-2 py-4 bg-secondary text-center">
                    <badge.icon className="w-5 h-5 text-primary" />
                    <span className="text-xs font-medium">{badge.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="py-20 bg-background border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <ProductReviews reviews={reviews} averageRating={averageRating} totalReviews={totalReviews} />
          </div>
        </section>
      )}

      {filteredRelated.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
              <h2 className="font-serif text-2xl md:text-3xl">You May Also <span className="italic">Love</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredRelated.map((prod) => (
                <ProductCard key={prod.id} id={prod.id} name={prod.name} price={Number(prod.price)} image={prod.images[0] || '/placeholder.svg'} category={prod.category} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
