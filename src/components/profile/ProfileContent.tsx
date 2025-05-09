
import { useState } from "react";
import { ProfileData, TrainerProfile, CompanyProfile } from "@/types/profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { AboutSection } from "@/components/profile/AboutSection";
import { DetailsTabs } from "@/components/profile/DetailsTabs";
import { AffiliatedColleges } from "@/components/profile/AffiliatedColleges";
import { ReviewsSection } from "@/components/profile/ReviewsSection";
import { EducationCertifications } from "@/components/profile/EducationCertifications";

interface ProfileContentProps {
  profileData: ProfileData;
  isOwnProfile: boolean;
}

export const ProfileContent = ({ profileData, isOwnProfile }: ProfileContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const isTrainer = profileData.role === "trainer";
  const isCompany = profileData.role === "company";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Profile Sidebar */}
      <ProfileSidebar 
        profileData={profileData}
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      
      {/* Main Content */}
      <div className="md:col-span-2 space-y-6">
        <AboutSection profileData={profileData} />
        
        <Tabs defaultValue={isCompany ? "details" : "details"} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">
              {isTrainer ? "Expertise" : "Company Details"}
            </TabsTrigger>
            {isCompany && (
              <TabsTrigger value="colleges">Affiliated Colleges</TabsTrigger>
            )}
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            {isTrainer && (
              <TabsTrigger value="education">Education & Certifications</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <DetailsTabs profileData={profileData} />
          </TabsContent>
          
          {isCompany && (
            <TabsContent value="colleges" className="space-y-4 mt-4">
              <AffiliatedColleges 
                collegeData={(profileData as CompanyProfile).affiliatedColleges}
                isOwnProfile={isOwnProfile}
                isEditing={isEditing}
              />
            </TabsContent>
          )}
          
          <TabsContent value="reviews" className="space-y-4 mt-4">
            <ReviewsSection 
              reviews={isCompany ? (profileData as CompanyProfile).reviews : undefined}
              isOwnProfile={isOwnProfile}
            />
          </TabsContent>
          
          {isTrainer && (
            <TabsContent value="education" className="space-y-4 mt-4">
              <EducationCertifications profileData={profileData as TrainerProfile} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};
