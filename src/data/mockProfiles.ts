
import { TrainerProfile, CompanyProfile } from "@/types/profile";

// Mock data for fallback purposes
export const mockTrainerProfile: TrainerProfile = {
  id: "trainer123",
  name: "Alex Johnson",
  role: "trainer",
  avatar: "/placeholder.svg",
  title: "Full Stack Development Trainer",
  location: "San Francisco, CA",
  bio: "Experienced technology trainer with over 10 years of expertise in full-stack development, cloud technologies, and DevOps practices. Passionate about helping teams level up their skills through hands-on, practical learning.",
  skills: ["JavaScript", "React", "Node.js", "AWS", "Docker", "TypeScript", "Python", "CI/CD"],
  hourlyRate: "$150 - $200",
  languages: ["English", "Spanish"],
  education: [
    {
      degree: "M.S. Computer Science",
      school: "Stanford University",
      year: "2012",
      id: '1'
    },
    {
      degree: "B.S. Software Engineering",
      school: "University of California, Berkeley",
      year: "2010",
      id: '2'
    }
  ],
  certifications: [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional Developer",
    "Microsoft Certified Trainer"
  ],
  stats: {
    completionRate: 98,
    overallRating: 4.9,
    trainingsCompleted: 87,
    repeatHireRate: 76
  }
};

export const mockCompanyProfile: CompanyProfile = {
  id: "company456",
  name: "TechLearn Solutions",
  role: "company",
  avatar: "/placeholder.svg",
  title: "Enterprise Technology Training Provider",
  location: "Boston, MA",
  bio: "TechLearn Solutions specializes in providing high-quality technical training programs for enterprise teams. We focus on practical skills development in modern technologies, with customized curriculums designed for specific team needs.",
  specializations: ["Cloud Computing", "Data Science", "DevOps", "Cybersecurity", "Web Development"],
  foundedYear: 2015,
  companySize: "50-100 employees",
  website: "https://techlearnsolutions.com",
  industryFocus: ["Technology", "Finance", "Healthcare", "Education"],
  trainingPhilosophy: "Our approach combines practical, hands-on learning with theoretical foundations. We believe in small group sessions with personalized attention and real-world project work.",
  targetAudience: ["Software Development Teams", "IT Departments", "Product Managers", "Data Scientists"],
  affiliatedColleges: [
    {
      id: "college1",
      name: "Massachusetts Institute of Technology",
      location: "Cambridge, MA",
      website: "https://mit.edu",
      partnership_year: "2017"
    },
    {
      id: "college2",
      name: "Stanford University",
      location: "Stanford, CA",
      website: "https://stanford.edu",
      partnership_year: "2018"
    },
    {
      id: "college3",
      name: "Harvard University",
      location: "Cambridge, MA",
      website: "https://harvard.edu",
      partnership_year: "2019"
    }
  ],
  reviews: [
    {
      id: "review1",
      author: "John Smith",
      rating: 5,
      date: "2024-03-15",
      content: "TechLearn provided exceptional training for our development team. Their hands-on approach and expert trainers made complex concepts accessible to everyone.",
      avatar: "/placeholder.svg"
    },
    {
      id: "review2",
      author: "Sarah Johnson",
      rating: 4.5,
      date: "2024-02-20",
      content: "The customized curriculum perfectly addressed our team's skill gaps. Great communication throughout the process and excellent follow-up materials.",
      avatar: "/placeholder.svg"
    },
    {
      id: "review3",
      author: "Michael Chen",
      rating: 5,
      date: "2024-01-10",
      content: "We've worked with TechLearn for three consecutive years for our onboarding program. Their training consistently receives top ratings from new hires.",
      avatar: "/placeholder.svg"
    }
  ],
  stats: {
    trainersHired: 124,
    averageRating: 4.7,
    trainingPrograms: 210,
    paymentReliability: 99
  }
};
