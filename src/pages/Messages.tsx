
import { useContext, useState } from "react";
import { UserContext } from "@/App";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { Search, MessageSquare } from "lucide-react";

const Messages = () => {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  
  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <main className="flex-1 flex flex-col">
        <div className="container flex-1 flex flex-col max-w-6xl py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Messages</h1>
            <Button className="bg-brand-600 hover:bg-brand-700" asChild>
              <a href="/messages/new">New Message</a>
            </Button>
          </div>
          
          <div className="flex flex-col bg-background border rounded-lg overflow-hidden flex-1">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">No conversations yet</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                Start connecting with trainers and companies to begin messaging
              </p>
              <Button className="mt-6 bg-brand-600 hover:bg-brand-700">
                Start a Conversation
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
