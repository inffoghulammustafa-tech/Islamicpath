import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  Coins, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

export const ZakatSection: React.FC = () => {
  const [currency, setCurrency] = useState<string>('PKR');

  // Asset inputs
  const [cash, setCash] = useState<string>('');
  const [goldGrams, setGoldGrams] = useState<string>('');
  const [goldRatePerGram, setGoldRatePerGram] = useState<string>('24000'); // default PKR approx
  const [silverGrams, setSilverGrams] = useState<string>('');
  const [silverRatePerGram, setSilverRatePerGram] = useState<string>('310');
  const [stocks, setStocks] = useState<string>('');
  const [businessGoods, setBusinessGoods] = useState<string>('');
  const [receivables, setReceivables] = useState<string>('');

  // Deductions
  const [immediateDebts, setImmediateDebts] = useState<string>('');
  const [unpaidExpenses, setUnpaidExpenses] = useState<string>('');

  // Calculations
  const numCash = parseFloat(cash) || 0;
  const numGold = (parseFloat(goldGrams) || 0) * (parseFloat(goldRatePerGram) || 0);
  const numSilver = (parseFloat(silverGrams) || 0) * (parseFloat(silverRatePerGram) || 0);
  const numStocks = parseFloat(stocks) || 0;
  const numBusiness = parseFloat(businessGoods) || 0;
  const numReceivables = parseFloat(receivables) || 0;

  const totalAssets = numCash + numGold + numSilver + numStocks + numBusiness + numReceivables;

  const numDebts = parseFloat(immediateDebts) || 0;
  const numExpenses = parseFloat(unpaidExpenses) || 0;
  const totalDeductions = numDebts + numExpenses;

  const netWealth = Math.max(0, totalAssets - totalDeductions);

  // Nisab threshold (Silver standard: 612.36 grams)
  const silverNisabValue = 612.36 * (parseFloat(silverRatePerGram) || 0);
  const isZakatObligatory = netWealth >= silverNisabValue && silverNisabValue > 0;
  const zakatPayable = isZakatObligatory ? netWealth * 0.025 : 0;

  const handleReset = () => {
    setCash('');
    setGoldGrams('');
    setSilverGrams('');
    setStocks('');
    setBusinessGoods('');
    setReceivables('');
    setImmediateDebts('');
    setUnpaidExpenses('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-[#2e7d32]" />
            <span>Zakat Calculator</span>
            <span className="text-lg text-[#2e7d32] font-arabic">حاسبة الزكاة</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Accurate Shariah-compliant Nisab calculation on gold, silver, liquid cash, and trade inventory (2.5%)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#2e7d32] cursor-pointer"
          >
            <option value="PKR">PKR (Rs)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="SAR">SAR (ر.س)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="INR">INR (₹)</option>
          </select>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#2e7d32] hover:bg-slate-100 transition-colors text-xs flex items-center space-x-1.5 cursor-pointer"
            title="Reset form"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline font-bold">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Wealth Assets Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#111827] flex items-center space-x-2">
              <Coins className="w-5 h-5 text-[#2e7d32]" />
              <span>1. Zakatable Assets (اموالِ زکوٰۃ)</span>
            </h2>

            <div className="space-y-3.5 text-xs">
              {/* Cash */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Cash in Hand &amp; Bank Accounts ({currency})
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#2e7d32]"
                />
              </div>

              {/* Gold */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Gold Weight (Grams)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={goldGrams}
                    onChange={(e) => setGoldGrams(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#2e7d32]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Gold Rate / Gram ({currency})
                  </label>
                  <input
                    type="number"
                    placeholder="24000"
                    value={goldRatePerGram}
                    onChange={(e) => setGoldRatePerGram(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#2e7d32]"
                  />
                </div>
              </div>

              {/* Silver */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Silver Weight (Grams)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={silverGrams}
                    onChange={(e) => setSilverGrams(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#2e7d32]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Silver Rate / Gram ({currency})
                  </label>
                  <input
                    type="number"
                    placeholder="310"
                    value={silverRatePerGram}
                    onChange={(e) => setSilverRatePerGram(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#2e7d32]"
                  />
                </div>
              </div>

              {/* Trade Goods / Stocks */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Business Goods / Inventory ({currency})
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={businessGoods}
                    onChange={(e) => setBusinessGoods(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#2e7d32]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Shares, Stocks &amp; Crypto ({currency})
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={stocks}
                    onChange={(e) => setStocks(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#2e7d32]"
                  />
                </div>
              </div>

              {/* Receivables */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Loans Receivable / Money Owed to You ({currency})
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={receivables}
                  onChange={(e) => setReceivables(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#2e7d32]"
                />
              </div>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#111827] flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <span>2. Immediate Liabilities &amp; Deductions (واجب الاداء قرضے)</span>
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Debts Due Immediately ({currency})
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={immediateDebts}
                  onChange={(e) => setImmediateDebts(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#2e7d32]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Unpaid Monthly Bills / Rent ({currency})
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={unpaidExpenses}
                  onChange={(e) => setUnpaidExpenses(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#2e7d32]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#edf7f0] via-[#f4faf6] to-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2e7d32]">
                Calculation Summary
              </span>
              <h3 className="text-2xl font-black text-[#111827]">
                Total Zakat Due (2.5%)
              </h3>
              <div className="text-4xl font-black text-[#2e7d32] font-mono py-2">
                {currency} {zakatPayable.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Nisab Alert status */}
            <div className={`p-4 rounded-2xl text-xs flex items-start space-x-3 ${
              isZakatObligatory
                ? 'bg-white border border-emerald-300 text-[#1b5e20] shadow-2xs'
                : 'bg-amber-50 border border-amber-200 text-amber-900'
            }`}>
              {isZakatObligatory ? (
                <CheckCircle2 className="w-5 h-5 text-[#2e7d32] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block font-bold mb-0.5">
                  {isZakatObligatory ? 'Zakat is Obligatory (Farz)' : 'Wealth below Nisab Threshold'}
                </strong>
                <span className="text-slate-600">
                  {isZakatObligatory
                    ? `Your net eligible wealth exceeds the silver Nisab threshold (${currency} ${silverNisabValue.toLocaleString()}).`
                    : `Net wealth is less than Nisab threshold (${currency} ${silverNisabValue.toLocaleString()}). Zakat is not mandatory.`}
                </span>
              </div>
            </div>

            {/* Breakdown table */}
            <div className="space-y-2 text-xs border-t border-emerald-100 pt-4">
              <div className="flex justify-between py-1 text-slate-600 font-medium">
                <span>Total Gross Assets:</span>
                <span className="font-mono font-bold text-slate-900">{currency} {totalAssets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 font-medium">
                <span>Total Deductions:</span>
                <span className="font-mono font-bold text-rose-600">- {currency} {totalDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-900 border-t border-emerald-200 pt-2 font-bold">
                <span>Net Zakatable Wealth:</span>
                <span className="font-mono text-[#2e7d32]">{currency} {netWealth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-500">
                <span>Silver Nisab Standard (612.36g):</span>
                <span className="font-mono">{currency} {silverNisabValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Beneficiaries of Zakat from Quran */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-[#111827] flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#2e7d32]" />
              <span>Who Can Receive Zakat? (مصارفِ زکوٰۃ)</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              As per Surah At-Tawbah (9:60), Zakat is strictly for the poor (Fuqara), needy (Masakeen), administrators of Zakat, those whose hearts are to be reconciled, freeing captives, those in debt, in the cause of Allah, and the stranded traveler.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
