import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, createContext } from "react";

// Pages
import Index from "./pages/Index";
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

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/jobs" element={<JobListings />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/create-job" element={<CreateJob />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:id" element={<ChatRoom />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
