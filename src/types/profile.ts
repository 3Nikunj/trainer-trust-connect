
export type TrainerStats = {
  completionRate: number;
  overallRating: number;
  trainingsCompleted: number;
  repeatHireRate: number;
};

export type CompanyStats = {
  trainersHired: number;
  averageRating: number;
  trainingPrograms: number;
  paymentReliability: number;
};

export type College = {
  id: string;
  name: string;
  location: string;
  website?: string;
  partnership_year: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  avatar?: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  year: string;
};

export type TrainerProfile = {
  id: string;
  name: string;
  role: "trainer";
  avatar: string;
  title: string;
  location: string;
  bio: string;
  skills: string[];
  hourlyRate: string;
  languages: string[];
  education: Education[] | {
    degree: string;
    school: string;
    year: string;
  }[];
  certifications: string[];
  stats: TrainerStats;
};

export type CompanyProfile = {
  id: string;
  name: string;
  role: "company";
  avatar: string;
  title: string;
  location: string;
  bio: string;
  specializations: string[];
  foundedYear: number;
  companySize: string;
  website: string;
  industryFocus?: string[];
  trainingPhilosophy?: string;
  targetAudience?: string[];
  affiliatedColleges?: College[];
  reviews?: Review[];
  stats: CompanyStats;
};

export type ProfileData = TrainerProfile | CompanyProfile;
