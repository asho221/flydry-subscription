import React, { useState } from 'react';
import { ShoppingBag, Truck, Calendar, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Sparkles, Bot, Loader2, Clock, Plus, Check, Shirt, Cloud } from 'lucide-react';

// Pricing Data mapped directly from your provided table
const pricingData = {
  1: {
    1: { total: 30, perBag: 30 }
  },
  2: {
    1: { total: 46, perBag: 23 },
    2: { total: 52, perBag: 26 }
  },
  4: {
    1: { total: 80, perBag: 20 },
    2: { total: 88, perBag: 22 },
    3: { total: 92, perBag: 23 },
    4: { total: 96, perBag: 24 }
  }
};

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedBags, setSelectedBags] = useState(null);
  const [selectedPickups, setSelectedPickups] = useState(null);
  const [billingCycle, setBillingCycle] = useState(1); // 1, 3, 6, 12
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessingUpsell, setIsProcessingUpsell] = useState(false); // New state for second payment
  const [pickupDates, setPickupDates] = useState([]); // Replaced single date with an array
  const [pickupTimes, setPickupTimes] = useState([]); // Array to store time slots for each pickup
  const [selectedUpsells, setSelectedUpsells] = useState([]); // Track selected one-off services

  // Upsell Options Data
  const upsellOptions = [
    { id: 'shoes', title: 'Premium Shoe Clean', original: 20, discounted: 15, icon: Sparkles },
    { id: 'duvet', title: 'Winter Duvet Wash', original: 25, discounted: 18, icon: Cloud },
    { id: 'suit', title: '2-Piece Suit Dry Clean', original: 18, discounted: 14, icon: Shirt }
  ];

  const toggleUpsell = (id) => {
    setSelectedUpsells(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Gemini API States
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiError, setAiError] = useState("");

  // Helper for API retries
  const fetchWithRetry = async (url, options, maxRetries = 5) => {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const error = new Error(`HTTP error! status: ${response.status}`);
          error.status = response.status;
          throw error;
        }
        return await response.json();
      } catch (e) {
        // Do not retry on client errors that won't resolve with time (like 400, 401, 403, 404)
        if (e.status === 400 || e.status === 401 || e.status === 403 || e.status === 404 || i === maxRetries - 1) {
          throw e;
        }
        await new Promise(resolve => setTimeout(resolve, delays[i]));
      }
    }
  };

  const getAiRecommendation = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setAiError("");
    setAiRecommendation(null);

    const apiKey = ""; 
    const systemPrompt = `You are an expert laundry assistant for Flydry. 
Recommend a subscription plan based on the user's needs.
Available bags per month: 1, 2, or 4. (1 bag = 10kg).
Available pickups per month:
- 1 bag: exactly 1 pickup
- 2 bags: 1 or 2 pickups
- 4 bags: 1, 2, 3, or 4 pickups

You MUST output ONLY a valid JSON object matching this exact structure:
{
  "bags": (either 1, 2, or 4),
  "pickups": (number based on bags rule),
  "reasoning": "A short, friendly sentence explaining why this plan fits."
}`;

    const payload = {
      contents: [{ parts: [{ text: aiInput }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            bags: { type: "INTEGER" },
            pickups: { type: "INTEGER" },
            reasoning: { type: "STRING" }
          }
        }
      }
    };

    try {
      const data = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      
      let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (resultText) {
        // Clean up potential markdown formatting that breaks JSON parsing
        resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(resultText);
        setAiRecommendation(parsed);
      } else {
        throw new Error("Invalid or empty response format from AI");
      }
    } catch (err) {
      console.error("AI Assistant Error:", err);
      
      // Fallback: If we get a 401 (expired preview session token) or network issue, 
      // instantly switch to a smart offline recommendation mode so the app doesn't break for the user!
      const lowerInput = aiInput.toLowerCase();
      let fallbackRec = { bags: 1, pickups: 1, reasoning: "Our 1-bag plan with 1 pickup is a great starting point." };
      
      if (lowerInput.includes("family") || lowerInput.includes("kids") || lowerInput.includes("four") || lowerInput.includes("4")) {
        fallbackRec = { bags: 4, pickups: 4, reasoning: "For families, our 4-bag plan with weekly pickups is the most convenient to keep up with laundry." };
      } else if (lowerInput.includes("couple") || lowerInput.includes("partner") || lowerInput.includes("two") || lowerInput.includes("2") || lowerInput.includes("wife") || lowerInput.includes("husband")) {
        fallbackRec = { bags: 2, pickups: 2, reasoning: "For couples or active individuals, 2 bags and bi-weekly pickups usually works perfectly." };
      }

      setAiRecommendation(fallbackRec);
      setAiError(err.status === 401 
        ? "Note: Live connection expired. Displaying offline smart recommendation instead." 
        : "Note: Live AI unavailable. Displaying offline smart recommendation instead.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAiRecommendation = () => {
    if (aiRecommendation) {
      setSelectedBags(aiRecommendation.bags);
      setSelectedPickups(aiRecommendation.pickups);
      setStep(3); // Skip step 2 since AI chose pickups too
    }
  };

  // Brand Colors mapped from your logo/bag
  const brand = {
    copper: '#C8905B',       // Flydry text/logo color
    copperHover: '#A66E3D',  // Darker copper for hovers
    copperLight: '#FAF4EE',  // Very soft copper tint for selected backgrounds
    green: '#155c32',        // Forest green from the bag straps
    greenLight: '#E8F3ED',   // Soft green for savings badges
  };

  // Handle Bag Selection
  const handleBagSelect = (bags) => {
    setSelectedBags(bags);
    setSelectedPickups(null);
    setStep(2);
  };

  const handlePickupSelect = (pickups) => {
    setSelectedPickups(pickups);
  };

  const handleNextToInfo = () => {
    if (selectedPickups) setStep(3);
  };

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(5); // Move to scheduling step instead of success immediately
    }, 1500);
  };

  const handleConfirmSchedule = () => {
    if (selectedUpsells.length > 0) {
      // Simulate separate payment for the upsells
      setIsProcessingUpsell(true);
      setTimeout(() => {
        setIsProcessingUpsell(false);
        setIsSuccess(true);
      }, 1500);
    } else {
      setIsSuccess(true);
    }
  };

  const currentPlan = selectedBags && selectedPickups ? pricingData[selectedBags][selectedPickups] : null;

  const standardPricePerKg = 3.5;
  const standardDeliveryFee = 2; 
  const normalCost = selectedBags && selectedPickups ? (selectedBags * 10 * standardPricePerKg) + (selectedPickups * standardDeliveryFee) : 0;
  
  // Billing cycle calculations
  const discountRates = { 1: 0, 3: 0.05, 6: 0.10, 12: 0.20 };
  const currentDiscount = discountRates[billingCycle];
  
  const discountedMonthly = currentPlan ? currentPlan.total * (1 - currentDiscount) : 0;
  const discountedPerBag = currentPlan ? currentPlan.perBag * (1 - currentDiscount) : 0;
  const upfrontTotal = discountedMonthly * billingCycle;
  
  // Total savings compared to pay-as-you-go standard rates over the selected period
  const totalSavings = currentPlan ? (normalCost * billingCycle) - upfrontTotal : 0;
  const savingsPerMonth = totalSavings / billingCycle;

  // Scheduling Logic Helpers
  const formatDate = (dateString) => {
    if (!dateString) return "";
    // Parse date properly to avoid timezone shifts
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
  };

  const getIntervalText = () => {
    if (selectedPickups === 1) return "Subsequent months will renew on this same exact date.";
    if (selectedPickups === 2) return "Your 2 pickups are automatically spaced ~15 days apart. You can adjust the 2nd date below.";
    if (selectedPickups === 3) return "Your 3 pickups are automatically spaced ~10 days apart. You can adjust them below.";
    if (selectedPickups === 4) return "Your 4 pickups are automatically spaced weekly (7 days apart). You can adjust them below.";
    return "";
  };

  const timeSlotOptions = [
    "Morning (8am - 12pm)",
    "Afternoon (12pm - 4pm)",
    "Evening (6pm - 10pm)"
  ];

  const handleFirstDateChange = (e) => {
    const val = e.target.value;
    if (!val) {
      setPickupDates([]);
      setPickupTimes([]);
      return;
    }

    // Always start by setting the first date
    const dates = [val];
    const baseDate = new Date(val);
    
    let intervalDays = 0;
    if (selectedPickups === 2) intervalDays = 15;
    if (selectedPickups === 3) intervalDays = 10;
    if (selectedPickups === 4) intervalDays = 7;
    
    // Auto-calculate the remaining dates and push to array
    for (let i = 1; i < selectedPickups; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + (intervalDays * i));
      dates.push(nextDate.toISOString().split('T')[0]);
    }
    setPickupDates(dates);
    
    // Set default time slots for all pickups if not already set
    if (pickupTimes.length !== selectedPickups) {
      setPickupTimes(new Array(selectedPickups).fill(timeSlotOptions[0]));
    }
  };

  const handleOtherDateChange = (idx, val) => {
    const newDates = [...pickupDates];
    newDates[idx] = val;
    setPickupDates(newDates);
  };

  const handleTimeChange = (idx, val) => {
    const newTimes = [...pickupTimes];
    newTimes[idx] = val;
    setPickupTimes(newTimes);
  };

  const isScheduleValid = pickupDates.length === selectedPickups && pickupDates.every(d => d !== "") && pickupTimes.every(t => t !== "");

  // --- Render Functions for each step ---

  const renderStep1 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Choose your plan</h2>
        <p className="text-gray-500 mt-2">Select how many bags you need to be serviced per month.</p>
        
        {/* Gemini AI Integration */}
        <div className="mt-6 max-w-xl mx-auto">
          {!showAiHelper ? (
            <button 
              onClick={() => setShowAiHelper(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-all hover:scale-105"
              style={{ backgroundColor: brand.copperLight, color: brand.copperHover }}
            >
              <Sparkles size={16} /> ✨ Not sure? Ask our AI Assistant
            </button>
          ) : (
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-2 mb-3">
                <Bot size={20} style={{ color: brand.copper }} />
                <span className="font-bold text-gray-800">Flydry AI Helper</span>
              </div>
              <textarea 
                value={aiInput}
                onChange={(e) => {
                  setAiInput(e.target.value);
                  // Clear the old recommendation and errors as soon as they start typing something new
                  setAiRecommendation(null);
                  setAiError("");
                }}
                placeholder="E.g., I live with my partner, we work out a lot and do laundry every 2 weeks..."
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 resize-none text-sm"
                rows={2}
              />
              {aiError && <p className="text-orange-500 font-medium text-xs mt-2">{aiError}</p>}
              
              {aiRecommendation ? (
                <div className="mt-4 p-4 rounded-xl shadow-sm border" style={{ backgroundColor: brand.greenLight, borderColor: brand.green }}>
                  <p className="text-sm font-medium mb-3" style={{ color: brand.green }}>
                    <Sparkles size={14} className="inline mr-1" />
                    {aiRecommendation.reasoning}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="font-bold text-gray-900 text-sm">
                      Recommendation: {aiRecommendation.bags} Bags, {aiRecommendation.pickups} Pickups
                    </span>
                    <button 
                      onClick={applyAiRecommendation}
                      className="w-full sm:w-auto px-4 py-2 rounded-full text-white text-sm font-bold transition-all hover:scale-105"
                      style={{ backgroundColor: brand.copper }}
                    >
                      Apply Plan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end mt-3">
                  <button 
                    onClick={getAiRecommendation}
                    disabled={isAiLoading || !aiInput.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold disabled:opacity-50 transition-all"
                    style={{ backgroundColor: brand.copper }}
                  >
                    {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {isAiLoading ? "Thinking..." : "Get Recommendation"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 4].map((bagCount) => {
          // Calculate the lowest possible monthly price for this bag tier
          const minPrice = Math.min(...Object.values(pricingData[bagCount]).map(p => p.total));
          
          return (
          <button
            key={bagCount}
            onClick={() => handleBagSelect(bagCount)}
            className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-200 
              ${selectedBags === bagCount 
                ? 'shadow-md transform scale-105' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}
            style={selectedBags === bagCount ? { borderColor: brand.copper, backgroundColor: brand.copperLight } : {}}
          >
            <div 
              className={`p-4 rounded-full mb-3 ${selectedBags !== bagCount ? 'bg-gray-100 text-gray-400' : ''}`}
              style={selectedBags === bagCount ? { backgroundColor: brand.copper, color: 'white' } : {}}
            >
              <ShoppingBag size={32} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <span className="text-xl font-bold text-gray-900">{bagCount} {bagCount === 1 ? 'Bag' : 'Bags'}</span>
              <div className="text-xs text-gray-500 font-medium tracking-wide">({bagCount * 10} KG)</div>
            </div>
            
            <div className="mt-4 flex flex-col items-center w-full">
              <div 
                className={`text-sm font-black px-3 py-1 rounded-full border ${selectedBags === bagCount ? 'bg-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`}
                style={selectedBags === bagCount ? { color: brand.copperHover, borderColor: 'rgba(200, 144, 91, 0.3)' } : {}}
              >
                From £{minPrice}<span className="text-xs font-semibold opacity-80">/mo</span>
              </div>
              <span className="text-xs text-gray-500 mt-2 text-center font-medium">
                {bagCount === 1 ? 'Max 1 pickup' : bagCount === 2 ? '1 or 2 pickups' : '1 to 4 pickups'}
              </span>
            </div>
          </button>
        )})}
      </div>
    </div>
  );

  const renderStep2 = () => {
    const pickupOptions = Object.keys(pricingData[selectedBags]).map(Number);
    
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Select pick up frequency</h2>
          <p className="text-gray-500 mt-2">How many times should we pick up your {selectedBags} {selectedBags === 1 ? 'bag' : 'bags'}?</p>
        </div>

        <div className="space-y-3 max-w-xl mx-auto">
          {pickupOptions.map((pickupCount) => {
            const planDetails = pricingData[selectedBags][pickupCount];
            const isSelected = selectedPickups === pickupCount;
            
            return (
              <div
                key={pickupCount}
                onClick={() => handlePickupSelect(pickupCount)}
                className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                  ${isSelected ? 'shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                style={isSelected ? { borderColor: brand.copper, backgroundColor: brand.copperLight } : {}}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`p-2 rounded-full ${!isSelected ? 'bg-gray-100 text-gray-400' : ''}`}
                    style={isSelected ? { backgroundColor: brand.copper, color: 'white' } : {}}
                  >
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{pickupCount} {pickupCount === 1 ? 'Pick up' : 'Pick ups'}</p>
                    <p className="text-sm text-gray-500 font-medium">£{planDetails.total} / month</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end" style={{ color: isSelected ? brand.copperHover : '#6b7280' }}>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Per Bag</span>
                  <span className="text-xl font-black leading-none mt-1">£{planDetails.perBag}</span>
                  <span className="text-xs font-semibold opacity-80 mt-1">£{(planDetails.perBag / 10).toFixed(2)} / kg</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center max-w-xl mx-auto pt-6">
          <button 
            onClick={() => setStep(1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <button
            disabled={!selectedPickups}
            onClick={handleNextToInfo}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all
              ${selectedPickups 
                ? 'text-white shadow-md transform hover:scale-105' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            style={selectedPickups ? { backgroundColor: brand.copper } : {}}
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Flydry Bag</h2>
        <p className="text-gray-500 mt-2">How your monthly quota works</p>
      </div>

      <div className="bg-white border-2 rounded-2xl overflow-hidden shadow-sm" style={{ borderColor: brand.copperLight }}>
        {/* Flydry Bag Image Container */}
        <div className="h-48 bg-gray-100 w-full relative overflow-hidden">
            <img 
              // DEVELOPER NOTE: Replace the src below with the actual URL of the Flydry bag image hosted on your site
              src="/flydry-bag.jpg" 
              alt="Flydry Wash & Fold Bag" 
              className="w-full h-full object-cover"
              onError={(e) => { 
                e.target.onerror = null; 
                // Fallback placeholder just for the preview if the image isn't found
                e.target.src = "https://images.unsplash.com/photo-1550963295-019d8a8a61c5?auto=format&fit=crop&q=80&w=800"; 
                e.target.className = "w-full h-full object-cover opacity-80 mix-blend-luminosity";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white px-5 py-2.5 rounded-lg font-bold backdrop-blur-md shadow-2xl border border-white/20 uppercase tracking-widest text-sm" style={{ backgroundColor: 'rgba(200, 144, 91, 0.85)' }}>
                Holds ~10kg
              </span>
            </div>
        </div>
        
        <div className="p-5 space-y-5" style={{ backgroundColor: brand.copperLight }}>
          <div className="flex gap-4 items-start">
            <div className="mt-1 bg-white p-2.5 rounded-full shadow-sm shrink-0" style={{ color: brand.copper }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Flexible Monthly Quota</h4>
              <p className="text-sm text-gray-600 leading-relaxed mt-1 font-medium">
                Each bag holds about 10kg. We weigh everything at our facility. If you pack a bit more (e.g., 12kg), no problem! We just deduct the extra from your overall monthly quota.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="mt-1 bg-white p-2.5 rounded-full shadow-sm shrink-0" style={{ color: brand.green }}>
              <Calendar size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Unused Quota Rolls Over</h4>
              <p className="text-sm text-gray-600 leading-relaxed mt-1 font-medium">
                Didn't use all your laundry allowance? If you leave more than 1/3rd of your monthly quota unused, it automatically rolls over to your next month!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button 
          onClick={() => setStep(2)}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>
        
        <button
          onClick={() => setStep(4)}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-md transform hover:scale-105 transition-all"
          style={{ backgroundColor: brand.copper }}
        >
          Review Plan <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order Summary</h2>
        <p className="text-gray-500 mt-2">Review your subscription details</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { months: 1, label: 'Monthly', save: null },
          { months: 3, label: '3 Months', save: 'Save 5%' },
          { months: 6, label: '6 Months', save: 'Save 10%' },
          { months: 12, label: 'Annual', save: 'Save 20%' }
        ].map(opt => (
          <button
            key={opt.months}
            onClick={() => setBillingCycle(opt.months)}
            className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${billingCycle === opt.months ? 'shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            style={billingCycle === opt.months ? { borderColor: brand.copper, backgroundColor: brand.copperLight } : {}}
          >
            <span className={`font-bold ${billingCycle === opt.months ? 'text-gray-900' : 'text-gray-600'}`}>{opt.label}</span>
            {opt.save && (
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full" style={billingCycle === opt.months ? { backgroundColor: brand.copper, color: 'white' } : { backgroundColor: brand.greenLight, color: brand.green }}>{opt.save}</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-600">
              <ShoppingBag size={18} style={{ color: brand.copper }} />
              <span className="font-medium">Bags selected</span>
            </div>
            <span className="font-bold text-gray-900">{selectedBags} {selectedBags === 1 ? 'Bag' : 'Bags'}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-600">
              <Truck size={18} style={{ color: brand.copper }} />
              <span className="font-medium">Pick up frequency</span>
            </div>
            <span className="font-bold text-gray-900">{selectedPickups} {selectedPickups === 1 ? 'time' : 'times'} / mo</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar size={18} style={{ color: brand.copper }} />
              <span className="font-medium">Price breakdown</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold px-3 py-1 rounded-md" style={{ backgroundColor: brand.copperLight, color: brand.copperHover }}>
                £{discountedPerBag.toFixed(2)} / bag
              </span>
              <span className="text-xs text-gray-500 mt-1.5 font-semibold">
                (£{(discountedPerBag / 10).toFixed(2)} / kg)
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Equivalent to</p>
              {savingsPerMonth > 0 && (
                <div className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold shadow-sm" style={{ backgroundColor: brand.greenLight, color: brand.green }}>
                  Save £{savingsPerMonth.toFixed(2)} / month
                </div>
              )}
            </div>
            <div className="text-right flex items-end gap-3 justify-end">
              {savingsPerMonth > 0 && (
                <span className="text-xl text-gray-400 line-through mb-1 font-medium">£{normalCost.toFixed(2)}</span>
              )}
              <span className="text-4xl font-black text-gray-900 tracking-tight leading-none">£{discountedMonthly.toFixed(2)}</span>
              <span className="text-gray-500 font-bold mb-1">/mo</span>
            </div>
          </div>
          
          {billingCycle > 1 && (
            <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600">Billed upfront ({billingCycle} months)</span>
              <span className="text-xl font-black text-gray-900">£{upfrontTotal.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full flex justify-center items-center gap-2 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ backgroundColor: brand.copper }}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <>
              <CreditCard size={20} />
              Pay £{upfrontTotal.toFixed(2)} Today
            </>
          )}
        </button>
        <button 
          onClick={() => setStep(2)}
          className="w-full text-center text-gray-500 hover:text-gray-900 py-2 font-semibold transition-colors"
        >
          Modify Selection
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Minimum date is tomorrow
    const minDateString = today.toISOString().split('T')[0];

    const upsellTotal = selectedUpsells.reduce((total, id) => {
      const item = upsellOptions.find(u => u.id === id);
      return total + (item ? item.discounted : 0);
    }, 0);

    return (
      <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm" style={{ backgroundColor: brand.greenLight, color: brand.green }}>
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Payment Successful!</h2>
          <p className="text-gray-500 mt-2">Let's schedule your {selectedPickups} monthly {selectedPickups === 1 ? 'pickup' : 'pickups'}.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-5">
           <div>
             <label className="block text-sm font-bold text-gray-900 mb-2">Select your first pickup date & time</label>
             <div className="flex flex-col sm:flex-row gap-3">
               <input 
                 type="date" 
                 min={minDateString}
                 value={pickupDates[0] || ""}
                 onChange={handleFirstDateChange}
                 className="w-full sm:w-1/2 p-4 border-2 rounded-xl border-gray-200 focus:outline-none focus:ring-0 text-gray-800 font-medium transition-colors"
                 style={{ 
                   borderColor: pickupDates[0] ? brand.copper : '#e5e7eb',
                   backgroundColor: pickupDates[0] ? brand.copperLight : 'white'
                 }}
               />
               {pickupDates.length > 0 && (
                 <select
                   value={pickupTimes[0] || ""}
                   onChange={(e) => handleTimeChange(0, e.target.value)}
                   className="w-full sm:w-1/2 p-4 border-2 rounded-xl border-gray-200 focus:outline-none focus:ring-0 text-gray-800 font-medium transition-colors bg-white cursor-pointer"
                   style={{ borderColor: brand.copper }}
                 >
                   {timeSlotOptions.map(slot => (
                     <option key={slot} value={slot}>{slot}</option>
                   ))}
                 </select>
               )}
             </div>
           </div>
           
           {pickupDates.length > 0 && selectedPickups > 1 && (
             <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-bold text-gray-900 mb-1">Your schedule this month:</h4>
                <p className="text-xs text-gray-500 mb-4">{getIntervalText()}</p>
                <div className="space-y-3">
                  {pickupDates.map((dateStr, idx) => {
                    if (idx === 0) return null; // Skip first date since it's above
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-sm font-bold shadow-sm shrink-0" style={{ backgroundColor: brand.copper, color: 'white' }}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row gap-2">
                           <input 
                             type="date"
                             min={pickupDates[idx-1] || minDateString} // Prevent picking a date before the previous pickup
                             value={dateStr}
                             onChange={(e) => handleOtherDateChange(idx, e.target.value)}
                             className="w-full sm:w-1/2 p-3 sm:p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 text-gray-800 font-medium bg-white"
                             style={{ outlineColor: brand.copper }}
                           />
                           <select
                             value={pickupTimes[idx] || ""}
                             onChange={(e) => handleTimeChange(idx, e.target.value)}
                             className="w-full sm:w-1/2 p-3 sm:p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 text-gray-800 font-medium bg-white cursor-pointer"
                             style={{ outlineColor: brand.copper }}
                           >
                             {timeSlotOptions.map(slot => (
                               <option key={slot} value={slot}>{slot}</option>
                             ))}
                           </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 flex gap-3 items-start p-4 rounded-xl shadow-sm" style={{ backgroundColor: brand.greenLight }}>
                   <Clock size={18} className="shrink-0 mt-0.5" style={{ color: brand.green }} />
                   <p className="text-xs font-semibold leading-relaxed" style={{ color: brand.green }}>
                     Don't worry! You can easily change these dates later from your dashboard, up to 48 hours before your scheduled pickup time.
                   </p>
                </div>
             </div>
           )}

           {pickupDates.length > 0 && selectedPickups === 1 && (
             <div className="mt-4 flex gap-3 items-start p-4 rounded-xl shadow-sm" style={{ backgroundColor: brand.greenLight }}>
               <Clock size={18} className="shrink-0 mt-0.5" style={{ color: brand.green }} />
               <p className="text-xs font-semibold leading-relaxed" style={{ color: brand.green }}>
                 {getIntervalText()} Don't worry, you can easily reschedule later from your dashboard up to 48 hours before.
               </p>
             </div>
           )}

           {/* Upsell Section - Appears after a date is picked */}
           {pickupDates.length > 0 && (
             <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in duration-500">
               <div className="flex justify-between items-end mb-4">
                 <div>
                   <h4 className="text-sm font-bold text-gray-900">Need anything else on your first pickup?</h4>
                   <p className="text-xs text-gray-500 mt-1">Add one-off items now with your exclusive subscriber discount.</p>
                 </div>
               </div>
               
               <div className="space-y-3">
                 {upsellOptions.map((upsell) => {
                   const isSelected = selectedUpsells.includes(upsell.id);
                   const Icon = upsell.icon;
                   return (
                     <div 
                       key={upsell.id}
                       onClick={() => toggleUpsell(upsell.id)}
                       className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                       style={isSelected ? { borderColor: brand.copper, backgroundColor: brand.copperLight } : {}}
                     >
                       <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-full ${isSelected ? 'bg-white shadow-sm' : 'bg-gray-50 text-gray-400'}`} style={isSelected ? { color: brand.copper } : {}}>
                           <Icon size={18} />
                         </div>
                         <div>
                           <p className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{upsell.title}</p>
                           <div className="flex items-center gap-2 mt-0.5">
                             <span className="text-xs text-gray-400 line-through">£{upsell.original}</span>
                             <span className="text-sm font-black" style={{ color: isSelected ? brand.copperHover : brand.green }}>£{upsell.discounted}</span>
                           </div>
                         </div>
                       </div>
                       
                       <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isSelected ? 'border-transparent text-white' : 'border-gray-300 text-transparent'}`} style={isSelected ? { backgroundColor: brand.copper } : {}}>
                         {isSelected ? <Check size={14} strokeWidth={3} /> : <Plus size={14} className="text-gray-400" />}
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>
           )}

        </div>

        <div className="pt-2">
          <button
            onClick={handleConfirmSchedule}
            disabled={!isScheduleValid || isProcessingUpsell}
            className="w-full flex justify-center items-center gap-2 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: brand.copper }}
          >
            {isProcessingUpsell ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                {selectedUpsells.length > 0 ? `Pay £${upsellTotal.toFixed(2)} & Confirm` : 'Confirm Schedule'} <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderSuccess = () => {
    const upsellTotal = selectedUpsells.reduce((total, id) => {
      const item = upsellOptions.find(u => u.id === id);
      return total + (item ? item.discounted : 0);
    }, 0);

    return (
      <div className="text-center py-10 animate-in zoom-in duration-500 space-y-6">
        <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm" style={{ backgroundColor: brand.greenLight, color: brand.green }}>
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">You're All Set!</h2>
        <div className="text-gray-600 font-medium max-w-sm mx-auto leading-relaxed space-y-3">
          <p>
            Your subscription is active and your first pickup is locked in for <strong>{formatDate(pickupDates[0])}</strong> between <strong>{pickupTimes[0]?.split(' ')[0]}</strong>. We'll send you a reminder beforehand.
          </p>
          {selectedUpsells.length > 0 && (
            <div className="p-4 mt-4 rounded-xl text-sm shadow-sm border text-left" style={{ backgroundColor: brand.copperLight, borderColor: brand.copper, color: brand.copperHover }}>
              <div className="flex justify-between items-start mb-3 border-b pb-2" style={{ borderColor: 'rgba(200, 144, 91, 0.2)' }}>
                <span className="font-black tracking-tight">Separate Order Confirmed</span>
                <span className="font-bold">£{upsellTotal.toFixed(2)} Paid</span>
              </div>
              <ul className="space-y-1.5">
                {selectedUpsells.map(id => {
                  const item = upsellOptions.find(u => u.id === id);
                  return <li key={id} className="flex items-center gap-2"><Check size={14} /> {item.title}</li>;
                })}
              </ul>
              <p className="mt-3 text-xs opacity-90 font-medium">These items will be collected alongside your first scheduled pickup.</p>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setStep(1);
            setSelectedBags(null);
            setSelectedPickups(null);
            setBillingCycle(1);
            setPickupDates([]);
            setPickupTimes([]);
            setSelectedUpsells([]);
            setIsSuccess(false);
          }}
          className="mt-8 px-8 py-3 bg-gray-100 text-gray-800 font-bold rounded-full hover:bg-gray-200 transition-colors shadow-sm"
        >
          Go to Dashboard (Start Over)
        </button>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#FDFDFD] flex flex-col items-center py-6 sm:py-8 px-4 sm:px-8 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 sm:p-10">
        
        {/* Progress Stepper */}
        {(!isSuccess && step < 5) && (
          <div className="flex justify-center items-center mb-10">
            <div className="flex items-center w-full max-w-lg">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${step >= 1 ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                style={step >= 1 ? { backgroundColor: brand.copper } : {}}
              >1</div>
              <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full ${step >= 2 ? '' : 'bg-gray-100'}`} style={step >= 2 ? { backgroundColor: brand.copper } : {}}></div>
              
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${step >= 2 ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                style={step >= 2 ? { backgroundColor: brand.copper } : {}}
              >2</div>
              <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full ${step >= 3 ? '' : 'bg-gray-100'}`} style={step >= 3 ? { backgroundColor: brand.copper } : {}}></div>
              
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${step >= 3 ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                style={step >= 3 ? { backgroundColor: brand.copper } : {}}
              >3</div>
              <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full ${step >= 4 ? '' : 'bg-gray-100'}`} style={step >= 4 ? { backgroundColor: brand.copper } : {}}></div>
              
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${step >= 4 ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                style={step >= 4 ? { backgroundColor: brand.copper } : {}}
              >4</div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="min-h-[400px] flex flex-col justify-center">
          {isSuccess ? renderSuccess() : step === 1 ? renderStep1() : step === 2 ? renderStep2() : step === 3 ? renderStep3() : step === 4 ? renderStep4() : renderStep5()}
        </div>

      </div>
    </div>
  );
}
