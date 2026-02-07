import { useState, useCallback } from 'react';
import { questions, Question, SkillType, skillInfo, emotionAbilityInfo } from '@/data/questions';

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

export function useAssessment() {
  const [phase, setPhase] = useState<AssessmentPhase>('landing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [studentName, setStudentName] = useState('');
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const currentQuestion: Question | undefined = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  const startAssessment = useCallback((name: string) => {
    setStudentName(name);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setPhase('assessment');
  }, []);

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

  const completeAssessment = useCallback(() => {
    const results = calculateResults();
    setResult(results);
    setPhase('results');
  }, [calculateResults]);

  const resetAssessment = useCallback(() => {
    setPhase('landing');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStudentName('');
    setResult(null);
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
    result,
    isCurrentQuestionAnswered,
    isLastQuestion,
    startAssessment,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    completeAssessment,
    resetAssessment,
  };
}
