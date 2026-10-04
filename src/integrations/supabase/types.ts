export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string
          category: string
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          pinned: boolean
          published_on: string
          title: string
          updated_at: string
          urgent: boolean
        }
        Insert: {
          body?: string
          category?: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          pinned?: boolean
          published_on?: string
          title: string
          updated_at?: string
          urgent?: boolean
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          pinned?: boolean
          published_on?: string
          title?: string
          updated_at?: string
          urgent?: boolean
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          description: string
          file_name: string | null
          file_url: string | null
          id: string
          published_on: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          published_on?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          published_on?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string
          created_at: string
          description: string
          event_date: string
          event_time: string | null
          file_name: string | null
          file_url: string | null
          id: string
          image_url: string | null
          location: string | null
          map_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          event_date?: string
          event_time?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          map_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          event_date?: string
          event_time?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          map_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          contact: string | null
          created_at: string
          id: string
          kind: string
          message: string
          name: string
          resolved: boolean
        }
        Insert: {
          contact?: string | null
          created_at?: string
          id?: string
          kind?: string
          message: string
          name: string
          resolved?: boolean
        }
        Update: {
          contact?: string | null
          created_at?: string
          id?: string
          kind?: string
          message?: string
          name?: string
          resolved?: boolean
        }
        Relationships: []
      }
      gallery: {
        Row: {
          album: string
          caption: string
          created_at: string
          id: string
          media_type: string
          media_url: string
          updated_at: string
        }
        Insert: {
          album?: string
          caption?: string
          created_at?: string
          id?: string
          media_type?: string
          media_url: string
          updated_at?: string
        }
        Update: {
          album?: string
          caption?: string
          created_at?: string
          id?: string
          media_type?: string
          media_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          action_plan: string
          agenda: string
          attendance: string
          created_at: string
          decisions: string
          file_name: string | null
          file_url: string | null
          id: string
          meeting_date: string
          minutes: string
          title: string
          updated_at: string
        }
        Insert: {
          action_plan?: string
          agenda?: string
          attendance?: string
          created_at?: string
          decisions?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          meeting_date?: string
          minutes?: string
          title: string
          updated_at?: string
        }
        Update: {
          action_plan?: string
          agenda?: string
          attendance?: string
          created_at?: string
          decisions?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          meeting_date?: string
          minutes?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      past_sarpanches: {
        Row: {
          created_at: string
          details: string
          id: string
          major_works: string
          name: string
          photo_url: string | null
          term_from: string
          term_to: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string
          id?: string
          major_works?: string
          name: string
          photo_url?: string | null
          term_from?: string
          term_to?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string
          id?: string
          major_works?: string
          name?: string
          photo_url?: string | null
          term_from?: string
          term_to?: string
          updated_at?: string
        }
        Relationships: []
      }
      population_records: {
        Row: {
          created_at: string
          female: number
          households: number
          id: string
          male: number
          notes: string
          total: number
          updated_at: string
          voters: number
          ward: string
        }
        Insert: {
          created_at?: string
          female?: number
          households?: number
          id?: string
          male?: number
          notes?: string
          total?: number
          updated_at?: string
          voters?: number
          ward?: string
        }
        Update: {
          created_at?: string
          female?: number
          households?: number
          id?: string
          male?: number
          notes?: string
          total?: number
          updated_at?: string
          voters?: number
          ward?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          photo_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          phone?: string | null
          photo_url?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number
          category: string
          completion_date: string | null
          created_at: string
          description: string
          file_url: string | null
          id: string
          image_url: string | null
          name: string
          progress: number
          section: string
          spent: number
          status: string
          updated_at: string
        }
        Insert: {
          budget?: number
          category?: string
          completion_date?: string | null
          created_at?: string
          description?: string
          file_url?: string | null
          id?: string
          image_url?: string | null
          name: string
          progress?: number
          section?: string
          spent?: number
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: number
          category?: string
          completion_date?: string | null
          created_at?: string
          description?: string
          file_url?: string | null
          id?: string
          image_url?: string | null
          name?: string
          progress?: number
          section?: string
          spent?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      useful_links: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          title: string
          updated_at?: string
          url?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      village_profile: {
        Row: {
          agriculture: string
          commitment_statement: string
          contact_email: string
          contact_phone: string
          culture: string
          education: string
          funds: Json
          geography: string
          healthcare: string
          history: string
          id: string
          landmarks: string
          map_url: string
          name: string
          office_address: string
          office_hours: string
          sarpanch_address: string
          sarpanch_designation: string
          sarpanch_education: string
          sarpanch_email: string
          sarpanch_message: string
          sarpanch_name: string
          sarpanch_phone: string
          sarpanch_photo: string
          sarpanch_term: string
          sarpanch_ward: string
          slogan: string
          stats: Json
          timeline: Json
          updated_at: string
          welcome_message: string
        }
        Insert: {
          agriculture?: string
          commitment_statement?: string
          contact_email?: string
          contact_phone?: string
          culture?: string
          education?: string
          funds?: Json
          geography?: string
          healthcare?: string
          history?: string
          id?: string
          landmarks?: string
          map_url?: string
          name?: string
          office_address?: string
          office_hours?: string
          sarpanch_address?: string
          sarpanch_designation?: string
          sarpanch_education?: string
          sarpanch_email?: string
          sarpanch_message?: string
          sarpanch_name?: string
          sarpanch_phone?: string
          sarpanch_photo?: string
          sarpanch_term?: string
          sarpanch_ward?: string
          slogan?: string
          stats?: Json
          timeline?: Json
          updated_at?: string
          welcome_message?: string
        }
        Update: {
          agriculture?: string
          commitment_statement?: string
          contact_email?: string
          contact_phone?: string
          culture?: string
          education?: string
          funds?: Json
          geography?: string
          healthcare?: string
          history?: string
          id?: string
          landmarks?: string
          map_url?: string
          name?: string
          office_address?: string
          office_hours?: string
          sarpanch_address?: string
          sarpanch_designation?: string
          sarpanch_education?: string
          sarpanch_email?: string
          sarpanch_message?: string
          sarpanch_name?: string
          sarpanch_phone?: string
          sarpanch_photo?: string
          sarpanch_term?: string
          sarpanch_ward?: string
          slogan?: string
          stats?: Json
          timeline?: Json
          updated_at?: string
          welcome_message?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "citizen"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "citizen"],
    },
  },
} as const
