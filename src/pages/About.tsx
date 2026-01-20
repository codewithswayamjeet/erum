import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Diamond, Award, Heart, Sparkles, Globe, Shield } from 'lucide-react';
import Layout from '@/components/Layout';
import heroImage from '@/assets/our-heritage.jpg';
import craftImage from '@/assets/about-craftsmanship.jpg';

const About = () => {
  const values = [
    {
      icon: Diamond,
      title: 'Exceptional Quality',
      description: 'Every natural diamond is hand-selected for its exceptional cut, clarity, and brilliance.'
    },
    {
      icon: Heart,
      title: 'Timeless Elegance',
      description: 'Creating pieces meant to be treasured across generations, transcending fleeting trends.'
    },
    {
      icon: Award,
      title: 'Master Craftsmanship',
      description: 'Techniques passed down through generations, enhanced by modern precision.'
    },
    {
      icon: Shield,
      title: 'Certified Excellence',
      description: 'All diamonds are GIA/IGI certified, ensuring authenticity and quality assurance.'
    },
  ];

  const milestones = [
    { year: '2010', title: 'The Beginning', description: 'Founded with a vision to redefine luxury jewelry' },
    { year: '2015', title: 'First Atelier', description: 'Opened our flagship atelier in Mumbai' },
    { year: '2018', title: 'GIA Partnership', description: 'Became an authorized partner for GIA certified diamonds' },
    { year: '2022', title: 'International Recognition', description: 'Featured in leading jewelry publications' },
    { year: '2024', title: 'Hip Hop Collection', description: 'Launched our bold Hip Hop jewelry line' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="ERUM heritage" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-[0.3em] uppercase text-background/80 mb-4"
          >
            Our Heritage
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-background mb-6"
          >
            The Art of <span className="italic">Timeless Beauty</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-background/80 text-lg max-w-2xl mx-auto"
          >
            For over a decade, ERUM has been crafting exceptional jewelry that celebrates 
            life's most precious moments with uncompromising quality and artistry.
          </motion.p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Our Story</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8">
                A Legacy of <span className="italic">Excellence</span>
              </h2>
              <div className="divider-gold mb-8 mx-auto" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-12 items-center mb-20"
            >
              <div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Founded with a vision to redefine luxury jewellery, ERUM – The Jewellery 
                  Studio has grown from a single atelier into a beacon of exceptional 
                  craftsmanship. Our journey began with a simple belief: that every piece 
                  of jewellery should be more than an accessory—it should be a work of art 
                  that captures the essence of life's most precious moments.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  The name "ERUM," meaning "Heaven" in Persian, reflects our philosophy that 
                  jewelry should transcend the ordinary. Each creation is a testament to our 
                  unwavering commitment to excellence and the divine beauty of precious stones.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  At ERUM, we honour the age-old traditions of jewellery making while 
                  embracing contemporary aesthetics. Our master artisans bring each design 
                  to life with precision and passion, using techniques passed down through generations.
                </p>
              </div>
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={craftImage} 
                  alt="ERUM craftsmanship" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-background/50 mb-4">Our Values</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background">
              The Pillars of <span className="italic text-primary">Excellence</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-background/20 mb-6">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                <p className="text-background/60 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Process */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Craftsmanship
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
                The Pursuit of <span className="italic">Perfection</span>
              </h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  number: '01',
                  title: 'Stone Selection',
                  description: 'Each natural diamond is personally selected for its exceptional cut, clarity, and brilliance. Only GIA/IGI certified stones make the cut.'
                },
                {
                  number: '02',
                  title: 'Design & Rendering',
                  description: 'From initial sketches to 3D CAD models, every piece is meticulously planned before production begins.'
                },
                {
                  number: '03',
                  title: 'Master Crafting',
                  description: 'Our artisans bring designs to life using techniques passed down through generations, enhanced by modern precision tools.'
                },
                {
                  number: '04',
                  title: 'Quality Assurance',
                  description: 'Every piece undergoes rigorous inspection to ensure it meets ERUM\'s exacting standards before reaching its new home.'
                }
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-6 items-start border-l-2 border-primary pl-6"
                >
                  <span className="text-3xl font-serif text-primary/40 flex-shrink-0">{step.number}</span>
                  <div>
                    <h3 className="font-serif text-xl mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Our Journey</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
              Milestones of <span className="italic">Excellence</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex items-start gap-8 mb-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                  <span className="font-serif text-lg text-primary-foreground">{milestone.year}</span>
                </div>
                <div className={`flex-1 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                  <h3 className="font-serif text-xl mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethics & Sustainability */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-background/20 mb-6">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <p className="text-xs tracking-[0.3em] uppercase text-background/50 mb-4">
              Our Commitment
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-background mb-8">
              Natural Diamonds, <span className="italic">Ethical Sourcing</span>
            </h2>
            <p className="text-background/80 leading-relaxed mb-6">
              We believe that true beauty carries responsibility. Every natural diamond we 
              source is conflict-free and certified by internationally recognized 
              laboratories including GIA and IGI. Our precious metals are responsibly sourced, 
              and we continuously strive to minimize our environmental footprint.
            </p>
            <p className="text-background/80 leading-relaxed">
              When you choose ERUM, you choose jewellery crafted exclusively with natural diamonds— 
              pieces you can wear with pride, knowing they represent both exceptional quality 
              and ethical values as beautiful as their design.
            </p>
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
              Discover Our <span className="italic">Collections</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10">
              Experience the artistry of ERUM. Explore our curated collections 
              and find the piece that speaks to your soul.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/collections" 
                className="btn-luxury bg-background text-foreground border border-background hover:bg-transparent hover:text-background"
              >
                Explore Collections
              </Link>
              <Link 
                to="/meet-the-designer" 
                className="btn-luxury bg-transparent text-background border border-background hover:bg-background hover:text-foreground"
              >
                Meet the Designer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;