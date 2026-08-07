'use client';
import { useTimerStore } from '../../store/timerStore';
import { motion } from 'framer-motion';

export default function SessionDots() {
  const { sessionNumber, settings } = useTimerStore();
  const total = settings.sessionsBeforeLongBreak;
  
  return (
    <div className="flex items-center gap-2.5 mt-6">
      {Array.from({ length: total }).map((_, i) => {
        const dotNumber = i + 1;
        const isCompleted = dotNumber < sessionNumber;
        const isCurrent = dotNumber === sessionNumber;
        const isLast = dotNumber === total;
        
        let bgColor = 'bg-text-muted';
        let opacity = 1;
        let scale = 1;
        
        if (isCompleted) {
          bgColor = 'bg-accent';
        } else if (isCurrent) {
          bgColor = 'bg-accent';
          opacity = 0.5;
          scale = 1.2;
        }

        return (
          <motion.div
            key={i}
            layout
            initial={false}
            animate={{ scale, opacity }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`${isLast ? 'w-2 h-2 rounded-[2px] ml-1' : 'w-1.5 h-1.5 rounded-full'} ${bgColor} transition-colors duration-300`}
          />
        );
      })}
      
      <div className="ml-3 font-sans text-[11px] text-text-muted">
        {sessionNumber} of {total}
      </div>
    </div>
  );
}
