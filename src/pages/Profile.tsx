
import { useContext, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, MapPin, Award, Book, FileCheck, Star, MessageSquare } from "lucide-react";

// Types for profile data
type TrainerStats = {
  completionRate: number;
  overallRating: number;
  trainingsCompleted: number;
  repeatHireRate: number;
};

type CompanyStats = {
  trainersHired: number;
  averageRating: number;
  trainingPrograms: number;
  paymentReliability: number;
};

type TrainerProfile = {
  id: string;
  name: string;
  role: "trainer";
  avatar: string;
  title: string;
  location: string;
  bio: string;
  skills: string[];
  hourlyRate: string;
  languages: string[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  certifications: string[];
  stats: TrainerStats;
};

type CompanyProfile = {
  id: string;
  name: string;
  role: "company";
  avatar: string;
  title: string;
  location: string;
  bio: string;
  specializations: string[];
  foundedYear: number;
  companySize: string;
  website: string;
  stats: CompanyStats;
};

type ProfileData = TrainerProfile | CompanyProfile;

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
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  // Mock profile data based on role
  // In a real app, you would fetch this from your API
  const profileData: ProfileData = user.role === "trainer" ? mockTrainerProfile : mockCompanyProfile;
  const isOwnProfile = user?.id === profileData.id;
  const isTrainer = profileData.role === "trainer";

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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{profileData.bio}</p>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="details">
                    {isTrainer ? "Expertise" : "Company Details"}
                  </TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  {isTrainer && (
                    <TabsTrigger value="education">Education & Certifications</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 mt-4">
                  {isTrainer ? (
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
                  ) : (
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
                  )}
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Reviews</CardTitle>
                      <CardDescription>
                        What others are saying about {profileData.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <Star className="h-12 w-12 mx-auto mb-4 text-yellow-400 opacity-30" />
                        <p>No reviews yet</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {isTrainer && (
                  <TabsContent value="education" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Education</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {(profileData as TrainerProfile).education.map((edu, index) => (
                          <div key={index} className="flex gap-3">
                            <Book className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{edu.degree}</p>
                              <p className="text-sm text-muted-foreground">
                                {edu.school}, {edu.year}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Certifications</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {(profileData as TrainerProfile).certifications.map((cert, index) => (
                          <div key={index} className="flex gap-3">
                            <Award className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{cert}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
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
