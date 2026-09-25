import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="fixed bottom-5 left-4 right-4 sm:left-6 sm:right-auto max-w-md z-50 bg-[#1b5e20] text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-emerald-400/40 backdrop-blur-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600/60 text-emerald-200 shrink-0 mt-0.5">
              <WifiOff className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">آف لائن موڈ فعال ہے (Offline Mode Active)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              </div>
              <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed">
                بغیر انٹرنیٹ کے قرآن، احادیث، دعائیں اور نماز کے وقت خودکار اذان مکمل طور پر فعال ہیں۔
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>تمام اسلامی ڈیٹا اور اذان ڈیوائس میں محفوظ ہیں۔</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-700/50 transition-colors"
            title="بند کریں"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
