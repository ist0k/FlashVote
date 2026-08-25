export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      poll_options: {
        Row: {
          created_at: string
          id: string
          label: string
          poll_id: string
          position: number
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          poll_id: string
          position: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          poll_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_results: {
        Row: {
          option_id: string
          poll_id: string
          updated_at: string
          vote_count: number
        }
        Insert: {
          option_id: string
          poll_id: string
          updated_at?: string
          vote_count?: number
        }
        Update: {
          option_id?: string
          poll_id?: string
          updated_at?: string
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "poll_results_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: true
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_results_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          owner_id: string
          question: string
          slug: string
          status: Database["public"]["Enums"]["poll_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          owner_id: string
          question: string
          slug: string
          status?: Database["public"]["Enums"]["poll_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          owner_id?: string
          question?: string
          slug?: string
          status?: Database["public"]["Enums"]["poll_status"]
          updated_at?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          id: string
          option_id: string
          poll_id: string
          voter_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          poll_id: string
          voter_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          poll_id?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cast_vote: {
        Args: { p_option_id: string; p_slug: string }
        Returns: Json
      }
      change_vote: {
        Args: { p_option_id: string; p_slug: string }
        Returns: Json
      }
      create_poll: {
        Args: { p_expires_at?: string; p_options: string[]; p_question: string }
        Returns: string
      }
      generate_poll_slug: { Args: never; Returns: string }
    }
    Enums: {
      poll_status: "open" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

export type Tables<
  TableName extends keyof DatabaseWithoutInternals["public"]["Tables"],
> = DatabaseWithoutInternals["public"]["Tables"][TableName]["Row"]

export type Enums = DatabaseWithoutInternals["public"]["Enums"]
