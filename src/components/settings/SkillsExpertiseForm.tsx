
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Certification, Education } from "@/types/profile";
import { SkillsSection } from "./skills/SkillsSection";
import { CertificationsSection } from "./skills/CertificationsSection";
import { ExperienceSection } from "./skills/ExperienceSection";
import { EducationSection } from "./skills/EducationSection";

interface SkillsExpertiseFormProps {
  userId: string;
}

export const SkillsExpertiseForm = ({ userId }: SkillsExpertiseFormProps) => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing skills and experience data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('skills, experience, certifications, education')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data) {
          setSkills(data.skills || []);
          setExperience(data.experience || "");
          setCertifications(data.certifications ? JSON.parse(JSON.stringify(data.certifications)) : []);
          setEducation(data.education ? JSON.parse(JSON.stringify(data.education)) : []);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    try {
      // Convert arrays to format compatible with Json type
      const certificationsJson = certifications as unknown as Json;
      const educationJson = education as unknown as Json;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          skills: skills,
          experience: experience,
          certifications: certificationsJson,
          education: educationJson
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
      <SkillsSection 
        skills={skills}
        onSkillsChange={setSkills}
      />

      {/* Certifications section */}
      <CertificationsSection 
        certifications={certifications}
        onCertificationsChange={setCertifications}
      />

      {/* Education section */}
      <EducationSection
        education={education}
        onEducationChange={setEducation}
      />

      {/* Experience section */}
      <ExperienceSection
        experience={experience}
        onExperienceChange={setExperience}
      />

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
