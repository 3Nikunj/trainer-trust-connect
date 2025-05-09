
import { useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserContext } from "@/App";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import { useProfileData } from "@/hooks/useProfileData";

const Profile = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { profileData, loading } = useProfileData(id, user?.role);
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  if (loading || !profileData) {
    return <ProfileLoading />;
  }
  
  const isOwnProfile = user?.id === profileData.id;

  return (
    <ProfileLayout>
      <ProfileContent 
        profileData={profileData}
        isOwnProfile={isOwnProfile}
      />
    </ProfileLayout>
  );
};

export default Profile;
