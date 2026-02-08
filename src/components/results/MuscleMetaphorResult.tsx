import { motion } from 'framer-motion';
import { SkillScore } from '@/hooks/useAssessment';
import { skillInfo, SkillType } from '@/data/questions';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dumbbell } from 'lucide-react';

interface MuscleMetaphorResultProps {
  skillScores: SkillScore[];
}

const getMuscleLevel = (percentage: number) => {
  if (percentage >= 70) return 'strong';
  if (percentage >= 40) return 'training';
  return 'warming';
};

const muscleInfo = {
  warming: {
    labelZh: '熱身中',
    labelEn: 'Warming Up',
    descZh: '準備開始鍛鍊呢組情緒肌肉',
    descEn: 'Getting ready to train this emotional muscle',
    emoji: '🔥',
    bars: 1,
    color: 'bg-orange-400',
  },
  training: {
    labelZh: '鍛鍊中',
    labelEn: 'Training',
    descZh: '呢組肌肉正在變得更強壯',
    descEn: 'This muscle is getting stronger',
    emoji: '💪',
    bars: 2,
    color: 'bg-yellow-500',
  },
  strong: {
    labelZh: '肌肉強壯',
    labelEn: 'Strong',
    descZh: '呢組情緒肌肉已經好有力量',
    descEn: 'This emotional muscle is powerful',
    emoji: '🏆',
    bars: 3,
    color: 'bg-green-500',
  },
};

const skillColors: Record<SkillType, string> = {
  recognizing: 'from-pink-400 to-rose-500',
  understanding: 'from-blue-400 to-cyan-500',
  labeling: 'from-amber-400 to-yellow-500',
  expressing: 'from-purple-400 to-violet-500',
  regulating: 'from-emerald-400 to-teal-500',
};

export function MuscleMetaphorResult({ skillScores }: MuscleMetaphorResultProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {t('💪 情緒 MUSCLE UP 訓練報告', '💪 Emotion MUSCLE UP Training Report')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('睇吓你嘅五組情緒肌肉訓練進度', 'Check your five emotional muscle training progress')}
        </p>
      </div>

      <div className="space-y-4">
        {skillScores.map((score, index) => {
          const level = getMuscleLevel(score.percentage);
          const info = muscleInfo[level];

          return (
            <motion.div
              key={score.skill}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{info.emoji}</span>
                  <div>
                    <span className="font-semibold block">
                      {t(skillInfo[score.skill].name, skillInfo[score.skill].nameEn)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t(info.labelZh, info.labelEn)}
                    </span>
                  </div>
                </div>
                
                {/* Muscle bars */}
                <div className="flex gap-1">
                  {[1, 2, 3].map((bar) => (
                    <motion.div
                      key={bar}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: bar <= info.bars ? 1 : 0.3 }}
                      transition={{ delay: index * 0.1 + bar * 0.1 }}
                      className={`w-3 rounded-full origin-bottom ${
                        bar <= info.bars ? info.color : 'bg-muted'
                      }`}
                      style={{ height: `${bar * 12 + 12}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`h-full rounded-full bg-gradient-to-r ${skillColors[score.skill]}`}
                  style={{ width: `${Math.max(score.percentage, 15)}%` }}
                />
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                {t(info.descZh, info.descEn)}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Motivation message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 rounded-xl bg-primary/10 text-center"
      >
        <Dumbbell className="w-6 h-6 mx-auto mb-2 text-primary" />
        <p className="text-sm">
          {t(
            '情緒肌肉同身體肌肉一樣，需要持續練習先會變強！',
            'Emotional muscles, like physical muscles, get stronger with practice!'
          )}
        </p>
      </motion.div>
    </div>
  );
}
