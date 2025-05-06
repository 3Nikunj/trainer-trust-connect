
import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Flag, Info } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Rating stars component
const RatingStars = ({ rating, onRatingChange }: { rating: number, onRatingChange?: (rating: number) => void }) => {
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

// Types
type Company = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Review = {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  job_title: string;
  rating: number;
  review: string;
  created_at: string;
  categories?: {
    communication?: number;
    requirements?: number;
    support?: number;
    professionalism?: number;
    payment?: number;
    expertise?: number;
    curriculum?: number;
    delivery?: number;
  };
  reviewerName?: string;
  revieweeName?: string;
  reviewerAvatar?: string;
  revieweeAvatar?: string;
};

// Review form type
type ReviewFormValues = {
  companyId: string;
  jobTitle: string;
  review: string;
  rating: number;
  categories: {
    communication: number;
    requirements: number;
    support: number;
    professionalism: number;
    payment: number;
  };
};

const Reviews = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("received");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formCategories, setFormCategories] = useState({
    communication: 0,
    requirements: 0,
    support: 0,
    professionalism: 0,
    payment: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ReviewFormValues>({
    defaultValues: {
      companyId: "",
      jobTitle: "",
      review: "",
      rating: 0,
      categories: {
        communication: 0,
        requirements: 0,
        support: 0,
        professionalism: 0,
        payment: 0,
      },
    },
  });
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Fetch registered companies - Debug the issue
  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('Fetching companies...');
      
      // Use the get_companies RPC function that was created in the SQL migration
      const { data, error } = await supabase.rpc('get_companies');
      
      if (error) {
        console.error('Error fetching companies:', error);
        throw new Error(error.message);
      }
      
      console.log('Companies fetched:', data);
      return data as Company[];
    },
  });

  // Fetch reviews where user is the reviewee (reviews received)
  const { data: receivedReviews = [], isLoading: isLoadingReceived } = useQuery({
    queryKey: ['receivedReviews', user?.id],
    queryFn: async () => {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewee_id', user.id);
      
      if (error) {
        console.error('Error fetching received reviews:', error);
        return [];
      }

      // Fetch reviewer names
      const reviewsWithNames = await Promise.all(
        reviews.map(async (review) => {
          // Get reviewer info
          const { data: reviewerData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', review.reviewer_id)
            .single();

          return {
            ...review,
            reviewerName: reviewerData?.full_name || 'Unknown User',
            reviewerAvatar: reviewerData?.avatar_url || '/placeholder.svg',
            categories: {
              expertise: review.rating_expertise,
              communication: review.rating_communication,
              professionalism: review.rating_professionalism,
              curriculum: review.rating_curriculum,
              delivery: review.rating_delivery,
            }
          };
        })
      );

      return reviewsWithNames;
    },
  });

  // Fetch reviews where user is the reviewer (reviews given)
  const { data: givenReviews = [], isLoading: isLoadingGiven } = useQuery({
    queryKey: ['givenReviews', user?.id],
    queryFn: async () => {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewer_id', user.id);
      
      if (error) {
        console.error('Error fetching given reviews:', error);
        return [];
      }

      // Fetch reviewee names
      const reviewsWithNames = await Promise.all(
        reviews.map(async (review) => {
          // Get reviewee info
          const { data: revieweeData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', review.reviewee_id)
            .single();

          return {
            ...review,
            revieweeName: revieweeData?.full_name || 'Unknown User',
            revieweeAvatar: revieweeData?.avatar_url || '/placeholder.svg',
            categories: {
              communication: review.rating_communication,
              requirements: review.rating_requirements,
              support: review.rating_support,
              professionalism: review.rating_professionalism,
              payment: review.rating_payment,
            }
          };
        })
      );

      return reviewsWithNames;
    },
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: {
      reviewee_id: string;
      job_title: string;
      rating: number;
      review: string;
      rating_communication: number;
      rating_requirements: number;
      rating_support: number;
      rating_professionalism: number;
      rating_payment: number;
    }) => {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          reviewer_id: user.id,
          ...reviewData
        }]);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['givenReviews'] });
      queryClient.invalidateQueries({ queryKey: ['receivedReviews'] });
      setIsDialogOpen(false);
      toast({
        title: "Review submitted",
        description: "Your review has been successfully submitted.",
      });
      
      // Reset form
      form.reset();
      setFormRating(0);
      setFormCategories({
        communication: 0,
        requirements: 0,
        support: 0,
        professionalism: 0,
        payment: 0,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to submit review: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleCategoryRatingChange = (category: string, value: number) => {
    setFormCategories((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmitReview = (values: ReviewFormValues) => {
    const selectedCompanyName = companies.find(
      (company) => company.id === values.companyId
    )?.name;

    if (!selectedCompanyName) {
      toast({
        title: "Error",
        description: "Please select a valid company",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      reviewee_id: values.companyId,
      job_title: values.jobTitle,
      rating: formRating,
      review: values.review,
      rating_communication: formCategories.communication,
      rating_requirements: formCategories.requirements,
      rating_support: formCategories.support,
      rating_professionalism: formCategories.professionalism,
      rating_payment: formCategories.payment,
    });
  };

  // Calculate overall rating from received reviews
  const calculateOverallRating = () => {
    if (!receivedReviews || receivedReviews.length === 0) return 0;
    
    const sum = receivedReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / receivedReviews.length) * 10) / 10; // Round to 1 decimal place
  };

  const overallRating = calculateOverallRating();

  // Add helper to debug companies dropdown
  const debugCompanies = () => {
    console.log("Companies in state:", companies);
    console.log("Loading state:", isLoadingCompanies);
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
            
            {/* Add Review Button (only visible for trainers) */}
            {user.role === "trainer" && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-600 hover:bg-brand-700">
                    Give Review to Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Submit a Review</DialogTitle>
                    <DialogDescription>
                      Share your experience working with this company. Your feedback helps other trainers.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmitReview)} className="space-y-6 py-4">
                      <FormField
                        control={form.control}
                        name="companyId"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Select Company</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedCompany(value);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a company to review" />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoadingCompanies ? (
                                  <SelectItem value="loading" disabled>Loading companies...</SelectItem>
                                ) : companies && companies.length > 0 ? (
                                  companies.map((company) => (
                                    <SelectItem key={company.id} value={company.id}>
                                      {company.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="none" disabled>No companies registered</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            {/* Debug button */}
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button 
                                  type="button" 
                                  onClick={debugCompanies} 
                                  variant="outline" 
                                  size="sm" 
                                  className="mt-2 w-fit self-end"
                                >
                                  <Info className="h-4 w-4 mr-1" />
                                  Debug Info
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-96">
                                <div className="space-y-2">
                                  <p className="font-semibold">Companies Data:</p>
                                  <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-48">
                                    {JSON.stringify(companies, null, 2)}
                                  </pre>
                                  <p>Loading: {isLoadingCompanies ? "Yes" : "No"}</p>
                                  <p>Companies Count: {companies?.length || 0}</p>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title or Workshop</FormLabel>
                            <FormControl>
                              <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g. React Advanced Workshop Trainer"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <FormLabel>Overall Rating</FormLabel>
                        <div className="flex items-center gap-2">
                          <RatingStars rating={formRating} onRatingChange={setFormRating} />
                          {formRating > 0 && <span className="font-semibold">{formRating}.0</span>}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <FormLabel>Rate Your Experience</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.keys(formCategories).map((category) => (
                            <div key={category} className="space-y-2 bg-muted/40 p-3 rounded-md">
                              <p className="capitalize text-sm">{category}</p>
                              <RatingStars
                                rating={formCategories[category as keyof typeof formCategories]}
                                onRatingChange={(rating) => handleCategoryRatingChange(category, rating)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="review"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Review</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Share your experience working with this company..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-brand-600 hover:bg-brand-700"
                          disabled={!selectedCompany || formRating === 0 || createReviewMutation.isPending}
                        >
                          {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
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
                  <RatingStars rating={overallRating} />
                  <span className="ml-2 font-bold text-amber-500">{overallRating}</span>
                </div>
              </div>
            </div>

            {/* Reviews Received */}
            <TabsContent value="received" className="space-y-6">
              {isLoadingReceived ? (
                <div className="text-center py-12">
                  <p>Loading reviews...</p>
                </div>
              ) : receivedReviews.length > 0 ? (
                receivedReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage
                              src={review.reviewerAvatar}
                              alt={review.reviewerName}
                            />
                            <AvatarFallback>
                              {review.reviewerName?.slice(0, 2).toUpperCase() || "UN"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              <span className="hover:text-brand-600">
                                {review.reviewerName}
                              </span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {review.job_title} • {new Date(review.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <RatingStars rating={review.rating} />
                          <span className="font-bold ml-2">{review.rating}.0</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{review.review}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                        {review.categories && Object.entries(review.categories).filter(([, value]) => value).map(([key, value]) => (
                          <div key={key} className="bg-muted/40 p-2 rounded-md text-center">
                            <p className="capitalize mb-1">{key}</p>
                            <RatingStars rating={value || 0} />
                          </div>
                        ))}
                      </div>
                      
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
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    You haven't received any reviews yet
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Reviews Given */}
            <TabsContent value="given" className="space-y-6">
              {isLoadingGiven ? (
                <div className="text-center py-12">
                  <p>Loading reviews...</p>
                </div>
              ) : givenReviews.length > 0 ? (
                givenReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage
                              src={review.revieweeAvatar}
                              alt={review.revieweeName}
                            />
                            <AvatarFallback>
                              {review.revieweeName?.slice(0, 2).toUpperCase() || "UN"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              <span className="hover:text-brand-600">
                                {review.revieweeName}
                              </span>
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {review.job_title} • {new Date(review.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <RatingStars rating={review.rating} />
                          <span className="font-bold ml-2">{review.rating}.0</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{review.review}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                        {review.categories && Object.entries(review.categories).filter(([, value]) => value).map(([key, value]) => (
                          <div key={key} className="bg-muted/40 p-2 rounded-md text-center">
                            <p className="capitalize mb-1">{key}</p>
                            <RatingStars rating={value || 0} />
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end items-center pt-2">
                        <Button variant="outline" size="sm">
                          Edit Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">No reviews given</h3>
                  <p className="text-muted-foreground">
                    You haven't given any reviews yet
                  </p>
                </div>
              )}
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
