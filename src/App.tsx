
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import JobListings from "./pages/JobListings";
import JobDetail from "./pages/JobDetail";
import CreateJob from "./pages/CreateJob";
import Messages from "./pages/Messages";
import ChatRoom from "./pages/ChatRoom";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";

// Context
export type UserRole = 'trainer' | 'company' | 'admin' | null;
export type UserType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileComplete: boolean;
  avatar?: string;
} | null;

export const UserContext = createContext<{
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}>({
  user: null,
  setUser: () => {}
});

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.full_name || session.user.email!,
          role: session.user.user_metadata.role || "trainer",
          profileComplete: true,
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.full_name || session.user.email!,
          role: session.user.user_metadata.role || "trainer",
          profileComplete: true,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
              />
              <Route
                path="/profile/:id"
                element={user ? <Profile /> : <Navigate to="/auth" replace />}
              />
              <Route
                path="/jobs"
                element={user ? <JobListings /> : <Navigate to="/auth" replace />}
              />
              <Route
                path="/jobs/:id"
                element={user ? <JobDetail /> : <Navigate to="/auth" replace />}
              />
              <Route
                path="/create-job"
                element={user ? <CreateJob /> : <Navigate to="/auth" replace />}
              />
              <Route
                path="/messages"
                element={user ? <Messages /> : <Navigate to="/auth" replace />}
              />
              <Route
                path="/messages/:id"
                element={user ? <ChatRoom /> : <Navigate to="/auth" replace />}
              />
              <Route
                path="/reviews"
                element={user ? <Reviews /> : <Navigate to="/auth" replace />}
              />
              <Route
                path="/settings"
                element={user ? <Settings /> : <Navigate to="/auth" replace />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
