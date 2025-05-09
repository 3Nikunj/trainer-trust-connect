
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { BookOpen, X, Plus } from "lucide-react";

interface SkillsSectionProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export const SkillsSection = ({ skills, onSkillsChange }: SkillsSectionProps) => {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() === "") return;
    if (!skills.includes(newSkill.trim())) {
      onSkillsChange([...skills, newSkill.trim()]);
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  return (
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
  );
};
