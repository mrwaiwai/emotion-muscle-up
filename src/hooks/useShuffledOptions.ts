import { useMemo } from 'react';
import { QuestionOption } from '@/data/questions';

// Fisher-Yates shuffle algorithm with a seeded random for consistent shuffling per question
function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  
  // Simple seeded random number generator
  const random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed / 0x7fffffff);
  };

  while (currentIndex > 0) {
    const randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled;
}

// Convert question ID to a numeric seed
function questionIdToSeed(questionId: string): number {
  let seed = 0;
  for (let i = 0; i < questionId.length; i++) {
    seed = ((seed << 5) - seed) + questionId.charCodeAt(i);
    seed = seed & seed; // Convert to 32-bit integer
  }
  return Math.abs(seed);
}

export function useShuffledOptions(questionId: string, options: QuestionOption[]): QuestionOption[] {
  return useMemo(() => {
    const seed = questionIdToSeed(questionId);
    return seededShuffle(options, seed);
  }, [questionId, options]);
}
