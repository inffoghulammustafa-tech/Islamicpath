import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, BookOpen, ArrowRight, Play, Check } from 'lucide-react';

interface TasmiyahIntroScreenProps {
  onComplete: () => void;
  isOpen?: boolean;
}

export const TasmiyahIntroScreen: React.FC<TasmiyahIntroScreenProps> = ({ 
  onComplete,
  isOpen = true
}) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [isReadyToEnter, setIsReadyToEnter] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Initialize audio
    const audio = new Audio('/audio/bismillah.mp3');
    audio.preload = 'auto';
    audioRef.current = audio;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setAudioBlocked(false);
      } catch (err) {
        // Autoplay policy prevented immediate playback
        console.log('Autoplay waiting for user gesture:', err);
        setAudioBlocked(true);
      }
    };

    playAudio();

    // Progress bar animation syncing with audio (~4.5s)
    const durationMs = 4600;
    const stepMs = 50;
    const increment = 100 / (durationMs / stepMs);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsReadyToEnter(true);
          // Wait 600ms at 100% then transition smoothly
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        return next;
      });
    }, stepMs);

    audio.onended = () => {
      setIsPlaying(false);
      setIsReadyToEnter(true);
    };

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [isOpen, onComplete]);

  const handleManualPlay = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setAudioBlocked(false);
      }).catch((e) => console.log('Manual play error:', e));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onComplete();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="tasmiyah-intro-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at center, #0e2439 0%, #081624 55%, #030a12 100%)'
          }}
        >
          {/* Ambient spiritual background glow effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-[#1b4d24]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Skip / Sound Controls */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-30">
            <button
              id="intro-toggle-mute"
              onClick={toggleMute}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-amber-200/80 border border-amber-500/20 backdrop-blur-md transition-all cursor-pointer"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              id="intro-skip-button"
              onClick={handleSkip}
              className="px-4 py-2 text-xs font-medium tracking-wider text-amber-200/90 hover:text-white bg-white/5 hover:bg-white/10 border border-amber-500/20 hover:border-amber-400/40 rounded-full backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>SKIP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center Card / Content Container */}
          <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center">
            
            {/* Top Ornamental Line with Centered Islamic Emblem (Matching Reference Image) */}
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="relative w-full max-w-md flex items-center justify-center mb-8"
            >
              {/* Left Glowing Line */}
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-amber-300" />
              
              {/* Centered Sacred Emblem */}
              <div className="mx-3.5 px-3 py-1 rounded-full border border-amber-400/40 bg-[#081624]/90 shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[10px] tracking-[0.2em] font-semibold text-amber-200 uppercase">
                  تسمیہ شریف
                </span>
              </div>

              {/* Right Glowing Line */}
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-amber-400/60 to-amber-300" />
            </motion.div>

            {/* Sacred Arabic Tasmiyah Calligraphy */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4"
            >
              <h1 
                className="font-arabic text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#edd392] via-[#fff5d6] to-[#e5b869] drop-shadow-[0_2px_15px_rgba(229,184,105,0.4)] leading-relaxed tracking-wide"
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </h1>
            </motion.div>

            {/* Grand Brand Title: ISLAMIC (Gold) + PATH (White) - Direct Translation of FURNITURE HOLZ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mb-3"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.28em] uppercase flex items-center justify-center gap-2.5">
                <span className="text-[#e5b869] drop-shadow-[0_0_12px_rgba(229,184,105,0.3)]">
                  ISLAMIC
                </span>
                <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                  PATH
                </span>
              </h2>
            </motion.div>

            {/* Subtitle / Meaning in Urdu & English */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-1.5 mb-10"
            >
              <p className="text-xs sm:text-sm font-medium tracking-[0.22em] text-amber-200/90 uppercase">
                IN THE NAME OF ALLAH, THE MOST GRACIOUS, THE MOST MERCIFUL
              </p>
              <p className="font-urdu text-sm sm:text-base text-slate-300/90 tracking-normal pt-1" dir="rtl">
                شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے
              </p>
            </motion.div>

            {/* Sleek Minimalist Progress Bar (Matching Reference Image) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-3 mb-6"
            >
              {/* The Progress Track */}
              <div className="w-full h-[2.5px] bg-[#14283d] rounded-full overflow-hidden relative shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#d4af37] via-[#f7e7be] to-[#e5b869] shadow-[0_0_12px_#d4af37]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              {/* Status and Audio Indicator */}
              <div className="flex items-center justify-between w-full text-[11px] text-amber-200/60 font-mono">
                <div className="flex items-center gap-1.5">
                  {isPlaying ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-emerald-300 font-sans">تلاوتِ تسمیہ جاری ہے...</span>
                    </>
                  ) : audioBlocked ? (
                    <span className="text-amber-300 font-sans">آواز سننے کے لیے نیچے کلک کریں</span>
                  ) : (
                    <span className="font-sans text-slate-400">لوڈ ہو رہا ہے...</span>
                  )}
                </div>
                <span>{Math.round(progress)}%</span>
              </div>
            </motion.div>

            {/* If Browser Blocked Autoplay: Provide Friendly Golden Action Button */}
            {audioBlocked && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleManualPlay}
                className="mt-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:scale-105 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>تسمیہ شریف سنیں (Listen Bismillah)</span>
              </motion.button>
            )}

            {/* Direct Enter Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={handleSkip}
              className="mt-4 text-xs tracking-wider text-slate-400 hover:text-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>ویب سائٹ میں داخل ہوں (Enter Website)</span>
              <ArrowRight className="w-3 h-3" />
            </motion.button>

          </div>

          {/* Bottom subtle copyright / attribution */}
          <div className="absolute bottom-4 text-[11px] tracking-wider text-slate-500/70 font-mono">
            ISLAMIC PATH • BISMILLAH PRE-START
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
