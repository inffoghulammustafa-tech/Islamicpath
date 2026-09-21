/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  BookOpen, 
  BookmarkCheck, 
  Clock, 
  Compass, 
  Sparkles, 
  Calculator, 
  Bot, 
  ChevronUp, 
  Share2, 
  Globe,
  Download,
  Smartphone
} from 'lucide-react';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { QuranSection } from './components/QuranSection';
import { HadithSection } from './components/HadithSection';
import { PrayerSection } from './components/PrayerSection';
import { QiblaSection } from './components/QiblaSection';
import { TasbihSection } from './components/TasbihSection';
import { DuasSection } from './components/DuasSection';
import { NamesSection } from './components/NamesSection';
import { ZakatSection } from './components/ZakatSection';
import { AiSearchSection } from './components/AiSearchSection';
import { DonateModal } from './components/DonateModal';
import { DownloadAppModal } from './components/DownloadAppModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 flex flex-col selection:bg-[#2e7d32] selection:text-white font-sans relative">
      {/* Navbar with IslamicPath Branding */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenDonate={() => setIsDonateOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && (
              <HomeDashboard 
                setActiveTab={setActiveTab} 
                onOpenDonate={() => setIsDonateOpen(true)}
                onOpenDownload={() => setIsDownloadOpen(true)}
              />
            )}
            {activeTab === 'quran' && <QuranSection />}
            {activeTab === 'hadith' && <HadithSection />}
            {activeTab === 'prayer' && <PrayerSection />}
            {activeTab === 'qibla' && <QiblaSection />}
            {activeTab === 'tasbih' && <TasbihSection />}
            {activeTab === 'duas' && <DuasSection />}
            {activeTab === 'names' && <NamesSection />}
            {activeTab === 'zakat' && <ZakatSection />}
            {activeTab === 'ai-search' && <AiSearchSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* IslamicPath Modern Clean Footer */}
      <footer className="bg-[#f8faf9] border-t border-slate-200/80 pt-16 pb-12 mt-16 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Bio */}
            <div className="space-y-4">
              <div 
                onClick={() => setActiveTab('home')}
                className="flex items-center space-x-3 cursor-pointer group select-none"
              >
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border-2 border-emerald-500/40 group-hover:border-[#2e7d32] transition-all bg-emerald-50 shrink-0">
                  <img
                    src="/images/logo.jpg"
                    alt="Islamic Path Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== 'https://i.pinimg.com/736x/ba/5c/56/ba5c560e399705657557acc0578e6f3b.jpg') {
                        target.src = 'https://i.pinimg.com/736x/ba/5c/56/ba5c560e399705657557acc0578e6f3b.jpg';
                      }
                    }}
                  />
                </div>
                <div>
                  <span className="text-xl font-black text-[#111827]">
                    Islamic <span className="text-[#2e7d32]">Path</span>
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium">شاہراہِ اسلام • Quran, Hadith &amp; Guidance</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Islamic Path empowers Muslims worldwide through authentic Quranic texts, Sahih Hadith databases, solar prayer calculations, and intelligent Islamic search.
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => setIsDownloadOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#2e7d32] hover:bg-[#256629] text-white text-xs font-bold shadow-sm transition-colors flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Get Mobile App</span>
                </button>
                <button
                  onClick={() => setIsDonateOpen(true)}
                  className="px-4 py-2 rounded-xl border border-[#2e7d32] text-[#2e7d32] hover:bg-emerald-50 text-xs font-bold transition-colors"
                >
                  Donate
                </button>
              </div>
            </div>

            {/* Column 2: Quran & Hadith */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
                Scripture &amp; Sunnah
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <button onClick={() => setActiveTab('quran')} className="hover:text-[#2e7d32] transition-colors">
                    The Holy Quran (114 Surahs)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('hadith')} className="hover:text-[#2e7d32] transition-colors">
                    Sahih al-Bukhari &amp; Sahih Muslim
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('hadith')} className="hover:text-[#2e7d32] transition-colors">
                    Jami' at-Tirmidhi &amp; Abu Dawud
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('quran')} className="hover:text-[#2e7d32] transition-colors">
                    Mishary Alafasy Audio Tilawat
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Daily Tools */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
                Islamic Utilities
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <button onClick={() => setActiveTab('prayer')} className="hover:text-[#2e7d32] transition-colors">
                    Prayer Times &amp; Adhan Broadcast
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('qibla')} className="hover:text-[#2e7d32] transition-colors">
                    3D Qibla Direction Compass
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('tasbih')} className="hover:text-[#2e7d32] transition-colors">
                    Digital Tasbih Dhikr Counter
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('zakat')} className="hover:text-[#2e7d32] transition-colors">
                    Zakat &amp; Nisab Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('duas')} className="hover:text-[#2e7d32] transition-colors">
                    Authentic Masnoon Duas
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: AI & Guidance */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
                AI &amp; Spiritual Guidance
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <button onClick={() => setActiveTab('ai-search')} className="hover:text-[#2e7d32] transition-colors flex items-center space-x-1 font-semibold text-[#2e7d32]">
                    <Bot className="w-3.5 h-3.5 text-[#2e7d32]" />
                    <span>IslamicPath AI Search Engine</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('names')} className="hover:text-[#2e7d32] transition-colors">
                    99 Names of Allah (Asma-ul-Husna)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('names')} className="hover:text-[#2e7d32] transition-colors">
                    Blessed Names of Prophet Muhammad (ﷺ)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('prayer')} className="hover:text-[#2e7d32] transition-colors">
                    Step-by-Step Namaz Postures Guide
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright & blessings */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} Islamic Path. All rights reserved. Shariah-verified platform.
            </p>
            <p className="text-[#2e7d32] font-arabic text-base">
              رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          id="back-to-top-btn"
          className="fixed bottom-6 right-6 p-3 rounded-2xl bg-[#2e7d32] text-white shadow-lg hover:bg-[#256629] transition-all z-40"
          title="Back to Top"
        >
          <ChevronUp className="w-5 h-5 font-bold" />
        </motion.button>
      )}

      {/* Modals */}
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
      <DownloadAppModal isOpen={isDownloadOpen} onClose={() => setIsDownloadOpen(false)} />
    </div>
  );
}
