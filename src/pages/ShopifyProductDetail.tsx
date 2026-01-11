import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, ChevronLeft, Heart, Share2, Truck, Shield, RefreshCw, Award, ZoomIn } from 'lucide-react';
import Layout from '@/components/Layout';
import { useShopifyProduct, useShopifyProducts } from '@/hooks/useShopifyProducts';
import { useShopifyCartStore } from '@/stores/shopifyCartStore';
import { ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ShopifyProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { product, isLoading, error } = useShopifyProduct(handle || '');
  const { products: relatedProducts } = useShopifyProducts(8);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const addItem = useShopifyCartStore(state => state.addItem);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
            <Link to="/collections" className="text-primary hover:underline">
              Browse Collections
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const images = product.images.edges;

  // Filter related products (exclude current product)
  const filteredRelated = relatedProducts
    .filter(p => p.node.handle !== handle)
    .slice(0, 6);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const shopifyProduct: ShopifyProduct = {
      node: product
    };

    addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success('Added to cart', {
      description: `${product.title} x ${quantity}`,
      position: 'top-center',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const trustBadges = [
    {
      icon: Shield,
      title: 'Certified Natural Diamonds',
      description: 'Each diamond is natural, rare, and responsibly sourced.'
    },
    {
      icon: RefreshCw,
      title: 'Lifetime Buyback',
      description: 'Own your diamond with confidence — backed by our buyback assurance.'
    },
    {
      icon: Truck,
      title: 'Free Insured Delivery',
      description: 'Your diamond delivered securely, with care and elegance.'
    },
    {
      icon: Award,
      title: 'BIS Hallmarked',
      description: 'Quality certified with official BIS hallmark stamp.'
    }
  ];

  return (
    <Layout>
      <section className="pt-32 pb-20 min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/collections" className="hover:text-primary transition-colors">All Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image with Zoom */}
              <div 
                className="relative aspect-square overflow-hidden bg-secondary/10 cursor-zoom-in group"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={images[selectedImage]?.node.url || '/placeholder.svg'}
                  alt={images[selectedImage]?.node.altText || product.title}
                  className={`w-full h-full object-contain transition-transform duration-500 ${isZoomed ? 'scale-150' : 'group-hover:scale-105'}`}
                />
                <button className="absolute top-4 right-4 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-5 w-5" />
                </button>
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Title & Share */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-serif text-3xl md:text-4xl text-foreground uppercase tracking-wide">
                  {product.title}
                </h1>
                <button 
                  onClick={handleShare}
                  className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0"
                  title="Share"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <p className="text-3xl text-foreground font-medium">
                  {selectedVariant?.price.currencyCode === 'INR' ? '₹' : '$'}
                  {parseFloat(selectedVariant?.price.amount || '0').toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-muted-foreground">MRP Incl. of all taxes</p>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground leading-relaxed text-base">
                  {product.description}
                </p>
              )}

              {/* Variant Selection */}
              {product.options.map((option) => {
                if (option.name === 'Title' && option.values.length === 1 && option.values[0] === 'Default Title') {
                  return null;
                }
                
                return (
                  <div key={option.name} className="space-y-3">
                    <label className="text-sm font-medium text-foreground uppercase tracking-wide">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.edges.map((variant, index) => {
                        const optionValue = variant.node.selectedOptions.find(o => o.name === option.name)?.value;
                        if (!optionValue) return null;
                        
                        return (
                          <button
                            key={variant.node.id}
                            onClick={() => setSelectedVariantIndex(index)}
                            className={`px-5 py-3 border transition-all text-sm ${
                              selectedVariantIndex === index
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border hover:border-primary bg-background'
                            } ${!variant.node.availableForSale ? 'opacity-50 line-through' : ''}`}
                            disabled={!variant.node.availableForSale}
                          >
                            {optionValue}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Specially Crafted Notice */}
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary pl-4">
                This product will be specially crafted for you!
              </p>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground uppercase tracking-wide">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 border border-border hover:border-primary transition-colors bg-background"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 border border-border hover:border-primary transition-colors bg-background"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale}
                  className="btn-luxury-primary flex-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed py-4"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {selectedVariant?.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
                </button>
                <button 
                  className="p-4 border border-border hover:border-primary hover:bg-muted transition-colors"
                  title="Add to Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              {/* Product Information Accordions */}
              <Accordion type="single" collapsible className="border-t border-border pt-6 mt-8">
                <AccordionItem value="product-info" className="border-border">
                  <AccordionTrigger className="text-sm font-medium uppercase tracking-wide hover:no-underline">
                    Product Information
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-medium text-foreground">Material:</span> 18K Gold</li>
                      <li><span className="font-medium text-foreground">Stone:</span> Natural Certified Diamonds</li>
                      <li><span className="font-medium text-foreground">Certification:</span> BIS Hallmarked</li>
                      <li><span className="font-medium text-foreground">Craftsmanship:</span> Handcrafted by Master Artisans</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="product-details" className="border-border">
                  <AccordionTrigger className="text-sm font-medium uppercase tracking-wide hover:no-underline">
                    Product Details
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    <p>
                      Each piece from ERUM Jewellery is crafted with precision and care. Our natural diamonds 
                      are responsibly sourced and certified for authenticity. The gold used is 18K or 22K, 
                      hallmarked by the Bureau of Indian Standards (BIS).
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping" className="border-border">
                  <AccordionTrigger className="text-sm font-medium uppercase tracking-wide hover:no-underline">
                    Shipping Policy
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    <ul className="space-y-2">
                      <li>• Free insured delivery across India</li>
                      <li>• Delivery within 7-10 business days</li>
                      <li>• Secure packaging with tamper-proof seal</li>
                      <li>• Real-time tracking available</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="manufacturer" className="border-border">
                  <AccordionTrigger className="text-sm font-medium uppercase tracking-wide hover:no-underline">
                    Manufacturer Details
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    <p className="mb-2">
                      <span className="font-medium text-foreground">ERUM Jewellery</span>
                    </p>
                    <p>F 3/4, Golden Plaza, Near Kirtistambh, Palanpur, Gujarat 385001 (India)</p>
                    <p className="mt-2">GSTIN: Available on invoice</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                {trustBadges.map((badge, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                      <badge.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-foreground uppercase">{badge.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* You May Also Like Section */}
          {filteredRelated.length > 0 && (
            <section className="mt-20 pt-16 border-t border-border">
              <h2 className="font-serif text-2xl md:text-3xl text-center mb-12">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {filteredRelated.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.node.id}
                    to={`/shopify-product/${relatedProduct.node.handle}`}
                    className="group"
                  >
                    <div className="aspect-square overflow-hidden bg-secondary/10 mb-3">
                      <img
                        src={relatedProduct.node.images.edges[0]?.node.url || '/placeholder.svg'}
                        alt={relatedProduct.node.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {relatedProduct.node.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {relatedProduct.node.priceRange.minVariantPrice.currencyCode === 'INR' ? '₹' : '$'}
                      {parseFloat(relatedProduct.node.priceRange.minVariantPrice.amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ShopifyProductDetail;
