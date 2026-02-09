import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { GameQuestion, GameOption } from '@/data/gameQuestions';
import { GameAnswer } from '@/hooks/useGameAssessment';
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

// Import game components
import { SliderGame } from './SliderGame';
import { CardSelectGame } from './CardSelectGame';
import { DragMatchGame } from './DragMatchGame';
import { MultiSelectGame } from './MultiSelectGame';
import { WordCloudGame } from './WordCloudGame';

interface GameQuestionCardProps {
  question: GameQuestion;
  questionIndex: number;
  totalQuestions: number;
  progress: number;
  currentAnswer: GameAnswer | undefined;
  isLastQuestion: boolean;
  onAnswer: (answer: GameAnswer) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

export function GameQuestionCard({
  question,
  questionIndex,
  totalQuestions,
  progress,
  currentAnswer,
  isLastQuestion,
  onAnswer,
  onNext,
  onPrev,
  onComplete,
}: GameQuestionCardProps) {
  const { language, t } = useLanguage();
  
  // Local state for interactive elements
  const [sliderValue, setSliderValue] = useState<number>(currentAnswer?.sliderValue ?? 50);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    currentAnswer?.selections?.[0] ?? null
  );
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>(
    currentAnswer?.selections ?? []
  );
  const [dragMatches, setDragMatches] = useState<{ sourceId: string; targetId: string }[]>(
    currentAnswer?.matches ?? []
  );

  const skillColors: Record<string, string> = {
    recognizing: 'from-emotion-recognizing/20 to-emotion-recognizing/5',
    understanding: 'from-emotion-understanding/20 to-emotion-understanding/5',
    labeling: 'from-emotion-labeling/20 to-emotion-labeling/5',
    expressing: 'from-emotion-expressing/20 to-emotion-expressing/5',
    regulating: 'from-emotion-regulating/20 to-emotion-regulating/5',
  };

  const gameTypeLabels: Record<string, { zh: string; en: string }> = {
    'slider': { zh: '情緒溫度計', en: 'Emotion Thermometer' },
    'card-select': { zh: '卡牌選擇', en: 'Card Selection' },
    'drag-match': { zh: '連線配對', en: 'Match Connection' },
    'multi-select': { zh: '多項選擇', en: 'Multi-Select' },
    'word-cloud': { zh: '詞語雲', en: 'Word Cloud' },
    'hotspot': { zh: '熱點觀察', en: 'Hotspot' },
    'video-observe': { zh: '影片觀察', en: 'Video Observation' }
  };

  const hasAnswer = currentAnswer !== undefined;

  const scenarioText = language === 'en' && question.scenarioTextEn 
    ? question.scenarioTextEn 
    : question.scenarioText;
    
  const questionText = language === 'en' && question.questionTextEn 
    ? question.questionTextEn 
    : question.questionText;

  // Get feedback text based on score
  const getFeedbackText = (score: number) => {
    if (!question.feedback) return null;
    if (score <= 1) {
      return language === 'en' && question.feedback.lowEn 
        ? question.feedback.lowEn 
        : question.feedback.low;
    } else if (score === 2) {
      return language === 'en' && question.feedback.mediumEn 
        ? question.feedback.mediumEn 
        : question.feedback.medium;
    } else {
      return language === 'en' && question.feedback.highEn 
        ? question.feedback.highEn 
        : question.feedback.high;
    }
  };

  // Handle Slider answer
  const handleSliderChange = (value: number, score: number) => {
    setSliderValue(value);
    onAnswer({
      questionId: question.id,
      score,
      sliderValue: value
    });
  };

  // Handle Card Select answer
  const handleCardSelect = (option: GameOption) => {
    setSelectedCardId(option.id);
    onAnswer({
      questionId: question.id,
      score: option.score,
      selections: [option.id]
    });
  };

  // Handle Multi-Select / Word Cloud toggle
  const handleMultiToggle = (option: GameOption) => {
    let newSelected: string[];
    if (selectedMultiple.includes(option.id)) {
      newSelected = selectedMultiple.filter(id => id !== option.id);
    } else {
      const maxSel = question.multiSelectScoring?.maxSelections ?? question.options?.length ?? 5;
      if (selectedMultiple.length < maxSel) {
        newSelected = [...selectedMultiple, option.id];
      } else {
        return;
      }
    }
    setSelectedMultiple(newSelected);

    // Calculate score
    let score = 1;
    if (question.multiSelectScoring?.scoringType === 'sum') {
      score = newSelected.reduce((sum, id) => {
        const opt = question.options?.find(o => o.id === id);
        return sum + (opt?.score ?? 0);
      }, 0);
      // Normalize to 1-3 range
      const maxPossible = (question.options?.reduce((sum, o) => sum + o.score, 0) ?? 9);
      score = Math.min(3, Math.max(1, Math.round((score / maxPossible) * 3)));
    } else if (question.multiSelectScoring?.countScores) {
      const countEntry = question.multiSelectScoring.countScores.find(
        c => c.count === newSelected.length
      );
      score = countEntry?.score ?? 1;
    }

    onAnswer({
      questionId: question.id,
      score,
      selections: newSelected
    });
  };

  // Handle Drag Match
  const handleDragComplete = (matches: { sourceId: string; targetId: string }[], score: number) => {
    setDragMatches(matches);
    onAnswer({
      questionId: question.id,
      score,
      matches
    });
  };

  // Render game based on type
  const renderGame = () => {
    switch (question.gameType) {
      case 'slider':
        if (!question.sliderConfig) return null;
        return (
          <SliderGame
            config={question.sliderConfig}
            value={sliderValue}
            onChange={handleSliderChange}
          />
        );

      case 'card-select':
        if (!question.options) return null;
        return (
          <CardSelectGame
            options={question.options}
            selectedId={selectedCardId}
            onSelect={handleCardSelect}
          />
        );

      case 'drag-match':
        if (!question.dragItems || !question.dragMatches) return null;
        return (
          <DragMatchGame
            items={question.dragItems}
            correctMatches={question.dragMatches}
            onComplete={handleDragComplete}
            scoringConfig={question.multiSelectScoring}
          />
        );

      case 'multi-select':
        if (!question.options) return null;
        return (
          <MultiSelectGame
            options={question.options}
            selectedIds={selectedMultiple}
            onToggle={handleMultiToggle}
            minSelections={question.multiSelectScoring?.minSelections}
            maxSelections={question.multiSelectScoring?.maxSelections}
          />
        );

      case 'word-cloud':
        if (!question.options) return null;
        return (
          <WordCloudGame
            options={question.options}
            selectedIds={selectedMultiple}
            onToggle={handleMultiToggle}
            minSelections={question.multiSelectScoring?.minSelections}
            maxSelections={question.multiSelectScoring?.maxSelections}
          />
        );

      default:
        // Fallback to card select for unimplemented types
        if (!question.options) return null;
        return (
          <CardSelectGame
            options={question.options}
            selectedId={selectedCardId}
            onSelect={handleCardSelect}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-4 md:px-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress */}
        <motion.div
          className="mb-6"
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
              <div className="flex items-start gap-4 mb-4">
                <motion.span
                  className="text-4xl md:text-5xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {question.icon}
                </motion.span>
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/50 text-muted-foreground">
                      Q{questionIndex + 1}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      {language === 'en' 
                        ? gameTypeLabels[question.gameType]?.en 
                        : gameTypeLabels[question.gameType]?.zh}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenario */}
              <div className="mb-4 p-4 bg-white/30 rounded-xl backdrop-blur-sm">
                <p className="text-lg font-medium text-foreground/90">
                  {scenarioText}
                </p>
              </div>

              {/* Question */}
              <h2 className="text-xl md:text-2xl font-bold leading-relaxed mb-6">
                {questionText}
              </h2>

              {/* Game Content */}
              <div className="mb-4">
                {renderGame()}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {hasAnswer && currentAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 bg-primary/10 rounded-xl flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-sm font-medium">
                      {getFeedbackText(currentAnswer.score)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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
            className="h-14 px-6 rounded-xl text-base"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {t('上一題', 'Previous')}
          </Button>

          {isLastQuestion ? (
            <Button
              size="lg"
              onClick={onComplete}
              disabled={!hasAnswer}
              className="h-14 px-8 rounded-xl bg-primary-gradient text-primary-foreground text-base"
            >
              {t('完成啦！✨', 'Done! ✨')}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={onNext}
              disabled={!hasAnswer}
              className="h-14 px-6 rounded-xl text-base"
            >
              {t('下一題', 'Next')}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
