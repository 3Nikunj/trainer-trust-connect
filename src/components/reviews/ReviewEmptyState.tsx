
import { Star } from "lucide-react";

interface ReviewEmptyStateProps {
  message: string;
  description: string;
}

export const ReviewEmptyState = ({ message, description }: ReviewEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Star className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-medium">{message}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
