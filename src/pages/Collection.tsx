import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import product4 from '@/assets/product-4.jpg';
import product5 from '@/assets/product-5.jpg';
import product6 from '@/assets/product-6.jpg';
import collectionRings from '@/assets/collection-rings.jpg';
import collectionNecklaces from '@/assets/collection-necklaces.jpg';
import collectionEarrings from '@/assets/collection-earrings.jpg';
import collectionBracelets from '@/assets/collection-bracelets.jpg';

const collectionData: Record<string, {
  title: string;
  description: string;
  heroImage: string;
  products: Array<{ id: string; name: string; price: number; image: string }>;
}> = {
  rings: {
    title: 'Rings',
    description: 'From engagement rings that symbolize eternal love to statement pieces that command attention, our ring collection embodies the pinnacle of fine jewellery craftsmanship.',
    heroImage: collectionRings,
    products: [
      { id: '1', name: 'Celestine Solitaire', price: 185000, image: product1 },
      { id: '5', name: 'Diamond Eternity', price: 225000, image: product5 },
      { id: '7', name: 'Royal Halo Ring', price: 295000, image: collectionRings },
      { id: '8', name: 'Vintage Promise', price: 165000, image: product1 },
      { id: '9', name: 'Infinity Band', price: 145000, image: product5 },
      { id: '10', name: 'Classic Solitaire', price: 175000, image: collectionRings },
    ],
  },
  necklaces: {
    title: 'Necklaces',
    description: 'Elegant pendants and statement necklaces designed to frame your beauty. Each piece is crafted to become a treasured heirloom for generations.',
    heroImage: collectionNecklaces,
    products: [
      { id: '2', name: 'Aurora Pendant', price: 125000, image: product2 },
      { id: '11', name: 'Diamond Cascade', price: 245000, image: collectionNecklaces },
      { id: '12', name: 'Solitaire Drop', price: 185000, image: product2 },
      { id: '13', name: 'Pearl Elegance', price: 135000, image: collectionNecklaces },
      { id: '14', name: 'Chain of Light', price: 95000, image: product2 },
      { id: '15', name: 'Heart Whisper', price: 155000, image: collectionNecklaces },
    ],
  },
  earrings: {
    title: 'Earrings',
    description: 'From delicate studs to dramatic chandeliers, our earring collection offers the perfect finishing touch for every occasion and every mood.',
    heroImage: collectionEarrings,
    products: [
      { id: '3', name: 'Lumière Hoops', price: 78000, image: product3 },
      { id: '6', name: 'Pearl Drops', price: 95000, image: product6 },
      { id: '16', name: 'Chandelier Dreams', price: 185000, image: collectionEarrings },
      { id: '17', name: 'Diamond Studs', price: 125000, image: product3 },
      { id: '18', name: 'Golden Cascade', price: 145000, image: product6 },
      { id: '19', name: 'Classic Drops', price: 88000, image: collectionEarrings },
    ],
  },
  bracelets: {
    title: 'Bracelets',
    description: 'Graceful expressions of refined taste, our bracelets are designed to adorn your wrist with timeless elegance and sophisticated charm.',
    heroImage: collectionBracelets,
    products: [
      { id: '4', name: 'Eternity Band', price: 145000, image: product4 },
      { id: '20', name: 'Tennis Classic', price: 285000, image: collectionBracelets },
      { id: '21', name: 'Diamond Link', price: 195000, image: product4 },
      { id: '22', name: 'Chain Elegance', price: 125000, image: collectionBracelets },
      { id: '23', name: 'Pearl Strand', price: 165000, image: product4 },
      { id: '24', name: 'Gold Bangle', price: 115000, image: collectionBracelets },
    ],
  },
};

const Collection = () => {
  const { category } = useParams<{ category?: string }>();
  
  // If no category, show all collections overview
  if (!category) {
    return (
      <Layout>
        <section className="pt-32 pb-20 bg-secondary">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto text-center"
            >
              <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-4">
                Our Collections
              </p>
              <h1 className="font-serif text-4xl md:text-5xl mb-6">
                Discover <span className="italic">Timeless Elegance</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Explore our curated collections, each piece crafted with exceptional 
                artistry and the finest materials.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(collectionData).flatMap(([, data]) =>
                data.products.slice(0, 2).map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const collection = collectionData[category.toLowerCase()];

  if (!collection) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl mb-4">Collection Not Found</h1>
            <p className="text-muted-foreground">
              The collection you're looking for doesn't exist.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={collection.heroImage}
            alt={collection.title}
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
            {collection.title}
          </motion.h1>
        </div>
      </section>

      {/* Collection Description */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="editorial-body text-muted-foreground">
              {collection.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Filters Placeholder */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-border">
            <p className="text-sm text-muted-foreground">
              Showing {collection.products.length} products
            </p>
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 bg-secondary border border-border text-sm focus:outline-none focus:border-primary">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {collection.products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                category={collection.title}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Collection;
