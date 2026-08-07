import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimerState, TimerMode, SessionEntry, TimerSettings } from '../types';
import { defaultSettings } from '../constants/defaults';

interface TimerStore extends TimerState {
  setMode: (mode: TimerMode) => void;
  setStatus: (status: TimerState['status']) => void;
  setTimeRemaining: (time: number) => void;
  setVibe: (vibe: string) => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  setSessionIntent: (intent: string) => void;
  addSessionLog: (entry: SessionEntry) => void;
  updateMomentum: (scoreDelta: number) => void;
  resetSession: () => void;
  incrementSessionNumber: () => void;
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      mode: 'focus',
      status: 'idle',
      timeRemaining: defaultSettings.focusDuration * 60,
      totalDuration: defaultSettings.focusDuration * 60,
      sessionNumber: 1,
      totalSessionsToday: 0,
      completedSessionsToday: 0,
      interruptedSessionsToday: 0,
      sessionIntent: '',
      currentVibe: 'void',
      settings: defaultSettings,
      sessionLog: [],
      momentumScore: 50,
      
      setMode: (mode) => {
        const { settings } = get();
        let duration = settings.focusDuration * 60;
        if (mode === 'short_break') duration = settings.shortBreakDuration * 60;
        if (mode === 'long_break') duration = settings.longBreakDuration * 60;
        
        set({ mode, timeRemaining: duration, totalDuration: duration });
      },
      
      setStatus: (status) => set({ status }),
      
      setTimeRemaining: (timeRemaining) => set({ timeRemaining }),
      
      setVibe: (currentVibe) => {
        // Also update CSS custom variables in DOM
        if (typeof document !== 'undefined') {
          const { VIBES } = require('../lib/vibes');
          const vibeData = VIBES[currentVibe];
          if (vibeData) {
            document.documentElement.style.setProperty('--bg', vibeData.bg);
            document.documentElement.style.setProperty('--bg-pulse', vibeData.bgPulse);
            document.documentElement.style.setProperty('--surface', vibeData.surface);
            document.documentElement.style.setProperty('--surface-rgb', vibeData.surfaceRgb);
            document.documentElement.style.setProperty('--border', vibeData.border);
            document.documentElement.style.setProperty('--text-primary', vibeData.textPrimary);
            document.documentElement.style.setProperty('--text-secondary', vibeData.textSecondary);
            document.documentElement.style.setProperty('--text-muted', vibeData.textMuted);
            document.documentElement.style.setProperty('--accent', vibeData.accent);
            document.documentElement.style.setProperty('--accent-rgb', vibeData.accentRgb);
          }
        }
        set({ currentVibe });
      },
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      setSessionIntent: (sessionIntent) => set({ sessionIntent }),
      
      addSessionLog: (entry) => set((state) => ({
        sessionLog: [entry, ...state.sessionLog]
      })),
      
      updateMomentum: (scoreDelta) => set((state) => {
        const newScore = Math.min(100, Math.max(0, state.momentumScore + scoreDelta));
        return { momentumScore: newScore };
      }),
      
      resetSession: () => {
        const { mode, settings } = get();
        let duration = settings.focusDuration * 60;
        if (mode === 'short_break') duration = settings.shortBreakDuration * 60;
        if (mode === 'long_break') duration = settings.longBreakDuration * 60;
        set({ status: 'idle', timeRemaining: duration, totalDuration: duration });
      },
      
      incrementSessionNumber: () => set((state) => {
        let nextSession = state.sessionNumber + 1;
        if (nextSession > state.settings.sessionsBeforeLongBreak) {
          nextSession = 1;
        }
        return { sessionNumber: nextSession };
      }),
    }),
    {
      name: 'pomo-timer-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reset to paused on reload if running
          if (state.status === 'running') {
            state.status = 'paused';
          }
          // Re-apply CSS variables on load
          if (typeof document !== 'undefined') {
            const { VIBES } = require('../lib/vibes');
            const vibeData = VIBES[state.currentVibe];
            if (vibeData) {
              document.documentElement.style.setProperty('--bg', vibeData.bg);
              document.documentElement.style.setProperty('--bg-pulse', vibeData.bgPulse);
              document.documentElement.style.setProperty('--surface', vibeData.surface);
              document.documentElement.style.setProperty('--surface-rgb', vibeData.surfaceRgb);
              document.documentElement.style.setProperty('--border', vibeData.border);
              document.documentElement.style.setProperty('--text-primary', vibeData.textPrimary);
              document.documentElement.style.setProperty('--text-secondary', vibeData.textSecondary);
              document.documentElement.style.setProperty('--text-muted', vibeData.textMuted);
              document.documentElement.style.setProperty('--accent', vibeData.accent);
              document.documentElement.style.setProperty('--accent-rgb', vibeData.accentRgb);
            }
          }
        }
      },
    }
  )
);
