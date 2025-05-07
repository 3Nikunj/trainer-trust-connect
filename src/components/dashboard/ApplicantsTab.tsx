
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

interface ApplicantsTabProps {
  loading: boolean;
  activities: ActivityProps[];
}

export const ApplicantsTab = ({ loading, activities }: ApplicantsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applicants</CardTitle>
        <CardDescription>
          Review and manage recent applications to your job listings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm">Loading applicants...</p>
        ) : activities.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => {
                const applicantInfo = activity.title.match(/(.+) applied to "(.+)"/);
                return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      {applicantInfo && activity.trainerId ? (
                        <Link to={`/profile/${activity.trainerId}`} className="text-brand-600 hover:underline">
                          {applicantInfo[1]}
                        </Link>
                      ) : (
                        applicantInfo ? applicantInfo[1] : '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {applicantInfo ? (
                        <Link to={`/jobs/${activity.jobId}`} className="hover:underline">
                          {applicantInfo[2]}
                        </Link>
                      ) : activity.title}
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
            No recent applications to display.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
