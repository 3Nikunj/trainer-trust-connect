import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { Briefcase, Calendar, Clock, MapPin, Search, Filter, Star } from "lucide-react";
import { getJobs, type Job } from "@/lib/jobs";
import { Link } from "react-router-dom";

const JobListings = () => {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationType, setLocationType] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const isCompany = user?.role === "company";
        const fetchedJobs = await getJobs(isCompany, user?.id);
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadJobs();
  }, [user]);
  
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocationType = !locationType || locationType === "all" || job.locationType === locationType;
    
    const matchesDuration = !duration || duration === "any" || 
      (duration === "day" && job.duration.includes("day")) ||
      (duration === "week" && job.duration.includes("week")) ||
      (duration === "month" && job.duration.includes("month"));
    
    return matchesSearch && matchesLocationType && matchesDuration;
  });

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {user?.role === "company" ? "My Job Listings" : "Find Training Opportunities"}
              </h1>
              <p className="text-muted-foreground">
                {user?.role === "company" 
                  ? "Manage your posted training opportunities" 
                  : "Browse available training jobs that match your expertise"}
              </p>
            </div>
            {user?.role === "company" && (
              <Button className="bg-brand-600 hover:bg-brand-700" asChild>
                <Link to="/create-job">Post New Job</Link>
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, skills, or companies..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Location type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Duration" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any duration</SelectItem>
                <SelectItem value="day">1-5 days</SelectItem>
                <SelectItem value="week">1-4 weeks</SelectItem>
                <SelectItem value="month">1+ months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                "Loading jobs..."
              ) : (
                <>Showing <span className="font-medium">{filteredJobs.length}</span> jobs</>
              )}
            </p>
            <Button variant="ghost" size="sm" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More filters
            </Button>
          </div>
          
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4">Loading jobs...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          <Link to={`/jobs/${job.id}`} className="hover:text-brand-600 transition-colors">
                            {job.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Link to={`/profile/${job.companyId}`} className="font-medium text-foreground hover:text-brand-600">
                            {job.company}
                          </Link>
                          <span className="flex items-center ml-2 text-amber-500">
                            <Star className="h-3 w-3 fill-amber-500 mr-1" />
                            {job.companyRating}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant={job.locationType === "Remote" ? "outline" : "secondary"}>
                        {job.locationType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-wrap gap-y-2 text-sm mb-4">
                      <div className="w-full sm:w-1/2 md:w-1/3 flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="w-full sm:w-1/2 md:w-1/3 flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {job.duration}
                      </div>
                      <div className="w-full sm:w-1/2 md:w-1/3 flex items-center text-muted-foreground">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {job.rate}
                      </div>
                    </div>
                    
                    <p className="text-sm mb-4 line-clamp-2">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map(skill => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="flex justify-between py-4">
                    <div className="text-sm text-muted-foreground">
                      Posted {job.postedDate} • {job.applicationCount} applications
                    </div>
                    <Button asChild>
                      <Link to={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">No matching jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobListings;
