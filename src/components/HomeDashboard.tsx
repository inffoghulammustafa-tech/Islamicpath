import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Compass, 
  Clock, 
  Sparkles, 
  Heart, 
  Calculator, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Bell,
  BellOff,
  Radio,
  BookmarkCheck, 
  ChevronRight, 
  MapPin,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Download,
  Smartphone,
  Search
} from 'lucide-react';
import { ActiveTab, PrayerTimesData, CityLocation } from '../types';
import { POPULAR_CITIES, calculatePrayerTimes } from '../data/prayerData';
import { BorderOrbitingGlow } from './BorderOrbitingGlow';
import { NeonDualBorderBeam } from './NeonDualBorderBeam';
import { QuranPageFlipper } from './QuranPageFlipper';
import { ScholarsTestimonials } from './ScholarsTestimonials';
import { ScholarsMarquee } from './ScholarsMarquee';
import { adhanPlayer, ADHAN_VOICES } from '../utils/adhanPlayer';

interface HomeDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDonate?: () => void;
  onOpenDownload?: () => void;
}

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

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ 
  setActiveTab, 
  onOpenDonate, 
  onOpenDownload 
}) => {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(POPULAR_CITIES[0]);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData>(calculatePrayerTimes(POPULAR_CITIES[0]));
  const [isPlayingAyatAudio, setIsPlayingAyatAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Adhan state synced with singleton player
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [autoAdhanEnabled, setAutoAdhanEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('islam360_auto_adhan');
    return saved !== null ? saved === 'true' : true;
  });
  const [selectedVoice, setSelectedVoice] = useState<string>('makkah');
  const [activeAdhanInfo, setActiveAdhanInfo] = useState<{
    name: string;
    urdu: string;
  } | null>(null);
  const [lastTriggeredPrayer, setLastTriggeredPrayer] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showDuaAfterAdhan, setShowDuaAfterAdhan] = useState(false);
  const [testNotice, setTestNotice] = useState<string | null>(null);

  // Subscribe to adhanPlayer state
  useEffect(() => {
    const unsubscribe = adhanPlayer.subscribe((playing, data) => {
      setIsPlayingAdhan(playing);
      setActiveAdhanInfo(data);
    });
    return unsubscribe;
  }, []);

  const [copiedHadith, setCopiedHadith] = useState(false);
  const [copiedAyat, setCopiedAyat] = useState(false);
  const [isHadithHovered, setIsHadithHovered] = useState(false);
  const [isAyatHovered, setIsAyatHovered] = useState(false);
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Exact Ayat: Surah al baqara [2-183]
  const dailyAyat = {
    surahTitle: "Surah al baqara [2-183]",
    surahUrdu: "سورۃ البقرۃ [۱۸۳]",
    arabic: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ كَمَا كُتِبَ عَلَى ٱلَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
    translationUrdu: "اے ایمان والو! تم پر روزے فرض کیے گئے ہیں جیسا کہ تم سے پہلے لوگوں پر فرض کیے گئے تھے تاکہ تم پرہیزگار بن جاؤ۔",
    translationEn: "O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous.",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002183.mp3",
  };

  // Exact Hadith: Mishkat ul Masabih # 1957
  const dailyHadith = {
    source: "Mishkat ul Masabih # 1957",
    arabic: "إِنَّ فِي الْجَنَّةِ بَابًا يُقَالُ لَهُ الرَّيَّانُ يَدْخُلُ مِنْهُ الصَّائِمُونَ يَوْمَ الْقِيَامَةِ",
    translationUrdu: 'رسول اللہ ﷺ نے فرمایا: "جنت کے آٹھ دروازے ہیں، ان میں سے ایک دروازے کا نام ریان ہے جس سے قیامت کے دن صرف روزہ دار ہی داخل ہوں گے، ان کے سوا کوئی اور داخل نہیں ہوگا۔"',
    translationEn: 'The Messenger of Allah (ﷺ) said: "In Paradise there is a gate called Ar-Rayyan, through which only those who fast will enter on the Day of Resurrection, and no one else will enter through it."',
  };

  useEffect(() => {
    setPrayerTimes(calculatePrayerTimes(selectedCity));
  }, [selectedCity]);

  // Automatic Clock and Adhan Scheduler
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const curHours = now.getHours();
      const curMinutes = now.getMinutes();
      const curTotalMinutes = curHours * 60 + curMinutes;
      const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

      // 5 daily prayers that have an Adhan (Sunrise does not have an Adhan)
      const dailyAdhanPrayers = [
        { key: 'fajr', name: 'Fajr', urdu: 'فجر', time: prayerTimes.fajr },
        { key: 'dhuhr', name: 'Dhuhr', urdu: 'ظہر', time: prayerTimes.dhuhr },
        { key: 'asr', name: 'Asr', urdu: 'عصر', time: prayerTimes.asr },
        { key: 'maghrib', name: 'Maghrib', urdu: 'مغرب', time: prayerTimes.maghrib },
        { key: 'isha', name: 'Isha', urdu: 'عشاء', time: prayerTimes.isha },
      ];

      if (autoAdhanEnabled) {
        for (const p of dailyAdhanPrayers) {
          const prayerMins = parseTimeToMinutes(p.time);
          if (prayerMins === curTotalMinutes) {
            const triggerId = `${dateKey}_${p.key}`;
            if (lastTriggeredPrayer !== triggerId) {
              setLastTriggeredPrayer(triggerId);
              // Trigger automatic Adhan voice playback!
              playAdhan(p.name, p.urdu);
              break;
            }
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes, autoAdhanEnabled, lastTriggeredPrayer, selectedVoice]);

  const toggleAyatAudio = () => {
    if (isPlayingAyatAudio && audioElement) {
      audioElement.pause();
      setIsPlayingAyatAudio(false);
    } else {
      if (audioElement) {
        audioElement.play();
        setIsPlayingAyatAudio(true);
      } else {
        const audio = new Audio(dailyAyat.audioUrl);
        audio.onended = () => setIsPlayingAyatAudio(false);
        audio.play().catch(e => console.log('Audio error', e));
        setAudioElement(audio);
        setIsPlayingAyatAudio(true);
      }
    }
  };

  // Play Adhan Voice directly into speaker via adhanPlayer
  const playAdhan = (prayerName = 'Dhuhr', prayerUrdu = 'ظہر') => {
    adhanPlayer.setVoice(selectedVoice);
    adhanPlayer.play(prayerName, prayerUrdu, selectedVoice);

    // Attempt browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`اذان کا وقت: نمازِ ${prayerUrdu} (${prayerName})`, {
          body: `نماز کا وقت ہو گیا ہے۔ حَيَّ عَلَى الصَّلَاةِ - ${selectedCity.name}`,
          icon: '/favicon.ico'
        });
      } catch (e) {}
    } else if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  };

  const stopAdhan = () => {
    adhanPlayer.stop();
  };

  const toggleAutoAdhan = () => {
    const nextVal = !autoAdhanEnabled;
    setAutoAdhanEnabled(nextVal);
    localStorage.setItem('islam360_auto_adhan', String(nextVal));
    if (nextVal && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    setTestNotice(nextVal ? 'خودکار اذان چالو کر دی گئی ہے (Auto Adhan Enabled)' : 'خودکار اذان بند کر دی گئی ہے (Auto Adhan Disabled)');
    setTimeout(() => setTestNotice(null), 3000);
  };

  const triggerTestAdhan = () => {
    playAdhan('Dhuhr', 'ظہر');
    setTestNotice('ٹیسٹ اذان چل رہی ہے (Playing Test Adhan)');
    setTimeout(() => setTestNotice(null), 3500);
  };

  const copyText = (text: string, type: 'hadith' | 'ayat') => {
    navigator.clipboard.writeText(text);
    if (type === 'hadith') {
      setCopiedHadith(true);
      setTimeout(() => setCopiedHadith(false), 2000);
    } else {
      setCopiedAyat(true);
      setTimeout(() => setCopiedAyat(false), 2000);
    }
  };

  // Compute Active & Next Prayer
  const curMinutesFromMidnight = currentTime.getHours() * 60 + currentTime.getMinutes();
  const prayerScheduleItems = [
    { id: 'fajr', name: "Fajr", urdu: "فجر", time: prayerTimes.fajr, mins: parseTimeToMinutes(prayerTimes.fajr), hasAdhan: true },
    { id: 'sunrise', name: "Sunrise", urdu: "طلوع آفتاب", time: prayerTimes.sunrise, mins: parseTimeToMinutes(prayerTimes.sunrise), hasAdhan: false },
    { id: 'dhuhr', name: "Dhuhr", urdu: "ظہر", time: prayerTimes.dhuhr, mins: parseTimeToMinutes(prayerTimes.dhuhr), hasAdhan: true },
    { id: 'asr', name: "Asr", urdu: "عصر", time: prayerTimes.asr, mins: parseTimeToMinutes(prayerTimes.asr), hasAdhan: true },
    { id: 'maghrib', name: "Maghrib", urdu: "مغرب", time: prayerTimes.maghrib, mins: parseTimeToMinutes(prayerTimes.maghrib), hasAdhan: true },
    { id: 'isha', name: "Isha", urdu: "عشاء", time: prayerTimes.isha, mins: parseTimeToMinutes(prayerTimes.isha), hasAdhan: true },
  ];

  let currentActivePrayer = prayerScheduleItems[prayerScheduleItems.length - 1];
  let upcomingPrayer = prayerScheduleItems[0];

  for (let i = 0; i < prayerScheduleItems.length; i++) {
    if (curMinutesFromMidnight >= prayerScheduleItems[i].mins) {
      currentActivePrayer = prayerScheduleItems[i];
      upcomingPrayer = prayerScheduleItems[(i + 1) % prayerScheduleItems.length];
    } else {
      upcomingPrayer = prayerScheduleItems[i];
      break;
    }
  }

  let remainingMinutes = upcomingPrayer.mins - curMinutesFromMidnight;
  if (remainingMinutes < 0) remainingMinutes += 24 * 60;
  const remHours = Math.floor(remainingMinutes / 60);
  const remMins = remainingMinutes % 60;

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section (World's 1st & Only Islamic Search Engine) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#edf7f0] via-[#f3faf5] to-white px-6 sm:px-12 py-12 sm:py-16 border border-emerald-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
        {/* Soft background mint circle blur */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#d8f0e0]/40 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xl sm:text-2xl font-light text-slate-500 tracking-tight">
                World's 1st &amp; Only
              </p>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.1] mt-1">
                Islamic<br />
                Search Engine
              </h1>
            </div>

            <p className="text-slate-600 text-sm sm:text-base max-w-lg leading-relaxed">
              A comprehensive Islamic app that empowers and connects Muslims globally through authentic Quranic verses, Sahih Hadith, and scholarly guidance.
            </p>

            {/* Live Islamic Search Bar */}
            <div className="pt-1 max-w-xl">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (heroSearchQuery.trim()) {
                    setActiveTab('quran');
                  }
                }}
                className="relative flex items-center"
              >
                <Search className="w-5 h-5 text-[#2e7d32] absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  placeholder="Search Quran Ayahs, Hadith, Duas, or Islamic Topics..."
                  className="w-full pl-11 pr-28 py-3.5 rounded-full bg-white/95 backdrop-blur-sm border border-emerald-200/90 focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-500/20 text-sm shadow-sm outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-5 py-2 rounded-full bg-[#2e7d32] hover:bg-[#256629] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-400 text-[11px]">Popular:</span>
                {[
                  { label: 'Ayat-ul-Kursi', tab: 'quran' as ActiveTab },
                  { label: 'Surah Yaseen', tab: 'quran' as ActiveTab },
                  { label: 'Sahih Bukhari', tab: 'hadith' as ActiveTab },
                  { label: 'Masnoon Duas', tab: 'duas' as ActiveTab },
                  { label: 'Nisab Calculator', tab: 'zakat' as ActiveTab }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setHeroSearchQuery(item.label);
                      setActiveTab(item.tab);
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-white/80 hover:bg-emerald-100 hover:text-[#1b5e20] text-slate-600 text-[11px] border border-slate-200/80 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-download-app-btn"
                onClick={onOpenDownload}
                className="px-7 py-3.5 rounded-full bg-[#3b873e] hover:bg-[#2f7332] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
              >
                Download App
              </button>

              <button
                id="hero-donate-now-btn"
                onClick={onOpenDonate}
                className="px-7 py-3.5 rounded-full border border-[#3b873e] text-[#2f7332] bg-[#edf7f0] hover:bg-white font-bold text-sm sm:text-base shadow-sm transition-all duration-200 cursor-pointer"
              >
                Donate Now
              </button>

              <button
                onClick={() => setActiveTab('quran')}
                className="px-6 py-3.5 rounded-full text-slate-700 hover:text-[#2f7332] hover:bg-emerald-50 text-sm font-semibold transition-all duration-200 cursor-pointer"
              >
                Explore Web Version →
              </button>
            </div>

            {/* Available on (Store Badges) */}
            <div className="pt-3 flex items-center space-x-3 text-slate-500">
              <span className="text-xs font-semibold text-slate-500">Available on</span>
              <div className="flex items-center space-x-3">
                {/* Apple Store SVG */}
                <span title="iOS App Store" className="text-slate-700 hover:text-black transition-colors cursor-pointer" onClick={onOpenDownload}>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.96c.61-.75 1.04-1.8 1.01-2.96-1.01.05-2.23.68-2.93 1.5-.56.63-.99 1.68-.89 2.76 1.13.09 2.24-.55 2.81-1.3z" />
                  </svg>
                </span>

                {/* Google Play SVG */}
                <span title="Google Play Store" className="text-slate-700 hover:text-black transition-colors cursor-pointer" onClick={onOpenDownload}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186c-.378-.42-.61-.994-.61-1.636V3.45c0-.642.232-1.216.61-1.636zm11.233 11.235l2.428 2.429-11.75 6.784 9.322-9.213zm0-2.098L5.52 1.737l11.75 6.785-2.428 2.428zm1.488 1.05l3.87-2.235c.67-.387.67-1.02 0-1.406l-3.87-2.235-2.095 2.095 2.095 2.095z" />
                  </svg>
                </span>

                {/* Huawei AppGallery SVG */}
                <span title="Huawei AppGallery" className="text-slate-700 hover:text-black transition-colors cursor-pointer" onClick={onOpenDownload}>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.96-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Quran on Wooden Rihal with 3-Second Auto Page Flip */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <QuranPageFlipper />
          </div>
        </div>
      </section>

      {/* 2. Daily Inspiration Section (Exact Match to Uploaded Screenshot) */}
      <section className="space-y-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] text-center tracking-tight">
          Daily Inspiration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Card 1: Hadith of the Day (Exact styling with top circular emblem & animated border glow) */}
          <div 
            id="card-hadith-of-the-day"
            onMouseEnter={() => setIsHadithHovered(true)}
            onMouseLeave={() => setIsHadithHovered(false)}
            className={`group relative rounded-3xl bg-white border p-6 sm:p-8 pt-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-300 ${
              isHadithHovered 
                ? 'border-[#ea580c] shadow-[0_10px_35px_rgba(234,88,12,0.12)]' 
                : 'border-[#2e7d32]/50 hover:border-[#2e7d32]'
            }`}
          >
            {/* Orbiting Border Light Beam / Half-Circle Glow Effect on Hover */}
            <BorderOrbitingGlow isHovered={isHadithHovered} />

            {/* Top Protruding Circular Emblem */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#1b4d24] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center z-20">
              <img
                src="/images/hadith_book_emblem_1789811139492.jpg"
                alt="Hadith of the Day Icon"
                loading="eager"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('logo.jpg')) {
                    target.src = '/images/logo.jpg';
                  }
                }}
              />
            </div>

            {/* Inner Content */}
            <div className="space-y-4 relative z-10">
              {/* Title & Subtitle */}
              <div className="text-center pt-2 pb-2">
                <h3 className="text-base sm:text-lg font-bold text-[#111827]">
                  Hadith of the Day
                </h3>
              </div>

              {/* Source Label */}
              <div className="text-xs text-slate-500 font-medium">
                <div className="font-semibold text-slate-600">Hadith</div>
                <div className="text-slate-500">{dailyHadith.source}</div>
              </div>

              {/* Urdu Translation from Image */}
              <div className="text-right py-2">
                <p className="font-urdu text-base sm:text-lg text-[#1b5e20] leading-loose">
                  {dailyHadith.translationUrdu}
                </p>
              </div>

              {/* Arabic Original */}
              <div className="text-right text-sm text-slate-700 font-arabic border-t border-slate-100 pt-2">
                {dailyHadith.arabic}
              </div>

              {/* English Translation */}
              <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-2">
                {dailyHadith.translationEn}
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
              <button
                onClick={() => copyText(`${dailyHadith.source}\n${dailyHadith.translationUrdu}\n${dailyHadith.translationEn}`, 'hadith')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#2e7d32] hover:bg-emerald-100 font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                {copiedHadith ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHadith ? 'Copied' : 'Copy Hadith'}</span>
              </button>

              <button
                onClick={() => setActiveTab('hadith')}
                className="text-[#2e7d32] hover:underline font-bold flex items-center cursor-pointer"
              >
                Open Hadith Library <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Ayat of the Day (Exact styling with top circular emblem & animated border glow) */}
          <div 
            id="card-ayat-of-the-day"
            onMouseEnter={() => setIsAyatHovered(true)}
            onMouseLeave={() => setIsAyatHovered(false)}
            className={`group relative rounded-3xl bg-white border p-6 sm:p-8 pt-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-300 ${
              isAyatHovered 
                ? 'border-[#ea580c] shadow-[0_10px_35px_rgba(234,88,12,0.12)]' 
                : 'border-[#2e7d32]/50 hover:border-[#2e7d32]'
            }`}
          >
            {/* Orbiting Border Light Beam / Half-Circle Glow Effect on Hover */}
            <BorderOrbitingGlow isHovered={isAyatHovered} />

            {/* Top Protruding Circular Emblem */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#1b4d24] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center z-20">
              <img
                src="/images/ayat_quran_emblem_1789811155397.jpg"
                alt="Ayat of the Day Icon"
                loading="eager"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('logo.jpg')) {
                    target.src = '/images/logo.jpg';
                  }
                }}
              />
            </div>

            {/* Inner Content */}
            <div className="space-y-4 relative z-10">
              {/* Title & Subtitle */}
              <div className="text-center pt-2 pb-2">
                <h3 className="text-base sm:text-lg font-bold text-[#111827]">
                  Ayat of the Day
                </h3>
              </div>

              {/* Source Label */}
              <div className="text-xs text-slate-500 font-medium">
                <div className="font-semibold text-slate-600">Verse</div>
                <div className="text-slate-500">{dailyAyat.surahTitle}</div>
              </div>

              {/* Arabic Script from Image */}
              <div className="text-right py-2">
                <p className="font-arabic text-xl sm:text-2xl text-[#1b5e20] leading-loose">
                  {dailyAyat.arabic}
                </p>
              </div>

              {/* Urdu Translation */}
              <div className="text-right text-sm text-slate-700 font-urdu border-t border-slate-100 pt-2">
                {dailyAyat.translationUrdu}
              </div>

              {/* English Translation */}
              <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-2">
                "{dailyAyat.translationEn}"
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
              <button
                onClick={toggleAyatAudio}
                className="px-3.5 py-1.5 rounded-lg bg-[#2e7d32] hover:bg-[#256629] text-white font-semibold flex items-center space-x-1.5 transition-colors shadow-sm cursor-pointer"
              >
                {isPlayingAyatAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Play Tilawat (Mishary)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveTab('quran')}
                className="text-[#2e7d32] hover:underline font-bold flex items-center cursor-pointer"
              >
                Read Surah Al-Baqarah <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IslamicPath Core Features Showcase (Light Theme Grid) */}
      <section className="space-y-6 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#2e7d32] tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Comprehensive Digital Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            Explore IslamicPath Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Everything you need for authentic Islamic learning, daily worship, and spiritual growth in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'quran' as ActiveTab,
              title: "The Holy Quran",
              titleUrdu: "القرآن الکریم",
              desc: "114 Surahs with Urdu & English translations and Mishary Alafasy audio recitation.",
              icon: BookOpen,
              accentColor: "text-emerald-700 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-100/80 group-hover:border-emerald-300",
              iconAnimation: {
                animate: { scale: [1, 1.07, 1], rotate: [0, -3, 3, 0] },
                transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' as const },
                hoverRotate: [0, -6, 6, 0],
              },
            },
            {
              id: 'hadith' as ActiveTab,
              title: "Hadith Library",
              titleUrdu: "کتبِ احادیث",
              desc: "Authentic compilations: Bukhari, Muslim, Tirmidhi, Abu Dawud, and more.",
              icon: BookmarkCheck,
              accentColor: "text-amber-700 bg-amber-50 border-amber-200 group-hover:bg-amber-100/80 group-hover:border-amber-300",
              iconAnimation: {
                animate: { y: [0, -2.5, 0] },
                transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' as const },
                hoverRotate: [0, -8, 0],
              },
            },
            {
              id: 'prayer' as ActiveTab,
              title: "Prayer Times",
              titleUrdu: "نماز کے اوقات",
              desc: "Solar prayer calculations, live Adhan audio, Namaz guide & Qaza tracker.",
              icon: Clock,
              accentColor: "text-blue-700 bg-blue-50 border-blue-200 group-hover:bg-blue-100/80 group-hover:border-blue-300",
              iconAnimation: {
                animate: { rotate: [0, 12, -12, 0] },
                transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' as const },
                hoverRotate: 360,
              },
            },
            {
              id: 'qibla' as ActiveTab,
              title: "Qibla Direction",
              titleUrdu: "قبلہ نما کمپاس",
              desc: "3D compass pointing accurately towards the Holy Kaaba in Makkah.",
              icon: Compass,
              accentColor: "text-teal-700 bg-teal-50 border-teal-200 group-hover:bg-teal-100/80 group-hover:border-teal-300",
              iconAnimation: {
                animate: { rotate: [-18, 18, -18] },
                transition: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' as const },
                hoverRotate: [0, -45, 45, 0],
              },
            },
            {
              id: 'tasbih' as ActiveTab,
              title: "Digital Tasbih",
              titleUrdu: "ڈیجیٹل تسبیح",
              desc: "Interactive Dhikr counter with tap feedback, preset targets, and audio.",
              icon: Sparkles,
              accentColor: "text-green-700 bg-green-50 border-green-200 group-hover:bg-green-100/80 group-hover:border-green-300",
              iconAnimation: {
                animate: { scale: [1, 1.15, 1], rotate: [0, 15, -15, 0] },
                transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' as const },
                hoverRotate: [0, 25, -25, 0],
              },
            },
            {
              id: 'duas' as ActiveTab,
              title: "Masnoon Duas",
              titleUrdu: "مسنون ادعیہ",
              desc: "Authentic supplications for morning, evening, protection, and daily life.",
              icon: Heart,
              accentColor: "text-rose-700 bg-rose-50 border-rose-200 group-hover:bg-rose-100/80 group-hover:border-rose-300",
              iconAnimation: {
                animate: { scale: [1, 1.18, 1, 1.1, 1] },
                transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' as const },
                hoverRotate: [0, -10, 10, 0],
              },
            },
            {
              id: 'names' as ActiveTab,
              title: "99 Names of Allah",
              titleUrdu: "اسماء الحسنیٰ",
              desc: "Divine names of Allah and Prophet (ﷺ) with meanings and spiritual virtues.",
              icon: Sparkles,
              accentColor: "text-indigo-700 bg-indigo-50 border-indigo-200 group-hover:bg-indigo-100/80 group-hover:border-indigo-300",
              iconAnimation: {
                animate: { rotate: [0, 90, 180, 270, 360], scale: [1, 1.12, 1] },
                transition: { repeat: Infinity, duration: 6, ease: 'linear' as const },
                hoverRotate: 360,
              },
            },
            {
              id: 'zakat' as ActiveTab,
              title: "Zakat Calculator",
              titleUrdu: "زکوٰۃ کیلکولیٹر",
              desc: "Nisab evaluation for gold, silver, cash, shares, and business inventory.",
              icon: Calculator,
              accentColor: "text-emerald-700 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-100/80 group-hover:border-emerald-300",
              iconAnimation: {
                animate: { y: [0, -2.5, 0], scale: [1, 1.05, 1] },
                transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' as const },
                hoverRotate: [0, -5, 5, 0],
              },
            },
          ].map((feat) => {
            const Icon = feat.icon;
            const isHovered = hoveredFeature === feat.id;

            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -4, scale: 1.015 }}
                onMouseEnter={() => setHoveredFeature(feat.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => setActiveTab(feat.id)}
                className={`group relative cursor-pointer rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm transition-all duration-300 flex flex-col justify-between overflow-visible min-h-[195px] ${
                  isHovered ? 'shadow-[0_12px_28px_-6px_rgba(239,68,68,0.12),0_8px_20px_-6px_rgba(37,99,235,0.12)] -translate-y-1 border-slate-300' : 'hover:shadow-md hover:border-slate-300'
                }`}
              >
                {/* Neon Dual Border Beam: Active on hovered card with smooth opacity and no circles */}
                <NeonDualBorderBeam isHovered={isHovered} duration={7} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    {/* Animated Icon Badge */}
                    <motion.div
                      className={`p-2.5 rounded-xl border shadow-sm transition-all duration-300 ${feat.accentColor}`}
                      animate={feat.iconAnimation.animate}
                      transition={feat.iconAnimation.transition}
                      whileHover={{ scale: 1.15 }}
                    >
                      <motion.div
                        animate={isHovered ? { rotate: feat.iconAnimation.hoverRotate } : {}}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                    </motion.div>

                    <span className="text-xs sm:text-sm font-urdu text-[#2e7d32] font-semibold">
                      {feat.titleUrdu}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#111827] mb-1.5 group-hover:text-[#2e7d32] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {feat.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-4 flex items-center text-xs font-bold text-[#2e7d32] group-hover:text-[#1b5e20] transition-colors">
                  <span>Explore Feature</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Live Salah Timetable Widget with Automatic Adhan Broadcast */}
      <section className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
        {/* Header and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-[#2e7d32] border border-emerald-200 relative">
              <Clock className="w-6 h-6" />
              {isPlayingAdhan && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-[#111827]">
                  Today's Prayer Schedule
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-[#2e7d32] font-urdu">
                  مواقيت الصلاة
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Calculated solar timings with real automatic Adhan audio broadcast
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* City Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700">
              <MapPin className="w-4 h-4 text-[#2e7d32]" />
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const found = POPULAR_CITIES.find(c => c.name === e.target.value);
                  if (found) setSelectedCity(found);
                }}
                className="bg-transparent border-none focus:outline-none text-[#111827] font-bold cursor-pointer"
              >
                {POPULAR_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Adhan Voice Selector */}
            <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <select
                value={selectedVoice}
                onChange={(e) => {
                  setSelectedVoice(e.target.value);
                  adhanPlayer.setVoice(e.target.value);
                }}
                className="bg-transparent border-none focus:outline-none text-[#111827] font-medium text-xs cursor-pointer"
                title="Select Adhan Mu'adhin Voice"
              >
                {ADHAN_VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-Adhan Toggle Button */}
            <button
              onClick={toggleAutoAdhan}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border transition-all cursor-pointer ${
                autoAdhanEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-[#2e7d32] shadow-sm'
                  : 'bg-slate-100 border-slate-300 text-slate-500'
              }`}
              title="Toggle automatic Adhan when prayer time arrives"
            >
              <div className="relative flex items-center justify-center">
                {autoAdhanEnabled ? (
                  <Bell className="w-3.5 h-3.5 text-[#2e7d32]" />
                ) : (
                  <BellOff className="w-3.5 h-3.5 text-slate-400" />
                )}
                {autoAdhanEnabled && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2e7d32] rounded-full animate-pulse" />
                )}
              </div>
              <span>{autoAdhanEnabled ? 'Auto Adhan: ON' : 'Auto Adhan: OFF'}</span>
            </button>

            {/* Manual Test / Listen Adhan Button */}
            {isPlayingAdhan ? (
              <button
                onClick={stopAdhan}
                className="px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white border border-rose-700 shadow-sm transition-all cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Stop Adhan</span>
              </button>
            ) : (
              <button
                onClick={triggerTestAdhan}
                className="px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 bg-[#2e7d32] hover:bg-[#256629] text-white border border-[#246728] shadow-sm transition-all cursor-pointer"
                title="Play Adhan sound immediately"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Adhan Voice</span>
              </button>
            )}
          </div>
        </div>

        {/* Temporary Notice Toast */}
        {testNotice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-xl bg-emerald-100/80 border border-emerald-300 text-[#1b5e20] text-xs font-semibold flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
            <span>{testNotice}</span>
          </motion.div>
        )}

        {/* Active Adhan Live Audio Broadcast Banner */}
        {isPlayingAdhan && activeAdhanInfo && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1b4324] via-[#24572f] to-[#1e4826] p-4 text-white shadow-lg border border-emerald-600 space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                {/* Equalizer Sound Waves */}
                <div className="flex items-end space-x-1 h-7 px-2 py-1 bg-black/20 rounded-lg border border-emerald-400/30">
                  <span className="w-1 bg-emerald-300 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-5" />
                  <span className="w-1 bg-emerald-300 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s] h-6" />
                  <span className="w-1 bg-emerald-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-4" />
                  <span className="w-1 bg-emerald-300 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.3s] h-7" />
                  <span className="w-1 bg-emerald-300 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.4s] h-3" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
                      Live Adhan Broadcast
                    </span>
                    <span className="text-xs font-urdu text-emerald-300 font-bold">
                      اذان کا وقت: نمازِ {activeAdhanInfo.urdu}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    Now Playing {activeAdhanInfo.name} Adhan ({ADHAN_VOICES.find(v => v.id === selectedVoice)?.name})
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDuaAfterAdhan(!showDuaAfterAdhan)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-medium border border-white/15 transition-colors cursor-pointer"
                >
                  {showDuaAfterAdhan ? 'Hide Dua' : 'Dua After Adhan'}
                </button>
                <button
                  onClick={stopAdhan}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/90 hover:bg-rose-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>
              </div>
            </div>

            {/* Dua after Adhan drop-down */}
            {showDuaAfterAdhan && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-3 border-t border-emerald-700/60 text-xs space-y-1 bg-black/15 p-3 rounded-xl"
              >
                <p className="font-urdu text-base text-amber-200 text-right leading-loose font-medium" dir="rtl">
                  اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
                </p>
                <p className="text-emerald-100/90 text-right font-urdu text-xs" dir="rtl">
                  اے اللہ! اس کامل پکار اور قائم ہونے والی نماز کے رب! محمد ﷺ کو وسیلہ اور فضیلت عطا فرما اور انہیں اس مقامِ محمود پر فائز فرما جس کا تو نے ان سے وعدہ کیا ہے۔
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 6 Times Grid with Active Indicator & Click-to-Play */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {prayerScheduleItems.map((p) => {
            const isCurrent = currentActivePrayer.id === p.id;
            const isPlayingThisPrayer = isPlayingAdhan && activeAdhanInfo?.name === p.name;

            return (
              <div
                key={p.id}
                onClick={() => {
                  if (p.hasAdhan) {
                    playAdhan(p.name, p.urdu);
                  }
                }}
                className={`relative p-3.5 rounded-2xl border transition-all select-none ${
                  p.hasAdhan ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                } ${
                  isPlayingThisPrayer
                    ? 'bg-amber-50/80 border-amber-400 shadow-md ring-2 ring-amber-300'
                    : isCurrent
                    ? 'bg-emerald-50/80 border-[#2e7d32] shadow-sm ring-2 ring-emerald-200'
                    : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
                title={p.hasAdhan ? `Click to listen ${p.name} Adhan` : p.name}
              >
                {/* Top Badge: Active or Playing */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {p.name}
                  </span>
                  {isPlayingThisPrayer ? (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-amber-700 bg-amber-200/70 px-1.5 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                      <span>Adhan</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[10px] font-bold text-[#2e7d32] bg-emerald-100 px-1.5 py-0.5 rounded-md">
                      Active
                    </span>
                  ) : null}
                </div>

                <span className="text-xs text-[#2e7d32] font-urdu block -mt-0.5 font-semibold">
                  {p.urdu}
                </span>

                <span className="text-base font-extrabold text-[#111827] mt-1.5 block tracking-tight">
                  {p.time}
                </span>

                {/* Footer hint */}
                {p.hasAdhan && (
                  <div className="mt-2 pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Volume2 className="w-3 h-3 text-[#2e7d32]" />
                      <span>Adhan</span>
                    </span>
                    <span className="text-[9px] text-[#2e7d32] font-medium">Click</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Prayer Countdown and Auto-Adhan Status Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#2e7d32] animate-pulse" />
            <span>
              اگلی نماز: <strong className="text-[#111827]">{upcomingPrayer.urdu} ({upcomingPrayer.name})</strong> وقت: <strong>{upcomingPrayer.time}</strong> (باقی وقت: {remHours > 0 ? `${remHours} گھنٹے ` : ''}{remMins} منٹ)
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
            <span>
              {autoAdhanEnabled
                ? 'خودکار اذان کا الرٹ فعال ہے (Auto Adhan will sound automatically at prayer time)'
                : 'خودکار اذان بند ہے (Auto Adhan is currently disabled)'}
            </span>
          </div>
        </div>
      </section>

      {/* What People Say About IslamPath? (Scholars & Teachers Endorsements) */}
      <div className="optimize-render">
        <ScholarsTestimonials />
      </div>

      {/* 7. Appreciated by Top Scholars (Continuous Left Flow Slider with Hover Pause) */}
      <div className="optimize-render">
        <ScholarsMarquee />
      </div>
    </div>
  );
};
