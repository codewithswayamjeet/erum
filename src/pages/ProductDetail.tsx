import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Shield, Truck, Award } from 'lucide-react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import ProductReviews from '@/components/ProductReviews';
import StarRating from '@/components/StarRating';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { getProductReviews, getProductRating } from '@/data/reviews';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import product4 from '@/assets/product-4.jpg';
import product5 from '@/assets/product-5.jpg';
import product6 from '@/assets/product-6.jpg';

const allProducts: Record<string, {
  name: string;
  tagline: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  details: { label: string; value: string }[];
  category: string;
}> = {
  '1': {
    name: 'Celestine Solitaire',
    tagline: 'A timeless symbol of eternal love',
    price: 185000,
    image: product1,
    images: [product1, product5, product1],
    category: 'Rings',
    description: 'The Celestine Solitaire embodies the essence of timeless romance. Set in 18K white gold, this magnificent ring features a brilliant-cut diamond that captures light from every angle, creating an mesmerizing display of fire and brilliance. Perfect for marking life\'s most precious moments.',
    details: [
      { label: 'Metal', value: '18K White Gold' },
      { label: 'Stone', value: '1.5 Carat Diamond' },
      { label: 'Clarity', value: 'VVS1' },
      { label: 'Cut', value: 'Excellent' },
      { label: 'Setting', value: '6-Prong Solitaire' },
    ],
  },
  '2': {
    name: 'Aurora Pendant',
    tagline: 'Grace that illuminates from within',
    price: 125000,
    image: product2,
    images: [product2, product2, product2],
    category: 'Necklaces',
    description: 'Inspired by the ethereal beauty of the northern lights, the Aurora Pendant features a stunning solitaire diamond suspended on a delicate gold chain. The minimalist design allows the diamond to take center stage, reflecting light with every movement.',
    details: [
      { label: 'Metal', value: '18K Yellow Gold' },
      { label: 'Stone', value: '0.8 Carat Diamond' },
      { label: 'Chain Length', value: '18 inches' },
      { label: 'Clarity', value: 'VS1' },
      { label: 'Style', value: 'Solitaire Pendant' },
    ],
  },
  '3': {
    name: 'Lumière Hoops',
    tagline: 'Radiance in every curve',
    price: 78000,
    image: product3,
    images: [product3, product3, product3],
    category: 'Earrings',
    description: 'The Lumière Hoops redefine classic elegance with their perfectly proportioned silhouette. Crafted in 18K gold, these versatile hoops transition seamlessly from day to evening, adding a touch of sophistication to any ensemble.',
    details: [
      { label: 'Metal', value: '18K Yellow Gold' },
      { label: 'Diameter', value: '25mm' },
      { label: 'Width', value: '3mm' },
      { label: 'Closure', value: 'Click-top' },
      { label: 'Style', value: 'Classic Hoops' },
    ],
  },
  '4': {
    name: 'Eternity Band',
    tagline: 'An endless circle of brilliance',
    price: 145000,
    image: product4,
    images: [product4, product4, product4],
    category: 'Bracelets',
    description: 'The Eternity Band bracelet celebrates the infinite nature of love and commitment. Featuring a continuous row of hand-set diamonds in 18K rose gold, this piece wraps your wrist in an unbroken circle of sparkling beauty.',
    details: [
      { label: 'Metal', value: '18K Rose Gold' },
      { label: 'Stones', value: '3.5 Carats Total' },
      { label: 'Stone Count', value: '45 Diamonds' },
      { label: 'Length', value: '7 inches' },
      { label: 'Closure', value: 'Hidden Clasp' },
    ],
  },
  '5': {
    name: 'Diamond Eternity',
    tagline: 'Forever captured in gold',
    price: 225000,
    image: product5,
    images: [product5, product1, product5],
    category: 'Rings',
    description: 'The Diamond Eternity ring represents an unending promise of love. Diamonds of exceptional quality encircle the entire band, ensuring brilliance from every angle. A statement of eternal devotion crafted in precious 18K gold.',
    details: [
      { label: 'Metal', value: '18K Yellow Gold' },
      { label: 'Stones', value: '2.8 Carats Total' },
      { label: 'Stone Count', value: '28 Diamonds' },
      { label: 'Clarity', value: 'VS2' },
      { label: 'Style', value: 'Full Eternity' },
    ],
  },
  '6': {
    name: 'Pearl Drops',
    tagline: 'Oceanic elegance perfected',
    price: 95000,
    image: product6,
    images: [product6, product6, product6],
    category: 'Earrings',
    description: 'The Pearl Drops earrings marry the timeless allure of South Sea pearls with the brilliance of diamonds. Each pearl is hand-selected for its exceptional lustre and perfectly matched to its pair, creating a harmonious expression of refined taste.',
    details: [
      { label: 'Metal', value: '18K White Gold' },
      { label: 'Pearls', value: 'South Sea, 10mm' },
      { label: 'Diamonds', value: '0.6 Carats Total' },
      { label: 'Length', value: '45mm' },
      { label: 'Style', value: 'Drop Earrings' },
    ],
  },
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = id ? allProducts[id] : null;
  const reviews = id ? getProductReviews(id) : [];
  const { average: averageRating, total: totalReviews } = id ? getProductRating(id) : { average: 0, total: 0 };

  if (!product) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl mb-4">Product Not Found</h1>
            <p className="text-muted-foreground">
              The product you are looking for does not exist.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: id!,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const relatedProducts = Object.entries(allProducts)
    .filter(([productId]) => productId !== id)
    .slice(0, 4)
    .map(([productId, prod]) => ({
      id: productId,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      category: prod.category,
    }));

  return (
    <Layout>
      <section className="pt-28 pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-square bg-secondary mb-4 overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-secondary overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:py-8"
            >
              <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-2">
                {product.category}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground italic mb-4">
                {product.tagline}
              </p>
              
              {/* Rating Summary */}
              {totalReviews > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <StarRating rating={averageRating} size={16} />
                  <span className="text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}
              
              <p className="text-2xl font-medium mb-8">
                ₹{product.price.toLocaleString('en-IN')}
              </p>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Product Details */}
              <div className="border-t border-b border-border py-6 mb-8">
                <h3 className="font-medium mb-4">Product Details</h3>
                <dl className="grid grid-cols-2 gap-4">
                  {product.details.map((detail) => (
                    <div key={detail.label}>
                      <dt className="text-sm text-muted-foreground">
                        {detail.label}
                      </dt>
                      <dd className="font-medium">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="btn-luxury-primary flex-1"
                >
                  Add to Cart
                </button>
                <button
                  className="p-4 border border-border hover:border-primary hover:text-primary transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Shield, label: 'Certified' },
                  { icon: Truck, label: 'Free Shipping' },
                  { icon: Award, label: '30-Day Returns' },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex flex-col items-center gap-2 py-4 bg-secondary text-center"
                  >
                    <badge.icon className="w-5 h-5 text-primary" />
                    <span className="text-xs font-medium">{badge.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-20 bg-background border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ProductReviews
                reviews={reviews}
                averageRating={averageRating}
                totalReviews={totalReviews}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* You May Also Like */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl md:text-3xl">
              You May Also <span className="italic">Love</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} {...prod} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
