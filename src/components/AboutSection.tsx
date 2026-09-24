import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  BookmarkCheck, 
  Clock, 
  Compass, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Globe2, 
  Users, 
  CheckCircle2, 
  Award,
  ArrowRight,
  HandHeart,
  Mail,
  ExternalLink
} from 'lucide-react';
import { ActiveTab } from '../types';
import { NeonDualBorderBeam } from './NeonDualBorderBeam';

interface AboutSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDonate?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ 
  setActiveTab, 
  onOpenDonate 
}) => {
  const [hoveredBox, setHoveredBox] = useState<'mission' | 'vision' | null>(null);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
  const [hoveredSource, setHoveredSource] = useState<number | null>(null);

  const coreValues = [
    {
      icon: ShieldCheck,
      title: "Authentic & Verified",
      urduTitle: "صداقت اور تحقیق",
      description: "Every ayah, translation, and hadith narration is verified from classical texts and authorized scholarly sources with authentic Isnad and gradings.",
      accent: "from-emerald-500/20 to-emerald-50 border-emerald-300 text-emerald-800 shadow-emerald-500/10",
      anim: {
        animate: { scale: [1, 1.08, 1], y: [0, -3, 0] },
        transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' as const },
        hoverRotate: [0, -10, 10, 0]
      }
    },
    {
      icon: Heart,
      title: "100% Ad-Free & Pure",
      urduTitle: "خالصتاً لوجہ اللہ",
      description: "Completely free of commercial advertisements, pop-ups, or distractions. Created purely to serve the worldwide Muslim Ummah.",
      accent: "from-amber-500/20 to-amber-50 border-amber-300 text-amber-800 shadow-amber-500/10",
      anim: {
        animate: { scale: [1, 1.14, 1, 1.1, 1] },
        transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' as const },
        hoverRotate: [0, -6, 6, 0]
      }
    },
    {
      icon: Globe2,
      title: "Non-Sectarian & Universal",
      urduTitle: "غیر فرقہ وارانہ منہج",
      description: "Committed to the unified message of Islam based on the Holy Quran and authentic Sunnah of Prophet Muhammad (ﷺ) without sectarian discord.",
      accent: "from-blue-500/20 to-blue-50 border-blue-300 text-blue-800 shadow-blue-500/10",
      anim: {
        animate: { rotate: [-10, 10, -10], y: [0, -3, 0] },
        transition: { repeat: Infinity, duration: 3.6, ease: 'easeInOut' as const },
        hoverRotate: 360
      }
    },
    {
      icon: Award,
      title: "Precision & Excellence (Ihsan)",
      urduTitle: "درستی اور معیار",
      description: "Accurate astronomical calculation methods for Salah, magnetic Qibla bearings, and crisp Arabic calligraphy typography.",
      accent: "from-purple-500/20 to-purple-50 border-purple-300 text-purple-800 shadow-purple-500/10",
      anim: {
        animate: { y: [0, -4, 0], scale: [1, 1.07, 1] },
        transition: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' as const },
        hoverRotate: [0, -12, 12, 0]
      }
    }
  ];

  const authenticSources = [
    { 
      name: "Al-Quran Al-Kareem", 
      urduName: "القرآن الکریم",
      desc: "Hafs Recitation & Verified Translations", 
      icon: BookOpen,
      accent: "text-emerald-700 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-100 group-hover:border-emerald-300",
      anim: {
        animate: { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] },
        transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' as const },
        hoverRotate: [0, -8, 8, 0]
      }
    },
    { 
      name: "Sahih al-Bukhari", 
      urduName: "صحیح البخاری",
      desc: "Imam Muhammad al-Bukhari", 
      icon: BookmarkCheck,
      accent: "text-amber-700 bg-amber-50 border-amber-200 group-hover:bg-amber-100 group-hover:border-amber-300",
      anim: {
        animate: { y: [0, -3, 0] },
        transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' as const },
        hoverRotate: [0, -8, 0]
      }
    },
    { 
      name: "Sahih Muslim", 
      urduName: "صحیح مسلم",
      desc: "Imam Muslim ibn al-Hajjaj", 
      icon: Award,
      accent: "text-blue-700 bg-blue-50 border-blue-200 group-hover:bg-blue-100 group-hover:border-blue-300",
      anim: {
        animate: { scale: [1, 1.08, 1], y: [0, -2.5, 0] },
        transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' as const },
        hoverRotate: 360
      }
    },
    { 
      name: "Jami' al-Tirmidhi", 
      urduName: "جامع الترمذی",
      desc: "Imam Abu Isa al-Tirmidhi", 
      icon: ShieldCheck,
      accent: "text-teal-700 bg-teal-50 border-teal-200 group-hover:bg-teal-100 group-hover:border-teal-300",
      anim: {
        animate: { rotate: [-6, 6, -6] },
        transition: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' as const },
        hoverRotate: [0, -10, 10, 0]
      }
    },
    { 
      name: "Sunan an-Nasa'i", 
      urduName: "سنن النسائی",
      desc: "Imam Ahmad an-Nasa'i", 
      icon: BookOpen,
      accent: "text-purple-700 bg-purple-50 border-purple-200 group-hover:bg-purple-100 group-hover:border-purple-300",
      anim: {
        animate: { y: [0, -3.5, 0], scale: [1, 1.06, 1] },
        transition: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' as const },
        hoverRotate: [0, -6, 6, 0]
      }
    },
    { 
      name: "Sunan Abi Dawud", 
      urduName: "سنن ابی داؤد",
      desc: "Imam Abu Dawud al-Sijistani", 
      icon: BookmarkCheck,
      accent: "text-emerald-700 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-100 group-hover:border-emerald-300",
      anim: {
        animate: { scale: [1, 1.07, 1], rotate: [0, 4, -4, 0] },
        transition: { repeat: Infinity, duration: 2.9, ease: 'easeInOut' as const },
        hoverRotate: 360
      }
    }
  ];

  const statistics = [
    { value: "114", label: "Complete Surahs", sub: "Recitation & Translations" },
    { value: "6+", label: "Canonical Hadith Books", sub: "Sahih Bukhari, Muslim & more" },
    { value: "150+", label: "Countries Supported", sub: "Precise Solar Prayer Times" },
    { value: "100%", label: "Free & Open Access", sub: "Ad-free digital sanctuary" }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Banner with Glowing Ethereal Aura */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#12381e] via-[#1b5e20] to-[#0d2d14] text-white p-8 sm:p-12 shadow-[0_10px_40px_rgba(27,94,32,0.25)] border border-emerald-500/30">
        {/* Ambient celestial glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none gpu-accelerated" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none gpu-accelerated" />

        <div className="relative z-10 max-w-3xl space-y-5">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>About IslamicPath • ہمارے بارے میں</span>
          </div>

          {/* Bismillah Calligraphy */}
          <p className="font-arabic text-2xl sm:text-3xl text-amber-200/90 drop-shadow-sm" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Connecting the Global Ummah to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100">Sacred &amp; Authentic</span> Islamic Knowledge
          </h1>

          <p className="font-urdu text-lg sm:text-xl text-emerald-100/95 leading-relaxed" dir="rtl">
            اسلامک پاتھ ایک جدید، مستند اور اشتہارات سے پاک ڈیجیٹل اسلامی پلیٹ فارم ہے جس کا مقصد قرآن و سنت کے نور کو ہر مسلمان تک باآسانی پہنچانا ہے۔
          </p>

          <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed max-w-2xl">
            IslamicPath is an authentic, ad-free Islamic sanctuary built to deliver the divine words of the Holy Quran, authentic Hadith collections, precise prayer times, and essential worship tools to Muslims across the globe.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('quran')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Holy Quran</span>
            </button>
            <button
              onClick={() => setActiveTab('hadith')}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-300" />
              <span>Hadith Library</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Statistics with Luminous Ring Glow */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {statistics.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-[0_4px_20px_rgba(46,125,50,0.06)] hover:shadow-[0_8px_30px_rgba(46,125,50,0.12)] hover:border-emerald-300 transition-all text-center relative overflow-hidden group"
          >
            <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent group-hover:via-emerald-500 transition-all" />
            <div className="text-3xl sm:text-4xl font-extrabold text-[#1b5e20] mb-1">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              {stat.label}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stat.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Our Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Mission Box */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          onMouseEnter={() => setHoveredBox('mission')}
          onMouseLeave={() => setHoveredBox(null)}
          className={`group relative p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm transition-all duration-300 flex flex-col justify-between space-y-4 overflow-visible ${
            hoveredBox === 'mission'
              ? 'shadow-[0_12px_28px_-6px_rgba(239,68,68,0.12),0_8px_20px_-6px_rgba(37,99,235,0.12)] -translate-y-1 border-slate-300'
              : 'hover:shadow-md hover:border-slate-300'
          }`}
        >
          {/* Neon Dual Border Beam: Racing animated lines around perimeter */}
          <NeonDualBorderBeam 
            borderRadius={24} 
            isHovered={hoveredBox === 'mission'} 
            duration={7} 
          />

          <div className="space-y-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#2e7d32] group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-[#2e7d32] transition-colors">
              Our Mission (ہمارا مشن)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To provide a modern, elegant, and distraction-free Islamic platform that enables Muslims everywhere to read, listen, and understand the Holy Quran, practice daily Sunnah, and fulfill their religious obligations with ease and authenticity.
            </p>
            <p className="font-urdu text-sm text-slate-700 leading-relaxed" dir="rtl">
              ہمارا مشن امتِ مسلمہ کو ایسا معیاری اور پاکیزہ ڈیجیٹل ماحول فراہم کرنا ہے جہاں قرآن مجید کی تلاوت، صحیح احادیث کا مطالعہ، نماز کے درست اوقات اور مسنون دعائیں ایک ہی کلک پر دستیاب ہوں۔
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#2e7d32] relative z-10">
            <CheckCircle2 className="w-4 h-4" />
            <span>Free forever • Uncompromised authentic sources</span>
          </div>
        </motion.div>

        {/* Vision Box */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          onMouseEnter={() => setHoveredBox('vision')}
          onMouseLeave={() => setHoveredBox(null)}
          className={`group relative p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm transition-all duration-300 flex flex-col justify-between space-y-4 overflow-visible ${
            hoveredBox === 'vision'
              ? 'shadow-[0_12px_28px_-6px_rgba(239,68,68,0.12),0_8px_20px_-6px_rgba(37,99,235,0.12)] -translate-y-1 border-slate-300'
              : 'hover:shadow-md hover:border-slate-300'
          }`}
        >
          {/* Neon Dual Border Beam: Racing animated lines around perimeter */}
          <NeonDualBorderBeam 
            borderRadius={24} 
            isHovered={hoveredBox === 'vision'} 
            duration={7} 
          />

          <div className="space-y-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
              <Globe2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
              Our Vision (ہمارا وژن)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To become the most reliable, respected, and user-friendly digital resource for Islamic knowledge globally, helping believers strengthen their spiritual connection with Allah (SWT) in their daily lives.
            </p>
            <p className="font-urdu text-sm text-slate-700 leading-relaxed" dir="rtl">
              ہماری منزل دنیا بھر کے مسلمانوں کو ایک مستند اور شفاف پلیٹ فارم پر متحد کرنا ہے جو دلوں میں اسلامی تعلیمات اور خشوع و خضوع پیدا کرے۔
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-700 relative z-10">
            <CheckCircle2 className="w-4 h-4" />
            <span>Universal Ummah-centric design</span>
          </div>
        </motion.div>
      </div>

      {/* 4. Core Pillars of IslamicPath */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Core Foundations &amp; Principles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-urdu" dir="rtl">
            اسلامک پاتھ کے بنیادی اصول و اقدار
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            const isHovered = hoveredPillar === idx;

            return (
              <motion.div 
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                onMouseEnter={() => setHoveredPillar(idx)}
                onMouseLeave={() => setHoveredPillar(null)}
                className={`group relative p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all duration-300 flex flex-col justify-between space-y-4 overflow-visible cursor-pointer ${
                  isHovered
                    ? 'shadow-[0_12px_28px_-6px_rgba(239,68,68,0.12),0_8px_20px_-6px_rgba(37,99,235,0.12)] -translate-y-1 border-slate-300'
                    : 'hover:shadow-md hover:border-slate-300'
                }`}
              >
                {/* Neon Dual Border Beam */}
                <NeonDualBorderBeam 
                  borderRadius={16} 
                  isHovered={isHovered} 
                  duration={7} 
                />

                <div className="space-y-4 relative z-10">
                  {/* Big Animated Icon Badge */}
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${val.accent} flex items-center justify-center border shadow-sm transition-all duration-300 group-hover:scale-105`}
                    animate={val.anim.animate}
                    transition={val.anim.transition}
                  >
                    <motion.div
                      animate={isHovered ? { rotate: val.anim.hoverRotate } : {}}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                      <Icon className="w-8 h-8 drop-shadow-xs" />
                    </motion.div>
                  </motion.div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#2e7d32] transition-colors">{val.title}</h3>
                    <div className="font-urdu text-xs text-[#2e7d32] font-semibold mt-0.5" dir="rtl">{val.urduTitle}</div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 5. Authentic Canonical Sources & Verification */}
      <div className="p-8 rounded-3xl bg-[#f8faf9] border border-emerald-100 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#2e7d32] uppercase tracking-wider">References &amp; Standards</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Authentic Islamic Texts We Rely Upon</h2>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-emerald-100 text-[#1b5e20] text-xs font-semibold self-start md:self-auto">
            100% Scholarly Verified
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {authenticSources.map((src, i) => {
            const Icon = src.icon;
            const isHovered = hoveredSource === i;

            return (
              <motion.div 
                key={i} 
                whileHover={{ y: -4, scale: 1.025 }}
                onMouseEnter={() => setHoveredSource(i)}
                onMouseLeave={() => setHoveredSource(null)}
                className={`group relative p-4 rounded-2xl bg-white border border-slate-200/90 text-center space-y-2.5 transition-all duration-300 flex flex-col items-center justify-between overflow-visible cursor-pointer min-h-[175px] ${
                  isHovered
                    ? 'shadow-[0_12px_28px_-6px_rgba(239,68,68,0.12),0_8px_20px_-6px_rgba(37,99,235,0.12)] -translate-y-1 border-slate-300'
                    : 'hover:shadow-md hover:border-slate-300'
                }`}
              >
                {/* Neon Dual Border Beam */}
                <NeonDualBorderBeam 
                  borderRadius={16} 
                  isHovered={isHovered} 
                  duration={6} 
                />

                {/* Big Animated Icon */}
                <motion.div 
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 relative z-10 shadow-xs ${src.accent}`}
                  animate={src.anim.animate}
                  transition={src.anim.transition}
                >
                  <motion.div
                    animate={isHovered ? { rotate: src.anim.hoverRotate } : {}}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    <Icon className="w-7 h-7 drop-shadow-xs" />
                  </motion.div>
                </motion.div>

                <div className="space-y-1 relative z-10 w-full">
                  <div className="font-urdu text-[13px] text-[#2e7d32] font-semibold" dir="rtl">{src.urduName}</div>
                  <div className="font-bold text-xs text-slate-800 leading-snug group-hover:text-[#2e7d32] transition-colors">{src.name}</div>
                  <div className="text-[10px] text-slate-500 leading-tight line-clamp-2">{src.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 6. Call to Action Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#20683a] to-[#2e7d32] p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgba(46,125,50,0.2)]">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold">Support IslamicPath</h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Help us maintain servers, enrich Islamic translations, and keep this platform 100% free and ad-free for the worldwide Muslim community.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {onOpenDonate && (
            <button
              onClick={onOpenDonate}
              className="px-6 py-3 rounded-full bg-white text-[#20683a] hover:bg-emerald-50 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <HandHeart className="w-4 h-4 text-emerald-700" />
              <span>Donate Now</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('home')}
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};
