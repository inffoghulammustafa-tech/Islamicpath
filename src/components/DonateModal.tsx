import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShieldCheck, Check, Sparkles, CreditCard, Building2, Gift } from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'paypal'>('card');
  const [submitted, setSubmitted] = useState(false);

  const amounts = [10, 25, 50, 100, 250, 500];

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2e7d32] mx-auto flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#111827]">JazakAllah Khair!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                May Allah accept your generous contribution and make it a source of continuous Sadaqah Jariyah for you and your family.
              </p>
              <p className="text-xs font-urdu text-[#2e7d32]">
                مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ
              </p>
            </div>
          ) : (
            <form onSubmit={handleDonate} className="space-y-6">
              {/* Modal Header */}
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#2e7d32] text-xs font-bold">
                  <Heart className="w-3.5 h-3.5 fill-[#2e7d32]" />
                  <span>Support Free Islamic Education</span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#111827]">
                  Support Islam360
                </h3>
                <p className="text-xs text-slate-500">
                  Help us keep the Holy Quran, authentic Hadiths, and Islamic AI accessible to millions around the world without ads.
                </p>
              </div>

              {/* Amount Selection Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Donation Amount (USD)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {amounts.map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-[#2e7d32] text-white border-[#2e7d32] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Or enter custom amount ($)"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    if (e.target.value) setSelectedAmount(Number(e.target.value));
                  }}
                  className="w-full mt-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2e7d32]"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'bank', label: 'Bank Transfer', icon: Building2 },
                    { id: 'paypal', label: 'PayPal', icon: Gift },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center space-y-1 transition-all ${
                          paymentMethod === method.id
                            ? 'bg-emerald-50 text-[#2e7d32] border-[#2e7d32]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#287d46] hover:bg-[#20683a] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Donate ${customAmount ? customAmount : selectedAmount} Now</span>
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Secure &amp; Shariah-Compliant Non-Profit Initiative</span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
