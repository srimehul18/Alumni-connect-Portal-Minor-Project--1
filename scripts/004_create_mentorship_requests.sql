-- Mentorship requests
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, alumni_id)
);

-- Enable RLS
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own mentorship requests"
  ON public.mentorship_requests FOR SELECT
  USING (auth.uid() = student_id OR auth.uid() = alumni_id);

CREATE POLICY "Students can create mentorship requests"
  ON public.mentorship_requests FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Alumni can update mentorship requests sent to them"
  ON public.mentorship_requests FOR UPDATE
  USING (auth.uid() = alumni_id);

CREATE POLICY "Students can delete their own requests"
  ON public.mentorship_requests FOR DELETE
  USING (auth.uid() = student_id);
