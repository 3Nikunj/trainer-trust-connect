
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { StarRating } from "@/components/reviews/StarRating";
import { useReviews, useReviewableProfiles } from "@/hooks/useReviews";
import { ReviewFormValues } from "@/types/review";

const Reviews = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("received");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  const isCompany = user.role === 'company';
  const targetRole = isCompany ? 'trainer' : 'company';
  
  // Fetch potential reviewees (trainers for companies, companies for trainers)
  const { data: potentialReviewees = [], isLoading: isLoadingProfiles } = useReviewableProfiles(targetRole);

  // Use reviews hooks to get reviews data
  const {
    receivedReviews,
    givenReviews,
    isLoadingReceived,
    isLoadingGiven,
    overallRating,
    createReviewMutation,
  } = useReviews(user.id);

  const handleSubmitReview = (values: ReviewFormValues) => {
    const selectedName = potentialReviewees.find(
      (profile) => profile.id === values.revieweeId
    )?.full_name;

    if (!selectedName) {
      toast({
        title: "Error",
        description: `Please select a valid ${targetRole}`,
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate(
      { 
        ...values,
        userRole: user.role,
        userId: user.id 
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            title: "Review submitted",
            description: "Your review has been successfully submitted.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to submit review: ${error.message}`,
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Reviews</h1>
              <p className="text-muted-foreground">
                View and manage your reviews and feedback
              </p>
            </div>
            
            {/* Add Review Button */}
            <Button 
              className="bg-brand-600 hover:bg-brand-700"
              onClick={() => setIsDialogOpen(true)}
            >
              {isCompany ? 'Give Review to Trainer' : 'Give Review to Company'}
            </Button>
            
            {/* Review Form Dialog */}
            <ReviewForm
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onSubmit={handleSubmitReview}
              potentialReviewees={potentialReviewees}
              isLoadingProfiles={isLoadingProfiles}
              userRole={user.role}
              targetRole={targetRole}
              isPending={createReviewMutation.isPending}
            />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="received">Reviews Received</TabsTrigger>
                <TabsTrigger value="given">Reviews Given</TabsTrigger>
                <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <p className="font-medium">Overall Rating:</p>
                <div className="flex items-center">
                  <StarRating rating={overallRating} />
                  <span className="ml-2 font-bold text-amber-500">{overallRating}</span>
                </div>
              </div>
            </div>

            {/* Reviews Received */}
            <TabsContent value="received" className="space-y-6">
              <ReviewList
                reviews={receivedReviews}
                isLoading={isLoadingReceived}
                emptyStateMessage="No reviews yet"
                emptyStateDescription="You haven't received any reviews yet"
                showActionButtons={true}
                showEditButton={false}
              />
            </TabsContent>

            {/* Reviews Given */}
            <TabsContent value="given" className="space-y-6">
              <ReviewList
                reviews={givenReviews}
                isLoading={isLoadingGiven}
                emptyStateMessage="No reviews given"
                emptyStateDescription="You haven't given any reviews yet"
                showActionButtons={false}
                showEditButton={true}
              />
            </TabsContent>

            {/* Pending Reviews */}
            <TabsContent value="pending">
              <div className="text-center py-12">
                <Star className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">No pending reviews</h3>
                <p className="text-muted-foreground">
                  You don't have any pending reviews to complete
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reviews;
