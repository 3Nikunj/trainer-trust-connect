
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "@/App";
import { cn } from "@/lib/utils";

export function MainNav() {
  const { user } = React.useContext(UserContext);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname.startsWith(path);
  
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        to="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      {user ? (
        <>
          <Link
            to="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/dashboard") && "text-primary"
            )}
          >
            Dashboard
          </Link>
          <Link
            to="/jobs"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/jobs") && "text-primary"
            )}
          >
            Jobs
          </Link>
          <Link
            to="/messages"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/messages") && "text-primary"
            )}
          >
            Messages
          </Link>
          {user.role === 'company' && (
            <Link
              to="/trainer-search"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/trainer-search") && "text-primary"
              )}
            >
              Find Trainers
            </Link>
          )}
        </>
      ) : null}
    </nav>
  );
}
