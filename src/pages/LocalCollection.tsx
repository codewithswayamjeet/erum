import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Package, SlidersHorizontal, X } from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { usePageCategories } from "@/hooks/usePageCategories";
import { resolveImageUrl } from "@/lib/imageUtils";

import collectionRings from "@/assets/collection-rings.jpg";
import collectionNecklaces from "@/assets/collection-necklaces.jpg";
import collectionEarrings from "@/assets/collection-earrings.jpg";
import collectionBracelets from "@/assets/collection-bracelets.jpg";

type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "title-asc" | "title-desc";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $500", min: 0, max: 500 },
  { label: "$500 - $1,000", min: 500, max: 1_000 },
  { label: "$1,000 - $2,500", min: 1_000, max: 2_500 },
  { label: "Above $2,500", min: 2_500, max: Infinity },
] as const;

const sortOptions: Array<{ label: string; value: SortOption }> = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Title: A-Z", value: "title-asc" },
  { label: "Title: Z-A", value: "title-desc" },
];

const collectionInfo: Record<
  string,
  { title: string; description?: string; heroImage: string; category?: string }
> = {
  all: {
    title: "All Products",
    description: "Explore our full catalog — crafted for timeless elegance.",
    heroImage: collectionRings,
  },
  rings: {
    title: "Rings",
    description:
      "From engagement rings that symbolize eternal love to statement pieces that command attention — our ring collection embodies the pinnacle of fine jewellery craftsmanship.",
    heroImage: collectionRings,
    category: "Rings",
  },
  necklaces: {
    title: "Necklaces",
    description:
      "Elegant pendants and statement necklaces designed to frame your beauty. Each piece is crafted to become a treasured heirloom.",
    heroImage: collectionNecklaces,
    category: "Necklaces",
  },
  earrings: {
    title: "Earrings",
    description:
      "From delicate studs to dramatic chandeliers — the perfect finishing touch for every occasion.",
    heroImage: collectionEarrings,
    category: "Earrings & Studs",
  },
  bracelets: {
    title: "Bracelets",
    description:
      "Graceful expressions of refined taste — bracelets designed to adorn your wrist with timeless elegance.",
    heroImage: collectionBracelets,
    category: "Bracelets & Bangles",
  },
};

export default function LocalCollection() {
  const { handle = "all" } = useParams<{ handle: string }>();
  const [searchParams] = useSearchParams();

  const key = (handle || "all").toLowerCase();
  const config = collectionInfo[key] ?? collectionInfo.all;

  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedSort, setSelectedSort] = useState<SortOption>("featured");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  const typeKeyword = searchParams.get("type")?.trim() || "";

  // Fetch dynamic sub-categories for this collection
  const { categories: subCategories } = usePageCategories(config.category);

  const { products, isLoading, error } = useProducts(
    config.category || typeKeyword
      ? { category: config.category, subCategory: typeKeyword || undefined }
      : {}
  );

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (typeKeyword) {
      const kw = typeKeyword.toLowerCase();
      list = list.filter((p) => {
        const hay = `${p.name} ${p.slug} ${p.short_description ?? ""} ${p.description ?? ""} ${p.sub_category ?? ""}`.toLowerCase();
        return hay.includes(kw);
      });
    }

    if (availabilityOnly) {
      list = list.filter((p) => (p.stock ?? 0) > 0);
    }

    const range = priceRanges[selectedPriceRange];
    if (range.min > 0 || range.max !== Infinity) {
      list = list.filter((p) => p.price >= range.min && p.price < range.max);
    }

    const byCreatedDesc = (a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

    switch (selectedSort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "title-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        list.sort(byCreatedDesc);
        break;
      case "featured":
      default:
        list.sort((a, b) => {
          const af = a.is_featured ? 1 : 0;
          const bf = b.is_featured ? 1 : 0;
          if (bf !== af) return bf - af;
          return byCreatedDesc(a, b);
        });
        break;
    }

    return list;
  }, [availabilityOnly, products, selectedPriceRange, selectedSort, typeKeyword]);

  const clearFilters = () => {
    setSelectedPriceRange(0);
    setSelectedSort("featured");
    setAvailabilityOnly(false);
  };

  const hasActiveFilters =
    selectedPriceRange > 0 || selectedSort !== "featured" || availabilityOnly || !!typeKeyword;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-14 bg-background overflow-hidden">
        <div className="absolute inset-0">
          <img src={config.heroImage} alt={config.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-sm tracking-luxury uppercase mb-4 text-background/80">Collection</p>
            <h1 className="font-serif text-4xl md:text-5xl text-background">{config.title}</h1>
            {config.description && (
              <p className="mt-4 max-w-2xl mx-auto text-background/80">{config.description}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Dynamic Sub-Categories from Page Controls */}
      {subCategories.length > 0 && !typeKeyword && (
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-serif text-2xl md:text-3xl">Shop by Category</h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {subCategories.map((subCat, index) => (
                <motion.div
                  key={subCat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    to={`/collections/${handle}?type=${encodeURIComponent(subCat.sub_category.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="group block bg-background border border-border hover:border-primary transition-all duration-300 overflow-hidden"
                  >
                    {subCat.thumbnail_url ? (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={subCat.thumbnail_url} 
                          alt={subCat.sub_category}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                        <span className="text-4xl text-muted-foreground/30">💎</span>
                      </div>
                    )}
                    <div className="p-4 text-center">
                      <h3 className="font-serif text-lg group-hover:text-primary transition-colors">
                        {subCat.sub_category}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </span>

              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as SortOption)}
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
              className={`flex-shrink-0 overflow-hidden ${showFilters ? "block" : "hidden lg:block"}`}
            >
              <div className="w-[280px] space-y-8 pr-8 border-r border-border">
                <div>
                  <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">Availability</h3>
                  <button
                    onClick={() => setAvailabilityOnly((v) => !v)}
                    className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                      availabilityOnly
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    In stock only
                  </button>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range, index) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange(index)}
                        className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                          selectedPriceRange === index
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted"
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
                      <div className="aspect-square bg-muted mb-4" />
                      <div className="h-4 bg-muted mb-2 w-3/4 mx-auto" />
                      <div className="h-4 bg-muted w-1/2 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-destructive mb-2">Failed to load products</p>
                  <p className="text-muted-foreground text-sm">Please try again.</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters.</p>
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={clearFilters} className="btn-luxury-primary">
                      Clear Filters
                    </button>
                    <Link to="/collections" className="btn-luxury-outline">
                      All Collections
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      price={Number(p.price)}
                      image={resolveImageUrl(p.images?.[0])}
                      category={p.category}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
