import { TimerSettings } from '../types';

export const defaultSettings: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartSessions: false,
  breathingAnimation: true,
  soundEnabled: true,
  soundVolume: 0.5,
  idleFade: true,
  grain: true,
};
