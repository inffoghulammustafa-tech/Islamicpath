// Dedicated Adhan Audio Player with background pre-unlocking for automatic speaker playback

export interface AdhanVoice {
  id: string;
  name: string;
  reciter: string;
  url: string;
}

export const ADHAN_VOICES: AdhanVoice[] = [
  { 
    id: 'makkah', 
    name: 'Makkah Mukarramah', 
    reciter: 'Sheikh Ali Mulla', 
    url: '/audio/adhan_makkah.mp3' 
  },
  { 
    id: 'madinah', 
    name: 'Madinah Munawwarah', 
    reciter: 'Masjid an-Nabawi', 
    url: '/audio/adhan_madina.mp3' 
  },
  { 
    id: 'alafasy', 
    name: 'Mishary Alafasy', 
    reciter: 'Qari Mishary Rashid', 
    url: '/audio/adhan_alafasy.mp3' 
  },
];

export interface ActiveAdhanData {
  name: string;
  urdu: string;
  voiceId: string;
}

type AdhanListener = (isPlaying: boolean, data: ActiveAdhanData | null) => void;

class AdhanService {
  private audio: HTMLAudioElement | null = null;
  private isUnlocked = false;
  private isPlaying = false;
  private activeData: ActiveAdhanData | null = null;
  private listeners: Set<AdhanListener> = new Set();
  private selectedVoiceId = 'makkah';

  constructor() {
    // Only in browser environment
    if (typeof window !== 'undefined') {
      this.initUnlocker();
    }
  }

  // Pre-unlock audio on first user interaction anywhere on the screen
  private initUnlocker() {
    const unlock = () => {
      if (this.isUnlocked) return;
      
      try {
        if (!this.audio) {
          this.audio = new Audio();
          this.audio.preload = 'auto';
        }
        // Silent 10ms play & pause to unlock audio output capability on device speaker
        this.audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
        const p = this.audio.play();
        if (p !== undefined) {
          p.then(() => {
            if (this.audio && !this.isPlaying) {
              this.audio.pause();
              this.audio.currentTime = 0;
            }
            this.isUnlocked = true;
          }).catch(() => {
            // Will retry on next interaction
          });
        }
      } catch (e) {
        // Fallback
      }

      // Cleanup unlock listeners once unlocked
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('pointerdown', unlock);
    };

    window.addEventListener('click', unlock, { once: false, passive: true });
    window.addEventListener('touchstart', unlock, { once: false, passive: true });
    window.addEventListener('keydown', unlock, { once: false, passive: true });
    window.addEventListener('pointerdown', unlock, { once: false, passive: true });
  }

  public setVoice(voiceId: string) {
    this.selectedVoiceId = voiceId;
  }

  public getVoice(): string {
    return this.selectedVoiceId;
  }

  public subscribe(listener: AdhanListener): () => void {
    this.listeners.add(listener);
    // Immediately notify current state
    listener(this.isPlaying, this.activeData);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.isPlaying, this.activeData));
  }

  // Play Adhan voice automatically into speaker
  public play(prayerName: string, prayerUrdu: string, voiceId?: string): Promise<boolean> {
    const voiceToUse = voiceId || this.selectedVoiceId;
    const voice = ADHAN_VOICES.find(v => v.id === voiceToUse) || ADHAN_VOICES[0];

    return new Promise((resolve) => {
      try {
        if (!this.audio) {
          this.audio = new Audio();
        }

        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.src = voice.url;
        this.audio.volume = 1.0;

        this.audio.onended = () => {
          this.isPlaying = false;
          this.activeData = null;
          this.notify();
        };

        this.audio.onerror = (err) => {
          console.warn('Adhan audio load error:', err);
          this.isPlaying = false;
          this.activeData = null;
          this.notify();
          resolve(false);
        };

        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isPlaying = true;
              this.activeData = { name: prayerName, urdu: prayerUrdu, voiceId: voice.id };
              this.isUnlocked = true;
              this.notify();
              resolve(true);
            })
            .catch((err) => {
              console.warn('Auto Adhan play attempt:', err);
              // Retry with audio element creation
              try {
                const freshAudio = new Audio(voice.url);
                freshAudio.volume = 1.0;
                freshAudio.onended = () => {
                  this.isPlaying = false;
                  this.activeData = null;
                  this.notify();
                };
                freshAudio.play().then(() => {
                  this.audio = freshAudio;
                  this.isPlaying = true;
                  this.activeData = { name: prayerName, urdu: prayerUrdu, voiceId: voice.id };
                  this.notify();
                  resolve(true);
                }).catch(() => {
                  resolve(false);
                });
              } catch (e2) {
                resolve(false);
              }
            });
        }
      } catch (e) {
        console.error('Play adhan exception:', e);
        resolve(false);
      }
    });
  }

  public stop() {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch (e) {}
    }
    this.isPlaying = false;
    this.activeData = null;
    this.notify();
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getActiveData(): ActiveAdhanData | null {
    return this.activeData;
  }
}

export const adhanPlayer = new AdhanService();
