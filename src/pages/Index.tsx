import { AnimatePresence } from 'framer-motion';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { LandingPage } from '@/components/LandingPage';
import { QuestionCard } from '@/components/QuestionCard';
import { ResultsPrototypeSelector } from '@/components/results/ResultsPrototypeSelector';
import { useAssessment } from '@/hooks/useAssessment';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';

const Index = () => {
  const {
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
    resetAssessment,
  } = useAssessment();

  const { generatePdf } = usePdfGenerator();

  const handleDownloadPdf = () => {
    if (result) {
      generatePdf(result);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingOrbs />
      
      <AnimatePresence mode="wait">
        {phase === 'landing' && (
          <LandingPage key="landing" onStart={startAssessment} />
        )}
        
        {phase === 'assessment' && currentQuestion && (
          <QuestionCard
            key={`question-${currentQuestionIndex}`}
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            progress={progress}
            selectedAnswer={answers[currentQuestion.id]}
            isLastQuestion={isLastQuestion}
            onAnswer={answerQuestion}
            onNext={nextQuestion}
            onPrev={prevQuestion}
            onComplete={completeAssessment}
          />
        )}
        
        {phase === 'results' && result && (
          <ResultsPrototypeSelector 
            key="results" 
            result={result} 
            onReset={resetAssessment}
            onDownloadPdf={handleDownloadPdf}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
