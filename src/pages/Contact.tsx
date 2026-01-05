import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    appointmentType: 'general',
  });

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
      subject: '',
      message: '',
      appointmentType: 'general',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-4">
              Get in Touch
            </p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              We'd Love to <span className="italic">Hear from You</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Whether you have a question about our collections, wish to book a 
              private consultation, or simply want to share your thoughts, 
              we're here to assist you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl mb-8">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="appointmentType"
                      className="block text-sm font-medium mb-2"
                    >
                      Inquiry Type
                    </label>
                    <select
                      id="appointmentType"
                      name="appointmentType"
                      value={formData.appointmentType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="appointment">Book Appointment</option>
                      <option value="custom">Custom Design</option>
                      <option value="order">Order Status</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button type="submit" className="btn-luxury-primary">
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl mb-8">
                Visit Our Studio
              </h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      F 3/4, Golden Plaza<br />
                      Near Kirtistambh, Palanpur<br />
                      Gujarat 385001 (India)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:+919876543210" className="hover:text-primary transition-colors">
                        +91 98765 43210
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:hello@erum.studio" className="hover:text-primary transition-colors">
                        hello@erum.studio
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Studio Hours</h3>
                    <p className="text-muted-foreground">
                      Monday – Saturday: 10:00 AM – 7:00 PM<br />
                      Sunday: By Appointment Only
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment CTA */}
              <div className="bg-secondary p-8 border border-border">
                <h3 className="font-serif text-xl mb-4">
                  Private Appointments
                </h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Experience personalized service in our private viewing room. 
                  Our experts will guide you through our collections and help 
                  you find the perfect piece.
                </p>
                <p className="text-sm font-medium tracking-luxury uppercase text-primary">
                  Appointments Available Daily
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
