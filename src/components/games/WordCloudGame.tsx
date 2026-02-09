import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { GameOption } from '@/data/gameQuestions';

interface WordCloudGameProps {
  options: GameOption[];
  selectedIds: string[];
  onToggle: (option: GameOption) => void;
  minSelections?: number;
  maxSelections?: number;
}

export function WordCloudGame({ 
  options, 
  selectedIds, 
  onToggle, 
  minSelections = 2, 
  maxSelections = 3 
}: WordCloudGameProps) {
  const { language } = useLanguage();
  const canSelectMore = selectedIds.length < maxSelections;

  // Create a more organic layout with varying sizes
  const getSizeClass = (index: number) => {
    const sizes = ['text-lg', 'text-xl', 'text-base', 'text-lg', 'text-xl'];
    return sizes[index % sizes.length];
  };

  return (
    <div className="space-y-4">
      {/* Selection hint */}
      <p className="text-sm text-muted-foreground text-center">
        {language === 'en'
          ? `Tap ${minSelections}-${maxSelections} words that describe your feelings`
          : `點擊 ${minSelections}-${maxSelections} 個最貼近你感受嘅詞語`}
        <span className="ml-2 font-medium text-primary">
          ({selectedIds.length}/{maxSelections})
        </span>
      </p>

      {/* Word Cloud */}
      <div className="flex flex-wrap justify-center gap-3 p-6 bg-white/20 backdrop-blur-sm rounded-2xl min-h-[200px]">
        {options.map((option, index) => {
          const isSelected = selectedIds.includes(option.id);
          const isDisabled = !isSelected && !canSelectMore;
          const text = language === 'en' && option.textEn ? option.textEn : option.text;

          return (
            <motion.button
              key={option.id}
              onClick={() => !isDisabled && onToggle(option)}
              initial={{ opacity: 0, scale: 0, rotate: Math.random() * 20 - 10 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                y: isSelected ? -4 : 0
              }}
              transition={{ 
                delay: index * 0.05,
                type: "spring",
                stiffness: 200
              }}
              whileHover={!isDisabled ? { scale: 1.1, rotate: Math.random() * 6 - 3 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              disabled={isDisabled}
              className={cn(
                "px-4 py-2 rounded-full font-medium transition-all duration-200",
                getSizeClass(index),
                isSelected
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-white/70 text-foreground hover:bg-white",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
            >
              <span className="mr-1">{option.icon}</span>
              {text}
            </motion.button>
          );
        })}
      </div>

      {/* Selected words preview */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-2 flex-wrap"
        >
          {selectedIds.map(id => {
            const option = options.find(o => o.id === id);
            if (!option) return null;
            return (
              <span 
                key={id}
                className="px-3 py-1 bg-primary/20 rounded-full text-sm font-medium"
              >
                {option.icon} {language === 'en' && option.textEn ? option.textEn : option.text}
              </span>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
