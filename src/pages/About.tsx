import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import heroImage from '@/assets/our-heritage.jpg';

const About = () => {
  return <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="ERUM heritage" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/55" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-background/80 text-sm tracking-luxury uppercase mb-4">
            Our Heritage
          </motion.p>
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="font-serif text-4xl md:text-5xl lg:text-6xl text-background">
            The Art of <span className="italic">Timeless Beauty</span>
          </motion.h1>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 40
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.8
          }} className="text-center mb-20">
              <div className="divider-gold mb-8" />
              <h2 className="font-serif text-3xl md:text-4xl mb-8">
                A Legacy of Excellence
              </h2>
              <p className="editorial-body text-muted-foreground leading-relaxed">
                Founded with a vision to redefine luxury jewellery, ERUM – The Jewellery 
                Studio has grown from a single atelier into a beacon of exceptional 
                craftsmanship. Our journey began with a simple belief: that every piece 
                of jewellery should be more than an accessory—it should be a work of art 
                that captures the essence of life's most precious moments.
              </p>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 40
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.8
          }} className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-4">
                  Our Philosophy
                </p>
                <h3 className="font-serif text-2xl md:text-3xl mb-6">
                  Where Tradition <span className="italic">Embraces</span> Innovation
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  At ERUM, we honour the age-old traditions of jewellery making while 
                  embracing contemporary aesthetics. Our master artisans, trained in 
                  techniques passed down through generations, bring each design to life 
                  with precision and passion.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Every curve, every setting, every polish is executed with meticulous 
                  attention to detail. We believe that true luxury lies not just in 
                  precious materials, but in the devotion invested in transforming them 
                  into objects of enduring beauty.
                </p>
              </div>
              <div className="aspect-[4/5] overflow-hidden">
                <img alt="Master artisan at work" className="w-full h-full object-cover" src="/lovable-uploads/69202f55-5480-4873-81c3-094d84f850cd.jpg" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-4">
                Craftsmanship
              </p>
              <h2 className="font-serif text-3xl md:text-4xl">
                The Pursuit of <span className="italic">Perfection</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[{
              number: '01',
              title: 'Design',
              description: 'Each piece begins as a sketch, where imagination meets expertise. Our designers draw inspiration from art, nature, and the desires of the discerning.'
            }, {
              number: '02',
              title: 'Creation',
              description: 'Master craftsmen bring designs to life, employing time-honoured techniques. Every stone is hand-selected, every setting precisely executed.'
            }, {
              number: '03',
              title: 'Perfection',
              description: 'Rigorous quality control ensures that only flawless pieces bear our name. Each creation is a testament to our uncompromising standards.'
            }].map((step, index) => <motion.div key={step.number} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} className="text-center">
                  <span className="text-4xl font-serif text-primary/30 block mb-4">
                    {step.number}
                  </span>
                  <h3 className="font-serif text-xl mb-4">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ethics & Sustainability */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="max-w-3xl mx-auto text-center">
            <p className="text-sm tracking-luxury uppercase text-background/60 mb-4">
              Our Commitment
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-background mb-8">
              Natural Diamonds, <span className="italic">Ethical Sourcing</span>
            </h2>
            <p className="text-background/80 leading-relaxed mb-8">
              We believe that true beauty carries responsibility. Every natural diamond we 
              source is conflict-free and certified by internationally recognized 
              laboratories including GIA and IGI. Our precious metals are responsibly sourced, and we 
              continuously strive to minimize our environmental footprint.
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
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              Discover Our Collections
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Experience the artistry of ERUM. Explore our curated collections 
              and find the piece that speaks to your soul.
            </p>
            <Link to="/collections" className="btn-luxury-primary">
              Explore Collections
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>;
};
export default About;