import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Download, Star, CheckCircle2, QrCode } from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#60af25] to-[#48a124] shadow-md flex flex-col items-center justify-center text-white border border-[#449921] shrink-0">
              <span className="font-arabic text-base leading-none font-bold pt-0.5">إسلام</span>
              <span className="text-xs font-black tracking-tight leading-none">360</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-[#111827]">
                Islam360 Mobile App
              </h3>
              <p className="text-xs text-slate-500">
                World's 1st &amp; Only Comprehensive Islamic Search Engine
              </p>
              <div className="flex items-center space-x-1 mt-0.5 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-slate-600 font-bold ml-1">4.8 (10M+ Downloads)</span>
              </div>
            </div>
          </div>

          {/* Download Platforms */}
          <div className="space-y-3">
            {/* Apple App Store */}
            <a
              href="https://apps.apple.com/app/islam360"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-[#2e7d32] hover:bg-emerald-50/50 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.96c.61-.75 1.04-1.8 1.01-2.96-1.01.05-2.23.68-2.93 1.5-.56.63-.99 1.68-.89 2.76 1.13.09 2.24-.55 2.81-1.3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Download on the</div>
                  <div className="text-sm font-bold text-[#111827]">Apple App Store</div>
                </div>
              </div>
              <Download className="w-5 h-5 text-slate-400 group-hover:text-[#2e7d32]" />
            </a>

            {/* Google Play Store */}
            <a
              href="https://play.google.com/store/apps/details?id=com.islam360"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-[#2e7d32] hover:bg-emerald-50/50 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current text-emerald-400" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186c-.378-.42-.61-.994-.61-1.636V3.45c0-.642.232-1.216.61-1.636zm11.233 11.235l2.428 2.429-11.75 6.784 9.322-9.213zm0-2.098L5.52 1.737l11.75 6.785-2.428 2.428zm1.488 1.05l3.87-2.235c.67-.387.67-1.02 0-1.406l-3.87-2.235-2.095 2.095 2.095 2.095z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Get it on</div>
                  <div className="text-sm font-bold text-[#111827]">Google Play Store</div>
                </div>
              </div>
              <Download className="w-5 h-5 text-slate-400 group-hover:text-[#2e7d32]" />
            </a>

            {/* Huawei AppGallery */}
            <a
              href="https://appgallery.huawei.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-[#2e7d32] hover:bg-emerald-50/50 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.96-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Explore it on</div>
                  <div className="text-sm font-bold text-[#111827]">Huawei AppGallery</div>
                </div>
              </div>
              <Download className="w-5 h-5 text-slate-400 group-hover:text-[#2e7d32]" />
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-[#2e7d32] flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>You can also continue using all features seamlessly here on the web!</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
