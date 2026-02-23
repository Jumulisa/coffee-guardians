-- Coffee Guardian Database Schema
-- Run this SQL in Supabase SQL Editor to create the required tables

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  avatar_url text,
  language text DEFAULT 'en'::text,
  notifications_enabled boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create diagnosis_history table
CREATE TABLE IF NOT EXISTS public.diagnosis_history (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  image_url text NOT NULL,
  disease_name text NOT NULL,
  confidence numeric NOT NULL,
  severity text NOT NULL,
  affected_area numeric NOT NULL,
  treatment_action text NOT NULL,
  treatment_duration text,
  estimated_cost text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  language text DEFAULT 'en'::text,
  notifications_enabled boolean DEFAULT true,
  theme_preference text DEFAULT 'light'::text,
  auto_save_history boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (user_id)
) TABLESPACE pg_default;

-- Create diseases table
CREATE TABLE IF NOT EXISTS public.diseases (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  name_rw text NOT NULL,
  description text NOT NULL,
  description_rw text NOT NULL,
  symptoms text NOT NULL,
  symptoms_rw text NOT NULL,
  treatment text NOT NULL,
  treatment_rw text NOT NULL,
  prevention text NOT NULL,
  prevention_rw text NOT NULL,
  estimated_cost text NOT NULL,
  severity_levels text[] DEFAULT ARRAY['mild'::text, 'moderate'::text, 'severe'::text],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS diagnosis_history_user_id_idx 
  ON public.diagnosis_history (user_id);

CREATE INDEX IF NOT EXISTS diagnosis_history_created_at_idx 
  ON public.diagnosis_history (created_at DESC);

CREATE INDEX IF NOT EXISTS user_settings_user_id_idx 
  ON public.user_settings (user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create RLS Policies for diagnosis_history
CREATE POLICY "Users can view their own diagnosis history"
  ON public.diagnosis_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create diagnosis history"
  ON public.diagnosis_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnosis history"
  ON public.diagnosis_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS Policies for user_settings
CREATE POLICY "Users can view their own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS Policies for diseases (public read)
CREATE POLICY "Anyone can view diseases"
  ON public.diseases FOR SELECT
  USING (true);

-- Insert reference disease data
INSERT INTO public.diseases (name, name_rw, description, description_rw, symptoms, symptoms_rw, treatment, treatment_rw, prevention, prevention_rw, estimated_cost)
VALUES
  ('Healthy', 'Neza', 
   'Coffee plant is healthy with no visible signs of disease', 
   'Ikinini cy''inzira nta neza ki vyira',
   'Green leaves, normal growth, no discoloration', 
   'Amababi ahuye, imbuto nziza, ntaremezo',
   'Continue regular maintenance', 
   'Komeza ibikorwa bya miharire',
   'Monitor regularly, maintain proper pruning and spacing', 
   'Suza amababi, kurungira neza, gukengera intera',
   'Low'),
  ('Red Spider Mite', 'Ubwukunzi', 
   'Spider mite infestation causing leaf damage and discoloration', 
   'Ubwukunzi bushira amababi n''akabwanisha',
   'Fine webbing on leaves, yellow spots, leaf curling, overall yellowing', 
   'Intambara benshi murubage, dodo rumbi, amababi aguye',
   'Apply acaricide spray every 7-10 days for 3-4 weeks', 
   'Kwamo inzira y''urugo buri 7-10 ignye mu mahoro atatu cyangwa ine',
   'Maintain high humidity, remove infested leaves, improve air circulation', 
   'Kurungira amazi menshi, kurota amababi ababwaniye, kurungira umuyaga',
   'Medium'),
  ('Rust', 'Isigiire', 
   'Fungal disease causing rust-colored pustules on leaves', 
   'Indwara ya fungus ikatera isigiire kuri amababi',
   'Rust-colored spots on leaf undersides, powdery orange coating, leaf yellowing', 
   'Isigiire ku rutindi rw''amababi, intambara y''ivuluni, amababi aguye',
   'Apply fungicide spray (sulfur or copper-based) every 7-10 days', 
   'Kwamo inzira ya fungicide buri 7-10 ignye',
   'Ensure good air circulation, reduce leaf wetness, remove infected leaves', 
   'Kurungira umuyaga, gukuza amababi arashye, kurota amababi ababwaniye',
   'Low');
