
import { supabase } from "@/integrations/supabase/client";
import { asUUID } from "@/utils/supabaseHelpers";

export type Job = {
  id: string;
  title: string;
  description: string;
  company: string;
  companyId: string;
  location: string;
  locationType: string;
  rate: string;
  rateType: string;
  duration: string;
  startDate: string;
  audience?: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  postedDate: string;
  applicationCount: number;
  companyRating: number;
};

export const createJob = async (job: Omit<Job, "id" | "postedDate" | "applicationCount" | "companyRating">) => {
  try {
    console.log("Attempting to create job with data:", job);
    
    // Create a properly formatted insert object
    const jobInsert = {
      title: job.title,
      description: job.description,
      company: job.company,
      company_id: asUUID(job.companyId),
      location: job.location || "",
      location_type: job.locationType || "Remote",
      rate: job.rate || "",
      rate_type: job.rateType || "",
      duration: job.duration || "",
      start_date: job.startDate || "",
      audience: job.audience || "",
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
      skills: Array.isArray(job.skills) ? job.skills : []
    };
    
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobInsert)
      .select();
    
    if (error) {
      console.error("Supabase error creating job:", error);
      throw error;
    }
    
    console.log("Job created successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error creating job:", error);
    return { success: false, error };
  }
};

export const getJobs = async (isCompany = false, userId?: string) => {
  try {
    let query = supabase
      .from('jobs')
      .select('*');
    
    if (isCompany && userId) {
      query = query.eq("company_id", asUUID(userId));
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return data.map((job: any) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      company: job.company,
      companyId: job.company_id,
      location: job.location,
      locationType: job.location_type,
      rate: job.rate,
      rateType: job.rate_type,
      duration: job.duration,
      startDate: job.start_date,
      audience: job.audience,
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
      skills: job.skills || [],
      postedDate: new Date(job.created_at).toLocaleString(),
      applicationCount: job.application_count || 0,
      companyRating: job.company_rating || 4.5
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export const applyForJob = async (jobId: string, coverNote?: string) => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "You must be logged in to apply for jobs" };
    }
    
    // Check if the user has already applied for this job
    const { data: existingApplication, error: checkError } = await supabase
      .from('job_applications')
      .select()
      .eq('job_id', asUUID(jobId))
      .eq('trainer_id', asUUID(user.id))
      .single();

    if (existingApplication) {
      return { success: false, error: "You have already applied for this job" };
    }

    // If no existing application, create a new one
    const applicationData = {
      job_id: asUUID(jobId),
      trainer_id: asUUID(user.id),
      cover_note: coverNote
    };
    
    const { data, error } = await supabase
      .from('job_applications')
      .insert(applicationData)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error applying for job:", error);
    return { success: false, error };
  }
};

export const cancelJobApplication = async (applicationId: string) => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "You must be logged in to cancel applications" };
    }
    
    // Delete the application
    const { data, error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', asUUID(applicationId))
      .eq('trainer_id', asUUID(user.id)) // Ensure the user can only cancel their own applications
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error canceling job application:", error);
    return { success: false, error };
  }
};
