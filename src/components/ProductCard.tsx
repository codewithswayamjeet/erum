import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Link to={`/product/${id}`} className="group block">
        <div className="image-zoom aspect-square bg-secondary mb-4 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="text-center">
          {category && (
            <p className="text-xs text-muted-foreground tracking-luxury uppercase mb-1">
              {category}
            </p>
          )}
          <h3 className="font-serif text-lg font-medium mb-1 group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <p className="text-muted-foreground">
            ₹{price.toLocaleString('en-IN')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
