import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedAudio = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    // Load sacred Bismillah (Tasmiyah) recitation audio
    const audio = new Audio('/audio/bismillah.mp3');
    audio.preload = 'auto';
    audioRef.current = audio;

    const playAudio = () => {
      if (!audioRef.current) return;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          hasStartedAudio.current = true;
        })
        .catch((err) => {
          console.log('Autoplay restriction encountered, awaiting micro-interaction:', err);
        });
    };

    // Immediate automatic play attempt on mount (no click needed)
    playAudio();

    // In case the browser requires user interaction for unmuted media,
    // trigger instantly on ANY subtle movement (pointermove, scroll, touch, key, click)
    const onAnyInteraction = () => {
      if (audioRef.current && (audioRef.current.paused || !hasStartedAudio.current)) {
        playAudio();
      }
    };

    window.addEventListener('pointermove', onAnyInteraction, { once: true });
    window.addEventListener('mousemove', onAnyInteraction, { once: true });
    window.addEventListener('pointerdown', onAnyInteraction, { once: true });
    window.addEventListener('touchstart', onAnyInteraction, { once: true });
    window.addEventListener('keydown', onAnyInteraction, { once: true });
    window.addEventListener('scroll', onAnyInteraction, { once: true });
    window.addEventListener('click', onAnyInteraction, { once: true });

    // Progress bar animation (~5 seconds matching the Tasmiyah recitation)
    const durationMs = 5200;
    const stepMs = 50;
    const increment = 100 / (durationMs / stepMs);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
            }
            onComplete();
          }, 400);
          return 100;
        }
        return next;
      });
    }, stepMs);

    audio.onended = () => {
      setIsPlaying(false);
      onComplete();
    };

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('pointermove', onAnyInteraction);
      window.removeEventListener('mousemove', onAnyInteraction);
      window.removeEventListener('pointerdown', onAnyInteraction);
      window.removeEventListener('touchstart', onAnyInteraction);
      window.removeEventListener('keydown', onAnyInteraction);
      window.removeEventListener('scroll', onAnyInteraction);
      window.removeEventListener('click', onAnyInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [isOpen, onComplete]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onComplete();
  };

  const handleScreenClick = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
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
          onClick={handleScreenClick}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden cursor-default"
          style={{
            background: 'radial-gradient(ellipse at center, #0e2439 0%, #081624 55%, #030a12 100%)'
          }}
        >
          {/* Ambient spiritual background glow effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/7 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-[#1b4d24]/25 rounded-full blur-2xl pointer-events-none" />

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

          {/* Center Content Container */}
          <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center">
            
            {/* Top Ornamental Line with Centered Sacred Emblem */}
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="relative w-full max-w-md flex items-center justify-center mb-8"
            >
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-amber-300" />
              
              <div className="mx-3.5 px-3.5 py-1 rounded-full border border-amber-400/40 bg-[#081624]/90 shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="text-[10px] tracking-[0.2em] font-semibold text-amber-200 uppercase">
                  تَسْمِيَةُ الشَّرِيف • SACRED TASMIYAH
                </span>
              </div>

              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-amber-400/60 to-amber-300" />
            </motion.div>

            {/* Sacred Arabic Calligraphy: Bismillah (Tasmiyah) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-5"
            >
              <h1 
                className="font-arabic text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#edd392] via-[#fff5d6] to-[#e5b869] drop-shadow-[0_2px_18px_rgba(229,184,105,0.45)] leading-relaxed tracking-wide"
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </h1>
            </motion.div>

            {/* Grand Brand Title: ISLAMIC (Gold) + PATH (White) */}
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

            {/* Subtitle / Meaning in English & Urdu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-1.5 mb-10"
            >
              <p className="text-xs sm:text-sm font-medium tracking-[0.22em] text-amber-200/90 uppercase">
                IN THE NAME OF ALLAH, THE MOST BENEFICENT, THE MOST MERCIFUL
              </p>
              <p className="font-urdu text-sm sm:text-base text-slate-300/90 tracking-normal pt-1" dir="rtl">
                شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے
              </p>
            </motion.div>

            {/* Sleek Minimalist Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-3 mb-2"
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
              <div className="flex items-center justify-between w-full text-[11px] text-amber-200/70 font-mono">
                <div className="flex items-center gap-2">
                  {isPlaying ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-emerald-300 font-sans font-medium">تلاوتِ تسمیہ شریف جاری ہے...</span>
                    </>
                  ) : (
                    <span className="font-sans text-amber-200/70">تسمیہ شریف (بِسْمِ اللَّهِ)</span>
                  )}
                </div>
                <span>{Math.round(progress)}%</span>
              </div>
            </motion.div>

          </div>

          {/* Bottom subtle attribution */}
          <div className="absolute bottom-4 text-[11px] tracking-wider text-slate-500/70 font-mono">
            ISLAMIC PATH • SACRED TASMIYAH START
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
