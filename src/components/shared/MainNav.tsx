
import { useContext } from "react";
import { UserContext } from "@/App";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        to="/"
        className="text-xl font-bold text-brand-600 flex items-center"
      >
        TrainerTrust
      </Link>
      
      {user && (
        <>
          <Link
            to="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/dashboard")
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
          <Link
            to="/jobs"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/jobs") || location.pathname.startsWith("/jobs/")
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {user.role === "trainer" ? "Find Jobs" : "My Jobs"}
          </Link>
          <Link
            to="/messages"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/messages") || location.pathname.startsWith("/messages/")
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Messages
          </Link>
        </>
      )}
    </nav>
  );
}
