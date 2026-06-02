import { useState, useCallback, useRef } from 'react';
import { questions, Question, SkillType, emotionAbilityInfo } from '@/data/questions';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export interface SkillScore {
  skill: SkillType;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface AbilityLevel {
  name: string;
  nameEn: string;
  level: 'high' | 'medium' | 'support';
  percentage: number;
}

export interface AssessmentResult {
  skillScores: SkillScore[];
  abilityLevels: AbilityLevel[];
  completedAt: Date;
  studentName: string;
}

export type AssessmentPhase = 'landing' | 'assessment' | 'results';

interface UseAssessmentOptions {
  schoolId?: string;
  schoolName?: string;
  teacherId?: string;
}

export function useAssessment(options: UseAssessmentOptions = {}) {
  const [phase, setPhase] = useState<AssessmentPhase>('landing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const { language } = useLanguage();

  const currentQuestion: Question | undefined = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  const startAssessment = useCallback(async (name: string, studentClassInput?: string, schoolInput?: string) => {
    setStudentName(name);
    setStudentClass(studentClassInput || '');
    setSchoolName(schoolInput || '');
    setCurrentQuestionIndex(0);
    setAnswers({});
    startTimeRef.current = new Date();

    setPhase('assessment');
  }, [language]);

  const answerQuestion = useCallback((questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const calculateResults = useCallback((): AssessmentResult => {
    // Calculate skill scores
    const skillScoresMap: Record<SkillType, { total: number; count: number }> = {
      recognizing: { total: 0, count: 0 },
      understanding: { total: 0, count: 0 },
      labeling: { total: 0, count: 0 },
      expressing: { total: 0, count: 0 },
      regulating: { total: 0, count: 0 },
    };

    questions.forEach(q => {
      const score = answers[q.id] || 0;
      skillScoresMap[q.skill].total += score;
      skillScoresMap[q.skill].count += 1;
    });

    const skillScores: SkillScore[] = (Object.keys(skillScoresMap) as SkillType[]).map(skill => {
      const { total, count } = skillScoresMap[skill];
      const maxScore = count * 3; // Max score per question is 3
      const percentage = maxScore > 0 ? Math.round((total / maxScore) * 100) : 0;
      return {
        skill,
        score: total,
        maxScore,
        percentage,
      };
    });

    // Calculate ability levels
    const getAbilityPercentage = (relatedSkills: SkillType[]) => {
      const relatedScores = skillScores.filter(s => relatedSkills.includes(s.skill));
      const avgPercentage = relatedScores.reduce((sum, s) => sum + s.percentage, 0) / relatedScores.length;
      return Math.round(avgPercentage);
    };

    const getLevel = (percentage: number): 'high' | 'medium' | 'support' => {
      if (percentage >= 75) return 'high';
      if (percentage >= 50) return 'medium';
      return 'support';
    };

    const abilityLevels: AbilityLevel[] = [
      {
        name: emotionAbilityInfo.resilience.name,
        nameEn: emotionAbilityInfo.resilience.nameEn,
        percentage: getAbilityPercentage(emotionAbilityInfo.resilience.relatedSkills),
        level: getLevel(getAbilityPercentage(emotionAbilityInfo.resilience.relatedSkills)),
      },
      {
        name: emotionAbilityInfo.agility.name,
        nameEn: emotionAbilityInfo.agility.nameEn,
        percentage: getAbilityPercentage(emotionAbilityInfo.agility.relatedSkills),
        level: getLevel(getAbilityPercentage(emotionAbilityInfo.agility.relatedSkills)),
      },
      {
        name: emotionAbilityInfo.literacy.name,
        nameEn: emotionAbilityInfo.literacy.nameEn,
        percentage: getAbilityPercentage(emotionAbilityInfo.literacy.relatedSkills),
        level: getLevel(getAbilityPercentage(emotionAbilityInfo.literacy.relatedSkills)),
      },
    ];

    return {
      skillScores,
      abilityLevels,
      completedAt: new Date(),
      studentName,
    };
  }, [answers, studentName]);

  const saveAnswersToDatabase = useCallback(async (results: AssessmentResult) => {
    try {
      // Calculate duration
      const endTime = new Date();
      const durationSeconds = startTimeRef.current 
        ? Math.round((endTime.getTime() - startTimeRef.current.getTime()) / 1000)
        : null;

      // Calculate total score
      const totalScore = Math.round(
        results.skillScores.reduce((sum, s) => sum + s.percentage, 0) / results.skillScores.length
      );

      const sessionData = {
        student_name: studentName,
        student_class: studentClass || null,
        school_name: options.schoolName || schoolName || null,
        school_id: options.schoolId || null,
        teacher_id: options.teacherId || null,
        language: language,
        started_at: startTimeRef.current?.toISOString() || endTime.toISOString(),
        completed_at: endTime.toISOString(),
        duration_seconds: durationSeconds,
        score_recognizing: results.skillScores.find(s => s.skill === 'recognizing')?.percentage,
        score_understanding: results.skillScores.find(s => s.skill === 'understanding')?.percentage,
        score_labeling: results.skillScores.find(s => s.skill === 'labeling')?.percentage,
        score_expressing: results.skillScores.find(s => s.skill === 'expressing')?.percentage,
        score_regulating: results.skillScores.find(s => s.skill === 'regulating')?.percentage,
        ability_resilience: results.abilityLevels.find(a => a.nameEn === 'Emotional Resilience')?.percentage,
        ability_agility: results.abilityLevels.find(a => a.nameEn === 'Emotional Agility')?.percentage,
        ability_literacy: results.abilityLevels.find(a => a.nameEn === 'Emotional Literacy')?.percentage,
        total_score: totalScore,
      };

      if (sessionIdRef.current) {
        const { error } = await supabase
          .from('assessment_sessions')
          .update(sessionData)
          .eq('id', sessionIdRef.current);

        if (error) throw error;
      } else {
        const sessionId = crypto.randomUUID();
        const { error } = await supabase
          .from('assessment_sessions')
          .insert([{ id: sessionId, ...sessionData }]);

        if (error) throw error;
        sessionIdRef.current = sessionId;
      }

      // Save individual answers
      const answerRecords = questions.map(q => {
        const selectedScore = answers[q.id] || 1;
        const selectedOption = q.options.find(o => o.score === selectedScore) || q.options[0];
        
        return {
          session_id: sessionIdRef.current!,
          question_id: q.id,
          question_text: q.questionText,
          selected_option_id: selectedOption.id,
          selected_option_text: selectedOption.text,
          score: selectedScore,
          max_score: 3,
          skill_type: q.skill,
        };
      });

      const { error: answersError } = await supabase
        .from('assessment_answers')
        .insert(answerRecords);

      if (answersError) throw answersError;
    } catch (error) {
      console.error('Error saving results:', error);
    }
  }, [answers, language, options.schoolId, options.schoolName, options.teacherId, schoolName, studentClass, studentName]);

  const completeAssessment = useCallback(async () => {
    const results = calculateResults();
    setResult(results);
    
    // Save to database
    await saveAnswersToDatabase(results);
    
    setPhase('results');
  }, [calculateResults, saveAnswersToDatabase]);

  const resetAssessment = useCallback(() => {
    setPhase('landing');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStudentName('');
    setStudentClass('');
    setSchoolName('');
    setResult(null);
    sessionIdRef.current = null;
    startTimeRef.current = null;
  }, []);

  const isCurrentQuestionAnswered = currentQuestion ? answers[currentQuestion.id] !== undefined : false;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return {
    phase,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    answers,
    studentName,
    studentClass,
    schoolName,
    result,
    isCurrentQuestionAnswered,
    isLastQuestion,
    startAssessment,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    completeAssessment,
    resetAssessment,
    setStudentClass,
    setSchoolName,
  };
}
