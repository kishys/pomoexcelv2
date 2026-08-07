import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore';
import { audioEngine } from '../lib/audio';

export function useTimer() {
  const {
    status,
    timeRemaining,
    mode,
    settings,
    totalDuration,
    setTimeRemaining,
    setStatus,
    setMode,
    incrementSessionNumber,
    addSessionLog,
    updateMomentum,
    sessionIntent,
    currentVibe,
  } = useTimerStore();

  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'running') {
      // Set end time if we just started running
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeRemaining * 1000;
      }

      intervalRef.current = setInterval(() => {
        if (!endTimeRef.current) return;
        
        const now = Date.now();
        const remaining = Math.round((endTimeRef.current - now) / 1000);

        if (remaining <= 0) {
          // Session Complete
          if (intervalRef.current) clearInterval(intervalRef.current);
          endTimeRef.current = null;
          setTimeRemaining(0);
          setStatus('complete');
          
          audioEngine.playCompleteSession();
          
          if (mode === 'focus') {
            updateMomentum(20);
            addSessionLog({
              id: Date.now().toString(),
              intent: sessionIntent || 'unnamed',
              mode: 'focus',
              status: 'completed',
              duration: totalDuration,
              startedAt: new Date(Date.now() - totalDuration * 1000).toISOString(),
              endedAt: new Date().toISOString(),
              vibe: currentVibe
            });
            incrementSessionNumber();
          } else {
            updateMomentum(5); // break completed
          }
          
          // Auto start next phase logic
          setTimeout(() => {
            if (mode === 'focus') {
              const { sessionNumber, settings } = useTimerStore.getState();
              const nextMode = sessionNumber === 1 ? 'long_break' : 'short_break';
              setMode(nextMode);
              if (settings.autoStartBreaks) {
                setStatus('running');
                audioEngine.playStartBreak();
              } else {
                setStatus('idle');
              }
            } else {
              setMode('focus');
              if (settings.autoStartSessions) {
                setStatus('running');
                audioEngine.playStartSession();
              } else {
                setStatus('idle');
              }
            }
          }, 1500);
          
        } else {
          setTimeRemaining(remaining);
          if (remaining <= 5 && settings.soundEnabled) {
             // Optional final countdown ticks if added later
             // audioEngine.playTick();
          }
        }
      }, 200); // Check 5 times a second to prevent visual skip

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      endTimeRef.current = null;
    }
  }, [status, timeRemaining, mode, settings, setTimeRemaining, setStatus, setMode, updateMomentum, addSessionLog, incrementSessionNumber, totalDuration, sessionIntent, currentVibe]);

  const start = () => {
    setStatus('running');
    if (mode === 'focus') {
      audioEngine.playStartSession();
    } else {
      audioEngine.playStartBreak();
    }
  };

  const interrupt = () => {
    setStatus('paused');
    audioEngine.playInterrupt();
    // Modal confirmation should be handled in UI, then store update
  };
  
  const confirmInterrupt = () => {
    if (mode === 'focus') {
      updateMomentum(-15);
      addSessionLog({
        id: Date.now().toString(),
        intent: sessionIntent || 'unnamed',
        mode: 'focus',
        status: 'interrupted',
        duration: totalDuration - timeRemaining,
        startedAt: new Date(Date.now() - (totalDuration - timeRemaining) * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        vibe: currentVibe
      });
    }
    useTimerStore.getState().resetSession();
  };

  return { start, interrupt, confirmInterrupt };
}
