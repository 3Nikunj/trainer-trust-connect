
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { asUUID } from "@/utils/supabaseHelpers";

// Interface for profile data
interface ProfileData {
  id: string;
  full_name: string | null;
  title: string | null;
  avatar_url: string | null;
}

interface Applicant {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerTitle: string;
  avatar?: string;
  status: string;
  date: string;
  coverNote?: string;
}

export const useJobApplicants = (selectedJobId: string | null, isCompany: boolean) => {
  const [jobApplicants, setJobApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    const fetchJobApplicants = async () => {
      if (!selectedJobId) {
        setJobApplicants([]);
        return;
      }

      try {
        // Fetch applications for the selected job
        const { data: applications, error } = await supabase
          .from('job_applications')
          .select(`
            id,
            status,
            created_at,
            cover_note,
            trainer_id
          `)
          .eq('job_id', asUUID(selectedJobId))
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // If we have applications, fetch the corresponding profiles
        if (applications && applications.length > 0) {
          // Get all trainer IDs to fetch their profiles
          const trainerIds = applications.map(app => app.trainer_id);
          
          // Fetch profiles for the trainers
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, title, avatar_url')
            .in('id', trainerIds);
            
          if (profilesError) {
            throw profilesError;
          }

          // Map applications with their corresponding profiles
          const applicantsWithProfiles = applications.map(app => {
            // Properly type the profile with defaults if not found
            const profile = profiles?.find(p => p.id === app.trainer_id) as ProfileData | undefined;
            
            return {
              id: app.id,
              trainerId: app.trainer_id,
              trainerName: profile?.full_name || 'Unknown',
              trainerTitle: profile?.title || 'Trainer',
              avatar: profile?.avatar_url || undefined,
              status: app.status,
              date: new Date(app.created_at).toLocaleDateString(),
              coverNote: app.cover_note
            };
          });
          
          setJobApplicants(applicantsWithProfiles);
        } else {
          setJobApplicants([]);
        }
      } catch (error) {
        console.error('Error fetching job applicants:', error);
        setJobApplicants([]);
      }
    };

    if (isCompany && selectedJobId) {
      fetchJobApplicants();
    }
  }, [selectedJobId, isCompany]);

  return { jobApplicants };
};
