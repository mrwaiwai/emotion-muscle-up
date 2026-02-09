import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { DragItem, DragMatch } from '@/data/gameQuestions';

interface DragMatchGameProps {
  items: DragItem[];
  correctMatches: DragMatch[];
  onComplete: (matches: { sourceId: string; targetId: string }[], score: number) => void;
  scoringConfig?: {
    countScores?: { count: number; score: number }[];
  };
}

export function DragMatchGame({ items, correctMatches, onComplete, scoringConfig }: DragMatchGameProps) {
  const { language } = useLanguage();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ sourceId: string; targetId: string }[]>([]);
  
  const sources = items.filter(item => item.type === 'source');
  const targets = items.filter(item => item.type === 'target');

  const getItemText = (item: DragItem) => {
    return language === 'en' && item.textEn ? item.textEn : item.text;
  };

  const isSourceMatched = (sourceId: string) => {
    return matches.some(m => m.sourceId === sourceId);
  };

  const isTargetMatched = (targetId: string) => {
    return matches.some(m => m.targetId === targetId);
  };

  const getMatchForTarget = (targetId: string) => {
    return matches.find(m => m.targetId === targetId);
  };

  const calculateScore = useCallback((currentMatches: typeof matches) => {
    let correctCount = 0;
    currentMatches.forEach(match => {
      const isCorrect = correctMatches.some(
        cm => cm.sourceId === match.sourceId && cm.targetId === match.targetId
      );
      if (isCorrect) correctCount++;
    });

    if (scoringConfig?.countScores) {
      const scoreEntry = scoringConfig.countScores.find(s => s.count === correctCount);
      return scoreEntry?.score || 1;
    }

    // Default scoring based on correct matches
    if (correctCount === 0) return 1;
    if (correctCount <= correctMatches.length / 2) return 2;
    return 3;
  }, [correctMatches, scoringConfig]);

  const handleSourceClick = (sourceId: string) => {
    if (isSourceMatched(sourceId)) {
      // Remove existing match
      const newMatches = matches.filter(m => m.sourceId !== sourceId);
      setMatches(newMatches);
      onComplete(newMatches, calculateScore(newMatches));
    } else {
      setSelectedSource(sourceId === selectedSource ? null : sourceId);
    }
  };

  const handleTargetClick = (targetId: string) => {
    if (!selectedSource) return;
    
    // Remove existing match for this target if any
    let newMatches = matches.filter(m => m.targetId !== targetId && m.sourceId !== selectedSource);
    
    // Add new match
    newMatches = [...newMatches, { sourceId: selectedSource, targetId }];
    setMatches(newMatches);
    setSelectedSource(null);
    
    onComplete(newMatches, calculateScore(newMatches));
  };

  return (
    <div className="space-y-6">
      {/* Sources */}
      <div className="grid grid-cols-2 gap-3">
        {sources.map((item, index) => {
          const isMatched = isSourceMatched(item.id);
          const isActive = selectedSource === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleSourceClick(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "p-3 rounded-xl border-2 transition-all duration-200",
                "bg-white/60 backdrop-blur-sm",
                isActive && "ring-2 ring-primary ring-offset-2",
                isMatched 
                  ? "border-green-400 bg-green-50/50 opacity-60" 
                  : "border-white/50 hover:border-primary/50"
              )}
            >
              <span className="text-2xl block mb-1">{item.icon}</span>
              <span className="text-sm font-medium">{getItemText(item)}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Connection indicator */}
      {selectedSource && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-2"
        >
          <span className="text-2xl">⬇️</span>
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? 'Tap a target to connect!' : '點擊下面嘅目標連接！'}
          </p>
        </motion.div>
      )}

      {/* Targets */}
      <div className="grid grid-cols-2 gap-3">
        {targets.map((item, index) => {
          const match = getMatchForTarget(item.id);
          const matchedSource = match ? sources.find(s => s.id === match.sourceId) : null;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleTargetClick(item.id)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: selectedSource ? 1.05 : 1 }}
              whileTap={{ scale: 0.97 }}
              disabled={!selectedSource && !match}
              className={cn(
                "p-3 rounded-xl border-2 transition-all duration-200 min-h-[80px]",
                "bg-white/60 backdrop-blur-sm",
                match 
                  ? "border-green-400 bg-green-50/50" 
                  : "border-white/50",
                selectedSource && "hover:border-primary hover:bg-primary/5 cursor-pointer"
              )}
            >
              <span className="text-2xl block mb-1">{item.icon}</span>
              <span className="text-sm font-medium">{getItemText(item)}</span>
              
              {/* Show matched source */}
              {matchedSource && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-2 px-2 py-1 bg-green-100 rounded-lg text-xs"
                >
                  {matchedSource.icon} {getItemText(matchedSource)}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Match counter */}
      <div className="text-center text-sm text-muted-foreground">
        {language === 'en' 
          ? `${matches.length} connections made` 
          : `已連接 ${matches.length} 對`}
      </div>
    </div>
  );
}
