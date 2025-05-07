
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface JobListingsTabProps {
  loading: boolean;
  jobsData: any[];
  jobApplicants: any[];
  selectedJobId: string | null;
  onJobSelect: (jobId: string) => void;
}

export const JobListingsTab = ({ 
  loading, 
  jobsData, 
  jobApplicants, 
  selectedJobId, 
  onJobSelect 
}: JobListingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Job Listings</CardTitle>
        <CardDescription>
          Manage your current job listings and track their performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm">Loading job listings...</p>
        ) : jobsData && jobsData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobsData.map((job: any) => (
                <TableRow 
                  key={job.id} 
                  className={selectedJobId === job.id ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    <Link to={`/jobs/${job.id}`} className="font-medium hover:underline">
                      {job.title}
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{job.applicationCount}</TableCell>
                  <TableCell className="text-green-600">Active</TableCell>
                  <TableCell>
                    <Button 
                      variant={selectedJobId === job.id ? "secondary" : "outline"} 
                      size="sm"
                      onClick={() => onJobSelect(job.id)}
                    >
                      {selectedJobId === job.id ? "Hide Applicants" : "View Applicants"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">
            You haven't posted any jobs yet.
          </p>
        )}
        
        {selectedJobId && jobApplicants.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">
              Applicants for {jobsData?.find(j => j.id === selectedJobId)?.title || 'Selected Job'}
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <Link 
                        to={`/profile/${applicant.trainerId}`} 
                        className="font-medium text-brand-600 hover:underline flex items-center gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{applicant.trainerName.slice(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {applicant.trainerName}
                      </Link>
                    </TableCell>
                    <TableCell>{applicant.trainerTitle}</TableCell>
                    <TableCell>{applicant.date}</TableCell>
                    <TableCell className="capitalize">{applicant.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {selectedJobId && jobApplicants.length === 0 && (
          <div className="mt-8 border-t pt-6 text-center py-8 text-muted-foreground">
            <p>No applicants for this job yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
