import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  Bookmark, 
  Copy, 
  Check, 
  Sliders, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { SurahMeta, Ayah } from '../types';
import { SURAH_LIST, fetchSurahAyahs, PRELOADED_SURAHS } from '../data/quranData';

export const QuranSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta>(SURAH_LIST[0]); // Al-Fatiha
  const [ayahs, setAyahs] = useState<Ayah[]>(PRELOADED_SURAHS[1]?.ayahs || []);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  
  // Audio state
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Settings
  const [arabicFontSize, setArabicFontSize] = useState<number>(28);
  const [showUrdu, setShowUrdu] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<number[]>([]);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoadingAyahs(true);
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentPlayingAyah(null);
        setIsPlayingFullSurah(false);
      }

      const result = await fetchSurahAyahs(selectedSurah.number);
      if (isMounted) {
        setAyahs(result);
        setLoadingAyahs(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
      if (audioRef.current) audioRef.current.pause();
    };
  }, [selectedSurah]);

  const playAyahAudio = (ayahNumberInSurah: number, audioUrl?: string) => {
    if (!audioUrl) return;

    if (currentPlayingAyah === ayahNumberInSurah && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setCurrentPlayingAyah(null);
      setIsPlayingFullSurah(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setCurrentPlayingAyah(ayahNumberInSurah);

    audio.onended = () => {
      if (isPlayingFullSurah && ayahNumberInSurah < ayahs.length) {
        const nextAyah = ayahs.find(a => a.numberInSurah === ayahNumberInSurah + 1);
        if (nextAyah && nextAyah.audioUrl) {
          playAyahAudio(nextAyah.numberInSurah, nextAyah.audioUrl);
        } else {
          setCurrentPlayingAyah(null);
          setIsPlayingFullSurah(false);
        }
      } else {
        setCurrentPlayingAyah(null);
        setIsPlayingFullSurah(false);
      }
    };

    audio.play().catch(e => {
      console.log('Audio playback error', e);
      setCurrentPlayingAyah(null);
      setIsPlayingFullSurah(false);
    });
  };

  const playFullSurah = () => {
    if (isPlayingFullSurah && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingFullSurah(false);
      setCurrentPlayingAyah(null);
    } else {
      if (ayahs.length > 0 && ayahs[0].audioUrl) {
        setIsPlayingFullSurah(true);
        playAyahAudio(ayahs[0].numberInSurah, ayahs[0].audioUrl);
      }
    }
  };

  const copyAyahText = (ayah: Ayah) => {
    const textToCopy = `${ayah.text}\n\n[Urdu]: ${ayah.translationUr}\n[English]: ${ayah.translationEn}\n(${selectedSurah.englishName} ${selectedSurah.number}:${ayah.numberInSurah})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const toggleBookmark = (ayahNum: number) => {
    setBookmarkedAyahs(prev => 
      prev.includes(ayahNum) ? prev.filter(n => n !== ayahNum) : [...prev, ayahNum]
    );
  };

  const filteredSurahs = SURAH_LIST.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.includes(searchQuery) ||
    s.urduNameTranslation.includes(searchQuery) ||
    String(s.number) === searchQuery.trim()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-[#2e7d32]" />
            <span>The Holy Quran</span>
            <span className="text-lg text-[#2e7d32] font-arabic">القرآن الكريم</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete 114 Surahs with Mishary Rashid Alafasy recitation, Urdu &amp; English translations
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="quran-surah-search-input"
            type="text"
            placeholder="Search Surah by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2e7d32]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Surah List Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-sm">
            <div className="px-2 py-1.5 flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-100 mb-2">
              <span>All 114 Surahs</span>
              <span className="text-[#2e7d32] font-arabic text-sm">سور القرآن</span>
            </div>

            <div className="max-h-[600px] overflow-y-auto space-y-1.5 pr-1">
              {filteredSurahs.map((surah) => {
                const isSelected = selectedSurah.number === surah.number;
                return (
                  <button
                    key={surah.number}
                    id={`surah-item-${surah.number}`}
                    onClick={() => setSelectedSurah(surah)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#e8f5e9] border border-[#2e7d32] text-[#2e7d32] font-bold shadow-xs'
                        : 'bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-[#2e7d32] text-white' : 'bg-white text-slate-600 border border-slate-200'
                      }`}>
                        {surah.number}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                          <span>{surah.englishName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-[#2e7d32] font-medium">
                            {surah.revelationType}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {surah.englishNameTranslation}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-arabic font-bold text-[#1b5e20] block">
                        {surah.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-urdu block -mt-1">
                        {surah.numberOfAyahs} آیات
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Surah Reader & Audio (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Surah Header Banner */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm text-center relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="text-left">
                <span className="text-xs font-bold text-[#2e7d32] uppercase tracking-wider block">
                  Surah {selectedSurah.number} • {selectedSurah.revelationType}
                </span>
                <h2 className="text-2xl font-black text-[#111827]">
                  {selectedSurah.englishName}{" "}
                  <span className="text-[#1b5e20] font-arabic font-bold ml-2">
                    {selectedSurah.name}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-urdu mt-0.5">
                  {selectedSurah.urduNameTranslation} • {selectedSurah.numberOfAyahs} آیات
                </p>
              </div>

              {/* Player Controls */}
              <div className="flex items-center space-x-2">
                <button
                  id="quran-play-all-btn"
                  onClick={playFullSurah}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border transition-all cursor-pointer ${
                    isPlayingFullSurah
                      ? 'bg-[#2e7d32] text-white border-[#2e7d32]'
                      : 'bg-emerald-50 text-[#2e7d32] border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  {isPlayingFullSurah ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingFullSurah ? 'Pause Surah' : 'Play Full Surah (Alafasy)'}</span>
                </button>
              </div>
            </div>

            {/* Font Size & Display Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <Sliders className="w-3.5 h-3.5 text-[#2e7d32]" />
                <span className="font-semibold">Arabic Size:</span>
                <button 
                  onClick={() => setArabicFontSize(s => Math.max(20, s - 2))} 
                  className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 font-bold hover:bg-slate-200"
                >
                  A-
                </button>
                <span className="font-mono text-[#2e7d32] font-bold">{arabicFontSize}px</span>
                <button 
                  onClick={() => setArabicFontSize(s => Math.min(42, s + 2))} 
                  className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 font-bold hover:bg-slate-200"
                >
                  A+
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowUrdu(!showUrdu)}
                  className={`px-3 py-1 rounded-lg border text-xs font-urdu transition-colors ${
                    showUrdu ? 'bg-emerald-50 text-[#2e7d32] border-emerald-300 font-bold' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  اردو ترجمہ {showUrdu ? '✓' : ''}
                </button>
                <button
                  onClick={() => setShowEnglish(!showEnglish)}
                  className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                    showEnglish ? 'bg-emerald-50 text-[#2e7d32] border-emerald-300 font-bold' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  English {showEnglish ? '✓' : ''}
                </button>
              </div>
            </div>

            {/* Bismillah */}
            {selectedSurah.number !== 9 && (
              <div className="py-4 my-3 border-y border-slate-100">
                <p className="text-2xl sm:text-3xl font-arabic text-[#1b5e20]">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-xs text-slate-500 font-urdu mt-1">
                  شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے
                </p>
              </div>
            )}
          </div>

          {/* Ayahs Container */}
          {loadingAyahs ? (
            <div className="p-12 text-center text-slate-500 space-y-3 bg-white rounded-3xl border border-slate-100">
              <RefreshCw className="w-8 h-8 text-[#2e7d32] animate-spin mx-auto" />
              <p className="text-sm font-semibold">Loading authentic Ayahs and recitations...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ayahs.map((ayah) => {
                const isPlaying = currentPlayingAyah === ayah.numberInSurah;
                const isBookmarked = bookmarkedAyahs.includes(ayah.numberInSurah);

                return (
                  <motion.div
                    key={ayah.numberInSurah}
                    id={`ayah-card-${ayah.numberInSurah}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-6 border transition-all duration-200 ${
                      isPlaying
                        ? 'bg-[#f0f9f3] border-[#2e7d32] shadow-md'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {/* Top bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 text-[#2e7d32] text-xs font-bold flex items-center justify-center">
                          {ayah.numberInSurah}
                        </div>
                        <span className="text-xs text-slate-400">
                          Ayah {ayah.numberInSurah} of {selectedSurah.numberOfAyahs}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => playAyahAudio(ayah.numberInSurah, ayah.audioUrl)}
                          className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                            isPlaying
                              ? 'bg-[#2e7d32] text-white border-[#2e7d32]'
                              : 'bg-slate-50 text-[#2e7d32] border-slate-200 hover:bg-emerald-50'
                          }`}
                          title="Listen Ayah"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => copyAyahText(ayah)}
                          className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-200 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
                          title="Copy Ayah & Translation"
                        >
                          {copiedAyah === ayah.numberInSurah ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => toggleBookmark(ayah.numberInSurah)}
                          className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                            isBookmarked
                              ? 'bg-amber-100 text-amber-700 border-amber-300'
                              : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-600'
                          }`}
                          title="Bookmark Ayah"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Arabic Verse */}
                    <div className="py-4 text-right">
                      <p 
                        style={{ fontSize: `${arabicFontSize}px` }} 
                        className={`font-arabic leading-loose tracking-wide ${
                          isPlaying ? 'text-[#1b5e20] font-bold' : 'text-slate-900'
                        }`}
                      >
                        {ayah.text}{" "}
                        <span className="inline-flex items-center justify-center text-xs font-sans text-[#2e7d32] border border-[#2e7d32]/40 rounded-full w-6 h-6 ml-2 align-middle">
                          ۝{ayah.numberInSurah}
                        </span>
                      </p>
                    </div>

                    {/* Urdu Translation */}
                    {showUrdu && (
                      <div className="pt-3 border-t border-slate-100 text-right">
                        <p className="text-sm font-urdu text-[#2e7d32] leading-relaxed">
                          {ayah.translationUr}
                        </p>
                      </div>
                    )}

                    {/* English Translation */}
                    {showEnglish && (
                      <div className="pt-2 border-t border-slate-100 text-left">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {ayah.translationEn}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
