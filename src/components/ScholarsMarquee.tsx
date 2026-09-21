import React from 'react';
import { Award, CheckCircle2, Sparkles } from 'lucide-react';
import { SCHOLAR_QUOTES } from '../data/scholarQuotes';

export const ScholarsMarquee: React.FC = () => {
  // Duplicate list twice to ensure infinite, seamless loop at -50% translateX
  const marqueeItems = [...SCHOLAR_QUOTES, ...SCHOLAR_QUOTES];

  return (
    <section
      id="appreciated-by-scholars-section"
      className="rounded-3xl bg-gradient-to-b from-white via-[#f0f9f3] to-white border border-emerald-200/80 p-6 sm:p-10 shadow-sm relative overflow-hidden space-y-6"
    >
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-1/4 w-96 h-40 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center space-y-2.5 relative z-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-[#1b5e20] text-xs font-bold shadow-2xs">
          <Award className="w-4 h-4 text-[#2e7d32]" />
          <span>Esteemed Religious Endorsements</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Appreciated by <span className="text-[#2e7d32]">Top Scholars</span>
        </h2>

        <p className="text-base sm:text-lg font-urdu text-[#1b5e20] font-bold">
          جید اور ممتاز علمائے کرام کی توثیق و پذیرائی
        </p>

        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          پاکستان اور عالمِ اسلام کے نامور دینی اساتذہ اور محققین جن کی علمی رہنمائی اور تاثرات اسلام پاتھ کا فخر ہیں۔
        </p>
      </div>

      {/* Single Line Left-Flow Slider Container */}
      <div className="relative w-full overflow-hidden py-4 pause-on-hover select-none">
        {/* Soft edge gradient fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />

        {/* Continuous Marquee Track */}
        <div className="animate-marquee-left flex items-center space-x-5 py-2">
          {marqueeItems.map((scholar, idx) => (
            <div
              key={`${scholar.id}-${idx}`}
              className="group relative flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-[#2e7d32] shadow-xs hover:shadow-xl transition-all duration-300 flex items-center space-x-4 cursor-pointer hover:-translate-y-1"
            >
              {/* Scholar Portrait Image */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shadow-md ring-2 ring-emerald-500/30 group-hover:ring-[#2e7d32] transition-all bg-emerald-50">
                  <img
                    src={scholar.localImageUrl || scholar.imageUrl}
                    alt={scholar.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== scholar.imageUrl && scholar.imageUrl) {
                        target.src = scholar.imageUrl;
                      } else {
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.classList.add(
                            'flex',
                            'items-center',
                            'justify-center',
                            'font-urdu',
                            'font-bold',
                            'text-white',
                            'bg-[#1b5e20]'
                          );
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

              {/* Scholar Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <span className="inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#1b5e20] text-[9px] font-bold">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{scholar.badgeUrdu}</span>
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-[#111827] group-hover:text-[#2e7d32] transition-colors truncate mt-1">
                  {scholar.name}
                </h3>

                <p className="text-xs font-urdu font-semibold text-[#1b5e20] truncate">
                  {scholar.nameUrdu}
                </p>

                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {scholar.institution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
