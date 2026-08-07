'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveClock({ isIdle }: { isIdle: boolean }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const dateStr = `${days[time.getDay()]} · ${months[time.getMonth()]} ${time.getDate()} · ${time.getFullYear()}`;

  return (
    <motion.div 
      layoutId="time-display"
      className="flex flex-col items-center justify-center pointer-events-none z-10"
      initial={false}
      animate={isIdle ? {
        scale: 1,
        y: 0,
        opacity: 1
      } : {
        scale: 0.3,
        y: -100,
        x: -200,
        opacity: 0.5
      }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <AnimatePresence>
        {isIdle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-8 font-sans text-[11px] tracking-[0.1em] text-text-secondary"
          >
            {dateStr}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-baseline font-mono font-light text-text-primary">
        <span className="text-[clamp(72px,12vw,120px)] leading-none">{hours.toString().padStart(2, '0')}</span>
        <span className="text-[clamp(72px,12vw,120px)] leading-none mx-[2vw] opacity-30 animate-pulse">:</span>
        <span className="text-[clamp(72px,12vw,120px)] leading-none">{minutes}</span>
        <span className="text-[clamp(72px,12vw,120px)] leading-none mx-[2vw] opacity-30 animate-pulse">:</span>
        <span className="text-[clamp(32px,5vw,52px)] leading-none opacity-40 inline-block align-baseline">
          {seconds}
        </span>
      </div>
      
      <AnimatePresence>
        {isIdle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 font-mono text-[11px] tracking-[0.12em] text-text-secondary"
          >
            {ampm}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
