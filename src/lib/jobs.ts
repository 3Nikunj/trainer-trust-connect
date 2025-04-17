
import { supabase } from "@/integrations/supabase/client";

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
    // Using 'any' type to bypass TypeScript limitations with Supabase tables not in types.ts
    // Add console logging to track insertion process
    console.log("Attempting to create job with data:", job);
    
    const { data, error } = await supabase
      .from('jobs' as any)
      .insert({
        title: job.title,
        description: job.description,
        company: job.company,
        company_id: job.companyId,
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
      })
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
    // Using 'any' type to bypass TypeScript limitations with Supabase tables not in types.ts
    let query = supabase.from('jobs' as any).select('*');
    
    if (isCompany && userId) {
      query = query.eq("company_id", userId);
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
