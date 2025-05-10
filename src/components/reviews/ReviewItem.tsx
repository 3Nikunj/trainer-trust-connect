
import { Review } from "@/types/review";
import { StarRating } from "./StarRating";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Flag } from "lucide-react";
import { getCategoryDescription } from "@/utils/supabaseHelpers";

interface ReviewItemProps {
  review: Review;
  showActionButtons?: boolean;
  showEditButton?: boolean;
}

export const ReviewItem = ({ review, showActionButtons = true, showEditButton = false }: ReviewItemProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage
                src={review.reviewerAvatar || review.revieweeAvatar}
                alt={review.reviewerName || review.revieweeName || "User"}
              />
              <AvatarFallback>
                {(review.reviewerName?.slice(0, 2) || review.revieweeName?.slice(0, 2) || "UN").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                <span className="hover:text-brand-600">
                  {review.reviewerName || review.revieweeName}
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                {review.job_title} • {new Date(review.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <StarRating rating={review.rating} />
            <span className="font-bold ml-2">{review.rating}.0</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{review.review}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {review.categories && Object.entries(review.categories).filter(([, value]) => value).map(([key, value]) => (
            <div key={key} className="bg-muted/40 p-2 rounded-md text-center">
              <div className="mb-1">
                <p className="capitalize">{key}</p>
                <p className="text-[10px] text-muted-foreground">{getCategoryDescription(key)}</p>
              </div>
              <StarRating rating={value || 0} />
            </div>
          ))}
        </div>
        
        {showActionButtons && (
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="flex items-center text-xs h-8 px-2">
                <ThumbsUp className="h-3 w-3 mr-1" />
                Helpful
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center text-xs h-8 px-2">
                <MessageSquare className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center text-xs h-8 px-2 text-muted-foreground">
              <Flag className="h-3 w-3 mr-1" />
              Report
            </Button>
          </div>
        )}
        
        {showEditButton && (
          <div className="flex justify-end items-center pt-2">
            <Button variant="outline" size="sm">
              Edit Review
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
