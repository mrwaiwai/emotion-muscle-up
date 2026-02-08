import { motion } from 'framer-motion';
import { SkillScore } from '@/hooks/useAssessment';
import { skillInfo, SkillType } from '@/data/questions';
import { useLanguage } from '@/contexts/LanguageContext';

interface GardenVisualResultProps {
  skillScores: SkillScore[];
}

const getPlantStage = (percentage: number) => {
  if (percentage >= 70) return 'blooming';
  if (percentage >= 40) return 'budding';
  return 'seedling';
};

const plantEmojis = {
  seedling: '🌱',
  budding: '🌿',
  blooming: '🌸',
};

const skillFlowers: Record<SkillType, { emoji: string; color: string }> = {
  recognizing: { emoji: '🌺', color: 'from-pink-300 to-rose-400' },
  understanding: { emoji: '💙', color: 'from-blue-300 to-cyan-400' },
  labeling: { emoji: '🌻', color: 'from-amber-300 to-yellow-400' },
  expressing: { emoji: '💜', color: 'from-purple-300 to-violet-400' },
  regulating: { emoji: '🍀', color: 'from-emerald-300 to-teal-400' },
};

export function GardenVisualResult({ skillScores }: GardenVisualResultProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {t('🏡 你嘅情緒花園', '🏡 Your Emotional Garden')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('每朵花代表一種情緒技能嘅成長', 'Each flower represents the growth of an emotional skill')}
        </p>
      </div>

      {/* Garden visualization */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-b from-sky-100/50 to-green-100/50 dark:from-sky-900/20 dark:to-green-900/20 min-h-[300px]">
        {/* Sun */}
        <motion.div
          className="absolute top-4 right-4 text-4xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          ☀️
        </motion.div>

        {/* Clouds */}
        <motion.div
          className="absolute top-6 left-8 text-2xl opacity-60"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ☁️
        </motion.div>

        {/* Plants row */}
        <div className="flex justify-around items-end pt-16">
          {skillScores.map((score, index) => {
            const stage = getPlantStage(score.percentage);
            const flower = skillFlowers[score.skill];
            const height = stage === 'blooming' ? 120 : stage === 'budding' ? 80 : 50;

            return (
              <motion.div
                key={score.skill}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center"
              >
                {/* Flower/Plant */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.2, type: 'spring' }}
                  className="text-3xl mb-1"
                >
                  {stage === 'blooming' ? flower.emoji : plantEmojis[stage]}
                </motion.div>

                {/* Stem */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="w-1.5 bg-gradient-to-b from-green-400 to-green-600 rounded-full"
                />

                {/* Soil */}
                <div className="w-12 h-4 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full mt-0.5" />

                {/* Label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 + 0.4 }}
                  className="mt-2 text-center"
                >
                  <p className="text-xs font-medium leading-tight">
                    {t(skillInfo[score.skill].name, skillInfo[score.skill].nameEn)}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Grass */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-500/30 to-transparent rounded-b-3xl" />
      </div>

      {/* Legend */}
      <div className="p-4 rounded-xl bg-muted/30">
        <p className="text-xs text-center text-muted-foreground mb-3">
          {t('花園成長階段', 'Garden Growth Stages')}
        </p>
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2 text-xs">
            <span>🌱</span>
            <span>{t('種子萌芽', 'Seedling')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>🌿</span>
            <span>{t('長出新芽', 'Budding')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>🌸</span>
            <span>{t('開花綻放', 'Blooming')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
