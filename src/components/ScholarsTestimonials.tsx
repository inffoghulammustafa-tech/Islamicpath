import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Quote,
  Star,
  CheckCircle2,
  Award,
  BookOpen,
  Share2,
  Copy,
  Check,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react';
import { SCHOLAR_QUOTES, ScholarQuote } from '../data/scholarQuotes';

export const ScholarsTestimonials: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'quran' | 'hadith' | 'guidance'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredQuotes =
    selectedCategory === 'all'
      ? SCHOLAR_QUOTES
      : SCHOLAR_QUOTES.filter((q) => q.category === selectedCategory);

  const handleCopyQuote = (quote: ScholarQuote) => {
    const textToCopy = `"${quote.quoteUrdu}"\n\n— ${quote.nameUrdu} (${quote.institutionUrdu})\nEndorsement for IslamPath`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(quote.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  return (
    <section
      id="scholars-testimonials-section"
      className="rounded-3xl bg-gradient-to-b from-white via-emerald-50/30 to-slate-50 border border-emerald-200/80 p-6 sm:p-10 shadow-sm relative overflow-hidden space-y-8"
    >
      {/* Subtle Islamic Ambient Decor Background */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center space-y-3 relative z-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-[#1b5e20] text-xs font-bold shadow-2xs">
          <Award className="w-4 h-4 text-[#2e7d32]" />
          <span>National & Global Islamic Scholars Endorsements</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
          What People Say <span className="text-[#2e7d32]">About IslamPath?</span>
        </h2>

        <p className="text-lg sm:text-xl font-urdu text-[#1b5e20] font-bold">
          علمائے کرام اور جید دینی اساتذہ کے تاثرات و ارشادات
        </p>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          پاکستان اور دنیا بھر کے نامور علمائے کرام، مفسرین اور دینی محققین کی جانب سے اسلام پاتھ کی مستند قرآنی خدمات، احادیثِ مبارکہ کے تحقیقی ذخیرے اور نماز کی درست رہنمائی پر توثیق۔
        </p>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', label: 'All Scholars', urdu: 'تمام اساتذہ' },
            { id: 'quran', label: 'Quran & Tafseer', urdu: 'فہمِ قرآن' },
            { id: 'hadith', label: 'Hadith & Fiqh', urdu: 'حدیث و فقہ' },
            { id: 'guidance', label: 'Tazkiyah & Dawah', urdu: 'تزکیہ و اصلاح' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#2e7d32] text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-400'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[11px] opacity-80 font-urdu">({cat.urdu})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Individual Effect-Rich Quote Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredQuotes.map((scholar, index) => (
            <motion.div
              key={scholar.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="group relative bg-white/95 rounded-3xl p-6 border border-slate-200/90 hover:border-[#2e7d32] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
            >
              {/* Decorative Subtle Gradient Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Watermark Quote Icon */}
              <div className="absolute top-4 right-4 text-emerald-100 group-hover:text-emerald-200/80 transition-colors pointer-events-none">
                <Quote className="w-16 h-16 opacity-30 transform rotate-12" />
              </div>

              {/* Top: Scholar Identity Bar */}
              <div className="space-y-4 relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    {/* Scholar Portrait Image with Verified Badge */}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md ring-2 ring-emerald-500/30 group-hover:ring-[#2e7d32] transition-all bg-emerald-50">
                        <img
                          src={scholar.localImageUrl || scholar.imageUrl}
                          alt={scholar.name}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback to Pinterest URL if local fails, or avatarInitials if all fail
                            const target = e.currentTarget;
                            if (target.src !== scholar.imageUrl && scholar.imageUrl) {
                              target.src = scholar.imageUrl;
                            } else {
                              target.style.display = 'none';
                              if (target.parentElement) {
                                target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'font-urdu', 'font-bold', 'text-white', 'bg-[#1b5e20]');
                                target.parentElement.innerText = scholar.avatarInitials;
                              }
                            }
                          }}
                        />
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs"
                        title="Verified Islamic Scholar"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Name and Title */}
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#2e7d32] transition-colors leading-tight">
                          {scholar.name}
                        </h3>
                      </div>
                      <p className="text-xs font-urdu font-semibold text-[#1b5e20] mt-0.5">
                        {scholar.nameUrdu}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {scholar.institution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Badge & Rating Row */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#1b5e20] text-[10px] font-bold">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>{scholar.badge}</span>
                  </span>

                  <div className="flex items-center space-x-0.5 text-amber-400">
                    {[...Array(scholar.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Scholar Statement in Urdu (Prominent) */}
                <div className="p-4 rounded-2xl bg-slate-50/80 group-hover:bg-emerald-50/40 border border-slate-100 group-hover:border-emerald-200/60 transition-colors relative">
                  <div className="text-right">
                    <p className="font-urdu text-sm sm:text-base text-slate-800 leading-loose text-justify dir-rtl">
                      "{scholar.quoteUrdu}"
                    </p>
                  </div>
                </div>

                {/* English Statement Translation */}
                <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">
                  "{scholar.quoteEnglish}"
                </p>
              </div>

              {/* Bottom: Highlight & Copy Action */}
              <div className="pt-4 mt-4 border-t border-slate-100/90 relative z-10 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg line-clamp-1">
                  {scholar.keyHighlight}
                </span>

                <button
                  onClick={() => handleCopyQuote(scholar)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-600 text-slate-600 hover:text-white text-[11px] font-medium flex items-center space-x-1 transition-all cursor-pointer whitespace-nowrap"
                  title="Copy this endorsement"
                >
                  {copiedId === scholar.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span className="text-emerald-100 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Trust & Authenticity Bottom Banner */}
      <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-[#1b5e20] shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#2e7d32]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#111827]">
              Authenticity Guaranteed across All Quranic & Hadith Resources
            </h4>
            <p className="text-xs text-slate-600 font-urdu mt-0.5">
              تمام قرآنی آیات، ترجمے اور احادیثِ مبارکہ جمہور علمائے امت کے منظور شدہ اور مستند کتب سے ماخوذ ہیں۔
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-[#2e7d32] shrink-0 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
          <HeartHandshake className="w-4 h-4 text-[#2e7d32]" />
          <span>Trusted by Millions of Believers Globally</span>
        </div>
      </div>
    </section>
  );
};
