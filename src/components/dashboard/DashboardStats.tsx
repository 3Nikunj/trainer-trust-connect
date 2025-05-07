
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MessageSquare, Star } from "lucide-react";

interface DashboardStatsProps {
  completedJobs: number;
  averageRating: number;
  unreadMessages: number;
  activeListings?: number;
  isCompany: boolean;
}

export const DashboardStats = ({
  completedJobs,
  averageRating,
  unreadMessages,
  activeListings,
  isCompany
}: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isCompany ? "Active Listings" : "Job Applications"}
          </CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedJobs}</div>
          <p className="text-xs text-muted-foreground">
            {completedJobs > 0 
              ? `${isCompany ? 'Active job listings' : 'Applications submitted'}`
              : 'No active applications'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isCompany ? "Average Rating" : "Review Score"}
          </CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageRating > 0 ? averageRating : '-'}
          </div>
          <p className="text-xs text-muted-foreground">
            {averageRating > 0 
              ? `Based on ${isCompany ? 'trainer' : 'company'} reviews` 
              : 'No reviews yet'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unreadMessages}</div>
          <p className="text-xs text-muted-foreground">
            {unreadMessages > 0 
              ? 'Unread messages' 
              : 'No unread messages'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
