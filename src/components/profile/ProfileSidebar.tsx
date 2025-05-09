
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageSquare, Calendar, Mail, Building } from "lucide-react";
import { TrainerProfile, CompanyProfile } from "@/types/profile";

interface ProfileSidebarProps {
  profileData: TrainerProfile | CompanyProfile;
  isOwnProfile: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export const ProfileSidebar = ({ profileData, isOwnProfile, isEditing, setIsEditing }: ProfileSidebarProps) => {
  const isTrainer = useMemo(() => profileData.role === "trainer", [profileData.role]);
  const isCompany = useMemo(() => profileData.role === "company", [profileData.role]);

  return (
    <div className="md:col-span-1 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback>{profileData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-muted-foreground">{profileData.title}</p>
              <div className="flex items-center justify-center mt-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profileData.location}</span>
              </div>
            </div>
            
            {isOwnProfile ? (
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="w-full"
              >
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </Button>
            ) : (
              <div className="flex w-full space-x-2">
                <Button className="flex-1 bg-brand-600 hover:bg-brand-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <div className="text-center flex-1">
                <div className="text-xl font-bold">
                  {isTrainer 
                    ? (profileData as TrainerProfile).stats.trainingsCompleted 
                    : (profileData as CompanyProfile).stats.trainersHired}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isTrainer ? "Trainings" : "Trainers Hired"}
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl font-bold">
                  {isTrainer 
                    ? (profileData as TrainerProfile).stats.overallRating 
                    : (profileData as CompanyProfile).stats.averageRating}
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl font-bold">
                  {isTrainer 
                    ? `${(profileData as TrainerProfile).stats.repeatHireRate}%` 
                    : `${(profileData as CompanyProfile).stats.paymentReliability}%`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isTrainer ? "Rehire Rate" : "Payment Reliability"}
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Contact</h3>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Contact via platform messages</span>
              </div>
              
              {isCompany && (
                <div className="flex items-center mt-2 text-sm">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={(profileData as CompanyProfile).website} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                    {(profileData as CompanyProfile).website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
            
            {isCompany && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Company Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Founded:</span>
                    <span>{(profileData as CompanyProfile).foundedYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{(profileData as CompanyProfile).companySize}</span>
                  </div>
                  {(profileData as CompanyProfile).industryFocus && (
                    <div>
                      <span className="text-muted-foreground">Industry Focus:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(profileData as CompanyProfile).industryFocus.map((industry) => (
                          <Badge key={industry} variant="outline" className="text-xs">{industry}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
