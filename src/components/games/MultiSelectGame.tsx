import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Square } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GameOption } from '@/data/gameQuestions';

interface MultiSelectGameProps {
  options: GameOption[];
  selectedIds: string[];
  onToggle: (option: GameOption) => void;
  minSelections?: number;
  maxSelections?: number;
}

export function MultiSelectGame({ 
  options, 
  selectedIds, 
  onToggle, 
  minSelections = 1, 
  maxSelections = options.length 
}: MultiSelectGameProps) {
  const { language } = useLanguage();
  const canSelectMore = selectedIds.length < maxSelections;

  return (
    <div className="space-y-4">
      {/* Selection hint */}
      <p className="text-sm text-muted-foreground text-center">
        {language === 'en'
          ? `Select ${minSelections}-${maxSelections} options`
          : `請選擇 ${minSelections}-${maxSelections} 個選項`}
        <span className="ml-2 font-medium text-primary">
          ({selectedIds.length}/{maxSelections})
        </span>
      </p>

      <div className="grid gap-3">
        {options.map((option, index) => {
          const isSelected = selectedIds.includes(option.id);
          const isDisabled = !isSelected && !canSelectMore;
          const text = language === 'en' && option.textEn ? option.textEn : option.text;

          return (
            <motion.button
              key={option.id}
              onClick={() => !isDisabled && onToggle(option)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              disabled={isDisabled}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200",
                "bg-white/60 backdrop-blur-sm",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-white/50",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Checkbox */}
              <motion.div
                animate={{
                  backgroundColor: isSelected ? 'hsl(var(--primary))' : 'transparent',
                  borderColor: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                }}
                className={cn(
                  "w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0"
                )}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.div>
              
              {/* Icon */}
              <span className="text-2xl shrink-0">{option.icon}</span>
              
              {/* Text */}
              <span className="flex-1 text-left font-medium">{text}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
