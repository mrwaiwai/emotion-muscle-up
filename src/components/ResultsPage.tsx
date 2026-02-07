import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { SkillsRadarChart } from './SkillsRadarChart';
import { SkillBars } from './SkillBars';
import { AbilityCards } from './AbilityCards';
import { Button } from '@/components/ui/button';
import { AssessmentResult } from '@/hooks/useAssessment';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { Download, RotateCcw, Sparkles, Heart, Star } from 'lucide-react';

interface ResultsPageProps {
  result: AssessmentResult;
  onReset: () => void;
}

export function ResultsPage({ result, onReset }: ResultsPageProps) {
  const { resultRef, generatePdf } = usePdfGenerator();

  const handleDownloadPdf = () => {
    generatePdf(result);
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Celebration Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            {['🎉', '💪', '⭐'].map((emoji, i) => (
              <motion.span
                key={i}
                className="text-4xl md:text-5xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            好叻呀，<span className="gradient-text">{result.studentName}</span>！
          </h1>
          <p className="text-lg text-muted-foreground">
            你完成咗情緒 MUSCLE UP 測驗喇！
          </p>
        </motion.div>

        {/* Results Content - For PDF Reference */}
        <div ref={resultRef}>
          {/* Radar Chart Card */}
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">你嘅情緒肌肉地圖 🗺️</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              呢個圖顯示你喺五種情緒技能嘅表現
            </p>
            <SkillsRadarChart skillScores={result.skillScores} />
          </GlassCard>

          {/* Skills Breakdown */}
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-emotion-labeling" />
              <h2 className="text-xl font-bold">五種情緒技能</h2>
            </div>
            <SkillBars skillScores={result.skillScores} />
          </GlassCard>

          {/* Ability Levels */}
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-emotion-recognizing" />
              <h2 className="text-xl font-bold">三大情緒能力</h2>
            </div>
            <AbilityCards abilityLevels={result.abilityLevels} />
          </GlassCard>
        </div>

        {/* Encouragement Message */}
        <GlassCard variant="strong" className="p-6 mb-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg leading-relaxed mb-4">
              <span className="text-2xl mr-2">🌟</span>
              呢個係屬於你嘅<strong className="text-primary">情緒肌肉地圖</strong>！
              <br />
              每個人都有自己嘅成長速度，<strong>冇分好壞</strong>，只係唔同階段。
              <br />
              繼續練習，你嘅情緒肌肉會越嚟越強！
              <span className="text-2xl ml-2">💪</span>
            </p>
            
            <div className="p-4 rounded-xl bg-muted/30 text-sm text-muted-foreground">
              <p>
                💡 測驗只係起點，真正嘅成長會喺課堂活動、工作坊同練習入面發生！
              </p>
            </div>
          </motion.div>
        </GlassCard>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            onClick={handleDownloadPdf}
            className="h-14 px-8 rounded-xl bg-primary-gradient text-primary-foreground"
          >
            <Download className="w-5 h-5 mr-2" />
            下載老師報告 PDF
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onReset}
            className="h-14 px-8 rounded-xl"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            再做一次
          </Button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          ⚠️ 呢個測驗只係參考，唔係心理診斷。如有疑問，請諮詢專業人士。
        </motion.p>
      </div>
    </div>
  );
}
