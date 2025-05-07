
import { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getJobs } from "@/lib/jobs";

// Import dashboard components
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ApplicationsTab } from "@/components/dashboard/ApplicationsTab";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { JobListingsTab } from "@/components/dashboard/JobListingsTab";
import { ApplicantsTab } from "@/components/dashboard/ApplicantsTab";

// Interface for dashboard stats
interface DashboardStats {
  completedJobs: number;
  averageRating: number;
  unreadMessages: number;
  activeListings?: number;
}

// Interface for activity/application
interface Activity {
  id: string;
  title: string;
  company?: string;
  status: string;
  date: string;
  type: 'application' | 'job' | 'message';
  trainerId?: string; // Added trainerId for linking to trainer profiles
  jobId?: string; // Added jobId for filtering applicants by job
}

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [stats, setStats] = useState<DashboardStats>({
    completedJobs: 0,
    averageRating: 0,
    unreadMessages: 0,
    activeListings: 0
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobApplicants, setJobApplicants] = useState<any[]>([]);
  const isCompany = user?.role === "company";

  // Fetch jobs data using React Query
  const { data: jobsData } = useQuery({
    queryKey: ['jobs', user?.id],
    queryFn: () => getJobs(isCompany, user?.id),
    enabled: !!user
  });

  // Fetch applicants for a selected job
  useEffect(() => {
    const fetchJobApplicants = async () => {
      if (!selectedJobId) {
        setJobApplicants([]);
        return;
      }

      try {
        // Query with proper join - accessing profiles properly
        const { data: applications, error } = await supabase
          .from('job_applications')
          .select(`
            id,
            status,
            created_at,
            cover_note,
            trainer_id,
            profiles:trainer_id(id, full_name, title, avatar_url)
          `)
          .eq('job_id', selectedJobId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (applications) {
          setJobApplicants(applications.map(app => ({
            id: app.id,
            trainerId: app.trainer_id,
            trainerName: app.profiles?.full_name || 'Unknown',
            trainerTitle: app.profiles?.title || 'Trainer',
            avatar: app.profiles?.avatar_url,
            status: app.status,
            date: new Date(app.created_at).toLocaleDateString(),
            coverNote: app.cover_note
          })));
        }
      } catch (error) {
        console.error('Error fetching job applicants:', error);
      }
    };

    if (isCompany && selectedJobId) {
      fetchJobApplicants();
    }
  }, [selectedJobId, isCompany]);

  // Fetch stats data
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

        // Fetch recent activity
        await fetchRecentActivity();
        
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

  // Fetch recent activity (jobs/applications)
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

  // Data for performance chart
  const performanceData = [
    { month: 'Jan', applications: 4, interviews: 2 },
    { month: 'Feb', applications: 7, interviews: 3 },
    { month: 'Mar', applications: 5, interviews: 4 },
    { month: 'Apr', applications: 10, interviews: 6 },
    { month: 'May', applications: 8, interviews: 5 },
  ];

  // Handle job selection for viewing applicants
  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId === selectedJobId ? null : jobId);
  };

  if (!user) {
    return <Navigate to="/auth" />;
  }

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
      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Welcome back, {user.name || "User"}!
              </p>
            </div>
            {isCompany && (
              <Button className="bg-brand-600 hover:bg-brand-700" size="sm">
                <Link to="/create-job" className="text-white">Post New Job</Link>
              </Button>
            )}
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {!isCompany ? (
                <>
                  <TabsTrigger value="applications">My Applications</TabsTrigger>
                  <TabsTrigger value="stats">Performance</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="jobs">My Job Listings</TabsTrigger>
                  <TabsTrigger value="applicants">Applicants</TabsTrigger>
                </>
              )}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <DashboardStats 
                completedJobs={stats.completedJobs}
                averageRating={stats.averageRating}
                unreadMessages={stats.unreadMessages}
                activeListings={stats.activeListings}
                isCompany={isCompany}
              />
              <RecentActivity 
                activities={recentActivity}
                isCompany={isCompany}
                jobsData={jobsData}
              />
            </TabsContent>
            
            <TabsContent value="applications">
              <ApplicationsTab 
                loading={loading}
                activities={recentActivity}
                jobsData={jobsData}
              />
            </TabsContent>
            
            <TabsContent value="stats">
              <PerformanceChart data={performanceData} />
            </TabsContent>

            <TabsContent value="jobs">
              <JobListingsTab 
                loading={loading}
                jobsData={jobsData || []}
                jobApplicants={jobApplicants}
                selectedJobId={selectedJobId}
                onJobSelect={handleJobSelect}
              />
            </TabsContent>
            
            <TabsContent value="applicants">
              <ApplicantsTab 
                loading={loading}
                activities={recentActivity}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
