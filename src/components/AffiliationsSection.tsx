import { motion } from 'framer-motion';

// Import affiliation logos
import ibjaLogo from '@/assets/affiliations/ibja-logo-color.png';
import giaLogo from '@/assets/affiliations/gia-logo-color.png';
import gjepcLogo from '@/assets/affiliations/gjepc-logo-color.png';
import bisLogo from '@/assets/affiliations/bis-logo-color.png';
import igiLogo from '@/assets/affiliations/igi-logo-color.png';

const affiliations = [
  {
    name: 'India Bullion and Jewellers Association Ltd.',
    shortName: 'IBJA',
    logo: ibjaLogo,
    subtitle: 'Since 1919'
  },
  {
    name: 'Gemological Institute of America',
    shortName: 'GIA',
    logo: giaLogo,
    subtitle: ''
  },
  {
    name: 'Gem & Jewellery Export Promotion Council',
    shortName: 'GJEPC',
    logo: gjepcLogo,
    subtitle: 'INDIA'
  },
  {
    name: 'Bureau of Indian Standards',
    shortName: 'BIS',
    logo: bisLogo,
    subtitle: 'The National Standards Body of India'
  },
  {
    name: 'International Gemological Institute',
    shortName: 'IGI',
    logo: igiLogo,
    subtitle: ''
  }
];

const AffiliationsSection = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wider">Our Affiliation</h2>
        </motion.div>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {affiliations.map((affiliation, index) => (
            <motion.div
              key={affiliation.shortName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center group"
            >
              <div className="h-14 md:h-16 lg:h-20 w-[200px] md:w-[220px] lg:w-[240px] flex items-center justify-center">
                <img
                  src={affiliation.logo}
                  alt={affiliation.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              {affiliation.subtitle && (
                <p className="text-xs text-muted-foreground mt-2 text-center">{affiliation.subtitle}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AffiliationsSection;