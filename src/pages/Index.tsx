
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { Check, Briefcase, Star, Shield, ArrowRight } from "lucide-react";

const landingFeatures = [
  {
    title: "Verified Reviews",
    description: "Build your reputation with transparent, verified reviews from past engagements",
    icon: Star
  },
  {
    title: "Secure Contracts",
    description: "Standardized contracts to protect both parties and set clear expectations",
    icon: Shield
  },
  {
    title: "Quality Opportunities",
    description: "Connect with legitimate companies and high-quality training opportunities",
    icon: Briefcase
  }
];

const testimonials = [
  {
    quote: "TrainerTrust helped me find consistent training opportunities with reputable companies. The verification system makes me feel secure working with new clients.",
    author: "Alex Johnson",
    role: "Frontend Development Trainer"
  },
  {
    quote: "Finding qualified technical trainers used to be a major challenge. TrainerTrust streamlined our hiring process and helped us find the perfect fit for our specialized training needs.",
    author: "Sarah Chen",
    role: "L&D Manager, TechLearn Solutions"
  }
];

const Index = () => {
  const { user } = useContext(UserContext);
  
  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
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
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Connect with trust in the <span className="text-brand-600">training industry</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  TrainerTrust connects technical trainers with training companies through a transparent marketplace built on verified reviews and secure contracts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="bg-brand-600 hover:bg-brand-700" asChild>
                    <a href="/register">Join TrainerTrust</a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/login">Sign In</a>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/placeholder.svg" 
                  alt="TrainerTrust Platform" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">How TrainerTrust Works</h2>
              <p className="text-xl text-muted-foreground mt-4">
                A simple process to connect trainers and companies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-brand-50 text-brand-600 mb-6">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
                <p className="text-muted-foreground">
                  Sign up and build your detailed profile showcasing your expertise or company needs
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-brand-50 text-brand-600 mb-6">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Connect and Engage</h3>
                <p className="text-muted-foreground">
                  Post or apply to training opportunities through our secure marketplace
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-brand-50 text-brand-600 mb-6">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Build Your Reputation</h3>
                <p className="text-muted-foreground">
                  Complete projects and earn verified reviews to grow your professional reputation
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Why Choose TrainerTrust</h2>
              <p className="text-xl text-muted-foreground mt-4">
                Built specifically for the technical training industry
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {landingFeatures.map((feature, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="pt-6 pb-6">
                    <div className="rounded-full bg-brand-100 w-12 h-12 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-brand-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-brand-600 rounded-lg text-white">
                <h3 className="text-2xl font-bold mb-4">For Trainers</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <Check className="h-6 w-6 mr-2 flex-shrink-0" />
                    <span>Find legitimate training opportunities that match your expertise</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 mr-2 flex-shrink-0" />
                    <span>Build your professional reputation through verified reviews</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 mr-2 flex-shrink-0" />
                    <span>Secure contracts and reliable payments for your services</span>
                  </li>
                </ul>
                <Button className="mt-6 bg-white text-brand-600 hover:bg-gray-100" asChild>
                  <a href="/register">
                    Join as a Trainer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              
              <div className="p-8 bg-teal-600 rounded-lg text-white">
                <h3 className="text-2xl font-bold mb-4">For Companies</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <Check className="h-6 w-6 mr-2 flex-shrink-0" />
                    <span>Access a network of qualified, verified technical trainers</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 mr-2 flex-shrink-0" />
                    <span>Review trainer profiles, ratings, and past performance</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 mr-2 flex-shrink-0" />
                    <span>Standardized contracts and transparent processes</span>
                  </li>
                </ul>
                <Button className="mt-6 bg-white text-teal-600 hover:bg-gray-100" asChild>
                  <a href="/register">
                    Join as a Company
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">What Our Users Say</h2>
              <p className="text-xl text-muted-foreground mt-4">
                Success stories from the TrainerTrust community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-muted/30 p-8 rounded-lg border">
                  <div className="flex mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 px-4 bg-brand-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform how you connect in the training industry?</h2>
            <p className="text-xl mb-8 text-brand-100">
              Join TrainerTrust today and become part of a trusted community of training professionals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100" asChild>
                <a href="/register">Create Your Account</a>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-brand-700" asChild>
                <a href="/login">Sign In</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TrainerTrust</h3>
              <p className="text-gray-400">
                The trusted marketplace for technical trainers and training companies.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="/how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="/help" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="/resources" className="text-gray-400 hover:text-white">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2023 TrainerTrust. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
