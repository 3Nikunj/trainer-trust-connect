
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { asUUID } from "@/utils/supabaseHelpers";

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
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [localActivities, setLocalActivities] = useState<ActivityProps[]>(activities);
  const { toast } = useToast();
  
  // Function to extract company ID 
  const extractCompanyIdFromActivity = (activity: ActivityProps, jobsData: any[]) => {
    if (!activity || !jobsData) return null;
    
    // For applications, try to find the job in jobsData
    const jobMatch = jobsData?.find(job => 
      activity.title.includes(job.title)
    );
    
    return jobMatch ? jobMatch.companyId : null;
  };

  // Function to cancel application
  const handleCancelApplication = async (applicationId: string) => {
    try {
      setCancellingId(applicationId);
      
      // Delete the application from the database
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', asUUID(applicationId));
      
      if (error) throw error;
      
      // Remove the application from local state
      setLocalActivities(prevActivities => 
        prevActivities.filter(activity => activity.id !== applicationId)
      );
      
      // Show success toast
      toast({
        title: "Application cancelled",
        description: "Your job application has been successfully cancelled.",
      });
      
    } catch (error) {
      console.error("Error cancelling application:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
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
        ) : localActivities.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localActivities.map((activity) => {
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
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelApplication(activity.id)}
                        disabled={cancellingId === activity.id || activity.status === 'rejected' || activity.status === 'completed'}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        {cancellingId === activity.id ? (
                          <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Cancel
                      </Button>
                    </TableCell>
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
