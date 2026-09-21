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

export interface AbuDawudHadith {
  id: string;
  number: number;
  arabic: string;
  urdu: string;
}

// Global in-memory cache to prevent re-fetching
let globalAbuDawudCache: AbuDawudHadith[] | null = null;

const FALLBACK_HADITHS: AbuDawudHadith[] = [
  {
    id: "abudawood_1",
    number: 1,
    arabic: "كَانَ النَّبِيُّ صلى الله عليه وسلم إِذَا دَخَلَ الْخَلاَءَ قَالَ ‏'‏ اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ ‏'‏",
    urdu: "نبی کریم صلی اللہ علیہ وسلم جب بیت الخلاء میں داخل ہوتے تو یہ دعا پڑھتے: 'اے اللہ! میں ناپاک جنوں اور ناپاک جنیوں کے شر سے تیری پناہ مانگتا ہوں۔'"
  },
  {
    id: "abudawood_2",
    number: 2,
    arabic: "إِذَا أَرَادَ أَحَدُكُمْ أَنْ يَبُولَ فَلْيَرْتَدْ لِبَوْلِهِ مَوْضِعًا",
    urdu: "جب تم میں سے کوئی پیشاب کرنے کا ارادہ کرے تو پیشاب کے لیے نرم اور مناسب جگہ تلاش کرے۔"
  },
  {
    id: "abudawood_3",
    number: 3,
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    urdu: "اعمال کا دارومدار نیتوں پر ہے، اور ہر انسان کو وہی ملے گا جس کی اس نے نیت کی۔"
  },
  {
    id: "abudawood_4",
    number: 4,
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    urdu: "تم میں سے کوئی شخص اس وقت تک سچا مومن نہیں ہو سکتا جب تک کہ وہ اپنے بھائی کے لیے بھی وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔"
  }
];

const API_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-abudawud.json";
const ARABIC_API_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-abudawud.json";

export const SunanAbiDawudReader: React.FC = () => {
  const [allHadiths, setAllHadiths] = useState<AbuDawudHadith[]>(globalAbuDawudCache || FALLBACK_HADITHS);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);
  const [activeView, setActiveView] = useState<'all' | 'bookmarks'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(!globalAbuDawudCache);
  const [statusMessage, setStatusMessage] = useState<string>(
    globalAbuDawudCache ? 'سنن ابو داؤد کی تمام احادیث کامیابی سے لوڈ ہو گئیں!' : 'سنن ابو داؤد کا ڈیٹا بیس لوڈ ہو رہا ہے...'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("abudawood_bookmarks");
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (e) {
      console.error("Error reading bookmarks", e);
    }
  }, []);

  useEffect(() => {
    if (globalAbuDawudCache) {
      setAllHadiths(globalAbuDawudCache);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchAbuDawud() {
      setIsLoading(true);
      setStatusMessage("سنن ابو داؤد کا ڈیٹا بیس لوڈ ہو رہا ہے...");

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

        const mappedHadiths: AbuDawudHadith[] = urduData.hadiths.map((h: any, index: number) => {
          const num = h.hadithnumber || (index + 1);
          const arabic = araMap.get(num) || (araData?.hadiths?.[index]?.text) || "النص العربي غير متوفر";
          return {
            id: `abudawood_${num}`,
            number: num,
            urdu: h.text || "",
            arabic: arabic,
          };
        });

        if (isMounted) {
          globalAbuDawudCache = mappedHadiths;
          setAllHadiths(mappedHadiths);
          setIsLoading(false);
          setStatusMessage("سنن ابو داؤد کی تمام احادیث کامیابی سے لوڈ ہو گئیں!");
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

    fetchAbuDawud();

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
      localStorage.setItem("abudawood_bookmarks", JSON.stringify(updated));
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

  const handleCopy = (hadith: AbuDawudHadith) => {
    const text = `سنن ابو داؤد - حدیث #${hadith.number}\n\n${hadith.arabic}\n\n[ترجمہ]:\n${hadith.urdu}`;
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
            سنن ابو داؤد - کامل مجموعہ
          </h1>
          <p className={`text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-urdu leading-[2.5] pt-3 px-2 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            امام ابو داؤد سلیمان بن اشعث سجستانیؒ کی سنن کا مکمل سیٹ، عربی متن اور اردو ترجمہ کے ساتھ
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
              id="abudawood-search-input"
              type="text" 
              placeholder="حدیث نمبر یا متن تلاش کریں... (مثلاً: 1، طہارت، نیت)" 
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
              id="btnAllHadithAbuDawud"
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
              id="btnBookmarksAbuDawud"
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
            <span id="statusMessageAbuDawud">{statusMessage}</span>
          </div>
          <span id="hadithCountAbuDawud" className="font-mono font-semibold">
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
          <div id="hadithContainerAbuDawud" className="grid grid-cols-1 gap-6">
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
                      سنن ابو داؤد - حدیث #{h.number}
                    </span>
                    <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>
                      سنن أبي داود • الإمام أبو داود السجستاني
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
          <div id="paginationAbuDawud" className="mt-8 flex flex-wrap justify-center items-center gap-3 pt-4">
            <button 
              id="btnPrevAbuDawud"
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

            <span id="pageIndicatorAbuDawud" className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${
              isDarkMode 
                ? 'bg-slate-900 text-slate-300 border-slate-800' 
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              صفحہ {safePage} از {totalPages}
            </span>

            <button 
              id="btnNextAbuDawud"
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
