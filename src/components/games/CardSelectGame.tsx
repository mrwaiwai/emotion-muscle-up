import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GameOption } from '@/data/gameQuestions';

interface CardSelectGameProps {
  options: GameOption[];
  selectedId: string | null;
  onSelect: (option: GameOption) => void;
}

export function CardSelectGame({ options, selectedId, onSelect }: CardSelectGameProps) {
  const { language } = useLanguage();

  return (
    <div className="grid gap-3">
      {options.map((option, index) => {
        const isSelected = selectedId === option.id;
        const text = language === 'en' && option.textEn ? option.textEn : option.text;

        return (
          <motion.button
            key={option.id}
            onClick={() => onSelect(option)}
            initial={{ opacity: 0, y: 20, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
              "bg-white/60 backdrop-blur-sm shadow-md hover:shadow-lg",
              isSelected
                ? "border-primary bg-primary/10 shadow-primary/20"
                : "border-white/50 hover:border-primary/30"
            )}
          >
            {/* Icon */}
            <span className="text-3xl shrink-0">{option.icon}</span>
            
            {/* Text */}
            <span className="flex-1 text-left text-lg font-medium">{text}</span>
            
            {/* Selected indicator */}
            <motion.div
              initial={false}
              animate={{
                scale: isSelected ? 1 : 0,
                opacity: isSelected ? 1 : 0
              }}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"
            >
              <Check className="w-5 h-5 text-primary-foreground" />
            </motion.div>

            {/* Glow effect when selected */}
            {isSelected && (
              <motion.div
                layoutId="card-glow"
                className="absolute inset-0 rounded-2xl bg-primary/5 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
