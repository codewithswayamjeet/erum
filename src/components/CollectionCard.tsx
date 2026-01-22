import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CollectionCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

const CollectionCard = ({ title, description, image, href }: CollectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Link to={href} className="group block relative overflow-hidden">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h3 className="font-serif text-2xl md:text-3xl text-background mb-2">
            {title}
          </h3>
          <p className="text-background/80 text-sm mb-4 max-w-xs">
            {description}
          </p>
          <span className="inline-flex items-center text-sm font-medium tracking-luxury uppercase text-background group-hover:text-primary transition-colors duration-300">
            Explore Collection
            <svg
              className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default CollectionCard;
