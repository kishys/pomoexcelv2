'use client';
import { useTimerStore } from '../../store/timerStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function MomentumBadge({ isIdle }: { isIdle: boolean }) {
  const { momentumScore } = useTimerStore();
  const [prevScore, setPrevScore] = useState(momentumScore);
  const [trend, setTrend] = useState<'up' | 'down' | 'flat'>('flat');
  
  useEffect(() => {
    if (momentumScore > prevScore) setTrend('up');
    else if (momentumScore < prevScore) setTrend('down');
    setPrevScore(momentumScore);
  }, [momentumScore, prevScore]);

  // Color logic
  let colorClass = 'text-text-muted'; // < 20
  if (momentumScore >= 80) colorClass = 'text-accent';
  else if (momentumScore >= 50) colorClass = 'text-text-primary';
  else if (momentumScore >= 20) colorClass = 'text-text-secondary';

  if (!isIdle) {
    return (
      <div className="font-mono text-[9px] text-text-muted flex items-center gap-1">
        <span>momentum</span>
        <span className={colorClass}>{momentumScore}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end group cursor-help relative">
      <motion.div 
        key={momentumScore}
        initial={{ scale: 1 }}
        animate={{ scale: trend === 'up' ? [1, 1.15, 1] : 1 }}
        transition={{ duration: 0.2 }}
        className={`font-mono text-[28px] font-light leading-none flex items-center gap-1.5 ${colorClass}`}
      >
        <AnimatePresence mode="wait">
          {trend === 'up' && (
            <motion.span 
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 0.6, y: 0 }} exit={{ opacity: 0 }}
              className="text-[10px]"
            >
              ↑
            </motion.span>
          )}
          {trend === 'down' && (
            <motion.span 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 0.6, y: 0 }} exit={{ opacity: 0 }}
              className="text-[10px]"
            >
              ↓
            </motion.span>
          )}
        </AnimatePresence>
        {momentumScore}
      </motion.div>
      <div className="font-mono text-[9px] text-text-muted mt-1">momentum</div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-surface border border-border px-3 py-1.5 rounded-md shadow-lg z-50">
        <span className="font-sans text-[11px] text-text-secondary whitespace-nowrap">focus velocity</span>
      </div>
    </div>
  );
}
