DROP POLICY IF EXISTS "Valid assessment sessions can be created" ON public.assessment_sessions;
DROP POLICY IF EXISTS "Valid answers can be created" ON public.assessment_answers;

CREATE POLICY "Anonymous users can create assessment sessions"
  ON public.assessment_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    student_name IS NOT NULL
    AND LENGTH(TRIM(student_name)) > 0
  );

CREATE POLICY "Anonymous users can create assessment answers"
  ON public.assessment_answers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    session_id IS NOT NULL
    AND question_id IS NOT NULL
    AND score >= 1
    AND score <= max_score
    AND max_score > 0
  );
