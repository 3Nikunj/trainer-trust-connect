
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "@/App";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, CreditCard, MessageSquare, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { signOut } from "@/lib/auth";

export function UserNav() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/login">Log in</Link>
        </Button>
        <Button size="sm" className="bg-brand-600 hover:bg-brand-700" asChild>
          <Link to="/login?tab=register">Sign up</Link>
        </Button>
      </div>
    );
  }

  // Create a fallback initial for avatar
  const userInitials = user.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10 border border-muted">
            {user.avatar ? (
              <AvatarImage 
                src={user.avatar} 
                alt={user.name || "User avatar"} 
                className="object-cover"
                onError={(e) => {
                  // If image fails to load, we'll show fallback
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/messages")}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/reviews")}>
            <Star className="mr-2 h-4 w-4" />
            <span>Reviews</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
