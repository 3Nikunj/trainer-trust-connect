
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Interface for dashboard stats
interface DashboardStats {
  completedJobs: number;
  averageRating: number;
  unreadMessages: number;
  activeListings?: number;
}

interface UserProps {
  id: string;
  role?: string;
}

export const useDashboardStats = (user: UserProps, isCompany: boolean) => {
  const [stats, setStats] = useState<DashboardStats>({
    completedJobs: 0,
    averageRating: 0,
    unreadMessages: 0,
    activeListings: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Applications count for trainers / Active listings for companies
        const { count: applicationsCount } = isCompany
          ? await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('company_id', user.id)
          : await supabase.from('job_applications').select('*', { count: 'exact', head: true }).eq('trainer_id', user.id);

        // Get ratings
        const { data: reviewsData, error: reviewsError } = isCompany
          ? await supabase.from('reviews').select('rating').eq('reviewee_id', user.id)
          : await supabase.from('reviews').select('rating').eq('reviewer_id', user.id);

        // Calculate average rating
        let avgRating = 0;
        if (reviewsData && reviewsData.length > 0) {
          avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
          avgRating = Math.round(avgRating * 10) / 10; // Round to 1 decimal place
        }

        // For now, unread messages is a placeholder
        const unreadMessages = 0;

        // Update stats
        setStats({
          completedJobs: isCompany ? applicationsCount || 0 : applicationsCount || 0,
          averageRating: avgRating,
          unreadMessages: unreadMessages,
          activeListings: isCompany ? applicationsCount || 0 : undefined
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user, isCompany]);

  return { stats, loading };
};
