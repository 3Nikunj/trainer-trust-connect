import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { X, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CreateJob = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  if (user.role !== "company") {
    return <Navigate to="/dashboard" />;
  }
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    locationType: "",
    location: "",
    duration: "",
    startDate: "",
    rateType: "",
    rate: "",
    audience: "",
    requirements: ["", "", ""],
    responsibilities: ["", "", ""]
  });
  
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleArrayChange = (type: "requirements" | "responsibilities", index: number, value: string) => {
    const updatedArray = [...formData[type]];
    updatedArray[index] = value;
    setFormData({ ...formData, [type]: updatedArray });
  };
  
  const addArrayItem = (type: "requirements" | "responsibilities") => {
    const updatedArray = [...formData[type], ""];
    setFormData({ ...formData, [type]: updatedArray });
  };
  
  const removeArrayItem = (type: "requirements" | "responsibilities", index: number) => {
    const updatedArray = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updatedArray });
  };
  
  const addSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill("");
    }
  };
  
  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.locationType) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    toast({
      title: "Job created",
      description: "Your job listing has been successfully created."
    });
    
    navigate("/jobs");
  };
  
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
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Create a New Job Listing</h1>
              <p className="text-muted-foreground mt-2">Post a new training opportunity to find the perfect trainer</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., React Advanced Workshop Trainer"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the training role, topics to be covered, and expected outcomes..."
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="min-h-32"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="locationType">Location Type <span className="text-red-500">*</span></Label>
                        <Select
                          value={formData.locationType}
                          onValueChange={(value) => handleSelectChange("locationType", value)}
                        >
                          <SelectTrigger id="locationType">
                            <SelectValue placeholder="Select location type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="On-site">On-site</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder={formData.locationType === "Remote" ? "Worldwide" : "e.g., San Francisco, CA"}
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Job Details</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          name="duration"
                          placeholder="e.g., 3 days, 2 weeks"
                          value={formData.duration}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          placeholder="e.g., June 15, 2023 or Flexible"
                          value={formData.startDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rateType">Payment Type</Label>
                        <Select
                          value={formData.rateType}
                          onValueChange={(value) => handleSelectChange("rateType", value)}
                        >
                          <SelectTrigger id="rateType">
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fixed">Fixed Price</SelectItem>
                            <SelectItem value="Hourly">Hourly Rate</SelectItem>
                            <SelectItem value="Daily">Daily Rate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rate">Rate</Label>
                        <Input
                          id="rate"
                          name="rate"
                          placeholder="e.g., $2000, $150 per hour"
                          value={formData.rate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience</Label>
                      <Input
                        id="audience"
                        name="audience"
                        placeholder="e.g., Senior Frontend Developers (team of 12)"
                        value={formData.audience}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                  
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a skill (e.g., React, Python, AWS)"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <Button type="button" onClick={addSkill} variant="outline">
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                      {skills.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No skills added yet</p>
                      ) : (
                        skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="pl-2 pr-1 py-1">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => removeSkill(skill)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Requirements & Responsibilities</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Requirements</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addArrayItem("requirements")}
                          className="h-8 text-xs"
                        >
                          <PlusCircle className="h-3 w-3 mr-1" />
                          Add Requirement
                        </Button>
                      </div>
                      
                      {formData.requirements.map((req, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder="e.g., 5+ years experience with React development"
                            value={req}
                            onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                          />
                          {formData.requirements.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeArrayItem("requirements", index)}
                              className="h-10 w-10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Responsibilities</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addArrayItem("responsibilities")}
                          className="h-8 text-xs"
                        >
                          <PlusCircle className="h-3 w-3 mr-1" />
                          Add Responsibility
                        </Button>
                      </div>
                      
                      {formData.responsibilities.map((resp, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder="e.g., Prepare and deliver a comprehensive workshop"
                            value={resp}
                            onChange={(e) => handleArrayChange("responsibilities", index, e.target.value)}
                          />
                          {formData.responsibilities.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeArrayItem("responsibilities", index)}
                              className="h-10 w-10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/jobs")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                  Create Job Listing
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
