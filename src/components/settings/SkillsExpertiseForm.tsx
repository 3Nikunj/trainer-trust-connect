
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Award, GraduationCap, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

interface SkillsExpertiseFormProps {
  userId: string;
}

export const SkillsExpertiseForm = ({ userId }: SkillsExpertiseFormProps) => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertYear, setNewCertYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing skills and experience data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('skills, experience, certifications')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data) {
          setSkills(data.skills || []);
          setExperience(data.experience || "");
          setCertifications(data.certifications ? JSON.parse(JSON.stringify(data.certifications)) : []);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleAddSkill = () => {
    if (newSkill.trim() === "") return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddCertification = () => {
    if (newCertName.trim() === "") return;
    
    const newCert: Certification = {
      id: Date.now().toString(),
      name: newCertName.trim(),
      issuer: newCertIssuer.trim(),
      year: newCertYear.trim()
    };
    
    setCertifications([...certifications, newCert]);
    setNewCertName("");
    setNewCertIssuer("");
    setNewCertYear("");
  };

  const handleRemoveCertification = (certId: string) => {
    setCertifications(certifications.filter(cert => cert.id !== certId));
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          skills: skills,
          experience: experience,
          certifications: certifications
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Changes saved",
        description: "Your skills and expertise have been updated"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error saving your changes"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Skills section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <Label htmlFor="skills" className="text-base font-medium">Skills</Label>
        </div>
        <div className="flex gap-2 flex-wrap">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="px-2 py-1">
              {skill}
              <button 
                type="button" 
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="skills"
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            className="flex-1"
          />
          <Button type="button" size="sm" onClick={handleAddSkill} className="shrink-0">
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Certifications section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          <Label className="text-base font-medium">Certifications</Label>
        </div>
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-secondary/50 p-3 rounded-md flex justify-between">
              <div>
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-muted-foreground">
                  {cert.issuer} {cert.year && `• ${cert.year}`}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => handleRemoveCertification(cert.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-3 bg-muted/50 p-3 rounded-md">
          <div className="space-y-2">
            <Label htmlFor="certName">Certification Name</Label>
            <Input
              id="certName"
              placeholder="e.g., AWS Certified Solutions Architect"
              value={newCertName}
              onChange={(e) => setNewCertName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="certIssuer">Issuing Organization</Label>
              <Input
                id="certIssuer"
                placeholder="e.g., Amazon Web Services"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certYear">Year</Label>
              <Input
                id="certYear"
                placeholder="e.g., 2023"
                value={newCertYear}
                onChange={(e) => setNewCertYear(e.target.value)}
              />
            </div>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddCertification}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Certification
          </Button>
        </div>
      </div>

      {/* Experience section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          <Label htmlFor="experience" className="text-base font-medium">Experience</Label>
        </div>
        <Textarea
          id="experience"
          placeholder="Describe your relevant work experience, teaching background, or any other qualifications..."
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="min-h-32"
        />
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveChanges} 
          className="bg-brand-600 hover:bg-brand-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
