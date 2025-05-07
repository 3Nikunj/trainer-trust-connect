
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
  TableRow
} from "@/components/ui/table";

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
}

export const RecentActivity = ({ activities, isCompany, jobsData }: RecentActivityProps) => {
  // Function to extract company ID from job titles for recent activities
  const extractCompanyIdFromActivity = (activity: ActivityProps, jobsData: any[]) => {
    if (!activity || !jobsData) return null;
    
    // For companies looking at applicants, we don't need to extract
    if (activity.type === 'job') return activity.id;
    
    // For applications, try to find the job in jobsData
    const jobMatch = jobsData?.find(job => 
      activity.title.includes(job.title)
    );
    
    return jobMatch ? jobMatch.companyId : null;
  };

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
          <div className="space-y-4">
            {activities.map((activity) => {
              const jobInfo = activity.title.match(/applied to "(.+)" at (.+)$/);
              const companyId = extractCompanyIdFromActivity(activity, jobsData || []);
              
              return (
                <TableRow key={activity.id}>
                  <TableCell>
                    {isCompany ? (
                      <>
                        {activity.title.split(' applied to ')[0] && (
                          <Link to={`/profile/${activity.trainerId}`} className="text-brand-600 hover:underline">
                            {activity.title.split(' applied to ')[0]}
                          </Link>
                        )} applied to "{activity.title.match(/"([^"]+)"/)?.[1] || ''}"
                      </>
                    ) : (
                      jobInfo ? jobInfo[1] : activity.title
                    )}
                  </TableCell>
                  <TableCell>
                    {jobInfo && companyId ? (
                      <Link to={`/profile/${companyId}`} className="text-brand-600 hover:underline">
                        {jobInfo[2]}
                      </Link>
                    ) : (
                      jobInfo ? jobInfo[2] : '-'
                    )}
                  </TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell className="capitalize">{activity.status}</TableCell>
                </TableRow>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recent activity to display.</p>
        )}
      </CardContent>
    </Card>
  );
}
