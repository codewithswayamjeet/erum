import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Diamond, Award, Heart, Sparkles, Globe, Shield, Star, Gem } from 'lucide-react';
import Layout from '@/components/Layout';
import craftImage from '@/assets/about-craftsmanship.jpg';

const About = () => {
  const pillars = [
    {
      icon: Diamond,
      title: 'Exceptional Quality',
      description: 'Every natural diamond is hand-selected for its exceptional cut, clarity, and brilliance.',
      gradient: 'from-amber-500 to-yellow-600',
    },
    {
      icon: Heart,
      title: 'Timeless Elegance',
      description: 'Creating pieces meant to be treasured across generations, transcending fleeting trends.',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      icon: Award,
      title: 'Master Craftsmanship',
      description: 'Techniques passed down through generations, enhanced by modern precision.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Shield,
      title: 'Certified Excellence',
      description: 'All diamonds are GIA/IGI certified, ensuring authenticity and quality assurance.',
      gradient: 'from-blue-500 to-indigo-600',
    },
  ];

  const milestones = [
    { year: '2010', title: 'The Beginning', description: 'Founded with a vision to redefine luxury jewelry' },
    { year: '2015', title: 'First Atelier', description: 'Opened our flagship atelier in Mumbai' },
    { year: '2018', title: 'GIA Partnership', description: 'Became an authorized partner for GIA certified diamonds' },
    { year: '2022', title: 'International Recognition', description: 'Featured in leading jewelry publications' },
    { year: '2024', title: 'Hip Hop Collection', description: 'Launched our bold Hip Hop jewelry line' },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Stone Selection',
      description: 'Each natural diamond is personally selected for its exceptional cut, clarity, and brilliance. Only GIA/IGI certified stones make the cut.',
      icon: Gem,
    },
    {
      number: '02',
      title: 'Design & Rendering',
      description: 'From initial sketches to 3D CAD models, every piece is meticulously planned before production begins.',
      icon: Sparkles,
    },
    {
      number: '03',
      title: 'Master Crafting',
      description: 'Our artisans bring designs to life using techniques passed down through generations, enhanced by modern precision tools.',
      icon: Star,
    },
    {
      number: '04',
      title: 'Quality Assurance',
      description: 'Every piece undergoes rigorous inspection to ensure it meets ERUM\'s exacting standards before reaching its new home.',
      icon: Award,
    },
  ];

  return (
    <Layout>
      {/* Hero Section - No background image, pure design */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-foreground via-foreground to-foreground/95">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, hsl(var(--background)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--background)) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />
        </div>
        
        {/* Floating diamond shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [45, 50, 45] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 border border-primary/30 rotate-45 hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [45, 40, 45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-16 w-32 h-32 border border-primary/20 rotate-45 hidden lg:block"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-4 h-4 bg-primary rotate-45 hidden lg:block"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-20 w-6 h-6 bg-primary/60 rotate-45 hidden lg:block"
        />
        
        {/* Large decorative diamond outline */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.05, scale: 1 }}
            transition={{ duration: 2 }}
            className="w-[600px] h-[600px] border border-primary rotate-45"
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-6"
          >
            <Diamond className="w-16 h-16 mx-auto text-primary mb-4" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-[0.4em] uppercase text-primary mb-6"
          >
            Our Heritage
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-background mb-8 leading-tight"
          >
            The Art of <br />
            <span className="italic text-primary">Timeless Beauty</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-background/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            For over a decade, ERUM has been crafting exceptional jewelry that celebrates 
            life's most precious moments with uncompromising quality and artistry.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-background/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* 3D Pillars Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">The Foundation</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
              Pillars of <span className="italic">Excellence</span>
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </motion.div>

          {/* 3D Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group perspective-1000"
              >
                {/* 3D Pillar Card */}
                <div className="relative bg-gradient-to-b from-secondary to-background border border-border rounded-2xl p-8 shadow-xl transform-gpu transition-all duration-500 group-hover:shadow-2xl group-hover:border-primary/30"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Top cap of pillar */}
                  <div className="absolute -top-3 left-4 right-4 h-3 bg-gradient-to-b from-primary/20 to-primary/10 rounded-t-lg transform -skew-y-1" />
                  
                  {/* Icon container with 3D effect */}
                  <motion.div
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                    className={`w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center shadow-lg transform-gpu`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <pillar.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="font-serif text-xl text-center mb-4 group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground text-sm text-center leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Bottom shadow for 3D effect */}
                  <div className="absolute -bottom-2 left-6 right-6 h-4 bg-foreground/5 blur-md rounded-full" />
                </div>

                {/* Pillar base */}
                <div className="mx-4 h-4 bg-gradient-to-b from-border to-transparent rounded-b-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Our Story</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 text-background">
                A Legacy of <span className="italic text-primary">Excellence</span>
              </h2>
              
              <p className="text-background/80 leading-relaxed mb-6">
                Founded with a vision to redefine luxury jewellery, ERUM – The Jewellery 
                Studio has grown from a single atelier into a beacon of exceptional 
                craftsmanship. Our journey began with a simple belief: that every piece 
                of jewellery should be more than an accessory—it should be a work of art 
                that captures the essence of life's most precious moments.
              </p>
              <p className="text-background/80 leading-relaxed mb-6">
                The name "ERUM," meaning "Heaven" in Persian, reflects our philosophy that 
                jewelry should transcend the ordinary. Each creation is a testament to our 
                unwavering commitment to excellence and the divine beauty of precious stones.
              </p>
              <p className="text-background/80 leading-relaxed">
                At ERUM, we honour the age-old traditions of jewellery making while 
                embracing contemporary aesthetics. Our master artisans bring each design 
                to life with precision and passion, using techniques passed down through generations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={craftImage} 
                  alt="ERUM craftsmanship" 
                  className="w-full h-full object-cover" 
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-primary rounded-2xl hidden lg:block" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-2xl hidden lg:block" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section with 3D Cards */}
      <section className="py-32 bg-secondary relative">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              The Process
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              The Pursuit of <span className="italic">Perfection</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                {/* Connecting line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
                )}
                
                <div className="relative bg-background rounded-2xl p-8 shadow-lg border border-border group-hover:border-primary/50 group-hover:shadow-xl transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="font-serif text-lg text-primary-foreground">{step.number}</span>
                  </div>

                  <div className="pt-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl mb-4">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Our Journey</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Milestones of <span className="italic">Excellence</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            {/* Central timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary hidden md:block" />

            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center gap-8 mb-16 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-secondary p-8 rounded-2xl shadow-lg border border-border hover:border-primary/30 transition-all"
                  >
                    <h3 className="font-serif text-2xl mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </motion.div>
                </div>

                {/* Year circle */}
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-xl z-10 relative">
                  <span className="font-serif text-xl text-primary-foreground">{milestone.year}</span>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                </div>

                {/* Empty space for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethics Section */}
      <section className="py-32 bg-foreground text-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-40 h-40 border border-primary/10 rounded-full hidden lg:block" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border border-primary/10 rounded-full hidden lg:block" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-primary mb-8"
            >
              <Globe className="w-10 h-10 text-primary" />
            </motion.div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Our Commitment
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-background mb-10">
              Natural Diamonds, <span className="italic text-primary">Ethical Sourcing</span>
            </h2>
            <p className="text-background/80 leading-relaxed text-lg mb-8 max-w-3xl mx-auto">
              We believe that true beauty carries responsibility. Every natural diamond we 
              source is conflict-free and certified by internationally recognized 
              laboratories including GIA and IGI. Our precious metals are responsibly sourced, 
              and we continuously strive to minimize our environmental footprint.
            </p>
            <p className="text-background/80 leading-relaxed text-lg max-w-3xl mx-auto">
              When you choose ERUM, you choose jewellery crafted exclusively with natural diamonds— 
              pieces you can wear with pride, knowing they represent both exceptional quality 
              and ethical values as beautiful as their design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
        {/* Decorative diamonds */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-32 h-32 border border-white/10 rotate-45 hidden lg:block"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 left-10 w-48 h-48 border border-white/10 rotate-45 hidden lg:block"
        />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center text-primary-foreground"
          >
            <Diamond className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="font-serif text-4xl md:text-5xl mb-8">
              Discover Our <span className="italic">Collections</span>
            </h2>
            <p className="text-primary-foreground/80 text-xl mb-12 leading-relaxed">
              Experience the artistry of ERUM. Explore our curated collections 
              and find the piece that speaks to your soul.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/collections" 
                className="px-10 py-4 bg-background text-foreground font-medium tracking-wide uppercase text-sm hover:bg-background/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Collections
              </Link>
              <Link 
                to="/meet-the-designer" 
                className="px-10 py-4 bg-transparent text-background font-medium tracking-wide uppercase text-sm border-2 border-background hover:bg-background hover:text-foreground transition-all duration-300"
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