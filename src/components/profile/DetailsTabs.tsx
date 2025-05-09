
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainerProfile, CompanyProfile } from "@/types/profile";

interface DetailsTabsProps {
  profileData: TrainerProfile | CompanyProfile;
}

export const DetailsTabs = ({ profileData }: DetailsTabsProps) => {
  const isTrainer = profileData.role === "trainer";
  
  if (isTrainer) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills & Expertise</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(profileData as TrainerProfile).skills.map((skill) => (
              <Badge key={skill} variant="outline">{skill}</Badge>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Languages</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(profileData as TrainerProfile).languages.map((language) => (
              <Badge key={language} variant="secondary">{language}</Badge>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{(profileData as TrainerProfile).hourlyRate} per hour</p>
          </CardContent>
        </Card>
      </>
    );
  } else {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Specializations</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(profileData as CompanyProfile).specializations.map((spec) => (
              <Badge key={spec} variant="outline">{spec}</Badge>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Founded:</span>
              <span>{(profileData as CompanyProfile).foundedYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size:</span>
              <span>{(profileData as CompanyProfile).companySize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Website:</span>
              <a href={(profileData as CompanyProfile).website} className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">
                {(profileData as CompanyProfile).website.replace('https://', '')}
              </a>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
};
