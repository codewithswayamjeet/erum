import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Crown, Star, Zap } from 'lucide-react';
import Layout from '@/components/Layout';
import ShopifyProductGrid from '@/components/ShopifyProductGrid';
import heroImage from '@/assets/hiphop-hero.jpg';

const HipHopJewelry = () => {
  const categories = [
    { 
      title: 'Cuban Link Chains', 
      description: 'Heavy iced-out chains that command attention',
      icon: Crown,
      href: '/collections?category=Necklaces'
    },
    { 
      title: 'Diamond Pendants', 
      description: 'Statement pieces dripping in brilliance',
      icon: Star,
      href: '/collections?category=Necklaces'
    },
    { 
      title: 'Diamond Rings', 
      description: 'Bold rings with VVS natural diamonds',
      icon: Zap,
      href: '/collections?category=Rings'
    },
    { 
      title: 'Tennis Chains', 
      description: 'Classic diamond tennis necklaces and bracelets',
      icon: Flame,
      href: '/collections?category=Bracelets'
    },
  ];

  const features = [
    { title: 'VVS Clarity', description: 'Only the clearest natural diamonds' },
    { title: 'Solid Gold', description: '10K-24K pure gold options' },
    { title: 'Custom Designs', description: 'Your vision, our craft' },
    { title: 'GIA/IGI Certified', description: 'Natural diamond authenticity' },
  ];

  return (
    <Layout>
      {/* Hero Section - Bold Urban Aesthetic */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Hip hop jewelry collection" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/40 to-foreground" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="h-px w-16 bg-primary" />
              <Flame className="w-8 h-8 text-primary" />
              <div className="h-px w-16 bg-primary" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-serif text-6xl md:text-8xl lg:text-9xl text-background font-bold leading-[0.85] mb-6 tracking-tight"
            >
              HIP HOP
              <span className="block text-primary italic font-normal">Jewelry</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-background/70 text-xl md:text-2xl font-light tracking-wide mb-10 max-w-2xl mx-auto"
            >
              Drip Different. Natural Diamonds. Real Gold. Real Statement.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a href="#products" className="btn-luxury bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary">
                Shop the Collection
              </a>
              <Link to="/contact?service=custom" className="btn-luxury bg-transparent text-background border border-background/40 hover:bg-background hover:text-foreground">
                Custom Pieces
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-background/50 text-sm tracking-[0.2em] uppercase"
          >
            Scroll to Explore
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-foreground">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">Categories</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background">
              Choose Your <span className="italic text-primary">Drip</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link 
                  to={category.href}
                  className="group block bg-background/5 border border-background/10 p-8 md:p-12 hover:bg-background/10 hover:border-primary/50 transition-all duration-500"
                >
                  <category.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-serif text-2xl md:text-3xl text-background mb-3 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-background/60 text-lg">{category.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="font-bold text-xl md:text-2xl text-primary-foreground mb-2">{feature.title}</h3>
                <p className="text-primary-foreground/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shopify Products Grid */}
      <section id="products" className="bg-secondary">
        <ShopifyProductGrid 
          title="Natural Diamond Collection" 
          subtitle="Featured Pieces"
          limit={12}
        />
      </section>

      {/* Statement Section */}
      <section className="py-32 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, hsl(var(--primary)) 50px, hsl(var(--primary)) 51px)' 
          }} />
        </div>
        
        <div className="relative container mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Crown className="w-16 h-16 text-primary mx-auto mb-8" />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background mb-8 leading-tight">
              Street Luxury,<br />
              <span className="italic text-primary">Elevated</span>
            </h2>
            <p className="text-background/70 text-lg md:text-xl max-w-2xl mx-auto mb-12">
              From the culture, for the culture. Every piece is handcrafted with the same precision 
              as our high jewelry, designed to make a statement that's impossible to ignore.
            </p>
            <Link to="/bespoke-services" className="btn-luxury bg-background text-foreground border border-background hover:bg-transparent hover:text-background">
              Start Your Custom Design
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="font-serif text-3xl md:text-4xl mb-6">Ready to Level Up?</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Book a private consultation for custom pieces or browse our ready-to-ship collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-luxury-primary">Book Consultation</Link>
              <Link to="/collections" className="btn-luxury-outline">View All Pieces</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HipHopJewelry;
