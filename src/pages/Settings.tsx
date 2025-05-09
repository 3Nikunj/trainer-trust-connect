
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserNav } from "@/components/shared/UserNav";
import { MainNav } from "@/components/shared/MainNav";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SkillsExpertiseForm } from "@/components/settings/SkillsExpertiseForm";
import { Upload } from "lucide-react";

// Define a proper type for profile data
interface ProfileData {
  avatar_url: string | null;
  bio: string | null;
  company_size: string | null;
  created_at: string;
  founded_year: string | null;
  full_name: string | null;
  hourly_rate: string | null;
  id: string;
  location: string | null;
  role: string | null;
  skills: string[] | null;
  title: string | null;
  training_philosophy: string | null;
  updated_at: string;
  username: string | null;
  website: string | null;
  experience: string | null;
  certifications: any[] | null;
}

const Settings = () => {
  const { user, setUser } = useContext(UserContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const isCompany = user?.role === "company";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Different form state based on user role
  const [profileForm, setProfileForm] = useState({
    // Common fields
    name: user?.name || "",
    email: user?.email || "",
    title: "",
    bio: "",
    location: "",
    website: "",
    
    // Company-specific fields
    companySize: "",
    foundedYear: "",
    trainingPhilosophy: "",
    
    // Trainer-specific fields
    hourlyRate: "",
    skills: [] as string[]
  });
  
  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        // Update form with profile data if available
        if (data) {
          const profileData = data as ProfileData;
          setProfileForm(prev => ({
            ...prev,
            name: profileData.full_name || prev.name,
            title: profileData.title || prev.title,
            bio: profileData.bio || prev.bio,
            location: profileData.location || prev.location,
            website: profileData.website || prev.website,
            companySize: isCompany ? (profileData.company_size || prev.companySize) : prev.companySize,
            foundedYear: isCompany ? (profileData.founded_year || prev.foundedYear) : prev.foundedYear,
            trainingPhilosophy: isCompany ? (profileData.training_philosophy || prev.trainingPhilosophy) : prev.trainingPhilosophy,
            hourlyRate: !isCompany ? (profileData.hourly_rate || prev.hourlyRate) : prev.hourlyRate,
            skills: !isCompany && profileData.skills ? profileData.skills : prev.skills
          }));
          
          // Set avatar preview if available
          if (profileData.avatar_url) {
            setAvatarPreview(profileData.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    fetchProfileData();
  }, [user?.id, isCompany]);
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      messages: true,
      applications: true,
      reviews: true,
      systemUpdates: false
    },
    inApp: {
      messages: true,
      applications: true,
      reviews: true,
      systemUpdates: true
    }
  });
  
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };
  
  const handleNotificationChange = (category: string, type: 'email' | 'inApp', checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [type]: {
        ...notificationSettings[type],
        [category]: checked
      }
    });
  };
  
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityForm({ ...securityForm, [name]: value });
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, GIF, or WebP)."
        });
        return;
      }
      
      // 5MB max file size
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Avatar image must be less than 5MB."
        });
        return;
      }
      
      setAvatarFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };
  
  // Handle clicking the avatar to open file selection
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle avatar upload and profile update
  const uploadAvatar = async () => {
    if (!avatarFile || !user?.id) return null;
    
    try {
      setIsUploading(true);
      
      // Create a unique file path for the avatar
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return publicUrlData?.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your avatar."
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    try {
      let avatarUrl = null;
      
      // If there's a new avatar file, upload it first
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
        if (!avatarUrl) {
          // If avatar upload failed, show error but continue with other profile updates
          toast({
            variant: "destructive",
            title: "Avatar upload failed",
            description: "Your profile will be updated without the new avatar."
          });
        }
      }
      
      // Update profile data in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileForm.name,
          title: profileForm.title,
          bio: profileForm.bio,
          location: profileForm.location,
          website: profileForm.website,
          // Only update avatar_url if we have a new one
          ...(avatarUrl && { avatar_url: avatarUrl }),
          // Include role-specific fields
          ...(isCompany ? {
            company_size: profileForm.companySize,
            founded_year: profileForm.foundedYear,
            training_philosophy: profileForm.trainingPhilosophy,
          } : {
            hourly_rate: profileForm.hourlyRate,
            skills: profileForm.skills,
          })
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local user context
      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          name: profileForm.name,
          avatar: avatarUrl || prev.avatar
        };
      });
      
      // Reset the file input
      setAvatarFile(null);
      
      toast({
        title: "Profile updated",
        description: "Your profile changes have been saved."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile."
      });
    }
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved."
    });
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "New password and confirmation password must match."
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: securityForm.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed."
      });
      
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: error.message || "There was an error updating your password."
      });
    }
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Account Settings</h1>
              <p className="text-muted-foreground">
                Manage your account preferences and settings
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex mb-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              {/* Profile Settings */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{isCompany ? "Company Profile" : "Public Profile"}</CardTitle>
                    <CardDescription>
                      {isCompany 
                        ? "Information about your company that will be visible to trainers"
                        : "This information will be shown publicly on your profile page"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <Avatar className="h-24 w-24 border-2 border-dashed border-gray-300 group-hover:border-brand-500">
                          <AvatarImage 
                            src={avatarPreview || user?.avatar || "/placeholder.svg"} 
                            alt={user?.name || "User"} 
                          />
                          <AvatarFallback>
                            {user?.name?.slice(0, 2).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                        <input 
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Profile Photo</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click on the avatar to upload a new photo
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">{isCompany ? "Company Name" : "Full Name"}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          disabled
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title">{isCompany ? "Company Tagline" : "Title / Position"}</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder={isCompany ? "e.g., Enterprise Training Solutions" : "e.g., Frontend Development Trainer"}
                          value={profileForm.title}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="e.g., San Francisco, CA"
                          value={profileForm.location}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          placeholder="https://yourwebsite.com"
                          value={profileForm.website}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      {isCompany && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="companySize">Company Size</Label>
                            <Input
                              id="companySize"
                              name="companySize"
                              placeholder="e.g., 10-50 employees"
                              value={profileForm.companySize}
                              onChange={handleProfileChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="foundedYear">Founded Year</Label>
                            <Input
                              id="foundedYear"
                              name="foundedYear"
                              placeholder="e.g., 2010"
                              value={profileForm.foundedYear}
                              onChange={handleProfileChange}
                            />
                          </div>
                        </>
                      )}
                      
                      {!isCompany && (
                        <div className="space-y-2">
                          <Label htmlFor="hourlyRate">Hourly Rate</Label>
                          <Input
                            id="hourlyRate"
                            name="hourlyRate"
                            placeholder="e.g., $150 - $200"
                            value={profileForm.hourlyRate}
                            onChange={handleProfileChange}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">{isCompany ? "Company Description" : "Bio"}</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder={isCompany 
                            ? "Write about your company, your training offerings, and what makes you unique..."
                            : "Write a short bio about yourself..."}
                          value={profileForm.bio}
                          onChange={handleProfileChange}
                          className="min-h-32"
                        />
                      </div>
                      
                      {isCompany && (
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="trainingPhilosophy">Training Philosophy</Label>
                          <Textarea
                            id="trainingPhilosophy"
                            name="trainingPhilosophy"
                            placeholder="Describe your company's approach to training and education..."
                            value={profileForm.trainingPhilosophy}
                            onChange={handleProfileChange}
                            className="min-h-32"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button 
                      className="bg-brand-600 hover:bg-brand-700"
                      onClick={handleSaveProfile}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
                
                {user?.role === "trainer" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills & Expertise</CardTitle>
                      <CardDescription>
                        Manage your skills, certifications, and experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {user?.id && <SkillsExpertiseForm userId={user.id} />}
                    </CardContent>
                  </Card>
                )}
                
                {user?.role === "company" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Specializations</CardTitle>
                      <CardDescription>
                        Manage your company specializations and target audience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Coming soon: Add and manage your company specializations and target audience.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how and when you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 font-medium text-sm">
                        <div className="col-span-1">Notification Type</div>
                        <div className="text-center">Email</div>
                        <div className="text-center">In-App</div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                          <p className="text-sm font-medium">Messages</p>
                          <p className="text-xs text-muted-foreground">When someone sends you a message</p>
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={notificationSettings.email.messages}
                            onCheckedChange={(checked) => handleNotificationChange('messages', 'email', checked)}
                          />
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={notificationSettings.inApp.messages}
                            onCheckedChange={(checked) => handleNotificationChange('messages', 'inApp', checked)}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                          <p className="text-sm font-medium">Applications</p>
                          <p className="text-xs text-muted-foreground">
                            {user?.role === "trainer" ? "Updates on your job applications" : "When someone applies to your job"}
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={notificationSettings.email.applications}
                            onCheckedChange={(checked) => handleNotificationChange('applications', 'email', checked)}
                          />
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={notificationSettings.inApp.applications}
                            onCheckedChange={(checked) => handleNotificationChange('applications', 'inApp', checked)}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                          <p className="text-sm font-medium">Reviews</p>
                          <p className="text-xs text-muted-foreground">When you receive a new review</p>
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={notificationSettings.email.reviews}
                            onCheckedChange={(checked) => handleNotificationChange('reviews', 'email', checked)}
                          />
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={notificationSettings.inApp.reviews}
                            onCheckedChange={(checked) => handleNotificationChange('reviews', 'inApp', checked)}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-3 items-center">
                        <div className="col-span-1">
                          <p className="text-sm font-medium">System Updates</p>
                          <p className="text-xs text-muted-foreground">Platform announcements and updates</p>
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={notificationSettings.email.systemUpdates}
                            onCheckedChange={(checked) => handleNotificationChange('systemUpdates', 'email', checked)}
                          />
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={notificationSettings.inApp.systemUpdates}
                            onCheckedChange={(checked) => handleNotificationChange('systemUpdates', 'inApp', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button 
                      className="bg-brand-600 hover:bg-brand-700"
                      onClick={handleSaveNotifications}
                    >
                      Save Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to maintain account security
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleChangePassword}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={securityForm.currentPassword}
                          onChange={handleSecurityChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={securityForm.newPassword}
                          onChange={handleSecurityChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={securityForm.confirmPassword}
                          onChange={handleSecurityChange}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button 
                        type="submit"
                        className="bg-brand-600 hover:bg-brand-700"
                      >
                        Change Password
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm">Two-factor authentication is not enabled yet.</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Add a phone number to enable two-factor authentication.
                        </p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Deletion</CardTitle>
                    <CardDescription>
                      Permanently delete your account and all data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

