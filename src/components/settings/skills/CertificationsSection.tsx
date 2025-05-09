
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, X, Plus } from "lucide-react";
import { Certification } from "@/types/profile";

interface CertificationsSectionProps {
  certifications: Certification[];
  onCertificationsChange: (certifications: Certification[]) => void;
}

export const CertificationsSection = ({ 
  certifications, 
  onCertificationsChange 
}: CertificationsSectionProps) => {
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertYear, setNewCertYear] = useState("");

  const handleAddCertification = () => {
    if (newCertName.trim() === "") return;
    
    const newCert: Certification = {
      id: Date.now().toString(),
      name: newCertName.trim(),
      issuer: newCertIssuer.trim(),
      year: newCertYear.trim()
    };
    
    onCertificationsChange([...certifications, newCert]);
    setNewCertName("");
    setNewCertIssuer("");
    setNewCertYear("");
  };

  const handleRemoveCertification = (certId: string) => {
    onCertificationsChange(certifications.filter(cert => cert.id !== certId));
  };

  return (
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
  );
};
