import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  MapPin, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Bell,
  BellOff,
  Radio,
  Moon, 
  Sun, 
  Compass, 
  BookOpen, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CityLocation, PrayerTimesData } from '../types';
import { POPULAR_CITIES, calculatePrayerTimes } from '../data/prayerData';
import { adhanPlayer, ADHAN_VOICES } from '../utils/adhanPlayer';

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

export const PrayerSection: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(POPULAR_CITIES[0]); // Karachi
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData>(calculatePrayerTimes(POPULAR_CITIES[0]));
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'times' | 'guide' | 'qaza'>('times');

  // Auto-Adhan states
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

  // Subscribe to adhanPlayer
  useEffect(() => {
    const unsubscribe = adhanPlayer.subscribe((playing, info) => {
      setIsPlayingAdhan(playing);
      setActiveAdhanInfo(info);
    });
    return unsubscribe;
  }, []);

  // Qaza Namaz state (stored in localStorage)
  const [qazaCounts, setQazaCounts] = useState({
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem('islam360_qaza_counts');
    if (saved) {
      try {
        setQazaCounts(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const updateQaza = (prayer: keyof typeof qazaCounts, delta: number) => {
    setQazaCounts((prev) => {
      const updated = { ...prev, [prayer]: Math.max(0, prev[prayer] + delta) };
      localStorage.setItem('islam360_qaza_counts', JSON.stringify(updated));
      return updated;
    });
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
              playAdhan(p.name, p.urdu);
              break;
            }
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes, autoAdhanEnabled, lastTriggeredPrayer, selectedVoice]);

  // Play Adhan Audio directly into speaker
  const playAdhan = (prayerName = 'Dhuhr', prayerUrdu = 'ظہر') => {
    adhanPlayer.setVoice(selectedVoice);
    adhanPlayer.play(prayerName, prayerUrdu, selectedVoice);

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
  };

  // Browser Geolocation auto-detect
  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const userCity: CityLocation = {
            name: "My Location",
            country: "GPS",
            latitude: lat,
            longitude: lon,
            timezone: -new Date().getTimezoneOffset() / 60,
          };
          setSelectedCity(userCity);
        },
        (err) => {
          console.log("Could not access GPS location. Please choose a city from the list.");
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] flex items-center space-x-3">
            <Clock className="w-8 h-8 text-[#2e7d32]" />
            <span>Prayer Times &amp; Salah Guide</span>
            <span className="text-lg text-[#2e7d32] font-arabic">مواقيت الصلاة</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Astronomical solar prayer calculations, Adhan playback, Namaz step-by-step tutorial, and Qaza tracker
          </p>
        </div>

        {/* Location Selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDetectLocation}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#2e7d32] hover:border-[#2e7d32] text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Auto-detect location using GPS"
          >
            <MapPin className="w-4 h-4 text-[#2e7d32]" />
            <span className="hidden sm:inline font-bold">GPS Detect</span>
          </button>

          <select
            value={selectedCity.name}
            onChange={(e) => {
              const found = POPULAR_CITIES.find(c => c.name === e.target.value);
              if (found) setSelectedCity(found);
            }}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#2e7d32] cursor-pointer"
          >
            {selectedCity.name === "My Location" && (
              <option value="My Location">GPS: My Location</option>
            )}
            {POPULAR_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}, {c.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
        {[
          { id: 'times' as const, label: "Today's Timetable", urdu: "اوقاتِ نماز" },
          { id: 'guide' as const, label: "Step-by-Step Salah Guide", urdu: "طریقہ نماز" },
          { id: 'qaza' as const, label: "Qaza Namaz Counter", urdu: "قضاء نماز ٹریکر" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeSubTab === tab.id
                ? 'bg-[#2e7d32] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] opacity-80 font-urdu">({tab.urdu})</span>
          </button>
        ))}
      </div>

      {activeSubTab === 'times' && (
        <div className="space-y-6">
          {/* Highlight Banner */}
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#edf7f0] via-[#f2faf4] to-white border border-emerald-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="text-center md:text-left space-y-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white text-[#2e7d32] border border-emerald-300 text-xs font-bold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Selected Location: {selectedCity.name}, {selectedCity.country}</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
                  Preserve Your Five Daily Prayers
                </h2>
                <p className="text-sm text-slate-600 max-w-xl font-urdu">
                  "بے شک نماز مومنوں پر مقررہ وقتوں میں فرض کی گئی ہے۔" (سورۃ النساء 4:103)
                </p>
              </div>

              {/* Adhan Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Voice Selector */}
                <div className="flex items-center space-x-1.5 bg-white/90 border border-emerald-300 rounded-2xl px-3 py-2 text-xs">
                  <Radio className="w-3.5 h-3.5 text-[#2e7d32]" />
                  <select
                    value={selectedVoice}
                    onChange={(e) => {
                      setSelectedVoice(e.target.value);
                      adhanPlayer.setVoice(e.target.value);
                    }}
                    className="bg-transparent border-none focus:outline-none text-slate-800 font-bold text-xs cursor-pointer"
                  >
                    {ADHAN_VOICES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Auto Adhan Toggle */}
                <button
                  onClick={toggleAutoAdhan}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 border transition-all cursor-pointer ${
                    autoAdhanEnabled
                      ? 'bg-emerald-100 border-emerald-300 text-[#1b5e20]'
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}
                >
                  {autoAdhanEnabled ? (
                    <Bell className="w-4 h-4 text-[#2e7d32]" />
                  ) : (
                    <BellOff className="w-4 h-4 text-slate-400" />
                  )}
                  <span>{autoAdhanEnabled ? 'Auto Adhan: ON' : 'Auto Adhan: OFF'}</span>
                </button>

                {/* Play / Stop Button */}
                {isPlayingAdhan ? (
                  <button
                    id="prayer-listen-adhan-button"
                    onClick={stopAdhan}
                    className="px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white border border-rose-700 shadow-sm cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Stop Adhan</span>
                  </button>
                ) : (
                  <button
                    id="prayer-listen-adhan-button"
                    onClick={() => playAdhan('Dhuhr', 'ظہر')}
                    className="px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center space-x-2 bg-[#2e7d32] hover:bg-[#256629] text-white shadow-sm cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Test Adhan Voice</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Prayer Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Fajr", urdu: "نمازِ فجر", time: prayerTimes.fajr, desc: "Dawn prayer before sunrise", rakats: "2 Sunnah, 2 Fard", hasAdhan: true },
              { name: "Sunrise", urdu: "طلوعِ آفتاب", time: prayerTimes.sunrise, desc: "End of Fajr prayer time", rakats: "Ishraq prayer recommended", hasAdhan: false },
              { name: "Dhuhr", urdu: "نمازِ ظہر", time: prayerTimes.dhuhr, desc: "Midday prayer after zenith", rakats: "4 Sunnah, 4 Fard, 2 Sunnah, 2 Nafl", hasAdhan: true },
              { name: "Asr", urdu: "نمازِ عصر", time: prayerTimes.asr, desc: "Late afternoon prayer", rakats: "4 Sunnah Ghair Mu'akkadah, 4 Fard", hasAdhan: true },
              { name: "Maghrib", urdu: "نمازِ مغرب", time: prayerTimes.maghrib, desc: "Immediately after sunset", rakats: "3 Fard, 2 Sunnah, 2 Nafl", hasAdhan: true },
              { name: "Isha", urdu: "نمازِ عشاء", time: prayerTimes.isha, desc: "Night prayer before sleep", rakats: "4 Fard, 2 Sunnah, 3 Witr, 2 Nafl", hasAdhan: true },
              { name: "Tahajjud", urdu: "نمازِ تہجد", time: prayerTimes.tahajjud, desc: "Virtuous night vigil prayer", rakats: "2 to 8 Nafl before Fajr", hasAdhan: false },
            ].map((p, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-[#2e7d32] shadow-xs hover:shadow-sm transition-all space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2e7d32]">
                    {p.name}
                  </span>
                  <span className="text-xs font-urdu text-slate-500 font-medium">
                    {p.urdu}
                  </span>
                </div>
                <div className="text-3xl font-black text-[#111827] font-mono">
                  {p.time}
                </div>
                <p className="text-xs text-slate-500">
                  {p.desc}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#2e7d32] font-semibold">
                  <span>{p.rakats}</span>
                  {p.hasAdhan && (
                    <button
                      onClick={() => playAdhan(p.name, p.urdu)}
                      className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#2e7d32] text-[11px] font-bold transition-colors cursor-pointer"
                      title="Play Adhan"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Adhan</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step by Step Salah Guide Tab */}
      {activeSubTab === 'guide' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#111827] mb-1 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-[#2e7d32]" />
                <span>Step-by-Step Salah (Namaz) Guide</span>
              </h2>
              <p className="text-xs text-slate-500">
                Learn how to pray with authentic Arabic supplications, postures, and translations.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Takbeer-e-Tahreema (Opening Takbeer)",
                  urdu: "تکبیر تحریمہ",
                  posture: "Stand facing Qibla, raise both hands to earlobes, and say:",
                  arabic: "اللَّهُ أَكْبَرُ",
                  translation: "Allah is the Greatest.",
                },
                {
                  step: 2,
                  title: "Qiyam & Thana (Opening Supplication)",
                  urdu: "قیام اور ثناء",
                  posture: "Fold hands below navel (or on chest), recite Thana:",
                  arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ",
                  translation: "Glory be to You, O Allah, and all praises are due to You, and blessed is Your name, and high is Your majesty, and none has the right to be worshipped besides You.",
                },
                {
                  step: 3,
                  title: "Surah Al-Fatiha & Additional Surah",
                  urdu: "سورۃ الفاتحہ اور قرآن",
                  posture: "Recite Ta'awwudh, Tasmiyah, Surah Al-Fatiha, and at least 3 verses of the Quran.",
                  arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ...",
                  translation: "In the name of Allah, the Most Gracious, the Most Merciful. Praise be to Allah...",
                },
                {
                  step: 4,
                  title: "Ruku (Bowing)",
                  urdu: "رکوع",
                  posture: "Say 'Allahu Akbar' and bow, placing hands on knees, repeating 3 times:",
                  arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
                  translation: "Glory be to my Lord, the Magnificent (3 times).",
                },
                {
                  step: 5,
                  title: "Qawmah (Standing from Bowing)",
                  urdu: "قومہ (رکوع سے سیدھے کھڑے ہونا)",
                  posture: "Rise back up straight while reciting:",
                  arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ • رَبَّنَا وَلَكَ الْحَمْدُ",
                  translation: "Allah hears those who praise Him. Our Lord, to You belongs all praise.",
                },
                {
                  step: 6,
                  title: "Sajdah (Prostration)",
                  urdu: "سجدہ",
                  posture: "Prostrate with forehead, nose, palms, knees, and toes touching ground, reciting 3 times:",
                  arabic: "سُبْحَانَ رَبِّيَ الأَعْلَى",
                  translation: "Glory be to my Lord, the Most High (3 times).",
                },
                {
                  step: 7,
                  title: "Tashahhud (Sitting for Attahiyyat)",
                  urdu: "تشہد اور درود شریف",
                  posture: "Sit upright after second prostration and recite:",
                  arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ...",
                  translation: "All compliments, prayers, and pure things are due to Allah. Peace be upon you, O Prophet, and Allah's mercy and blessings...",
                },
                {
                  step: 8,
                  title: "Tasleem (Concluding the Prayer)",
                  urdu: "سلام پھیرنا",
                  posture: "Turn head right then left, saying:",
                  arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
                  translation: "May peace and the mercy of Allah be upon you.",
                },
              ].map((s) => (
                <div key={s.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2e7d32]">
                      Step {s.step}: {s.title}
                    </span>
                    <span className="text-xs font-urdu text-slate-600 font-semibold">
                      {s.urdu}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{s.posture}</p>
                  <p className="text-lg font-arabic text-[#1b5e20] text-right leading-loose py-1">
                    {s.arabic}
                  </p>
                  <p className="text-xs text-slate-500 italic">"{s.translation}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Qaza Namaz Counter Tab */}
      {activeSubTab === 'qaza' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#111827] flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-[#2e7d32]" />
                <span>Qaza-e-Umri / Missed Prayers Tracker</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Keep an accurate count of missed prayers and decrement them as you offer Qaza.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { id: 'fajr' as const, name: "Fajr", urdu: "فجر" },
              { id: 'dhuhr' as const, name: "Dhuhr", urdu: "ظہر" },
              { id: 'asr' as const, name: "Asr", urdu: "عصر" },
              { id: 'maghrib' as const, name: "Maghrib", urdu: "مغرب" },
              { id: 'isha' as const, name: "Isha & Witr", urdu: "عشاء و وتر" },
            ].map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111827] uppercase">{p.name}</span>
                  <span className="text-xs font-urdu text-[#2e7d32]">{p.urdu}</span>
                </div>

                <div className="text-3xl font-black text-[#2e7d32] font-mono">
                  {qazaCounts[p.id]}
                </div>

                <div className="flex items-center justify-center space-x-2 pt-2">
                  <button
                    onClick={() => updateQaza(p.id, -1)}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-base cursor-pointer"
                    title="Offered 1 Qaza"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => updateQaza(p.id, 1)}
                    className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 text-[#2e7d32] hover:bg-emerald-200 font-bold text-base cursor-pointer"
                    title="Add 1 Missed"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => updateQaza(p.id, 5)}
                    className="px-2 h-9 rounded-xl bg-[#2e7d32] text-white hover:bg-[#256629] text-xs font-semibold cursor-pointer"
                    title="Add 5"
                  >
                    +5
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-xs text-slate-700">
            <AlertCircle className="w-5 h-5 text-[#2e7d32] shrink-0 mt-0.5" />
            <p>
              <strong>Fiqh Guidance:</strong> Missed obligatory prayers remain a debt unto Allah until fulfilled. Offer Qaza prayers with intention e.g., "I intend to pray the first missed Fajr obligatory prayer due upon me."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
