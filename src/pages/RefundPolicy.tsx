import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Video, Clock, Package, XCircle } from 'lucide-react';

const RefundPolicy = () => {
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
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">Refund & Return Policy</h1>
            <p className="text-muted-foreground">Last Updated: 15/01/2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="space-y-12">
            {/* No Refund Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="h-6 w-6 text-destructive" />
                <h2 className="font-serif text-2xl">A) NO Refund Policy</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                We do NOT provide refunds under any circumstances, including but not limited to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Change of mind
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Wrong size selection by customer
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Product not liked after receiving
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Delay caused by courier/logistics partner
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Colour or texture variation due to lighting or screen differences
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Customer entered incorrect address
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Customer unavailable to receive parcel
                </li>
              </ul>
              <p className="mt-4 font-medium text-foreground">
                Once an order is confirmed, no refund will be processed.
              </p>
            </motion.div>

            {/* No Return Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-destructive" />
                <h2 className="font-serif text-2xl">B) NO Return Policy</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                We do NOT accept returns except in case of proven transit damage.
              </p>
              <p className="text-muted-foreground mb-4">
                All jewellery is made-to-order and passes through strict quality checks before dispatch. Therefore, we cannot accept returns for:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Fit issues
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Design preference
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Minor aesthetic differences
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Small crafting variations (normal in handmade jewelry)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Sale/discount items
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Earrings (hygiene reasons)
                </li>
              </ul>
            </motion.div>

            {/* Replacement Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">C) Replacement Policy – ONLY if product is damaged</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Replacement is offered ONLY in case of a damaged or broken product received during delivery, and only if the customer provides a valid unboxing video.
              </p>
              
              <div className="bg-background p-6 rounded-sm mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="h-5 w-5 text-primary" />
                  <h3 className="font-serif text-lg">Mandatory Unboxing Video Rules</h3>
                </div>
                <p className="text-muted-foreground mb-3">Your video MUST:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Start before opening the courier packet
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Show the shipping label clearly
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Be a single continuous video with NO cuts, edits, pauses, filters, or retakes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Clearly show the damage
                  </li>
                </ul>
                <p className="mt-4 font-medium text-foreground">
                  Replacement will not be approved without a valid unboxing video.
                </p>
              </div>
            </motion.div>

            {/* Situations where replacement will NOT be provided */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <h2 className="font-serif text-2xl">D) Situations where replacement will NOT be provided</h2>
              </div>
              <p className="text-muted-foreground mb-4">Replacement will be rejected if:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  No unboxing video is provided
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  Video is edited or unclear
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  Damage is reported after 24 hours
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  Product shows signs of use
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  Product damaged after opening
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  Size issues
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  Customer ordered the wrong item
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✗</span>
                  Customer mishandling
                </li>
              </ul>
            </motion.div>

            {/* Request Replacement Procedure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary p-8 rounded-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl">E) Request Replacement Procedure</h2>
              </div>
              <p className="text-muted-foreground mb-4">To claim replacement:</p>
              <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
                <li>Email/WhatsApp us within 24 hours of delivery</li>
                <li>Attach unboxing video + clear photos</li>
                <li>Mention order ID, name & phone number</li>
              </ol>
              <p className="mt-4 text-muted-foreground">
                Our quality team will review and approve or deny based on evidence.
              </p>
            </motion.div>

            {/* Replacement Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary/10 p-8 rounded-sm border border-primary/20"
            >
              <h2 className="font-serif text-2xl mb-4">F) Replacement Timeline</h2>
              <p className="text-muted-foreground mb-4">If approved:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Replacement will be sent within 7–10 working days
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  No refunds under any condition
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Replacement will be for same product only
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RefundPolicy;
