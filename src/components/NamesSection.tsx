import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  Heart, 
  Volume2, 
  BookOpen, 
  Star 
} from 'lucide-react';
import { NAMES_OF_ALLAH, PROPHET_NAMES } from '../data/namesOfAllahData';

export const NamesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'allah' | 'prophet'>('allah');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAllahNames = NAMES_OF_ALLAH.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      n.transliteration.toLowerCase().includes(q) ||
      n.meaningEn.toLowerCase().includes(q) ||
      n.meaningUr.includes(q) ||
      n.arabic.includes(q) ||
      String(n.id) === q.trim()
    );
  });

  const filteredProphetNames = PROPHET_NAMES.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      p.name.toLowerCase().includes(q) ||
      p.meaning.toLowerCase().includes(q) ||
      p.urdu.includes(q) ||
      p.arabic.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-[#2e7d32]" />
            <span>99 Names of Allah &amp; Asma-un-Nabi (ﷺ)</span>
            <span className="text-lg text-[#2e7d32] font-arabic">أسماء الله الحسنى</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            "To Allah belong the Most Beautiful Names, so call upon Him by them." (Surah Al-A'raf 7:180)
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="names-search-input"
            type="text"
            placeholder="Search name or meaning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2e7d32]"
          />
        </div>
      </div>

      {/* Selector Tabs: 99 Names of Allah vs Prophet Names */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActiveTab('allah')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'allah'
              ? 'bg-[#2e7d32] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>99 Names of Allah ({NAMES_OF_ALLAH.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('prophet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'prophet'
              ? 'bg-[#2e7d32] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Names of Prophet Muhammad (ﷺ)</span>
        </button>
      </div>

      {/* 99 Names Grid */}
      {activeTab === 'allah' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAllahNames.map((name) => (
            <motion.div
              key={name.id}
              id={`allah-name-${name.id}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-[#2e7d32] shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 text-[#2e7d32] text-xs font-bold flex items-center justify-center font-mono">
                    {name.id}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {name.transliteration}
                  </span>
                </div>

                {/* Arabic Calligraphy */}
                <div className="py-4 text-center">
                  <span className="text-3xl sm:text-4xl font-arabic font-bold text-[#1b5e20]">
                    {name.arabic}
                  </span>
                </div>

                {/* Urdu Meaning */}
                <p className="text-sm font-urdu text-[#2e7d32] text-center pb-1">
                  {name.meaningUr}
                </p>

                {/* English Meaning */}
                <p className="text-xs font-bold text-[#111827] text-center">
                  {name.meaningEn}
                </p>
              </div>

              {/* Explanation */}
              <div className="pt-3 border-t border-slate-100 mt-3 text-xs text-slate-500 text-center">
                {name.explanation}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Prophet Names Grid */}
      {activeTab === 'prophet' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProphetNames.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-[#2e7d32] shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 text-[#2e7d32] text-xs font-bold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-[#2e7d32] font-bold">
                    {p.name} (ﷺ)
                  </span>
                </div>

                {/* Arabic */}
                <div className="py-4 text-center">
                  <span className="text-3xl font-arabic font-bold text-[#1b5e20]">
                    {p.arabic}
                  </span>
                </div>

                {/* Urdu Meaning */}
                <p className="text-sm font-urdu text-[#2e7d32] text-center pb-1">
                  {p.urdu}
                </p>

                {/* English Meaning */}
                <p className="text-xs font-bold text-[#111827] text-center">
                  {p.meaning}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
