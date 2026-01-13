import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown, SlidersHorizontal, Package } from 'lucide-react';
import Layout from '@/components/Layout';
import ShopifyProductCard from '@/components/ShopifyProductCard';
import { useShopifyCollection } from '@/hooks/useShopifyCollections';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under 50,000', min: 0, max: 50000 },
  { label: '50,000 - 1,00,000', min: 50000, max: 100000 },
  { label: '1,00,000 - 2,00,000', min: 100000, max: 200000 },
  { label: 'Above 2,00,000', min: 200000, max: Infinity },
];

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Best Selling', value: 'best-selling' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Title: A-Z', value: 'title-asc' },
  { label: 'Title: Z-A', value: 'title-desc' },
];

const ShopifyCollection = () => {
  const { handle = '' } = useParams<{ handle: string }>();
  const [searchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedSort, setSelectedSort] = useState<'featured' | 'best-selling' | 'newest' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc'>('featured');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  const typeKeyword = searchParams.get('type');

  // Special handle: /collections/all
  const isAllProducts = handle.toLowerCase() === 'all';
  const { products: allProducts, isLoading: allLoading, error: allError } = useShopifyProducts(100);

  const { collection, isLoading: collectionLoading, error: collectionError } = useShopifyCollection(handle, 100, selectedSort);

  const isLoading = isAllProducts ? allLoading : collectionLoading;
  const error = isAllProducts ? allError : collectionError;

  const title = isAllProducts ? 'All Products' : (collection?.title || 'Collection');
  const description = isAllProducts ? '' : (collection?.description || '');
  const heroImage = isAllProducts ? undefined : collection?.image?.url;

  const baseProducts = isAllProducts ? allProducts : (collection?.products.edges || []);

  const filteredProducts = useMemo(() => {
    let filtered = [...baseProducts];

    // Optional keyword filter from legacy links (e.g., ?type=engagement)
    if (typeKeyword) {
      const kw = typeKeyword.toLowerCase();
      filtered = filtered.filter(p =>
        p.node.title.toLowerCase().includes(kw) ||
        p.node.handle.toLowerCase().includes(kw) ||
        (p.node.tags || []).some(t => t.toLowerCase().includes(kw))
      );
    }

    // Availability filter
    if (availabilityOnly) {
      filtered = filtered.filter(p => p.node.availableForSale || p.node.variants.edges.some(v => v.node.availableForSale));
    }

    // Price filter (INR fallback conversion if currency isn't INR)
    const range = priceRanges[selectedPriceRange];
    if (range.min > 0 || range.max !== Infinity) {
      filtered = filtered.filter(p => {
        const amount = parseFloat(p.node.priceRange.minVariantPrice.amount || '0');
        const currency = p.node.priceRange.minVariantPrice.currencyCode;
        const approxInr = currency === 'INR' ? amount : amount * 83;
        return approxInr >= range.min && approxInr < range.max;
      });
    }

    return filtered;
  }, [availabilityOnly, baseProducts, selectedPriceRange, typeKeyword]);

  const clearFilters = () => {
    setSelectedPriceRange(0);
    setSelectedSort('featured');
    setAvailabilityOnly(false);
  };

  const hasActiveFilters = selectedPriceRange > 0 || selectedSort !== 'featured' || availabilityOnly || !!typeKeyword;

  if (!isAllProducts && !isLoading && !error && !collection) {
    return (
      <Layout>
        <section className="pt-32 pb-20 bg-background">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h1 className="font-serif text-3xl mb-3">Collection not found</h1>
            <p className="text-muted-foreground mb-8">
              This collection handle doesn’t exist in Shopify (or it isn’t available to the Storefront sales channel).
            </p>
            <Link to="/collections" className="btn-luxury-outline">Back to Collections</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-14 bg-background overflow-hidden">
        {heroImage && (
          <div className="absolute inset-0">
            <img src={heroImage} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/50" />
          </div>
        )}
        <div className="container mx-auto px-6 lg:px-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className={`text-sm tracking-luxury uppercase mb-4 ${heroImage ? 'text-background/80' : 'text-muted-foreground'}`}>Collection</p>
            <h1 className={`font-serif text-4xl md:text-5xl ${heroImage ? 'text-background' : ''}`}>{title}</h1>
            {description && (
              <p className={`mt-4 max-w-2xl mx-auto ${heroImage ? 'text-background/80' : 'text-muted-foreground'}`}>{description}</p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-10 bg-background">
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
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
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
                  onChange={(e) => setSelectedSort(e.target.value as any)}
                  className="appearance-none bg-transparent border border-border px-4 py-2 pr-10 text-sm focus:outline-none focus:border-primary cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
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
              animate={{ width: showFilters ? 280 : 0, opacity: showFilters ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className={`flex-shrink-0 overflow-hidden ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="w-[280px] space-y-8 pr-8 border-r border-border">
                {/* Availability */}
                <div>
                  <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">Availability</h3>
                  <button
                    onClick={() => setAvailabilityOnly((v) => !v)}
                    className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                      availabilityOnly ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                    }`}
                  >
                    In stock only
                  </button>
                </div>

                {/* Price */}
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

            {/* Products */}
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
                  <p className="text-muted-foreground text-sm max-w-2xl mx-auto">{error}</p>
                  <p className="text-muted-foreground text-sm max-w-2xl mx-auto mt-3">
                    If Shopify shows products as Active but nothing appears here, make sure the products are published to the Storefront/Online Store sales channel.
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    {baseProducts.length === 0
                      ? 'No products are currently published to your storefront.'
                      : 'Try adjusting your filters.'}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={clearFilters} className="btn-luxury-primary">Clear Filters</button>
                    <Link to="/collections" className="btn-luxury-outline">All Collections</Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ShopifyProductCard key={product.node.id} product={product} />
                  ))}
                </div>
              )}

              {!isLoading && !error && baseProducts.length === 0 && (
                <div className="mt-10 border border-border bg-secondary/30 p-6 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">Why this can happen</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Products are Active in Shopify but not published to the Storefront/Online Store sales channel.</li>
                    <li>The collection exists but has no products assigned.</li>
                    <li>The Storefront token doesn’t have access to the correct sales channel.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ShopifyCollection;
