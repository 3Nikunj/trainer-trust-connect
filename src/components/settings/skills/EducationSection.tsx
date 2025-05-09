
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Education } from "@/types/profile";
import { School } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EducationSectionProps {
  education: Education[];
  onEducationChange: (education: Education[]) => void;
}

export const EducationSection = ({ 
  education, 
  onEducationChange 
}: EducationSectionProps) => {
  const [newEducation, setNewEducation] = useState<Education>({
    id: "",
    degree: "",
    school: "",
    year: ""
  });

  const addEducation = () => {
    if (newEducation.degree && newEducation.school && newEducation.year) {
      const educationToAdd = {
        ...newEducation,
        id: crypto.randomUUID()
      };
      onEducationChange([...education, educationToAdd]);
      setNewEducation({ id: "", degree: "", school: "", year: "" });
    }
  };

  const removeEducation = (id: string) => {
    onEducationChange(education.filter(edu => edu.id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEducation({
      ...newEducation,
      [name]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <School className="h-4 w-4" />
        <Label className="text-base font-medium">Education</Label>
      </div>
      
      <div className="space-y-4">
        {education.map((edu) => (
          <Card key={edu.id} className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => removeEducation(edu.id)}
            >
              ×
            </Button>
            <CardContent className="pt-6">
              <div className="grid gap-3">
                <div className="font-medium">{edu.degree}</div>
                <div className="text-sm text-muted-foreground">
                  {edu.school}, {edu.year}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 border rounded-md p-4 bg-background mt-4">
        <div className="text-sm font-medium mb-2">Add New Education</div>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="degree">Degree/Qualification</Label>
            <Input
              id="degree"
              name="degree"
              placeholder="e.g., Bachelor of Science in Computer Science"
              value={newEducation.degree}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="school">School/University</Label>
            <Input
              id="school"
              name="school"
              placeholder="e.g., Stanford University"
              value={newEducation.school}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="year">Year of Completion</Label>
            <Input
              id="year"
              name="year"
              placeholder="e.g., 2020"
              value={newEducation.year}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <Button 
          onClick={addEducation}
          className="w-full mt-2"
          disabled={!newEducation.degree || !newEducation.school || !newEducation.year}
        >
          Add Education
        </Button>
      </div>
    </div>
  );
};
