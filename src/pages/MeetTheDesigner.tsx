import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Diamond, Award, Heart, Sparkles, Quote, Linkedin } from 'lucide-react';
import Layout from '@/components/Layout';
import designerImage from '@/assets/designer-portrait.jpg';
import craftImage from '@/assets/about-craftsmanship.jpg';

const MeetTheDesigner = () => {
  const philosophy = [
    {
      icon: Diamond,
      title: 'Uncompromising Quality',
      description: 'Every stone is hand-selected, every setting is perfected. We never settle for anything less than extraordinary.'
    },
    {
      icon: Heart,
      title: 'Emotional Connection',
      description: 'Jewelry marks life\'s most precious moments. Each piece must carry the weight of that emotion.'
    },
    {
      icon: Sparkles,
      title: 'Timeless Design',
      description: 'Trends fade, but true elegance endures. We create pieces meant to be treasured for generations.'
    },
    {
      icon: Award,
      title: 'Master Craftsmanship',
      description: 'Combining centuries-old techniques with modern precision to achieve perfection in every detail.'
    },
  ];

  const milestones = [
    { year: '2010', title: 'The Beginning', description: 'Founded ERUM with a vision to bring heavenly jewelry to the world' },
    { year: '2015', title: 'First Atelier', description: 'Opened our flagship atelier in Mumbai, bringing bespoke services to discerning clients' },
    { year: '2018', title: 'GIA Partnership', description: 'Became an authorized partner for GIA certified diamonds' },
    { year: '2022', title: 'International Recognition', description: 'Featured in leading jewelry publications and expanded to international clientele' },
    { year: '2024', title: 'Hip Hop Collection', description: 'Launched our bold Hip Hop jewelry line, bridging cultures through craftsmanship' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Meet the Designer</p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                Mahammad Ali
                <span className="block text-2xl md:text-3xl italic text-primary mt-2">Founder & Creative Director</span>
              </h1>
              <div className="divider-gold mb-6 mx-0" />
              <p className="editorial-body text-muted-foreground text-lg mb-8">
                A master craftsman whose passion for jewelry began in the heart of India's gem trade, 
                Mahammad Ali has dedicated over two decades to perfecting the art of high jewelry.
              </p>
              <Link to="/contact?service=bespoke" className="btn-luxury-primary">
                Book a Consultation
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square overflow-hidden relative">
                <img src={designerImage} alt="Mahammad Ali - ERUM Founder" className="w-full h-full object-cover" />
                <a 
                  href="https://www.linkedin.com/in/themahammadali/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:text-primary hover:bg-background transition-colors duration-300 shadow-lg"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 max-w-xs hidden lg:block">
                <Quote className="w-6 h-6 mb-2 opacity-50" />
                <p className="font-serif text-sm italic">
                  "Great design must come with great finish. There are no shortcuts to excellence."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Story */}
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
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">The Story</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
                From Passion to <span className="italic">Mastery</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <p className="text-muted-foreground leading-relaxed mb-6">
                Born into a family with deep roots in the gemstone trade, Mahammad Ali's love affair with 
                jewelry began at the age of twelve, watching master artisans transform raw diamonds into 
                breathtaking works of art. This early exposure ignited a lifelong passion that would 
                eventually lead to the creation of ERUM.
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                The name "ERUM," meaning "Heaven" in Persian, reflects Ali's philosophy that jewelry 
                should transcend the ordinary. After years of training under some of India's most 
                respected jewelers and gemologists, he founded ERUM with a singular vision: to create 
                pieces that capture the divine beauty of precious stones while honoring the rich 
                traditions of jewelry making.
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                Today, each ERUM creation is a testament to Ali's unwavering commitment to excellence. 
                He personally oversees every stage of production, from selecting the finest GIA and 
                IGI certified natural diamonds to the final polish. His hands-on approach ensures that every 
                piece meets the exacting standards that have become synonymous with the ERUM name.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Beyond craftsmanship, Ali believes in building lasting relationships with clients. 
                He often says, "We don't just create jewelry; we create heirlooms that will tell 
                stories for generations." This philosophy drives ERUM's commitment to personalized 
                service and bespoke creations that reflect each client's unique journey.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Philosophy */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-background/50 mb-4">Philosophy</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background">
              The Art of <span className="italic text-primary">Perfection</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {philosophy.map((item, index) => (
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

      {/* The Process */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img src={craftImage} alt="ERUM craftsmanship process" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">The Process</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8">
                Where Tradition Meets <span className="italic">Innovation</span>
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="font-serif text-xl mb-2">Stone Selection</h3>
                  <p className="text-muted-foreground">Each natural diamond is personally selected for its exceptional cut, clarity, and brilliance. Only GIA/IGI certified stones make the cut.</p>
                </div>
                
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="font-serif text-xl mb-2">Design & Rendering</h3>
                  <p className="text-muted-foreground">From initial sketches to 3D CAD models, every piece is meticulously planned before production begins.</p>
                </div>
                
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="font-serif text-xl mb-2">Master Crafting</h3>
                  <p className="text-muted-foreground">Our artisans bring designs to life using techniques passed down through generations, enhanced by modern precision tools.</p>
                </div>
                
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="font-serif text-xl mb-2">Quality Assurance</h3>
                  <p className="text-muted-foreground">Every piece undergoes rigorous inspection to ensure it meets ERUM's exacting standards before reaching its new home.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
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
              Let's Create Something <span className="italic">Extraordinary</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10">
              Schedule a private consultation with Mahammad Ali to discuss your bespoke jewelry vision.
            </p>
            <Link to="/contact?service=bespoke" className="btn-luxury bg-background text-foreground border border-background hover:bg-transparent hover:text-background">
              Book Your Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MeetTheDesigner;
