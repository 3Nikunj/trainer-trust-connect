import { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getJobs } from "@/lib/jobs";
import { Activity, Briefcase, MessageSquare, Star } from "lucide-react";

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
  const isCompany = user?.role === "company";

  // Fetch jobs data using React Query
  const { data: jobsData } = useQuery({
    queryKey: ['jobs', user?.id],
    queryFn: () => getJobs(isCompany, user?.id),
    enabled: !!user
  });

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
            type: 'application'
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
            jobs!inner(title, company)
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
            type: 'application'
          }));
        }
      }

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  // Function to extract company ID from job titles for recent activities
  const extractCompanyIdFromActivity = (activity, jobsData) => {
    if (!activity || !jobsData) return null;
    
    // For companies looking at applicants, we don't need to extract
    if (activity.type === 'job') return activity.id;
    
    // For applications, try to find the job in jobsData
    const jobMatch = jobsData.find(job => 
      activity.title.includes(job.title)
    );
    
    return jobMatch ? jobMatch.companyId : null;
  };

  // Data for performance chart
  const performanceData = [
    { month: 'Jan', applications: 4, interviews: 2 },
    { month: 'Feb', applications: 7, interviews: 3 },
    { month: 'Mar', applications: 5, interviews: 4 },
    { month: 'Apr', applications: 10, interviews: 6 },
    { month: 'May', applications: 8, interviews: 5 },
  ];

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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isCompany ? "Active Listings" : "Job Applications"}
                    </CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.completedJobs}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.completedJobs > 0 
                        ? `${isCompany ? 'Active job listings' : 'Applications submitted'}`
                        : 'No active applications'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isCompany ? "Average Rating" : "Review Score"}
                    </CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.averageRating > 0 ? stats.averageRating : '-'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.averageRating > 0 
                        ? `Based on ${isCompany ? 'trainer' : 'company'} reviews` 
                        : 'No reviews yet'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Messages</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.unreadMessages > 0 
                        ? 'Unread messages' 
                        : 'No unread messages'}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    {isCompany 
                      ? "Recent applications to your job listings" 
                      : "Your recent job applications and updates"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => {
                        const jobInfo = activity.title.match(/applied to "(.+)" at (.+)$/);
                        const companyId = extractCompanyIdFromActivity(activity, jobsData);
                        
                        return (
                          <TableRow key={activity.id}>
                            <TableCell>{jobInfo ? jobInfo[1] : activity.title}</TableCell>
                            <TableCell>
                              {jobInfo && companyId ? (
                                <Link to={`/profile/${companyId}`} className="text-brand-600 hover:underline">
                                  {jobInfo[2]}
                                </Link>
                              ) : (
                                jobInfo ? jobInfo[2] : '-'
                              )}
                            </TableCell>
                            <TableCell>{activity.date}</TableCell>
                            <TableCell className="capitalize">{activity.status}</TableCell>
                          </TableRow>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity to display.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>My Job Applications</CardTitle>
                  <CardDescription>
                    Track your recent job applications and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm">Loading applications...</p>
                  ) : recentActivity.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Date Applied</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentActivity.map((activity) => {
                          const jobInfo = activity.title.match(/applied to "(.+)" at (.+)$/);
                          const companyId = extractCompanyIdFromActivity(activity, jobsData);
                          
                          return (
                            <TableRow key={activity.id}>
                              <TableCell>{jobInfo ? jobInfo[1] : activity.title}</TableCell>
                              <TableCell>
                                {jobInfo && companyId ? (
                                  <Link to={`/profile/${companyId}`} className="text-brand-600 hover:underline">
                                    {jobInfo[2]}
                                  </Link>
                                ) : (
                                  jobInfo ? jobInfo[2] : '-'
                                )}
                              </TableCell>
                              <TableCell>{activity.date}</TableCell>
                              <TableCell className="capitalize">{activity.status}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You haven't applied to any jobs yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Track your application success rate over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="applications" name="Applications" fill="#3B82F6" />
                      <Bar dataKey="interviews" name="Interviews" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle>My Job Listings</CardTitle>
                  <CardDescription>
                    Manage your current job listings and track their performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm">Loading job listings...</p>
                  ) : jobsData && jobsData.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Posted Date</TableHead>
                          <TableHead>Applications</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobsData.map((job: any) => (
                          <TableRow key={job.id}>
                            <TableCell>
                              <Link to={`/jobs/${job.id}`} className="font-medium hover:underline">
                                {job.title}
                              </Link>
                            </TableCell>
                            <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                            <TableCell>{job.applicationCount}</TableCell>
                            <TableCell className="text-green-600">Active</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You haven't posted any jobs yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="applicants">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applicants</CardTitle>
                  <CardDescription>
                    Review and manage recent applications to your job listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm">Loading applicants...</p>
                  ) : recentActivity.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Job</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentActivity.map((activity) => {
                          const applicantInfo = activity.title.match(/(.+) applied to "(.+)"/);
                          return (
                            <TableRow key={activity.id}>
                              <TableCell>{applicantInfo ? applicantInfo[1] : '-'}</TableCell>
                              <TableCell>{applicantInfo ? applicantInfo[2] : activity.title}</TableCell>
                              <TableCell>{activity.date}</TableCell>
                              <TableCell className="capitalize">{activity.status}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent applications to display.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default Dashboard;
