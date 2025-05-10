
import { Review } from "@/types/review";
import { ReviewItem } from "./ReviewItem";
import { ReviewEmptyState } from "./ReviewEmptyState";

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  emptyStateMessage: string;
  emptyStateDescription: string;
  showActionButtons?: boolean;
  showEditButton?: boolean;
}

export const ReviewList = ({
  reviews,
  isLoading,
  emptyStateMessage,
  emptyStateDescription,
  showActionButtons = true,
  showEditButton = false,
}: ReviewListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <ReviewEmptyState 
        message={emptyStateMessage}
        description={emptyStateDescription}
      />
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem 
          key={review.id} 
          review={review} 
          showActionButtons={showActionButtons}
          showEditButton={showEditButton}
        />
      ))}
    </div>
  );
};
