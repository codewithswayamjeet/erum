import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Clock, Ban, AlertCircle } from 'lucide-react';

const CancellationPolicy = () => {
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
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">Cancellation Policy</h1>
            <p className="text-muted-foreground">Last Updated: 15/01/2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="space-y-12">
            {/* Customer Cancellations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">Customer Cancellations</h2>
              </div>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Orders can be cancelled within <strong className="text-foreground">1 hour</strong> of placing the order.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>After we start processing, <strong className="text-foreground">no cancellation is allowed</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Since our jewellery is handcrafted/made-to-order, cancellations after 1 hour will <strong className="text-foreground">NOT be accepted</strong>.</span>
                </li>
              </ul>
            </motion.div>

            {/* Cancellation by ERUM */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Ban className="h-6 w-6 text-amber-500" />
                <h2 className="font-serif text-2xl">Cancellation by ERUM</h2>
              </div>
              <p className="text-muted-foreground mb-4">We may cancel your order if:</p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-amber-500">•</span>
                  Payment not received
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-500">•</span>
                  Incorrect address
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-500">•</span>
                  Non-serviceable pin code
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-500">•</span>
                  Unavailability of materials
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-500">•</span>
                  Fraudulent/suspicious order
                </li>
              </ul>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary/10 p-8 rounded-sm border border-primary/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-primary" />
                <h3 className="font-serif text-xl">Important Notice</h3>
              </div>
              <p className="text-muted-foreground">
                In cases where we cancel your order, we will notify you, and if payment was made, a refund may be issued back to the original payment method.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CancellationPolicy;
