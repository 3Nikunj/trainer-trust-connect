
import { useContext, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "@/App";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { Send, FileIcon, Paperclip } from "lucide-react";

// Mock conversation data
const conversationData = {
  id: "conv1",
  user: {
    id: "trainer123",
    name: "Alex Johnson",
    avatar: "/placeholder.svg",
    title: "React & Frontend Development Trainer",
    online: true
  },
  messages: [
    {
      id: "msg1",
      sender: "company456",
      text: "Hello Alex, I saw your profile and I think you'd be a great fit for our upcoming React training. Are you available for a 3-day workshop in June?",
      time: "Yesterday, 2:30 PM",
      read: true
    },
    {
      id: "msg2",
      sender: "trainer123",
      text: "Hi! Thanks for reaching out. I'd be interested in discussing the React training opportunity further. Could you share more details about the audience and specific topics you'd like covered?",
      time: "Yesterday, 3:15 PM",
      read: true
    },
    {
      id: "msg3",
      sender: "company456",
      text: "Of course! We have a team of 12 frontend developers with intermediate React experience. We're looking to cover advanced hooks, context API, performance optimization, and integration with GraphQL. The workshop would be remote, 3 full days.",
      time: "Yesterday, 3:22 PM",
      read: true
    },
    {
      id: "msg4",
      sender: "trainer123",
      text: "That sounds right up my alley. I've conducted similar workshops before and can definitely tailor the content to your team's needs. Would you like me to prepare a draft curriculum for your review?",
      time: "Yesterday, 3:45 PM",
      read: true
    },
    {
      id: "msg5",
      sender: "company456",
      text: "That would be great! Once we agree on the curriculum, we can discuss scheduling and compensation. Our budget is around $6000 for the 3-day workshop, including preparation time. Does that work for you?",
      time: "Today, 9:30 AM",
      read: true
    }
  ]
};

const ChatRoom = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState(conversationData);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const otherUser = conversation.user;
  const isOwnMessage = (senderId: string) => senderId === otherUser.id;

  useEffect(() => {
    // Scroll to the bottom of the messages when conversation updates
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversation]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add the new message to the conversation
    const newMessage = {
      id: `msg${conversation.messages.length + 1}`,
      sender: user?.id || "currentUser",
      text: message,
      time: "Just now",
      read: false
    };
    
    setConversation({
      ...conversation,
      messages: [...conversation.messages, newMessage]
    });
    
    setMessage("");
  };

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
        <div className="container flex-1 py-6 flex flex-col max-w-4xl">
          {/* Chat header */}
          <div className="flex items-center p-4 border-b mb-4">
            <a href={`/profile/${otherUser.id}`} className="flex items-center">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                  <AvatarFallback>{otherUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {otherUser.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium">{otherUser.name}</p>
                <p className="text-xs text-muted-foreground">{otherUser.title}</p>
              </div>
            </a>
            <div className="ml-auto">
              <Button variant="ghost" size="sm" asChild>
                <a href={`/profile/${otherUser.id}`}>View Profile</a>
              </Button>
            </div>
          </div>
          
          {/* Messages area */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
            <div className="space-y-4 pb-4">
              {conversation.messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${!isOwnMessage(msg.sender) ? 'justify-end' : ''}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      !isOwnMessage(msg.sender) 
                        ? 'bg-brand-600 text-white'
                        : 'bg-muted border'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${!isOwnMessage(msg.sender) ? 'text-brand-100' : 'text-muted-foreground'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Message input */}
          <div className="border rounded-lg p-2 mt-4 flex items-center">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Input
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${message ? 'text-brand-600' : 'text-muted-foreground'}`}
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatRoom;
