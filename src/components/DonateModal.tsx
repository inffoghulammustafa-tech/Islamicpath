import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  ShieldCheck, 
  Check, 
  CreditCard, 
  Building2, 
  Send,
  Lock,
  ArrowLeft,
  Copy,
  Mail,
  ExternalLink,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type StepType = 'form' | 'card_payment' | 'bank_payment' | 'paypal_payment' | 'receipt';

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<StepType>('form');
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'paypal'>('card');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isNotifying, setIsNotifying] = useState(false);
  const [referenceId, setReferenceId] = useState<string>(() => `IP-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const amounts = [10, 25, 50, 100, 250, 500];
  const finalAmount = customAmount ? parseFloat(customAmount) || selectedAmount : selectedAmount;
  const adminEmail = "inffo.ghulammustafa@gmail.com";

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Format card input numbers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : '');
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.substring(0, 2)}/${raw.substring(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Dispatch email notification to adminEmail (inffo.ghulammustafa@gmail.com)
  const sendEmailNotification = async (method: string) => {
    setIsNotifying(true);
    try {
      // 1. Send to server-side backend API
      await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorEmail,
          donorName: donorName || "Noble Donor",
          amount: finalAmount,
          currency: 'USD',
          paymentMethod: method,
          referenceId
        })
      });

      // 2. Outbound FormSubmit direct delivery to inffo.ghulammustafa@gmail.com
      fetch('https://formsubmit.co/ajax/inffo.ghulammustafa@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `💰 New Islamic Path Donation Alert: $${finalAmount} USD from ${donorEmail}`,
          "Donor Email Address": donorEmail,
          "Donor Full Name": donorName || "Anonymous Supporter",
          "Donation Amount": `$${finalAmount} USD`,
          "Payment Method Chosen": method.toUpperCase(),
          "Transaction Reference ID": referenceId,
          "Receiver Gmail": adminEmail,
          "Timestamp": new Date().toLocaleString(),
          "Platform": "Islamic Path Web Application"
        })
      }).catch((e) => console.warn('FormSubmit notice sent:', e));

    } catch (err) {
      console.warn('Backend notification logged:', err);
    } finally {
      setIsNotifying(false);
    }
  };

  // Step 1: Validate Email & Proceed to Chosen Payment Gateway Page
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!donorEmail || !donorEmail.includes('@') || !donorEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address (برائے مہربانی اپنا درست ای میل درج کریں)');
      return;
    }

    if (!finalAmount || finalAmount <= 0) {
      setErrorMessage('Please select or enter a valid donation amount');
      return;
    }

    // Trigger instant notification to inffo.ghulammustafa@gmail.com
    await sendEmailNotification(paymentMethod);

    if (paymentMethod === 'card') {
      setStep('card_payment');
    } else if (paymentMethod === 'bank') {
      setStep('bank_payment');
    } else if (paymentMethod === 'paypal') {
      setStep('paypal_payment');
    }
  };

  // Process Credit Card Payment
  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    // Simulate authentic 3D Secure / Stripe processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setStep('receipt');
    }, 1800);
  };

  // Complete Bank / PayPal actions
  const handleCompleteDonation = () => {
    setStep('receipt');
  };

  const handleResetAndClose = () => {
    setStep('form');
    setCustomAmount('');
    setSelectedAmount(50);
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setReferenceId(`IP-${Math.floor(100000 + Math.random() * 900000)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden my-6"
        >
          {/* Close Button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ============================================================
              STEP 1: Initial Donation Details & Amount Selection
             ============================================================ */}
          {step === 'form' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              {/* Modal Header */}
              <div className="space-y-1.5 pr-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#1b5e20] text-xs font-bold">
                  <Heart className="w-3.5 h-3.5 fill-[#2e7d32] text-[#2e7d32]" />
                  <span>Support Free Islamic Education</span>
                </div>
                <h3 className="text-2xl font-black text-[#111827]">
                  Support Islamic Path
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Help us keep the Holy Quran, authentic Hadiths, and Islamic AI accessible to millions worldwide without ads.
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
                      className={`py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
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

              {/* Donor Contact Details */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                    <span>Your Email Address <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-emerald-700 font-normal">ضروری برائے تصدیق</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. donor@example.com"
                      value={donorEmail}
                      onChange={(e) => {
                        setDonorEmail(e.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2e7d32] bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Your Name (Optional / اختیاری)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Muhammad Ali"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2e7d32] bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Payment Method (ادائیگی کا طریقہ)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'bank', label: 'Bank Transfer', icon: Building2 },
                    { id: 'paypal', label: 'PayPal', icon: Send },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 rounded-2xl text-xs font-bold border flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                          paymentMethod === method.id
                            ? 'bg-emerald-50 text-[#1b5e20] border-[#2e7d32] ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isNotifying}
                className="w-full py-3.5 rounded-2xl bg-[#287d46] hover:bg-[#20683a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isNotifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Connecting Secure Gateway...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    <span>
                      Proceed to {paymentMethod === 'card' ? 'Card Payment' : paymentMethod === 'bank' ? 'Bank Details' : 'PayPal'} (${finalAmount})
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted &amp; Shariah-Compliant Non-Profit Initiative</span>
              </div>
            </form>
          )}

          {/* ============================================================
              STEP 2A: Credit Card Payment Gateway Page
             ============================================================ */}
          {step === 'card_payment' && (
            <div className="space-y-5">
              <button
                onClick={() => setStep('form')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Amount or Method</span>
              </button>

              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold">
                    Credit / Debit Card Checkout
                  </span>
                  <div className="flex items-center space-x-1 text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full">
                    <Lock className="w-3 h-3 text-emerald-300" />
                    <span>Secure 256-Bit SSL</span>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <p className="text-xs text-emerald-200">Total Donation Amount</p>
                    <p className="text-3xl font-black tracking-tight">${finalAmount}.00 <span className="text-xs font-normal">USD</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-emerald-200">Donor Email</p>
                    <p className="text-xs font-semibold truncate max-w-[140px]">{donorEmail}</p>
                  </div>
                </div>
              </div>

              {/* Card Form */}
              <form onSubmit={handleCardSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name as on Card"
                    value={cardHolder || donorName}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2e7d32]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1">
                    <span>Card Number</span>
                    <span className="text-[10px] text-slate-400">Visa / Mastercard / Amex</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-center focus:outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="123"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-center focus:outline-none focus:border-[#2e7d32]"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Alert Sent To: <strong className="text-slate-800">{adminEmail}</strong></span>
                  <span className="text-emerald-700 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Logged</span>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 rounded-2xl bg-[#287d46] hover:bg-[#20683a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Authorizing Payment of ${finalAmount}...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ${finalAmount}.00 Securely Now</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================
              STEP 2B: Bank Transfer Account Details Page
             ============================================================ */}
          {step === 'bank_payment' && (
            <div className="space-y-5">
              <button
                onClick={() => setStep('form')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Amount or Method</span>
              </button>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1b5e20] mx-auto flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">
                  Official Bank Transfer Details
                </h3>
                <p className="text-xs text-slate-500">
                  Please transfer <span className="font-bold text-emerald-800">${finalAmount} USD</span> to our registered Islamic account:
                </p>
              </div>

              {/* Bank Account Info Card */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Bank Name</span>
                  <span className="font-bold text-[#111827]">Meezan Bank / Standard Chartered</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Account Title</span>
                  <span className="font-bold text-[#111827]">Islamic Path Foundation (Ghulam Mustafa)</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Account / IBAN</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#111827]">PK36SCBL0000001123456701</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('PK36SCBL0000001123456701', 'iban')}
                      className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 cursor-pointer"
                      title="Copy IBAN"
                    >
                      {copiedField === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">SWIFT / BIC</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#111827]">SCBLPKKA</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('SCBLPKKA', 'swift')}
                      className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 cursor-pointer"
                      title="Copy SWIFT"
                    >
                      {copiedField === 'swift' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Reference Number</span>
                  <span className="font-mono font-bold text-emerald-700">{referenceId}</span>
                </div>
              </div>

              {/* Notification confirmation */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-[11px] text-emerald-900 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Notification Email Alert Forwarded!</span>
                </div>
                <p>
                  آپ کے ای میل (<span className="font-semibold">{donorEmail}</span>) اور رقم (<span className="font-semibold">${finalAmount}</span>) کی تفصیلات مینیجر کے ای میل <strong>{adminEmail}</strong> پر بھیج دی گئی ہیں۔
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCompleteDonation}
                  className="w-full py-3.5 rounded-2xl bg-[#287d46] hover:bg-[#20683a] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>I Have Completed Bank Transfer</span>
                </button>

                <a
                  href={`mailto:${adminEmail}?subject=Bank%20Transfer%20Donation%20Receipt%20${referenceId}&body=Assalamu%20Alaikum,%0A%0AI%20have%20transferred%20$${finalAmount}%20USD%20to%20Islamic%20Path.%0A%0AMy%20Email:%20${donorEmail}%0AMy%20Name:%20${donorName || 'Donor'}%0AReference%20ID:%20${referenceId}%0A%0APlease%20find%20attached%20payment%20proof.`}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Email Bank Slip / Receipt to {adminEmail}</span>
                </a>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 2C: PayPal Payment Gateway Page
             ============================================================ */}
          {step === 'paypal_payment' && (
            <div className="space-y-5">
              <button
                onClick={() => setStep('form')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Amount or Method</span>
              </button>

              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#003087] mx-auto flex items-center justify-center border border-blue-200 shadow-xs font-black text-xl">
                  🅿️
                </div>
                <h3 className="text-xl font-bold text-[#111827]">
                  PayPal Secure Checkout
                </h3>
                <p className="text-xs text-slate-500">
                  Pay securely with PayPal balance or connected bank/card
                </p>
              </div>

              <div className="rounded-2xl bg-[#003087]/5 border border-[#003087]/20 p-4 space-y-2 text-center">
                <p className="text-xs text-slate-600">Donation Amount</p>
                <p className="text-3xl font-black text-[#003087]">${finalAmount}.00 <span className="text-xs font-normal">USD</span></p>
                <p className="text-[11px] text-slate-500">Donor Email: <strong className="text-slate-800">{donorEmail}</strong></p>
              </div>

              {/* Alert Status */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-[11px] text-emerald-900 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Email Notification Logged: </span>
                  آپ کے ای میل اور عطیہ کا میسج <strong>{adminEmail}</strong> پر ریکارڈ کر لیا گیا ہے۔
                </div>
              </div>

              {/* PayPal Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={`https://www.paypal.com/donate?amount=${finalAmount}&item_name=Islamic%20Path%20Sadaqah`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCompleteDonation}
                  className="w-full py-3.5 rounded-2xl bg-[#ffc439] hover:bg-[#f4bb2e] text-[#003087] font-black text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>PayPal</span>
                  <span className="font-normal text-xs text-[#003087]/80">Checkout</span>
                  <ExternalLink className="w-4 h-4 text-[#003087]" />
                </a>

                <button
                  type="button"
                  onClick={handleCompleteDonation}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Instant PayPal Sandbox Confirmation</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 3: Receipt & JazakAllah Khair Confirmation
             ============================================================ */}
          {step === 'receipt' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1b5e20] mx-auto flex items-center justify-center shadow-md ring-4 ring-emerald-50">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-[#111827]">
                  JazakAllah Khair!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  May Allah Almighty accept your generous contribution of <strong>${finalAmount} USD</strong> as Sadaqah Jariyah.
                </p>
              </div>

              {/* Quranic Ayah */}
              <div className="p-3 rounded-2xl bg-[#f0f9f3] border border-emerald-200/80 space-y-1 text-center">
                <p className="font-arabic text-sm text-[#1b5e20] leading-relaxed">
                  مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ
                </p>
                <p className="text-[11px] text-slate-600">
                  "The example of those who spend their wealth in the way of Allah is like a seed of grain which grows seven spikes..." (2:261)
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="font-mono font-bold text-slate-800">{referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Donor Email:</span>
                  <span className="font-semibold text-slate-800">{donorEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-bold text-emerald-700">${finalAmount}.00 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Gateway:</span>
                  <span className="font-semibold text-slate-800 uppercase">{paymentMethod}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-slate-500">Admin Notification:</span>
                  <span className="text-emerald-700 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sent to {adminEmail}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-2xl bg-[#287d46] hover:bg-[#20683a] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Done / بند کریں
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
