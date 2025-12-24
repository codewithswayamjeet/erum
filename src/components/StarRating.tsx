import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

const StarRating = ({ rating, size = 16, showValue = false }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= rating
                ? 'fill-primary text-primary'
                : star - 0.5 <= rating
                ? 'fill-primary/50 text-primary'
                : 'fill-transparent text-border'
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1">({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

export default StarRating;
