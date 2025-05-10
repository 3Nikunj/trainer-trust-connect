
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, TrainerProfile, CompanyProfile, Education, Review } from "@/types/profile";
import { mockTrainerProfile, mockCompanyProfile } from "@/data/mockProfiles";
import { asUUID, getCategoryDescription } from "@/utils/supabaseHelpers";

// Define interfaces to help with type safety
interface ProfileResponse {
  id: string;
  role?: string;
  full_name?: string;
  avatar_url?: string;
  title?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  founded_year?: string;
  company_size?: string;
  website?: string;
  training_philosophy?: string;
  certifications?: any;
  education?: any;
  hourly_rate?: string;
}

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
            .eq('id', asUUID(id))
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
            // If there's an error, we'll fall back to mock data below
          } else if (profileData) {
            // We found a profile, now handle the data safely
            const profile = profileData as ProfileResponse;
            
            // Fetch reviews for this profile
            const { data: reviewsData } = await supabase
              .from('reviews')
              .select('*')
              .eq('reviewee_id', asUUID(id));

            // Process reviews with additional information
            const reviews: Review[] = await Promise.all((reviewsData || []).map(async (review) => {
              // Get reviewer info
              const { data: reviewerData } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, role')
                .eq('id', review.reviewer_id)
                .single();
              
              const categories: Record<string, number> = {};
              const reviewerRole = reviewerData?.role || 'trainer';
              
              // Populate categories based on reviewer role
              if (reviewerRole === 'company') {
                // Company reviewing a trainer
                categories.expertise = review.rating_expertise || 0;
                categories.communication = review.rating_communication || 0;
                categories.professionalism = review.rating_professionalism || 0;
                categories.curriculum = review.rating_curriculum || 0;
                categories.delivery = review.rating_delivery || 0;
              } else {
                // Trainer reviewing a company
                categories.communication = review.rating_communication || 0;
                categories.requirements = review.rating_requirements || 0;
                categories.support = review.rating_support || 0;
                categories.professionalism = review.rating_professionalism || 0;
                categories.payment = review.rating_payment || 0;
              }

              return {
                id: review.id,
                author: reviewerData?.full_name || 'Anonymous User',
                rating: review.rating,
                date: review.created_at,
                content: review.review,
                avatar: reviewerData?.avatar_url || undefined,
                categories,
                reviewerRole: reviewerRole as 'company' | 'trainer',
              };
            }));
              
            // Build the appropriate object based on role
            if (profile.role === 'company') {
              const companyProfile: CompanyProfile = {
                id: profile.id,
                name: profile.full_name || 'Unknown Company',
                role: 'company',
                avatar: profile.avatar_url || '/placeholder.svg',
                title: profile.title || 'Enterprise Technology Training Provider',
                location: profile.location || 'Unknown Location',
                bio: profile.bio || 'No company bio available',
                specializations: profile.skills || [],
                foundedYear: parseInt(profile.founded_year || '2000'),
                companySize: profile.company_size || 'Unknown',
                website: profile.website || '#',
                industryFocus: ['Technology'], // Default value
                trainingPhilosophy: profile.training_philosophy || '',
                targetAudience: ['Technical Teams'], // Default value
                reviews: reviews,
                stats: {
                  trainersHired: 0, // Default values
                  averageRating: reviews.length > 0 
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
                    : 4.5,
                  trainingPrograms: 0,
                  paymentReliability: 95
                }
              };
              setProfileData(companyProfile);
            } else {
              // It's a trainer profile
              // Parse certifications from the database
              let parsedCertifications: string[] = [];
              if (profile.certifications) {
                try {
                  // Extract certification names from the array of certification objects
                  const certArray = Array.isArray(profile.certifications) 
                    ? profile.certifications 
                    : JSON.parse(JSON.stringify(profile.certifications));
                  
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
              if (profile.education) {
                try {
                  const eduArray = Array.isArray(profile.education)
                    ? profile.education
                    : JSON.parse(JSON.stringify(profile.education));
                  
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
                id: profile.id,
                name: profile.full_name || 'Unknown Trainer',
                role: 'trainer',
                avatar: profile.avatar_url || '/placeholder.svg',
                title: profile.title || 'Trainer',
                location: profile.location || 'Unknown Location',
                bio: profile.bio || 'No trainer bio available',
                skills: profile.skills || [],
                hourlyRate: profile.hourly_rate || 'Not specified',
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
                reviews: reviews, // Add reviews to trainer profiles too
                stats: {
                  completionRate: 95,
                  overallRating: reviews.length > 0 
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
                    : 4.5,
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
