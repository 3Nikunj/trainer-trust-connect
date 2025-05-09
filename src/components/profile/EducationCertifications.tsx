
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Book, Award } from "lucide-react";
import { TrainerProfile } from "@/types/profile";

interface EducationCertificationsProps {
  profileData: TrainerProfile;
}

export const EducationCertifications = ({ profileData }: EducationCertificationsProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.education && profileData.education.length > 0 ? (
            profileData.education.map((edu, index) => (
              <div key={index} className="flex gap-3">
                <Book className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground">
                    {edu.school}, {edu.year}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Book className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-30" />
              <p>No education information listed</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.certifications && 
           profileData.certifications.length > 0 ? (
            profileData.certifications.map((cert, index) => (
              <div key={index} className="flex gap-3">
                <Award className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{cert}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Award className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-30" />
              <p>No certifications listed</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
