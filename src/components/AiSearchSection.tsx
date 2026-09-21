import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  Copy, 
  Check, 
  RefreshCw, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const AiSearchSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const suggestedQuestions = [
    "What does the Holy Quran say about patience (Sabr) with verses?",
    "What are the virtues and method of Tahajjud prayer in Hadith?",
    "How to calculate Zakat on gold jewelry worn for personal use?",
    "What are the authentic Duas for anxiety, illness, and protection?",
    "Rights and virtues of parents in the light of Quran and Sunnah",
    "What are the nullifiers of fast (Roza) in Ramadan?",
  ];

  const handleAsk = async (userQuery: string) => {
    if (!userQuery.trim() || loading) return;
    setLoading(true);
    setErrorMessage(null);
    setAnswer(null);
    setSources([]);

    try {
      const response = await fetch('/api/ask-islam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery }),
      });

      const data = await response.json();
      if (response.ok && data.answer) {
        setAnswer(data.answer);
        setSources(data.sources || []);
      } else {
        setErrorMessage(data.error || 'Failed to retrieve answer. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Network connection error. Please verify the server is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pb-4 border-b border-slate-100">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#2e7d32] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#2e7d32]" />
          <span>Powered by Gemini AI &amp; Authentic Islamic Sources</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#111827] flex items-center justify-center space-x-3">
          <Bot className="w-9 h-9 text-[#2e7d32]" />
          <span>Islam360 AI Search &amp; Mufti</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Ask any question regarding the Holy Quran, authentic Hadith collections, Islamic jurisprudence (Fiqh), Duas, or daily life guidance.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="relative flex items-center"
        >
          <input
            id="ai-search-main-input"
            type="text"
            placeholder="Ask anything: e.g. What does Quran say about patience? Virtues of Durood Sharif..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            className="w-full bg-white border-2 border-slate-200 focus:border-[#2e7d32] rounded-2xl pl-5 pr-28 py-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none shadow-sm transition-all"
          />

          <button
            id="ai-search-submit-btn"
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-3 px-5 py-2.5 rounded-xl bg-[#2e7d32] hover:bg-[#256629] text-white font-bold text-xs flex items-center space-x-2 shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Ask AI</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Suggested Questions Chips */}
      <div className="space-y-2">
        <span className="text-xs text-slate-500 font-bold flex items-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#2e7d32]" />
          <span>Common Inquiries:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(sq);
                handleAsk(sq);
              }}
              className="text-left px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#2e7d32] hover:bg-emerald-50 text-xs text-slate-700 hover:text-[#2e7d32] transition-colors cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-sm text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#2e7d32] animate-spin mx-auto" />
          <p className="text-sm font-bold text-[#111827]">Searching authentic Quran &amp; Hadith databases...</p>
          <p className="text-xs text-slate-500">
            Synthesizing references from Sahih Bukhari, Sahih Muslim, and classical Tafseer
          </p>
        </div>
      )}

      {/* Error Card */}
      {errorMessage && (
        <div className="rounded-2xl p-5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong>Error: </strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Answer Output Card */}
      {answer && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6"
        >
          {/* Answer Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#2e7d32]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111827]">Islam360 AI Response</h3>
                <span className="text-[11px] text-[#2e7d32] font-semibold">Verified Islamic Knowledge</span>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#2e7d32] hover:bg-slate-100 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Answer'}</span>
            </button>
          </div>

          {/* Formatted Text Body */}
          <div className="text-sm text-slate-800 leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
            {answer}
          </div>

          {/* References & Citations */}
          {sources.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-[#2e7d32] block mb-2">
                Primary References:
              </span>
              <div className="flex flex-wrap gap-2">
                {sources.map((src, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
            <strong>Note:</strong> While this response is formulated using authentic Islamic texts and classical Tafseer, complex personalized legal or Fiqhi matters should be confirmed with a qualified local scholar or Mufti.
          </div>
        </motion.div>
      )}
    </div>
  );
};
