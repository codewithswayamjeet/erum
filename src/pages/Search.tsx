import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'];
const materials = ['All', '18K Yellow Gold', '18K White Gold', '18K Rose Gold', 'Platinum'];
const priceRanges = [
  { label: 'All Prices', min: undefined, max: undefined },
  { label: 'Under $1,000', min: undefined, max: 1000 },
  { label: '$1,000 - $2,500', min: 1000, max: 2500 },
  { label: '$2,500 - $5,000', min: 2500, max: 5000 },
  { label: 'Above $5,000', min: 5000, max: undefined },
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedMaterial, setSelectedMaterial] = useState(searchParams.get('material') || 'All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { products, isLoading } = useProducts({
    search: searchQuery || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    material: selectedMaterial !== 'All' ? selectedMaterial : undefined,
    minPrice: priceRanges[selectedPriceRange].min,
    maxPrice: priceRanges[selectedPriceRange].max,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedMaterial !== 'All') params.set('material', selectedMaterial);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, selectedMaterial, setSearchParams]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedMaterial('All');
    setSelectedPriceRange(0);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedMaterial !== 'All' || selectedPriceRange !== 0 || searchQuery;

  return (
    <Layout>
      <section className="pt-32 pb-8 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="font-serif text-3xl md:text-4xl text-center mb-8">
              Search <span className="italic">Collections</span>
            </h1>
            
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for jewellery..."
                className="w-full pl-12 pr-4 py-4 bg-background border border-border focus:border-primary focus:outline-none transition-colors text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Filters Toggle */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              {isLoading ? 'Searching...' : `${products.length} products found`}
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-secondary border border-border p-6 mb-8"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 text-sm border transition-colors ${
                          selectedCategory === cat
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-background border-border hover:border-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Material</label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border focus:border-primary focus:outline-none"
                  >
                    {materials.map((mat) => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Price Range</label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-background border border-border focus:border-primary focus:outline-none"
                  >
                    {priceRanges.map((range, index) => (
                      <option key={index} value={index}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-6 pt-6 border-t border-border">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-secondary mb-4" />
                  <div className="h-4 bg-secondary mb-2" />
                  <div className="h-4 bg-secondary w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <SearchIcon className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
              <h2 className="font-serif text-2xl mb-4">No products found</h2>
              <p className="text-muted-foreground mb-8">
                Try adjusting your search or filters to find what you're looking for
              </p>
              <button onClick={clearFilters} className="btn-luxury-primary">
                Clear Filters
              </button>
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

export default Search;
