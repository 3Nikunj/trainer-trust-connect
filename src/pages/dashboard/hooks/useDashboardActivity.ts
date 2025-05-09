
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Interface for activity/application
interface Activity {
  id: string;
  title: string;
  company?: string;
  status: string;
  date: string;
  type: 'application' | 'job' | 'message';
  trainerId?: string;
  jobId?: string;
}

interface UserProps {
  id: string;
  role?: string;
}

export const useDashboardActivity = (user: UserProps, isCompany: boolean) => {
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) return;

      try {
        let activity: Activity[] = [];

        if (isCompany) {
          // For companies, show recent applications to their job listings
          const { data: applications } = await supabase
            .from('job_applications')
            .select(`
              id,
              status,
              created_at,
              trainer_id,
              job_id,
              jobs!inner(title, company),
              profiles!inner(full_name)
            `)
            .eq('jobs.company_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (applications) {
            activity = applications.map((app: any) => ({
              id: app.id,
              title: `${app.profiles.full_name} applied to "${app.jobs.title}"`,
              status: app.status,
              date: new Date(app.created_at).toLocaleDateString(),
              type: 'application',
              trainerId: app.trainer_id,
              jobId: app.job_id
            }));
          }
        } else {
          // For trainers, show their job applications
          const { data: applications } = await supabase
            .from('job_applications')
            .select(`
              id,
              status,
              created_at,
              jobs!inner(title, company, company_id)
            `)
            .eq('trainer_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (applications) {
            activity = applications.map((app: any) => ({
              id: app.id,
              title: `You applied to "${app.jobs.title}" at ${app.jobs.company}`,
              status: app.status,
              date: new Date(app.created_at).toLocaleDateString(),
              type: 'application',
              jobId: app.jobs.company_id
            }));
          }
        }

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    };

    if (user) {
      fetchRecentActivity();
    }
  }, [user, isCompany]);

  return { recentActivity };
};
