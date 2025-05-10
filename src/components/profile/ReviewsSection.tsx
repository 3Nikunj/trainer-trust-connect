
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Review } from "@/types/profile";
import { getCategoryDescription } from "@/utils/supabaseHelpers";

interface ReviewsSectionProps {
  reviews?: Review[];
  isOwnProfile: boolean;
}

// StarRating component
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <Star className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400/30" />
      ))}
    </div>
  );
};

export const ReviewsSection = ({ reviews, isOwnProfile }: ReviewsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Reviews</CardTitle>
        <CardDescription>
          What others are saying
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.author} />
                      <AvatarFallback>{review.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.author}</p>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.content}</p>
                
                {/* Display categories dynamically based on what's available in the review */}
                {review.categories && Object.keys(review.categories).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
                    {Object.entries(review.categories)
                      .filter(([, value]) => value > 0) // Only show categories with ratings
                      .map(([key, value]) => (
                        <div key={key} className="bg-muted/40 p-2 rounded-md text-center">
                          <div className="mb-1">
                            <p className="capitalize text-xs font-medium">{key}</p>
                            <p className="text-[10px] text-muted-foreground">{getCategoryDescription(key)}</p>
                          </div>
                          <StarRating rating={value} />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 text-yellow-400 opacity-30" />
            <p>No reviews yet</p>
          </div>
        )}
        
        {!isOwnProfile && (
          <div className="mt-6 pt-4 border-t">
            <Button variant="outline" className="w-full" onClick={() => window.location.href = "/reviews"}>
              <Star className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
