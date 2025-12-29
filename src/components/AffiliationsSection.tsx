import { motion } from 'framer-motion';

const affiliations = [
  { 
    name: 'India Bullion and Jewellers Association', 
    shortName: 'IBJA',
    description: 'Since 1919'
  },
  { 
    name: 'Gemological Institute of America', 
    shortName: 'GIA',
    description: 'Certified Diamonds'
  },
  { 
    name: 'Gem & Jewellery Export Promotion Council', 
    shortName: 'GJEPC',
    description: 'India'
  },
  { 
    name: 'Bureau of Indian Standards', 
    shortName: 'BIS',
    description: 'Hallmark Certified'
  },
  { 
    name: 'International Gemological Institute', 
    shortName: 'IGI',
    description: 'Certified'
  }
];

const AffiliationsSection = () => {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-xs font-medium tracking-luxury uppercase text-muted-foreground mb-2">Trusted By Industry Leaders</h3>
          <h2 className="font-serif text-2xl md:text-3xl">Our Affiliations</h2>
        </motion.div>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {affiliations.map((affiliation, index) => (
            <motion.div
              key={affiliation.shortName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-border bg-background flex items-center justify-center mb-3 group-hover:border-primary transition-colors duration-300">
                <span className="font-serif text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{affiliation.shortName}</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-[100px] leading-tight">{affiliation.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AffiliationsSection;