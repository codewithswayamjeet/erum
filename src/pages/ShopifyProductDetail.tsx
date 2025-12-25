import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, ChevronLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { useShopifyProduct } from '@/hooks/useShopifyProducts';
import { useShopifyCartStore } from '@/stores/shopifyCartStore';
import { ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';

const ShopifyProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { product, isLoading, error } = useShopifyProduct(handle || '');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
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

  return (
    <Layout>
      <section className="pt-32 pb-20 min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <Link 
            to="/collections" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Collections
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={images[selectedImage]?.node.url || '/placeholder.svg'}
                  alt={images[selectedImage]?.node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
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
              <div>
                <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                  {product.title}
                </h1>
                <p className="text-2xl text-primary font-medium">
                  {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || '0').toFixed(2)}
                </p>
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
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
                    <label className="text-sm font-medium text-foreground">{option.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.edges.map((variant, index) => {
                        const optionValue = variant.node.selectedOptions.find(o => o.name === option.name)?.value;
                        if (!optionValue) return null;
                        
                        return (
                          <button
                            key={variant.node.id}
                            onClick={() => setSelectedVariantIndex(index)}
                            className={`px-4 py-2 border transition-colors ${
                              selectedVariantIndex === index
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border hover:border-primary'
                            }`}
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

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 border border-border hover:border-primary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 border border-border hover:border-primary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
                className="btn-luxury-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ShopifyProductDetail;
