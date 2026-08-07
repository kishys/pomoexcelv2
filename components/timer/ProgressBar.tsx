'use client';
import { useTimerStore } from '../../store/timerStore';

export default function ProgressBar() {
  const { timeRemaining, totalDuration, status } = useTimerStore();
  
  // Progress is 0 when idle, increasing to 100 as time ticks down
  let progress = 0;
  if (status === 'running' || status === 'paused') {
    progress = ((totalDuration - timeRemaining) / totalDuration) * 100;
  }
  if (status === 'complete') {
    progress = 100;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full h-[1px] bg-border z-20">
      <div 
        className="h-full bg-text-primary transition-all duration-1000 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
