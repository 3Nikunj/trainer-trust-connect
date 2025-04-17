
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
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

export function UserNav() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="/login">Log in</a>
        </Button>
        <Button size="sm" className="bg-brand-600 hover:bg-brand-700" asChild>
          <a href="/register">Sign up</a>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
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
          <DropdownMenuItem asChild>
            <a href="/dashboard">
              <User className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`/profile/${user.id}`}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Messages</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/reviews">
              <Star className="mr-2 h-4 w-4" />
              <span>Reviews</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </a>
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
