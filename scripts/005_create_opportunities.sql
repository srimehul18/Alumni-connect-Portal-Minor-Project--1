-- Job and internship opportunities
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  type TEXT NOT NULL CHECK (type IN ('job', 'internship')),
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'any')),
  skills_required TEXT[] DEFAULT '{}',
  salary_range TEXT,
  application_url TEXT,
  deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Opportunities are viewable by everyone"
  ON public.opportunities FOR SELECT
  USING (true);

CREATE POLICY "Alumni can create opportunities"
  ON public.opportunities FOR INSERT
  WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Users can update their own opportunities"
  ON public.opportunities FOR UPDATE
  USING (auth.uid() = posted_by);

CREATE POLICY "Users can delete their own opportunities"
  ON public.opportunities FOR DELETE
  USING (auth.uid() = posted_by);
