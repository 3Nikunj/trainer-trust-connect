
import { useContext, useState } from "react";
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

// Mock review data
const receivedReviews = [
  {
    id: "review1",
    reviewer: {
      id: "company456",
      name: "TechLearn Solutions",
      avatar: "/placeholder.svg",
    },
    jobTitle: "React Advanced Workshop Trainer",
    date: "May 15, 2023",
    rating: 5,
    review: "Alex did an outstanding job with our React training. The team was highly engaged and came away with practical skills they could immediately apply. His expertise and teaching style made complex concepts accessible, and the custom exercises were particularly valuable. Would definitely hire again.",
    categories: {
      expertise: 5,
      communication: 5,
      professionalism: 5,
      curriculum: 4,
      delivery: 5
    }
  },
  {
    id: "review2",
    reviewer: {
      id: "company789",
      name: "Enterprise Cloud Solutions",
      avatar: "/placeholder.svg",
    },
    jobTitle: "AWS Cloud Architecture Workshop",
    date: "April 3, 2023",
    rating: 4,
    review: "Great training session on AWS architecture. Alex demonstrated deep knowledge of the subject matter and handled all questions well. The workshop materials were comprehensive and useful for reference afterward. Some of the advanced topics could have used more time, but overall an excellent training experience.",
    categories: {
      expertise: 5,
      communication: 4,
      professionalism: 5,
      curriculum: 4,
      delivery: 4
    }
  }
];

const givenReviews = [
  {
    id: "review3",
    reviewee: {
      id: "company456",
      name: "TechLearn Solutions",
      avatar: "/placeholder.svg",
    },
    jobTitle: "React Advanced Workshop Trainer",
    date: "May 18, 2023",
    rating: 5,
    review: "Working with TechLearn was a pleasure from start to finish. They provided clear requirements, excellent communication throughout the project, and were responsive to questions. The training facilities and technical setup were perfect. Payment was processed promptly after completion. Highly recommend them as a client.",
    categories: {
      communication: 5,
      requirements: 5,
      support: 5,
      professionalism: 5,
      payment: 5
    }
  }
];

// Mock company data for the dropdown
const mockCompanies = [
  { id: "company456", name: "TechLearn Solutions" },
  { id: "company789", name: "Enterprise Cloud Solutions" },
  { id: "company101", name: "DataDriven Insights" },
  { id: "company202", name: "InnoSoft Academy" },
];

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
    return <Navigate to="/auth" />;
  }

  const handleCategoryRatingChange = (category: string, value: number) => {
    setFormCategories((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmitReview = (values: ReviewFormValues) => {
    // In a real app, you'd send this to your backend
    const selectedCompanyName = mockCompanies.find(
      (company) => company.id === values.companyId
    )?.name;

    // Create a new review object
    const newReview = {
      id: `review-${Date.now()}`,
      reviewee: {
        id: values.companyId,
        name: selectedCompanyName || "Unknown Company",
        avatar: "/placeholder.svg",
      },
      jobTitle: values.jobTitle,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      rating: formRating,
      review: values.review,
      categories: formCategories,
    };

    // Add to given reviews (in a real app, this would be saved to a database)
    givenReviews.push(newReview);

    // Close dialog and show success message
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
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setSelectedCompany(e.target.value);
                              }}
                              value={field.value}
                            >
                              <option value="" disabled>Select a company to review</option>
                              {mockCompanies.map((company) => (
                                <option key={company.id} value={company.id}>
                                  {company.name}
                                </option>
                              ))}
                            </select>
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
                          disabled={!selectedCompany || formRating === 0}
                        >
                          Submit Review
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
                  <RatingStars rating={4.5} />
                  <span className="ml-2 font-bold text-amber-500">4.5</span>
                </div>
              </div>
            </div>

            {/* Reviews Received */}
            <TabsContent value="received" className="space-y-6">
              {receivedReviews.length > 0 ? (
                receivedReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage
                              src={review.reviewer.avatar}
                              alt={review.reviewer.name}
                            />
                            <AvatarFallback>
                              {review.reviewer.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              <a
                                href={`/profile/${review.reviewer.id}`}
                                className="hover:text-brand-600"
                              >
                                {review.reviewer.name}
                              </a>
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {review.jobTitle} • {review.date}
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
                        {Object.entries(review.categories).map(([key, value]) => (
                          <div key={key} className="bg-muted/40 p-2 rounded-md text-center">
                            <p className="capitalize mb-1">{key}</p>
                            <RatingStars rating={value} />
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
              {givenReviews.length > 0 ? (
                givenReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage
                              src={review.reviewee.avatar}
                              alt={review.reviewee.name}
                            />
                            <AvatarFallback>
                              {review.reviewee.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              <a
                                href={`/profile/${review.reviewee.id}`}
                                className="hover:text-brand-600"
                              >
                                {review.reviewee.name}
                              </a>
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {review.jobTitle} • {review.date}
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
                        {Object.entries(review.categories).map(([key, value]) => (
                          <div key={key} className="bg-muted/40 p-2 rounded-md text-center">
                            <p className="capitalize mb-1">{key}</p>
                            <RatingStars rating={value} />
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
