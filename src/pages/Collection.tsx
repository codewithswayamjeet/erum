import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import collectionRings from '@/assets/collection-rings.jpg';
import collectionNecklaces from '@/assets/collection-necklaces.jpg';
import collectionEarrings from '@/assets/collection-earrings.jpg';
import collectionBracelets from '@/assets/collection-bracelets.jpg';

const collectionInfo: Record<string, { title: string; description: string; heroImage: string }> = {
  rings: {
    title: 'Rings',
    description: 'From engagement rings that symbolize eternal love to statement pieces that command attention, our ring collection embodies the pinnacle of fine jewellery craftsmanship.',
    heroImage: collectionRings,
  },
  necklaces: {
    title: 'Necklaces',
    description: 'Elegant pendants and statement necklaces designed to frame your beauty. Each piece is crafted to become a treasured heirloom for generations.',
    heroImage: collectionNecklaces,
  },
  earrings: {
    title: 'Earrings',
    description: 'From delicate studs to dramatic chandeliers, our earring collection offers the perfect finishing touch for every occasion and every mood.',
    heroImage: collectionEarrings,
  },
  bracelets: {
    title: 'Bracelets',
    description: 'Graceful expressions of refined taste, our bracelets are designed to adorn your wrist with timeless elegance and sophisticated charm.',
    heroImage: collectionBracelets,
  },
};

const Collection = () => {
  const { category } = useParams<{ category?: string }>();
  const { products, isLoading } = useProducts({ category: category || undefined });
  
  if (!category) {
    return (
      <Layout>
        <section className="pt-32 pb-20 bg-secondary">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl mx-auto text-center">
              <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-4">Our Collections</p>
              <h1 className="font-serif text-4xl md:text-5xl mb-6">Discover <span className="italic">Timeless Elegance</span></h1>
              <p className="text-muted-foreground leading-relaxed">Explore our curated collections, each piece crafted with exceptional artistry and the finest materials.</p>
            </motion.div>
          </div>
        </section>
        <section className="section-padding bg-background">
          <div className="container mx-auto px-6 lg:px-12">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-secondary mb-4" />
                    <div className="h-4 bg-secondary mb-2" />
                    <div className="h-4 bg-secondary w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} id={product.id} name={product.name} price={Number(product.price)} image={product.images[0] || '/placeholder.svg'} category={product.category} />
                ))}
              </div>
            )}
          </div>
        </section>
      </Layout>
    );
  }

  const collection = collectionInfo[category.toLowerCase()];

  if (!collection) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl mb-4">Collection Not Found</h1>
            <p className="text-muted-foreground">The collection you're looking for doesn't exist.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={collection.heroImage} alt={collection.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-background/80 text-sm tracking-luxury uppercase mb-4">Collection</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-4xl md:text-5xl lg:text-6xl text-background">{collection.title}</motion.h1>
        </div>
      </section>

      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto text-center">
            <p className="editorial-body text-muted-foreground">{collection.description}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-border">
            <p className="text-sm text-muted-foreground">Showing {products.length} products</p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-secondary mb-4" />
                  <div className="h-4 bg-secondary mb-2" />
                  <div className="h-4 bg-secondary w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products in this collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {products.map((product) => (
                <ProductCard key={product.id} id={product.id} name={product.name} price={Number(product.price)} image={product.images[0] || '/placeholder.svg'} category={collection.title} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Collection;
