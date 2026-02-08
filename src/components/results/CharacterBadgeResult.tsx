import { motion } from 'framer-motion';
import { SkillScore } from '@/hooks/useAssessment';
import { skillInfo, SkillType } from '@/data/questions';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Star, Sparkles } from 'lucide-react';

interface CharacterBadgeResultProps {
  skillScores: SkillScore[];
}

const getBadgeLevel = (percentage: number) => {
  if (percentage >= 70) return 'gold';
  if (percentage >= 40) return 'silver';
  return 'bronze';
};

const badgeInfo = {
  bronze: {
    labelZh: '初心者',
    labelEn: 'Beginner',
    color: 'from-amber-600 to-amber-800',
    ringColor: 'ring-amber-600/50',
    stars: 1,
  },
  silver: {
    labelZh: '學習者',
    labelEn: 'Learner',
    color: 'from-slate-300 to-slate-500',
    ringColor: 'ring-slate-400/50',
    stars: 2,
  },
  gold: {
    labelZh: '達人',
    labelEn: 'Expert',
    color: 'from-yellow-300 to-amber-500',
    ringColor: 'ring-yellow-400/50',
    stars: 3,
  },
};

const skillCharacters: Record<SkillType, { emoji: string; titleZh: string; titleEn: string }> = {
  recognizing: { emoji: '🔍', titleZh: '情緒偵探', titleEn: 'Emotion Detective' },
  understanding: { emoji: '🧠', titleZh: '同理小天使', titleEn: 'Empathy Angel' },
  labeling: { emoji: '🏷️', titleZh: '情緒標籤師', titleEn: 'Emotion Labeler' },
  expressing: { emoji: '🎭', titleZh: '表達藝術家', titleEn: 'Expression Artist' },
  regulating: { emoji: '🧘', titleZh: '平靜大師', titleEn: 'Calm Master' },
};

export function CharacterBadgeResult({ skillScores }: CharacterBadgeResultProps) {
  const { t } = useLanguage();

  // Calculate overall title based on strongest skill
  const strongestSkill = skillScores.reduce((prev, current) => 
    prev.percentage > current.percentage ? prev : current
  );
  const character = skillCharacters[strongestSkill.skill];

  return (
    <div className="space-y-6">
      {/* Main Character Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
      >
        <motion.div
          animate={{ 
            rotate: [0, -5, 5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="text-5xl mb-3"
        >
          {character.emoji}
        </motion.div>
        <h3 className="text-xl font-bold mb-1">
          {t(character.titleZh, character.titleEn)}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('你最強嘅情緒超能力！', 'Your strongest emotional superpower!')}
        </p>
      </motion.div>

      <div className="text-center">
        <h4 className="text-lg font-semibold mb-4">
          {t('🏅 收集到嘅徽章', '🏅 Collected Badges')}
        </h4>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {skillScores.map((score, index) => {
          const level = getBadgeLevel(score.percentage);
          const badge = badgeInfo[level];
          const char = skillCharacters[score.skill];

          return (
            <motion.div
              key={score.skill}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center p-4 rounded-2xl bg-muted/30 border border-white/10"
            >
              {/* Badge */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${badge.color} ring-4 ${badge.ringColor} flex items-center justify-center mb-3`}
              >
                <span className="text-2xl">{char.emoji}</span>
                
                {/* Sparkle effect for gold */}
                {level === 'gold' && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                )}
              </motion.div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= badge.stars 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>

              {/* Skill name */}
              <p className="text-xs font-medium text-center">
                {t(skillInfo[score.skill].name, skillInfo[score.skill].nameEn)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(badge.labelZh, badge.labelEn)}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-xl bg-muted/30 text-center"
      >
        <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
        <p className="text-sm">
          {t(
            '繼續練習，收集更多金色徽章！',
            'Keep practicing to collect more gold badges!'
          )}
        </p>
      </motion.div>
    </div>
  );
}
