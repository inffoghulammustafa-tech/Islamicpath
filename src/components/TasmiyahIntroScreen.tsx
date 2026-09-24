import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, ArrowRight, Mic } from 'lucide-react';

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
  const hasFinishedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onComplete();
  }, [onComplete]);

  // Master function to play audio automatically
  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasFinishedRef.current) return;

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log('Autoplay attempted, awaiting browser policy clearance:', err);
          });
      }
    } else {
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Grab preloaded audio element from index.html if available, or use ref
    const preloadedAudio = document.getElementById('tasmiyah-preload-audio') as HTMLAudioElement | null;
    if (preloadedAudio) {
      audioRef.current = preloadedAudio;
      if (!preloadedAudio.paused) {
        setIsPlaying(true);
      }
    }

    // 1. Immediately attempt playback on mount
    attemptPlay();

    // 2. High-frequency retries to trigger playback as soon as browser/buffer unlocks
    const retryDelays = [50, 150, 300, 500, 800, 1200, 1800, 2500];
    const timers = retryDelays.map((delay) =>
      setTimeout(() => {
        if (!hasFinishedRef.current && audioRef.current?.paused) {
          attemptPlay();
        }
      }, delay)
    );

    // 3. Auto-start on ANY cursor movement, hover, touch, scroll, focus, or key without requiring a click
    const activationEvents = [
      'pointerenter',
      'mouseenter',
      'pointerover',
      'mouseover',
      'pointermove',
      'mousemove',
      'pointerdown',
      'mousedown',
      'touchstart',
      'keydown',
      'wheel',
      'scroll',
      'focus',
      'visibilitychange'
    ];

    const handleEventActivation = () => {
      if (audioRef.current && audioRef.current.paused && !hasFinishedRef.current) {
        attemptPlay();
      }
    };

    activationEvents.forEach((evt) => {
      window.addEventListener(evt, handleEventActivation, { passive: true });
      document.addEventListener(evt, handleEventActivation, { passive: true });
    });

    // 4. Attach audio lifecycle listeners
    const currentAudio = audioRef.current;
    const handleTime = () => {
      if (currentAudio && currentAudio.duration && !isNaN(currentAudio.duration) && currentAudio.duration > 0) {
        const pct = Math.min(100, (currentAudio.currentTime / currentAudio.duration) * 100);
        setProgress(pct);
      }
    };

    const handleEnded = () => {
      setProgress(100);
      setIsPlaying(false);
      setTimeout(() => {
        finishIntro();
      }, 400);
    };

    const handlePlayState = () => setIsPlaying(true);
    const handlePauseState = () => setIsPlaying(false);

    if (currentAudio) {
      currentAudio.addEventListener('timeupdate', handleTime);
      currentAudio.addEventListener('ended', handleEnded);
      currentAudio.addEventListener('play', handlePlayState);
      currentAudio.addEventListener('pause', handlePauseState);
      currentAudio.addEventListener('canplay', attemptPlay);
      currentAudio.addEventListener('loadeddata', attemptPlay);
    }

    // 5. Maximum duration fallback so app never freezes if audio is blocked entirely
    const maxTimer = setTimeout(() => {
      finishIntro();
    }, 7500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(maxTimer);
      activationEvents.forEach((evt) => {
        window.removeEventListener(evt, handleEventActivation);
        document.removeEventListener(evt, handleEventActivation);
      });
      if (currentAudio) {
        currentAudio.removeEventListener('timeupdate', handleTime);
        currentAudio.removeEventListener('ended', handleEnded);
        currentAudio.removeEventListener('play', handlePlayState);
        currentAudio.removeEventListener('pause', handlePauseState);
        currentAudio.removeEventListener('canplay', attemptPlay);
        currentAudio.removeEventListener('loadeddata', attemptPlay);
        currentAudio.pause();
      }
    };
  }, [isOpen, attemptPlay, finishIntro]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    finishIntro();
  };

  // Dedicated Mic Button Click: Instant guaranteed voice playback
  const handleMicClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.muted = false;
    setIsMuted(false);
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.log('Mic play error:', err);
      });
  };

  const handleScreenClick = () => {
    if (audioRef.current?.paused) {
      attemptPlay();
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
          {/* Hidden autoPlay native audio element directly in DOM */}
          <audio
            ref={audioRef}
            src="/audio/bismillah.mp3"
            autoPlay
            playsInline
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onCanPlay={attemptPlay}
            onLoadedData={attemptPlay}
          />

          {/* Ambient spiritual background glow effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-[#1b4d24]/30 rounded-full blur-2xl pointer-events-none" />

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
              transition={{ duration: 0.9, delay: 0.05 }}
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
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mb-5 relative"
            >
              {/* Subtle halo glow behind calligraphy during playback */}
              {isPlaying && (
                <div className="absolute inset-0 bg-amber-400/10 rounded-full blur-xl animate-pulse pointer-events-none" />
              )}
              <h1 
                className="relative font-arabic text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#edd392] via-[#fff5d6] to-[#e5b869] drop-shadow-[0_2px_18px_rgba(229,184,105,0.5)] leading-relaxed tracking-wide"
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </h1>
            </motion.div>

            {/* Grand Brand Title: ISLAMIC (Gold) + PATH (White) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
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
              transition={{ duration: 0.8, delay: 0.35 }}
              className="space-y-1.5 mb-5"
            >
              <p className="text-xs sm:text-sm font-medium tracking-[0.22em] text-amber-200/90 uppercase">
                IN THE NAME OF ALLAH, THE MOST BENEFICENT, THE MOST MERCIFUL
              </p>
              <p className="font-urdu text-sm sm:text-base text-slate-300/90 tracking-normal pt-1" dir="rtl">
                شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے
              </p>
            </motion.div>

            {/* Dedicated Spiritual Golden Mic Button directly below Translation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center justify-center my-3 relative z-20"
            >
              <motion.button
                id="tasmiyah-mic-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleMicClick}
                className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isPlaying
                    ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.65)] ring-4 ring-amber-400/40'
                    : 'bg-white/10 hover:bg-white/20 text-amber-300 hover:text-white border-2 border-amber-400/50 hover:border-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                }`}
                title="تسمیہ شریف سنیں (Listen to Tasmiyah)"
                aria-label="تسمیہ شریف سنیں"
              >
                {/* Glowing ripple aura rings when playing */}
                {isPlaying && (
                  <>
                    <span className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping opacity-60 pointer-events-none" />
                    <span className="absolute -inset-2 rounded-full border border-amber-400/40 animate-pulse pointer-events-none" />
                  </>
                )}
                <Mic className={`w-6 h-6 drop-shadow-xs transition-transform ${isPlaying ? 'scale-110' : ''}`} />
              </motion.button>
            </motion.div>

            {/* Clean Minimalist Golden Progress Line */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="w-full max-w-xs sm:max-w-sm flex flex-col items-center mt-3 mb-2"
            >
              <div className="w-full h-[3px] bg-[#14283d] rounded-full overflow-hidden relative shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#d4af37] via-[#f7e7be] to-[#e5b869] shadow-[0_0_14px_#d4af37]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
