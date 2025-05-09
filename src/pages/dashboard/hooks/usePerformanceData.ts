
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface PerformanceData {
  month: string;
  applications: number;
  interviews: number;
}

export const usePerformanceData = (userId: string | undefined) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Create an array for the last 6 months
        const months = Array.from({ length: 6 }, (_, i) => {
          const date = subMonths(new Date(), i);
          return {
            month: format(date, "MMM"),
            startDate: startOfMonth(date),
            endDate: endOfMonth(date),
          };
        }).reverse();

        const result = [];

        // For each month, fetch application and interview data
        for (const monthData of months) {
          // Get applications count for this month
          const { count: applicationsCount, error: applicationsError } = 
            await supabase
              .from('job_applications')
              .select('*', { count: 'exact', head: true })
              .eq('trainer_id', userId as string)
              .gte('created_at', monthData.startDate.toISOString())
              .lte('created_at', monthData.endDate.toISOString());

          if (applicationsError) {
            console.error(`Error fetching applications for ${monthData.month}:`, applicationsError);
          }

          // Get interviews count (applications with status 'interview')
          const { count: interviewsCount, error: interviewsError } = 
            await supabase
              .from('job_applications')
              .select('*', { count: 'exact', head: true })
              .eq('trainer_id', userId as string)
              .eq('status', 'interview')
              .gte('created_at', monthData.startDate.toISOString())
              .lte('created_at', monthData.endDate.toISOString());

          if (interviewsError) {
            console.error(`Error fetching interviews for ${monthData.month}:`, interviewsError);
          }

          result.push({
            month: monthData.month,
            applications: applicationsCount || 0,
            interviews: interviewsCount || 0,
          });
        }

        setPerformanceData(result);
      } catch (error) {
        console.error("Error in performance data fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [userId]);

  return { performanceData, loading };
};
