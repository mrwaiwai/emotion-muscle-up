import { AnimatePresence } from 'framer-motion';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { useGameAssessment } from '@/hooks/useGameAssessment';
import { GameLandingPage } from '@/components/games/GameLandingPage';
import { GameQuestionCard } from '@/components/games/GameQuestionCard';
import { GameResultsPage } from '@/components/games/GameResultsPage';

const GamesDemo = () => {
  const {
    phase,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    answers,
    result,
    isLastQuestion,
    startAssessment,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    completeAssessment,
    resetAssessment,
  } = useGameAssessment();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingOrbs />
      
      <AnimatePresence mode="wait">
        {phase === 'landing' && (
          <GameLandingPage key="landing" onStart={startAssessment} />
        )}
        
        {phase === 'assessment' && currentQuestion && (
          <GameQuestionCard
            key={`question-${currentQuestionIndex}`}
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            progress={progress}
            currentAnswer={answers[currentQuestion.id]}
            isLastQuestion={isLastQuestion}
            onAnswer={answerQuestion}
            onNext={nextQuestion}
            onPrev={prevQuestion}
            onComplete={completeAssessment}
          />
        )}
        
        {phase === 'results' && result && (
          <GameResultsPage
            key="results"
            result={result}
            onReset={resetAssessment}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamesDemo;
