import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Search, 
  Copy, 
  Check, 
  BookOpen, 
  Filter, 
  Sparkles,
  Info
} from 'lucide-react';
import { DUAS_COLLECTION, DUA_CATEGORIES } from '../data/duasData';
import { DuaItem } from '../types';

export const DuasSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.title} (${dua.titleUrdu})\n\n${dua.arabic}\n\n[Transliteration]: ${dua.transliteration}\n[Urdu]: ${dua.translationUrdu}\n[English]: ${dua.translationEnglish}\n\nReference: ${dua.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDuas = DUAS_COLLECTION.filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(q) ||
      d.titleUrdu.includes(q) ||
      d.arabic.includes(q) ||
      d.translationEnglish.toLowerCase().includes(q) ||
      d.translationUrdu.includes(q);

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] flex items-center space-x-3">
            <Heart className="w-8 h-8 text-[#2e7d32]" />
            <span>Masnoon Duas &amp; Azkar</span>
            <span className="text-lg text-[#2e7d32] font-arabic">الأدعية المأثورة</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Authentic daily supplications with Arabic text, transliteration, Urdu &amp; English translations
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="dua-search-input"
            type="text"
            placeholder="Search Duas by keyword or occasion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2e7d32]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {DUA_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2e7d32] text-white border-[#2e7d32] font-bold shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Duas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDuas.length === 0 ? (
          <div className="col-span-2 bg-white border border-slate-200 p-12 text-center rounded-3xl text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No Duas found matching your search query.</p>
          </div>
        ) : (
          filteredDuas.map((dua) => {
            const isCopied = copiedId === dua.id;

            return (
              <motion.div
                key={dua.id}
                id={`dua-card-${dua.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-[#2e7d32]/50 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar: Title & Category */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">
                        {dua.title}
                      </h3>
                      <span className="text-xs text-[#2e7d32] font-urdu font-medium">{dua.titleUrdu}</span>
                    </div>

                    <button
                      onClick={() => handleCopy(dua)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:text-[#2e7d32] hover:bg-emerald-50 text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                      title="Copy Dua"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Arabic */}
                  <div className="py-3 text-right">
                    <p className="text-xl sm:text-2xl font-arabic text-[#1b5e20] leading-loose">
                      {dua.arabic}
                    </p>
                  </div>

                  {/* Transliteration */}
                  <div className="pb-2">
                    <p className="text-xs text-slate-500 font-mono italic">
                      {dua.transliteration}
                    </p>
                  </div>

                  {/* Urdu Translation */}
                  <div className="pt-2 border-t border-slate-100 text-right">
                    <p className="text-sm font-urdu text-[#2e7d32] leading-relaxed">
                      {dua.translationUrdu}
                    </p>
                  </div>

                  {/* English Translation */}
                  <div className="pt-2 border-t border-slate-100 text-left">
                    <p className="text-xs text-slate-600 italic">
                      "{dua.translationEnglish}"
                    </p>
                  </div>

                  {/* Benefit */}
                  {dua.benefit && (
                    <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-[#2e7d32] flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-[#2e7d32] shrink-0 mt-0.5" />
                      <span>{dua.benefit}</span>
                    </div>
                  )}
                </div>

                {/* Footer Reference */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Ref: <strong className="text-slate-700">{dua.reference}</strong>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {dua.category}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
