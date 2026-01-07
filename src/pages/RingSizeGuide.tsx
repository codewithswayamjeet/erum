import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Ruler, CircleDot, Phone } from 'lucide-react';

const RingSizeGuide = () => {
  const sizeChart = [
    { circumference: '41', indian: '1', us: '1', uk: 'B' },
    { circumference: '42', indian: '2', us: '2', uk: 'D' },
    { circumference: '43', indian: '3', us: '2½', uk: 'E' },
    { circumference: '44', indian: '4', us: '3', uk: 'F½' },
    { circumference: '45', indian: '5', us: '3¼', uk: 'G' },
    { circumference: '46', indian: '6', us: '3¾', uk: 'H' },
    { circumference: '47', indian: '7', us: '4', uk: 'H½' },
    { circumference: '48', indian: '8', us: '4½', uk: 'I½' },
    { circumference: '49', indian: '9', us: '5', uk: 'J½' },
    { circumference: '50', indian: '10', us: '5½', uk: 'K' },
    { circumference: '51', indian: '11', us: '5¾', uk: 'L' },
    { circumference: '52', indian: '12', us: '6', uk: 'L½' },
    { circumference: '53', indian: '13', us: '6½', uk: 'M½' },
    { circumference: '54', indian: '14', us: '7', uk: 'N½' },
    { circumference: '55', indian: '15', us: '7¼', uk: 'O' },
    { circumference: '56', indian: '16', us: '7½', uk: 'P' },
    { circumference: '57', indian: '17', us: '8', uk: 'P½' },
    { circumference: '58', indian: '18', us: '8½', uk: 'Q½' },
    { circumference: '59', indian: '19', us: '9', uk: 'R½' },
    { circumference: '60', indian: '20', us: '9¼', uk: 'S' },
    { circumference: '61', indian: '21', us: '9½', uk: 'S½' },
    { circumference: '62', indian: '22', us: '10', uk: 'T½' },
    { circumference: '63', indian: '23', us: '10¼', uk: 'U' },
    { circumference: '64', indian: '24', us: '10½', uk: 'U½' },
    { circumference: '65', indian: '25', us: '11', uk: 'V½' },
    { circumference: '66', indian: '26', us: '11¼', uk: 'W' },
    { circumference: '67', indian: '27', us: '11½', uk: 'W½' },
    { circumference: '68', indian: '28', us: '12', uk: 'X½' },
    { circumference: '69', indian: '29', us: '12¼', uk: 'Y' },
    { circumference: '70', indian: '30', us: '12½', uk: 'Z' },
  ];

  const methods = [
    {
      icon: Ruler,
      title: 'Method 1: Measure with String',
      steps: [
        'Wrap a thin string or paper strip around your finger at its widest point.',
        'Mark where the string overlaps.',
        'Measure the length in millimeters using a ruler.',
        'Find your size using the chart below.'
      ]
    },
    {
      icon: CircleDot,
      title: 'Method 2: Existing Ring',
      steps: [
        'Take a ring that fits the intended finger well.',
        'Measure the inside diameter of the ring in millimeters.',
        'Multiply the diameter by 3.14 to get the circumference.',
        'Match the circumference to find your size.'
      ]
    },
    {
      icon: Phone,
      title: 'Method 3: Request a Ring Sizer',
      steps: [
        'Contact us to request a complimentary ring sizer.',
        'We will ship a professional metal ring sizer to your address.',
        'Try different sizes to find your perfect fit.',
        'Return the sizer and share your size with us.'
      ]
    }
  ];

  const tips = [
    'Measure your finger at the end of the day when it\'s at its largest.',
    'Ensure the ring can slide over your knuckle comfortably.',
    'Avoid measuring when your hands are cold, as fingers may shrink.',
    'If between sizes, choose the larger size for comfort.',
    'Different fingers may require different sizes — always measure the specific finger.',
    'Wide bands require a slightly larger size than thin bands.'
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-5xl mb-6">Ring Size Guide</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              An ill-fitting ring can slip off or feel uncomfortable. Find your perfect fit using our 
              comprehensive ring size guide with easy measurement methods.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Measurement Methods */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl text-center mb-12"
          >
            How to Measure Your Ring Size
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {methods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background border border-border p-8"
              >
                <method.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-serif text-xl mb-4">{method.title}</h3>
                <ol className="space-y-3">
                  {method.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                        {stepIndex + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Size Chart */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl mb-4">International Ring Size Chart</h2>
            <p className="text-muted-foreground">Convert your ring size across different international standards</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full bg-background border border-border">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="px-6 py-4 text-left text-sm font-medium">Circumference (mm)</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Indian Size</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">US/Canada Size</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">UK/Australia Size</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row, index) => (
                  <tr key={row.circumference} className={index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}>
                    <td className="px-6 py-3 text-sm">{row.circumference}</td>
                    <td className="px-6 py-3 text-sm font-medium">{row.indian}</td>
                    <td className="px-6 py-3 text-sm">{row.us}</td>
                    <td className="px-6 py-3 text-sm">{row.uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-serif text-3xl text-center mb-8">Tips for Accurate Measurement</h2>
            <div className="bg-primary/5 border border-primary/20 p-8">
              <ul className="space-y-4">
                {tips.map((tip, index) => (
                  <li key={index} className="flex gap-3 text-muted-foreground">
                    <span className="text-primary font-medium">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
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
              <a href="/contact" className="btn-luxury-primary">
                Book Appointment
              </a>
              <a href="tel:+919876543210" className="btn-luxury bg-transparent border-background/30 text-background hover:bg-background/10">
                Call Us: +91 98765 43210
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default RingSizeGuide;
