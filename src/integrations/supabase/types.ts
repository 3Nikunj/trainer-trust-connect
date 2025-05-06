export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      job_applications: {
        Row: {
          cover_note: string | null
          created_at: string
          id: string
          job_id: string
          status: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          cover_note?: string | null
          created_at?: string
          id?: string
          job_id: string
          status?: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          cover_note?: string | null
          created_at?: string
          id?: string
          job_id?: string
          status?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_count: number | null
          audience: string | null
          company: string
          company_id: string
          company_rating: number | null
          created_at: string | null
          description: string
          duration: string | null
          id: string
          location: string | null
          location_type: string | null
          rate: string | null
          rate_type: string | null
          requirements: string[] | null
          responsibilities: string[] | null
          skills: string[] | null
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_count?: number | null
          audience?: string | null
          company: string
          company_id: string
          company_rating?: number | null
          created_at?: string | null
          description: string
          duration?: string | null
          id?: string
          location?: string | null
          location_type?: string | null
          rate?: string | null
          rate_type?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          skills?: string[] | null
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_count?: number | null
          audience?: string | null
          company?: string
          company_id?: string
          company_rating?: number | null
          created_at?: string | null
          description?: string
          duration?: string | null
          id?: string
          location?: string | null
          location_type?: string | null
          rate?: string | null
          rate_type?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          skills?: string[] | null
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company_size: string | null
          created_at: string
          founded_year: string | null
          full_name: string | null
          hourly_rate: string | null
          id: string
          location: string | null
          role: string | null
          skills: string[] | null
          title: string | null
          training_philosophy: string | null
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company_size?: string | null
          created_at?: string
          founded_year?: string | null
          full_name?: string | null
          hourly_rate?: string | null
          id: string
          location?: string | null
          role?: string | null
          skills?: string[] | null
          title?: string | null
          training_philosophy?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company_size?: string | null
          created_at?: string
          founded_year?: string | null
          full_name?: string | null
          hourly_rate?: string | null
          id?: string
          location?: string | null
          role?: string | null
          skills?: string[] | null
          title?: string | null
          training_philosophy?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          job_title: string
          rating: number
          rating_communication: number | null
          rating_curriculum: number | null
          rating_delivery: number | null
          rating_expertise: number | null
          rating_payment: number | null
          rating_professionalism: number | null
          rating_requirements: number | null
          rating_support: number | null
          review: string
          reviewee_id: string
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_title: string
          rating: number
          rating_communication?: number | null
          rating_curriculum?: number | null
          rating_delivery?: number | null
          rating_expertise?: number | null
          rating_payment?: number | null
          rating_professionalism?: number | null
          rating_requirements?: number | null
          rating_support?: number | null
          review: string
          reviewee_id: string
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          job_title?: string
          rating?: number
          rating_communication?: number | null
          rating_curriculum?: number | null
          rating_delivery?: number | null
          rating_expertise?: number | null
          rating_payment?: number | null
          rating_professionalism?: number | null
          rating_requirements?: number | null
          rating_support?: number | null
          review?: string
          reviewee_id?: string
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_companies: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          email: string
          role: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
