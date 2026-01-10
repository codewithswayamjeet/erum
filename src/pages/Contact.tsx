import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin } from 'lucide-react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import AffiliationsSection from '@/components/AffiliationsSection';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [designImage, setDesignImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message Sent',
      description: 'Thank you for reaching out. We will respond within 24 hours.',
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
    setDesignImage(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDesignImage(e.target.files[0]);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/20 via-primary/30 to-primary/40">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground uppercase tracking-wider">
            Connect With Us
          </h1>
        </motion.div>
      </section>

      {/* Form Section */}
      <section className="relative py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl mx-auto bg-background p-8 md:p-12 shadow-luxury"
          >
            <p className="text-primary text-sm tracking-luxury uppercase text-center mb-2">Message Us</p>
            <h2 className="font-serif text-3xl md:text-4xl text-center mb-8">Get in Touch</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-muted/30 border border-border focus:border-primary focus:outline-none transition-colors"
                  placeholder="Name"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-muted/30 border border-border focus:border-primary focus:outline-none transition-colors"
                  placeholder="Email"
                />
              </div>
              
              <div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-muted/30 border border-border focus:border-primary focus:outline-none transition-colors"
                  placeholder="Phone"
                />
              </div>
              
              <div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-4 bg-muted/30 border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Your Message"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Upload your design image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-muted/30 border border-border focus:border-primary focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {designImage && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {designImage.name}
                  </p>
                )}
              </div>

              <button type="submit" className="w-full btn-luxury-primary">
                Send
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-8">
                Wherever you are in the world, we have the local expertise and the global reach you need.
              </p>

              {/* Social Media Links */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Follow Us</h3>
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.instagram.com/erumjewellery"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors duration-300"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.facebook.com/erumjewellery/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors duration-300"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/erumjewellery"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="https://x.com/erumjewellery"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors duration-300"
                    aria-label="Twitter"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    F 3/4, Golden Plaza, Near Kirtistambh, Palanpur, Gujarat 385001 (India)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="tel:+919974555440" className="text-muted-foreground hover:text-primary transition-colors">
                    +91 9974555440
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="mailto:Contact@erum.in" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact@erum.in
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-[400px] bg-muted/30 border border-border overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3638.3776!2d72.4308!3d24.1755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395ce9c9d7c7c9c7%3A0x7c7c7c7c7c7c7c7c!2sGolden%20Plaza%2C%20Palanpur%2C%20Gujarat%20385001!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ERUM Location Map"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <AffiliationsSection />

      {/* Quick Links */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-serif text-2xl mb-8">Quick Links</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a>
              <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a>
              <a href="/ring-size-guide" className="text-muted-foreground hover:text-primary transition-colors">Ring Size Guide</a>
              <a href="https://www.gia.edu/retailer-lookup" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">GIA Retailer Lookup</a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
