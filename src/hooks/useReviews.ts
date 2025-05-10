
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { asUUID } from "@/utils/supabaseHelpers";
import { Review, ReviewFormValues } from "@/types/review";

export const useReviews = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // Fetch reviews where user is the reviewee (reviews received)
  const {
    data: receivedReviews = [],
    isLoading: isLoadingReceived,
  } = useQuery({
    queryKey: ['receivedReviews', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewee_id', asUUID(userId));
      
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

          const categories: Record<string, number> = {};
          
          // Load the appropriate category ratings based on reviewer role
          if (review.reviewer_id !== userId) {
            const { data: reviewerProfile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', review.reviewer_id)
              .single();
              
            const reviewerRole = reviewerProfile?.role;
            
            // Populate categories based on reviewer role
            if (reviewerRole === 'company') {
              // Company reviewing a trainer
              categories.expertise = review.rating_expertise || 0;
              categories.communication = review.rating_communication || 0;
              categories.professionalism = review.rating_professionalism || 0;
              categories.curriculum = review.rating_curriculum || 0;
              categories.delivery = review.rating_delivery || 0;
            } else {
              // Trainer reviewing a company
              categories.communication = review.rating_communication || 0;
              categories.requirements = review.rating_requirements || 0;
              categories.support = review.rating_support || 0;
              categories.professionalism = review.rating_professionalism || 0;
              categories.payment = review.rating_payment || 0;
            }
          }

          return {
            ...review,
            reviewerName: reviewerData?.full_name || 'Unknown User',
            reviewerAvatar: reviewerData?.avatar_url || '/placeholder.svg',
            categories
          };
        })
      );

      return reviewsWithNames;
    },
    enabled: !!userId,
  });

  // Fetch reviews where user is the reviewer (reviews given)
  const {
    data: givenReviews = [],
    isLoading: isLoadingGiven,
  } = useQuery({
    queryKey: ['givenReviews', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewer_id', asUUID(userId));
      
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
            
          const categories: Record<string, number> = {};
          
          // Get reviewer's role
          const { data: reviewerProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', review.reviewer_id)
            .single();
            
          const reviewerRole = reviewerProfile?.role;
          
          // Populate categories based on reviewer's role
          if (reviewerRole === 'company') {
            // Company reviewing a trainer
            categories.expertise = review.rating_expertise || 0;
            categories.communication = review.rating_communication || 0;
            categories.professionalism = review.rating_professionalism || 0;
            categories.curriculum = review.rating_curriculum || 0;
            categories.delivery = review.rating_delivery || 0;
          } else {
            // Trainer reviewing a company
            categories.communication = review.rating_communication || 0;
            categories.requirements = review.rating_requirements || 0;
            categories.support = review.rating_support || 0;
            categories.professionalism = review.rating_professionalism || 0;
            categories.payment = review.rating_payment || 0;
          }

          return {
            ...review,
            revieweeName: revieweeData?.full_name || 'Unknown User',
            revieweeAvatar: revieweeData?.avatar_url || '/placeholder.svg',
            categories
          };
        })
      );

      return reviewsWithNames;
    },
    enabled: !!userId,
  });

  // Calculate overall rating from received reviews
  const calculateOverallRating = () => {
    if (!receivedReviews || receivedReviews.length === 0) return 0;
    
    const sum = receivedReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / receivedReviews.length) * 10) / 10; // Round to 1 decimal place
  };

  const overallRating = calculateOverallRating();

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async (values: ReviewFormValues & { userRole: string | null, userId: string }) => {
      const { userRole, userId, revieweeId, jobTitle, review, rating, categories } = values;
      
      const reviewData: any = {
        reviewer_id: asUUID(userId),
        reviewee_id: asUUID(revieweeId),
        job_title: jobTitle,
        rating: rating,
        review: review,
      };
      
      // Add category ratings based on user role
      if (userRole === 'company') {
        // Company reviewing trainer
        reviewData.rating_expertise = categories.expertise || 0;
        reviewData.rating_communication = categories.communication || 0;
        reviewData.rating_professionalism = categories.professionalism || 0;
        reviewData.rating_curriculum = categories.curriculum || 0;
        reviewData.rating_delivery = categories.delivery || 0;
      } else {
        // Trainer reviewing company
        reviewData.rating_communication = categories.communication || 0;
        reviewData.rating_requirements = categories.requirements || 0;
        reviewData.rating_support = categories.support || 0;
        reviewData.rating_professionalism = categories.professionalism || 0;
        reviewData.rating_payment = categories.payment || 0;
      }
      
      const { error } = await supabase.from('reviews').insert([reviewData]);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['givenReviews'] });
      queryClient.invalidateQueries({ queryKey: ['receivedReviews'] });
    },
  });

  return {
    receivedReviews,
    givenReviews,
    isLoadingReceived,
    isLoadingGiven,
    overallRating,
    createReviewMutation,
  };
};

export const useReviewableProfiles = (targetRole: string) => {
  return useQuery({
    queryKey: ['profiles', targetRole],
    queryFn: async () => {
      console.log(`Fetching ${targetRole} profiles...`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, avatar_url')
        .eq('role', targetRole);
      
      if (error) {
        console.error(`Error fetching ${targetRole} profiles:`, error);
        throw new Error(error.message);
      }
      
      console.log(`${targetRole} profiles fetched:`, data);
      return data || [];
    },
  });
};
