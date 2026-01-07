import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import UnifiedProductGrid from '@/components/UnifiedProductGrid';
import platinumHero from '@/assets/platinum-hero.jpg';

const PlatinumJewelry = () => {
  const categories = [
    { name: 'Rings', count: 'Platinum Bands & Solitaires', href: '/collections/rings?material=platinum' },
    { name: 'Earrings', count: 'Studs & Drops', href: '/collections/earrings?material=platinum' },
    { name: 'Necklaces', count: 'Pendants & Chains', href: '/collections/necklaces?material=platinum' },
    { name: 'Bracelets', count: 'Tennis & Bangles', href: '/collections/bracelets?material=platinum' },
  ];

  const features = [
    { title: 'Pure Platinum', description: '95% pure platinum for lasting brilliance and hypoallergenic comfort' },
    { title: 'Rare & Precious', description: '30 times rarer than gold, making each piece truly exceptional' },
    { title: 'Eternal Beauty', description: 'Naturally white metal that never fades or tarnishes over time' },
    { title: 'Expert Craftsmanship', description: 'Handcrafted by master artisans with decades of expertise' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={platinumHero}
            alt="Platinum Jewelry Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        </div>
        <div className="relative container mx-auto px-6 lg:px-12 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="text-primary text-sm tracking-luxury uppercase mb-4 block">Exclusive Collection</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background mb-6">
              Platinum Jewelry
            </h1>
            <p className="text-background/80 text-lg mb-8 leading-relaxed">
              Discover the timeless elegance of platinum — the rarest and most precious of all jewelry metals. 
              Each piece is crafted to perfection, embodying purity and everlasting beauty.
            </p>
            <a href="#collection" className="btn-luxury-primary">
              Explore Collection
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="font-serif text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our exquisite platinum jewelry collection, featuring natural diamonds set in the world's most precious metal.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.a
                key={category.name}
                href={category.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-gradient-to-br from-slate-100 to-slate-200 p-8 text-center hover:shadow-luxury transition-all duration-300"
              >
                <h3 className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Why Platinum Section */}
      <section className="py-16 lg:py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm tracking-luxury uppercase mb-4 block">Why Choose</span>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">The Platinum Difference</h2>
              <div className="space-y-4 text-background/80">
                <p>
                  Platinum is nature's most precious metal, 30 times rarer than gold. Its naturally white luster 
                  will never fade, yellow, or tarnish, making it the perfect choice for showcasing the brilliance 
                  of natural diamonds.
                </p>
                <p>
                  Unlike white gold, which requires rhodium plating to maintain its color, platinum's purity means 
                  your jewelry will look as beautiful decades from now as it does today.
                </p>
                <p>
                  Hypoallergenic and incredibly durable, platinum is ideal for those with sensitive skin and 
                  those who want jewelry that can be worn every day for a lifetime.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-background/10 p-6 text-center">
                <span className="font-serif text-4xl text-primary block mb-2">95%</span>
                <span className="text-sm">Pure Platinum</span>
              </div>
              <div className="bg-background/10 p-6 text-center">
                <span className="font-serif text-4xl text-primary block mb-2">30x</span>
                <span className="text-sm">Rarer than Gold</span>
              </div>
              <div className="bg-background/10 p-6 text-center">
                <span className="font-serif text-4xl text-primary block mb-2">∞</span>
                <span className="text-sm">Lasting Beauty</span>
              </div>
              <div className="bg-background/10 p-6 text-center">
                <span className="font-serif text-4xl text-primary block mb-2">100%</span>
                <span className="text-sm">Hypoallergenic</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="collection" className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Platinum Collection</h2>
            <p className="text-muted-foreground">Discover our curated selection of platinum jewelry with natural diamonds</p>
          </motion.div>
          <UnifiedProductGrid limit={8} />
        </div>
      </section>
    </Layout>
  );
};

export default PlatinumJewelry;
