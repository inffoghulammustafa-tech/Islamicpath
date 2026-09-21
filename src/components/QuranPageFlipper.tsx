import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen } from 'lucide-react';

interface QuranPageItem {
  id: number;
  surahNameAr: string;
  surahNameEn: string;
  pageNumber: string;
  imageSrc: string;
  description: string;
}

const QURAN_PAGES: QuranPageItem[] = [
  {
    id: 1,
    surahNameAr: "سُورَةُ الْفَاتِحَةِ وَالْبَقَرَة",
    surahNameEn: "Surah Al-Fatihah & Al-Baqarah",
    pageNumber: "١",
    imageSrc: "/src/assets/images/quran_rihal_stand_1789811118145.jpg",
    description: "آغاز قرآن مجید - ام الکتاب"
  },
  {
    id: 2,
    surahNameAr: "سُورَةُ يس",
    surahNameEn: "Surah Ya-Sin",
    pageNumber: "٤٤٠",
    imageSrc: "/src/assets/images/quran_page_yasin_1789989367866.jpg",
    description: "قلب القرآن - فضائل و برکات"
  },
  {
    id: 3,
    surahNameAr: "سُورَةُ الرَّحْمَٰن",
    surahNameEn: "Surah Ar-Rahman",
    pageNumber: "٥٣١",
    imageSrc: "/src/assets/images/quran_page_rahman_1789989386729.jpg",
    description: "عروس القرآن - فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ"
  },
  {
    id: 4,
    surahNameAr: "سُورَةُ الْمُلْك",
    surahNameEn: "Surah Al-Mulk",
    pageNumber: "٥٦٢",
    imageSrc: "/src/assets/images/quran_page_mulk_1789989402876.jpg",
    description: "المنجية والواقية من عذاب القبر"
  }
];

export const QuranPageFlipper: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Automatically turn the page one by one every 3 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIsTurning(true);

      // Page turn animation
      setTimeout(() => {
        setCurrentPageIndex((prev) => (prev + 1) % QURAN_PAGES.length);
        setIsTurning(false);
      }, 700);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentPage = QURAN_PAGES[currentPageIndex];
  const nextPageIndex = (currentPageIndex + 1) % QURAN_PAGES.length;
  const nextPage = QURAN_PAGES[nextPageIndex];

  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none">
      {/* Soft emerald ambient glow aura behind the Quran */}
      <div className="absolute inset-0 bg-emerald-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* 
        Quran Display Frame:
        The Quran and carved wooden stand stay firmly anchored in place.
        Every 3 seconds, a real authentic Quran page turns smoothly from right to left.
      */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white/30 backdrop-blur-xs border border-emerald-100/60 flex items-center justify-center">
        
        {/* Base Layer: Next real page already waiting underneath */}
        <img
          key={`next-${nextPage.id}`}
          src={nextPage.imageSrc}
          alt={nextPage.surahNameEn}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* 
          Active Layer: Current real page that smoothly curls/wipes away from right to left
          like a physical page turn, revealing the next real page underneath!
        */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`current-${currentPage.id}`}
            className="absolute inset-0 w-full h-full overflow-hidden"
            initial={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
            animate={
              isTurning
                ? {
                    clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                    transition: { duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }
                  }
                : { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }
            }
          >
            <img
              src={currentPage.imageSrc}
              alt={currentPage.surahNameEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Page curl crease shadow traveling across the pages */}
            {isTurning && (
              <motion.div
                initial={{ left: '100%', opacity: 0.8 }}
                animate={{ left: '-10%', opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
                className="absolute top-0 bottom-0 w-16 -ml-8 pointer-events-none bg-gradient-to-r from-transparent via-amber-900/40 to-transparent skew-x-[-12deg]"
              />
            )}

            {/* Page shine highlight */}
            {isTurning && (
              <motion.div
                initial={{ left: '105%', opacity: 0.7 }}
                animate={{ left: '-5%', opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
                className="absolute top-0 bottom-0 w-8 -ml-4 pointer-events-none bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-12deg]"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Clean Surah Information Card below (No pause button, no speaker, no slider dots) */}
      <div className="mt-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 text-[#2e7d32] border border-emerald-200/80">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <AnimatePresence mode="wait">
                <motion.h4 
                  key={currentPage.id}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-bold text-slate-900 font-urdu leading-tight" 
                  dir="rtl"
                >
                  {currentPage.surahNameAr}
                </motion.h4>
              </AnimatePresence>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {currentPage.surahNameEn} • {currentPage.description}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/70 text-[#1b5e20] font-mono">
            صفحہ {currentPage.pageNumber}
          </span>
        </div>
      </div>
    </div>
  );
};
