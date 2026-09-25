import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Bell, Sparkles, CheckCircle2, X, Minimize2, Maximize2 } from 'lucide-react';
import { autoAdhanEngine, ActiveAdhanAlert } from '../utils/autoAdhanEngine';
import { ADHAN_VOICES } from '../utils/adhanPlayer';

export const AutoAdhanGlobalModal: React.FC = () => {
  const [activeAlert, setActiveAlert] = useState<ActiveAdhanAlert | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const unsub = autoAdhanEngine.subscribe((alert, playing) => {
      setActiveAlert(alert);
      setIsPlaying(playing);
      if (alert && playing) {
        setIsMinimized(false);
      }
    });
    return unsub;
  }, []);

  if (!isPlaying || !activeAlert) return null;

  const currentSettings = autoAdhanEngine.getSettings();
  const voiceInfo = ADHAN_VOICES.find(v => v.id === currentSettings.selectedVoice) || ADHAN_VOICES[0];

  // Minimized Floating Pill Mode
  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-[#1b5e20] to-[#2e7d32] text-white px-4 py-3 rounded-2xl shadow-2xl border border-yellow-400/50"
      >
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-spin-slow">
            <Volume2 className="w-4 h-4 text-yellow-300 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
        </div>
        <div>
          <div className="text-xs font-bold font-arabic">
            اذان نمازِ {activeAlert.prayerUrdu} جاری ہے
          </div>
          <div className="text-[10px] text-emerald-100">
            {voiceInfo.name} ({activeAlert.timeStr})
          </div>
        </div>
        <div className="flex items-center gap-1.5 ml-2 border-l border-white/20 pl-2">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="بڑا کریں"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => autoAdhanEngine.stopAdhan()}
            className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors"
            title="اذان روکیں"
          >
            <VolumeX className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#0a2312] via-[#0f3419] to-[#0a2312] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-yellow-500/40 overflow-hidden space-y-6"
        >
          {/* Top Decorative Crescent Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Controls */}
          <div className="flex items-center justify-between relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold border border-yellow-400/30">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              <span>موبائل و ٹیبلیٹ پر خودکار اذان (Auto Adhan)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="چھوٹا کریں"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => autoAdhanEngine.stopAdhan()}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="بند کریں"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Spiritual Sound Wave & Calling Icon */}
          <div className="flex flex-col items-center justify-center text-center space-y-4 relative z-10 pt-2">
            <div className="relative flex items-center justify-center">
              {/* Animated Ripple Circles */}
              <div className="absolute w-28 h-28 rounded-full border-2 border-yellow-400/20 animate-ping" />
              <div className="absolute w-24 h-24 rounded-full border border-emerald-400/40 animate-pulse" />

              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 text-emerald-950 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <Volume2 className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            {/* Arabic Calligraphy Phrase */}
            <div className="space-y-1">
              <h2 className="font-arabic text-2xl sm:text-3xl text-yellow-300 font-bold tracking-wide">
                {activeAlert.arabicPhrase}
              </h2>
              <div className="text-xl sm:text-2xl font-black text-white font-arabic">
                اذان نمازِ {activeAlert.prayerUrdu} ({activeAlert.prayerName})
              </div>
              <p className="text-xs sm:text-sm text-emerald-200">
                وقت: <span className="font-bold text-yellow-300">{activeAlert.timeStr}</span> • آواز: <span className="font-semibold">{voiceInfo.name}</span>
              </p>
            </div>
          </div>

          {/* Dua After Adhan Card */}
          <div className="p-4 rounded-2xl bg-white/10 border border-emerald-400/20 space-y-2 relative z-10">
            <div className="flex items-center justify-between text-xs text-yellow-300 font-bold border-b border-white/10 pb-1.5">
              <span>دعائے بعد اذان (Dua After Adhan)</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <p className="font-arabic text-sm text-center leading-loose text-emerald-100" dir="rtl">
              اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
            </p>
            <p className="text-[11px] text-slate-300 text-center font-urdu" dir="rtl">
              اے اللہ! اس کامل دعوت اور قائم ہونے والی نماز کے رب! ہمارے نبی حضرت محمد (ﷺ) کو وسیلہ اور فضیلت عطا فرما اور انہیں مقامِ محمود پر فائز فرما۔
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <button
              onClick={() => setIsMinimized(true)}
              className="py-3 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
              <span>پس منظر میں سنیں</span>
            </button>

            <button
              onClick={() => autoAdhanEngine.stopAdhan()}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <VolumeX className="w-4 h-4" />
              <span>اذان روکیں (Stop)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
