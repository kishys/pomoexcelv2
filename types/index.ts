export type TimerMode = 'focus' | 'short_break' | 'long_break';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'complete';

export interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  timeRemaining: number;
  totalDuration: number;
  sessionNumber: number;
  totalSessionsToday: number;
  completedSessionsToday: number;
  interruptedSessionsToday: number;
  sessionIntent: string;
  currentVibe: string; // key of VIBES
  settings: TimerSettings;
  sessionLog: SessionEntry[];
  momentumScore: number;
}

export interface SessionEntry {
  id: string;
  intent: string;
  mode: TimerMode;
  status: 'completed' | 'interrupted';
  duration: number; // seconds
  startedAt: string; // ISO string
  endedAt: string; // ISO string
  vibe: string;
}

export interface TimerSettings {
  focusDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartSessions: boolean;
  breathingAnimation: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  idleFade: boolean;
  grain: boolean;
}

export type Vibe = {
  name: string;
  label: string;
  bg: string;
  bgPulse: string;
  surface: string;
  surfaceRgb: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentRgb: string;
  grain: number;
  breathIntensity: number | 'subtle' | 'medium' | 'strong';
  clockOpacity: number;
  timerOpacity?: number;
};
