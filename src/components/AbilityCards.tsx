import { motion } from 'framer-motion';
import { AbilityLevel } from '@/hooks/useAssessment';
import { TrendingUp, Zap, BookOpen } from 'lucide-react';

interface AbilityCardsProps {
  abilityLevels: AbilityLevel[];
}

export function AbilityCards({ abilityLevels }: AbilityCardsProps) {
  const icons = [
    <TrendingUp className="w-6 h-6" />,
    <Zap className="w-6 h-6" />,
    <BookOpen className="w-6 h-6" />,
  ];

  const levelLabels = {
    high: { text: '表現良好', color: 'bg-green-100 text-green-700 border-green-200' },
    medium: { text: '發展中', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    support: { text: '需要更多支援', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  };

  const bgColors = [
    'bg-gradient-to-br from-green-50 to-teal-50',
    'bg-gradient-to-br from-blue-50 to-indigo-50',
    'bg-gradient-to-br from-purple-50 to-pink-50',
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {abilityLevels.map((ability, index) => {
        const levelInfo = levelLabels[ability.level];
        return (
          <motion.div
            key={ability.nameEn}
            className={`p-5 rounded-2xl ${bgColors[index]} border border-white/50`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.15 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-white/70 text-primary">
                {icons[index]}
              </div>
              <div>
                <h3 className="font-bold text-sm">{ability.name}</h3>
                <p className="text-xs text-muted-foreground">{ability.nameEn}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${levelInfo.color}`}>
                {levelInfo.text}
              </span>
              <span className="text-2xl font-bold text-primary">{ability.percentage}%</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
