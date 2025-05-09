
import { useContext, useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserContext } from "@/App";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, TrainerProfile, CompanyProfile } from "@/types/profile";

// Import extracted components
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { AboutSection } from "@/components/profile/AboutSection";
import { DetailsTabs } from "@/components/profile/DetailsTabs";
import { AffiliatedColleges } from "@/components/profile/AffiliatedColleges";
import { ReviewsSection } from "@/components/profile/ReviewsSection";
import { EducationCertifications } from "@/components/profile/EducationCertifications";

// Mock data for fallback purposes
const mockTrainerProfile: TrainerProfile = {
  id: "trainer123",
  name: "Alex Johnson",
  role: "trainer",
  avatar: "/placeholder.svg",
  title: "Full Stack Development Trainer",
  location: "San Francisco, CA",
  bio: "Experienced technology trainer with over 10 years of expertise in full-stack development, cloud technologies, and DevOps practices. Passionate about helping teams level up their skills through hands-on, practical learning.",
  skills: ["JavaScript", "React", "Node.js", "AWS", "Docker", "TypeScript", "Python", "CI/CD"],
  hourlyRate: "$150 - $200",
  languages: ["English", "Spanish"],
  education: [
    {
      degree: "M.S. Computer Science",
      school: "Stanford University",
      year: "2012"
    },
    {
      degree: "B.S. Software Engineering",
      school: "University of California, Berkeley",
      year: "2010"
    }
  ],
  certifications: [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional Developer",
    "Microsoft Certified Trainer"
  ],
  stats: {
    completionRate: 98,
    overallRating: 4.9,
    trainingsCompleted: 87,
    repeatHireRate: 76
  }
};

const mockCompanyProfile: CompanyProfile = {
  id: "company456",
  name: "TechLearn Solutions",
  role: "company",
  avatar: "/placeholder.svg",
  title: "Enterprise Technology Training Provider",
  location: "Boston, MA",
  bio: "TechLearn Solutions specializes in providing high-quality technical training programs for enterprise teams. We focus on practical skills development in modern technologies, with customized curriculums designed for specific team needs.",
  specializations: ["Cloud Computing", "Data Science", "DevOps", "Cybersecurity", "Web Development"],
  foundedYear: 2015,
  companySize: "50-100 employees",
  website: "https://techlearnsolutions.com",
  industryFocus: ["Technology", "Finance", "Healthcare", "Education"],
  trainingPhilosophy: "Our approach combines practical, hands-on learning with theoretical foundations. We believe in small group sessions with personalized attention and real-world project work.",
  targetAudience: ["Software Development Teams", "IT Departments", "Product Managers", "Data Scientists"],
  affiliatedColleges: [
    {
      id: "college1",
      name: "Massachusetts Institute of Technology",
      location: "Cambridge, MA",
      website: "https://mit.edu",
      partnership_year: "2017"
    },
    {
      id: "college2",
      name: "Stanford University",
      location: "Stanford, CA",
      website: "https://stanford.edu",
      partnership_year: "2018"
    },
    {
      id: "college3",
      name: "Harvard University",
      location: "Cambridge, MA",
      website: "https://harvard.edu",
      partnership_year: "2019"
    }
  ],
  reviews: [
    {
      id: "review1",
      author: "John Smith",
      rating: 5,
      date: "2024-03-15",
      content: "TechLearn provided exceptional training for our development team. Their hands-on approach and expert trainers made complex concepts accessible to everyone.",
      avatar: "/placeholder.svg"
    },
    {
      id: "review2",
      author: "Sarah Johnson",
      rating: 4.5,
      date: "2024-02-20",
      content: "The customized curriculum perfectly addressed our team's skill gaps. Great communication throughout the process and excellent follow-up materials.",
      avatar: "/placeholder.svg"
    },
    {
      id: "review3",
      author: "Michael Chen",
      rating: 5,
      date: "2024-01-10",
      content: "We've worked with TechLearn for three consecutive years for our onboarding program. Their training consistently receives top ratings from new hires.",
      avatar: "/placeholder.svg"
    }
  ],
  stats: {
    trainersHired: 124,
    averageRating: 4.7,
    trainingPrograms: 210,
    paymentReliability: 99
  }
};

const Profile = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
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
                education: [
                  {
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
        const fallbackData = user?.role === "trainer" ? mockTrainerProfile : mockCompanyProfile;
        setProfileData(fallbackData);
        
      } catch (error) {
        console.error("Error in profile fetch:", error);
        // Use mock data as fallback
        const fallbackData = user?.role === "trainer" ? mockTrainerProfile : mockCompanyProfile;
        setProfileData(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id, user]);
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  if (loading || !profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="ml-2">Loading profile...</p>
      </div>
    );
  }
  
  const isOwnProfile = user?.id === profileData.id;
  const isTrainer = profileData.role === "trainer";
  const isCompany = profileData.role === "company";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
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
        </div>
      </main>
    </div>
  );
};

export default Profile;
