import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface SliderGameProps {
  config: {
    min: number;
    max: number;
    step: number;
    labels?: { value: number; text: string; textEn?: string }[];
    scoreRanges: { min: number; max: number; score: number }[];
  };
  value: number;
  onChange: (value: number, score: number) => void;
}

export function SliderGame({ config, value, onChange }: SliderGameProps) {
  const { language } = useLanguage();

  const getScore = (val: number): number => {
    for (const range of config.scoreRanges) {
      if (val >= range.min && val <= range.max) {
        return range.score;
      }
    }
    return 1;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue, getScore(newValue));
  };

  const percentage = ((value - config.min) / (config.max - config.min)) * 100;

  // Get color based on value
  const getColor = () => {
    if (percentage < 33) return 'from-green-400 to-green-500';
    if (percentage < 66) return 'from-yellow-400 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  return (
    <div className="w-full space-y-6">
      {/* Temperature Display */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="relative w-32 h-48 bg-white/30 backdrop-blur-sm rounded-full border-4 border-white/50 overflow-hidden">
          <motion.div
            className={cn("absolute bottom-0 left-0 right-0 bg-gradient-to-t", getColor())}
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-foreground drop-shadow-md">
              {value}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Slider */}
      <div className="relative px-4">
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={handleChange}
          className="w-full h-4 bg-white/30 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-8
            [&::-webkit-slider-thumb]:h-8
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-8
            [&::-moz-range-thumb]:h-8
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:shadow-lg
            [&::-moz-range-thumb]:cursor-grab
          "
        />
        
        {/* Labels */}
        {config.labels && (
          <div className="flex justify-between mt-2">
            {config.labels.map((label, index) => (
              <span
                key={index}
                className={cn(
                  "text-sm font-medium transition-colors",
                  Math.abs(value - label.value) < 15
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                )}
              >
                {language === 'en' && label.textEn ? label.textEn : label.text}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
