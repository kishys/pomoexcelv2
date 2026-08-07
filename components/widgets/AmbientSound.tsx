'use client';
import { useState, useRef, useEffect } from 'react';
import { useTimerStore } from '../../store/timerStore';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine } from '../../lib/audio';
import { VolumeX, BarChart2 } from 'lucide-react';

export default function AmbientSound() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings } = useTimerStore();
  
  // Ref for clicking outside
  const popoverRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    updateSettings({ soundVolume: newVolume });
    audioEngine.setVolume(newVolume, settings.soundEnabled);
  };

  const toggleSound = () => {
    const newState = !settings.soundEnabled;
    updateSettings({ soundEnabled: newState });
    audioEngine.setVolume(settings.soundVolume, newState);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors relative group"
      >
        {settings.soundEnabled ? (
          <BarChart2 size={16} className="animate-pulse" />
        ) : (
          <VolumeX size={16} />
        )}
        
        {/* Shortcut Hint */}
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] border border-border px-1 text-text-muted">
          A
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 w-[180px] bg-surface/80 backdrop-blur-md border border-border rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="px-3 py-2 font-mono text-[10px] text-text-muted border-b border-border/50 uppercase tracking-wider">
              ambient
            </div>
            
            <div className="p-1">
              <button 
                onClick={toggleSound}
                className="w-full flex items-center px-3 py-2 text-left font-sans text-[12px] hover:bg-white/5 rounded transition-colors"
              >
                <div className={`w-3 h-3 rounded-full border flex items-center justify-center mr-2 ${settings.soundEnabled ? 'border-text-secondary' : 'border-accent bg-accent/20'}`}>
                  {!settings.soundEnabled && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                </div>
                <span className={!settings.soundEnabled ? 'text-text-primary' : 'text-text-secondary'}>off</span>
              </button>
              
              <button 
                onClick={() => {
                  if (!settings.soundEnabled) toggleSound();
                  // For a full implementation, ambient sound generators would be triggered here
                }}
                className="w-full flex items-center px-3 py-2 text-left font-sans text-[12px] hover:bg-white/5 rounded transition-colors"
              >
                <div className={`w-3 h-3 rounded-full border flex items-center justify-center mr-2 ${settings.soundEnabled ? 'border-accent bg-accent/20' : 'border-text-secondary'}`}>
                  {settings.soundEnabled && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                </div>
                <span className={settings.soundEnabled ? 'text-text-primary' : 'text-text-secondary'}>sounds enabled</span>
              </button>
            </div>
            
            <div className="px-3 py-3 border-t border-border/50 flex items-center gap-2">
              <span className="font-sans text-[11px] text-text-secondary">vol</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={settings.soundVolume}
                onChange={handleVolumeChange}
                disabled={!settings.soundEnabled}
                className="flex-1 h-1 bg-border rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
