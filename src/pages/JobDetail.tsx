import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { Briefcase, Calendar, Clock, MapPin, Users, Star, AlertCircle, BookOpen, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/lib/jobs";
import { applyForJob } from "@/lib/jobs";
import { useToast } from "@/components/ui/use-toast";

const jobData = {
  id: "job1",
  title: "React Advanced Workshop Trainer",
  company: "TechLearn Solutions",
  companyId: "company456",
  companyLogo: "/placeholder.svg",
  location: "Remote",
  locationType: "Remote",
  rate: "$2,000 per day",
  rateType: "Fixed",
  duration: "3 days",
  startDate: "Flexible (within next 2 months)",
  audience: "Senior Frontend Developers (team of 12)",
  description: "We're looking for an experienced React trainer to lead a 3-day advanced workshop for our development team. Topics should include hooks, context, performance optimization, and integration with backends.",
  responsibilities: [
    "Prepare and deliver a comprehensive 3-day workshop on advanced React concepts",
    "Create hands-on exercises and coding challenges for participants",
    "Provide code reviews and feedback during practical sessions",
    "Answer technical questions and provide guidance on best practices",
    "Share real-world examples and case studies from industry experience"
  ],
  requirements: [
    "5+ years of experience with React development",
    "Previous experience conducting technical training or workshops",
    "Deep understanding of React hooks, context, performance optimization",
    "Experience with state management solutions (Redux, MobX, etc.)",
    "Strong communication and presentation skills",
    "Ability to explain complex concepts in an accessible way"
  ],
  skills: ["React", "JavaScript", "Redux", "Performance Optimization", "Frontend Architecture"],
  postedDate: "2 days ago",
  applicationDeadline: "June 30, 2023",
  applicationCount: 4,
  companyRating: 4.8,
  aboutCompany: "TechLearn Solutions specializes in providing high-quality technical training programs for enterprise teams. We focus on practical skills development in modern technologies, with customized curriculums designed for specific team needs."
};

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const isTrainer = user?.role === "trainer";
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        if (!id) {
          throw new Error('Job ID is missing');
        }

        // Check if user has already applied
        if (user) {
          const { data: application } = await supabase
            .from('job_applications')
            .select()
            .eq('job_id', id)
            .eq('trainer_id', user.id)
            .single();
          
          setHasApplied(!!application);
        }

        const { data, error: queryError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (queryError) throw queryError;
        if (!data) throw new Error('Job not found');

        setJob({
          id: data.id,
          title: data.title,
          description: data.description,
          company: data.company,
          companyId: data.company_id,
          location: data.location,
          locationType: data.location_type,
          rate: data.rate,
          rateType: data.rate_type,
          duration: data.duration,
          startDate: data.start_date,
          audience: data.audience,
          requirements: data.requirements || [],
          responsibilities: data.responsibilities || [],
          skills: data.skills || [],
          postedDate: new Date(data.created_at).toLocaleString(),
          applicationCount: data.application_count || 0,
          companyRating: data.company_rating || 4.5
        });
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetail();
    }
  }, [id, user]);

  const handleApply = async () => {
    if (!job || !user) return;
    
    setApplying(true);
    const result = await applyForJob(job.id);
    setApplying(false);

    if (result.success) {
      setHasApplied(true);
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
      });
    } else {
      toast({
        title: "Application Failed",
        description: result.error as string,
        variant: "destructive",
      });
    }
  };

  if (loading) {
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
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </main>
      </div>
    );
  }

  if (error || !job) {
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
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || 'The requested job could not be found.'}</p>
            <Button asChild>
              <a href="/jobs">Back to Jobs</a>
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{job.title}</h1>
                    <div className="flex items-center mt-2">
                      <a href={`/profile/${job.companyId}`} className="flex items-center hover:text-brand-600">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src="/placeholder.svg" alt={job.company} />
                          <AvatarFallback>{job.company.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{job.company}</span>
                      </a>
                      <div className="flex items-center ml-3 text-amber-500">
                        <Star className="h-4 w-4 fill-amber-500 mr-1" />
                        <span>{job.companyRating}</span>
                      </div>
                      <Badge variant="outline" className="ml-3">
                        {job.locationType}
                      </Badge>
                    </div>
                  </div>
                  
                  {isTrainer && (
                    <Button className="bg-brand-600 hover:bg-brand-700">
                      Apply Now
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-brand-600" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-brand-600" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">{job.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-brand-600" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{job.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-brand-600" />
                    <div>
                      <p className="text-sm font-medium">Compensation</p>
                      <p className="text-sm text-muted-foreground">{job.rate}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-brand-600" />
                    <div>
                      <p className="text-sm font-medium">Audience</p>
                      <p className="text-sm text-muted-foreground">{job.audience}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-brand-600" />
                    <div>
                      <p className="text-sm font-medium">Applications</p>
                      <p className="text-sm text-muted-foreground">{job.applicationCount} trainers</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Job Details Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Description</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{job.description}</p>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold">Responsibilities:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {job.responsibilities.map((item, index) => (
                            <li key={index} className="text-muted-foreground">{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-4">
                        <h3 className="w-full font-semibold mb-2">Required Skills:</h3>
                        {job.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="requirements" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 mr-2 text-teal-600 flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="company" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/placeholder.svg" alt={job.company} />
                        <AvatarFallback>{job.company.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{job.company}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Star className="h-3 w-3 fill-amber-500 mr-1" />
                          <span>{job.companyRating} rating</span>
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">This company specializes in providing training solutions.</p>
                      <Button variant="outline" asChild>
                        <a href={`/profile/${job.companyId}`}>View Company Profile</a>
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Application Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Apply for this Position</CardTitle>
                  <CardDescription>
                    Submit your application to express interest
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Job Posted</p>
                    <p className="text-sm text-muted-foreground">{job.postedDate}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Applications</p>
                    <p className="text-sm text-muted-foreground">{job.applicationCount} trainers have applied</p>
                  </div>
                </CardContent>
                {isTrainer ? (
                  <CardFooter>
                    <Button 
                      className="w-full bg-brand-600 hover:bg-brand-700" 
                      onClick={handleApply}
                      disabled={hasApplied || applying}
                    >
                      {applying ? "Submitting..." : hasApplied ? "Already Applied" : "Apply Now"}
                    </Button>
                  </CardFooter>
                ) : (
                  <CardFooter className="flex-col space-y-4">
                    <div className="flex items-center text-amber-500 w-full bg-amber-50 p-3 rounded-md">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm">Only trainers can apply for jobs</span>
                    </div>
                    {!user && (
                      <Button variant="outline" className="w-full" asChild>
                        <a href="/register">Register as a Trainer</a>
                      </Button>
                    )}
                  </CardFooter>
                )}
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    No similar jobs found at the moment.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/jobs">Browse All Jobs</a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetail;
