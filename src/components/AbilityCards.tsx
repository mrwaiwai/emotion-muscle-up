import { motion } from 'framer-motion';
import { AbilityLevel } from '@/hooks/useAssessment';
import { TrendingUp, Zap, BookOpen, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AbilityCardsProps {
  abilityLevels: AbilityLevel[];
}

type AbilityType = 'resilience' | 'agility' | 'literacy';

const abilityExplanations: Record<AbilityType, { zh: string; en: string; relatedSkills: { zh: string; en: string } }> = {
  resilience: {
    zh: '情緒韌性係指喺面對壓力、挫折或者困難嘅時候，能夠快啲恢復情緒平衡嘅能力。有良好情緒韌性嘅小朋友可以更好咁應對挑戰，唔會俾負面情緒長期影響。',
    en: 'Emotional Resilience is the ability to quickly recover emotional balance when facing stress, setbacks, or difficulties. Children with good resilience can better cope with challenges without being affected by negative emotions for long.',
    relatedSkills: { zh: '相關技能：調節、理解', en: 'Related skills: Regulating, Understanding' },
  },
  agility: {
    zh: '情緒敏捷係指能夠靈活咁應對唔同情境入面嘅情緒變化。有良好情緒敏捷嘅小朋友可以喺唔同環境下調整自己嘅情緒反應，適應各種社交場合。',
    en: 'Emotional Agility is the ability to flexibly respond to emotional changes in different situations. Children with good agility can adjust their emotional responses in various environments and adapt to different social settings.',
    relatedSkills: { zh: '相關技能：表達、調節', en: 'Related skills: Expressing, Regulating' },
  },
  literacy: {
    zh: '情緒閱讀力係指能夠準確咁辨識、理解同表達情緒嘅能力。有良好情緒閱讀力嘅小朋友可以更準確咁識別自己同他人嘅情緒，並用適當嘅詞語表達出嚟。',
    en: 'Emotional Literacy is the ability to accurately identify, understand, and express emotions. Children with good literacy can more accurately recognize emotions in themselves and others, and express them with appropriate words.',
    relatedSkills: { zh: '相關技能：辨別、標記、理解', en: 'Related skills: Recognizing, Labeling, Understanding' },
  },
};

const abilityKeys: AbilityType[] = ['resilience', 'agility', 'literacy'];

export function AbilityCards({ abilityLevels }: AbilityCardsProps) {
  const { t } = useLanguage();
  
  const icons = [
    <TrendingUp className="w-6 h-6" />,
    <Zap className="w-6 h-6" />,
    <BookOpen className="w-6 h-6" />,
  ];

  const levelLabels = {
    high: { text: t('表現良好', 'Good Performance'), color: 'bg-green-100 text-green-700 border-green-200' },
    medium: { text: t('發展中', 'Developing'), color: 'bg-amber-100 text-amber-700 border-amber-200' },
    support: { text: t('需要更多支援', 'Needs More Support'), color: 'bg-rose-100 text-rose-700 border-rose-200' },
  };

  const bgColors = [
    'bg-gradient-to-br from-green-50 to-teal-50',
    'bg-gradient-to-br from-blue-50 to-indigo-50',
    'bg-gradient-to-br from-purple-50 to-pink-50',
  ];

  return (
    <div className="space-y-4">
      {/* Explanation Accordion */}
      <Accordion type="single" collapsible>
        <AccordionItem value="explanation" className="border-none">
          <AccordionTrigger className="py-2 text-sm text-muted-foreground hover:no-underline">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              {t('咩係三大情緒能力？', 'What are the Three Key Emotional Abilities?')}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 rounded-xl bg-muted/30 space-y-3 text-sm">
              <p className="text-muted-foreground mb-3">
                {t(
                  '三大情緒能力係由五大技能組合而成嘅綜合能力指標，幫助老師快速了解學生嘅整體情緒發展：',
                  'The Three Key Emotional Abilities are comprehensive indicators derived from the five skills, helping teachers quickly understand students\' overall emotional development:'
                )}
              </p>
              {abilityKeys.map((key, index) => (
                <div key={key} className="pb-2 border-b border-border/50 last:border-0 last:pb-0">
                  <p className="font-medium text-foreground">
                    {abilityLevels[index]?.name} ({abilityLevels[index]?.nameEn})
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {t(abilityExplanations[key].zh, abilityExplanations[key].en)}
                  </p>
                  <p className="text-xs text-primary/70 mt-1">
                    {t(abilityExplanations[key].relatedSkills.zh, abilityExplanations[key].relatedSkills.en)}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Ability Cards Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {abilityLevels.map((ability, index) => {
          const levelInfo = levelLabels[ability.level];
          return (
            <motion.div
              key={ability.nameEn}
              className={`p-5 rounded-2xl ${bgColors[index]} border border-white/50`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.15 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-white/70 text-primary">
                  {icons[index]}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{ability.name}</h3>
                  <p className="text-xs text-muted-foreground">{ability.nameEn}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${levelInfo.color}`}>
                  {levelInfo.text}
                </span>
                <span className="text-2xl font-bold text-primary">{ability.percentage}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
