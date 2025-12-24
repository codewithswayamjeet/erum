import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Diamond, Shield, Truck, Award } from 'lucide-react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import CollectionCard from '@/components/CollectionCard';
import heroImage from '@/assets/hero-jewellery.jpg';
import collectionRings from '@/assets/collection-rings.jpg';
import collectionNecklaces from '@/assets/collection-necklaces.jpg';
import collectionEarrings from '@/assets/collection-earrings.jpg';
import collectionBracelets from '@/assets/collection-bracelets.jpg';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import product4 from '@/assets/product-4.jpg';
import product5 from '@/assets/product-5.jpg';
import product6 from '@/assets/product-6.jpg';

const Index = () => {
  const collections = [
    {
      title: 'Rings',
      description: 'Symbols of eternal love and commitment',
      image: collectionRings,
      href: '/collections/rings',
    },
    {
      title: 'Necklaces',
      description: 'Elegant adornments for every occasion',
      image: collectionNecklaces,
      href: '/collections/necklaces',
    },
    {
      title: 'Earrings',
      description: 'Delicate details that frame your beauty',
      image: collectionEarrings,
      href: '/collections/earrings',
    },
    {
      title: 'Bracelets',
      description: 'Graceful expressions of refined taste',
      image: collectionBracelets,
      href: '/collections/bracelets',
    },
  ];

  const featuredProducts = [
    { id: '1', name: 'Celestine Solitaire', price: 185000, image: product1, category: 'Rings' },
    { id: '2', name: 'Aurora Pendant', price: 125000, image: product2, category: 'Necklaces' },
    { id: '3', name: 'Lumière Hoops', price: 78000, image: product3, category: 'Earrings' },
    { id: '4', name: 'Eternity Band', price: 145000, image: product4, category: 'Bracelets' },
    { id: '5', name: 'Diamond Eternity', price: 225000, image: product5, category: 'Rings' },
    { id: '6', name: 'Pearl Drops', price: 95000, image: product6, category: 'Earrings' },
  ];

  const trustFeatures = [
    {
      icon: Diamond,
      title: 'Certified Diamonds',
      description: 'Every diamond certified by GIA & IGI laboratories',
    },
    {
      icon: Shield,
      title: 'Ethical Sourcing',
      description: 'Responsibly sourced gemstones and precious metals',
    },
    {
      icon: Award,
      title: 'Master Craftsmanship',
      description: 'Handcrafted by artisans with decades of expertise',
    },
    {
      icon: Truck,
      title: 'Secure Delivery',
      description: 'Fully insured shipping with discreet packaging',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury diamond ring on elegant hand"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 via-foreground/20 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-background/80 text-sm tracking-luxury uppercase mb-4"
            >
              The Art of Fine Jewellery
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-background font-normal leading-tight mb-6"
            >
              Timeless Elegance, <br />
              <span className="italic">Crafted for You</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-background/90 text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
            >
              Discover exceptional jewellery where every piece embodies the 
              pinnacle of artistry, precision, and enduring beauty.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/collections"
                className="btn-luxury bg-background text-foreground border border-background hover:bg-transparent hover:text-background"
              >
                Explore Collections
              </Link>
              <Link
                to="/contact"
                className="btn-luxury bg-transparent text-background border border-background/50 hover:bg-background hover:text-foreground"
              >
                Book an Appointment
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-background/60">
            <span className="text-xs tracking-luxury uppercase">Scroll</span>
            <div className="w-px h-12 bg-background/40 relative overflow-hidden">
              <motion.div
                animate={{ y: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-background"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Brand Introduction */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="divider-gold mb-8" />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 leading-tight">
              Where Heritage Meets <span className="italic">Modern Elegance</span>
            </h2>
            <p className="editorial-body text-muted-foreground max-w-2xl mx-auto">
              At ERUM, we believe that exceptional jewellery transcends mere adornment. 
              Each piece is a testament to our unwavering commitment to craftsmanship, 
              where traditional techniques harmonize with contemporary design. Our artisans 
              pour their heart and soul into every creation, ensuring that your jewellery 
              tells a story as unique as you are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-4">
              Our Collections
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
              Curated for the <span className="italic">Discerning</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CollectionCard {...collection} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Pieces */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-4">
                Signature Pieces
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
                Our <span className="italic">Bestsellers</span>
              </h2>
            </div>
            <Link
              to="/collections"
              className="luxury-link text-sm font-medium tracking-luxury uppercase"
            >
              View All Products
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Craftsmanship */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-luxury uppercase text-background/60 mb-4">
              Our Promise
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background">
              Excellence in Every <span className="italic">Detail</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {trustFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-background/20 mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl mb-3">{feature.title}</h3>
                <p className="text-background/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-4">
              Private Consultation
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              Experience <span className="italic">Bespoke</span> Service
            </h2>
            <p className="editorial-body text-muted-foreground mb-10 max-w-xl mx-auto">
              Book a private appointment at our studio for a personalized 
              consultation. Let our experts guide you through our collections 
              and help you find the perfect piece.
            </p>
            <Link to="/contact" className="btn-luxury-primary">
              Book Your Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h3 className="font-serif text-2xl md:text-3xl mb-4">
              Join Our Inner Circle
            </h3>
            <p className="text-muted-foreground mb-8">
              Be the first to discover new collections, exclusive events, 
              and timeless inspirations.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button type="submit" className="btn-luxury-primary">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
