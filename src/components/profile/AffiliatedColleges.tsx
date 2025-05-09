
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { School } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CompanyProfile, College } from "@/types/profile";

interface AffiliatedCollegesProps {
  collegeData?: College[];
  isOwnProfile: boolean;
  isEditing: boolean;
}

export const AffiliatedColleges = ({ collegeData, isOwnProfile, isEditing }: AffiliatedCollegesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Affiliated Colleges</CardTitle>
        <CardDescription>Educational institutions we partner with</CardDescription>
      </CardHeader>
      <CardContent>
        {collegeData && collegeData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Partnership Since</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collegeData.map((college) => (
                <TableRow key={college.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <School className="h-4 w-4 mr-2 text-muted-foreground" />
                      {college.website ? (
                        <a href={college.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-600">
                          {college.name}
                        </a>
                      ) : (
                        college.name
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{college.location}</TableCell>
                  <TableCell>{college.partnership_year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <School className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p>No affiliated colleges listed</p>
          </div>
        )}
        
        {isOwnProfile && isEditing && (
          <Button variant="outline" size="sm" className="mt-4">
            Add College Affiliation
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
