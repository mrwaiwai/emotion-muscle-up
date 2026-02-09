import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/GlassCard';
import { GameResult } from '@/hooks/useGameAssessment';
import { SkillType } from '@/data/gameQuestions';
import { RefreshCw, Trophy, Target, Brain, Heart, MessageCircle, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface GameResultsPageProps {
  result: GameResult;
  onReset: () => void;
}

export function GameResultsPage({ result, onReset }: GameResultsPageProps) {
  const { t } = useLanguage();

  const skillConfig: Record<SkillType, { icon: React.ComponentType<any>; label: string; labelEn: string; color: string }> = {
    recognizing: { icon: Target, label: '辨別', labelEn: 'Recognizing', color: 'bg-emotion-recognizing' },
    understanding: { icon: Brain, label: '理解', labelEn: 'Understanding', color: 'bg-emotion-understanding' },
    labeling: { icon: Heart, label: '標記', labelEn: 'Labeling', color: 'bg-emotion-labeling' },
    expressing: { icon: MessageCircle, label: '表達', labelEn: 'Expressing', color: 'bg-emotion-expressing' },
    regulating: { icon: Shield, label: '調節', labelEn: 'Regulating', color: 'bg-emotion-regulating' },
  };

  const getLevel = (percentage: number) => {
    if (percentage >= 75) return { label: t('高', 'High'), emoji: '🌟', color: 'text-green-500' };
    if (percentage >= 50) return { label: t('中', 'Medium'), emoji: '⭐', color: 'text-yellow-500' };
    return { label: t('需支援', 'Support'), emoji: '💪', color: 'text-orange-500' };
  };

  const abilityConfig = [
    { key: 'resilience', label: t('情緒韌性', 'Emotional Resilience'), emoji: '🛡️' },
    { key: 'agility', label: t('情緒敏捷', 'Emotional Agility'), emoji: '🔄' },
    { key: 'literacy', label: t('情緒閱讀力', 'Emotional Literacy'), emoji: '📖' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8 px-4"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <span className="text-6xl block mb-4">🎉</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t('遊戲完成！', 'Game Complete!')}
          </h1>
          <p className="text-muted-foreground">
            {t('睇下你嘅情緒技能分析', 'Check out your emotional skills analysis')}
          </p>
        </motion.div>

        {/* Total Score */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlassCard className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
            <div className="text-5xl font-bold text-primary mb-2">
              {result.totalPercentage}%
            </div>
            <p className="text-muted-foreground">
              {t('總體得分', 'Overall Score')} ({result.totalScore}/{result.maxTotalScore})
            </p>
          </GlassCard>
        </motion.div>

        {/* Skill Scores */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center">
              {t('五大技能', 'Five Core Skills')}
            </h2>
            <div className="space-y-4">
              {(Object.keys(result.skillScores) as SkillType[]).map((skill, index) => {
                const config = skillConfig[skill];
                const score = result.skillScores[skill];
                const level = getLevel(score.percentage);
                const Icon = config.icon;

                return (
                  <motion.div
                    key={skill}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.color)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">
                          {t(config.label, config.labelEn)}
                        </span>
                        <span className={cn("font-bold", level.color)}>
                          {level.emoji} {score.percentage}%
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score.percentage}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                          className={cn("h-full rounded-full", config.color)}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Ability Scores */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center">
              {t('三大能力', 'Three Key Abilities')}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {abilityConfig.map((ability, index) => {
                const score = result.abilityScores[ability.key as keyof typeof result.abilityScores];
                const level = getLevel(score);

                return (
                  <motion.div
                    key={ability.key}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-center p-4 bg-white/30 rounded-xl"
                  >
                    <span className="text-3xl block mb-2">{ability.emoji}</span>
                    <div className={cn("text-2xl font-bold mb-1", level.color)}>
                      {score}%
                    </div>
                    <p className="text-xs text-muted-foreground">{ability.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Reset Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <Button
            size="lg"
            variant="outline"
            onClick={onReset}
            className="h-14 px-8 rounded-xl"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            {t('重新開始', 'Start Over')}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
