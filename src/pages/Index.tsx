import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Diamond, Shield, Truck, Award, Sparkles, RefreshCw, Wrench, Scale, ThumbsUp, Headphones, Gem, Heart, BadgeCheck } from 'lucide-react';
import Layout from '@/components/Layout';
import CollectionCard from '@/components/CollectionCard';
import UnifiedProductGrid from '@/components/UnifiedProductGrid';
import AffiliationsSection from '@/components/AffiliationsSection';
import NewsletterSection from '@/components/NewsletterSection';
import VideoShowcase from '@/components/VideoShowcase';
import heroImage from '@/assets/hero-jewelry-only.jpg';
import collectionRings from '@/assets/collection-rings.jpg';
import collectionNecklaces from '@/assets/collection-necklaces.jpg';
import collectionEarrings from '@/assets/collection-earrings.jpg';
import collectionBracelets from '@/assets/collection-bracelets.jpg';
import aboutImage from '@/assets/about-craftsmanship.jpg';

const Index = () => {
  const collections = [
    { title: 'Engagement Rings', description: 'Symbols of eternal love', image: collectionRings, href: '/collections/rings?type=engagement' },
    { title: 'Tennis Bracelets', description: 'Timeless elegance', image: collectionBracelets, href: '/collections/bracelets?type=tennis' },
    { title: 'Diamond Studs', description: 'Everyday luxury', image: collectionEarrings, href: '/collections/earrings?type=studs' },
    { title: 'Pendant Necklaces', description: 'Statement pieces', image: collectionNecklaces, href: '/collections/necklaces?type=pendants' },
  ];

  const brandPromises = [
    { icon: Diamond, title: 'Conflict-Free Natural Diamonds Only', description: 'Every diamond is ethically sourced and conflict-free' },
    { icon: Gem, title: 'Responsible & Ethically Sourced Precious Metals', description: 'All precious metals responsibly sourced' },
    { icon: Shield, title: 'Lifetime Craftsmanship Warranty', description: 'We stand behind every piece we create' },
    { icon: Headphones, title: 'Personalised Global Customer Support', description: 'Dedicated support for clients worldwide' },
    { icon: BadgeCheck, title: 'GIA / IGI Certified Jewelry', description: 'Every piece certified by world-renowned laboratories' },
  ];

  return (
    <Layout>
      {/* Hero Section - Full Screen Dramatic */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Luxury high jewelry diamond collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/30 to-foreground/60" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-background/70 text-sm md:text-base tracking-[0.3em] uppercase mb-6"
            >
              Presenting the Hallmark of Craftsmanship
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-background font-normal leading-[0.9] mb-8"
            >
              High Jewelry
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-background/80 text-lg md:text-xl font-light tracking-wide mb-12 max-w-2xl mx-auto"
            >
              Where precious becomes priceless. Creating masterpieces that transcend time.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/collections" className="btn-luxury bg-background text-foreground border border-background hover:bg-transparent hover:text-background">
                Explore Collections
              </Link>
              <Link to="/contact?service=bespoke" className="btn-luxury bg-transparent text-background border border-background/40 hover:bg-background hover:text-foreground">
                Bespoke Services
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-background/50">
            <span className="text-xs tracking-[0.2em] uppercase">Discover</span>
            <div className="w-px h-16 bg-background/30 relative overflow-hidden">
              <motion.div 
                animate={{ y: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-background"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Brand Philosophy */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="divider-gold mb-8 mx-0" />
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
                A Brand You Can Trust<br /><span className="italic text-primary">Now and Forever</span>
              </h2>
              <p className="editorial-body text-muted-foreground mb-6">
                ERUM, meaning "Heaven" in Persian, was established with a passion for jewellery and gems. 
                Since time immemorial, jewellery has been a sign of prestige, nobility and grace.
              </p>
              <p className="editorial-body text-muted-foreground mb-8">
                We aim to maintain the purity and quality by giving you heavenly jewellery, just as the name suggests. 
                Every piece reflects our unwavering commitment to craftsmanship, where traditional techniques harmonize 
                with contemporary design.
              </p>
              <Link to="/about" className="luxury-link text-sm font-medium tracking-luxury uppercase text-foreground">
                Discover Our Story
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img src={aboutImage} alt="Master craftsman at work" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-primary text-primary-foreground p-8 max-w-xs hidden lg:block">
                <Sparkles className="w-8 h-8 mb-4" />
                <p className="font-serif text-lg italic">
                  "Great design must come with great finish."
                </p>
                <p className="text-sm mt-2 text-primary-foreground/80">— Mahammad Ali, Founder</p>
              </div>
            </motion.div>
          </div>
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
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Our Collections</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">Curated for the <span className="italic">Discerning</span></h2>
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

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link to="/collections" className="btn-luxury-outline">
              View All Collections
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Unified Products */}
      <UnifiedProductGrid 
        title="Our Collection"
        subtitle="Shop All Products"
        limit={8}
        showSource={false}
      />

      {/* Brand Promises */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-background/50 mb-4">Our Promise</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background">
              Excellence, Ethics & <span className="italic">Enduring Value</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {brandPromises.map((promise, index) => (
              <motion.div
                key={promise.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-background/20 mb-4">
                  <promise.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-sm md:text-base mb-2">{promise.title}</h3>
                <p className="text-background/60 text-xs leading-relaxed hidden md:block">{promise.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <VideoShowcase />

      {/* Affiliations */}
      <AffiliationsSection />

      {/* Bespoke CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutImage} alt="Bespoke jewelry craftsmanship" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center text-background"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-background/60 mb-4">Private Consultation</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              Experience <span className="italic">Bespoke</span> Service
            </h2>
            <p className="text-background/80 text-lg mb-10 max-w-xl mx-auto">
              Your imagination, our craftsmanship. Book a private appointment for a personalized consultation 
              and create a piece that tells your unique story.
            </p>
            <Link to="/contact" className="btn-luxury bg-background text-foreground border border-background hover:bg-transparent hover:text-background">
              Book Your Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </Layout>
  );
};

export default Index;