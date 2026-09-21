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

export interface NasaiHadith {
  id: string;
  number: number;
  arabic: string;
  urdu: string;
}

// Global in-memory cache to prevent re-fetching
let globalNasaiCache: NasaiHadith[] | null = null;

const FALLBACK_HADITHS: NasaiHadith[] = [
  {
    id: "nasai_5003",
    number: 5003,
    arabic: "مَنْ صَلَّى عَلَىَّ صَلاَةً وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرَ صَلَوَاتٍ وَحَطَّ عَنْهُ عَشْرَ خَطِيئَاتٍ وَرَفَعَ لَهُ عَشْرَ دَرَجَاتٍ",
    urdu: "جس نے مجھ پر ایک مرتبہ درود بھیجا، اللہ تعالیٰ اس پر دس رحمتیں نازل فرمائے گا، اس کے دس گناہ معاف فرمائے گا اور اس کے دس درجات بلند فرمائے گا۔"
  },
  {
    id: "nasai_2222",
    number: 2222,
    arabic: "عَلَيْكَ بِالصَّوْمِ فَإِنَّهُ لاَ عِدْلَ لَهُ",
    urdu: "تم روزے کو لازم پکڑو کیونکہ اس کی برابری کا کوئی دوسرا عمل نہیں ہے۔"
  },
  {
    id: "nasai_1",
    number: 1,
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    urdu: "اعمال کا دارومدار نیتوں پر ہے، اور ہر انسان کو وہی ملے گا جس کی اس نے نیت کی۔"
  },
  {
    id: "nasai_505",
    number: 505,
    arabic: "الصَّلاَةُ عِمَادُ الدِّينِ",
    urdu: "نماز دین کا ستون ہے۔"
  }
];

const API_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-nasai.json";
const ARABIC_API_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nasai.json";

export const SunanNasaiReader: React.FC = () => {
  const [allHadiths, setAllHadiths] = useState<NasaiHadith[]>(globalNasaiCache || FALLBACK_HADITHS);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);
  const [activeView, setActiveView] = useState<'all' | 'bookmarks'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(!globalNasaiCache);
  const [statusMessage, setStatusMessage] = useState<string>(
    globalNasaiCache ? 'سنن نسائی کی تمام احادیث کامیابی سے لوڈ ہو گئیں!' : 'سنن نسائی کا ڈیٹا بیس لوڈ ہو رہا ہے...'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("nasai_bookmarks");
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (e) {
      console.error("Error reading bookmarks", e);
    }
  }, []);

  useEffect(() => {
    if (globalNasaiCache) {
      setAllHadiths(globalNasaiCache);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchNasai() {
      setIsLoading(true);
      setStatusMessage("سنن نسائی کا ڈیٹا بیس لوڈ ہو رہا ہے...");

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

        const mappedHadiths: NasaiHadith[] = urduData.hadiths.map((h: any, index: number) => {
          const num = h.hadithnumber || (index + 1);
          const arabic = araMap.get(num) || (araData?.hadiths?.[index]?.text) || "النص العربي غير متوفر";
          return {
            id: `nasai_${num}`,
            number: num,
            urdu: h.text || "",
            arabic: arabic
          };
        });

        globalNasaiCache = mappedHadiths;

        if (isMounted) {
          setAllHadiths(mappedHadiths);
          setIsLoading(false);
          setStatusMessage(`سنن نسائی کی تمام احادیث (${mappedHadiths.length.toLocaleString()}) کامیابی سے لوڈ ہو گئیں!`);
        }
      } catch (error) {
        console.error("API Fetch Error:", error);
        if (isMounted) {
          setIsLoading(false);
          setStatusMessage("ڈیٹا لوڈ کرنے میں دشواری۔ آف لائن محفوظ شدہ احادیث دکھائی جا رہی ہیں۔");
        }
      }
    }

    fetchNasai();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter hadiths by search and view mode
  const displayedHadiths = useMemo(() => {
    const listToFilter = activeView === 'bookmarks'
      ? allHadiths.filter(h => bookmarks.includes(h.id))
      : allHadiths;

    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return listToFilter;

    return listToFilter.filter(h =>
      h.number.toString().includes(trimmedQuery) ||
      h.urdu.toLowerCase().includes(trimmedQuery) ||
      h.arabic.includes(trimmedQuery)
    );
  }, [allHadiths, bookmarks, activeView, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(displayedHadiths.length / pageSize));

  // Slice for current page
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayedHadiths.slice(start, start + pageSize);
  }, [displayedHadiths, currentPage, pageSize]);

  const toggleBookmark = (id: string) => {
    let updated: string[];
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(bId => bId !== id);
    } else {
      updated = [...bookmarks, id];
    }
    setBookmarks(updated);
    try {
      localStorage.setItem("nasai_bookmarks", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving bookmark", e);
    }
  };

  const handleCopy = (hadith: NasaiHadith) => {
    const textToCopy = `سنن نسائی - حدیث #${hadith.number}\n\n${hadith.arabic}\n\nاردو ترجمہ:\n${hadith.urdu}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(hadith.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const changePage = (direction: number) => {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const jumpToPage = (targetPage: number) => {
    const p = Math.max(1, Math.min(totalPages, targetPage));
    setCurrentPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      ref={topRef}
      className={`rounded-3xl border transition-colors overflow-hidden ${
        isDarkMode 
          ? 'bg-slate-950 text-slate-100 border-emerald-500/20' 
          : 'bg-slate-50 text-slate-900 border-slate-200'
      }`}
      dir="rtl"
    >
      {/* Header Banner */}
      <header className={`py-8 text-center px-4 relative overflow-hidden border-b ${
        isDarkMode 
          ? 'bg-slate-900 border-emerald-500/20' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 pointer-events-none"></div>
        
        {/* Theme Toggle Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-750' 
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
            title={isDarkMode ? "لائٹ موڈ آن کریں" : "ڈارک موڈ آن کریں"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span className="hidden sm:inline text-xs font-sans">
              {isDarkMode ? "لائٹ موڈ" : "ڈارک موڈ"}
            </span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-emerald-400 mb-2 font-arabic">
          سنن نسائی - کامل مجموعہ
        </h1>
        <p className={`text-xs sm:text-sm md:text-base font-urdu max-w-2xl mx-auto ${
          isDarkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          امام احمد بن شعیب نسائیؒ کی سنن کا مکمل مجموعہ اصل عربی متن اور با محاورہ اردو ترجمہ کے ساتھ
        </p>

        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-sans px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>5,758 احادیث مبارکہ کا ذخیرہ</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-sans px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
            <span>صحاح ستہ کی مستند کتاب</span>
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
        {/* Controls Bar */}
        <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 justify-between items-center ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="حدیث نمبر یا متن تلاش کریں (مثلاً: 5003، درود، روزہ)..." 
              className={`w-full rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none transition-colors ${
                isDarkMode 
                  ? 'bg-slate-950 text-slate-100 border border-slate-700 focus:border-emerald-500 placeholder:text-slate-500' 
                  : 'bg-slate-50 text-slate-900 border border-slate-300 focus:border-emerald-600 placeholder:text-slate-400'
              }`}
            />
            <span className="absolute right-3 top-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-slate-200 px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation & Bookmarks Filter */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
            <button 
              onClick={() => { setActiveView('all'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                activeView === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              تمام احادیث ({allHadiths.length.toLocaleString()})
            </button>
            
            <button 
              onClick={() => { setActiveView('bookmarks'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                activeView === 'bookmarks'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-950 text-amber-400 border-amber-500/30 hover:bg-slate-900'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${activeView === 'bookmarks' ? 'fill-white' : 'fill-amber-400'}`} />
              <span>محفوظ شدہ</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                activeView === 'bookmarks'
                  ? 'bg-amber-800 text-amber-100 border-amber-700'
                  : isDarkMode
                    ? 'bg-amber-950 text-amber-300 border-amber-800/40'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {bookmarks.length}
              </span>
            </button>
          </div>
        </div>

        {/* Status / Info Bar */}
        <div className={`flex flex-wrap items-center justify-between gap-2 text-xs px-2 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />}
            <span id="statusMessage">{statusMessage}</span>
          </div>
          <span className="font-mono">
            ظاہر شدہ: <strong className={isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}>
              {displayedHadiths.length.toLocaleString()}
            </strong>
          </span>
        </div>

        {/* Hadith Cards Grid */}
        <div className="grid grid-cols-1 gap-5">
          {isLoading && allHadiths.length === 0 ? (
            <div className={`animate-pulse rounded-2xl p-6 border space-y-4 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="h-4 bg-slate-700/40 rounded w-1/4"></div>
              <div className="h-8 bg-slate-700/30 rounded w-full"></div>
              <div className="h-6 bg-slate-700/30 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700/20 rounded w-1/2"></div>
            </div>
          ) : displayedHadiths.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border p-6 space-y-3 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <BookOpen className="w-10 h-10 text-slate-500 mx-auto opacity-50" />
              <p className="text-base font-semibold">کوئی حدیث نہیں ملی۔</p>
              <p className="text-xs text-slate-400">
                {activeView === 'bookmarks'
                  ? 'آپ نے ابھی تک سنن نسائی کی کوئی حدیث محفوظ نہیں کی۔'
                  : 'براہِ کرم حدیث نمبر یا دوسرا لفظ تلاش کریں۔'}
              </p>
              {activeView === 'bookmarks' && (
                <button
                  onClick={() => setActiveView('all')}
                  className="mt-2 text-xs text-emerald-400 hover:underline cursor-pointer"
                >
                  تمام احادیث کی فہرست پر جائیں
                </button>
              )}
            </div>
          ) : (
            pageItems.map((hadith) => {
              const isBookmarked = bookmarks.includes(hadith.id);
              const isCopied = copiedId === hadith.id;

              return (
                <motion.div
                  key={hadith.id}
                  id={`hadith-card-${hadith.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl p-5 sm:p-6 border transition-all relative space-y-4 shadow-sm ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-800/80 hover:border-emerald-500/40 hover:shadow-emerald-950/20' 
                      : 'bg-white border-slate-200/90 hover:border-emerald-500/40 hover:shadow-md'
                  }`}
                >
                  {/* Card Header */}
                  <div className={`flex justify-between items-center pb-3 border-b text-xs ${
                    isDarkMode ? 'border-slate-800/60' : 'border-slate-100'
                  }`}>
                    <span className={`px-3 py-1 rounded-lg border font-mono font-bold text-xs ${
                      isDarkMode 
                        ? 'bg-slate-950 text-emerald-400 border-slate-800' 
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      سنن نسائی - حدیث #{hadith.number}
                    </span>
                    <span className={`text-xs font-urdu ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      سنن النسائي الصغرى (المجتبى)
                    </span>
                  </div>

                  {/* Arabic Text */}
                  <div className="text-right py-1">
                    <p className={`text-lg sm:text-xl md:text-2xl leading-loose font-arabic dir-rtl ${
                      isDarkMode ? 'text-amber-200/95' : 'text-[#1b5e20]'
                    }`}>
                      {hadith.arabic}
                    </p>
                  </div>

                  {/* Urdu Translation */}
                  <div className={`border-t pt-3 text-right ${
                    isDarkMode ? 'border-slate-800/60' : 'border-slate-100'
                  }`}>
                    <p className={`text-base sm:text-lg leading-relaxed font-urdu ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {hadith.urdu}
                    </p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className={`pt-3 border-t text-xs flex justify-between items-center ${
                    isDarkMode ? 'border-slate-800/60 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <button 
                      onClick={() => toggleBookmark(hadith.id)} 
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer px-2.5 py-1 rounded-lg ${
                        isBookmarked 
                          ? 'text-amber-400 font-bold bg-amber-400/10' 
                          : isDarkMode
                            ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                            : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                      }`}
                      title={isBookmarked ? "محفوظ شدہ فہرست سے ہٹائیں" : "محفوظ کریں"}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span>{isBookmarked ? '★ محفوظ شدہ' : '☆ محفوظ کریں'}</span>
                    </button>

                    <button 
                      onClick={() => handleCopy(hadith)} 
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : isDarkMode
                            ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-emerald-400 hover:border-emerald-500/50'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                      title="مکمل حدیث کاپی کریں"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>کاپی ہو گئی!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>کاپی کریں</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {displayedHadiths.length > pageSize && (
          <div className={`mt-8 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => changePage(-1)} 
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDarkMode 
                    ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
                <span>پچھلا صفحہ</span>
              </button>

              <button 
                onClick={() => changePage(1)} 
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDarkMode 
                    ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <span>اگلا صفحہ</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Jump and Indicator */}
            <div className="flex items-center gap-3 text-xs">
              <span className={`font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                صفحہ <strong className={isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}>{currentPage}</strong> از {totalPages}
              </span>

              {/* Quick Jump Buttons */}
              <div className="hidden md:flex items-center gap-1">
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => jumpToPage(1)}
                      className={`px-2 py-1 rounded-md text-xs font-mono border ${
                        isDarkMode ? 'bg-slate-950 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      1
                    </button>
                    <span className="px-1 text-slate-500">...</span>
                  </>
                )}
                {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
                  .filter(p => p >= 1 && p <= totalPages)
                  .map(p => (
                    <button
                      key={p}
                      onClick={() => jumpToPage(p)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-colors ${
                        p === currentPage
                          ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                          : isDarkMode
                            ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                {currentPage < totalPages - 2 && (
                  <>
                    <span className="px-1 text-slate-500">...</span>
                    <button
                      onClick={() => jumpToPage(totalPages)}
                      className={`px-2 py-1 rounded-md text-xs font-mono border ${
                        isDarkMode ? 'bg-slate-950 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
