import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { FileText, Image, Shield, Gavel, Globe } from 'lucide-react';

const TermsConditions = () => {
  return (
    <Layout>
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-primary mb-4 block">Legal</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">Terms & Conditions</h1>
            <p className="text-muted-foreground">Last Updated: 15/01/2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-muted-foreground mb-8 text-lg"
            >
              By accessing erum.in, you agree to the following terms:
            </motion.p>

            <div className="space-y-12">
              {/* Product Accuracy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-secondary p-8 rounded-sm border border-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Image className="h-6 w-6 text-primary" />
                  <h2 className="font-serif text-2xl">Product Accuracy</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  We try to display products as accurately as possible. Slight differences may occur due to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    Lighting conditions during photography
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    Handcrafted nature of our jewellery
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    Screen resolutions and color calibration differences
                  </li>
                </ul>
                <p className="mt-4 font-medium text-foreground">
                  These are not defects.
                </p>
              </motion.div>

              {/* Pricing & Updates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-secondary p-8 rounded-sm border border-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="font-serif text-2xl">Pricing & Updates</h2>
                </div>
                <p className="text-muted-foreground">
                  Prices may change anytime without prior notice. The price displayed at the time of order placement will be the final price for your purchase.
                </p>
              </motion.div>

              {/* Use of Website */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-secondary p-8 rounded-sm border border-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="h-6 w-6 text-primary" />
                  <h2 className="font-serif text-2xl">Use of Website</h2>
                </div>
                <p className="text-muted-foreground mb-4">You agree not to:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-destructive">✗</span>
                    Copy designs, images, or content
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-destructive">✗</span>
                    Misuse website data
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-destructive">✗</span>
                    Attempt hacking, unauthorized access, or harmful activities
                  </li>
                </ul>
              </motion.div>

              {/* Intellectual Property Rights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-primary/10 p-8 rounded-sm border border-primary/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="font-serif text-2xl">Intellectual Property Rights</h2>
                </div>
                <p className="text-muted-foreground">
                  All images, logos, jewellery designs, content, and graphics belong exclusively to <strong className="text-foreground">ERUM – The Jewellery Studio</strong>.
                </p>
                <p className="mt-4 font-medium text-foreground">
                  Copying or reproducing them is strictly prohibited.
                </p>
              </motion.div>

              {/* Limitation of Liability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-secondary p-8 rounded-sm border border-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="font-serif text-2xl">Limitation of Liability</h2>
                </div>
                <p className="text-muted-foreground mb-4">We are not responsible for:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    Shipping delays caused by courier partners
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    Lost parcels due to courier issues
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">•</span>
                    External factors beyond our control
                  </li>
                </ul>
              </motion.div>

              {/* Jurisdiction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-secondary p-8 rounded-sm border border-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Gavel className="h-6 w-6 text-primary" />
                  <h2 className="font-serif text-2xl">Jurisdiction</h2>
                </div>
                <p className="text-muted-foreground">
                  All disputes are subject to <strong className="text-foreground">Palanpur, Gujarat (India)</strong> jurisdiction only.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsConditions;
