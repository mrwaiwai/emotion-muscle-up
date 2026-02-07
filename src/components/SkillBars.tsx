import { motion } from 'framer-motion';
import { SkillScore } from '@/hooks/useAssessment';
import { skillInfo } from '@/data/questions';

interface SkillBarsProps {
  skillScores: SkillScore[];
}

export function SkillBars({ skillScores }: SkillBarsProps) {
  const skillColors: Record<string, string> = {
    recognizing: 'bg-skill-recognizing',
    understanding: 'bg-skill-understanding',
    labeling: 'bg-skill-labeling',
    expressing: 'bg-skill-expressing',
    regulating: 'bg-skill-regulating',
  };

  return (
    <div className="space-y-4">
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
