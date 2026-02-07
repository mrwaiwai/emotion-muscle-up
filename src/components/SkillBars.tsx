import { motion } from 'framer-motion';
import { SkillScore } from '@/hooks/useAssessment';
import { skillInfo, SkillType } from '@/data/questions';
import { useLanguage } from '@/contexts/LanguageContext';
import { Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SkillBarsProps {
  skillScores: SkillScore[];
}

const skillExplanations: Record<SkillType, { zh: string; en: string }> = {
  recognizing: {
    zh: '辨別情緒係指能夠留意到自己或者其他人嘅情緒變化，例如透過面部表情、身體語言或者行為嚟察覺情緒。呢個技能係情緒管理嘅第一步。',
    en: 'Recognizing emotions means being able to notice emotional changes in yourself or others, such as through facial expressions, body language, or behavior. This skill is the first step in emotional management.',
  },
  understanding: {
    zh: '理解情緒係指明白情緒背後嘅原因同影響。例如，知道點解自己會嬲，或者明白朋友點解會傷心。呢個技能幫助我哋建立同理心同更好嘅人際關係。',
    en: 'Understanding emotions means knowing the reasons behind emotions and their effects. For example, knowing why you feel angry, or understanding why a friend is sad. This skill helps build empathy and better relationships.',
  },
  labeling: {
    zh: '標記情緒係指能夠準確咁用詞語嚟形容唔同嘅情緒。例如，分辨「緊張」同「驚慌」嘅分別。識得用精準嘅詞語可以幫助我哋更清楚咁表達感受。',
    en: 'Labeling emotions means being able to accurately describe different feelings with words. For example, distinguishing between "nervous" and "scared." Using precise words helps us express feelings more clearly.',
  },
  expressing: {
    zh: '表達情緒係指用適當嘅方式將自己嘅感受話俾人知。可以透過說話、寫字、畫畫或者其他方式。健康咁表達情緒有助溝通同減少誤會。',
    en: 'Expressing emotions means sharing your feelings with others in appropriate ways. This can be through talking, writing, drawing, or other methods. Healthy expression helps communication and reduces misunderstandings.',
  },
  regulating: {
    zh: '調節情緒係指能夠管理同控制自己嘅情緒反應。例如，喺嬲嘅時候識得冷靜返，或者喺緊張嘅時候識得放鬆。呢個技能幫助我哋喺唔同情況下保持平衡。',
    en: 'Regulating emotions means being able to manage and control your emotional responses. For example, calming down when angry, or relaxing when nervous. This skill helps maintain balance in different situations.',
  },
};

export function SkillBars({ skillScores }: SkillBarsProps) {
  const { t } = useLanguage();
  
  const skillColors: Record<string, string> = {
    recognizing: 'bg-skill-recognizing',
    understanding: 'bg-skill-understanding',
    labeling: 'bg-skill-labeling',
    expressing: 'bg-skill-expressing',
    regulating: 'bg-skill-regulating',
  };

  return (
    <div className="space-y-2">
      {/* Explanation Accordion */}
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="explanation" className="border-none">
          <AccordionTrigger className="py-2 text-sm text-muted-foreground hover:no-underline">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              {t('咩係五大情緒技能？', 'What are the Five Emotional Skills?')}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 rounded-xl bg-muted/30 space-y-3 text-sm">
              <p className="text-muted-foreground mb-3">
                {t(
                  '五大情緒技能係情緒智能嘅基礎，幫助小朋友認識同管理自己嘅情緒：',
                  'The Five Emotional Skills form the foundation of emotional intelligence, helping children recognize and manage their emotions:'
                )}
              </p>
              {skillScores.map((score) => (
                <div key={score.skill} className="pb-2 border-b border-border/50 last:border-0 last:pb-0">
                  <p className="font-medium text-foreground">
                    {skillInfo[score.skill].name} ({skillInfo[score.skill].nameEn})
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {t(skillExplanations[score.skill].zh, skillExplanations[score.skill].en)}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Skill Bars */}
      {skillScores.map((score, index) => (
        <motion.div
          key={score.skill}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-sm">
              {skillInfo[score.skill].name}
              <span className="text-muted-foreground ml-2 font-normal">
                {skillInfo[score.skill].nameEn}
              </span>
            </span>
            <span className="font-bold text-primary">{score.percentage}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${skillColors[score.skill]}`}
              initial={{ width: 0 }}
              animate={{ width: `${score.percentage}%` }}
              transition={{ duration: 0.8, delay: 0.2 + 0.1 * index, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
