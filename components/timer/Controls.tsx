'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerStore } from '../../store/timerStore';
import { useTimer } from '../../hooks/useTimer';

export default function Controls({}: { isIdle: boolean }) {
  const { status } = useTimerStore();
  const { start, interrupt, confirmInterrupt } = useTimer();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const isRunning = status === 'running';
  const isPaused = status === 'paused';

  const handleInterruptClick = () => {
    interrupt();
    setShowConfirm(true);
  };

  const handleKeepGoing = () => {
    setShowConfirm(false);
    start(); // Resume
  };

  const handleConfirmInterrupt = () => {
    setShowConfirm(false);
    confirmInterrupt();
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center mt-12 min-h-[60px]"
    >
      <AnimatePresence mode="wait">
        {!isRunning && !isPaused && (
          <motion.button
            key="start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={start}
            className="px-7 py-3 rounded-md border border-[#1C1C1C] text-text-primary text-[13px] font-sans hover:bg-accent/10 hover:border-accent transition-all duration-300"
          >
            Start session <span className="ml-1 opacity-50">→</span>
          </motion.button>
        )}

        {isRunning && (
          <motion.button
            key="interrupt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleInterruptClick}
            className="font-mono text-[10px] tracking-[0.08em] uppercase text-text-muted hover:text-text-secondary hover:tracking-[0.04em] transition-all duration-150"
          >
            interrupt
          </motion.button>
        )}

        {isPaused && showConfirm && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="font-sans text-[12px] text-text-secondary">Mark as interrupted and reset?</span>
            <div className="flex gap-4">
              <button 
                onClick={handleConfirmInterrupt}
                className="font-sans text-[12px] text-accent hover:underline underline-offset-4"
              >
                yes
              </button>
              <button 
                onClick={handleKeepGoing}
                className="font-sans text-[12px] text-text-muted hover:text-text-secondary transition-colors"
              >
                keep going
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
