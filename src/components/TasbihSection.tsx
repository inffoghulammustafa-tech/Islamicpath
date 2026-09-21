import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Check, 
  Heart,
  Award,
} from 'lucide-react';

interface DhikrPreset {
  id: string;
  arabic: string;
  transliteration: string;
  meaningUrdu: string;
  meaningEnglish: string;
  defaultTarget: number;
}

const DHIKR_PRESETS: DhikrPreset[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "SubhanAllah",
    meaningUrdu: "اللہ ہر عیب سے پاک ہے",
    meaningEnglish: "Glory be to Allah",
    defaultTarget: 33,
  },
  {
    id: "alhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    meaningUrdu: "تمام تعریفیں اللہ ہی کے لیے ہیں",
    meaningEnglish: "All praise is due to Allah",
    defaultTarget: 33,
  },
  {
    id: "allahuakbar",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    meaningUrdu: "اللہ سب سے بڑا ہے",
    meaningEnglish: "Allah is the Greatest",
    defaultTarget: 34,
  },
  {
    id: "astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    transliteration: "Astaghfirullah",
    meaningUrdu: "میں اللہ سے بخشش مانگتا ہوں",
    meaningEnglish: "I seek forgiveness from Allah",
    defaultTarget: 100,
  },
  {
    id: "lailahaillallah",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    transliteration: "La ilaha illallah",
    meaningUrdu: "اللہ کے سوا کوئی معبود نہیں",
    meaningEnglish: "There is no deity worthy of worship except Allah",
    defaultTarget: 100,
  },
  {
    id: "durood",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ",
    transliteration: "Allahumma salli 'ala Muhammad",
    meaningUrdu: "اے اللہ! ہمارے نبی حضرت محمد ﷺ پر رحمتیں نازل فرما",
    meaningEnglish: "O Allah, bestow peace and blessings upon Muhammad (ﷺ)",
    defaultTarget: 100,
  },
  {
    id: "lahawla",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "La hawla wa la quwwata illa billah",
    meaningUrdu: "گناہ سے بچنے اور نیکی کرنے کی طاقت صرف اللہ کی مدد سے ہے",
    meaningEnglish: "There is no power nor strength except with Allah",
    defaultTarget: 100,
  },
];

export const TasbihSection: React.FC = () => {
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrPreset>(DHIKR_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33);
  const [laps, setLaps] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lifetimeTotal, setLifetimeTotal] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('islam360_tasbih_lifetime');
    if (saved) setLifetimeTotal(parseInt(saved, 10) || 0);
  }, []);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  };

  const handleIncrement = () => {
    playClickSound();
    if (navigator.vibrate) navigator.vibrate(20);

    const nextCount = count + 1;
    const nextLifetime = lifetimeTotal + 1;
    setLifetimeTotal(nextLifetime);
    localStorage.setItem('islam360_tasbih_lifetime', String(nextLifetime));

    if (nextCount >= target) {
      setLaps(l => l + 1);
      setCount(0);
      if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const progressPct = target > 0 ? (count / target) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-[#2e7d32]" />
            <span>Digital Tasbih</span>
            <span className="text-lg text-[#2e7d32] font-arabic">سبحة إلكترونية</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Interactive Dhikr counter with audio feedback, presets, and target goals
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-50 text-[#2e7d32] border-emerald-300'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
            title="Audio Click Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#2e7d32] hover:bg-slate-100 transition-colors cursor-pointer"
            title="Reset Counter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Dhikr Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {DHIKR_PRESETS.map((preset) => {
          const isSelected = selectedDhikr.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedDhikr(preset);
                setTarget(preset.defaultTarget);
                setCount(0);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer flex flex-col items-center space-y-0.5 ${
                isSelected
                  ? 'bg-[#2e7d32] text-white border-[#2e7d32] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              <span className="font-arabic text-base font-bold">{preset.arabic}</span>
              <span className="text-[10px] opacity-80">{preset.transliteration}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Main Tasbih Click Device (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
          {/* Active Dhikr Display */}
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-3xl sm:text-4xl font-arabic font-bold text-[#1b5e20]">
              {selectedDhikr.arabic}
            </h2>
            <p className="text-sm text-slate-800 font-bold">{selectedDhikr.transliteration}</p>
            <p className="text-xs text-[#2e7d32] font-urdu">{selectedDhikr.meaningUrdu}</p>
          </div>

          {/* Interactive Tap Button */}
          <motion.div
            id="tasbih-tap-button"
            whileTap={{ scale: 0.95 }}
            onClick={handleIncrement}
            className="cursor-pointer relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-emerald-100 bg-gradient-to-tr from-[#f4faf6] via-white to-[#edf7f0] flex flex-col items-center justify-center shadow-md select-none group"
          >
            {/* SVG Ring Progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                className="stroke-slate-100 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                className="stroke-[#2e7d32] fill-none transition-all duration-150"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progressPct) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* Counter Number */}
            <div className="text-center z-10 space-y-1">
              <span className="text-5xl sm:text-6xl font-black text-[#111827] font-mono tracking-tight">
                {count}
              </span>
              <div className="text-xs font-bold text-[#2e7d32] uppercase tracking-widest">
                Goal: {target}
              </div>
              <span className="text-[11px] text-slate-400 block font-medium">
                Tap anywhere inside
              </span>
            </div>
          </motion.div>

          {/* Target Selector Buttons */}
          <div className="mt-8 flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-bold">Target:</span>
            {[33, 99, 100, 1000].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTarget(t);
                  setCount(0);
                }}
                className={`px-3 py-1 rounded-xl border font-mono font-bold transition-all cursor-pointer ${
                  target === t
                    ? 'bg-[#2e7d32] text-white border-[#2e7d32]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Stats & Virtues (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#111827] flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#2e7d32]" />
              <span>Tasbih Statistics</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                  Completed Laps
                </span>
                <span className="text-2xl font-black text-[#2e7d32] font-mono mt-1 block">
                  {laps}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                  Lifetime Total
                </span>
                <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">
                  {lifetimeTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#111827] flex items-center space-x-2">
              <Heart className="w-4 h-4 text-[#2e7d32]" />
              <span>Virtue of Dhikr (حدیث مبارکہ)</span>
            </h3>
            <p className="text-sm font-urdu text-[#2e7d32] leading-relaxed text-right">
              "رسول اللہ ﷺ نے فرمایا: جو شخص ہر نماز کے بعد 33 مرتبہ سبحان اللہ، 33 مرتبہ الحمد للہ اور 34 مرتبہ اللہ اکبر کہے، اس کے گناہ بخش دیے جاتے ہیں چاہے وہ سمندر کی جھاگ کے برابر ہی کیوں نہ ہوں۔"
            </p>
            <p className="text-xs text-slate-400 italic">
              — Sahih Muslim (597)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
