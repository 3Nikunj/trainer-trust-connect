
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useJobApplicants } from "./hooks/useJobApplicants";
import { useDashboardStats } from "./hooks/useDashboardStats";
import { useDashboardActivity } from "./hooks/useDashboardActivity";
import { usePerformanceData } from "./hooks/usePerformanceData";

// Interface for user
interface UserProps {
  id: string;
  name?: string;
  role?: string;
}

export const DashboardTabs = ({ user }: { user: UserProps }) => {
  const isCompany = user?.role === "company";
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // Fetch jobs data using React Query
  const { data: jobsData } = useQuery({
    queryKey: ['jobs', user?.id],
    queryFn: () => getJobs(isCompany, user?.id),
    enabled: !!user
  });

  // Get applicants for selected job
  const { jobApplicants } = useJobApplicants(selectedJobId, isCompany);
  
  // Get dashboard stats and activity
  const { stats, loading } = useDashboardStats(user, isCompany);
  const { recentActivity } = useDashboardActivity(user, isCompany);
  
  // Get performance data
  const { performanceData, loading: performanceLoading } = usePerformanceData(user?.id);
  
  // Handle job selection for viewing applicants
  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId === selectedJobId ? null : jobId);
  };

  // Ensure activities are properly formatted for display
  // This helps prevent DOM nesting issues
  const safeActivities = recentActivity.map(activity => ({
    ...activity,
    // Ensure these are strings, not complex elements that might cause nesting issues
    title: typeof activity.title === 'string' ? activity.title : String(activity.title),
    status: typeof activity.status === 'string' ? activity.status : String(activity.status)
  }));

  return (
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
          activities={safeActivities}
          isCompany={isCompany}
          jobsData={jobsData}
        />
      </TabsContent>
      
      <TabsContent value="applications">
        <ApplicationsTab 
          loading={loading}
          activities={safeActivities} 
          jobsData={jobsData}
        />
      </TabsContent>
      
      <TabsContent value="stats">
        <PerformanceChart data={performanceData} loading={performanceLoading} />
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
          activities={safeActivities}
        />
      </TabsContent>
    </Tabs>
  );
};
