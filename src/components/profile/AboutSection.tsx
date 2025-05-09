
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainerProfile, CompanyProfile } from "@/types/profile";

interface AboutSectionProps {
  profileData: TrainerProfile | CompanyProfile;
}

export const AboutSection = ({ profileData }: AboutSectionProps) => {
  const isCompany = profileData.role === "company";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{profileData.bio}</p>
        
        {isCompany && (profileData as CompanyProfile).trainingPhilosophy && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-medium mb-2">Training Philosophy</h3>
            <p className="text-sm text-muted-foreground">
              {(profileData as CompanyProfile).trainingPhilosophy}
            </p>
          </div>
        )}
        
        {isCompany && (profileData as CompanyProfile).targetAudience && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-medium mb-2">Target Audience</h3>
            <div className="flex flex-wrap gap-2">
              {(profileData as CompanyProfile).targetAudience.map((audience) => (
                <Badge key={audience} variant="secondary">{audience}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
