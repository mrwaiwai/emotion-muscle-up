import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { ProgressBar } from './ProgressBar';
import { Button } from '@/components/ui/button';
import { Question } from '@/data/questions';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  progress: number;
  selectedAnswer: number | undefined;
  isLastQuestion: boolean;
  onAnswer: (questionId: string, score: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  progress,
  selectedAnswer,
  isLastQuestion,
  onAnswer,
  onNext,
  onPrev,
  onComplete,
}: QuestionCardProps) {
  const skillColors: Record<string, string> = {
    recognizing: 'from-emotion-recognizing/20 to-emotion-recognizing/5',
    understanding: 'from-emotion-understanding/20 to-emotion-understanding/5',
    labeling: 'from-emotion-labeling/20 to-emotion-labeling/5',
    expressing: 'from-emotion-expressing/20 to-emotion-expressing/5',
    regulating: 'from-emotion-regulating/20 to-emotion-regulating/5',
  };

  const hasAnswer = selectedAnswer !== undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ProgressBar
            current={questionIndex}
            total={totalQuestions}
            progress={progress}
          />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard 
              className={cn(
                "p-6 md:p-8 mb-6 bg-gradient-to-br",
                skillColors[question.skill]
              )}
            >
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-6">
                <motion.span
                  className="text-5xl md:text-6xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {question.icon}
                </motion.span>
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/50 text-muted-foreground mb-2">
                    {question.questionTextEn}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">
                    {question.questionText}
                  </h2>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === option.score;
                  return (
                    <motion.button
                      key={option.id}
                      className={cn(
                        "option-button flex items-center gap-4 min-h-[80px]",
                        isSelected && "selected"
                      )}
                      onClick={() => onAnswer(question.id, option.score)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-colors shrink-0",
                        isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted/50 text-muted-foreground"
                      )}>
                        {isSelected ? <Check className="w-6 h-6" /> : String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1 text-left text-lg md:text-xl font-medium">
                        {option.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          className="flex justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={onPrev}
            disabled={questionIndex === 0}
            className="h-16 px-6 rounded-xl text-lg"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
            上一題
          </Button>

          {isLastQuestion ? (
            <Button
              size="lg"
              onClick={onComplete}
              disabled={!hasAnswer}
              className="h-16 px-8 rounded-xl bg-primary-gradient text-primary-foreground text-lg"
            >
              完成啦！✨
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={onNext}
              disabled={!hasAnswer}
              className="h-16 px-6 rounded-xl text-lg"
            >
              下一題
              <ChevronRight className="w-6 h-6 ml-1" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
