import React, { useState, useId, useMemo, useEffect } from 'react';
import {
  ShoppingBag, Truck, CreditCard, CheckCircle,
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Bot,
  Loader2, Leaf, Shield, Clock, Mail, UserCheck
} from 'lucide-react';

// --- 1. GLOBAL CONFIGURATION ---
const CONFIG = {
  BRAND_NAME: "Flydry",
  BAG_WEIGHT_KG: 10,
  STANDARD_PRICE_PER_KG: 3.5,
  STANDARD_DELIVERY_FEE: 2.0,
  TRIAL_PRICE: 10,
  TRIAL_DAYS: 14,
  DISCOUNTS: { 1: 0, 3: 0.05, 6: 0.10, 12: 0.20 },
  PRICING_DATA: {
    1: { 1: { total: 30, perBag: 30 } },
    2: {
      1: { total: 46, perBag: 23 },
      2: { total: 52, perBag: 26 }
    },
    4: {
      1: { total: 80, perBag: 20 },
      2: { total: 88, perBag: 22 },
      4: { total: 96, perBag: 24 }
    }
  },
  BACKEND_URL: "https://flydry-subscription-backend.vercel.app",
  CLEANCLOUD_STORE_ID: 35905,
};

const brand = {
  copper: '#C5A059',
  copperHover: '#a3803e',
  copperLight: 'rgba(197, 160, 89, 0.08)',
  green: '#082219',
  greenLight: 'rgba(8, 34, 25, 0.05)',
};

// --- 2. UTILITY ---
const useKeyboardAction = (callback) => {
  return (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };
};

// --- 3. HERO ---
function SubscriptionHero({ onStart }) {
  const bagClipId = useId();

  const steps = useMemo(() => [
    {
      id: 'volume',
      title: "Select Volume",
      desc: `Choose 1, 2, or 4 of our Signature ${CONFIG.BAG_WEIGHT_KG}kg Bags per month.`,
      artwork: (
        <svg viewBox="0 0 64 64" className="w-20 h-20 md:w-24 md:h-24 text-[#082219] group-hover:text-[#C5A059] transition-colors duration-500 relative z-10" aria-hidden="true">
          <path d="M16 20 L48 20 L52 56 L12 56 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M24 20 C24 10, 40 10, 40 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <clipPath id={bagClipId}><path d="M16 20 L48 20 L52 56 L12 56 Z" /></clipPath>
          <g clipPath={`url(#${bagClipId})`}>
            <path d="M 0 40 Q 16 36 32 40 T 64 40 T 96 40 T 128 40 V 64 H 0 Z" fill="currentColor" fillOpacity="0.15" className="anim-wave group-hover:fill-opacity-25 transition-all duration-500" />
          </g>
          <rect x="22" y="34" width="20" height="10" rx="2" fill="currentColor" className="opacity-10 group-hover:opacity-100 transition-opacity duration-500" />
          <text x="32" y="41" fill="white" fontSize="5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">{CONFIG.BAG_WEIGHT_KG}KG</text>
        </svg>
      )
    },
    {
      id: 'routine',
      title: "Set Routine",
      desc: "Set a flexible schedule for your automated collections. No booking required.",
      artwork: (
        <svg viewBox="0 0 64 64" className="w-20 h-20 md:w-24 md:h-24 text-[#082219] group-hover:text-[#C5A059] transition-colors duration-500 relative z-10" aria-hidden="true">
          <rect x="14" y="18" width="36" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="14" y1="26" x2="50" y2="26" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="22" cy="34" r="1" fill="currentColor" opacity="0.15" />
          <circle cx="32" cy="34" r="1" fill="currentColor" opacity="0.15" />
          <circle cx="42" cy="34" r="1" fill="currentColor" opacity="0.15" />
          <circle cx="22" cy="42" r="1" fill="currentColor" opacity="0.15" />
          <circle cx="32" cy="42" r="1" fill="currentColor" opacity="0.15" />
          <circle cx="42" cy="42" r="1" fill="currentColor" opacity="0.15" />
          <circle cx="22" cy="34" r="2.5" fill="currentColor" className="anim-sparkle" />
          <circle cx="42" cy="42" r="2.5" fill="currentColor" className="anim-sparkle" style={{ animationDelay: '1s' }} />
          <path d="M 22 34 L 42 34 L 42 42" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="anim-route" />
        </svg>
      )
    },
    {
      id: 'result',
      title: "Fresh Delivery",
      desc: "Returned to your door impeccably clean and perfectly stacked.",
      artwork: (
        <svg viewBox="0 0 64 64" className="w-20 h-20 md:w-24 md:h-24 text-[#082219] group-hover:text-[#C5A059] transition-colors duration-500 relative z-10" aria-hidden="true">
          <rect x="16" y="44" width="32" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <rect x="18" y="37" width="28" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <g className="anim-drop">
             <rect x="20" y="30" width="24" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
             <rect x="20" y="30" width="24" height="5" rx="1.5" fill="currentColor" fillOpacity="0.15" />
             <path d="M 32 26 L 34 23 L 37 22 L 34 21 L 32 18 L 30 21 L 27 22 L 30 23 Z" fill="currentColor" className="anim-sparkle" style={{ animationDelay: '0.8s' }} />
          </g>
        </svg>
      )
    }
  ], [bagClipId]);

  return (
    <section aria-labelledby="subscription-hero-heading" className="relative w-full bg-white text-[#082219] pt-16 pb-10 md:pt-20 md:pb-12 overflow-hidden font-sans selection:bg-[#C5A059] selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-subtle-grid { background-image: radial-gradient(rgba(8, 34, 25, 0.04) 1px, transparent 1px); background-size: 32px 32px; }
        @keyframes wave-slide { 0% { transform: translateX(0); } 100% { transform: translateX(-64px); } }
        .anim-wave { animation: wave-slide 4s linear infinite; }
        @keyframes route-trace { 0%, 100% { stroke-dashoffset: 60; opacity: 0; } 20%, 80% { stroke-dashoffset: 0; opacity: 1; } }
        .anim-route { stroke-dasharray: 60; animation: route-trace 4s ease-in-out infinite; }
        @keyframes drop-fold { 0%, 100% { transform: translateY(-12px); opacity: 0; } 20%, 80% { transform: translateY(0); opacity: 1; } }
        .anim-drop { animation: drop-fold 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes sparkle-fade { 0%, 100% { opacity: 0; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
        .anim-sparkle { animation: sparkle-fade 2s ease-in-out infinite; transform-origin: center; }
        @keyframes travel { 0% { left: 0%; opacity: 0; transform: scaleX(0.5); } 10%, 90% { opacity: 1; transform: scaleX(1); } 100% { left: 100%; opacity: 0; transform: scaleX(0.5); } }
        .anim-travel { position: absolute; top: 50%; transform: translateY(-50%); animation: travel 6s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes shimmer-text { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .text-shimmer { background: linear-gradient(to right, #C5A059 20%, #e8d5b5 40%, #e8d5b5 60%, #C5A059 80%); background-size: 200% auto; color: transparent; -webkit-background-clip: text; background-clip: text; animation: shimmer-text 10s linear infinite; }
        .exec-card { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); background: #ffffff; }
        .exec-card:hover { transform: translateY(-4px); box-shadow: 0 24px 48px -12px rgba(8, 34, 25, 0.08), 0 0 20px rgba(197, 160, 89, 0.04); border-color: rgba(197, 160, 89, 0.25); }
        .exec-card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(circle at top left, rgba(197,160,89,0.05), transparent 70%); opacity: 0; transition: opacity 0.5s ease; pointer-events: none; }
        .exec-card:hover::before { opacity: 1; }
      `}} />

      <div className="absolute inset-0 bg-subtle-grid pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="w-full lg:w-[40%] flex flex-col justify-center text-left relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C5A059] text-[#082219] text-[11px] font-black uppercase tracking-[0.2em] mb-6 w-max shadow-lg">
            <Sparkles size={14} /> £{CONFIG.TRIAL_PRICE} Introductory Trial
          </div>

          <h2 id="subscription-hero-heading" className="text-5xl md:text-6xl lg:text-[4rem] font-black tracking-tighter uppercase italic leading-[0.9] text-[#082219] mb-5">
            Your First Bag is <br/>
            <span className="text-shimmer">Just £{CONFIG.TRIAL_PRICE}.</span>
          </h2>

          <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed max-w-lg mb-8">
            The definitive zero-friction routine. <strong className="text-[#082219]">Pay just £{CONFIG.TRIAL_PRICE} today</strong> for a full {CONFIG.BAG_WEIGHT_KG}kg Wash & Fold trial. If you love it, roll into a monthly plan. If not, cancel in 3 clicks.
          </p>

          <div className="flex flex-col gap-3 mb-8" role="list">
            {['No weighing. No hidden fees.', 'We collect, clean, and deliver.', `Risk-free ${CONFIG.TRIAL_DAYS}-day guarantee.`].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px] md:text-sm font-bold text-[#082219]" role="listitem">
                <CheckCircle2 size={18} className="text-[#9E7C2E]" aria-hidden="true" /> {item}
              </div>
            ))}
          </div>

          <button onClick={onStart} className="group inline-flex items-center justify-center w-max gap-3 bg-[#082219] text-[#C5A059] px-8 py-4 rounded-xl text-xs md:text-[13px] font-black uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#082219] transition-all shadow-[0_8px_20px_rgba(8,34,25,0.2)] hover:shadow-[0_12px_24px_rgba(197,160,89,0.3)]">
            Claim £{CONFIG.TRIAL_PRICE} Trial Bag
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" aria-hidden="true" />
          </button>
        </div>

        <div className="w-full lg:w-[60%] relative mt-4 lg:mt-0">
          <div className="absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-gray-100 hidden md:block z-0">
            <div className="anim-travel w-16 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent shadow-[0_0_15px_rgba(197,160,89,0.8)] rounded-full -ml-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 relative z-10" role="list">
            {steps.map((step) => (
              <div key={step.id} onClick={onStart} role="button" tabIndex={0}
                className="exec-card group flex flex-row md:flex-col items-center md:items-start p-6 md:p-8 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] cursor-pointer overflow-hidden relative">
                <div className="flex-shrink-0 md:w-full flex md:justify-center mb-0 md:mb-6 mr-6 md:mr-0">{step.artwork}</div>
                <div className="flex-1 md:text-center w-full">
                  <h3 className="text-[17px] md:text-[19px] font-black uppercase italic tracking-tight text-[#082219] mb-1.5 md:mb-2 group-hover:text-[#C5A059] transition-colors duration-500">{step.title}</h3>
                  <p className="text-[12px] md:text-[13px] text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 4. PLAN FINDER ---
function PlanFinder({ onApply }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [rec, setRec] = useState(null);

  const findPlan = () => {
    if (!input.trim()) return;
    setLoading(true);
    setRec(null);
    const thinkingTime = Math.random() * 1300 + 1200;

    setTimeout(() => {
      const text = input.toLowerCase();
      let bags = 2;
      let pickups = 1;
      let reason = "Our most popular 2-bag plan provides a great balance of flexibility and value.";

      const isFamily = /family|kids|children|baby|toddler|four|five|4 people|5 people|household/i.test(text);
      const isCouple = /couple|partner|husband|wife|two|2 people|we /i.test(text);
      const isSingle = /single|alone|just me|one person|1 person|myself/i.test(text);
      const isActive = /gym|workout|sport|run|train|active|sweat|daily/i.test(text);
      const isHeavy = /bedding|towels|sheets|duvet|huge|lots|mountain|heavy|bulky/i.test(text);
      const wantsWeekly = /weekly|every week|4 times/i.test(text);

      if (isFamily) {
        bags = 4; pickups = wantsWeekly || isActive ? 4 : 2;
        reason = `For a household with kids or multiple people, our 4-bag plan ensures you never fall behind.`;
      } else if (isCouple) {
        if (isActive || isHeavy) { bags = 4; pickups = 2; reason = "For couples with bulky items or activewear, 4 bags split across 2 pickups will comfortably cover everything."; }
        else { bags = 2; pickups = wantsWeekly ? 4 : 2; if (pickups === 4) bags = 4; reason = "For a couple's standard wardrobe, 2 bags is the absolute sweet spot."; }
      } else if (isSingle) {
        if (isActive || isHeavy) { bags = 2; pickups = 2; reason = "Since you have activewear or bulky items, 2 bags with bi-weekly pickups will keep your wardrobe perfectly fresh."; }
        else { bags = 1; pickups = 1; reason = "For a single person's standard routine, 1 signature bag per month is incredibly cost-effective."; }
      } else if (wantsWeekly || isHeavy) { bags = 4; pickups = wantsWeekly ? 4 : 2; reason = "Given the high volume, the 4-bag plan offers the best value per kg."; }
      else if (isActive) { bags = 2; pickups = 2; reason = "For an active routine, 2 bags with bi-weekly collections is a great setup."; }

      setRec({ bags, pickups, reason });
      setLoading(false);
    }, thinkingTime);
  };

  return (
    <div className="bg-white p-5 rounded-[1.5rem] border border-gray-200 text-left animate-in fade-in zoom-in duration-300 shadow-sm mt-6 w-full max-w-md mx-auto md:mx-0">
      <div className="flex items-center gap-2 mb-4">
        <Bot size={20} className="text-[#082219]" />
        <span className="font-black text-[#082219] uppercase tracking-widest text-xs">Flydry AI Helper</span>
      </div>
      <textarea value={input} onChange={(e) => { setInput(e.target.value); setRec(null); }}
        placeholder="E.g., I live with my partner, we work out a lot..."
        className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] resize-none text-sm font-medium transition-all"
        rows={2} />
      {rec ? (
        <div className="mt-4 p-5 rounded-xl shadow-sm border border-[#082219]/10 bg-[#082219]/5">
          <p className="text-sm font-bold mb-4 text-[#082219]"><Sparkles size={14} className="inline mr-1.5 text-[#C5A059]" />{rec.reason}</p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-black text-[#082219] text-sm uppercase tracking-wide">Recommendation: {rec.bags} Bags, {rec.pickups} Pickups</span>
            <button onClick={() => onApply(rec.bags, rec.pickups)} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#082219] text-[#C5A059] text-xs font-black uppercase tracking-widest transition-all hover:bg-[#C5A059] hover:text-[#082219] shadow-[0_4px_10px_rgba(8,34,25,0.15)]">Apply Plan</button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end mt-4">
          <button onClick={findPlan} disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#082219] text-[#C5A059] text-xs font-black uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-[#C5A059] hover:text-[#082219] shadow-[0_4px_10px_rgba(8,34,25,0.15)]">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? "Thinking..." : "Get Recommendation"}
          </button>
        </div>
      )}
    </div>
  );
}

// --- 5. MAIN APP ---
export default function App() {
  const [step, setStep] = useState(1);
  const [useTrial, setUseTrial] = useState(true);
  const [selectedBags, setSelectedBags] = useState(null);
  const [selectedDetergent, setSelectedDetergent] = useState(null);
  const [selectedPickups, setSelectedPickups] = useState(null);
  const [billingCycle, setBillingCycle] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pickupDates, setPickupDates] = useState([]);
  const [pickupTimes, setPickupTimes] = useState([]);
  const [showPlanFinder, setShowPlanFinder] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPostCode, setCustomerPostCode] = useState('');
  const [customerUnit, setCustomerUnit] = useState('');
  const [driverInstructions, setDriverInstructions] = useState('');

  const [customerExists, setCustomerExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [postCodeError, setPostCodeError] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    if (step > 1 || isSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step, isSuccess]);

  const currentPlan = (selectedBags && selectedPickups) ? CONFIG.PRICING_DATA[selectedBags][selectedPickups] : null;
  const standardPrice = (selectedBags && selectedPickups) ? (selectedBags * CONFIG.BAG_WEIGHT_KG * CONFIG.STANDARD_PRICE_PER_KG) + (selectedPickups * CONFIG.STANDARD_DELIVERY_FEE) : 0;
  const currentDiscount = CONFIG.DISCOUNTS[billingCycle];
  const discountedMonthly = currentPlan ? currentPlan.total * (1 - currentDiscount) : 0;
  const discountedPerBag = currentPlan ? currentPlan.perBag * (1 - currentDiscount) : 0;
  const upfrontTotal = discountedMonthly * billingCycle;
  const savingsPerMonth = standardPrice - discountedMonthly;
  const todayPay = (useTrial && billingCycle === 1) ? CONFIG.TRIAL_PRICE : upfrontTotal;

  const timeSlotOptions = ["Morning (8am - 12pm)", "Afternoon (12pm - 4pm)", "Evening (6pm - 10pm)"];

  const handleSelect = (setter, val, nextStep) => {
    setter(val);
    if (nextStep) setStep(nextStep);
  };

  const handleStartOver = () => {
    setStep(1);
    setSelectedBags(null);
    setSelectedDetergent(null);
    setSelectedPickups(null);
  };

  const checkEmailExists = async () => {
    if (!customerEmail.trim()) { setEmailError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) { setEmailError('Enter a valid email'); return; }
    setEmailError('');
    setIsCheckingEmail(true);

    try {
      const res = await fetch(`${CONFIG.BACKEND_URL}/api/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customerEmail })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.exists) {
          setCustomerExists(true);
          if (data.name) setCustomerName(data.name);
          if (data.phone) setCustomerPhone(data.phone);
          if (data.address) setCustomerAddress(data.address);
          if (data.postCode) setCustomerPostCode(data.postCode);
          if (data.unit) setCustomerUnit(data.unit);
        } else {
          setCustomerExists(false);
        }
      } else {
        setCustomerExists(false);
      }
    } catch (err) {
      setCustomerExists(false);
    }

    setIsCheckingEmail(false);
    setStep(5);
  };

  const validateDetailsForm = () => {
    let valid = true;
    if (!customerName.trim()) { setNameError('Name is required'); valid = false; } else { setNameError(''); }
    if (!customerPhone.trim()) { setPhoneError('Phone number is required'); valid = false; }
    else if (customerPhone.replace(/\D/g, '').length < 10) { setPhoneError('Enter a valid phone number'); valid = false; }
    else { setPhoneError(''); }
    if (!customerAddress.trim()) { setAddressError('Street address is required'); valid = false; } else { setAddressError(''); }
    if (!customerPostCode.trim()) { setPostCodeError('Postcode is required'); valid = false; } else { setPostCodeError(''); }
    return valid;
  };

  const handleSubscribe = async () => {
    if (!validateDetailsForm()) return;
    setIsProcessing(true);
    setCheckoutError('');
    try {
      const res = await fetch(`${CONFIG.BACKEND_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: customerName, email: customerEmail, phone: customerPhone, address: customerAddress, postCode: customerPostCode, unit: customerUnit, driverInstructions },
          plan: { bags: selectedBags, pickups: selectedPickups, detergent: selectedDetergent },
          pickup: { date: pickupDates[0], time: pickupTimes[0] || timeSlotOptions[0] }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setIsProcessing(false);
      setIsSuccess(true);
    } catch (err) {
      setIsProcessing(false);
      setCheckoutError(err.message);
    }
  };

  const handleFirstDateChange = (e) => {
    const val = e.target.value;
    if (!val) { setPickupDates([]); setPickupTimes([]); return; }
    setPickupDates([val]);
    setPickupTimes([timeSlotOptions[0]]);
  };

  const handleTimeChange = (idx, val) => {
    const newTimes = [...pickupTimes];
    newTimes[idx] = val;
    setPickupTimes(newTimes);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
  };

  const scrollToPlans = () => document.getElementById('subscription-plans')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // --- STEP 1: Bag Selection ---
  const renderStep1 = () => (
    <div className="relative space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .coin-front { backface-visibility: hidden; transform: rotateY(0deg) translateZ(2px); }
        .coin-back { backface-visibility: hidden; transform: rotateY(180deg) translateZ(2px); }
        @keyframes coin-flip-loop { 0%, 42% { transform: rotateY(0deg); } 50%, 92% { transform: rotateY(180deg); } 100% { transform: rotateY(360deg); } }
        .animate-coin-flip { animation: coin-flip-loop 10s cubic-bezier(0.6, -0.2, 0.4, 1.2) infinite; }
        @keyframes float-premium { 0%, 100% { transform: translateY(0px); filter: drop-shadow(0 15px 25px rgba(0,0,0,0.15)); } 50% { transform: translateY(-12px); filter: drop-shadow(0 30px 25px rgba(0,0,0,0.08)); } }
        .animate-float-premium { animation: float-premium 5s ease-in-out infinite; }
        @keyframes glow-pulse-slow { 0%, 100% { opacity: 0.5; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1.05); } }
        .animate-glow-pulse { animation: glow-pulse-slow 4s ease-in-out infinite; }
        @keyframes pedestal-reveal { 0% { opacity: 0; transform: scale(0.8) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-pedestal-reveal { animation: pedestal-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-50/50 p-6 md:p-8 rounded-[2rem] border border-gray-100">
        <div className="flex-1 text-center md:text-left w-full">
          <div className="inline-flex items-center gap-2 mb-3 bg-[#C5A059] text-[#082219] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-md">
            <Sparkles size={14} /> Start For £{CONFIG.TRIAL_PRICE}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#082219] uppercase italic tracking-tight">
            {useTrial ? `Claim Your £${CONFIG.TRIAL_PRICE} Trial` : "Choose your plan"}
          </h2>
          <p className="text-gray-500 mt-3 font-medium">
            {useTrial ? `Pay just £${CONFIG.TRIAL_PRICE} today to test the service.` : "Select your monthly volume to subscribe directly."}
          </p>

          <div className="mt-6 mb-4 bg-gray-100/80 p-1.5 rounded-2xl inline-flex w-full max-w-sm border border-gray-200">
            <button onClick={() => setUseTrial(true)} className={`flex-1 py-3 px-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${useTrial ? 'bg-[#082219] text-[#C5A059] shadow-md' : 'text-gray-500'}`}>
              {CONFIG.TRIAL_DAYS}-Day Trial (£{CONFIG.TRIAL_PRICE})
            </button>
            <button onClick={() => setUseTrial(false)} className={`flex-1 py-3 px-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${!useTrial ? 'bg-white text-[#082219] shadow-md border border-gray-200' : 'text-gray-500'}`}>
              Skip Trial
            </button>
          </div>

          <div className="mt-6 w-full max-w-md mx-auto md:mx-0">
            {!showPlanFinder ? (
              <button onClick={() => setShowPlanFinder(true)} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm transition-all hover:scale-105 border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#a3803e]">
                <Sparkles size={16} /> Not sure? Ask our AI
              </button>
            ) : (
              <PlanFinder onApply={(b, p) => { setSelectedBags(b); setSelectedPickups(p); setStep(2); }} />
            )}
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-center shrink-0">
          <div className="relative w-48 h-48 md:w-56 md:h-56 perspective-1000 animate-pedestal-reveal mt-12 mb-4 md:mt-0 md:mb-0">
            <div className="w-full h-full animate-float-premium">
              <div className="w-full h-full relative preserve-3d animate-coin-flip group">
                <div className="absolute inset-0 coin-front bg-white rounded-full border border-gray-100 shadow-inner flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.15)_0%,transparent_70%)] rounded-full animate-glow-pulse pointer-events-none"></div>
                  <img src="https://raw.githubusercontent.com/asho221/Flydry-website/main/FDbag.png" alt="Flydry Signature Bag"
                    className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0 coin-back bg-[#082219] rounded-full border-4 border-[#0a2b20] shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(197,160,89,0.2)_0%,transparent_70%)] rounded-full pointer-events-none"></div>
                  <ShoppingBag size={24} className="text-[#C5A059] mb-2 relative z-10" />
                  <span className="text-[#C5A059] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1 relative z-10">Capacity</span>
                  <span className="text-4xl md:text-5xl font-black text-white leading-none relative z-10 tracking-tighter">{CONFIG.BAG_WEIGHT_KG}KG</span>
                  <div className="w-10 h-px bg-white/20 my-3 relative z-10"></div>
                  <span className="text-[10px] md:text-xs text-gray-300 font-bold uppercase tracking-widest leading-tight text-center relative z-10">Holds ~40 Items</span>
                  <span className="text-[8px] md:text-[9px] text-[#C5A059] font-black uppercase tracking-widest mt-2 relative z-10">Water-Resistant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:grid flex-nowrap overflow-x-auto md:overflow-visible md:grid-cols-3 gap-4 md:gap-5 relative z-10 pb-6 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory hide-scroll">
        {[1, 2, 4].map((bagCount) => {
          const minPrice = Math.min(...Object.values(CONFIG.PRICING_DATA[bagCount]).map(p => p.total));
          const isSelected = selectedBags === bagCount;

          return (
            <button key={bagCount} onClick={() => handleSelect(setSelectedBags, bagCount, 2)}
              className={`w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-center group flex flex-col items-center justify-center p-6 border transition-all duration-300 rounded-[1.5rem]
                ${isSelected ? 'shadow-[0_12px_24px_rgba(197,160,89,0.15)] transform md:scale-[1.02] border-[#C5A059]' : 'border-gray-100 bg-white hover:border-[#C5A059] hover:bg-[#C5A059]/5 md:hover:scale-[1.02] hover:shadow-lg'}`}
              style={isSelected ? { backgroundColor: brand.copperLight } : {}}>
              <div className="flex items-center justify-center h-16 mb-4">
                {Array.from({ length: bagCount }).map((_, i) => (
                  <div key={i}
                    className={`rounded-full border-[3px] border-white flex items-center justify-center transition-all duration-300 shadow-sm
                      ${!isSelected ? 'bg-gray-100 text-gray-400 group-hover:bg-[#082219] group-hover:text-[#C5A059] group-hover:border-white' : ''}
                      ${i > 0 ? (bagCount === 4 ? '-ml-5' : '-ml-3') : ''}`}
                    style={{
                      width: bagCount === 4 ? '40px' : '56px',
                      height: bagCount === 4 ? '40px' : '56px',
                      ...(isSelected ? { backgroundColor: '#082219', color: '#C5A059' } : {}),
                      zIndex: 10 - i
                    }}>
                    <ShoppingBag size={bagCount === 4 ? 18 : 26} strokeWidth={1.5} />
                  </div>
                ))}
              </div>

              <div className="text-center">
                <span className="text-xl font-black text-[#082219] uppercase tracking-tight">{bagCount} {bagCount === 1 ? 'Bag' : 'Bags'}</span>
                <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">({bagCount * CONFIG.BAG_WEIGHT_KG} KG)</div>
                {useTrial && bagCount > 1 && (
                  <div className="mt-2 inline-block text-[9px] text-[#C5A059] font-black uppercase tracking-widest bg-[#C5A059]/10 px-2 py-1 rounded border border-[#C5A059]/20">
                    *Trial includes 1 bag
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-col items-center w-full pt-5 border-t border-gray-100 relative">
                {useTrial ? (
                  <>
                    <div className="absolute -top-3 bg-[#082219] px-3 py-1 rounded-full text-[10px] text-[#C5A059] font-black uppercase shadow-md">1st Bag Trial</div>
                    <div className="flex items-start gap-1 text-[#082219] mb-1">
                      <span className="text-2xl font-bold mt-1">£</span>
                      <span className="text-5xl font-black leading-none">{CONFIG.TRIAL_PRICE}</span>
                    </div>
                    <div className="mt-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 w-full text-center">
                      Then £{minPrice}/mo
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`text-sm font-black px-4 py-1.5 rounded-full border transition-colors duration-300 ${isSelected ? 'bg-white border-[#C5A059]/30 text-[#082219]' : 'bg-gray-50 border-gray-100 text-gray-600 group-hover:bg-white group-hover:border-[#C5A059]/30 group-hover:text-[#082219]'}`}>
                      From £{minPrice}<span className="text-xs font-semibold opacity-80">/mo</span>
                    </div>
                    <span className="text-[11px] text-gray-500 mt-3 text-center font-bold uppercase tracking-wider">
                      {bagCount === 1 ? 'Max 1 pickup' : bagCount === 2 ? '1 or 2 pickups' : '1, 2 or 4 pickups'}
                    </span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // --- STEP 2: Detergent ---
  const renderStep2 = () => {
    const opts = [
      { id: 'bio', title: 'Premium Bio', desc: 'Tough on stains & odors', icon: Sparkles, recommended: true },
      { id: 'eco', title: 'Eco-Friendly Non-Bio', desc: 'Gentle on planet & fabric', icon: Leaf },
      { id: 'sensitive', title: 'Sensitive Skin', desc: 'Zero fragrance or dyes', icon: Shield }
    ];
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-[#082219] uppercase italic tracking-tight">Choose your care</h2>
          <p className="text-gray-500 mt-3 font-medium">Not sure? <strong className="text-[#082219]">Premium Bio</strong> is our standard, perfect for 95% of everyday laundry.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {opts.map((opt) => {
            const isSelected = selectedDetergent === opt.id;
            return (
              <div key={opt.id} tabIndex={0} role="button"
                onKeyDown={useKeyboardAction(() => handleSelect(setSelectedDetergent, opt.id, 3))}
                onClick={() => handleSelect(setSelectedDetergent, opt.id, 3)}
                className={`group relative flex flex-col items-center justify-center p-8 border transition-all duration-300 rounded-[1.5rem] cursor-pointer outline-none focus:ring-2 focus:ring-[#C5A059]
                  ${isSelected ? 'shadow-[0_12px_24px_rgba(197,160,89,0.15)] transform scale-[1.02] border-[#C5A059]' : 'bg-white border-gray-100 hover:border-[#C5A059] hover:bg-[#C5A059]/5 hover:scale-[1.02] hover:shadow-lg'}`}
                style={isSelected ? { backgroundColor: brand.copperLight } : {}}>
                {opt.recommended && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#082219] text-[#C5A059] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-md z-10 border border-[#C5A059]/20">Recommended Default</div>
                )}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-colors ${isSelected ? 'bg-[#082219] text-[#C5A059] shadow-md' : 'bg-gray-50 text-gray-400 group-hover:bg-[#082219] group-hover:text-[#C5A059]'}`}>
                  <opt.icon size={28} />
                </div>
                <h3 className="font-black uppercase tracking-wide mb-2 text-[#082219]">{opt.title}</h3>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase text-center">{opt.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-start max-w-4xl mx-auto pt-8">
          <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#082219] font-bold uppercase tracking-widest text-sm">
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>
    );
  };

  // --- STEP 3: Pickups ---
  const renderStep3 = () => {
    const pickupOptions = Object.keys(CONFIG.PRICING_DATA[selectedBags]).map(Number);
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-[#082219] uppercase italic tracking-tight">
            {useTrial ? "Select ongoing frequency" : "Select pick up frequency"}
          </h2>
          <p className="text-gray-500 mt-3 font-medium">
            {useTrial ? "After your trial," : ""} How many times should we pick up your {selectedBags} {selectedBags === 1 ? 'bag' : 'bags'}?
          </p>
        </div>

        <div className="space-y-4 max-w-xl mx-auto">
          {pickupOptions.map((pickupCount) => {
            const planDetails = CONFIG.PRICING_DATA[selectedBags][pickupCount];
            const isSelected = selectedPickups === pickupCount;

            return (
              <div key={pickupCount} tabIndex={0} role="button"
                onKeyDown={useKeyboardAction(() => setSelectedPickups(pickupCount))}
                onClick={() => setSelectedPickups(pickupCount)}
                className={`group flex items-center justify-between p-5 border cursor-pointer transition-all duration-300 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-[#C5A059]
                  ${isSelected ? 'shadow-[0_12px_24px_rgba(197,160,89,0.15)] transform scale-[1.02] border-[#C5A059]' : 'border-gray-100 bg-white hover:border-[#C5A059] hover:bg-[#C5A059]/5 hover:scale-[1.02] hover:shadow-lg'}`}
                style={isSelected ? { backgroundColor: brand.copperLight } : {}}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-all duration-300 ${!isSelected ? 'bg-gray-100 text-gray-400 group-hover:bg-[#082219] group-hover:text-[#C5A059] group-hover:shadow-md' : 'bg-[#082219] text-[#C5A059] shadow-md'}`}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="font-black text-[#082219] uppercase tracking-wide">{pickupCount} {pickupCount === 1 ? 'Pick up' : 'Pick ups'}</p>
                    <p className="text-sm text-gray-500 font-bold mt-0.5">£{planDetails.total} / month</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Per Bag</span>
                  <span className={`text-2xl font-black leading-none mt-1 transition-colors duration-300 ${isSelected ? 'text-[#082219]' : 'text-gray-800 group-hover:text-[#082219]'}`}>£{planDetails.perBag}</span>
                  <span className="text-xs font-bold text-gray-400 mt-1">£{(planDetails.perBag / CONFIG.BAG_WEIGHT_KG).toFixed(2)} / kg</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center max-w-xl mx-auto pt-8">
          <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#082219] transition-colors font-bold uppercase tracking-widest text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <button disabled={!selectedPickups} onClick={() => setStep(4)}
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all
              ${selectedPickups ? 'bg-[#082219] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#082219] shadow-[0_8px_20px_rgba(8,34,25,0.2)] hover:shadow-[0_12px_24px_rgba(197,160,89,0.3)]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
            Review Plan <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  // --- STEP 4: Order Summary + Email ---
  const renderStep4 = () => (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-[#082219] uppercase italic tracking-tight">Order Summary</h2>
        <p className="text-gray-500 mt-3 font-medium">{useTrial ? `Review your trial and subscription details` : "Review your subscription details"}</p>
      </div>

      {!useTrial && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { months: 1, label: 'Monthly', save: null },
            { months: 3, label: '3 Months', save: 'Save 5%' },
            { months: 6, label: '6 Months', save: 'Save 10%' },
            { months: 12, label: 'Annual', save: 'Save 20%' }
          ].map(opt => (
            <button key={opt.months} onClick={() => setBillingCycle(opt.months)}
              className={`group flex flex-col items-center p-5 rounded-[1.5rem] border transition-all duration-300 ${billingCycle === opt.months ? 'shadow-[0_12px_24px_rgba(197,160,89,0.15)] border-[#C5A059]' : 'border-gray-100 bg-white hover:border-[#C5A059] hover:bg-[#C5A059]/5'}`}
              style={billingCycle === opt.months ? { backgroundColor: brand.copperLight } : {}}>
              <span className={`font-black uppercase tracking-wide transition-colors duration-300 ${billingCycle === opt.months ? 'text-[#082219]' : 'text-gray-500 group-hover:text-[#082219]'}`}>{opt.label}</span>
              {opt.save && (
                <span className={`text-[10px] font-black uppercase tracking-widest mt-2 px-3 py-1 rounded-full transition-colors duration-300 ${billingCycle === opt.months ? 'bg-[#082219] text-[#C5A059]' : 'bg-[#082219]/5 text-[#082219] group-hover:bg-[#082219] group-hover:text-[#C5A059]'}`}>{opt.save}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {useTrial && (
        <div className="bg-[#082219] rounded-[1.5rem] shadow-xl overflow-hidden relative mb-6">
          <div className="absolute top-0 right-0 bg-[#C5A059] text-[#082219] text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-bl-xl z-10">Step 1</div>
          <div className="p-6 md:p-8">
            <h3 className="text-white font-black uppercase tracking-widest text-lg mb-1">Phase 1: Your Trial</h3>
            <p className="text-gray-400 text-sm font-medium mb-6">Test the service. Cancel easily if it's not for you.</p>
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 text-gray-300">
                <ShoppingBag size={20} className="text-[#C5A059]" />
                <span className="font-bold uppercase tracking-wide text-sm">1x Signature Trial Bag</span>
              </div>
              <span className="text-gray-400 line-through font-bold">£{currentPlan?.perBag.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end mt-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Pay Today</span>
              <span className="text-4xl font-black text-white">£{CONFIG.TRIAL_PRICE.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-gray-100 rounded-[1.5rem] overflow-hidden relative p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-bl-xl">{useTrial ? 'Step 2' : 'Sub'}</div>
        <h3 className="text-[#082219] font-black uppercase tracking-widest text-lg mb-1">{useTrial ? "Phase 2: Ongoing Routine" : "Your Subscription"}</h3>
        <p className="text-gray-500 text-sm mb-6">{useTrial ? `Automatically starts ${CONFIG.TRIAL_DAYS} days after pickup.` : "Selected wash and fold routine."}</p>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-500">
              <ShoppingBag size={18} className="text-[#082219]" />
              <span className="font-bold uppercase tracking-wide text-sm">Volume</span>
            </div>
            <div className="text-right">
              <span className="font-black text-[#082219] block text-lg">{selectedBags} {selectedBags === 1 ? 'Bag' : 'Bags'}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">~{CONFIG.BAG_WEIGHT_KG}kg per bag</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-500">
              <Truck size={18} className="text-[#082219]" />
              <span className="font-bold uppercase tracking-wide text-sm">Pickups</span>
            </div>
            <span className="font-black text-[#082219] text-lg">{selectedPickups}x / mo</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-500">
              <Sparkles size={18} className="text-[#082219]" />
              <span className="font-bold uppercase tracking-wide text-sm">Per Bag</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-widest bg-[#082219]/5 text-[#082219]">£{discountedPerBag.toFixed(2)} / bag</span>
              <span className="text-xs text-gray-400 mt-1.5 font-bold tracking-widest">(£{(discountedPerBag / CONFIG.BAG_WEIGHT_KG).toFixed(2)} / kg)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-8 pt-6 border-t border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-2 block">Monthly Cost</span>
            {!useTrial && savingsPerMonth > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black shadow-sm bg-[#082219] text-[#C5A059] uppercase tracking-wide">
                <Sparkles size={12} /> Save £{savingsPerMonth.toFixed(2)} / mo
              </div>
            )}
          </div>
          <div className="text-right flex items-end gap-3 justify-end">
            {!useTrial && savingsPerMonth > 0 && (
              <span className="text-xl text-gray-400 line-through mb-1 font-bold">£{standardPrice.toFixed(2)}</span>
            )}
            <span className="text-3xl md:text-4xl font-black text-[#082219] tracking-tighter leading-none">£{discountedMonthly.toFixed(2)}</span>
            <span className="text-gray-500 font-bold mb-1 uppercase tracking-widest text-xs">/mo</span>
          </div>
        </div>

        {!useTrial && billingCycle > 1 && (
          <div className="border-t border-gray-200 pt-5 mt-5 flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest text-gray-500">Billed upfront ({billingCycle} mo)</span>
            <span className="text-2xl font-black text-[#082219]">£{upfrontTotal.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Email capture box */}
      <div className="bg-white border-2 border-[#C5A059]/30 rounded-[1.5rem] overflow-hidden relative p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#082219] text-[#C5A059] flex items-center justify-center">
            <Mail size={18} />
          </div>
          <div>
            <h3 className="text-[#082219] font-black uppercase tracking-widest text-base">Enter your email</h3>
            <p className="text-gray-500 text-xs font-bold mt-0.5">We'll check if you already have an account.</p>
          </div>
        </div>

        <input type="email" placeholder="you@example.com" value={customerEmail}
          onChange={e => { setCustomerEmail(e.target.value); if (emailError) setEmailError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') checkEmailExists(); }}
          className={`w-full p-4 border-2 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none ${emailError ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-[#C5A059]'}`} />
        {emailError && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{emailError}</p>}

        <button onClick={checkEmailExists} disabled={isCheckingEmail || !customerEmail.trim()}
          className="w-full mt-4 flex justify-center items-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all bg-[#082219] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#082219] shadow-[0_8px_20px_rgba(8,34,25,0.2)] hover:shadow-[0_12px_24px_rgba(197,160,89,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
          {isCheckingEmail ? <Loader2 size={20} className="animate-spin" /> : <>Continue <ArrowRight size={18} /></>}
        </button>

        <p className="text-[10px] font-bold text-gray-400 text-center mt-4 uppercase tracking-widest">Returning customer? We'll skip ahead and pre-fill your details.</p>
      </div>

      <div className="w-full bg-gray-50 border border-[#C5A059]/40 rounded-[1.2rem] p-6 mt-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#C5A059]" />
        {useTrial && (
          <div className="space-y-3 text-xs text-gray-600 font-medium leading-relaxed mb-6 border-b border-gray-200 pb-5">
            <p>You have <strong>{CONFIG.TRIAL_DAYS} days</strong> from delivery to decide if {CONFIG.BRAND_NAME} is for you.</p>
            <p>We will text you <strong>3 days before</strong> your trial ends. If you cancel, you won't pay another penny.</p>
          </div>
        )}
        <h4 className="font-black text-[#082219] uppercase tracking-widest text-[10px] mb-3">The {CONFIG.BRAND_NAME} Guarantee</h4>
        <ul className="space-y-2.5 text-[11px] text-gray-600 font-bold">
          <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[#C5A059]" /> No lock-in contracts. Cancel anytime in 3 clicks.</li>
          <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[#C5A059]" /> We text you 48hrs before any regular collection.</li>
          <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[#C5A059]" /> Unused bag quotas automatically roll over.</li>
        </ul>
      </div>

      <div className="pt-2">
        <button onClick={() => setStep(3)} className="w-full text-center text-gray-400 hover:text-[#082219] py-3 font-bold uppercase tracking-widest text-sm transition-colors">
          Modify Selection
        </button>
      </div>
    </div>
  );

  // --- STEP 5: Customer Details + Pickup ---
  const renderStep5 = () => (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-[#082219] uppercase italic tracking-tight">
          {customerExists ? "Welcome back!" : "Almost there!"}
        </h2>
        <p className="text-gray-500 mt-3 font-medium">
          {customerExists ? "We've pre-filled what we know — please confirm or update." : "Just a few more details to confirm your order."}
        </p>
      </div>

      {customerExists && (
        <div className="bg-[#082219] text-white rounded-[1.5rem] p-5 flex items-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-full bg-[#C5A059] text-[#082219] flex items-center justify-center shrink-0">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="font-black uppercase tracking-widest text-[11px] text-[#C5A059]">Account Found</p>
            <p className="text-sm font-bold mt-0.5">Hi {customerName || 'there'} — welcome back to {CONFIG.BRAND_NAME}.</p>
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-gray-100 rounded-[1.5rem] overflow-hidden relative p-6 md:p-8 shadow-sm">
        <h3 className="text-[#082219] font-black uppercase tracking-widest text-lg mb-1">Your Details</h3>
        <p className="text-gray-500 text-sm mb-6">Email: <strong className="text-[#082219]">{customerEmail}</strong></p>

        <div className="space-y-3">
          <div>
            <input type="text" placeholder="Full Name *" value={customerName} onChange={e => { setCustomerName(e.target.value); if (nameError) setNameError(''); }}
              className={`w-full p-4 border-2 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none ${nameError ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-[#C5A059]'}`} />
            {nameError && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{nameError}</p>}
          </div>
          <div>
            <input type="tel" placeholder="Phone Number *" value={customerPhone} onChange={e => { setCustomerPhone(e.target.value); if (phoneError) setPhoneError(''); }}
              className={`w-full p-4 border-2 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none ${phoneError ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-[#C5A059]'}`} />
            {phoneError && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{phoneError}</p>}
          </div>
          <div>
            <input type="text" placeholder="Street Address *" value={customerAddress} onChange={e => { setCustomerAddress(e.target.value); if (addressError) setAddressError(''); }}
              className={`w-full p-4 border-2 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none ${addressError ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-[#C5A059]'}`} />
            {addressError && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{addressError}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Flat / Unit" value={customerUnit} onChange={e => setCustomerUnit(e.target.value)}
              className="w-full p-4 border-2 border-gray-100 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none focus:border-[#C5A059]" />
            <div>
              <input type="text" placeholder="Postcode *" value={customerPostCode} onChange={e => { setCustomerPostCode(e.target.value); if (postCodeError) setPostCodeError(''); }}
                className={`w-full p-4 border-2 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none ${postCodeError ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-[#C5A059]'}`} />
              {postCodeError && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{postCodeError}</p>}
            </div>
          </div>
          <input type="text" placeholder="Driver Instructions (e.g. ring buzzer 4B, leave at door)" value={driverInstructions} onChange={e => setDriverInstructions(e.target.value)}
            className="w-full p-4 border-2 border-gray-100 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none focus:border-[#C5A059]" />
        </div>
      </div>

      <div className="bg-white border-2 border-gray-100 rounded-[1.5rem] overflow-hidden relative p-6 md:p-8 shadow-sm">
        <h3 className="text-[#082219] font-black uppercase tracking-widest text-lg mb-1">First Pickup</h3>
        <p className="text-gray-500 text-sm mb-6">When should we collect your first bag?</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="date" value={pickupDates[0] || ''} onChange={handleFirstDateChange}
            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            className="w-full sm:w-1/2 p-4 border-2 rounded-xl font-bold text-gray-800 text-sm bg-gray-50 outline-none focus:border-[#C5A059]"
            style={{ borderColor: pickupDates[0] ? brand.copper : '#f3f4f6' }} />
          {pickupDates.length > 0 && (
            <select value={pickupTimes[0] || ''} onChange={(e) => handleTimeChange(0, e.target.value)}
              className="w-full sm:w-1/2 p-4 border-2 rounded-xl font-bold text-gray-800 bg-white cursor-pointer uppercase tracking-wide text-sm outline-none"
              style={{ borderColor: brand.copper }}>
              {timeSlotOptions.map(slot => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          )}
        </div>
        {pickupDates[0] && (
          <div className="mt-4 flex gap-3 items-start p-4 rounded-xl shadow-inner bg-[#082219]/5 border border-[#082219]/10">
            <Clock size={18} className="shrink-0 mt-0.5 text-[#082219]" />
            <p className="text-xs font-bold leading-relaxed text-[#082219]">
              Scheduled for <strong>{formatDate(pickupDates[0])}</strong>. You can reschedule from your dashboard up to 48 hours before.
            </p>
          </div>
        )}
      </div>

      {checkoutError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-bold p-4 rounded-xl">{checkoutError}</div>
      )}

      <div className="pt-6 space-y-4">
        <button onClick={handleSubscribe} disabled={isProcessing || !pickupDates[0]}
          className="w-full flex justify-center items-center gap-3 px-8 py-5 rounded-xl font-black uppercase tracking-widest transition-all bg-[#082219] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#082219] shadow-[0_8px_20px_rgba(8,34,25,0.2)] hover:shadow-[0_12px_24px_rgba(197,160,89,0.3)] disabled:opacity-70 disabled:cursor-not-allowed">
          {isProcessing ? <Loader2 size={24} className="animate-spin" /> : (
            <>
              <CreditCard size={20} />
              {useTrial ? `Start Trial - Pay £${todayPay.toFixed(2)} Today` : `Subscribe - Pay £${todayPay.toFixed(2)} Today`}
            </>
          )}
        </button>
        <button onClick={() => setStep(4)} className="w-full text-center text-gray-400 hover:text-[#082219] py-3 font-bold uppercase tracking-widest text-sm transition-colors">
          <ArrowLeft size={14} className="inline mr-1" /> Back to Summary
        </button>
      </div>
    </div>
  );

  const renderFinalSuccess = () => (
    <div className="text-center py-12 animate-in zoom-in duration-500 space-y-6">
      <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-xl bg-[#082219] text-[#C5A059]">
        <CheckCircle size={48} />
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-[#082219] uppercase italic tracking-tight">You're All Set!</h2>
      <div className="text-gray-600 font-medium max-w-md mx-auto leading-relaxed space-y-4">
        <p>Your first collection is scheduled for <strong>{formatDate(pickupDates[0])}</strong>. Our team will call you shortly to confirm your first collection and payment options.</p>
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mt-4 text-sm font-black text-[#082219]">
          We've created your account and scheduled your pickup. You'll receive a confirmation email at {customerEmail}.
        </div>
      </div>
      <button onClick={() => window.location.reload()}
        className="mt-10 px-8 py-4 bg-gray-100 text-[#082219] font-black uppercase tracking-widest text-sm rounded-xl hover:bg-gray-200 transition-colors shadow-sm inline-flex items-center justify-center">
        Go to Dashboard
      </button>
    </div>
  );

  const showHero = step === 1 && !isSuccess;
  const totalSteps = 5;

  return (
    <div className="w-full flex flex-col bg-[#fdfdfd] overflow-x-hidden font-sans min-h-screen">
      {showHero && <SubscriptionHero onStart={scrollToPlans} />}

      <div id="subscription-plans"
        className={`w-full bg-white flex flex-col items-center px-4 sm:px-8 ${showHero ? 'pb-12 sm:pb-16' : 'min-h-screen pt-8 sm:pt-12 pb-12 sm:pb-16'}`}>
        <div className="w-full max-w-[1300px] bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(8,34,25,0.06)] border border-gray-100 overflow-hidden p-6 sm:p-10 lg:p-12 relative z-20">

          {!showHero && !isSuccess && (
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
              <button onClick={handleStartOver}
                className="flex items-center gap-2 text-[#082219] font-black uppercase tracking-widest text-xs hover:text-[#C5A059] transition-colors">
                <ArrowLeft size={14} /> Start Over
              </button>
              <span className="text-[#082219] font-black uppercase italic tracking-tight text-lg">{CONFIG.BRAND_NAME}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step {step} of {totalSteps}</span>
            </div>
          )}

          {!isSuccess && (
            <div className="flex justify-center items-center mb-12">
              <div className="flex items-center w-full max-w-xl">
                {[1, 2, 3, 4, 5].map((num) => (
                  <React.Fragment key={num}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shadow-sm transition-colors duration-300 ${step >= num ? 'bg-[#082219] text-[#C5A059]' : 'bg-gray-100 text-gray-400'}`}>
                      {num}
                    </div>
                    {num < 5 && <div className={`flex-1 h-1.5 mx-2 rounded-full transition-colors duration-300 ${step > num ? 'bg-[#082219]' : 'bg-gray-100'}`}></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="min-h-[400px] flex flex-col justify-center">
            {isSuccess ? renderFinalSuccess()
              : step === 1 ? renderStep1()
              : step === 2 ? renderStep2()
              : step === 3 ? renderStep3()
              : step === 4 ? renderStep4()
              : renderStep5()}
          </div>
        </div>
      </div>
    </div>
  );
}
