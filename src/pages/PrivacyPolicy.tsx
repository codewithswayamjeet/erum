import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Lock, Eye, Shield, Cookie, Users, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
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
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground">Last Updated: 15/01/2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground mb-12 text-lg text-center"
          >
            ERUM – The Jewellery Studio values your privacy and protects your personal data.
          </motion.p>

          <div className="space-y-12">
            {/* Information We Collect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Eye className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">Information We Collect</h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Name, phone, email
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Shipping/billing address
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Order details
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Payment details (secured via payment gateway—NOT stored by us)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Device & browsing information (via cookies)
                </li>
              </ul>
            </motion.div>

            {/* How We Use Your Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <UserCheck className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">How We Use Your Information</h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  To process your order
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  To contact you for delivery updates
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  To improve your shopping experience
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  To send promotional messages (you may opt-out anytime)
                </li>
              </ul>
            </motion.div>

            {/* Data Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary/10 p-8 rounded-sm border border-primary/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Lock className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">Data Security</h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  We NEVER store or view payment/card details
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  Data is not sold or shared with unauthenticated third parties
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  Only authorized staff can access limited information
                </li>
              </ul>
            </motion.div>

            {/* Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Cookie className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">Cookies</h2>
              </div>
              <p className="text-muted-foreground">
                We use cookies to improve website functionality and personalize your experience. By continuing to use our website, you consent to our use of cookies.
              </p>
            </motion.div>

            {/* Third-Party Sharing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">Third-Party Sharing</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Your data may be shared ONLY with:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Delivery partners
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Payment gateways
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Customer support tools
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                All are required to keep your data confidential.
              </p>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">Your Rights</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                You can contact us to:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Update your information
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Request data deletion
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Stop promotional messages
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                Contact us at: <a href="mailto:Contact@erum.in" className="text-primary hover:underline">Contact@erum.in</a>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
