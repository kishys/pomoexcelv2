'use client';
import { motion } from 'framer-motion';
import { useTimerStore } from '../../store/timerStore';
import { useEffect, useState } from 'react';

export default function TimerDisplay({ isIdle }: { isIdle: boolean }) {
  const { timeRemaining, status } = useTimerStore();
  
  // Format the time
  const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
  const seconds = (timeRemaining % 60).toString().padStart(2, '0');
  
  const [blurAmount, setBlurAmount] = useState(0);
  const [prevStatus, setPrevStatus] = useState(status);
  
  useEffect(() => {
    if (prevStatus === 'running' && status === 'complete') {
      // Completion blur wave
      setBlurAmount(4);
      setTimeout(() => setBlurAmount(0), 400);
    }
    setPrevStatus(status);
  }, [status, prevStatus]);

  return (
    <motion.div
      layoutId="time-display"
      className={`flex items-baseline font-mono font-light text-text-primary z-10 ${status === 'running' ? 'timer--running' : ''}`}
      initial={false}
      animate={isIdle ? {
        scale: 0.94,
        opacity: 0,
        y: 20
      } : {
        scale: 1,
        opacity: 1,
        y: 0
      }}
      style={{
        filter: `blur(${blurAmount}px)`,
        transition: 'filter 0.4s ease-out'
      }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <span className="text-[clamp(96px,16vw,160px)] leading-none tracking-[-0.02em]">{minutes}</span>
      <span className="text-[clamp(96px,16vw,160px)] leading-none mx-[1vw] tracking-[-0.02em] animate-pulse">:</span>
      <span className="text-[clamp(96px,16vw,160px)] leading-none tracking-[-0.02em]">{seconds}</span>
    </motion.div>
  );
}
