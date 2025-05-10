
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityProps {
  id: string;
  title: string;
  company?: string;
  status: string;
  date: string;
  type: 'application' | 'job' | 'message';
  trainerId?: string;
  jobId?: string;
}

interface RecentActivityProps {
  activities: ActivityProps[];
  isCompany: boolean;
  jobsData?: any[];
  loading?: boolean;
}

export const RecentActivity = ({ activities, isCompany, jobsData, loading = false }: RecentActivityProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            {isCompany 
              ? "Recent applications to your job listings" 
              : "Your recent job applications and updates"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          {isCompany 
            ? "Recent applications to your job listings" 
            : "Your recent job applications and updates"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                {!isCompany && <TableHead>Company</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => {
                // For company view, parse the applicant name and job title
                let applicantName = null;
                let jobTitle = null;
                
                if (isCompany) {
                  const match = activity.title.match(/^(.+?) applied to "(.+?)"$/);
                  if (match) {
                    applicantName = match[1];
                    jobTitle = match[2];
                  }
                }
                
                return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      {isCompany ? (
                        <>
                          {applicantName && (
                            <Link 
                              to={`/profile/${activity.trainerId}`} 
                              className="text-brand-600 hover:underline font-medium"
                            >
                              {applicantName}
                            </Link>
                          )} {' '}
                          applied to "{jobTitle || ''}"
                        </>
                      ) : (
                        activity.title
                      )}
                    </TableCell>
                    {!isCompany && (
                      <TableCell>
                        {activity.company && (
                          <Link to={`/profile/${activity.jobId}`} className="text-brand-600 hover:underline">
                            {activity.company}
                          </Link>
                        )}
                      </TableCell>
                    )}
                    <TableCell>{activity.date}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        activity.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        activity.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activity.status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">No recent activity to display.</p>
        )}
      </CardContent>
    </Card>
  );
}
