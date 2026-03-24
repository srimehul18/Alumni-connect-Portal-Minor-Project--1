-- Student-specific profile data
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  enrollment_year INTEGER,
  expected_graduation INTEGER,
  branch TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Student profiles are viewable by everyone"
  ON public.student_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own student profile"
  ON public.student_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student profile"
  ON public.student_profiles FOR UPDATE
  USING (auth.uid() = user_id);
