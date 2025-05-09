
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";

interface ExperienceSectionProps {
  experience: string;
  onExperienceChange: (experience: string) => void;
}

export const ExperienceSection = ({ 
  experience, 
  onExperienceChange 
}: ExperienceSectionProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4" />
        <Label htmlFor="experience" className="text-base font-medium">Experience</Label>
      </div>
      <Textarea
        id="experience"
        placeholder="Describe your relevant work experience, teaching background, or any other qualifications..."
        value={experience}
        onChange={(e) => onExperienceChange(e.target.value)}
        className="min-h-32"
      />
    </div>
  );
};
