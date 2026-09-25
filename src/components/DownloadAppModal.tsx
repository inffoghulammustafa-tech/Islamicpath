import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Smartphone, 
  Download, 
  Star, 
  CheckCircle2, 
  WifiOff, 
  Volume2, 
  Bell, 
  Tablet, 
  Share2, 
  ShieldCheck,
  Sparkles,
  Play,
  RotateCcw
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { autoAdhanEngine } from '../utils/autoAdhanEngine';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [notificationGranted, setNotificationGranted] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });
  const [installSuccess, setInstallSuccess] = useState(false);
  const [testPlaying, setTestPlaying] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await autoAdhanEngine.requestNotificationPermission();
    setNotificationGranted(granted);
  };

  const handleTestAdhan = () => {
    setTestPlaying(true);
    autoAdhanEngine.testAdhan('Fajr', 'فجر');
    setTimeout(() => setTestPlaying(false), 8000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-100 overflow-hidden space-y-6 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20 cursor-pointer"
            title="بند کریں"
          >
            <X className="w-5 h-5" />
          </button>

          {/* App Header Badge */}
          <div className="flex items-center space-x-3 pr-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-500/40 bg-emerald-50 shrink-0">
              <img
                src="/pwa-192x192.png"
                alt="Islamic Path Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = '/images/logo.jpg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#111827]">
                  Islamic Path App
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#1b5e20]">
                  Play Store / PWA
                </span>
              </div>
              <p className="text-xs text-slate-500 font-urdu mt-0.5" dir="rtl">
                شاہراہِ اسلام • آف لائن مکمل اسلامی ایپ اور خودکار اذان
              </p>
              <div className="flex items-center space-x-1 mt-1 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-slate-600 font-bold ml-1">4.9 ★ • مفت انسٹالیشن</span>
              </div>
            </div>
          </div>

          {/* 3 Core Highlight Badges (Offline, Auto Adhan, No Internet) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Feature 1: Offline */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex sm:flex-col items-center sm:items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2e7d32] text-white flex items-center justify-center shrink-0">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-950">100% بغیر انٹرنیٹ</div>
                <div className="text-[10px] text-emerald-700 leading-tight">ڈاؤنلوڈ کے بعد بغیر نیٹ ورک مکمل کام کرے گی</div>
              </div>
            </div>

            {/* Feature 2: Auto Adhan */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex sm:flex-col items-center sm:items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-950">نماز کے وقت خودکار اذان</div>
                <div className="text-[10px] text-amber-700 leading-tight">موبائل/ٹیبلیٹ اسپیکر پر اذان خود بخود چلے گی</div>
              </div>
            </div>

            {/* Feature 3: Play Store / Native */}
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200/80 flex sm:flex-col items-center sm:items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-950">موبائل اور ٹیبلیٹ سپورٹ</div>
                <div className="text-[10px] text-blue-700 leading-tight">Android, Samsung, iPad اور تمام ڈیوائسز</div>
              </div>
            </div>
          </div>

          {/* Primary Action Button: 1-Click Install or iOS Instructions */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1b5e20] to-[#2e7d32] text-white space-y-3 shadow-lg shadow-emerald-900/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4 text-emerald-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                  براہِ راست ڈیوائس پر ڈاؤنلوڈ و انسٹال
                </span>
              </div>
              {isInstalled && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold">
                  انسٹال شدہ (Installed)
                </span>
              )}
            </div>

            {isInstalled || installSuccess ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/20">
                <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-white">ایپ کامیابی سے انسٹال ہو چکی ہے!</div>
                  <div className="text-emerald-100">اب آپ اسے بغیر انٹرنیٹ کے ہوم اسکرین سے چلا سکتے ہیں، اور نماز کے وقت خودکار اذان ہوگی۔</div>
                </div>
              </div>
            ) : isInstallable ? (
              <div className="space-y-2">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>فون یا ٹیبلیٹ پر ابھی انسٹال کریں (Install App Now)</span>
                </button>
                <p className="text-[11px] text-center text-emerald-100">
                  بٹن پر کلک کریں اور "Install" کا انتخاب کریں۔ ایپ بغیر کسی اضافی سائز کے آپ کے فون میں انسٹال ہو جائے گی۔
                </p>
              </div>
            ) : isIOS ? (
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-xs space-y-2">
                <div className="font-bold text-yellow-300 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" />
                  <span>iPhone / iPad پر انسٹال کرنے کا طریقہ:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-emerald-100 text-[11px]">
                  <li>سفاری (Safari) براؤزر میں نیچے <strong>Share</strong> کا بٹن دبائیں۔</li>
                  <li>نیچے اسکرول کر کے <strong>"Add to Home Screen"</strong> پر کلک کریں۔</li>
                  <li>اب یہ آف لائن ایپ کی طرح آپ کے فون میں کام کرے گی!</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // Try install or guide user
                    if (isInstallable) {
                      handleInstallClick();
                    } else {
                      alert('براہِ کرم اپنے موبائل براؤزر کے مینو (3 ڈاٹس) پر کلک کر کے "Install App" یا "Add to Home Screen" منتخب فرمائیں۔');
                    }
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>ایپ ڈاؤنلوڈ اور ہوم اسکرین پر شامل کریں</span>
                </button>
                <p className="text-[11px] text-center text-emerald-100">
                  اینڈرائیڈ / سام سنگ / ٹیبلیٹ پر براؤزر مینو (⋮) سے "Install App" پر کلک کر کے فوراً انسٹال کر سکتے ہیں۔
                </p>
              </div>
            )}
          </div>

          {/* Test Adhan Sound & Notifications Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                خودکار اذان کی سیٹنگز و ٹیسٹ (Auto Adhan Setup)
              </span>
              <span className="text-[10px] text-slate-500 font-urdu">موبائل اسپیکر چیک</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Test Adhan Button */}
              <button
                onClick={handleTestAdhan}
                className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Volume2 className={`w-4 h-4 text-amber-700 ${testPlaying ? 'animate-bounce' : ''}`} />
                <span>{testPlaying ? 'اذان چل رہی ہے...' : 'اسپیکر ٹیسٹ کریں (Play Test Adhan)'}</span>
              </button>

              {/* Notification Permission Button */}
              <button
                onClick={handleEnableNotifications}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  notificationGranted
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Bell className="w-4 h-4 text-[#2e7d32]" />
                <span>{notificationGranted ? 'نوٹیفیکیشن فعال ہیں ✓' : 'اذان الرٹ کی اجازت دیں'}</span>
              </button>
            </div>
          </div>

          {/* Store Links for Google Play Store & App Store */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              سرکاری اسٹور لنکس (Official Store Channels)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Google Play Store */}
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 p-3 rounded-2xl border border-slate-200 hover:border-[#2e7d32] hover:bg-emerald-50/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186c-.378-.42-.61-.994-.61-1.636V3.45c0-.642.232-1.216.61-1.636zm11.233 11.235l2.428 2.429-11.75 6.784 9.322-9.213zm0-2.098L5.52 1.737l11.75 6.785-2.428 2.428zm1.488 1.05l3.87-2.235c.67-.387.67-1.02 0-1.406l-3.87-2.235-2.095 2.095 2.095 2.095z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Android &amp; Tablet</div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#2e7d32]">Google Play Store</div>
                </div>
              </a>

              {/* Apple App Store */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 p-3 rounded-2xl border border-slate-200 hover:border-[#2e7d32] hover:bg-emerald-50/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.96c.61-.75 1.04-1.8 1.01-2.96-1.01.05-2.23.68-2.93 1.5-.56.63-.99 1.68-.89 2.76 1.13.09 2.24-.55 2.81-1.3z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">iPhone &amp; iPad</div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#2e7d32]">Apple App Store</div>
                </div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
