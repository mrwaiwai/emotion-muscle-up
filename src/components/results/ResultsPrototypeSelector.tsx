import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../GlassCard';
import { CharacterBadgeResult } from './CharacterBadgeResult';
import { SkillBars } from '../SkillBars';
import { SkillsRadarChart } from '../SkillsRadarChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AssessmentResult } from '@/hooks/useAssessment';
import { useLanguage } from '@/contexts/LanguageContext';
import { Download, RotateCcw, Award, BarChart3 } from 'lucide-react';

interface ResultsPrototypeSelectorProps {
  result: AssessmentResult;
  onReset: () => void;
  onDownloadPdf: () => void;
}

const resultViews = [
  {
    id: 'badge',
    labelZh: '角色徽章',
    labelEn: 'Badges',
    Icon: Award,
    descZh: '解鎖唔同情緒角色同徽章',
    descEn: 'Unlock different emotion characters and badges',
  },
  {
    id: 'muscle-map',
    labelZh: '情緒肌肉地圖',
    labelEn: 'Emotion Muscle Map',
    Icon: BarChart3,
    descZh: '用雷達圖同進度條呈現五大情緒技能分數',
    descEn: 'Shows five emotional skill scores with radar chart and progress bars',
  },
];

export function ResultsPrototypeSelector({ result, onReset, onDownloadPdf }: ResultsPrototypeSelectorProps) {
  const { t } = useLanguage();
  const [selectedResultView, setSelectedResultView] = useState('badge');

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
            {t('情緒 MUSCLE UP 結果', 'Emotion MUSCLE UP Results')}
          </h1>
          <p className="text-muted-foreground">
            {t('查看你嘅角色徽章同情緒肌肉地圖', 'View your character badge and emotion muscle map')}
          </p>
        </motion.div>

        {/* Student info banner */}
        <GlassCard className="p-4 mb-6 text-center">
          <p className="text-lg">
            {t('學生名稱：', 'Student Name: ')}
            <span className="font-bold gradient-text">{result.studentName}</span>
          </p>
        </GlassCard>

        {/* Result Tabs */}
        <Tabs value={selectedResultView} onValueChange={setSelectedResultView} className="space-y-6">
          <TabsList className="w-full h-auto flex-wrap gap-2 bg-muted/50 p-2 rounded-xl">
            {resultViews.map((view) => {
              const Icon = view.Icon;
              return (
                <TabsTrigger
                  key={view.id}
                  value={view.id}
                  className="flex-1 min-w-[120px] flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">
                    {t(view.labelZh, view.labelEn)}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Description */}
          <div className="text-center text-sm text-muted-foreground">
            {resultViews.find((view) => view.id === selectedResultView) && (
              <p>
                {t(
                  resultViews.find((view) => view.id === selectedResultView)!.descZh,
                  resultViews.find((view) => view.id === selectedResultView)!.descEn
                )}
              </p>
            )}
          </div>

          {/* Content */}
          <GlassCard className="p-6">
            <TabsContent value="badge" className="mt-0">
              <CharacterBadgeResult skillScores={result.skillScores} />
            </TabsContent>

            <TabsContent value="muscle-map" className="mt-0 space-y-6">
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

      </div>
    </div>
  );
}
