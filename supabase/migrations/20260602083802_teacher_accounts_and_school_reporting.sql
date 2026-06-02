CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  school_id UUID REFERENCES public.schools(id) ON DELETE RESTRICT NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assessment_sessions
  ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_teacher_profiles_user ON public.teacher_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_school ON public.teacher_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_school ON public.assessment_sessions(school_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_teacher ON public.assessment_sessions(teacher_id);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_teacher_profiles_updated_at
  BEFORE UPDATE ON public.teacher_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.is_teacher_for_school(_user_id UUID, _school_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.teacher_profiles
    WHERE user_id = _user_id
      AND school_id = _school_id
  )
$$;

DROP POLICY IF EXISTS "Admins can view all schools" ON public.schools;
DROP POLICY IF EXISTS "Teachers can view own school" ON public.schools;
DROP POLICY IF EXISTS "Admins can manage teacher profiles" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can view own profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can view school sessions" ON public.assessment_sessions;
DROP POLICY IF EXISTS "Teachers can update own created sessions" ON public.assessment_sessions;
DROP POLICY IF EXISTS "Teachers can view school answers" ON public.assessment_answers;

CREATE POLICY "Admins can view all schools"
  ON public.schools
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view own school"
  ON public.schools
  FOR SELECT
  USING (public.is_teacher_for_school(auth.uid(), id));

CREATE POLICY "Admins can manage teacher profiles"
  ON public.teacher_profiles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view own profile"
  ON public.teacher_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view school sessions"
  ON public.assessment_sessions
  FOR SELECT
  USING (
    school_id IS NOT NULL
    AND public.is_teacher_for_school(auth.uid(), school_id)
  );

CREATE POLICY "Teachers can update own created sessions"
  ON public.assessment_sessions
  FOR UPDATE
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can view school answers"
  ON public.assessment_answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.assessment_sessions s
      WHERE s.id = assessment_answers.session_id
        AND s.school_id IS NOT NULL
        AND public.is_teacher_for_school(auth.uid(), s.school_id)
    )
  );
