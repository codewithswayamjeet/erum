import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Quote } from 'lucide-react';
import StarRating from './StarRating';

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const ProductReviews = ({ reviews, averageRating, totalReviews }: ProductReviewsProps) => {
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const displayedReviews = sortedReviews.slice(0, visibleReviews);

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
    percentage: (reviews.filter((r) => Math.round(r.rating) === stars).length / totalReviews) * 100,
  }));

  return (
    <div>
      {/* Summary Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-12 pb-12 border-b border-border">
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <h3 className="font-serif text-2xl mb-6">Customer Reviews</h3>
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <span className="text-5xl font-serif">{averageRating.toFixed(1)}</span>
            <div>
              <StarRating rating={averageRating} size={20} />
              <p className="text-sm text-muted-foreground mt-1">
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm w-12">{stars} star</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 * (5 - stars) }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-muted-foreground">
          Showing {displayedReviews.length} of {totalReviews} reviews
        </p>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="appearance-none px-4 py-2 pr-10 bg-secondary border border-border text-sm focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="border-b border-border pb-8 last:border-0"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <StarRating rating={review.rating} size={14} />
                    {review.verified && (
                      <span className="text-xs font-medium tracking-wider uppercase text-primary">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-lg">{review.title}</h4>
                </div>
                <Quote className="w-8 h-8 text-primary/20 flex-shrink-0" />
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                {review.content}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{review.author}</span>
                <span>•</span>
                <span>{review.location}</span>
                <span>•</span>
                <span>{new Date(review.date).toLocaleDateString('en-IN', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {visibleReviews < totalReviews && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setVisibleReviews((prev) => Math.min(prev + 3, totalReviews))}
          className="mt-8 w-full py-4 border border-border text-sm font-medium tracking-luxury uppercase hover:border-primary hover:text-primary transition-colors"
        >
          Load More Reviews
        </motion.button>
      )}
    </div>
  );
};

export default ProductReviews;
