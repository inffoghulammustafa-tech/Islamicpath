import { POPULAR_CITIES, calculatePrayerTimes } from '../data/prayerData';
import { CityLocation, PrayerTimesData } from '../types';
import { adhanPlayer, ADHAN_VOICES } from './adhanPlayer';

export interface AutoAdhanSettings {
  enabled: boolean;
  selectedVoice: string;
  selectedCity: CityLocation;
  volume: number;
  prayersEnabled: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
}

export interface ActiveAdhanAlert {
  prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  prayerName: string;
  prayerUrdu: string;
  timeStr: string;
  arabicPhrase: string;
  startTime: number;
}

type AutoAdhanListener = (alert: ActiveAdhanAlert | null, isPlaying: boolean) => void;
type SettingsListener = (settings: AutoAdhanSettings) => void;

const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return -1;
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return -1;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const isPM = match[3].toUpperCase() === 'PM';
  if (isPM && h < 12) h += 12;
  if (!isPM && h === 12) h = 0;
  return h * 60 + m;
};

class AutoAdhanEngine {
  private settings: AutoAdhanSettings;
  private activeAlert: ActiveAdhanAlert | null = null;
  private isPlaying = false;
  private listeners: Set<AutoAdhanListener> = new Set();
  private settingsListeners: Set<SettingsListener> = new Set();
  private lastTriggeredId = '';
  private timer: number | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.settings = this.loadSettings();

    if (typeof window !== 'undefined') {
      // Connect with adhanPlayer state
      adhanPlayer.subscribe((playing, info) => {
        this.isPlaying = playing;
        if (!playing) {
          this.activeAlert = null;
        }
        this.notifyListeners();
      });

      // Background audio unlocker
      this.initBackgroundAudioUnlock();

      // Start global clock scheduler
      this.startScheduler();
    }
  }

  private loadSettings(): AutoAdhanSettings {
    const defaultSettings: AutoAdhanSettings = {
      enabled: true,
      selectedVoice: 'makkah',
      selectedCity: POPULAR_CITIES[0], // Karachi
      volume: 1.0,
      prayersEnabled: {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
      },
    };

    if (typeof window === 'undefined') return defaultSettings;

    try {
      const saved = localStorage.getItem('islamicpath_auto_adhan_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          prayersEnabled: { ...defaultSettings.prayersEnabled, ...(parsed.prayersEnabled || {}) },
        };
      }
    } catch (e) {
      console.warn('Failed to load adhan settings:', e);
    }
    return defaultSettings;
  }

  public saveSettings(newSettings: Partial<AutoAdhanSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem('islamicpath_auto_adhan_settings', JSON.stringify(this.settings));
      adhanPlayer.setVoice(this.settings.selectedVoice);
    } catch (e) {}
    this.settingsListeners.forEach((cb) => cb(this.settings));
  }

  public getSettings(): AutoAdhanSettings {
    return this.settings;
  }

  public subscribeSettings(cb: SettingsListener): () => void {
    this.settingsListeners.add(cb);
    cb(this.settings);
    return () => this.settingsListeners.delete(cb);
  }

  public subscribe(cb: AutoAdhanListener): () => void {
    this.listeners.add(cb);
    cb(this.activeAlert, this.isPlaying);
    return () => this.listeners.delete(cb);
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb(this.activeAlert, this.isPlaying));
  }

  private initBackgroundAudioUnlock() {
    const unlock = () => {
      try {
        if (!this.audioContext && (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          this.audioContext = new AudioContextClass();
        }
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
      } catch (e) {}

      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
    };

    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('pointerdown', unlock, { passive: true });
  }

  public async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (e) {
      return false;
    }
  }

  private startScheduler() {
    if (this.timer) clearInterval(this.timer);

    this.timer = window.setInterval(() => {
      this.checkPrayerTimes();
    }, 4000); // Check every 4 seconds for immediate exact precision
  }

  public checkPrayerTimes() {
    if (!this.settings.enabled) return;

    const now = new Date();
    const curHours = now.getHours();
    const curMinutes = now.getMinutes();
    const curTotalMinutes = curHours * 60 + curMinutes;
    const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    // Calculate prayer times 100% offline based on astronomical formulas
    const times = calculatePrayerTimes(this.settings.selectedCity, now);

    const prayerList: Array<{
      key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
      name: string;
      urdu: string;
      timeStr: string;
      arabicPhrase: string;
    }> = [
      {
        key: 'fajr',
        name: 'Fajr',
        urdu: 'فجر',
        timeStr: times.fajr,
        arabicPhrase: 'اَلصَّلٰوةُ خَيْرٌ مِّنَ النَّوْمِ',
      },
      {
        key: 'dhuhr',
        name: 'Dhuhr',
        urdu: 'ظہر',
        timeStr: times.dhuhr,
        arabicPhrase: 'حَيَّ عَلَى الصَّلَاةِ • حَيَّ عَلَى الْفَلَاحِ',
      },
      {
        key: 'asr',
        name: 'Asr',
        urdu: 'عصر',
        timeStr: times.asr,
        arabicPhrase: 'حَيَّ عَلَى الصَّلَاةِ • حَيَّ عَلَى الْفَلَاحِ',
      },
      {
        key: 'maghrib',
        name: 'Maghrib',
        urdu: 'مغرب',
        timeStr: times.maghrib,
        arabicPhrase: 'حَيَّ عَلَى الصَّلَاةِ • حَيَّ عَلَى الْفَلَاحِ',
      },
      {
        key: 'isha',
        name: 'Isha',
        urdu: 'عشاء',
        timeStr: times.isha,
        arabicPhrase: 'حَيَّ عَلَى الصَّلَاةِ • حَيَّ عَلَى الْفَلَاحِ',
      },
    ];

    for (const prayer of prayerList) {
      if (!this.settings.prayersEnabled[prayer.key]) continue;

      const prayerMins = parseTimeToMinutes(prayer.timeStr);
      if (prayerMins === curTotalMinutes) {
        const triggerId = `${dateKey}_${prayer.key}`;
        if (this.lastTriggeredId !== triggerId) {
          this.lastTriggeredId = triggerId;
          this.triggerAdhan(prayer);
          break;
        }
      }
    }
  }

  public triggerAdhan(prayer: {
    key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    name: string;
    urdu: string;
    timeStr: string;
    arabicPhrase: string;
  }) {
    this.activeAlert = {
      prayerKey: prayer.key,
      prayerName: prayer.name,
      prayerUrdu: prayer.urdu,
      timeStr: prayer.timeStr,
      arabicPhrase: prayer.arabicPhrase,
      startTime: Date.now(),
    };
    this.isPlaying = true;
    this.notifyListeners();

    // Play Adhan Audio into speaker
    adhanPlayer.setVoice(this.settings.selectedVoice);
    adhanPlayer.play(prayer.name, prayer.urdu, this.settings.selectedVoice);

    // Send native system notification
    this.dispatchNotification(prayer.name, prayer.urdu, prayer.timeStr);
  }

  private dispatchNotification(name: string, urdu: string, timeStr: string) {
    if (typeof window === 'undefined') return;

    const title = `اذان کا وقت: نمازِ ${urdu} (${name})`;
    const options = {
      body: `نماز کا وقت ہو گیا ہے (${timeStr})۔ حی علی الصلاۃ، حی علی الفلاح۔ برائے کرم نماز باجماعت ادا فرمائیں۔`,
      icon: '/pwa-192x192.png',
      badge: '/icon.svg',
      tag: `adhan-${name.toLowerCase()}`,
      renotify: true,
      silent: false,
      vibrate: [300, 100, 300, 100, 600],
    };

    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, options).catch(() => {});
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
      }
    } catch (e) {
      console.warn('Notification error:', e);
    }
  }

  public testAdhan(prayerName = 'Fajr', prayerUrdu = 'فجر') {
    this.activeAlert = {
      prayerKey: 'fajr',
      prayerName,
      prayerUrdu,
      timeStr: 'ٹیسٹ اذان (Test)',
      arabicPhrase: 'اَلصَّلٰوةُ خَيْرٌ مِّنَ النَّوْمِ',
      startTime: Date.now(),
    };
    this.isPlaying = true;
    this.notifyListeners();

    adhanPlayer.setVoice(this.settings.selectedVoice);
    adhanPlayer.play(prayerName, prayerUrdu, this.settings.selectedVoice);
  }

  public stopAdhan() {
    adhanPlayer.stop();
    this.activeAlert = null;
    this.isPlaying = false;
    this.notifyListeners();
  }

  public getActiveAlert(): ActiveAdhanAlert | null {
    return this.activeAlert;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const autoAdhanEngine = new AutoAdhanEngine();
