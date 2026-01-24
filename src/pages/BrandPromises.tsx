import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Diamond, Shield, Award, Heart, Globe, Gem, CheckCircle, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';

const BrandPromises = () => {
  const promises = [
    {
      icon: Diamond,
      title: 'Conflict-Free Natural Diamonds',
      description: 'Every diamond in our collection is ethically sourced and conflict-free. We adhere to the Kimberley Process and go beyond to ensure complete transparency in our supply chain.',
      details: [
        'Kimberley Process certified',
        'Full supply chain traceability',
        'Ethically mined from select sources',
        'Zero tolerance for conflict diamonds'
      ]
    },
    {
      icon: Gem,
      title: 'Ethically Sourced Metals',
      description: 'Our gold and platinum are responsibly sourced from certified refineries that meet the highest environmental and social standards.',
      details: [
        'Responsible Jewellery Council certified',
        'Recycled precious metals option',
        'Fair labor practices',
        'Environmental sustainability'
      ]
    },
    {
      icon: Shield,
      title: 'Lifetime Craftsmanship Warranty',
      description: 'Every ERUM piece comes with our lifetime craftsmanship warranty. We stand behind the quality of our work, offering free repairs for manufacturing defects.',
      details: [
        'Free lifetime repairs',
        'Annual cleaning & inspection',
        'Stone tightening service',
        'Rhodium re-plating for white gold'
      ]
    },
    {
      icon: Heart,
      title: 'Personalised Global Support',
      description: 'From Mumbai to anywhere in the world, our dedicated client services team provides personalized support for every ERUM customer.',
      details: [
        'Dedicated personal advisor',
        'Worldwide shipping & insurance',
        'Virtual consultations available',
        'After-purchase care guidance'
      ]
    },
    {
      icon: Award,
      title: 'GIA/IGI Certified Jewelry',
      description: 'All our diamonds above 0.30 carats come with independent certification from GIA or IGI, guaranteeing the quality and characteristics of your stone.',
      details: [
        'Independent laboratory certification',
        'Detailed grading reports',
        'Laser inscription verification',
        'Authenticity guarantee'
      ]
    }
  ];

  const affiliations = [
    { name: 'GIA', description: 'Gemological Institute of America' },
    { name: 'IGI', description: 'International Gemological Institute' },
    { name: 'BIS', description: 'Bureau of Indian Standards' },
    { name: 'GJEPC', description: 'Gem & Jewellery Export Promotion Council' },
    { name: 'IBJA', description: 'India Bullion & Jewellers Association' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-secondary via-background to-background">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 30%, hsl(var(--primary)) 1px, transparent 1px), radial-gradient(circle at 80% 70%, hsl(var(--primary)) 1px, transparent 1px)' ,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="relative container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8"
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
            
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Our Commitment</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              The ERUM <span className="italic text-primary">Promise</span>
            </h1>
            <div className="divider-gold mx-auto mb-8" />
            <p className="editorial-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Five foundational pillars that guide every piece we create and every relationship we build. 
              These aren't just promises — they're the essence of who we are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Promises Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="space-y-20">
            {promises.map((promise, index) => (
              <motion.div
                key={promise.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                    <promise.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl mb-4">{promise.title}</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {promise.description}
                  </p>
                </div>
                
                <div className={`bg-secondary p-8 lg:p-10 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <h4 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">What This Means For You</h4>
                  <ul className="space-y-4">
                    {promise.details.map((detail, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliations Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-background/50 mb-4">Trusted & Certified</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background">
              Our <span className="italic text-primary">Affiliations</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {affiliations.map((affiliation, index) => (
              <motion.div
                key={affiliation.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-background/5 border border-background/10 hover:border-primary/30 transition-colors"
              >
                <h3 className="font-serif text-xl text-background mb-2">{affiliation.name}</h3>
                <p className="text-background/50 text-sm">{affiliation.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Globe className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              A Global Standard of <span className="italic">Excellence</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              ERUM operates at the intersection of tradition and innovation. Our commitment to ethical 
              practices, quality craftsmanship, and customer satisfaction has earned us the trust of 
              discerning clients across the globe. When you choose ERUM, you're not just buying jewelry 
              — you're investing in a legacy of excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/collections" className="btn-luxury-primary">
                Explore Our Collections
              </Link>
              <Link to="/meet-the-designer" className="btn-luxury-outline">
                Meet the Designer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center text-primary-foreground"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              Experience the ERUM <span className="italic">Difference</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10">
              Visit our atelier for a personalized consultation and discover firsthand 
              the craftsmanship and care that goes into every ERUM creation.
            </p>
            <Link 
              to="/contact" 
              className="btn-luxury bg-background text-foreground border border-background hover:bg-transparent hover:text-background"
            >
              Book Your Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default BrandPromises;
