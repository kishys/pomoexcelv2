'use client';
import { useTimerStore } from '../../store/timerStore';
import { VIBES } from '../../lib/vibes';

export default function VibeSwitcher({ isIdle }: { isIdle: boolean }) {
  const { currentVibe, setVibe } = useTimerStore();

  if (!isIdle) return null;

  return (
    <div className="flex items-center gap-2">
      {Object.entries(VIBES).map(([key, vibe]) => {
        const isActive = key === currentVibe;
        return (
          <button
            key={key}
            onClick={() => setVibe(key)}
            className="group relative w-3 h-3 rounded-full flex items-center justify-center transition-transform hover:scale-125"
            style={{ backgroundColor: vibe.accent }}
            aria-label={`Switch to ${vibe.name} vibe`}
          >
            {isActive && (
              <div className="absolute -inset-1 rounded-full border border-border opacity-50" />
            )}
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 flex flex-col items-center">
              <span className="font-mono text-[10px] text-text-primary px-2 py-1 bg-surface border border-border rounded shadow-lg">
                {vibe.name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
