
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/shared/MainNav";
import { UserNav } from "@/components/shared/UserNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Code, GraduationCap, Briefcase, Filter, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Trainer type definition
type Trainer = {
  id: string;
  full_name: string;
  title?: string;
  avatar_url?: string;
  location?: string;
  skills?: string[];
  education?: any[];
  experience?: string;
  hourly_rate?: string;
  bio?: string;
};

const TrainerSearch = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filter states
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<string[]>([]);

  // Available filter options (these could be fetched from the database)
  const skillOptions = [
    "React", "JavaScript", "TypeScript", "Node.js", "SQL", "Python", 
    "Java", "C#", "Project Management", "Leadership", "Communication",
    "Agile", "DevOps", "Cloud Computing", "Machine Learning"
  ];
  
  const experienceOptions = [
    "1+ years", "3+ years", "5+ years", "10+ years"
  ];

  // Fetch trainers on component mount
  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "trainer");
          
        if (error) throw error;
        
        if (data) {
          setTrainers(data as Trainer[]);
          setFilteredTrainers(data as Trainer[]);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
        toast({
          title: "Error",
          description: "Failed to load trainers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [toast]);

  // Apply search and filters when they change
  useEffect(() => {
    let results = trainers;
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        trainer => 
          trainer.full_name?.toLowerCase().includes(term) ||
          trainer.title?.toLowerCase().includes(term) ||
          trainer.bio?.toLowerCase().includes(term) ||
          trainer.skills?.some(skill => skill.toLowerCase().includes(term))
      );
    }
    
    // Apply skill filters
    if (selectedSkills.length > 0) {
      results = results.filter(trainer => 
        trainer.skills?.some(skill => 
          selectedSkills.includes(skill)
        )
      );
    }
    
    // Apply location filter
    if (locationFilter) {
      const location = locationFilter.toLowerCase();
      results = results.filter(trainer => 
        trainer.location?.toLowerCase().includes(location)
      );
    }
    
    // Apply experience filter
    if (experienceFilter.length > 0) {
      results = results.filter(trainer => {
        if (!trainer.experience) return false;
        
        // Simple filtering based on year ranges 
        // This is a simplified implementation - would need more sophisticated parsing for real-world use
        const yearsOfExp = parseInt(trainer.experience);
        
        return experienceFilter.some(expFilter => {
          if (expFilter === "1+ years" && yearsOfExp >= 1) return true;
          if (expFilter === "3+ years" && yearsOfExp >= 3) return true;
          if (expFilter === "5+ years" && yearsOfExp >= 5) return true;
          if (expFilter === "10+ years" && yearsOfExp >= 10) return true;
          return false;
        });
      });
    }
    
    setFilteredTrainers(results);
  }, [searchTerm, selectedSkills, locationFilter, experienceFilter, trainers]);

  // Handle skill selection
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  // Handle experience filter selection
  const toggleExperienceFilter = (level: string) => {
    setExperienceFilter(prev => 
      prev.includes(level)
        ? prev.filter(e => e !== level)
        : [...prev, level]
    );
  };

  // Navigate to trainer profile
  const viewTrainerProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };

  if (!user || user.role !== 'company') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p>This page is only accessible to company accounts.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
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
      
      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-col space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h2 className="text-3xl font-bold tracking-tight">Find Trainers</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Filters sidebar */}
            <div className="space-y-4">
              <div className="lg:hidden">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Filters</span>
                  </div>
                  {filtersOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className={`space-y-4 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Location
                  </h3>
                  
                  <Input
                    placeholder="Filter by location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="mb-2"
                  />
                </div>
                
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Code className="mr-2 h-4 w-4" />
                    Skills
                  </h3>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {skillOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`skill-${skill}`} 
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        <Label htmlFor={`skill-${skill}`} className="text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Experience
                  </h3>
                  
                  <div className="space-y-2">
                    {experienceOptions.map((exp) => (
                      <div key={exp} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`exp-${exp}`} 
                          checked={experienceFilter.includes(exp)}
                          onCheckedChange={() => toggleExperienceFilter(exp)}
                        />
                        <Label htmlFor={`exp-${exp}`} className="text-sm">
                          {exp}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset filters button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSkills([]);
                    setLocationFilter("");
                    setExperienceFilter([]);
                  }}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Search results */}
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trainers by name, skills, or description"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredTrainers.length} trainer{filteredTrainers.length !== 1 ? 's' : ''} found
                </p>
                
                {loading ? (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {[1, 2, 3, 4].map((n) => (
                      <Card key={n} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-20 bg-muted rounded-md"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredTrainers.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">No trainers found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or search term</p>
                  </div>
                ) : (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {filteredTrainers.map((trainer) => (
                      <Card 
                        key={trainer.id} 
                        className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                        onClick={() => viewTrainerProfile(trainer.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <Avatar className="h-12 w-12">
                              {trainer.avatar_url ? (
                                <AvatarImage src={trainer.avatar_url} alt={trainer.full_name || "Trainer"} />
                              ) : null}
                              <AvatarFallback>
                                {(trainer.full_name?.charAt(0) || "T")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{trainer.full_name}</h3>
                              <p className="text-sm text-muted-foreground">{trainer.title || "Trainer"}</p>
                            </div>
                          </div>
                          
                          {trainer.location && (
                            <div className="flex items-center text-sm text-muted-foreground mb-3">
                              <MapPin className="mr-1 h-4 w-4" />
                              {trainer.location}
                            </div>
                          )}
                          
                          {trainer.hourly_rate && (
                            <div className="mb-3">
                              <Badge variant="outline" className="font-medium">
                                {trainer.hourly_rate}
                              </Badge>
                            </div>
                          )}
                          
                          {trainer.skills && trainer.skills.length > 0 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1">
                                {trainer.skills.slice(0, 5).map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {trainer.skills.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{trainer.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {trainer.bio && (
                            <p className="text-sm line-clamp-2 text-muted-foreground">
                              {trainer.bio}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainerSearch;
