'use client';
import { useState, useRef, useEffect } from 'react';
import { useTimerStore } from '../../store/timerStore';

export default function SessionIntent() {
  const { sessionIntent, setSessionIntent, status } = useTimerStore();
  const [isEditing, setIsEditing] = useState(false);
  const [localIntent, setLocalIntent] = useState(sessionIntent);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isRunning = status === 'running';

  useEffect(() => {
    setLocalIntent(sessionIntent);
  }, [sessionIntent]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Press N to focus when idle
      if (e.key === 'n' || e.key === 'N') {
        if (!isEditing && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          setIsEditing(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    setSessionIntent(localIntent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalIntent(sessionIntent);
      setIsEditing(false);
    }
  };

  if (!isEditing && isRunning) {
    return (
      <div 
        className="font-sans text-[14px] text-text-secondary cursor-text group"
        onClick={() => setIsEditing(true)}
      >
        <span className="relative inline-block">
          {sessionIntent || 'unnamed session'}
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-text-secondary opacity-0 group-hover:opacity-30 transition-opacity" />
        </span>
      </div>
    );
  }

  if (!isEditing && !sessionIntent) {
    return (
      <div 
        className="font-sans text-[14px] italic text-text-muted cursor-text hover:text-text-secondary transition-colors"
        onClick={() => setIsEditing(true)}
      >
        what are you working on?
      </div>
    );
  }

  if (!isEditing && sessionIntent) {
    return (
      <div 
        className="font-sans text-[14px] text-text-secondary cursor-text group"
        onClick={() => setIsEditing(true)}
      >
        <span className="relative inline-block">
          {sessionIntent}
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent opacity-0 group-hover:opacity-40 transition-opacity" />
        </span>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <input
        ref={inputRef}
        type="text"
        value={localIntent}
        onChange={(e) => setLocalIntent(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        maxLength={48}
        className="bg-transparent border-none outline-none font-sans text-[14px] text-text-primary text-center w-full min-w-[200px]"
        placeholder="what are you working on?"
      />
      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent opacity-40" />
    </div>
  );
}
