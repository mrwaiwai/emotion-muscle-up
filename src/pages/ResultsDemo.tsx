import { FloatingOrbs } from '@/components/FloatingOrbs';
import { ResultsPrototypeSelector } from '@/components/results/ResultsPrototypeSelector';
import { AssessmentResult, AbilityLevel } from '@/hooks/useAssessment';
import { useNavigate } from 'react-router-dom';

// Demo data for testing the results page
const demoAbilityLevels: AbilityLevel[] = [
  { name: '情緒韌力', nameEn: 'Emotional Resilience', level: 'medium', percentage: 60 },
  { name: '情緒靈活度', nameEn: 'Emotional Agility', level: 'high', percentage: 75 },
  { name: '情緒素養', nameEn: 'Emotional Literacy', level: 'support', percentage: 45 },
];

const demoResult: AssessmentResult = {
  studentName: '小明',
  skillScores: [
    { skill: 'recognizing', score: 8, maxScore: 10, percentage: 80 },
    { skill: 'understanding', score: 6, maxScore: 10, percentage: 60 },
    { skill: 'labeling', score: 7, maxScore: 10, percentage: 70 },
    { skill: 'expressing', score: 5, maxScore: 10, percentage: 50 },
    { skill: 'regulating', score: 4, maxScore: 10, percentage: 40 },
  ],
  abilityLevels: demoAbilityLevels,
  completedAt: new Date(),
};

const ResultsDemo = () => {
  const navigate = useNavigate();

  const handleReset = () => {
    navigate('/');
  };

  const handleDownloadPdf = () => {
    // Demo - no actual download
    alert('PDF 下載功能 (示範模式)');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingOrbs />
      <ResultsPrototypeSelector
        result={demoResult}
        onReset={handleReset}
        onDownloadPdf={handleDownloadPdf}
      />
    </div>
  );
};

export default ResultsDemo;
