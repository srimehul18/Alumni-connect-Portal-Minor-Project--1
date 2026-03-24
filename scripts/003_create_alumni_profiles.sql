-- Alumni-specific profile data
CREATE TABLE IF NOT EXISTS public.alumni_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  graduation_year INTEGER,
  branch TEXT,
  company TEXT,
  job_title TEXT,
  experience_years INTEGER,
  skills TEXT[] DEFAULT '{}',
  expertise_areas TEXT[] DEFAULT '{}',
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  is_mentor_available BOOLEAN DEFAULT FALSE,
  mentorship_areas TEXT[] DEFAULT '{}',
  max_mentees INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Alumni profiles are viewable by everyone"
  ON public.alumni_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own alumni profile"
  ON public.alumni_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alumni profile"
  ON public.alumni_profiles FOR UPDATE
  USING (auth.uid() = user_id);
