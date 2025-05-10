
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
}

export const StarRating = ({ rating, onRatingChange }: StarRatingProps) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
          } ${onRatingChange ? "cursor-pointer" : ""}`}
          onClick={() => onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );
};
