import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Ruler, CircleDot, Phone, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import brandPatternBg from '@/assets/brand-pattern-bg.jpg';

const RingSizeGuide = () => {
  const sizeChart = [
    { circumference: '41', indian: '1', us: '1', uk: 'B' },
    { circumference: '42', indian: '2', us: '2', uk: 'D' },
    { circumference: '43', indian: '3', us: '2 1/2', uk: 'E' },
    { circumference: '44', indian: '4', us: '3', uk: 'F 1/2' },
    { circumference: '45', indian: '5', us: '3 1/4', uk: 'G' },
    { circumference: '46', indian: '6', us: '3 3/4', uk: 'H' },
    { circumference: '47', indian: '7', us: '4', uk: 'H 1/2' },
    { circumference: '48', indian: '8', us: '4 1/2', uk: 'I 1/2' },
    { circumference: '49', indian: '9', us: '5', uk: 'J 1/2' },
    { circumference: '50', indian: '10', us: '5 1/2', uk: 'K' },
    { circumference: '51', indian: '11', us: '5 3/4', uk: 'L' },
    { circumference: '52', indian: '12', us: '6', uk: 'L 1/2' },
    { circumference: '53', indian: '13', us: '6 1/2', uk: 'M 1/2' },
    { circumference: '54', indian: '14', us: '7', uk: 'N 1/2' },
    { circumference: '55', indian: '15', us: '7 1/4', uk: 'O' },
    { circumference: '56', indian: '16', us: '7 1/2', uk: 'P' },
    { circumference: '57', indian: '17', us: '8', uk: 'P 1/2' },
    { circumference: '58', indian: '18', us: '8 1/2', uk: 'Q 1/2' },
    { circumference: '59', indian: '19', us: '8 3/4', uk: 'R' },
    { circumference: '60', indian: '20', us: '9', uk: 'S' },
    { circumference: '61', indian: '21', us: '9 1/2', uk: 'S 1/2' },
    { circumference: '62', indian: '22', us: '10', uk: 'T 1/2' },
    { circumference: '63', indian: '23', us: '10 1/4', uk: 'U 1/2' },
    { circumference: '64', indian: '24', us: '10 3/4', uk: 'V' },
    { circumference: '65', indian: '25', us: '11', uk: 'W' },
    { circumference: '66', indian: '26', us: '11 1/2', uk: 'W 1/2' },
    { circumference: '67', indian: '27', us: '12', uk: 'X 1/2' },
  ];

  const faqs = [
    {
      question: 'Can I use a string to find my ring size?',
      answer: 'Yes, but ensure it\'s non-stretchable and wrapped snugly without compressing the skin. Best if you can request our FREE Metallic Ring Finger Sizer for an accurate reading of your ring size.'
    },
    {
      question: 'How do I convert my ring size from US to European size?',
      answer: 'Ring size conversions vary by country. European sizes use inner circumference in millimeters, while UK sizes use letters. Always reference a reliable ring size chart, as half sizes may differ.'
    },
    {
      question: 'How to measure ring size at home?',
      answer: 'Measure when fingers are at normal temperature—cold shrinks, heat swells. Use a thread, ring sizer, or even an existing ring. For best accuracy, measure multiple times throughout the day.'
    },
    {
      question: 'How do you tell if a ring is too loose or too tight?',
      answer: 'A properly fitted ring slides on smoothly and resists slightly at the knuckle. If it spins freely or leaves deep indentations, it\'s either too loose or too tight.'
    },
    {
      question: 'What is the standard ring size for women/men?',
      answer: 'Women\'s average size is 6-7, men\'s is 9-10, but bone structure, lifestyle, and climate affect fit. Wider bands need larger sizes, while thinner bands fit more snugly.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section with Brand Pattern */}
      <section 
        className="relative pt-32 pb-16"
        style={{
          backgroundImage: `url(${brandPatternBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">Ring Size Calculator</h1>
            <h2 className="font-serif text-2xl md:text-3xl text-primary mb-6">How To Measure Ring Size With Easy Methods?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              An ill-fitting ring can slip off or feel uncomfortable. Find your perfect fit — use our ring size calculator 
              or follow the manual methods to let your hands effortlessly hold the gaze of the world with grace and beauty.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Method 1: Metallic Ring Sizer */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl">Method 1: ERUM Metallic Ring Finger Sizer — Refundable</h3>
            </div>
            <div className="bg-muted/30 p-8 border border-border">
              <p className="text-muted-foreground mb-6">
                One of the easiest and best ways to measure your ring size at home is by simply using our Metallic Ring Size Finger. 
                When you place your ring order, simply request our ring sizer – <strong>it's absolutely FREE.</strong> Make sure you 
                choose a size that you can wear and remove comfortably.
              </p>
              <Link to="/contact" className="btn-luxury-primary">
                Request Ring Sizer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ring Size Chart */}
      <section 
        className="py-16 lg:py-20"
        style={{
          backgroundImage: `url(${brandPatternBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Finger Ring Size Chart</h2>
            <p className="text-muted-foreground">For Converting Your Ring Size to MM</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="overflow-x-auto bg-background shadow-luxury"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="px-6 py-4 text-left text-sm font-medium border-r border-background/20">Circumference (mm)</th>
                  <th className="px-6 py-4 text-left text-sm font-medium border-r border-background/20">Indian Ring Size</th>
                  <th className="px-6 py-4 text-left text-sm font-medium border-r border-background/20">US/Canada Size</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">UK/Australia/NZ Size</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row, index) => (
                  <tr key={row.circumference} className={index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}>
                    <td className="px-6 py-3 text-sm border-r border-border">{row.circumference}</td>
                    <td className="px-6 py-3 text-sm font-medium border-r border-border">{row.indian}</td>
                    <td className="px-6 py-3 text-sm border-r border-border">{row.us}</td>
                    <td className="px-6 py-3 text-sm">{row.uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Method 2: Vernier Calliper */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Ruler className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl">Method 2: Using Vernier Calliper / Ruler</h3>
            </div>
            <div className="bg-muted/30 p-8 border border-border">
              <p className="text-muted-foreground mb-6">
                Here is another method of determining ring size – using a calliper. All you need is an existing ring and a calliper, and follow the steps.
              </p>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">1</span>
                  <span className="text-muted-foreground">Start by checking for any zero errors by closing the jaws and ensuring the zero marks on the main and vernier align perfectly.</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">2</span>
                  <span className="text-muted-foreground">Place your ring band between the jaws and ensure it is perpendicular to the calliper's jaws.</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">3</span>
                  <span className="text-muted-foreground">Slowly close the jaws until the grip is secure on the ring band.</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">4</span>
                  <span className="text-muted-foreground">Measure the outside diameter of the ring.</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">5</span>
                  <span className="text-muted-foreground">Measure the ring thickness.</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">6</span>
                  <span className="text-muted-foreground">Use this formula: <strong>Outside Diameter (OD) - Thickness (TH) - Thickness (TH) = Inner Diameter (ID)</strong></span>
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Method 3: String Method */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CircleDot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl">Method 3: Using String or Paper Strip</h3>
            </div>
            <div className="bg-background p-8 border border-border">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">1</span>
                  <span className="text-muted-foreground">Wrap a thin non-stretchable string or paper strip around your finger at its widest point (usually the knuckle).</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">2</span>
                  <span className="text-muted-foreground">Mark where the string overlaps or meets.</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">3</span>
                  <span className="text-muted-foreground">Measure the length in millimeters using a ruler.</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">4</span>
                  <span className="text-muted-foreground">Find your size using the chart above by matching the circumference.</span>
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Useful Tips */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Useful Tips For Measuring Ring Size</h2>
            <p className="text-muted-foreground text-center mb-8">
              Getting the perfect ring size demands precision. You need to consider factors like temperature, 
              time of day, knuckle size, and long-term wearability. Here's how to ensure accuracy:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted/30 p-6 border border-border">
                <h4 className="font-medium mb-3">Measure When Your Hands Are Warm</h4>
                <p className="text-sm text-muted-foreground">
                  Finger size fluctuates due to temperature, hydration, and sodium intake. Measure in a neutral environment, 
                  when your hands are warm but not swollen from exercise or high salt consumption.
                </p>
              </div>

              <div className="bg-muted/30 p-6 border border-border">
                <h4 className="font-medium mb-3">Take Multiple Readings</h4>
                <p className="text-sm text-muted-foreground">
                  Measure at different times over a few days. Your fingers are slightly larger in the evening, 
                  making it the best time for a final measurement.
                </p>
              </div>

              <div className="bg-muted/30 p-6 border border-border">
                <h4 className="font-medium mb-3">Knuckle vs. Finger Base</h4>
                <p className="text-sm text-muted-foreground">
                  If you have prominent knuckles, choose a size that slides over them with slight resistance but isn't 
                  too loose at the base. A ring that spins is too big, while one that requires excessive force is too small.
                </p>
              </div>

              <div className="bg-muted/30 p-6 border border-border">
                <h4 className="font-medium mb-3">Ring Style Matters</h4>
                <p className="text-sm text-muted-foreground">
                  Narrow bands (under 3mm) fit true to size. Wide bands (over 5mm) create a snugger fit—size up by ½. 
                  Stackable rings need a slightly larger size for flexibility.
                </p>
              </div>

              <div className="bg-muted/30 p-6 border border-border">
                <h4 className="font-medium mb-3">Use a Professional Sizing Tool</h4>
                <p className="text-sm text-muted-foreground">
                  A jeweler's mandrel or ring sizer provides the most reliable results. 
                  Printable charts can be helpful but may vary slightly.
                </p>
              </div>

              <div className="bg-muted/30 p-6 border border-border">
                <h4 className="font-medium mb-3">Plan for Long-Term Fit</h4>
                <p className="text-sm text-muted-foreground">
                  Finger size can shift due to weight changes, pregnancy, or aging—choose a size with slight flexibility, 
                  especially for lifelong pieces like wedding bands.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section 
        className="py-16 lg:py-20"
        style={{
          backgroundImage: `url(${brandPatternBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background p-6 border border-border shadow-sm"
                >
                  <h3 className="font-serif text-lg mb-3">{index + 1}. {faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl mb-4">Need Help Finding Your Size?</h2>
            <p className="text-background/70 mb-8 max-w-xl mx-auto">
              Our jewelry experts are here to assist you. Request a complimentary ring sizer or 
              book an appointment at our studio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-luxury-primary">
                Book Appointment
              </Link>
              <a href="tel:+919974555440" className="btn-luxury bg-transparent border-background/30 text-background hover:bg-background/10">
                Call Us: +91 9974555440
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default RingSizeGuide;
