import { motion } from 'framer-motion';

// Import affiliation logos
import ibjaLogo from '@/assets/affiliations/ibja-logo.png';
import giaLogo from '@/assets/affiliations/gia-logo.png';
import gjepcLogo from '@/assets/affiliations/gjepc-logo.png';
import bisLogo from '@/assets/affiliations/bis-logo.png';
import igiLogo from '@/assets/affiliations/igi-logo.png';

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
    <section className="py-16 bg-[#FFF9E6]">
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
              className="flex items-center justify-center"
            >
              <img 
                src={affiliation.logo} 
                alt={affiliation.name}
                className="h-12 md:h-16 lg:h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AffiliationsSection;