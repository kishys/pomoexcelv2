'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerStore } from '../../store/timerStore';

export default function ModeLabel({}: { isIdle: boolean }) {
  const { mode, status } = useTimerStore();
  
  let labelText = 'FOCUS';
  if (mode === 'short_break') labelText = 'SHORT BREAK';
  if (mode === 'long_break') labelText = 'LONG BREAK';

  const isRunning = status === 'running';

  return (
    <div className="flex items-center gap-3 h-6">
      <div 
        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          isRunning && mode === 'focus' 
            ? 'bg-accent shadow-[0_0_8px_3px_rgba(var(--accent-rgb),0.4)] animate-pulse' 
            : isRunning || status === 'paused'
            ? 'bg-text-secondary' 
            : 'bg-text-muted'
        }`}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={labelText}
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
          className={`font-sans text-[10px] font-medium tracking-[0.3em] uppercase ${
            isRunning ? 'text-accent' : 'text-text-secondary'
          }`}
        >
          {labelText.split('').join(' ')}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
