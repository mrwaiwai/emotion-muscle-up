import { motion } from 'framer-motion';
import { SkillScore } from '@/hooks/useAssessment';
import { skillInfo, SkillType } from '@/data/questions';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sprout, Flower2, TreeDeciduous } from 'lucide-react';

interface GrowthStagesResultProps {
  skillScores: SkillScore[];
}

const getGrowthStage = (percentage: number) => {
  if (percentage >= 70) return 'flourishing';
  if (percentage >= 40) return 'growing';
  return 'sprouting';
};

const stageInfo = {
  sprouting: {
    labelZh: '萌芽期',
    labelEn: 'Sprouting',
    descZh: '正在開始探索呢個技能',
    descEn: 'Starting to explore this skill',
    Icon: Sprout,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
  },
  growing: {
    labelZh: '成長期',
    labelEn: 'Growing',
    descZh: '已經有一定嘅掌握',
    descEn: 'Developing good understanding',
    Icon: Flower2,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/20',
  },
  flourishing: {
    labelZh: '茁壯期',
    labelEn: 'Flourishing',
    descZh: '呢個技能發展得好好',
    descEn: 'This skill is well developed',
    Icon: TreeDeciduous,
    color: 'text-green-600',
    bgColor: 'bg-green-600/20',
  },
};

export function GrowthStagesResult({ skillScores }: GrowthStagesResultProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {t('🌱 你嘅情緒成長花園', '🌱 Your Emotional Growth Garden')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('每個人都有自己嘅成長節奏', 'Everyone grows at their own pace')}
        </p>
      </div>

      <div className="grid gap-4">
        {skillScores.map((score, index) => {
          const stage = getGrowthStage(score.percentage);
          const info = stageInfo[stage];
          const Icon = info.Icon;

          return (
            <motion.div
              key={score.skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-2xl ${info.bgColor} border border-white/20`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white/50 ${info.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">
                      {t(skillInfo[score.skill].name, skillInfo[score.skill].nameEn)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${info.bgColor} ${info.color} font-medium`}>
                      {t(info.labelZh, info.labelEn)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t(info.descZh, info.descEn)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 rounded-xl bg-muted/30">
        <p className="text-xs text-center text-muted-foreground mb-3">
          {t('成長階段說明', 'Growth Stage Guide')}
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          {Object.entries(stageInfo).map(([key, info]) => {
            const Icon = info.Icon;
            return (
              <div key={key} className="flex items-center gap-2 text-xs">
                <Icon className={`w-4 h-4 ${info.color}`} />
                <span>{t(info.labelZh, info.labelEn)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
