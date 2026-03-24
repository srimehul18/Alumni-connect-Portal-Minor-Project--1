-- Saved/bookmarked alumni
CREATE TABLE IF NOT EXISTS public.saved_alumni (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, alumni_id)
);

-- Enable RLS
ALTER TABLE public.saved_alumni ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own saved alumni"
  ON public.saved_alumni FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Users can save alumni"
  ON public.saved_alumni FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can unsave alumni"
  ON public.saved_alumni FOR DELETE
  USING (auth.uid() = student_id);
