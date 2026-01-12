import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import Layout from '@/components/Layout';
import ShopifyProductCard from '@/components/ShopifyProductCard';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import collectionRings from '@/assets/collection-rings.jpg';
import collectionNecklaces from '@/assets/collection-necklaces.jpg';
import collectionEarrings from '@/assets/collection-earrings.jpg';
import collectionBracelets from '@/assets/collection-bracelets.jpg';

const collectionInfo: Record<string, { title: string; description: string; heroImage: string; query?: string }> = {
  rings: {
    title: 'Rings',
    description: 'From engagement rings that symbolize eternal love to statement pieces that command attention, our ring collection embodies the pinnacle of fine jewellery craftsmanship.',
    heroImage: collectionRings,
    query: 'product_type:Rings'
  },
  necklaces: {
    title: 'Necklaces',
    description: 'Elegant pendants and statement necklaces designed to frame your beauty. Each piece is crafted to become a treasured heirloom for generations.',
    heroImage: collectionNecklaces,
    query: 'product_type:Necklaces'
  },
  earrings: {
    title: 'Earrings',
    description: 'From delicate studs to dramatic chandeliers, our earring collection offers the perfect finishing touch for every occasion and every mood.',
    heroImage: collectionEarrings,
    query: 'product_type:Earrings'
  },
  bracelets: {
    title: 'Bracelets',
    description: 'Graceful expressions of refined taste, our bracelets are designed to adorn your wrist with timeless elegance and sophisticated charm.',
    heroImage: collectionBracelets,
    query: 'product_type:Bracelets'
  },
};

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹50,000', min: 0, max: 50000 },
  { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
  { label: '₹1,00,000 - ₹2,00,000', min: 100000, max: 200000 },
  { label: 'Above ₹2,00,000', min: 200000, max: Infinity },
];

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
];

const Collection = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(urlCategory || category || null);

  // Fetch Shopify products (scoped when a category page is used)
  const collection = category ? collectionInfo[category.toLowerCase()] : null;
  const { products, isLoading, error } = useShopifyProducts(50, collection?.query);

  // Get all unique categories from products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      // Try to get product type from the product
      const type = p.node.handle?.split('-')[0]; // fallback
      cats.add(type);
    });
    return ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(p => {
        const title = p.node.title.toLowerCase();
        const handle = p.node.handle.toLowerCase();
        const cat = selectedCategory.toLowerCase();
        return title.includes(cat) || handle.includes(cat.slice(0, -1)); // Remove 's' for matching
      });
    }

    // Price filter
    const priceRange = priceRanges[selectedPriceRange];
    if (priceRange.max !== Infinity || priceRange.min > 0) {
      filtered = filtered.filter(p => {
        const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
        // Convert to INR approximation (assuming USD base)
        const priceInr = price * 83;
        return priceInr >= priceRange.min && priceInr < priceRange.max;
      });
    }

    // Sort
    switch (selectedSort) {
      case 'price-asc':
        filtered.sort((a, b) => 
          parseFloat(a.node.priceRange.minVariantPrice.amount) - 
          parseFloat(b.node.priceRange.minVariantPrice.amount)
        );
        break;
      case 'price-desc':
        filtered.sort((a, b) => 
          parseFloat(b.node.priceRange.minVariantPrice.amount) - 
          parseFloat(a.node.priceRange.minVariantPrice.amount)
        );
        break;
      case 'newest':
        // Keep original order (newest first from Shopify)
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [products, selectedCategory, selectedPriceRange, selectedSort]);
  const clearFilters = () => {
    setSelectedPriceRange(0);
    setSelectedSort('featured');
    setSelectedCategory(null);
  };

  const hasActiveFilters = selectedPriceRange > 0 || selectedSort !== 'featured' || selectedCategory;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={collection?.heroImage || collectionRings} 
            alt={collection?.title || 'Collections'} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-background/80 text-sm tracking-luxury uppercase mb-4"
          >
            Collection
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-background"
          >
            {collection?.title || 'All Collections'}
          </motion.h1>
        </div>
      </section>

      {/* Description */}
      {collection?.description && (
        <section className="py-16 bg-background border-b border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }} 
              className="max-w-2xl mx-auto text-center"
            >
              <p className="editorial-body text-muted-foreground">{collection.description}</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters and Products */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-border hover:border-primary transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm font-medium">Filters</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </span>
              
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="appearance-none bg-transparent border border-border px-4 py-2 pr-10 text-sm focus:outline-none focus:border-primary cursor-pointer"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <motion.aside
              initial={false}
              animate={{ 
                width: showFilters ? 280 : 0,
                opacity: showFilters ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className={`flex-shrink-0 overflow-hidden ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="w-[280px] space-y-8 pr-8 border-r border-border">
                {/* Category Filter */}
                <div>
                  <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">Category</h3>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                        className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                          (cat === 'All' && !selectedCategory) || selectedCategory === cat
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range, index) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange(index)}
                        className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                          selectedPriceRange === index
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-muted mb-4" />
                      <div className="h-4 bg-muted mb-2 w-3/4 mx-auto" />
                      <div className="h-4 bg-muted w-1/2 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-destructive mb-4">Failed to load products</p>
                  <p className="text-muted-foreground text-sm">Please try again later</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                  <button onClick={clearFilters} className="btn-luxury-primary">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ShopifyProductCard key={product.node.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Collection;