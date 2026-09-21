import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Bookmark, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Loader2,
  Sun,
  Moon
} from 'lucide-react';

export interface TirmidhiHadith {
  id: string;
  number: number;
  arabic: string;
  urdu: string;
}

// Global in-memory cache to prevent re-fetching
let globalTirmidhiCache: TirmidhiHadith[] | null = null;

const FALLBACK_HADITHS: TirmidhiHadith[] = [
  {
    id: "tirmidhi_1",
    number: 1,
    arabic: "لاَ تُقْبَلُ صَلاَةٌ بِغَيْرِ طُهُورٍ وَلاَ صَدَقَةٌ مِنْ غُلُولٍ",
    urdu: "بغیر طہارت (پاکیزگی) کے کوئی نماز قبول نہیں ہوتی اور نہ حرام مال سے کوئی صدقہ قبول ہوتا ہے۔"
  },
  {
    id: "tirmidhi_2",
    number: 2,
    arabic: "مِفْتَاحُ الصَّلاَةِ الطُّهُورُ وَتَحْرِيمُهَا التَّكْبِيرُ وَتَحْلِيلُهَا التَّسْلِيمُ",
    urdu: "نماز کی چابی پاکی ہے، اور اس کی تحریم (شروع کرنا) تکبیر ہے، اور اس کی تحلیل (ختم کرنا) سلام پھیرنا ہے۔"
  },
  {
    id: "tirmidhi_3",
    number: 3,
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    urdu: "تم میں سب سے بہتر وہ شخص ہے جو قرآن سیکھے اور دوسروں کو سکھائے۔"
  },
  {
    id: "tirmidhi_4",
    number: 4,
    arabic: "مَنْ صَلَّى عَلَيَّ صَلاَةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا",
    urdu: "جو شخص مجھ پر ایک مرتبہ درود بھیجے گا، اللہ تعالیٰ اس پر دس رحمتیں نازل فرمائے گا۔"
  }
];

const API_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-tirmidhi.json";
const ARABIC_API_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-tirmidhi.json";

export const JamiTirmidhiReader: React.FC = () => {
  const [allHadiths, setAllHadiths] = useState<TirmidhiHadith[]>(globalTirmidhiCache || FALLBACK_HADITHS);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);
  const [activeView, setActiveView] = useState<'all' | 'bookmarks'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(!globalTirmidhiCache);
  const [statusMessage, setStatusMessage] = useState<string>(
    globalTirmidhiCache ? 'جامع ترمذی کی تمام احادیث کامیابی سے لوڈ ہو گئیں!' : 'جامع ترمذی کا ڈیٹا بیس لوڈ ہو رہا ہے...'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("tirmidhi_bookmarks");
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (e) {
      console.error("Error reading bookmarks", e);
    }
  }, []);

  useEffect(() => {
    if (globalTirmidhiCache) {
      setAllHadiths(globalTirmidhiCache);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchTirmidhi() {
      setIsLoading(true);
      setStatusMessage("جامع ترمذی کا ڈیٹا بیس لوڈ ہو رہا ہے...");

      try {
        const [resUrdu, resAra] = await Promise.all([
          fetch(API_URL),
          fetch(ARABIC_API_URL)
        ]);

        if (!resUrdu.ok) throw new Error(`Urdu API error status ${resUrdu.status}`);
        
        const urduData = await resUrdu.json();
        const araData = resAra.ok ? await resAra.json() : null;

        const araMap = new Map<number, string>();
        if (araData && Array.isArray(araData.hadiths)) {
          araData.hadiths.forEach((h: any) => {
            if (h && h.hadithnumber) {
              araMap.set(h.hadithnumber, h.text);
            }
          });
        }

        const mappedHadiths: TirmidhiHadith[] = urduData.hadiths.map((h: any, index: number) => {
          const num = h.hadithnumber || (index + 1);
          const arabic = araMap.get(num) || (araData?.hadiths?.[index]?.text) || "النص العربي غير متوفر";
          return {
            id: `tirmidhi_${num}`,
            number: num,
            urdu: h.text || "",
            arabic: arabic,
          };
        });

        if (isMounted) {
          globalTirmidhiCache = mappedHadiths;
          setAllHadiths(mappedHadiths);
          setIsLoading(false);
          setStatusMessage("جامع ترمذی کی تمام احادیث کامیابی سے لوڈ ہو گئیں!");
        }
      } catch (error) {
        console.error("API Fetch Error:", error);
        if (isMounted) {
          setAllHadiths(FALLBACK_HADITHS);
          setIsLoading(false);
          setStatusMessage("ڈیٹا لوڈ کرنے میں دشواری۔ لوکل نمونہ احادیث دکھائی جا رہی ہیں۔");
        }
      }
    }

    fetchTirmidhi();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleBookmark = (id: string) => {
    let updated: string[];
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(bId => bId !== id);
    } else {
      updated = [...bookmarks, id];
    }
    setBookmarks(updated);
    try {
      localStorage.setItem("tirmidhi_bookmarks", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save bookmarks", e);
    }
  };

  const displayedHadiths = useMemo(() => {
    let baseList = activeView === 'bookmarks'
      ? allHadiths.filter(h => bookmarks.includes(h.id))
      : allHadiths;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return baseList;

    return baseList.filter(h => 
      h.number.toString().includes(query) || 
      h.urdu.toLowerCase().includes(query) || 
      h.arabic.includes(query)
    );
  }, [allHadiths, activeView, bookmarks, searchQuery]);

  const totalItems = displayedHadiths.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedHadiths = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return displayedHadiths.slice(startIndex, startIndex + pageSize);
  }, [displayedHadiths, safePage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopy = (hadith: TirmidhiHadith) => {
    const text = `جامع ترمذی - حدیث #${hadith.number}\n\n${hadith.arabic}\n\n[ترجمہ]:\n${hadith.urdu}`;
    navigator.clipboard.writeText(text);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div 
      dir="rtl"
      ref={topRef}
      className={`rounded-3xl transition-colors duration-300 overflow-hidden font-urdu ${
        isDarkMode 
          ? 'bg-slate-950 text-slate-100 border border-slate-800' 
          : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
      }`}
    >
      {/* Header Banner */}
      <header className={`py-10 sm:py-12 text-center px-4 relative overflow-hidden ${
        isDarkMode 
          ? 'bg-slate-900 border-b border-emerald-500/20' 
          : 'bg-gradient-to-r from-[#edf7f0] via-[#f3faf5] to-white border-b border-emerald-200'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
        
        {/* Theme Switcher Button */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700' 
                : 'bg-white hover:bg-emerald-50 text-slate-700 border-emerald-300'
            }`}
            title="تھیم تبدیل کریں (Dark / Light Theme)"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDarkMode ? 'لائٹ موڈ' : 'ڈارک موڈ'}</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 pt-2">
          <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black font-urdu leading-[2.6] sm:leading-[2.8] pb-3 ${
            isDarkMode ? 'text-emerald-400' : 'text-[#1b5e20]'
          }`}>
            جامع ترمذی - کامل مجموعہ
          </h1>
          <p className={`text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-urdu leading-[2.5] pt-3 px-2 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            امام ابو عیسیٰ محمد بن عیسیٰ ترمذیؒ کی سنن کا مکمل سیٹ، عربی متن اور اردو ترجمہ کے ساتھ
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Controls Bar (Search, Navigation, Bookmarks) */}
        <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 justify-between items-center ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input 
              id="tirmidhi-search-input"
              type="text" 
              placeholder="حدیث نمبر یا متن تلاش کریں... (مثلاً: 1، نماز، درود)" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full rounded-xl pl-4 pr-10 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors ${
                isDarkMode 
                  ? 'bg-slate-950 text-slate-200 border border-slate-700 focus:border-emerald-500 placeholder-slate-500' 
                  : 'bg-white text-slate-800 border border-slate-300 focus:border-[#2e7d32] placeholder-slate-400 shadow-2xs'
              }`}
            />
            <Search className={`w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-rose-500 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation & Bookmarks Filter Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button 
              id="btnAllHadithTirmidhi"
              onClick={() => {
                setActiveView('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeView === 'all'
                  ? isDarkMode 
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs' 
                    : 'bg-[#2e7d32] text-white border-[#2e7d32] shadow-xs'
                  : isDarkMode 
                    ? 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              تمام احادیث ({allHadiths.length.toLocaleString()})
            </button>
            
            <button 
              id="btnBookmarksTirmidhi"
              onClick={() => {
                setActiveView('bookmarks');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                activeView === 'bookmarks'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-950 text-amber-400 border-amber-500/30 hover:bg-slate-800'
                    : 'bg-white text-amber-600 border-amber-300 hover:bg-amber-50'
              }`}
            >
              <span>⭐ محفوظ شدہ</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono border ${
                activeView === 'bookmarks'
                  ? 'bg-amber-800 text-white border-amber-700'
                  : isDarkMode
                    ? 'bg-amber-950 text-amber-300 border-amber-800/40'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {bookmarks.length}
              </span>
            </button>
          </div>
        </div>

        {/* Status / Info Bar */}
        <div className={`flex flex-wrap justify-between items-center text-xs px-2 gap-2 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <div className="flex items-center space-x-2 space-x-reverse">
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />}
            <span id="statusMessageTirmidhi">{statusMessage}</span>
          </div>
          <span id="hadithCountTirmidhi" className="font-mono font-semibold">
            ظاہر شدہ: {totalItems.toLocaleString()} | صفحہ {safePage} از {totalPages}
          </span>
        </div>

        {/* Hadiths Container */}
        {isLoading && allHadiths.length <= 5 ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((n) => (
              <div 
                key={n} 
                className={`animate-pulse rounded-2xl p-6 border ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`h-4 rounded w-1/4 mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                <div className={`h-6 rounded w-3/4 mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                <div className={`h-4 rounded w-1/2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
              </div>
            ))}
          </div>
        ) : paginatedHadiths.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold">کوئی حدیث نہیں ملی۔</p>
            <p className="text-xs mt-1 opacity-80">براہ کرم کوئی دوسرا حدیث نمبر یا لفظ تلاش کریں۔</p>
          </div>
        ) : (
          <div id="hadithContainerTirmidhi" className="grid grid-cols-1 gap-6">
            {paginatedHadiths.map((h) => {
              const isBookmarked = bookmarks.includes(h.id);
              const isCopied = copiedId === h.id;

              return (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl p-6 border transition-all shadow-md relative ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-800/80 hover:border-emerald-500/40' 
                      : 'bg-white border-slate-200/90 hover:border-[#2e7d32]/50'
                  }`}
                >
                  {/* Card Header */}
                  <div className={`flex justify-between items-center mb-4 pb-3 border-b text-xs ${
                    isDarkMode ? 'border-slate-800/60' : 'border-slate-100'
                  }`}>
                    <span className={`px-3 py-1 rounded-lg border font-mono font-bold ${
                      isDarkMode 
                        ? 'bg-slate-950 text-emerald-400 border-slate-800' 
                        : 'bg-emerald-50 text-[#2e7d32] border-emerald-200'
                    }`}>
                      جامع ترمذی - حدیث #{h.number}
                    </span>
                    <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>
                      سنن الترمذي • الإمام أبو عيسى الترمذي
                    </span>
                  </div>

                  {/* Arabic Text */}
                  <p className={`text-right text-lg md:text-xl leading-[2.4] mb-5 font-arabic dir-rtl ${
                    isDarkMode ? 'text-amber-200/90' : 'text-[#1b5e20]'
                  }`}>
                    {h.arabic}
                  </p>

                  {/* Urdu Translation */}
                  <p className={`text-right text-base md:text-lg leading-[2.5] mb-5 pt-3 border-t font-urdu ${
                    isDarkMode ? 'text-slate-300 border-slate-800/60' : 'text-slate-700 border-slate-100'
                  }`}>
                    {h.urdu}
                  </p>

                  {/* Action Buttons */}
                  <div className={`pt-3 border-t text-xs flex justify-between items-center ${
                    isDarkMode ? 'border-slate-800/60 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <button 
                      onClick={() => toggleBookmark(h.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer font-bold ${
                        isBookmarked 
                          ? 'text-amber-400' 
                          : isDarkMode 
                            ? 'text-slate-400 hover:text-amber-400' 
                            : 'text-slate-500 hover:text-amber-600'
                      }`}
                      title={isBookmarked ? 'محفوظ فہرست سے ہٹائیں' : 'بک مارک کریں'}
                    >
                      <span>{isBookmarked ? '★ محفوظ شدہ' : '☆ محفوظ کریں'}</span>
                    </button>

                    <button 
                      onClick={() => handleCopy(h)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer font-bold ${
                        isCopied 
                          ? 'text-emerald-500' 
                          : isDarkMode 
                            ? 'text-slate-400 hover:text-emerald-400' 
                            : 'text-slate-500 hover:text-[#2e7d32]'
                      }`}
                      title="حدیث اور ترجمہ کاپی کریں"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'کاپی ہو گیا!' : '📋 کاپی کریں'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div id="paginationTirmidhi" className="mt-8 flex flex-wrap justify-center items-center gap-3 pt-4">
            <button 
              id="btnPrevTirmidhi"
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 ${
                isDarkMode 
                  ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span>پچھلا صفحہ</span>
            </button>

            <span id="pageIndicatorTirmidhi" className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${
              isDarkMode 
                ? 'bg-slate-900 text-slate-300 border-slate-800' 
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              صفحہ {safePage} از {totalPages}
            </span>

            <button 
              id="btnNextTirmidhi"
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 ${
                isDarkMode 
                  ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span>اگلا صفحہ</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
