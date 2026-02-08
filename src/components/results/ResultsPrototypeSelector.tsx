import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../GlassCard';
import { GrowthStagesResult } from './GrowthStagesResult';
import { MuscleMetaphorResult } from './MuscleMetaphorResult';
import { GardenVisualResult } from './GardenVisualResult';
import { CharacterBadgeResult } from './CharacterBadgeResult';
import { SkillBars } from '../SkillBars';
import { SkillsRadarChart } from '../SkillsRadarChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AssessmentResult } from '@/hooks/useAssessment';
import { useLanguage } from '@/contexts/LanguageContext';
import { Download, RotateCcw, TreeDeciduous, Dumbbell, Flower2, Award, BarChart3 } from 'lucide-react';

interface ResultsPrototypeSelectorProps {
  result: AssessmentResult;
  onReset: () => void;
  onDownloadPdf: () => void;
}

const prototypes = [
  {
    id: 'growth',
    labelZh: '成長階段',
    labelEn: 'Growth Stages',
    Icon: TreeDeciduous,
    descZh: '用「萌芽→成長→茁壯」階段描述',
    descEn: 'Uses sprouting → growing → flourishing stages',
  },
  {
    id: 'muscle',
    labelZh: '肌肉隱喻',
    labelEn: 'Muscle Up',
    Icon: Dumbbell,
    descZh: '配合 MUSCLE UP 主題，強調訓練',
    descEn: 'Matches MUSCLE UP theme with training focus',
  },
  {
    id: 'garden',
    labelZh: '花園成長',
    labelEn: 'Garden',
    Icon: Flower2,
    descZh: '視覺化花園，每個技能係一棵植物',
    descEn: 'Visual garden where each skill is a plant',
  },
  {
    id: 'badge',
    labelZh: '角色徽章',
    labelEn: 'Badges',
    Icon: Award,
    descZh: '解鎖唔同情緒角色同徽章',
    descEn: 'Unlock different emotion characters and badges',
  },
  {
    id: 'original',
    labelZh: '原版 (有分數)',
    labelEn: 'Original (with scores)',
    Icon: BarChart3,
    descZh: '保留雷達圖同進度條嘅分數版本',
    descEn: 'Keeps radar chart and progress bars with scores',
  },
];

export function ResultsPrototypeSelector({ result, onReset, onDownloadPdf }: ResultsPrototypeSelectorProps) {
  const { t } = useLanguage();
  const [selectedPrototype, setSelectedPrototype] = useState('growth');

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
            {t('🎨 結果頁面方案比較', '🎨 Results Page Prototype Comparison')}
          </h1>
          <p className="text-muted-foreground">
            {t('請選擇你想要嘅呈現方式', 'Choose your preferred presentation style')}
          </p>
        </motion.div>

        {/* Student info banner */}
        <GlassCard className="p-4 mb-6 text-center">
          <p className="text-lg">
            {t('示範學生：', 'Demo Student: ')}
            <span className="font-bold gradient-text">{result.studentName}</span>
          </p>
        </GlassCard>

        {/* Prototype Tabs */}
        <Tabs value={selectedPrototype} onValueChange={setSelectedPrototype} className="space-y-6">
          <TabsList className="w-full h-auto flex-wrap gap-2 bg-muted/50 p-2 rounded-xl">
            {prototypes.map((proto) => {
              const Icon = proto.Icon;
              return (
                <TabsTrigger
                  key={proto.id}
                  value={proto.id}
                  className="flex-1 min-w-[120px] flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">
                    {t(proto.labelZh, proto.labelEn)}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Description */}
          <div className="text-center text-sm text-muted-foreground">
            {prototypes.find(p => p.id === selectedPrototype) && (
              <p>
                {t(
                  prototypes.find(p => p.id === selectedPrototype)!.descZh,
                  prototypes.find(p => p.id === selectedPrototype)!.descEn
                )}
              </p>
            )}
          </div>

          {/* Content */}
          <GlassCard className="p-6">
            <TabsContent value="growth" className="mt-0">
              <GrowthStagesResult skillScores={result.skillScores} />
            </TabsContent>

            <TabsContent value="muscle" className="mt-0">
              <MuscleMetaphorResult skillScores={result.skillScores} />
            </TabsContent>

            <TabsContent value="garden" className="mt-0">
              <GardenVisualResult skillScores={result.skillScores} />
            </TabsContent>

            <TabsContent value="badge" className="mt-0">
              <CharacterBadgeResult skillScores={result.skillScores} />
            </TabsContent>

            <TabsContent value="original" className="mt-0 space-y-6">
              <SkillsRadarChart skillScores={result.skillScores} />
              <SkillBars skillScores={result.skillScores} />
            </TabsContent>
          </GlassCard>
        </Tabs>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            size="lg"
            onClick={onDownloadPdf}
            className="h-14 px-8 rounded-xl bg-primary-gradient text-primary-foreground"
          >
            <Download className="w-5 h-5 mr-2" />
            {t('下載報告 PDF', 'Download Report PDF')}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onReset}
            className="h-14 px-8 rounded-xl"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t('再做一次', 'Try Again')}
          </Button>
        </motion.div>

        {/* Selection prompt */}
        <motion.div
          className="mt-8 p-4 rounded-xl bg-primary/10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm">
            {t(
              '💡 你鍾意邊個方案？喺 chat 話我知你嘅選擇！',
              '💡 Which style do you prefer? Let me know your choice in the chat!'
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
