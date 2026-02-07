import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { HeroAnimation } from './HeroAnimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Sparkles, ArrowRight, BookOpen, Users, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LandingPageProps {
  onStart: (name: string) => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const { t } = useLanguage();

  const handleStart = () => {
    if (showNameInput && name.trim()) {
      onStart(name.trim());
    } else {
      setShowNameInput(true);
    }
  };

  const stages = [
    { name: 'Show up', desc: t('勇敢面對', 'Face it'), icon: '💪' },
    { name: 'Step out', desc: t('踏出一步', 'Take a step'), icon: '🚀' },
    { name: 'Value', desc: t('跟住內心', 'Follow heart'), icon: '❤️' },
    { name: 'Move on', desc: t('繼續向前', 'Move forward'), icon: '✨' },
  ];

  const skills = [
    { name: t('辨別 Recognizing', 'Recognizing'), color: 'bg-skill-recognizing' },
    { name: t('理解 Understanding', 'Understanding'), color: 'bg-skill-understanding' },
    { name: t('標記 Labeling', 'Labeling'), color: 'bg-skill-labeling' },
    { name: t('表達 Expressing', 'Expressing'), color: 'bg-skill-expressing' },
    { name: t('調節 Regulating', 'Regulating'), color: 'bg-skill-regulating' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <div className="text-center mb-6">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="gradient-text">
              {t('情緒 MUSCLE UP', 'Emotion MUSCLE UP')}
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground font-medium mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('兒童情緒能力測驗 💪🧠❤️', "Children's Emotional Skills Assessment 💪🧠❤️")}
          </motion.p>
        </div>

        {/* Hero Animation Video */}
        <HeroAnimation />

        {/* Info Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* About Card */}
          <GlassCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {t('呢個測驗係咩嚟㗎？', 'What is this quiz?')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    '我哋會一齊探索你嘅情緒肌肉！睇吓你喺認識同處理情緒方面做得點。記住：冇分好壞，每個人都有自己嘅成長速度！',
                    "Let's explore your emotional muscles together! See how you handle and understand emotions. Remember: There's no right or wrong, everyone grows at their own pace!"
                  )}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Target Audience Card */}
          <GlassCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-accent/50">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {t('邊個可以玩？', 'Who can play?')}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  <strong className="text-primary">
                    {t('小一至小六', 'Grade 1-6')}
                  </strong> {t('嘅同學仔（7-12歲）', 'students (ages 7-12)')}
                </p>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t('⚠️ 呢個只係參考，唔係心理測試', '⚠️ This is for reference only, not a psychological test')}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Skills Section */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">
              {t('我哋會睇呢 5 種情緒技能', "We'll look at these 5 emotional skills")}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {skills.map((skill, index) => (
              <motion.span
                key={skill.name}
                className={`px-4 py-2 rounded-full text-white font-medium text-sm ${skill.color}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {skill.name}
              </motion.span>
            ))}
          </div>
          
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-emotion-labeling" />
            {t('四個成長階段', 'Four Growth Stages')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.name}
                className="text-center p-3 rounded-xl bg-muted/30"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <span className="text-2xl mb-1 block">{stage.icon}</span>
                <p className="font-bold text-sm">{stage.name}</p>
                <p className="text-xs text-muted-foreground">{stage.desc}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Start Section */}
        <GlassCard variant="strong" className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-lg text-muted-foreground mb-6">
              {t(
                '大約 5-10 分鐘 就做完，準備好未？🎯',
                'Takes about 5-10 minutes to complete. Ready? 🎯'
              )}
            </p>

            {showNameInput && (
              <motion.div
                className="max-w-sm mx-auto mb-6"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-left font-medium mb-2">
                  {t('你叫咩名？👋', "What's your name? 👋")}
                </label>
                <Input
                  type="text"
                  placeholder={t('例如：小明', 'e.g., Alex')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg h-14 rounded-xl border-2 border-primary/20 focus:border-primary"
                  onKeyDown={(e) => e.key === 'Enter' && name.trim() && handleStart()}
                />
              </motion.div>
            )}

            <Button
              onClick={handleStart}
              disabled={showNameInput && !name.trim()}
              className="touch-button bg-primary-gradient text-primary-foreground text-xl px-12"
            >
              {showNameInput 
                ? t('開始啦！', "Let's Go!") 
                : t('我準備好喇！', "I'm Ready!")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
