import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Compass, 
  Clock, 
  Sparkles, 
  Heart, 
  Calculator, 
  Menu, 
  X, 
  Search, 
  BookmarkCheck, 
  Bot, 
  ChevronDown,
  Download,
  DollarSign,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDonate?: () => void;
  onOpenDownload?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenDonate,
  onOpenDownload
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  const featureItems = [
    { id: 'quran' as ActiveTab, label: 'Holy Quran', urdu: 'القرآن الكريم', desc: '114 Surahs with audio & multi-language translation', icon: BookOpen },
    { id: 'hadith' as ActiveTab, label: 'Hadith Library', urdu: 'کتبِ احادیث', desc: 'Sahih Bukhari, Muslim, Tirmidhi & 6 books', icon: BookmarkCheck },
    { id: 'prayer' as ActiveTab, label: 'Prayer Times', urdu: 'نماز کے اوقات', desc: 'Solar Salah calculations, Adhan audio & guide', icon: Clock },
    { id: 'qibla' as ActiveTab, label: 'Qibla Direction', urdu: 'قبلہ رخ کمپاس', desc: 'Visual 3D compass pointing to Makkah', icon: Compass },
    { id: 'tasbih' as ActiveTab, label: 'Digital Tasbih', urdu: 'ڈیجیٹل تسبیح', desc: 'Interactive Dhikr counter with audio feedback', icon: Sparkles },
    { id: 'duas' as ActiveTab, label: 'Masnoon Duas', urdu: 'مسنون دعائیں', desc: 'Authentic daily supplications & Azkar', icon: Heart },
    { id: 'names' as ActiveTab, label: '99 Names of Allah', urdu: 'اسماء الحسنیٰ', desc: 'Asma-ul-Husna & Holy Prophet (ﷺ) names', icon: Sparkles },
    { id: 'zakat' as ActiveTab, label: 'Zakat Calculator', urdu: 'زکوٰۃ کیلکولیٹر', desc: 'Nisab evaluation for gold, silver & wealth', icon: Calculator },
    { id: 'ai-search' as ActiveTab, label: 'Islam360 AI Search', urdu: 'اسلام 360 AI', desc: 'Smart AI Mufti powered by verified sources', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Islam360 Icon from the uploaded image */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            {/* Authentic Islam360 App Icon Badge */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#60af25] to-[#48a124] shadow-md flex flex-col items-center justify-center text-white border border-[#449921] group-hover:scale-105 transition-transform duration-200">
              <span className="font-arabic text-sm leading-none font-bold pt-0.5">إسلام</span>
              <span className="text-[11px] font-black tracking-tight leading-none">360</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black tracking-tight text-[#111827]">
                Islam<span className="text-[#2e7d32]">360</span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium">
                World's 1st Islamic Search Engine
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Matching the image) */}
          <nav className="hidden lg:flex items-center space-x-1 sm:space-x-3">
            {/* Home */}
            <button
              id="header-nav-home"
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'home' 
                  ? 'text-[#2e7d32] font-bold bg-[#e8f5e9]' 
                  : 'text-slate-700 hover:text-[#2e7d32] hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* Features Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setFeaturesDropdownOpen(true)}
              onMouseLeave={() => setFeaturesDropdownOpen(false)}
            >
              <button
                onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab !== 'home' 
                    ? 'text-[#2e7d32] font-bold' 
                    : 'text-slate-700 hover:text-[#2e7d32]'
                }`}
              >
                <span>Features</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#2e7d32]" />
              </button>

              <AnimatePresence>
                {featuresDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 w-80 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 grid grid-cols-1 gap-1 z-50"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Explore Islamic Tools
                    </div>
                    {featureItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setFeaturesDropdownOpen(false);
                          }}
                          className={`flex items-center space-x-3 p-2.5 rounded-xl text-left transition-colors ${
                            isActive 
                              ? 'bg-[#e8f5e9] text-[#2e7d32] font-bold' 
                              : 'hover:bg-slate-50 text-slate-700 hover:text-[#2e7d32]'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isActive ? 'bg-[#2e7d32] text-white' : 'bg-emerald-50 text-[#2e7d32]'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{item.label}</div>
                            <div className="text-[10px] text-slate-400 font-urdu">{item.urdu}</div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Learn Quran */}
            <button
              onClick={() => setActiveTab('quran')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'quran' ? 'text-[#2e7d32] font-bold' : 'text-slate-700 hover:text-[#2e7d32]'
              }`}
            >
              Learn Quran
            </button>

            {/* Publications (Hadith) */}
            <button
              onClick={() => setActiveTab('hadith')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'hadith' ? 'text-[#2e7d32] font-bold' : 'text-slate-700 hover:text-[#2e7d32]'
              }`}
            >
              Publications
            </button>

            {/* Company Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCompanyDropdownOpen(true)}
              onMouseLeave={() => setCompanyDropdownOpen(false)}
            >
              <button
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#2e7d32] transition-colors flex items-center space-x-1"
              >
                <span>Company</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {companyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 w-56 bg-white rounded-2xl p-2 shadow-xl border border-slate-100 z-50 space-y-1"
                  >
                    <div 
                      onClick={() => {
                        setActiveTab('home');
                        setCompanyDropdownOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      About Islam360
                    </div>
                    <div 
                      onClick={() => {
                        if (onOpenDonate) onOpenDonate();
                        setCompanyDropdownOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      Support &amp; Donation
                    </div>
                    <div 
                      onClick={() => {
                        setActiveTab('ai-search');
                        setCompanyDropdownOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      Islamic Research &amp; AI
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Buttons: DONATE and Download the App (Exact styling from image) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* DONATE Button - Solid Green Pill */}
            <button
              id="header-donate-btn"
              onClick={onOpenDonate}
              className="px-5 sm:px-6 py-2 rounded-full bg-[#287d46] hover:bg-[#20683a] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              DONATE
            </button>

            {/* Download the App Button - Outlined Pill */}
            <button
              id="header-download-btn"
              onClick={onOpenDownload}
              className="hidden sm:inline-flex px-4 sm:px-5 py-2 rounded-full border border-[#287d46] text-[#287d46] hover:bg-[#287d46]/5 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer"
            >
              Download the App
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-[#2e7d32] hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-4 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-[#e8f5e9] text-left text-xs font-bold text-slate-700"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setActiveTab('quran');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-[#e8f5e9] text-left text-xs font-bold text-slate-700"
              >
                The Holy Quran
              </button>
              <button
                onClick={() => {
                  setActiveTab('hadith');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-[#e8f5e9] text-left text-xs font-bold text-slate-700"
              >
                Hadith Publications
              </button>
              <button
                onClick={() => {
                  setActiveTab('prayer');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-[#e8f5e9] text-left text-xs font-bold text-slate-700"
              >
                Prayer Times
              </button>
              <button
                onClick={() => {
                  setActiveTab('qibla');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-[#e8f5e9] text-left text-xs font-bold text-slate-700"
              >
                Qibla Direction
              </button>
              <button
                onClick={() => {
                  setActiveTab('tasbih');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-[#e8f5e9] text-left text-xs font-bold text-slate-700"
              >
                Digital Tasbih
              </button>
              <button
                onClick={() => {
                  setActiveTab('duas');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-[#e8f5e9] text-left text-xs font-bold text-slate-700"
              >
                Masnoon Duas
              </button>
              <button
                onClick={() => {
                  setActiveTab('ai-search');
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-[#e8f5e9] text-left text-xs font-bold text-[#2e7d32]"
              >
                Islam360 AI Mufti
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  if (onOpenDonate) onOpenDonate();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-full bg-[#287d46] text-white font-bold text-sm"
              >
                DONATE
              </button>
              <button
                onClick={() => {
                  if (onOpenDownload) onOpenDownload();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-full border border-[#287d46] text-[#287d46] font-bold text-sm"
              >
                Download the App
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
