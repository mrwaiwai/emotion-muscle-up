import { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { SkillScore } from '@/hooks/useAssessment';
import { skillInfo, SkillType } from '@/data/questions';

interface SkillsRadarChartProps {
  skillScores: SkillScore[];
}

export function SkillsRadarChart({ skillScores }: SkillsRadarChartProps) {
  const chartData = useMemo(() => {
    return skillScores.map((score) => ({
      skill: skillInfo[score.skill].name,
      skillEn: skillInfo[score.skill].nameEn,
      value: score.percentage,
      fullMark: 100,
    }));
  }, [skillScores]);

  const skillColors: Record<SkillType, string> = {
    recognizing: 'hsl(340, 70%, 65%)',
    understanding: 'hsl(200, 70%, 60%)',
    labeling: 'hsl(45, 85%, 60%)',
    expressing: 'hsl(280, 60%, 65%)',
    regulating: 'hsl(160, 60%, 55%)',
  };

  return (
    <div className="w-full h-[300px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.5}
          />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ 
              fill: 'hsl(var(--foreground))', 
              fontSize: 12,
              fontWeight: 600,
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="情緒技能"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              boxShadow: '0 4px 20px hsl(var(--primary) / 0.1)',
            }}
            formatter={(value: number) => [`${value}%`, '能力水平']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
