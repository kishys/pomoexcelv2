'use client';

import { useEffect, useState } from 'react';
import { useTimerStore } from '../store/timerStore';
import { motion } from 'framer-motion';

import LiveClock from '../components/clock/LiveClock';
import TimerDisplay from '../components/timer/TimerDisplay';
import ModeLabel from '../components/timer/ModeLabel';
import SessionIntent from '../components/timer/SessionIntent';
import SessionDots from '../components/timer/SessionDots';
import Controls from '../components/timer/Controls';
import ProgressBar from '../components/timer/ProgressBar';
import MomentumBadge from '../components/timer/MomentumBadge';
import VibeSwitcher from '../components/vibe/VibeSwitcher';
import AmbientSound from '../components/widgets/AmbientSound';

export default function Home() {
  const { status, settings } = useTimerStore();
  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  
  const [isMouseIdle, setIsMouseIdle] = useState(false);
  
  // Idle fade for UI chrome
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const resetIdle = () => {
      setIsMouseIdle(false);
      clearTimeout(timeoutId);
      if (settings.idleFade && isRunning) {
        timeoutId = setTimeout(() => setIsMouseIdle(true), 3000);
      }
    };
    
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    resetIdle();
    
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      clearTimeout(timeoutId);
    };
  }, [isRunning, settings.idleFade]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space to start/pause
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        if (status === 'idle') {
          useTimerStore.getState().setStatus('running');
          // Start sound should ideally be handled via a global effect or useTimer, but for now this triggers state
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  return (
    <main className={`relative w-full h-screen flex flex-col justify-between overflow-hidden transition-colors duration-600 ${isRunning && settings.breathingAnimation ? 'breath-animation' : ''}`}>
      
      {/* SVG Grain Overlay */}
      {settings.grain && (
        <div 
          className="absolute inset-0 pointer-events-none z-[100]" 
          style={{ opacity: `var(--grain-opacity, 0.04)` }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>
      )}

      {/* Header */}
      <motion.header 
        className="flex items-center justify-between px-6 h-12 z-20 shrink-0"
        animate={{ opacity: (isMouseIdle && isRunning) ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-[0.1em] text-text-muted">POMO</span>
          {!isIdle && (
            <button 
              onClick={() => useTimerStore.getState().setStatus('idle')}
              className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors text-[11px] font-mono tracking-wider"
              title="Back to Clock"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              BACK
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <AmbientSound />
          <button className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
            {/* Settings Icon - using text for now or Lucide */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>
        </div>
      </motion.header>

      {/* Main Content Center absolute alignment at 46% */}
      <div className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center z-10">
        
        {isIdle ? (
          <div className="flex flex-col items-center justify-center w-full">
            <LiveClock isIdle={isIdle} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <ModeLabel isIdle={isIdle} />
            <TimerDisplay isIdle={isIdle} />
            <SessionIntent />
            <SessionDots />
          </div>
        )}
        
        {/* Controls must always be rendered so we can leave idle state */}
        <Controls isIdle={isIdle} />
        
      </div>

      {/* Footer Area */}
      <motion.footer 
        className="flex items-end justify-between px-6 pb-6 w-full z-20 shrink-0 min-h-[80px]"
        animate={{ opacity: (isMouseIdle && isRunning) ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center">
          <VibeSwitcher isIdle={isIdle} />
          {/* Widgets go here */}
        </div>
        
        <div className="flex items-end justify-end">
          <MomentumBadge isIdle={isIdle} />
        </div>
      </motion.footer>

      {/* Progress Bar */}
      <ProgressBar />

    </main>
  );
}
