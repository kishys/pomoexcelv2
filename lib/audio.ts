'use client';

class AudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  private init() {
    if (typeof window === 'undefined') return;
    if (this.context) return;
    
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.context = new AudioContextClass();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
  }

  public setVolume(volume: number, enabled: boolean) {
    if (!this.context || !this.masterGain) this.init();
    if (this.masterGain) {
      this.masterGain.gain.value = enabled ? volume : 0;
    }
  }

  public resume() {
    if (this.context?.state === 'suspended') {
      this.context.resume();
    }
  }

  public playStartSession() {
    this.init();
    if (!this.context || !this.masterGain) return;
    
    this.resume();
    
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.context.currentTime);
    
    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(this.context.currentTime);
    osc.stop(this.context.currentTime + 0.1);
  }

  public playCompleteSession() {
    this.init();
    if (!this.context || !this.masterGain) return;
    
    this.resume();
    
    const time = this.context.currentTime;
    
    // Primary
    const osc1 = this.context.createOscillator();
    const gain1 = this.context.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(440, time);
    
    gain1.gain.setValueAtTime(0, time);
    gain1.gain.linearRampToValueAtTime(0.15, time + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.001, time + 1.2);
    
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    
    // Harmonic
    const osc2 = this.context.createOscillator();
    const gain2 = this.context.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, time);
    
    gain2.gain.setValueAtTime(0, time);
    gain2.gain.linearRampToValueAtTime(0.05, time + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
    
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    
    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 1.3);
    osc2.stop(time + 0.9);
  }

  public playStartBreak() {
    this.init();
    if (!this.context || !this.masterGain) return;
    
    this.resume();
    
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.context.currentTime);
    
    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.07, this.context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(this.context.currentTime);
    osc.stop(this.context.currentTime + 0.1);
  }

  public playInterrupt() {
    this.init();
    if (!this.context || !this.masterGain) return;
    
    this.resume();
    
    const time = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, time);
    osc.frequency.exponentialRampToValueAtTime(280, time + 0.2);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(time);
    osc.stop(time + 0.25);
  }

  public playTick() {
    this.init();
    if (!this.context || !this.masterGain) return;
    
    this.resume();
    
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, this.context.currentTime);
    
    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, this.context.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.03);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(this.context.currentTime);
    osc.stop(this.context.currentTime + 0.04);
  }
}

export const audioEngine = new AudioEngine();
