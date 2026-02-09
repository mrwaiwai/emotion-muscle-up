import { useState, useCallback, useMemo } from 'react';
import { gameQuestions, GameQuestion, SkillType, gameMetadata } from '@/data/gameQuestions';

export type GamePhase = 'landing' | 'assessment' | 'results';

export interface GameAnswer {
  questionId: string;
  score: number;
  selections?: string[];  // For multi-select questions
  sliderValue?: number;   // For slider questions
  matches?: { sourceId: string; targetId: string }[];  // For drag-match questions
}

export interface GameResult {
  answers: Record<string, GameAnswer>;
  skillScores: Record<SkillType, { score: number; maxScore: number; percentage: number }>;
  abilityScores: {
    resilience: number;
    agility: number;
    literacy: number;
  };
  totalScore: number;
  maxTotalScore: number;
  totalPercentage: number;
}

export function useGameAssessment() {
  const [phase, setPhase] = useState<GamePhase>('landing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, GameAnswer>>({});
  const [startTime, setStartTime] = useState<Date | null>(null);

  const currentQuestion = useMemo(() => {
    return gameQuestions[currentQuestionIndex] || null;
  }, [currentQuestionIndex]);

  const totalQuestions = gameQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isCurrentQuestionAnswered = currentQuestion ? !!answers[currentQuestion.id] : false;

  const startAssessment = useCallback(() => {
    setPhase('assessment');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStartTime(new Date());
  }, []);

  const answerQuestion = useCallback((answer: GameAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [answer.questionId]: answer
    }));
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

  const calculateResults = useCallback((): GameResult => {
    const skillScores: Record<SkillType, { score: number; maxScore: number; percentage: number }> = {
      recognizing: { score: 0, maxScore: 12, percentage: 0 },
      understanding: { score: 0, maxScore: 12, percentage: 0 },
      labeling: { score: 0, maxScore: 12, percentage: 0 },
      expressing: { score: 0, maxScore: 12, percentage: 0 },
      regulating: { score: 0, maxScore: 12, percentage: 0 }
    };

    // Calculate skill scores
    gameQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        skillScores[question.skill].score += answer.score;
      }
    });

    // Calculate percentages
    Object.keys(skillScores).forEach(skill => {
      const s = skillScores[skill as SkillType];
      s.percentage = Math.round((s.score / s.maxScore) * 100);
    });

    // Calculate ability scores
    const abilityScores = {
      resilience: Math.round(
        (skillScores.regulating.percentage + skillScores.understanding.percentage) / 2
      ),
      agility: Math.round(
        (skillScores.expressing.percentage + skillScores.regulating.percentage) / 2
      ),
      literacy: Math.round(
        (skillScores.recognizing.percentage + skillScores.labeling.percentage + skillScores.understanding.percentage) / 3
      )
    };

    const totalScore = Object.values(skillScores).reduce((sum, s) => sum + s.score, 0);
    const maxTotalScore = 60;
    const totalPercentage = Math.round((totalScore / maxTotalScore) * 100);

    return {
      answers,
      skillScores,
      abilityScores,
      totalScore,
      maxTotalScore,
      totalPercentage
    };
  }, [answers]);

  const completeAssessment = useCallback(() => {
    setPhase('results');
  }, []);

  const resetAssessment = useCallback(() => {
    setPhase('landing');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStartTime(null);
  }, []);

  const result = useMemo(() => {
    if (phase === 'results') {
      return calculateResults();
    }
    return null;
  }, [phase, calculateResults]);

  return {
    phase,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    answers,
    result,
    isCurrentQuestionAnswered,
    isLastQuestion,
    startAssessment,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    completeAssessment,
    resetAssessment
  };
}
