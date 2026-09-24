import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  Send, 
  MessageSquare, 
  Clock, 
  Globe2, 
  CheckCircle2, 
  Sparkles,
  PhoneCall,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab } from '../types';

interface ContactSectionProps {
  setActiveTab?: (tab: ActiveTab) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ setActiveTab }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#12381e] via-[#1b5e20] to-[#0d2d14] text-white p-8 sm:p-12 shadow-lg border border-emerald-500/30">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Contact &amp; Support • رابطہ و معاونت</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            We Are Here to <span className="text-amber-300">Assist &amp; Guide</span> You
          </h1>

          <p className="font-urdu text-lg sm:text-xl text-emerald-100/95 leading-relaxed" dir="rtl">
            اگر آپ کا کوئی سوال، علمی استفسار، رائے یا تکنیکی رہنمائی درکار ہے تو ہم سے بلا جھجھک رابطہ فرمائیں۔
          </p>

          <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed max-w-2xl">
            Whether you have questions regarding Quranic verses, Hadith authentications, feedback on the app, or partnership inquiries, our dedicated Islamic support team is available to assist you.
          </p>
        </div>
      </div>

      {/* 2. Three Main Contact Channels with Icon Animations & Effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Email Card */}
        <div className="group relative rounded-3xl bg-white border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="space-y-5">
            {/* Animated Icon Container */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#2e7d32] group-hover:bg-[#2e7d32] group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                <Mail className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100/70 text-[#1b5e20]">
                24/7 Response
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Official Support Email</h3>
              <p className="font-urdu text-xs text-slate-500 mt-0.5" dir="rtl">ای میل پر رابطہ کیجیے</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-emerald-200 transition-colors flex items-center justify-between">
                <div className="truncate">
                  <div className="text-xs text-slate-400 font-medium">Primary:</div>
                  <a 
                    href="mailto:inffo.ghulammustafa@gmail.com" 
                    className="text-sm font-bold text-slate-800 hover:text-[#2e7d32] transition-colors truncate block"
                  >
                    inffo.ghulammustafa@gmail.com
                  </a>
                </div>
                <button
                  onClick={() => handleCopy('inffo.ghulammustafa@gmail.com', 'email1')}
                  className="p-2 rounded-xl text-slate-400 hover:text-[#2e7d32] hover:bg-emerald-50 transition-all cursor-pointer"
                  title="Copy Email"
                >
                  {copiedType === 'email1' ? (
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-emerald-200 transition-colors flex items-center justify-between">
                <div className="truncate">
                  <div className="text-xs text-slate-400 font-medium">Inquiries:</div>
                  <a 
                    href="mailto:support@islamicpath.org" 
                    className="text-sm font-bold text-slate-800 hover:text-[#2e7d32] transition-colors truncate block"
                  >
                    support@islamicpath.org
                  </a>
                </div>
                <button
                  onClick={() => handleCopy('support@islamicpath.org', 'email2')}
                  className="p-2 rounded-xl text-slate-400 hover:text-[#2e7d32] hover:bg-emerald-50 transition-all cursor-pointer"
                  title="Copy Email"
                >
                  {copiedType === 'email2' ? (
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <a
              href="mailto:inffo.ghulammustafa@gmail.com"
              className="w-full py-3 rounded-2xl bg-emerald-50 hover:bg-[#2e7d32] text-[#2e7d32] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose Email Now</span>
            </a>
          </div>
        </div>

        {/* Phone & Helpline Card */}
        <div className="group relative rounded-3xl bg-white border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="space-y-5">
            {/* Animated Icon Container */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-sm">
                <PhoneCall className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100/70 text-amber-900">
                Helpline &amp; WhatsApp
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone &amp; Mobile</div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Direct Calling &amp; WhatsApp</h3>
              <p className="font-urdu text-xs text-slate-500 mt-0.5" dir="rtl">فون اور واٹس ایپ پر رابطہ</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-amber-200 transition-colors flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Helpline:</div>
                  <a 
                    href="tel:+923001234567" 
                    className="text-sm font-bold text-slate-800 hover:text-amber-700 transition-colors"
                  >
                    +92 (300) 123-4567
                  </a>
                </div>
                <button
                  onClick={() => handleCopy('+923001234567', 'phone1')}
                  className="p-2 rounded-xl text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-all cursor-pointer"
                  title="Copy Phone Number"
                >
                  {copiedType === 'phone1' ? (
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-amber-200 transition-colors flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">WhatsApp Community:</div>
                  <a 
                    href="tel:+923219876543" 
                    className="text-sm font-bold text-slate-800 hover:text-amber-700 transition-colors"
                  >
                    +92 (321) 987-6543
                  </a>
                </div>
                <button
                  onClick={() => handleCopy('+923219876543', 'phone2')}
                  className="p-2 rounded-xl text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-all cursor-pointer"
                  title="Copy Phone Number"
                >
                  {copiedType === 'phone2' ? (
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Physical Address Card */}
        <div className="group relative rounded-3xl bg-white border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="space-y-5">
            {/* Animated Icon Container */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:translate-y-[-4px] transition-all duration-300 shadow-sm">
                <MapPin className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100/70 text-blue-900">
                Head Office
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Office Location</div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Research &amp; Guidance Secretariat</h3>
              <p className="font-urdu text-xs text-slate-500 mt-0.5" dir="rtl">دفتر کا پتہ</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-blue-200 transition-colors space-y-2">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                IslamicPath Foundation &amp; Research Center, Main Shahrah-e-Faisal, Karachi / Islamabad, Pakistan.
              </p>
              <p className="font-urdu text-xs text-slate-600 leading-relaxed" dir="rtl">
                شاہراہِ اسلام ریسرچ سینٹر، مین شاہراہِ فیصل، پاکستان
              </p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Mon – Fri: 9:00 AM – 6:00 PM PKT</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleCopy('IslamicPath Foundation, Main Shahrah-e-Faisal, Karachi, Pakistan', 'address')}
              className="w-full py-3 rounded-2xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedType === 'address' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>Address Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Complete Address</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Interactive Send Message Form */}
      <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#2e7d32] uppercase tracking-wider">Direct Message</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Send us an Inquiry or Feedback
            </h2>
            <p className="font-urdu text-xs sm:text-sm text-slate-500 mt-1" dir="rtl">
              ہمیں اپنا پیغام یا سوال ارسال کریں، ہم جلد از جلد رابطہ کریں گے۔
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#2e7d32]" />
            <span>Your information is private and secure</span>
          </div>
        </div>

        {formSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1b5e20] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#1b5e20]">
              جَزَاكُمُ ٱللَّٰهُ خَيْرًا (Thank You!)
            </h3>
            <p className="text-sm text-slate-700 max-w-md mx-auto">
              آپ کا پیغام کامیابی کے ساتھ موصول ہو چکا ہے۔ ہماری ریسرچ اور سپورٹ ٹیم جلد ہی آپ کی ای میل پر جواب ارسال کرے گی۔
            </p>
            <p className="text-xs text-slate-500">
              We have received your message and will respond to <strong>{formData.email}</strong> shortly.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', subject: '', category: 'general', message: '' });
                }}
                className="px-6 py-2.5 rounded-full bg-[#2e7d32] text-white font-bold text-xs hover:bg-[#256629] transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Your Name (آپ کا نام) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Email Address (ای میل پتہ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Phone Number (فون نمبر - اختیاری)
                </label>
                <input
                  type="tel"
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Inquiry Category (موضوع کی نوعیت)
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                >
                  <option value="general">عام معلومات (General Inquiry)</option>
                  <option value="quran-hadith">قرآن و حدیث استفسار (Quran &amp; Hadith Question)</option>
                  <option value="feedback">تجاویز و فیڈ بیک (App Feedback / Suggestion)</option>
                  <option value="bug">تکنیکی مسئلہ (Technical Bug Report)</option>
                  <option value="donation">عطیات و تعاون (Donation Support)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Subject (عنوان)
              </label>
              <input
                type="text"
                placeholder="Brief summary of your question"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Your Message (آپ کا پیغام) <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Please describe your question or message in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2e7d32] focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500">
                All inquiries are answered by our authentic Islamic research editorial team.
              </p>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#2e7d32] hover:bg-[#256629] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message (پیغام ارسال کریں)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
