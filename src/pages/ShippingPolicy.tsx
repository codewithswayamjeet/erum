import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, AlertTriangle } from 'lucide-react';

const ShippingPolicy = () => {
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
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">Shipping Policy</h1>
            <p className="text-muted-foreground">Last Updated: 15/01/2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="space-y-12">
            {/* Dispatch Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">Dispatch Time</h2>
              </div>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-foreground">Ready stock:</strong> 2–4 business days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-foreground">Made-to-order jewellery:</strong> 5–12 business days depending on design</span>
                </li>
              </ul>
            </motion.div>

            {/* Delivery Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">Delivery Time</h2>
              </div>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-foreground">Within India:</strong> 4–8 working days after dispatch</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-foreground">International:</strong> 8–20 days depending on location</span>
                </li>
              </ul>
            </motion.div>

            {/* Shipping Charges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Truck className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">Shipping Charges</h2>
              </div>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-foreground">India:</strong> Free shipping on all orders</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-foreground">International:</strong> Shipping charges will reflect at checkout</span>
                </li>
              </ul>
            </motion.div>

            {/* Order Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">Order Tracking</h2>
              </div>
              <p className="text-muted-foreground">
                Tracking details will be shared via email/SMS once the order is shipped. You can track your order in real-time using the tracking link provided.
              </p>
            </motion.div>

            {/* Incorrect Address / Non-Delivery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-amber-500/10 p-8 rounded-sm border border-amber-500/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <h2 className="font-serif text-2xl">Incorrect Address / Non-Delivery</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                If the parcel is returned due to:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li className="flex items-start gap-3">
                  <span className="text-amber-500">•</span>
                  Wrong address
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-500">•</span>
                  Customer unavailable
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-500">•</span>
                  Phone not reachable
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-500">•</span>
                  Courier attempts failed
                </li>
              </ul>
              <p className="font-medium text-foreground">
                Reshipping charges will apply. No refund will be provided.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ShippingPolicy;
