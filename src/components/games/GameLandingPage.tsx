import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/GlassCard';
import { Gamepad2, Sparkles, Target, Brain, Heart, MessageCircle, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

interface GameLandingPageProps {
  onStart: (name: string, studentClass?: string, schoolName?: string) => void;
}

export function GameLandingPage({ onStart }: GameLandingPageProps) {
  const { t } = useLanguage();
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [schoolName, setSchoolName] = useState('');

  const handleStart = () => {
    if (showNameInput && name.trim()) {
      onStart(name.trim(), studentClass.trim() || undefined, schoolName.trim() || undefined);
    } else {
      setShowNameInput(true);
    }
  };

  const gameTypes = [
    { icon: '🎯', label: t('卡牌選擇', 'Card Selection') },
    { icon: '🌡️', label: t('情緒溫度計', 'Emotion Thermometer') },
    { icon: '🔗', label: t('連線配對', 'Match Connection') },
    { icon: '☁️', label: t('詞語雲', 'Word Cloud') },
  ];

  const skills = [
    { icon: Target, label: t('辨別', 'Recognizing'), color: 'text-emotion-recognizing' },
    { icon: Brain, label: t('理解', 'Understanding'), color: 'text-emotion-understanding' },
    { icon: Heart, label: t('標記', 'Labeling'), color: 'text-emotion-labeling' },
    { icon: MessageCircle, label: t('表達', 'Expressing'), color: 'text-emotion-expressing' },
    { icon: Shield, label: t('調節', 'Regulating'), color: 'text-emotion-regulating' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center py-8 px-4"
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Hero */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <span className="text-7xl mb-4 block">🎮</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            {t('情緒 MUSCLE UP 2.0', 'Emotion MUSCLE UP 2.0')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('遊戲化情緒測驗', 'Gamified Emotional Assessment')}
          </p>
        </motion.div>

        {/* Game types preview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              {t('互動遊戲類型', 'Interactive Game Types')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gameTypes.map((type, index) => (
                <motion.div
                  key={type.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-3 bg-white/50 rounded-xl text-center"
                >
                  <span className="text-2xl block mb-1">{type.icon}</span>
                  <span className="text-sm font-medium">{type.label}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Skills preview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              {t('測量五大情緒技能', 'Measuring 5 Emotional Skills')}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full"
                >
                  <skill.icon className={`w-4 h-4 ${skill.color}`} />
                  <span className="text-sm font-medium">{skill.label}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8 text-muted-foreground"
        >
          <p className="text-lg">
            {t('20 條互動問題 • 約 10 分鐘完成', '20 Interactive Questions • About 10 minutes')}
          </p>
        </motion.div>

        {/* Start button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {showNameInput && (
            <motion.div
              className="max-w-sm mx-auto mb-6 space-y-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Input
                type="text"
                placeholder={t('學生姓名', 'Student name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-xl border-2 border-primary/20 focus:border-primary"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder={t('班級（可選）', 'Class (optional)')}
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="h-12 rounded-xl border-2 border-primary/20 focus:border-primary"
                />
                <Input
                  type="text"
                  placeholder={t('學校（可選）', 'School (optional)')}
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="h-12 rounded-xl border-2 border-primary/20 focus:border-primary"
                  onKeyDown={(e) => e.key === 'Enter' && name.trim() && handleStart()}
                />
              </div>
            </motion.div>
          )}

          <Button
            size="lg"
            onClick={handleStart}
            disabled={showNameInput && !name.trim()}
            className="h-16 px-12 text-xl rounded-2xl bg-primary-gradient shadow-lg hover:shadow-xl transition-shadow"
          >
            <Gamepad2 className="w-6 h-6 mr-2" />
            {showNameInput ? t('開始遊戲！', 'Start Game!') : t('我準備好喇！', "I'm Ready!")}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
