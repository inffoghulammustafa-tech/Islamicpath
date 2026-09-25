import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Share2, 
  Smartphone, 
  X, 
  Sparkles, 
  MoreVertical,
  Monitor,
  Download,
  ExternalLink
} from 'lucide-react';

export interface InstallNotificationData {
  type: 'pc' | 'success' | 'info' | 'ios' | 'guide';
  title: string;
  message: string;
}

interface InstallFeedbackToastProps {
  notification: InstallNotificationData | null;
  onClose: () => void;
}

export const InstallFeedbackToast: React.FC<InstallFeedbackToastProps> = ({
  notification,
  onClose,
}) => {
  useEffect(() => {
    if (!notification) return;
    // Auto dismiss after 10 seconds for instructions so user has time to read
    const timer = setTimeout(() => {
      onClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`pointer-events-auto rounded-3xl p-5 shadow-2xl border backdrop-blur-md text-right ${
            notification.type === 'pc'
              ? 'bg-gradient-to-r from-[#0c3312] via-[#14471b] to-[#1b5e20] text-white border-yellow-400/40 shadow-emerald-950/60'
              : notification.type === 'success'
              ? 'bg-[#1b5e20] text-white border-emerald-400/40 shadow-emerald-950/30'
              : notification.type === 'info'
              ? 'bg-[#0f3813] text-white border-emerald-500/50 shadow-emerald-950/40'
              : notification.type === 'ios'
              ? 'bg-[#1e293b] text-white border-slate-600 shadow-slate-900/50'
              : 'bg-[#143d1a] text-white border-emerald-500/40 shadow-emerald-950/40'
          }`}
          dir="rtl"
        >
          <div className="flex items-start gap-3.5">
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {notification.type === 'pc' && (
                <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 text-yellow-300 flex items-center justify-center border border-yellow-400/40 shadow-inner">
                  <Monitor className="w-6 h-6 text-yellow-300" />
                </div>
              )}
              {notification.type === 'success' && (
                <div className="w-11 h-11 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
              {notification.type === 'info' && (
                <div className="w-11 h-11 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                  <Smartphone className="w-6 h-6" />
                </div>
              )}
              {notification.type === 'ios' && (
                <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/30">
                  <Share2 className="w-6 h-6" />
                </div>
              )}
              {notification.type === 'guide' && (
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <MoreVertical className="w-6 h-6" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm sm:text-base text-yellow-300 flex items-center gap-1.5 font-urdu">
                  <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                  {notification.title}
                </span>
                <button
                  onClick={onClose}
                  className="p-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="بند کریں"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-emerald-50 font-urdu leading-relaxed whitespace-pre-line">
                {notification.message}
              </p>

              {/* PC Specific Quick Links / Instructions */}
              {notification.type === 'pc' && (
                <div className="pt-2.5 mt-2.5 border-t border-white/15 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-yellow-200 flex items-center gap-1">
                      <Download className="w-3.5 h-3.5 text-yellow-300" />
                      محفوظ فائل: IslamicPath-islamicpath786.html
                    </span>
                    <a
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <span>براؤزر ٹیب میں فل اسکرین کھولیں</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-[11px] text-emerald-200 bg-black/20 p-2 rounded-xl flex items-center justify-between">
                    <span>گوگل پلے اسٹور پر نام: <strong>islamicpath786</strong></span>
                    <a
                      href="https://play.google.com/store/search?q=islamicpath786&c=apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-300 underline font-bold hover:text-yellow-200"
                    >
                      پلے اسٹور سرچ دیکھیں ↗
                    </a>
                  </div>
                </div>
              )}

              {notification.type === 'ios' && (
                <div className="pt-2 text-[11px] text-slate-300 flex items-center gap-2 border-t border-white/10 mt-2">
                  <span className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">Safari</span>
                  <span>Share (⎋) ➔ Add to Home Screen (+)</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
