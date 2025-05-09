
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, TrainerProfile, CompanyProfile, Education } from "@/types/profile";
import { mockTrainerProfile, mockCompanyProfile } from "@/data/mockProfiles";

export const useProfileData = (id: string | undefined, currentUserRole?: string) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      try {
        // Check if we're viewing an actual profile from Supabase
        if (id) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
            // If there's an error, we'll fall back to mock data below
          } else if (profileData) {
            // We found a profile, now let's build the appropriate object
            if (profileData.role === 'company') {
              const companyProfile: CompanyProfile = {
                id: profileData.id,
                name: profileData.full_name || 'Unknown Company',
                role: 'company',
                avatar: profileData.avatar_url || '/placeholder.svg',
                title: profileData.title || 'Enterprise Technology Training Provider',
                location: profileData.location || 'Unknown Location',
                bio: profileData.bio || 'No company bio available',
                specializations: profileData.skills || [],
                foundedYear: parseInt(profileData.founded_year || '2000'),
                companySize: profileData.company_size || 'Unknown',
                website: profileData.website || '#',
                industryFocus: ['Technology'], // Default value
                trainingPhilosophy: profileData.training_philosophy || '',
                targetAudience: ['Technical Teams'], // Default value
                stats: {
                  trainersHired: 0, // Default values
                  averageRating: 4.5,
                  trainingPrograms: 0,
                  paymentReliability: 95
                }
              };
              setProfileData(companyProfile);
            } else {
              // It's a trainer profile
              // Parse certifications from the database
              let parsedCertifications: string[] = [];
              if (profileData.certifications) {
                try {
                  // Extract certification names from the array of certification objects
                  const certArray = Array.isArray(profileData.certifications) 
                    ? profileData.certifications 
                    : JSON.parse(JSON.stringify(profileData.certifications));
                  
                  parsedCertifications = certArray.map((cert: any) => {
                    if (typeof cert === 'object' && cert.name) {
                      return `${cert.name}${cert.issuer ? ` - ${cert.issuer}` : ''}${cert.year ? ` (${cert.year})` : ''}`;
                    }
                    return String(cert);
                  });
                } catch (e) {
                  console.error("Error parsing certifications:", e);
                  parsedCertifications = [];
                }
              }

              // Parse education data from the database
              let parsedEducation: Education[] = [];
              if (profileData.education) {
                try {
                  const eduArray = Array.isArray(profileData.education)
                    ? profileData.education
                    : JSON.parse(JSON.stringify(profileData.education));
                  
                  parsedEducation = eduArray.map((edu: any) => {
                    // Ensure it follows the Education structure
                    if (typeof edu === 'object') {
                      return {
                        id: edu.id || crypto.randomUUID(),
                        degree: edu.degree || 'Unknown Degree',
                        school: edu.school || 'Unknown School',
                        year: edu.year || 'Unknown Year'
                      };
                    }
                    return {
                      id: crypto.randomUUID(),
                      degree: 'Unknown Degree',
                      school: 'Unknown School',
                      year: 'Unknown Year'
                    };
                  });
                } catch (e) {
                  console.error("Error parsing education data:", e);
                  parsedEducation = [];
                }
              }

              const trainerProfile: TrainerProfile = {
                id: profileData.id,
                name: profileData.full_name || 'Unknown Trainer',
                role: 'trainer',
                avatar: profileData.avatar_url || '/placeholder.svg',
                title: profileData.title || 'Trainer',
                location: profileData.location || 'Unknown Location',
                bio: profileData.bio || 'No trainer bio available',
                skills: profileData.skills || [],
                hourlyRate: profileData.hourly_rate || 'Not specified',
                languages: ['English'],
                education: parsedEducation.length > 0 ? parsedEducation : [
                  {
                    id: 'default-education',
                    degree: 'Education info not available',
                    school: '',
                    year: ''
                  }
                ],
                certifications: parsedCertifications,
                stats: {
                  completionRate: 95,
                  overallRating: 4.5,
                  trainingsCompleted: 0,
                  repeatHireRate: 70
                }
              };
              setProfileData(trainerProfile);
            }
            
            // We successfully loaded the profile data
            setLoading(false);
            return;
          }
        }
        
        // If we got here, either there's no ID, or we failed to load from the database
        // Use mock data as fallback based on current user's role for a personal profile
        // or based on URL ID's associated role for another user's profile
        const fallbackData = currentUserRole === "trainer" ? mockTrainerProfile : mockCompanyProfile;
        setProfileData(fallbackData);
        
      } catch (error) {
        console.error("Error in profile fetch:", error);
        // Use mock data as fallback
        const fallbackData = currentUserRole === "trainer" ? mockTrainerProfile : mockCompanyProfile;
        setProfileData(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id, currentUserRole]);

  return { profileData, loading };
};
