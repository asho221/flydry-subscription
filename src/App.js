import React, { useState, useId, useMemo } from 'react';
import {
  ShoppingBag, Truck, CreditCard, CheckCircle,
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Bot,
  Loader2, Info, Leaf, Shield, Clock
} from 'lucide-react';
// --- 1. GLOBAL CONFIGURATION (Single Source of Truth) ---
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
// --- 2. UTILITY COMPONENTS ---
const useKeyboardAction = (callback) => {
  return (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };
};
// --- 3. SUB-COMPONENTS ---
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
          <g className="anim-drop">
             <rect x="20" y="30" width="24" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
             <path d="M 32 26 L 34 23 L 37 22 L 34 21 L 32 18 L 30 21 L 27 22 L 30 23 Z" fill="currentColor" className="anim-sparkle" style={{ animationDelay: '0.8s' }} />
          </g>
        </svg>
      )
    }
  ], [bagClipId]);
  return (
    <section className="relative w-full bg-white text-[#082219] pt-16 pb-10 md:pt-20 md:pb-12 overflow-hidden font-sans selection:bg-[#C5A059] selection:text-white">
      <style>{`
        .bg-subtle-grid { background-image: radial-gradient(rgba(8, 34, 25, 0.04) 1px, transparent 1px); background-size: 32px 32px; }
        @keyframes wave-slide { 0% { transform: translateX(0); } 100% { transform: translateX(-64px); } }
        .anim-wave { animation: wave-slide 4s linear infinite; }
        @keyframes route-trace { 0%, 100% { stroke-dashoffset: 60; opacity: 0; } 20%, 80% { stroke-dashoffset: 0; opacity: 1; } }
        .anim-route { stroke-dasharray: 60; animation: route-trace 4s ease-in-out infinite; }
        @keyframes drop-fold { 0%, 100% { transform: translateY(-12px); opacity: 0; } 20%, 80% { transform: translateY(0); opacity: 1; } }
        .anim-drop { animation: drop-fold 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes sparkle-fade { 0%, 100% { opacity: 0; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
        .anim-sparkle { animation: sparkle-fade 2s ease-in-out infinite; transform-origin: center; }
        .text-shimmer { background: linear-gradient(to right, #C5A059 20%, #e8d5b5 40%, #e8d5b5 60%, #C5A059 80%); background-size: 200% auto; color: transparent; -webkit-background-clip: text; background-clip: text; animation: shimmer-text 10s linear infinite; }
        @keyframes shimmer-text { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes coinFlip { 0%, 40% { transform: rotateY(0deg); } 50%, 90% { transform: rotateY(180deg); } 100% { transform: rotateY(360deg); } }
        .exec-card { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); background: #ffffff; }
        .exec-card:hover { transform: translateY(-4px); box-shadow: 0 24px 48px -12px rgba(8, 34, 25, 0.08); border-color: rgba(197, 160, 89, 0.25); }
      `}</style>
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none" />
      <div className="max-w-[1300px] mx-auto px-8 md:px-12 lg:px-16 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full lg:w-[45%] flex flex-col justify-center text-left relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C5A059] text-[#082219] text-[11px] font-black uppercase tracking-[0.2em] mb-6 w-max shadow-lg animate-pulse">
            <Sparkles size={14} /> £{CONFIG.TRIAL_PRICE} Introductory Trial
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tighter uppercase italic leading-[0.9] text-[#082219] mb-5">
            Your First Bag is <br/> <span className="text-shimmer">Just £{CONFIG.TRIAL_PRICE}.</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed max-w-lg mb-8">
            The definitive zero-friction routine. <strong className="text-[#082219]">Pay just £{CONFIG.TRIAL_PRICE} today</strong> for a full {CONFIG.BAG_WEIGHT_KG}kg Wash & Fold trial. If you love it, roll into a monthly plan. If not, cancel in 3 clicks.
          </p>
          <div className="flex flex-col gap-3 mb-8">
            {['No weighing. No hidden fees.', 'We collect, clean, and deliver.', `Risk-free ${CONFIG.TRIAL_DAYS}-day guarantee.`].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px] font-bold text-[#082219]">
                <CheckCircle2 size={18} className="text-[#9E7C2E]" /> {item}
              </div>
            ))}
          </div>
          <button onClick={onStart} className="group inline-flex items-center justify-center w-max gap-3 bg-[#082219] text-[#C5A059] px-8 py-5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#082219] transition-all shadow-xl">
            Claim £{CONFIG.TRIAL_PRICE} Trial Bag
            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
        <div className="w-full lg:w-[55%] grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 relative z-10">
          {steps.map((step) => (
            <div key={step.id} onClick={onStart} className="exec-card group flex flex-row md:flex-col items-center md:items-start p-6 md:p-8 rounded-[1.5rem] border border-gray-100 cursor-pointer relative overflow-hidden">
              <div className="flex-shrink-0 md:w-full flex md:justify-center mb-0 md:mb-6 mr-6 md:mr-0">{step.artwork}</div>
              <div className="flex-1 md:text-center w-full">
                <h3 className="text-[17px] md:text-[19px] font-black uppercase italic tracking-tight text-[#082219] mb-1.5 group-hover:text-[#C5A059] transition-colors">{step.title}</h3>
                <p className="text-[12px] text-gray-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function PlanFinder({ onApply }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [rec, setRec] = useState(null);
  const findPlan = () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const text = input.toLowerCase();
      let bags = 2;
      let pickups = 1;
      let reason = "Our most popular 2-bag plan provides a great balance of flexibility and value.";
      if (/family|kids|household|4|5/i.test(text)) {
        bags = 4; pickups = 2; reason = "For households, the 4-bag plan ensures you never fall behind.";
      } else if (/alone|just me|1 person/i.test(text)) {
        bags = 1; pickups = 1; reason = "For one person, 1 signature bag per month is incredibly cost-effective.";
      }
      setRec({ bags, pickups, reason });
      setLoading(false);
    }, 1500);
  };
  return (
    <div className="bg-white p-6 rounded-[1.5rem] border border-gray-200 text-left shadow-sm mt-8 w-full max-w-md mx-auto md:mx-0">
      <div className="flex items-center gap-2 mb-4">
        <Bot size={20} className="text-[#082219]" />
        <span className="font-black text-[#082219] uppercase tracking-widest text-xs">Flydry Plan Finder</span>
      </div>
      <textarea
        value={input} onChange={(e) => setInput(e.target.value)}
        placeholder="E.g., I live with my partner, we work out a lot..."
        className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] resize-none text-sm font-medium transition-all"
        rows={2}
      />
      {rec ? (
        <div className="mt-4 p-4 rounded-xl bg-[#082219]/5 border border-[#082219]/10 animate-in fade-in slide-in-from-top-2">
          <p className="text-sm font-bold text-[#082219] mb-4">✨ {rec.reason}</p>
          <button onClick={() => onApply(rec.bags, rec.pickups)} className="w-full py-3 rounded-xl bg-[#082219] text-[#C5A059] text-xs font-black uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#082219] transition-all">Apply Recommendation</button>
        </div>
      ) : (
        <div className="flex justify-end mt-4">
          <button onClick={findPlan} disabled={loading || !input.trim()} className="px-6 py-3 rounded-xl bg-[#082219] text-[#C5A059] text-xs font-black uppercase tracking-widest disabled:opacity-50 transition-all">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Find My Plan"}
          </button>
        </div>
      )}
    </div>
  );
}
// --- 4. MAIN APPLICATION ---
export default function App() {
  const [step, setStep] = useState(1);
  const [useTrial, setUseTrial] = useState(true);
  const [selectedBags, setSelectedBags] = useState(null);
  const [selectedDetergent, setSelectedDetergent] = useState(null);
  const [selectedPickups, setSelectedPickups] = useState(null);
  const [billingCycle, setBillingCycle] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
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
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [postCodeError, setPostCodeError] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  // Derived Values
  const currentPlan = (selectedBags && selectedPickups) ? CONFIG.PRICING_DATA[selectedBags][selectedPickups] : null;
  const standardPrice = (selectedBags && selectedPickups) ? (selectedBags * CONFIG.BAG_WEIGHT_KG * CONFIG.STANDARD_PRICE_PER_KG) + (selectedPickups * CONFIG.STANDARD_DELIVERY_FEE) : 0;
  const currentDiscount = CONFIG.DISCOUNTS[billingCycle];
  const discountedMonthly = currentPlan ? currentPlan.total * (1 - currentDiscount) : 0;
  const upfrontTotal = discountedMonthly * billingCycle;
  const savingsPerMonth = standardPrice - discountedMonthly;
  const todayPay = (useTrial && billingCycle === 1) ? CONFIG.TRIAL_PRICE : upfrontTotal;
  const timeSlotOptions = ["Morning (8am - 12pm)", "Afternoon (12pm - 4pm)", "Evening (6pm - 10pm)"];
  // Logic Handlers
  const handleSelect = (setter, val, nextStep) => {
    setter(val);
    if (nextStep) setStep(nextStep);
  };
  const validateForm = () => {
    let valid = true;
    if (!customerName.trim()) { setNameError('Name is required'); valid = false; } else { setNameError(''); }
    if (!customerEmail.trim()) { setEmailError('Email is required'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) { setEmailError('Enter a valid email'); valid = false; }
    else { setEmailError(''); }
    if (!customerPhone.trim()) { setPhoneError('Phone number is required'); valid = false; }
    else if (customerPhone.replace(/\D/g,'').length < 10) { setPhoneError('Enter a valid phone number'); valid = false; }
    else { setPhoneError(''); }
    if (!customerAddress.trim()) { setAddressError('Street address is required'); valid = false; } else { setAddressError(''); }
    if (!customerPostCode.trim()) { setPostCodeError('Postcode is required'); valid = false; } else { setPostCodeError(''); }
    return valid;
  };
  const handleSubscribe = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);
    setCheckoutError('');
    try {
      const res = await fetch(`${CONFIG.BACKEND_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: customerAddress,
            postCode: customerPostCode,
            unit: customerUnit,
            driverInstructions: driverInstructions,
          },
          plan: { bags: selectedBags, pickups: selectedPickups, detergent: selectedDetergent },
          pickup: {
            date: pickupDates[0],
            time: pickupTimes[0] || timeSlotOptions[0],
          }
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
    if (!val) {
      setPickupDates([]);
      setPickupTimes([]);
      return;
    }
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
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
  };
  const scrollToPlans = () => document.getElementById('subscription-plans')?.scrollIntoView({ behavior: 'smooth' });
  // UI Step Renders
  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 mb-3 bg-[#C5A059] text-[#082219] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-md">
            <Sparkles size={14} /> Start For £{CONFIG.TRIAL_PRICE}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#082219] uppercase italic tracking-tight">
            {useTrial ? `Claim Your £${CONFIG.TRIAL_PRICE} Trial` : "Choose your plan"}
          </h2>
          <p className="text-gray-500 mt-3 font-medium text-sm md:text-base">
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
          {!showPlanFinder ? (
            <button onClick={() => setShowPlanFinder(true)} className="block mt-4 text-xs font-bold text-gray-400 hover:text-[#082219] transition-colors underline underline-offset-4 mx-auto md:mx-0">
              Not sure how many bags? Try our Plan Finder
            </button>
          ) : (
            <PlanFinder onApply={(b, p) => { setSelectedBags(b); setSelectedPickups(p); setStep(2); }} />
          )}
        </div>
        <div className="hidden md:flex w-48 h-48 relative" style={{ perspective: '600px' }}>
          <div className="w-full h-full" style={{ transformStyle: 'preserve-3d', animation: 'coinFlip 10s ease-in-out infinite' }}>
            {/* Front: 10KG Circle */}
            <div className="absolute inset-0 rounded-full bg-[#082219] flex items-center justify-center border-4 border-[#C5A059]/20 shadow-2xl overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(197,160,89,0.2),transparent)]" />
              <div className="text-center relative z-10">
                <ShoppingBag size={32} className="text-[#C5A059] mx-auto mb-2" />
                <span className="block text-4xl font-black text-white">{CONFIG.BAG_WEIGHT_KG}KG</span>
                <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">Signature Bag</span>
              </div>
            </div>
            {/* Back: Bag Photo */}
            <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-[#C5A059]/20 shadow-2xl" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <img src="https://raw.githubusercontent.com/asho221/Flydry-website/main/FDbag.png" alt="Flydry Signature Bag" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 4].map((bagCount) => {
          const minPrice = Math.min(...Object.values(CONFIG.PRICING_DATA[bagCount]).map(p => p.total));
          const isSelected = selectedBags === bagCount;
          return (
            <div
              key={bagCount} tabIndex={0} role="button"
              onKeyDown={useKeyboardAction(() => handleSelect(setSelectedBags, bagCount, 2))}
              onClick={() => handleSelect(setSelectedBags, bagCount, 2)}
              className={`group flex flex-col items-center p-8 border transition-all duration-300 rounded-[1.5rem] relative cursor-pointer outline-none focus:ring-2 focus:ring-[#C5A059]
              ${isSelected ? 'bg-[#C5A059]/10 shadow-xl border-[#C5A059]' : 'bg-white border-gray-100 hover:border-[#C5A059]'}`}
            >
              <div className="text-center">
                <span className="text-xl font-black text-[#082219] uppercase tracking-tight">{bagCount} {bagCount === 1 ? 'Bag' : 'Bags'}</span>
                <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">({bagCount * CONFIG.BAG_WEIGHT_KG} KG)</div>
                {useTrial && bagCount > 1 && <div className="mt-2 inline-block text-[9px] text-[#C5A059] font-black uppercase tracking-widest bg-[#C5A059]/10 px-2 py-1 rounded border border-[#C5A059]/20">*Trial includes 1 bag</div>}
              </div>
              <div className="mt-5 flex flex-col items-center w-full pt-6 border-t border-gray-100 relative">
                {useTrial ? (
                  <>
                    <div className="absolute -top-3 bg-[#082219] px-3 py-1 rounded-full text-[10px] text-[#C5A059] font-black uppercase shadow-md">1st Bag Trial</div>
                    <div className="flex items-start gap-1 text-[#082219] mb-1"><span className="text-2xl font-bold mt-1">£</span><span className="text-5xl font-black leading-none">10</span></div>
                    <div className="mt-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 w-full text-center">Then £{minPrice}/mo</div>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-black px-5 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-gray-700 w-full text-center group-hover:bg-white group-hover:border-[#C5A059]/50 transition-all">£{minPrice}<span className="text-sm font-bold text-gray-500 ml-1">/mo</span></div>
                    <span className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest text-center">{bagCount === 1 ? 'Max 1 pickup' : `Flexible 1, 2 or 4 pickups`}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
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
          {opts.map((opt) => (
            <div
              key={opt.id} tabIndex={0} role="button"
              onKeyDown={useKeyboardAction(() => handleSelect(setSelectedDetergent, opt.id, 3))}
              onClick={() => handleSelect(setSelectedDetergent, opt.id, 3)}
              className={`group relative flex flex-col items-center justify-center p-8 border transition-all duration-300 rounded-[1.5rem] cursor-pointer outline-none focus:ring-2 focus:ring-[#C5A059]
                ${selectedDetergent === opt.id ? 'bg-[#C5A059]/10 border-[#C5A059]' : 'bg-white border-gray-100 hover:border-[#C5A059]'}`}
            >
              {opt.recommended && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#082219] text-[#C5A059] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-md z-10 border border-[#C5A059]/20">Recommended Default</div>}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-colors ${selectedDetergent === opt.id ? 'bg-[#082219] text-[#C5A059]' : 'bg-gray-50 text-gray-400 group-hover:bg-[#082219] group-hover:text-[#C5A059]'}`}><opt.icon size={28} /></div>
              <h3 className="font-black uppercase tracking-wide mb-2">{opt.title}</h3>
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase text-center">{opt.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-start max-w-4xl mx-auto pt-8"><button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#082219] font-bold uppercase tracking-widest text-sm"><ArrowLeft size={16} /> Back</button></div>
      </div>
    );
  };
  const renderStep3 = () => {
    const pickupOptions = Object.keys(CONFIG.PRICING_DATA[selectedBags]).map(Number);
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-[#082219] uppercase italic tracking-tight">{useTrial ? "Select ongoing frequency" : "Select pick up frequency"}</h2>
          <p className="text-gray-500 mt-3 font-medium">After your trial, how many times should we pick up your {selectedBags} {selectedBags === 1 ? 'bag' : 'bags'}?</p>
        </div>
        <div className="space-y-4 max-w-xl mx-auto">
          {pickupOptions.map((pickupCount) => {
            const details = CONFIG.PRICING_DATA[selectedBags][pickupCount];
            const isSelected = selectedPickups === pickupCount;
            return (
              <div
                key={pickupCount} tabIndex={0} role="button"
                onKeyDown={useKeyboardAction(() => setSelectedPickups(pickupCount))}
                onClick={() => setSelectedPickups(pickupCount)}
                className={`group flex items-center justify-between p-5 border cursor-pointer transition-all duration-300 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-[#C5A059]
                  ${isSelected ? 'bg-[#C5A059]/10 border-[#C5A059]' : 'bg-white border-gray-100 hover:border-[#C5A059]'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-all ${isSelected ? 'bg-[#082219] text-[#C5A059]' : 'bg-gray-100 text-gray-400'}`}><Truck size={20} /></div>
                  <div>
                    <p className="font-black text-[#082219] uppercase tracking-wide">{pickupCount} {pickupCount === 1 ? 'Pick up' : 'Pick ups'}</p>
                    <p className="text-sm text-gray-500 font-bold mt-0.5">£{details.total} / month</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Per Bag</span>
                  <span className="text-2xl font-black text-[#082219]">£{details.perBag}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center max-w-xl mx-auto pt-8">
          <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#082219] font-bold uppercase tracking-widest text-sm"><ArrowLeft size={16} /> Back</button>
          <button onClick={() => setStep(4)} disabled={!selectedPickups} className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all bg-[#082219] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#082219] disabled:opacity-50 shadow-lg">Review Plan <ArrowRight size={18} /></button>
        </div>
      </div>
    );
  };
  const renderStep4 = () => (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-[#082219] uppercase italic tracking-tight">Order Summary</h2>
        <p className="text-gray-500 mt-3 font-medium">{useTrial ? `Review your trial and subscription details` : "Review your subscription details"}</p>
      </div>
      {!useTrial && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {[1, 3, 6, 12].map(m => (
            <button key={m} onClick={() => setBillingCycle(m)} className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${billingCycle === m ? 'bg-[#082219] text-[#C5A059] border-[#082219]' : 'bg-white border-gray-200 text-gray-400'}`}>
              {m === 1 ? 'Monthly' : m === 12 ? 'Annual' : `${m} Months`}
              {CONFIG.DISCOUNTS[m] > 0 && <span className="block opacity-70">Save {CONFIG.DISCOUNTS[m]*100}%</span>}
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
              <div className="flex items-center gap-3 text-gray-300"><ShoppingBag size={20} className="text-[#C5A059]" /><span className="font-bold uppercase tracking-wide text-sm">1x Signature Trial Bag</span></div>
              <span className="text-gray-400 line-through font-bold">£{currentPlan?.perBag.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end mt-2"><span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Pay Today</span><span className="text-4xl font-black text-white">£{CONFIG.TRIAL_PRICE.toFixed(2)}</span></div>
          </div>
        </div>
      )}
      <div className="bg-white border-2 border-gray-100 rounded-[1.5rem] overflow-hidden relative p-8 shadow-sm">
        <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-bl-xl">{useTrial ? 'Step 2' : 'Sub'}</div>
        <h3 className="text-[#082219] font-black uppercase tracking-widest text-lg mb-1">{useTrial ? "Phase 2: Ongoing Routine" : "Your Subscription"}</h3>
        <p className="text-gray-500 text-sm mb-6">{useTrial ? `Automatically starts ${CONFIG.TRIAL_DAYS} days after pickup.` : "Selected wash and fold routine."}</p>
        <div className="space-y-4">
          <div className="flex justify-between items-center"><div className="flex items-center gap-3 text-gray-500"><ShoppingBag size={18} /><span className="font-bold uppercase text-sm">Volume</span></div><div className="text-right"><span className="font-black text-[#082219] block">{selectedBags} {selectedBags === 1 ? 'Bag' : 'Bags'}</span><span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">~{CONFIG.BAG_WEIGHT_KG}kg per bag</span></div></div>
          <div className="flex justify-between items-center"><div className="flex items-center gap-3 text-gray-500"><Truck size={18} /><span className="font-bold uppercase text-sm">Pickups</span></div><span className="font-black text-[#082219]">{selectedPickups}x / mo</span></div>
        </div>
        <div className="flex justify-between items-end mt-8 pt-6 border-t border-gray-100">
          <span className="text-[10px] text-gray-400 uppercase font-black">Monthly Cost</span>
          <div className="text-right">
            {!useTrial && savingsPerMonth > 0 && <div className="text-sm text-gray-400 line-through font-bold mb-1">£{standardPrice.toFixed(2)}</div>}
            <span className="text-3xl font-black text-[#082219]">£{discountedMonthly.toFixed(2)}<span className="text-sm text-gray-400 tracking-widest ml-1">/mo</span></span>
          </div>
        </div>
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
      {/* Customer Details */}
      <div className="bg-white border-2 border-gray-100 rounded-[1.5rem] overflow-hidden relative p-8 shadow-sm">
        <h3 className="text-[#082219] font-black uppercase tracking-widest text-lg mb-1">Your Details</h3>
        <p className="text-gray-500 text-sm mb-6">We'll use this to set up your account and schedule pickups.</p>
        <div className="space-y-3">
          <div>
            <input type="text" placeholder="Full Name *" value={customerName} onChange={e=>{setCustomerName(e.target.value); if(nameError) setNameError('');}}
              className={`w-full p-4 border-2 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none ${nameError?'border-red-300 focus:border-red-400':'border-gray-100 focus:border-[#C5A059]'}`}/>
            {nameError && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{nameError}</p>}
          </div>
          <div>
            <input type="email" placeholder="Email Address *" value={customerEmail} onChange={e=>{setCustomerEmail(e.target.value); if(emailError) setEmailError('');}}
              className={`w-full p-4 border-2 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none ${emailError?'border-red-300 focus:border-red-400':'border-gray-100 focus:border-[#C5A059]'}`}/>
            {emailError && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{emailError}</p>}
          </div>
          <div>
            <input type="tel" placeholder="Phone Number *" value={customerPhone} onChange={e=>{setCustomerPhone(e.target.value); if(phoneError) setPhoneError('');}}
              className={`w-full p-4 border-2 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none ${phoneError?'border-red-300 focus:border-red-400':'border-gray-100 focus:border-[#C5A059]'}`}/>
            {phoneError && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{phoneError}</p>}
          </div>
          <div>
            <input type="text" placeholder="Street Address *" value={customerAddress} onChange={e=>{setCustomerAddress(e.target.value); if(addressError) setAddressError('');}}
              className={`w-full p-4 border-2 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none ${addressError?'border-red-300 focus:border-red-400':'border-gray-100 focus:border-[#C5A059]'}`}/>
            {addressError && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{addressError}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Flat / Unit" value={customerUnit} onChange={e=>setCustomerUnit(e.target.value)}
              className="w-full p-4 border-2 border-gray-100 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none focus:border-[#C5A059]"/>
            <div>
              <input type="text" placeholder="Postcode *" value={customerPostCode} onChange={e=>{setCustomerPostCode(e.target.value); if(postCodeError) setPostCodeError('');}}
                className={`w-full p-4 border-2 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none ${postCodeError?'border-red-300 focus:border-red-400':'border-gray-100 focus:border-[#C5A059]'}`}/>
              {postCodeError && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{postCodeError}</p>}
            </div>
          </div>
          <input type="text" placeholder="Driver Instructions (e.g. ring buzzer 4B, leave at door)" value={driverInstructions} onChange={e=>setDriverInstructions(e.target.value)}
            className="w-full p-4 border-2 border-gray-100 rounded-xl font-bold text-gray-800 text-sm transition-colors bg-gray-50 outline-none focus:border-[#C5A059]"/>
        </div>
      </div>

      {/* First Pickup */}
      <div className="bg-white border-2 border-gray-100 rounded-[1.5rem] overflow-hidden relative p-8 shadow-sm">
        <h3 className="text-[#082219] font-black uppercase tracking-widest text-lg mb-1">First Pickup</h3>
        <p className="text-gray-500 text-sm mb-6">When should we collect your first bag?</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="date" value={pickupDates[0]||''} onChange={handleFirstDateChange}
            min={new Date(Date.now()+86400000).toISOString().split('T')[0]}
            className="w-full sm:w-1/2 p-4 border-2 border-gray-100 rounded-xl font-bold text-gray-800 text-sm bg-gray-50 outline-none focus:border-[#C5A059]"/>
          {pickupDates.length > 0 && (
            <select value={pickupTimes[0]||''} onChange={(e)=>handleTimeChange(0,e.target.value)}
              className="w-full sm:w-1/2 p-4 border-2 border-[#C5A059] rounded-xl font-bold text-gray-800 bg-white cursor-pointer uppercase tracking-wide text-sm outline-none">
              {timeSlotOptions.map(slot=><option key={slot} value={slot}>{slot}</option>)}
            </select>
          )}
        </div>
        {pickupDates[0] && <p className="text-[#082219] text-sm font-bold mt-3 ml-1">{formatDate(pickupDates[0])}</p>}
      </div>

      {checkoutError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-bold p-4 rounded-xl">{checkoutError}</div>
      )}
      <div className="pt-6 space-y-4">
        <button onClick={handleSubscribe} disabled={isProcessing || !pickupDates[0]} className="w-full flex justify-center items-center gap-3 px-8 py-5 rounded-xl font-black uppercase tracking-widest transition-all bg-[#082219] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#082219] shadow-xl disabled:opacity-70">
          {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <><CreditCard size={20} /> {useTrial ? `Start Trial - Pay £${todayPay.toFixed(2)} Today` : `Subscribe - Pay £${todayPay.toFixed(2)} Today`}</>}
        </button>
        <button onClick={() => setStep(3)} className="w-full text-center text-gray-400 hover:text-[#082219] py-2 font-bold uppercase tracking-widest text-xs transition-colors">Modify Selection</button>
      </div>
    </div>
  );
  const renderFinalSuccess = () => (
    <div className="text-center py-12 animate-in zoom-in duration-500 space-y-6">
      <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-8 bg-[#082219] text-[#C5A059] shadow-xl"><CheckCircle size={48} /></div>
      <h2 className="text-4xl font-black text-[#082219] uppercase italic tracking-tight">You're All Set!</h2>
      <div className="text-gray-600 font-medium max-w-md mx-auto leading-relaxed space-y-4">
        <p>Your first collection is scheduled for <strong>{formatDate(pickupDates[0])}</strong>. Our team will call you shortly to confirm your first collection and payment options.</p>
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mt-4 text-sm font-black text-[#082219]">We've created your account and scheduled your pickup. You'll receive a confirmation email at {customerEmail}.</div>
      </div>
      <button onClick={() => window.location.reload()} className="mt-10 px-8 py-4 bg-gray-100 text-[#082219] font-black uppercase tracking-widest text-sm rounded-xl hover:bg-gray-200 shadow-sm transition-colors">Go to Dashboard</button>
    </div>
  );
  return (
    <div className="w-full flex flex-col bg-[#fdfdfd] overflow-x-hidden font-sans">
      <SubscriptionHero onStart={scrollToPlans} />
      <div id="subscription-plans" className="w-full bg-white flex flex-col items-center pb-24 px-4 sm:px-8">
        <div className="w-full max-w-[1300px] bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(8,34,25,0.06)] border border-gray-100 p-6 sm:p-12 relative">
          {!isSuccess && step < 5 && (
            <div className="flex justify-center items-center mb-12">
              <div className="flex items-center w-full max-w-lg">
                {[1, 2, 3, 4].map((num) => (
                  <React.Fragment key={num}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${step >= num ? 'bg-[#082219] text-[#C5A059] shadow-md' : 'bg-gray-100 text-gray-400'}`}>{num}</div>
                    {num < 4 && <div className={`flex-1 h-1.5 mx-2 rounded-full transition-all duration-500 ${step > num ? 'bg-[#082219]' : 'bg-gray-100'}`} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          <div className="min-h-[400px] flex flex-col justify-center">
            {isSuccess ? renderFinalSuccess() : step === 1 ? renderStep1() : step === 2 ? renderStep2() : step === 3 ? renderStep3() : renderStep4()}
          </div>
        </div>
      </div>
    </div>
  );
}
