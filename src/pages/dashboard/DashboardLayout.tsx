
import { useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "@/App";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { Button } from "@/components/ui/button";
import { DashboardTabs } from "./DashboardTabs";

const DashboardLayout = () => {
  const { user } = useContext(UserContext);

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

          <DashboardTabs user={user} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
