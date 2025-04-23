import { useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [stats, setStats] = useState({
    completedJobs: 0,
    averageRating: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(false);
      // Fetch real stats from your database here
      setStats({
        completedJobs: 0,
        averageRating: 0,
        unreadMessages: 0
      });
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

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
            {user.role === "company" && (
              <Button className="bg-brand-600 hover:bg-brand-700" size="sm">
                <Link to="/create-job" className="text-white">Post New Job</Link>
              </Button>
            )}
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {user.role === "trainer" ? (
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
                      {user.role === "trainer" ? "Completed Jobs" : "Active Listings"}
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.completedJobs}</div>
                    <p className="text-xs text-muted-foreground">
                      Just getting started
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {user.role === "trainer" ? "Review Score" : "Average Rating"}
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageRating}</div>
                    <p className="text-xs text-muted-foreground">
                      No reviews yet
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Messages</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                    <p className="text-xs text-muted-foreground">
                      No unread messages
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    {user.role === "trainer" 
                      ? "Your recent job applications and updates" 
                      : "Recent applications to your job listings"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No recent activity to display.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
