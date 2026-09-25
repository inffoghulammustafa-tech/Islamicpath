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
  ChevronUp, 
  Share2, 
  Globe,
  Download,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  ChevronRight
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
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { DonateModal } from './components/DonateModal';
import { TasmiyahIntroScreen } from './components/TasmiyahIntroScreen';
import { AutoAdhanGlobalModal } from './components/AutoAdhanGlobalModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { InstallFeedbackToast, InstallNotificationData } from './components/InstallFeedbackToast';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [copiedFooterId, setCopiedFooterId] = useState<string | null>(null);
  const [installNotification, setInstallNotification] = useState<InstallNotificationData | null>(null);

  const { triggerDirectInstall } = usePWAInstall();

  /**
   * Direct Device Installation Trigger:
   * Directly invokes the native device prompt or installs without opening any modal page.
   */
  const handleDirectDownloadOrInstall = async () => {
    const result = await triggerDirectInstall();
    if (result.status === 'pc_downloaded') {
      setInstallNotification({
        type: 'pc',
        title: 'کمپیوٹر ایپ ڈاؤنلوڈ ہو گئی! (PC Desktop App)',
        message: result.message
      });
    } else if (result.status === 'prompted_accepted') {
      setInstallNotification({
        type: 'success',
        title: 'ایپ کامیابی سے انسٹال ہو گئی!',
        message: result.message
      });
    } else if (result.status === 'already_installed') {
      setInstallNotification({
        type: 'info',
        title: 'پہلے سے انسٹال شدہ (Already Installed)',
        message: result.message
      });
    } else if (result.status === 'ios_safari') {
      setInstallNotification({
        type: 'ios',
        title: 'iPhone / iPad پر انسٹال کریں',
        message: result.message
      });
    } else if (result.status === 'browser_manual') {
      setInstallNotification({
        type: 'guide',
        title: 'براؤزر سے انسٹال کریں',
        message: result.message
      });
    } else if (result.status === 'prompted_dismissed') {
      setInstallNotification({
        type: 'info',
        title: 'انسٹالیشن منسوخ',
        message: result.message
      });
    }
  };

  // Scroll to top immediately whenever activeTab changes so every page starts from the very top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

  const handleTabSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleFooterCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFooterId(id);
    setTimeout(() => setCopiedFooterId(null), 2500);
  };

  // High-performance hardware-accelerated scroll listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 flex flex-col selection:bg-[#2e7d32] selection:text-white font-sans relative">
      {/* Sacred Tasmiyah Bismillah Pre-Start Screen with Audio Recitation */}
      <TasmiyahIntroScreen 
        isOpen={showIntro} 
        onComplete={() => setShowIntro(false)} 
      />

      {/* Navbar with IslamicPath Branding */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabSelect} 
        onOpenDonate={() => setIsDonateOpen(true)}
        onOpenDownload={handleDirectDownloadOrInstall}
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
                setActiveTab={handleTabSelect} 
                onOpenDonate={() => setIsDonateOpen(true)}
                onOpenDownload={handleDirectDownloadOrInstall}
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
            {activeTab === 'about' && (
              <AboutSection 
                setActiveTab={handleTabSelect} 
                onOpenDonate={() => setIsDonateOpen(true)} 
              />
            )}
            {activeTab === 'contact' && (
              <ContactSection 
                setActiveTab={handleTabSelect} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* IslamicPath Clean Professional Footer Matching Image 1 & 2 with Animated Hover Line Effect */}
      <footer className="relative bg-[#f8faf9] border-t border-slate-200/90 pt-16 pb-12 mt-16 text-slate-600 overflow-hidden">
        {/* Subtle Mosque Background Watermark & Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src="/images/mosque-footer.jpg"
            alt="Masjid Architecture Background"
            className="w-full h-full object-cover object-bottom opacity-[0.08] filter grayscale contrast-125 transition-transform duration-1000 ease-out"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=80') {
                target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=80';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8faf9]/92 via-[#f8faf9]/88 to-[#f1f5f3]/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Bio (Matching Image 1) */}
            <div className="space-y-4">
              <div 
                onClick={() => handleTabSelect('home')}
                className="flex items-center space-x-3 cursor-pointer group select-none"
              >
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xs border border-slate-200 group-hover:border-[#2e7d32] transition-all bg-white shrink-0">
                  <img
                    src="/images/logo.jpg"
                    alt="Islamic Path Logo"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
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
                  <p className="text-[11px] text-slate-500 font-medium">شاہراہ اسلام • Quran, Hadith &amp; Guidance</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Islamic Path empowers Muslims worldwide through authentic Quranic texts, Sahih Hadith databases, solar prayer calculations, and intelligent Islamic search.
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={handleDirectDownloadOrInstall}
                  className="px-4 py-2 rounded-xl bg-[#2e7d32] hover:bg-[#256629] text-white text-xs font-bold shadow-sm hover:shadow-[0_0_20px_rgba(46,125,50,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center space-x-1.5 cursor-pointer"
                  title="Direct Install to Device"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Get Mobile App</span>
                </button>
                <button
                  onClick={() => setIsDonateOpen(true)}
                  className="px-4 py-2 rounded-xl border border-[#2e7d32] text-[#2e7d32] hover:bg-emerald-50 hover:shadow-[0_0_15px_rgba(46,125,50,0.2)] hover:scale-[1.02] active:scale-[0.98] text-xs font-bold transition-all duration-300 cursor-pointer"
                >
                  Donate
                </button>
              </div>
            </div>

            {/* Column 2: SCRIPTURE & SUNNAH with Image 2 Line Accent & Animated Underline on Cursor Hover */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
                <span>Scripture &amp; Sunnah</span>
                <span className="w-8 h-[2.5px] bg-[#2e7d32] rounded-full inline-block" />
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {[
                  { text: 'The Holy Quran (114 Surahs)', tab: 'quran' },
                  { text: 'Sahih al-Bukhari & Sahih Muslim', tab: 'hadith' },
                  { text: "Jami' at-Tirmidhi & Abu Dawud", tab: 'hadith' },
                  { text: 'Mishary Alafasy Audio Tilawat', tab: 'quran' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => handleTabSelect(item.tab as ActiveTab)} 
                      className="group relative inline-flex flex-col items-start py-1 text-xs text-slate-600 hover:text-[#2e7d32] transition-colors duration-200 cursor-pointer"
                    >
                      <span className="relative inline-block pb-0.5">
                        {item.text}
                        {/* Animated Underline Effect on Cursor Hover */}
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#2e7d32] rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-[0_0_8px_rgba(46,125,50,0.4)]" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: ISLAMIC UTILITIES with Image 2 Line Accent & Animated Underline on Cursor Hover */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
                <span>Islamic Utilities</span>
                <span className="w-8 h-[2.5px] bg-[#2e7d32] rounded-full inline-block" />
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {[
                  { text: 'Prayer Times & Adhan Broadcast', tab: 'prayer' },
                  { text: '3D Qibla Direction Compass', tab: 'qibla' },
                  { text: 'Digital Tasbih Dhikr Counter', tab: 'tasbih' },
                  { text: 'Zakat & Nisab Calculator', tab: 'zakat' },
                  { text: 'Authentic Masnoon Duas', tab: 'duas' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => handleTabSelect(item.tab as ActiveTab)} 
                      className="group relative inline-flex flex-col items-start py-1 text-xs text-slate-600 hover:text-[#2e7d32] transition-colors duration-200 cursor-pointer"
                    >
                      <span className="relative inline-block pb-0.5">
                        {item.text}
                        {/* Animated Underline Effect on Cursor Hover */}
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#2e7d32] rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-[0_0_8px_rgba(46,125,50,0.4)]" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact Us (Matching Image 1) with White Cards and Line Accent */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
                  <span>Contact Us • رابطہ کیجیے</span>
                  <span className="w-8 h-[2.5px] bg-[#2e7d32] rounded-full inline-block" />
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#1b5e20]">
                  Helpdesk
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Email Card (Matching Image 1) */}
                <div className="group/item p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#2e7d32] border border-emerald-200 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Email Address</div>
                        <a 
                          href="mailto:inffo.ghulammustafa@gmail.com" 
                          className="group/link relative inline-block text-xs font-bold text-slate-800 hover:text-[#2e7d32] transition-colors truncate pb-0.5 max-w-[190px]"
                        >
                          <span>inffo.ghulammustafa@gmail.com</span>
                          <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#2e7d32] rounded-full transition-all duration-300 ease-out group-hover/link:w-full" />
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFooterCopy('inffo.ghulammustafa@gmail.com', 'email')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#2e7d32] hover:bg-emerald-50 transition-all shrink-0 cursor-pointer"
                      title="Copy Email"
                    >
                      {copiedFooterId === 'email' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Phone Card (Matching Image 1) */}
                <div className="group/item p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Phone &amp; WhatsApp</div>
                        <a 
                          href="tel:+923001234567" 
                          className="group/link relative inline-block text-xs font-bold text-slate-800 hover:text-amber-700 transition-colors truncate pb-0.5"
                        >
                          <span>+92 (300) 123-4567</span>
                          <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-amber-600 rounded-full transition-all duration-300 ease-out group-hover/link:w-full" />
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFooterCopy('+923001234567', 'phone')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-all shrink-0 cursor-pointer"
                      title="Copy Phone"
                    >
                      {copiedFooterId === 'phone' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Office Address Card (Matching Image 1) */}
                <div className="group/item p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="flex items-start space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Office Address</div>
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        Shahrah-e-Faisal, Karachi / Islamabad, Pakistan
                      </p>
                      <p className="font-urdu text-[11px] text-slate-500 mt-0.5" dir="rtl">
                        شاہراہِ فیصل، پاکستان
                      </p>
                    </div>
                    <button
                      onClick={() => handleFooterCopy('Shahrah-e-Faisal, Karachi, Pakistan', 'address')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-all shrink-0 cursor-pointer"
                      title="Copy Address"
                    >
                      {copiedFooterId === 'address' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Open Contact Page Button (Matching Image 1) */}
                <button
                  onClick={() => handleTabSelect('contact')}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-[#2e7d32] text-[#1b5e20] hover:text-white border border-emerald-200/90 hover:border-transparent text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md active:scale-[0.98]"
                >
                  <span>Open Contact &amp; Inquiry Page (مکمل رابطہ صفحہ)</span>
                </button>
              </div>
            </div>
          </div>

          {/* All Pages Row with Animated Underline on Cursor Hover */}
          <div className="pt-8 border-t border-slate-200/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
                <span>Quick Navigation • تمام صفحات</span>
                <span className="w-8 h-[2.5px] bg-[#2e7d32] rounded-full inline-block" />
              </h4>
              <span className="text-[11px] font-bold text-[#1b5e20] bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full w-fit">
                11 Interactive Pages • 100% Offline Ready
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {[
                { id: 'home' as ActiveTab, titleEn: 'Home', titleUr: 'مرکزی صفحہ', icon: Globe },
                { id: 'quran' as ActiveTab, titleEn: 'Holy Quran', titleUr: 'قرآن مجید', icon: BookOpen },
                { id: 'hadith' as ActiveTab, titleEn: 'Hadith Books', titleUr: 'احادیث مبارکہ', icon: BookmarkCheck },
                { id: 'prayer' as ActiveTab, titleEn: 'Prayer Times', titleUr: 'اوقاتِ نماز', icon: Clock },
                { id: 'qibla' as ActiveTab, titleEn: 'Qibla Direction', titleUr: 'قبلہ رخ کمپاس', icon: Compass },
                { id: 'tasbih' as ActiveTab, titleEn: 'Digital Tasbih', titleUr: 'تسبیح کاؤنٹر', icon: Sparkles },
                { id: 'duas' as ActiveTab, titleEn: 'Masnoon Duas', titleUr: 'مسنون دعائیں', icon: Heart },
                { id: 'names' as ActiveTab, titleEn: '99 Names', titleUr: 'اسماء الحسنیٰ', icon: Sparkles },
                { id: 'zakat' as ActiveTab, titleEn: 'Zakat Calculator', titleUr: 'زکوٰۃ کیلکولیٹر', icon: Calculator },
                { id: 'about' as ActiveTab, titleEn: 'About Us', titleUr: 'ہمارے متعلق', icon: Globe },
                { id: 'contact' as ActiveTab, titleEn: 'Contact Support', titleUr: 'رابطہ صفحہ', icon: Mail },
              ].map((page) => {
                const isActive = activeTab === page.id;
                const IconComponent = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => handleTabSelect(page.id)}
                    className={`group relative p-2.5 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 border-[#2e7d32] shadow-xs'
                        : 'bg-white hover:bg-emerald-50/40 border-slate-200 hover:border-[#2e7d32] shadow-xs hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#2e7d32]' : 'text-slate-400 group-hover:text-[#2e7d32] transition-colors'}`} />
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32] animate-pulse" />
                      )}
                    </div>
                    <div className="relative inline-block text-xs font-bold text-slate-800 group-hover:text-[#2e7d32] transition-colors pb-0.5">
                      <span>{page.titleEn}</span>
                      {/* Animated underline line effect on cursor hover */}
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#2e7d32] rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-[0_0_8px_rgba(46,125,50,0.5)]" />
                    </div>
                    <div className="font-urdu text-[11px] text-slate-500 group-hover:text-emerald-800 mt-0.5" dir="rtl">
                      {page.titleUr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom copyright & blessings */}
          <div className="pt-8 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
          className="fixed bottom-6 right-6 p-3 rounded-2xl bg-[#2e7d32] hover:bg-[#256629] text-white shadow-lg transition-all z-40 cursor-pointer"
          title="Back to Top"
        >
          <ChevronUp className="w-5 h-5 font-bold" />
        </motion.button>
      )}

      {/* Modals */}
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />

      {/* Direct Device Install Feedback Toast */}
      <InstallFeedbackToast 
        notification={installNotification} 
        onClose={() => setInstallNotification(null)} 
      />

      {/* Global Automatic Adhan Alert & Prayer Caller */}
      <AutoAdhanGlobalModal />

      {/* 100% Offline Connectivity Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}
