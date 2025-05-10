
import { useState } from "react";
import { Profile } from "@/types/review";
import { useForm } from "react-hook-form";
import { Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StarRating } from "./StarRating";
import { getCategoryDescription, getReviewCategories, getReviewCategoryFields } from "@/utils/supabaseHelpers";

export interface ReviewFormValues {
  revieweeId: string;
  jobTitle: string;
  review: string;
  rating: number;
  categories: Record<string, number>;
}

interface ReviewFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ReviewFormValues) => void;
  potentialReviewees: Profile[];
  isLoadingProfiles: boolean;
  userRole: string | null;
  targetRole: string;
  isPending: boolean;
}

export const ReviewForm = ({
  isOpen,
  onOpenChange,
  onSubmit,
  potentialReviewees,
  isLoadingProfiles,
  userRole,
  targetRole,
  isPending,
}: ReviewFormProps) => {
  const [selectedReviewee, setSelectedReviewee] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formCategories, setFormCategories] = useState<Record<string, number>>(
    getReviewCategories(userRole)
  );

  const form = useForm<ReviewFormValues>({
    defaultValues: {
      revieweeId: "",
      jobTitle: "",
      review: "",
      rating: 0,
      categories: getReviewCategories(userRole),
    },
  });

  const handleCategoryRatingChange = (category: string, value: number) => {
    setFormCategories((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = (values: ReviewFormValues) => {
    const dataToSubmit = { ...values, rating: formRating, categories: formCategories };
    onSubmit(dataToSubmit);
  };

  const debugProfiles = () => {
    console.log("Profiles in state:", potentialReviewees);
    console.log("Loading state:", isLoadingProfiles);
  };

  const categoryFields = getReviewCategoryFields(userRole);
  const isCompany = userRole === 'company';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Submit a Review</DialogTitle>
          <DialogDescription>
            Share your experience working with this {targetRole}. Your feedback helps others.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="revieweeId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select {targetRole}</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedReviewee(value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select a ${targetRole} to review`} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingProfiles ? (
                        <SelectItem value="loading" disabled>Loading profiles...</SelectItem>
                      ) : potentialReviewees && potentialReviewees.length > 0 ? (
                        potentialReviewees.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.full_name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No {targetRole}s registered</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {/* Debug button */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        type="button" 
                        onClick={debugProfiles} 
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
                        <p className="font-semibold">Profiles Data:</p>
                        <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-48">
                          {JSON.stringify(potentialReviewees, null, 2)}
                        </pre>
                        <p>Loading: {isLoadingProfiles ? "Yes" : "No"}</p>
                        <p>Profiles Count: {potentialReviewees?.length || 0}</p>
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
                      placeholder={`e.g. ${isCompany ? 'React Workshop Trainer' : 'Corporate Training Project'}`}
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
                <StarRating rating={formRating} onRatingChange={setFormRating} />
                {formRating > 0 && <span className="font-semibold">{formRating}.0</span>}
              </div>
            </div>
            
            <div className="space-y-4">
              <FormLabel>Rate Your Experience</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFields.map((category) => (
                  <div key={category} className="space-y-2 bg-muted/40 p-3 rounded-md">
                    <div className="flex flex-col">
                      <p className="capitalize text-sm font-medium">{category}</p>
                      <p className="text-xs text-muted-foreground">{getCategoryDescription(category)}</p>
                    </div>
                    <StarRating
                      rating={formCategories[category] || 0}
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
                      placeholder={`Share your experience working with this ${targetRole}...`}
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
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-brand-600 hover:bg-brand-700"
                disabled={!selectedReviewee || formRating === 0 || isPending}
              >
                {isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
