
export type Profile = {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
};

export type Review = {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  job_title: string;
  rating: number;
  review: string;
  created_at: string;
  categories?: Record<string, number>;
  reviewerName?: string;
  revieweeName?: string;
  reviewerAvatar?: string;
  revieweeAvatar?: string;
};

export interface ReviewFormValues {
  revieweeId: string;
  jobTitle: string;
  review: string;
  rating: number;
  categories: Record<string, number>;
}
