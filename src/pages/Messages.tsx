
import { useContext, useState } from "react";
import { UserContext } from "@/App";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { Search, MessageSquare } from "lucide-react";

// Mock conversation data
const conversations = [
  {
    id: "conv1",
    user: {
      id: "trainer123",
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
      online: true
    },
    lastMessage: {
      text: "I'd be interested in discussing the React training opportunity further.",
      time: "10:42 AM",
      unread: true
    }
  },
  {
    id: "conv2",
    user: {
      id: "company456",
      name: "TechLearn Solutions",
      avatar: "/placeholder.svg",
      online: false
    },
    lastMessage: {
      text: "Thanks for applying! Can we schedule a call to discuss the training curriculum?",
      time: "Yesterday",
      unread: false
    }
  },
  {
    id: "conv3",
    user: {
      id: "trainer789",
      name: "Maya Rodriguez",
      avatar: "/placeholder.svg",
      online: true
    },
    lastMessage: {
      text: "I've attached my sample workshop materials for your review.",
      time: "Monday",
      unread: false
    }
  }
];

const Messages = () => {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  
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
            
            {filteredConversations.length > 0 ? (
              <ScrollArea className="flex-1">
                <div className="divide-y">
                  {filteredConversations.map((conv) => (
                    <a 
                      key={conv.id}
                      href={`/messages/${conv.id}`}
                      className={`flex items-center p-4 hover:bg-muted/40 transition-colors ${conv.lastMessage.unread ? 'bg-muted/20' : ''}`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conv.user.avatar} alt={conv.user.name} />
                          <AvatarFallback>{conv.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {conv.user.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                        )}
                      </div>
                      <div className="ml-4 flex-1 flex justify-between min-w-0">
                        <div className="overflow-hidden">
                          <p className={`font-medium truncate ${conv.lastMessage.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {conv.user.name}
                          </p>
                          <p className={`text-sm truncate ${conv.lastMessage.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                            {conv.lastMessage.text}
                          </p>
                        </div>
                        <div className="flex flex-col items-end ml-4">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {conv.lastMessage.time}
                          </span>
                          {conv.lastMessage.unread && (
                            <span className="h-2 w-2 rounded-full bg-brand-600 mt-1" />
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">No conversations found</h3>
                <p className="text-muted-foreground max-w-md mt-2">
                  {searchTerm ? 
                    "No messages matching your search terms." : 
                    "You don't have any conversations yet. Start connecting with trainers and companies."
                  }
                </p>
                <Button className="mt-6 bg-brand-600 hover:bg-brand-700">
                  Start a Conversation
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
