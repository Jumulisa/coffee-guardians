import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          language: string
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          language?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          language?: string
          notifications_enabled?: boolean
          updated_at?: string
        }
      }
      diagnosis_history: {
        Row: {
          id: string
          user_id: string
          image_url: string
          disease_name: string
          confidence: number
          severity: string
          affected_area: number
          treatment_action: string
          treatment_duration: string | null
          estimated_cost: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          disease_name: string
          confidence: number
          severity: string
          affected_area: number
          treatment_action: string
          treatment_duration?: string | null
          estimated_cost?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          image_url?: string
          disease_name?: string
          confidence?: number
          severity?: string
          affected_area?: number
          treatment_action?: string
          treatment_duration?: string | null
          estimated_cost?: string | null
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          language: string
          notifications_enabled: boolean
          theme_preference: string
          auto_save_history: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language?: string
          notifications_enabled?: boolean
          theme_preference?: string
          auto_save_history?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          language?: string
          notifications_enabled?: boolean
          theme_preference?: string
          auto_save_history?: boolean
          updated_at?: string
        }
      }
      diseases: {
        Row: {
          id: string
          name: string
          name_rw: string
          description: string
          description_rw: string
          symptoms: string
          symptoms_rw: string
          treatment: string
          treatment_rw: string
          prevention: string
          prevention_rw: string
          estimated_cost: string
          severity_levels: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_rw: string
          description: string
          description_rw: string
          symptoms: string
          symptoms_rw: string
          treatment: string
          treatment_rw: string
          prevention: string
          prevention_rw: string
          estimated_cost: string
          severity_levels: string[]
          created_at?: string
        }
        Update: {
          name?: string
          name_rw?: string
          description?: string
          description_rw?: string
          symptoms?: string
          symptoms_rw?: string
          treatment?: string
          treatment_rw?: string
          prevention?: string
          prevention_rw?: string
          estimated_cost?: string
          severity_levels?: string[]
        }
      }
    }
  }
}
