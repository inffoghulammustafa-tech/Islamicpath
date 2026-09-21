import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  BookmarkCheck, 
  Search, 
  Copy, 
  Check, 
  BookOpen, 
  Filter, 
  Award,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  ExternalLink
} from 'lucide-react';
import { HADITH_BOOKS, HADITH_COLLECTION } from '../data/hadithData';
import { HadithItem } from '../types';
import { SahihBukhariReader } from './SahihBukhariReader';
import { SahihMuslimReader } from './SahihMuslimReader';
import { JamiTirmidhiReader } from './JamiTirmidhiReader';
import { SunanAbiDawudReader } from './SunanAbiDawudReader';
import { SunanNasaiReader } from './SunanNasaiReader';
import { HadithNawawiReader } from './HadithNawawiReader';

export const HadithSection: React.FC = () => {
  const [selectedBookId, setSelectedBookId] = useState<string>('all');
  const [bukhariViewMode, setBukhariViewMode] = useState<'complete' | 'curated'>('complete');
  const [muslimViewMode, setMuslimViewMode] = useState<'complete' | 'curated'>('complete');
  const [tirmidhiViewMode, setTirmidhiViewMode] = useState<'complete' | 'curated'>('complete');
  const [abudawudViewMode, setAbudawudViewMode] = useState<'complete' | 'curated'>('complete');
  const [nasaiViewMode, setNasaiViewMode] = useState<'complete' | 'curated'>('complete');
  const [nawawiViewMode, setNawawiViewMode] = useState<'complete' | 'curated'>('complete');
  const [isTabsWrapped, setIsTabsWrapped] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      tabsRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const categories = [
    "All",
    "Iman & Intention",
    "Akhlaq & Brotherhood",
    "Parents & Family",
    "Salah & Dhikr",
    "Charity & Kindness",
    "Knowledge",
  ];

  const handleCopy = (item: HadithItem) => {
    const text = `${item.arabicText}\n\n[Urdu]: ${item.translationUr}\n[English]: ${item.translationEn}\n\nReference: ${item.bookName} #${item.hadithNumber} (${item.grade}) - ${item.chapter}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHadiths = HADITH_COLLECTION.filter((h) => {
    const matchesBook = selectedBookId === 'all' || h.bookId === selectedBookId;
    const matchesCat = selectedCategory === 'All' || h.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      h.translationEn.toLowerCase().includes(q) ||
      h.translationUr.includes(q) ||
      h.arabicText.includes(q) ||
      h.chapter.toLowerCase().includes(q) ||
      String(h.hadithNumber) === q.trim();

    return matchesBook && matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] flex items-center space-x-3">
            <BookmarkCheck className="w-8 h-8 text-[#2e7d32]" />
            <span>Hadith Library</span>
            <span className="text-lg text-[#2e7d32] font-arabic">الحديث النبوي</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search authentic Sahih Hadith collections with Arabic text, Urdu &amp; English translations
          </p>
        </div>

        {/* Search for Curated / All */}
        {selectedBookId !== 'bukhari' && selectedBookId !== 'muslim' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="hadith-search-input"
              type="text"
              placeholder="Search by topic, keyword, or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2e7d32]"
            />
          </div>
        )}
      </div>

      {/* Book Tabs Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-[#2e7d32]" />
            <span>کتبِ احادیث (Hadith Collections):</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Wrap vs Horizontal Scroll */}
            <button
              onClick={() => setIsTabsWrapped(!isTabsWrapped)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-[#2e7d32] border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              title={isTabsWrapped ? "افقی سکرول میں دیکھیں" : "تمام کتب ایک ساتھ دیکھیں"}
            >
              {isTabsWrapped ? (
                <>
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">سکرول موڈ</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>تمام کتب دکھائیں</span>
                </>
              )}
            </button>

            {!isTabsWrapped && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollTabs('left')}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-[#2e7d32] transition-colors cursor-pointer shadow-2xs"
                  title="پیچھے سکرول کریں"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollTabs('right')}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-[#2e7d32] transition-colors cursor-pointer shadow-2xs"
                  title="آگے سکرول کریں"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          ref={tabsRef}
          className={`${
            isTabsWrapped
              ? 'flex flex-wrap gap-2'
              : 'flex items-center space-x-2 overflow-x-auto pb-2 scroll-smooth scrollbar-thin'
          }`}
        >
          <button
            onClick={() => setSelectedBookId('all')}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs whitespace-nowrap border transition-all cursor-pointer ${
              selectedBookId === 'all'
                ? 'bg-[#2e7d32] text-white border-[#2e7d32] font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
            }`}
          >
            All Collections ({HADITH_COLLECTION.length})
          </button>

          {HADITH_BOOKS.map((book) => {
            const isSelected = selectedBookId === book.id;
            const isBukhari = book.id === 'bukhari';
            const isMuslim = book.id === 'muslim';
            const isTirmidhi = book.id === 'tirmidhi';
            const isAbuDawud = book.id === 'abudawud';
            const isNasai = book.id === 'nasai';
            const isIbnMajah = book.id === 'ibnmajah';
            const isNawawi = book.id === 'nawawi40';

            return (
              <button
                key={book.id}
                id={`book-tab-${book.id}`}
                onClick={(e) => {
                  setSelectedBookId(book.id);
                  if (!isTabsWrapped) {
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }
                }}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs whitespace-nowrap border transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#2e7d32] text-white border-[#2e7d32] font-bold shadow-xs'
                    : isBukhari || isMuslim || isTirmidhi || isAbuDawud || isNasai || isNawawi
                      ? 'bg-emerald-50 text-[#1b5e20] border-emerald-300 hover:bg-emerald-100/70 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                }`}
              >
                <span>{book.nameEnglish}</span>
                <span className="text-[10px] font-urdu opacity-85">({book.nameUrdu})</span>
                {isBukhari && (
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-md font-mono">
                    7,563
                  </span>
                )}
                {isMuslim && (
                  <span className="text-[10px] bg-teal-600 text-white px-1.5 py-0.5 rounded-md font-mono">
                    7,500
                  </span>
                )}
                {isTirmidhi && (
                  <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.5 rounded-md font-mono">
                    3,956
                  </span>
                )}
                {isAbuDawud && (
                  <span className="text-[10px] bg-teal-700 text-white px-1.5 py-0.5 rounded-md font-mono">
                    5,274
                  </span>
                )}
                {isNasai && (
                  <span className="text-[10px] bg-emerald-800 text-white px-1.5 py-0.5 rounded-md font-mono">
                    5,758
                  </span>
                )}
                {isIbnMajah && (
                  <span className="text-[10px] bg-teal-800 text-white px-1.5 py-0.5 rounded-md font-mono">
                    4,341
                  </span>
                )}
                {isNawawi && (
                  <span className="text-[10px] bg-amber-700 text-white px-1.5 py-0.5 rounded-md font-mono">
                    42
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* When Sahih al-Bukhari is selected */}
      {selectedBookId === 'bukhari' ? (
        <div className="space-y-4">
          {/* Subview Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 font-urdu">صحیح بخاری موڈ:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setBukhariViewMode('complete')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    bukhariViewMode === 'complete'
                      ? 'bg-[#2e7d32] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  📖 کامل مجموعہ (7,563 احادیث - آن لائن ڈیٹا بیس)
                </button>
                <button
                  onClick={() => setBukhariViewMode('curated')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    bukhariViewMode === 'curated'
                      ? 'bg-[#2e7d32] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🌟 بنیادی منتخب احادیث
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedBookId('muslim');
                  setMuslimViewMode('complete');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>صحیح مسلم پر جائیں</span>
                <span className="text-[10px] font-mono bg-teal-200/70 px-1.5 py-0.5 rounded">7,500</span>
              </button>
              <button
                onClick={() => setSelectedBookId('all')}
                className="text-xs text-[#2e7d32] hover:underline font-semibold cursor-pointer"
              >
                ← تمام کتب پر واپس جائیں
              </button>
            </div>
          </div>

          {/* Render Full Bukhari Reader or Curated View */}
          {bukhariViewMode === 'complete' ? (
            <SahihBukhariReader />
          ) : (
            <div className="space-y-4">
              {filteredHadiths.map((hadith) => {
                const isCopied = copiedId === hadith.id;
                return (
                  <motion.div
                    key={hadith.id}
                    id={`hadith-card-${hadith.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-[#2e7d32]/50 hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#2e7d32] text-xs font-bold">
                          {hadith.bookName} #{hadith.hadithNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-[#2e7d32]" />
                          <span>{hadith.grade}</span>
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          • {hadith.chapter}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(hadith)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:text-[#2e7d32] hover:bg-emerald-50 text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                        title="Copy Hadith"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="text-right py-2">
                      <p className="text-xl sm:text-2xl font-arabic text-[#1b5e20] leading-loose">
                        {hadith.arabicText}
                      </p>
                    </div>

                    <div className="text-right border-t border-slate-100 pt-3">
                      <p className="text-base font-urdu text-[#2e7d32] leading-relaxed">
                        {hadith.translationUr}
                      </p>
                    </div>

                    <div className="text-left border-t border-slate-100 pt-3">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{hadith.translationEn}"
                      </p>
                    </div>

                    {hadith.narrator && (
                      <div className="text-xs text-slate-500 pt-2 flex items-center justify-between border-t border-slate-100">
                        <span>
                          Narrated by: <strong className="text-slate-800 font-bold">{hadith.narrator}</strong>
                        </span>
                        <span className="text-[11px] text-[#2e7d32] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                          {hadith.category}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : selectedBookId === 'muslim' ? (
        <div className="space-y-4">
          {/* Muslim Subview Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 font-urdu">صحیح مسلم موڈ:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMuslimViewMode('complete')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    muslimViewMode === 'complete'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  📖 کامل مجموعہ (7,500 احادیث - آن لائن ڈیٹا بیس)
                </button>
                <button
                  onClick={() => setMuslimViewMode('curated')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    muslimViewMode === 'curated'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🌟 بنیادی منتخب احادیث
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedBookId('bukhari');
                  setBukhariViewMode('complete');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>صحیح بخاری پر جائیں</span>
                <span className="text-[10px] font-mono bg-emerald-200/80 px-1.5 py-0.5 rounded">7,563</span>
              </button>
              <button
                onClick={() => setSelectedBookId('all')}
                className="text-xs text-[#2e7d32] hover:underline font-semibold cursor-pointer"
              >
                ← تمام کتب پر واپس جائیں
              </button>
            </div>
          </div>

          {/* Render Full Muslim Reader or Curated View */}
          {muslimViewMode === 'complete' ? (
            <SahihMuslimReader />
          ) : (
            <div className="space-y-4">
              {filteredHadiths.map((hadith) => {
                const isCopied = copiedId === hadith.id;
                return (
                  <motion.div
                    key={hadith.id}
                    id={`hadith-card-${hadith.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-teal-600/50 hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                          {hadith.bookName} #{hadith.hadithNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-teal-700" />
                          <span>{hadith.grade}</span>
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          • {hadith.chapter}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(hadith)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:text-teal-700 hover:bg-teal-50 text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                        title="Copy Hadith"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="text-right py-2">
                      <p className="text-xl sm:text-2xl font-arabic text-[#1b5e20] leading-loose">
                        {hadith.arabicText}
                      </p>
                    </div>

                    <div className="text-right border-t border-slate-100 pt-3">
                      <p className="text-base font-urdu text-[#2e7d32] leading-relaxed">
                        {hadith.translationUr}
                      </p>
                    </div>

                    <div className="text-left border-t border-slate-100 pt-3">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{hadith.translationEn}"
                      </p>
                    </div>

                    {hadith.narrator && (
                      <div className="text-xs text-slate-500 pt-2 flex items-center justify-between border-t border-slate-100">
                        <span>
                          Narrated by: <strong className="text-slate-800 font-bold">{hadith.narrator}</strong>
                        </span>
                        <span className="text-[11px] text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full font-semibold">
                          {hadith.category}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : selectedBookId === 'tirmidhi' ? (
        <div className="space-y-4">
          {/* Tirmidhi Subview Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 font-urdu">جامع ترمذی موڈ:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setTirmidhiViewMode('complete')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tirmidhiViewMode === 'complete'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  📖 کامل مجموعہ (3,956 احادیث - آن لائن ڈیٹا بیس)
                </button>
                <button
                  onClick={() => setTirmidhiViewMode('curated')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tirmidhiViewMode === 'curated'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🌟 بنیادی منتخب احادیث
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedBookId('abudawud');
                  setAbudawudViewMode('complete');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>سنن ابو داؤد</span>
                <span className="text-[10px] font-mono bg-teal-200/80 px-1.5 py-0.5 rounded">5,274</span>
              </button>
              <button
                onClick={() => setSelectedBookId('all')}
                className="text-xs text-[#2e7d32] hover:underline font-semibold cursor-pointer"
              >
                ← تمام کتب پر واپس جائیں
              </button>
            </div>
          </div>

          {/* Render Full Tirmidhi Reader or Curated View */}
          {tirmidhiViewMode === 'complete' ? (
            <JamiTirmidhiReader />
          ) : (
            <div className="space-y-4">
              {filteredHadiths.map((hadith) => {
                const isCopied = copiedId === hadith.id;
                return (
                  <motion.div
                    key={hadith.id}
                    id={`hadith-card-${hadith.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-emerald-600/50 hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                          {hadith.bookName} #{hadith.hadithNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{hadith.grade}</span>
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          • {hadith.chapter}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(hadith)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                        title="Copy Hadith"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="text-right py-2">
                      <p className="text-xl sm:text-2xl font-arabic text-[#1b5e20] leading-loose">
                        {hadith.arabicText}
                      </p>
                    </div>

                    <div className="text-right border-t border-slate-100 pt-3">
                      <p className="text-base font-urdu text-[#2e7d32] leading-relaxed">
                        {hadith.translationUr}
                      </p>
                    </div>

                    <div className="text-left border-t border-slate-100 pt-3">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{hadith.translationEn}"
                      </p>
                    </div>

                    {hadith.narrator && (
                      <div className="text-xs text-slate-500 pt-2 flex items-center justify-between border-t border-slate-100">
                        <span>
                          Narrated by: <strong className="text-slate-800 font-bold">{hadith.narrator}</strong>
                        </span>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                          {hadith.category}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : selectedBookId === 'abudawud' ? (
        <div className="space-y-4">
          {/* Abu Dawud Subview Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 font-urdu">سنن ابو داؤد موڈ:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setAbudawudViewMode('complete')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    abudawudViewMode === 'complete'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  📖 کامل مجموعہ (5,274 احادیث - آن لائن ڈیٹا بیس)
                </button>
                <button
                  onClick={() => setAbudawudViewMode('curated')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    abudawudViewMode === 'curated'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🌟 بنیادی منتخب احادیث
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedBookId('tirmidhi');
                  setTirmidhiViewMode('complete');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>جامع ترمذی</span>
                <span className="text-[10px] font-mono bg-emerald-200/80 px-1.5 py-0.5 rounded">3,956</span>
              </button>
              <button
                onClick={() => setSelectedBookId('all')}
                className="text-xs text-[#2e7d32] hover:underline font-semibold cursor-pointer"
              >
                ← تمام کتب پر واپس جائیں
              </button>
            </div>
          </div>

          {/* Render Full Abu Dawud Reader or Curated View */}
          {abudawudViewMode === 'complete' ? (
            <SunanAbiDawudReader />
          ) : (
            <div className="space-y-4">
              {filteredHadiths.map((hadith) => {
                const isCopied = copiedId === hadith.id;
                return (
                  <motion.div
                    key={hadith.id}
                    id={`hadith-card-${hadith.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-teal-600/50 hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                          {hadith.bookName} #{hadith.hadithNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-teal-700" />
                          <span>{hadith.grade}</span>
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          • {hadith.chapter}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(hadith)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:text-teal-700 hover:bg-teal-50 text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                        title="Copy Hadith"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="text-right py-2">
                      <p className="text-xl sm:text-2xl font-arabic text-[#1b5e20] leading-loose">
                        {hadith.arabicText}
                      </p>
                    </div>

                    <div className="text-right border-t border-slate-100 pt-3">
                      <p className="text-base font-urdu text-[#2e7d32] leading-relaxed">
                        {hadith.translationUr}
                      </p>
                    </div>

                    <div className="text-left border-t border-slate-100 pt-3">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{hadith.translationEn}"
                      </p>
                    </div>

                    {hadith.narrator && (
                      <div className="text-xs text-slate-500 pt-2 flex items-center justify-between border-t border-slate-100">
                        <span>
                          Narrated by: <strong className="text-slate-800 font-bold">{hadith.narrator}</strong>
                        </span>
                        <span className="text-[11px] text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full font-semibold">
                          {hadith.category}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : selectedBookId === 'nasai' ? (
        <div className="space-y-4">
          {/* Sunan an-Nasa'i Subview Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 font-urdu">سنن نسائی موڈ:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setNasaiViewMode('complete')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    nasaiViewMode === 'complete'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  📖 کامل مجموعہ (5,758 احادیث - آن لائن ڈیٹا بیس)
                </button>
                <button
                  onClick={() => setNasaiViewMode('curated')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    nasaiViewMode === 'curated'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🌟 بنیادی منتخب احادیث
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedBookId('abudawud');
                  setAbudawudViewMode('complete');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>سنن ابو داؤد</span>
                <span className="text-[10px] font-mono bg-teal-200/80 px-1.5 py-0.5 rounded">5,274</span>
              </button>
              <button
                onClick={() => {
                  setSelectedBookId('tirmidhi');
                  setTirmidhiViewMode('complete');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>جامع ترمذی</span>
                <span className="text-[10px] font-mono bg-emerald-200/80 px-1.5 py-0.5 rounded">3,956</span>
              </button>
              <button
                onClick={() => setSelectedBookId('all')}
                className="text-xs text-[#2e7d32] hover:underline font-semibold cursor-pointer"
              >
                ← تمام کتب پر واپس جائیں
              </button>
            </div>
          </div>

          {/* Render Full Nasai Reader or Curated View */}
          {nasaiViewMode === 'complete' ? (
            <SunanNasaiReader />
          ) : (
            <div className="space-y-4">
              {filteredHadiths.map((hadith) => {
                const isCopied = copiedId === hadith.id;
                return (
                  <motion.div
                    key={hadith.id}
                    id={`hadith-card-${hadith.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-emerald-600/50 hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                          {hadith.bookName} #{hadith.hadithNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{hadith.grade}</span>
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          • {hadith.chapter}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(hadith)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                        title="Copy Hadith"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="text-right py-2">
                      <p className="text-xl sm:text-2xl font-arabic text-[#1b5e20] leading-loose">
                        {hadith.arabicText}
                      </p>
                    </div>

                    <div className="text-right border-t border-slate-100 pt-3">
                      <p className="text-base font-urdu text-[#2e7d32] leading-relaxed">
                        {hadith.translationUr}
                      </p>
                    </div>

                    <div className="text-left border-t border-slate-100 pt-3">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{hadith.translationEn}"
                      </p>
                    </div>

                    {hadith.narrator && (
                      <div className="text-xs text-slate-500 pt-2 flex items-center justify-between border-t border-slate-100">
                        <span>
                          Narrated by: <strong className="text-slate-800 font-bold">{hadith.narrator}</strong>
                        </span>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                          {hadith.category}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : selectedBookId === 'nawawi40' ? (
        <div className="space-y-4">
          {/* 40 Hadith an-Nawawi Subview Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 font-urdu">اربعین نووی موڈ:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setNawawiViewMode('complete')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    nawawiViewMode === 'complete'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  📖 کامل مجموعہ (42 احادیث - آن لائن ڈیٹا بیس)
                </button>
                <button
                  onClick={() => setNawawiViewMode('curated')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    nawawiViewMode === 'curated'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🌟 بنیادی منتخب احادیث
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedBookId('nasai');
                  setNasaiViewMode('complete');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>سنن نسائی</span>
                <span className="text-[10px] font-mono bg-emerald-200/80 px-1.5 py-0.5 rounded">5,758</span>
              </button>
              <button
                onClick={() => {
                  setSelectedBookId('abudawud');
                  setAbudawudViewMode('complete');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>سنن ابو داؤد</span>
                <span className="text-[10px] font-mono bg-teal-200/80 px-1.5 py-0.5 rounded">5,274</span>
              </button>
              <button
                onClick={() => setSelectedBookId('all')}
                className="text-xs text-[#2e7d32] hover:underline font-semibold cursor-pointer"
              >
                ← تمام کتب پر واپس جائیں
              </button>
            </div>
          </div>

          {/* Render Full Nawawi Reader or Curated View */}
          {nawawiViewMode === 'complete' ? (
            <HadithNawawiReader />
          ) : (
            <div className="space-y-4">
              {filteredHadiths.map((hadith) => {
                const isCopied = copiedId === hadith.id;
                return (
                  <motion.div
                    key={hadith.id}
                    id={`hadith-card-${hadith.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-emerald-600/50 hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                          {hadith.bookName} #{hadith.hadithNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{hadith.grade}</span>
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          • {hadith.chapter}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(hadith)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                        title="Copy Hadith"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="text-right py-2">
                      <p className="text-xl sm:text-2xl font-arabic text-[#1b5e20] leading-loose">
                        {hadith.arabicText}
                      </p>
                    </div>

                    <div className="text-right border-t border-slate-100 pt-3">
                      <p className="text-base font-urdu text-[#2e7d32] leading-relaxed">
                        {hadith.translationUr}
                      </p>
                    </div>

                    <div className="text-left border-t border-slate-100 pt-3">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{hadith.translationEn}"
                      </p>
                    </div>

                    {hadith.narrator && (
                      <div className="text-xs text-slate-500 pt-2 flex items-center justify-between border-t border-slate-100">
                        <span>
                          Narrated by: <strong className="text-slate-800 font-bold">{hadith.narrator}</strong>
                        </span>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                          {hadith.category}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 flex items-center space-x-1 text-xs font-bold">
              <Filter className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>Topic:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-100 text-[#2e7d32] border border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Hadith Cards List for Other Books */}
          <div className="space-y-4">
            {filteredHadiths.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 text-center rounded-3xl text-slate-500 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No Hadiths match your search criteria.</p>
                <p className="text-xs">Try searching for terms like "parents", "fasting", "intention", or "brotherhood".</p>
              </div>
            ) : (
              filteredHadiths.map((hadith) => {
                const isCopied = copiedId === hadith.id;
                return (
                  <motion.div
                    key={hadith.id}
                    id={`hadith-card-${hadith.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-[#2e7d32]/50 hover:shadow-sm transition-all space-y-4"
                  >
                    {/* Header: Book, Number, Grade, Copy */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#2e7d32] text-xs font-bold">
                          {hadith.bookName} #{hadith.hadithNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-[#2e7d32]" />
                          <span>{hadith.grade}</span>
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          • {hadith.chapter}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(hadith)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:text-[#2e7d32] hover:bg-emerald-50 text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                        title="Copy Hadith"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Arabic Text */}
                    <div className="text-right py-2">
                      <p className="text-xl sm:text-2xl font-arabic text-[#1b5e20] leading-loose">
                        {hadith.arabicText}
                      </p>
                    </div>

                    {/* Urdu Translation */}
                    <div className="text-right border-t border-slate-100 pt-3">
                      <p className="text-base font-urdu text-[#2e7d32] leading-relaxed">
                        {hadith.translationUr}
                      </p>
                    </div>

                    {/* English Translation */}
                    <div className="text-left border-t border-slate-100 pt-3">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{hadith.translationEn}"
                      </p>
                    </div>

                    {/* Footer: Narrator info */}
                    {hadith.narrator && (
                      <div className="text-xs text-slate-500 pt-2 flex items-center justify-between border-t border-slate-100">
                        <span>
                          Narrated by: <strong className="text-slate-800 font-bold">{hadith.narrator}</strong>
                        </span>
                        <span className="text-[11px] text-[#2e7d32] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                          {hadith.category}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};
