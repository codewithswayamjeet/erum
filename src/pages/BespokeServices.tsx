import { useState } from 'react';
import { motion } from 'framer-motion';
import { Diamond, Gem, Sparkles, Clock, Shield, Award, ArrowRight, CheckCircle, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import bespokeHeroVideo from '@/assets/bespoke-hero-video.mp4';

const BespokeServices = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    budget: '',
  });
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designInputKey, setDesignInputKey] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Consultation Request Received",
      description: "Our design team will contact you within 24 hours to schedule your consultation.",
    });
    setFormData({ name: '', email: '', phone: '', description: '', budget: '' });
    setDesignFile(null);
    setDesignInputKey((k) => k + 1);
  };

  const processSteps = [
    {
      step: '01',
      title: 'Inquiry',
      description: 'Begin your journey by sharing a sketch, photograph, heirloom, or a simple description. No detail is too small.',
      icon: Sparkles,
    },
    {
      step: '02',
      title: 'Design & Quote',
      description: 'Our team will get back to you with a concept design and an estimated quote for your review and approval.',
      icon: Diamond,
    },
    {
      step: '03',
      title: 'CAD & Manufacturing',
      description: 'Once approved, we create a 3D CAD model and initiate production with our expert artisans at the helm.',
      icon: Gem,
    },
    {
      step: '04',
      title: 'The Final Masterpiece',
      description: 'Your vision, fully realized — a unique, handcrafted piece that reflects your story, style, and spirit.',
      icon: Award,
    },
  ];

  const whyBespoke = [
    'One-of-a-kind design created exclusively for you',
    'Direct collaboration with master artisans',
    'Natural diamonds and ethically sourced gemstones',
    'Lifetime warranty and complimentary care',
    'Transparent pricing with no hidden costs',
    'Flexible payment plans available',
  ];

  // Floating diamond animation - using inline animate prop instead of variants
  const floatingAnimation = {
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const sparkleAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.8, 0.3],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <Layout>
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={bespokeHeroVideo} type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-foreground/60" />
        </div>

        {/* Animated decorative elements */}
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-[10%] z-10 hidden md:block"
        >
          <Diamond className="h-8 w-8 text-primary/40" />
        </motion.div>
        <motion.div
          animate={floatingAnimation}
          className="absolute top-40 right-[15%] z-10 hidden md:block"
        >
          <Gem className="h-6 w-6 text-primary/30" />
        </motion.div>
        <motion.div
          animate={sparkleAnimation}
          className="absolute bottom-32 left-[20%] z-10 hidden md:block"
        >
          <Sparkles className="h-10 w-10 text-primary/50" />
        </motion.div>
        <motion.div
          animate={sparkleAnimation}
          className="absolute top-1/3 right-[8%] z-10 hidden md:block"
        >
          <Sparkles className="h-6 w-6 text-primary/40" />
        </motion.div>
        
        {/* Content */}
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.span 
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xs tracking-luxury uppercase text-primary mb-6 block"
            >
              Bespoke Services
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 text-background"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                Your Vision,
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                Our Masterpiece
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="text-background/80 max-w-2xl mx-auto text-lg mb-10"
            >
              Create a piece as unique as your story. Our bespoke service transforms your dreams into 
              handcrafted jewelry of extraordinary beauty and lasting significance.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <Button 
                size="lg" 
                className="tracking-wider uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6" 
                onClick={() => document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Begin Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-background/60 tracking-widest uppercase">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Bespoke Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-xs tracking-luxury uppercase text-primary mb-4 block">The ERUM Experience</span>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">Why Choose Bespoke?</h2>
              <p className="text-muted-foreground mb-8">
                A bespoke creation is more than jewelry—it's a personal expression of your story, 
                crafted with intention and realized through exceptional artistry. Every detail is 
                considered, every element purposeful.
              </p>
              <ul className="space-y-4">
                {whyBespoke.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 to-secondary rounded-sm overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Diamond className="h-16 w-16 text-primary mx-auto mb-6 opacity-50" />
                    <p className="font-serif text-2xl text-foreground/80 italic">"Every piece tells a story"</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-xs tracking-luxury uppercase text-primary mb-4 block">The Journey</span>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Our Bespoke Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From initial inspiration to final presentation, every step is guided by our commitment 
              to excellence and your complete satisfaction.
            </p>
          </div>

          <div className="space-y-12">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-background border border-border flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className={`flex-1 text-center ${index % 2 === 1 ? 'md:text-right' : 'md:text-left'}`}>
                  <span className="text-6xl font-serif text-primary/20">{step.step}</span>
                  <h3 className="font-serif text-2xl mb-3 -mt-4">{step.title}</h3>
                  <p className="text-muted-foreground max-w-lg mx-auto md:mx-0">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <Clock className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Typical Timeline</h2>
            <div className="grid grid-cols-3 gap-8">
              <div className="p-6 bg-secondary rounded-sm">
                <span className="font-serif text-3xl text-primary">2-3</span>
                <p className="text-sm text-muted-foreground mt-2">Days for Design</p>
              </div>
              <div className="p-6 bg-secondary rounded-sm">
                <span className="font-serif text-3xl text-primary">7-8</span>
                <p className="text-sm text-muted-foreground mt-2">Days for Creation</p>
              </div>
              <div className="p-6 bg-secondary rounded-sm">
                <span className="font-serif text-3xl text-primary">10-12</span>
                <p className="text-sm text-muted-foreground mt-2">Days Total</p>
              </div>
            </div>
            <p className="text-muted-foreground mt-8">
              Timelines vary based on complexity. Rush orders may be accommodated upon request.
            </p>
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section id="consultation-form" className="py-24 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <Calendar className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl mb-4">Book Your Consultation</h2>
              <p className="text-muted-foreground">
                Share your vision with us. A member of our design team will contact you within 
                24 hours to schedule your private consultation.
              </p>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6 bg-background p-8 border border-border"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-luxury uppercase text-muted-foreground mb-2">Full Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-border focus:border-primary"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-luxury uppercase text-muted-foreground mb-2">Email *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-border focus:border-primary"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-luxury uppercase text-muted-foreground mb-2">Phone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-border focus:border-primary"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-luxury uppercase text-muted-foreground mb-2">Approximate Budget</label>
                  <Input
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="border-border focus:border-primary"
                    placeholder="₹5,00,000 - ₹10,00,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-luxury uppercase text-muted-foreground mb-2">Upload Your Design</label>
                <Input
                  key={designInputKey}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setDesignFile(e.target.files?.[0] ?? null)}
                  className="border-border focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:bg-secondary file:text-foreground hover:file:bg-muted"
                />
                <p className="mt-2 text-xs text-muted-foreground">Optional: upload a sketch, reference image, or PDF.</p>
              </div>

              <div>
                <label className="block text-xs tracking-luxury uppercase text-muted-foreground mb-2">Describe Your Vision *</label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border-border focus:border-primary min-h-[150px]"
                  placeholder="Tell us about the piece you envision. Include details about style, occasion, preferred stones, metals, or any inspiration you'd like to share..."
                />
              </div>

              <Button type="submit" size="lg" className="w-full tracking-wider uppercase text-xs">
                Request Consultation
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting, you agree to be contacted by our team. Your information is kept strictly confidential.
              </p>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BespokeServices;
