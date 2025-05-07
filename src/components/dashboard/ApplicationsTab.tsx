
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
  TableHead,
  TableHeader,
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

interface ApplicationsTabProps {
  loading: boolean;
  activities: ActivityProps[];
  jobsData?: any[];
}

export const ApplicationsTab = ({ loading, activities, jobsData }: ApplicationsTabProps) => {
  // Function to extract company ID 
  const extractCompanyIdFromActivity = (activity: ActivityProps, jobsData: any[]) => {
    if (!activity || !jobsData) return null;
    
    // For applications, try to find the job in jobsData
    const jobMatch = jobsData?.find(job => 
      activity.title.includes(job.title)
    );
    
    return jobMatch ? jobMatch.companyId : null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Job Applications</CardTitle>
        <CardDescription>
          Track your recent job applications and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm">Loading applications...</p>
        ) : activities.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => {
                const jobInfo = activity.title.match(/applied to "(.+)" at (.+)$/);
                const companyId = extractCompanyIdFromActivity(activity, jobsData || []);
                
                return (
                  <TableRow key={activity.id}>
                    <TableCell>{jobInfo ? jobInfo[1] : activity.title}</TableCell>
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
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">
            You haven't applied to any jobs yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
