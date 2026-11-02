import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Tag, TrendingUp, Check, ShieldCheck, ShoppingBag, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface BrandValuation {
  min: number;
  max: number;
  retail: number;
  bestMkt: string;
  turnaroundDays: string;
  demandScore: number; // out of 100
}

export default function SimplePriceEstimator() {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  const [brand, setBrand] = useState('Acne Studios');
  const [category, setCategory] = useState<'jackor' | 'stickat' | 'denim' | 'vaskor' | 'skor'>('jackor');
  const [condition, setCondition] = useState<'mint' | 'very_good' | 'good' | 'worn'>('very_good');

  // Baseline resale valuation matrix for Sweden (prices in SEK)
  const VALUATIONS: Record<string, Record<'jackor' | 'stickat' | 'denim' | 'vaskor' | 'skor', BrandValuation>> = {
    'Acne Studios': {
      jackor: { min: 2800, max: 5400, retail: 8500, bestMkt: 'Tradera & Vestiaire', turnaroundDays: '3–6 dagar', demandScore: 94 },
      stickat: { min: 1400, max: 2600, retail: 3800, bestMkt: 'Tradera & Vinted', turnaroundDays: '2–4 dagar', demandScore: 92 },
      denim: { min: 850, max: 1600, retail: 2600, bestMkt: 'Tradera & Sellpy', turnaroundDays: '4–7 dagar', demandScore: 85 },
      vaskor: { min: 4200, max: 7800, retail: 12500, bestMkt: 'Vestiaire & Tradera', turnaroundDays: '4–9 dagar', demandScore: 96 },
      skor: { min: 1200, max: 2400, retail: 4500, bestMkt: 'Vinted & Plick', turnaroundDays: '5–8 dagar', demandScore: 78 },
    },
    'Totême': {
      jackor: { min: 3800, max: 7200, retail: 11000, bestMkt: 'Tradera & Vestiaire', turnaroundDays: '2–5 dagar', demandScore: 97 },
      stickat: { min: 2200, max: 3600, retail: 4800, bestMkt: 'Tradera & Vinted', turnaroundDays: '1–3 dagar', demandScore: 98 },
      denim: { min: 1100, max: 1900, retail: 2800, bestMkt: 'Sellpy & Tradera', turnaroundDays: '3–6 dagar', demandScore: 88 },
      vaskor: { min: 4500, max: 8500, retail: 11500, bestMkt: 'Vestiaire & Tradera', turnaroundDays: '3–7 dagar', demandScore: 95 },
      skor: { min: 1600, max: 2900, retail: 4900, bestMkt: 'Tradera & Sellpy', turnaroundDays: '4–8 dagar', demandScore: 82 },
    },
    "Arc'teryx": {
      jackor: { min: 2900, max: 5600, retail: 6800, bestMkt: 'Tradera & Blocket', turnaroundDays: '1–2 dagar', demandScore: 99 },
      stickat: { min: 1100, max: 1800, retail: 2200, bestMkt: 'Tradera & Plick', turnaroundDays: '2–4 dagar', demandScore: 89 },
      denim: { min: 1200, max: 1900, retail: 2400, bestMkt: 'Tradera', turnaroundDays: '3–5 dagar', demandScore: 84 },
      vaskor: { min: 950, max: 1950, retail: 2600, bestMkt: 'Plick & Vinted', turnaroundDays: '2–3 dagar', demandScore: 91 },
      skor: { min: 1400, max: 2400, retail: 2800, bestMkt: 'Tradera & Blocket', turnaroundDays: '3–5 dagar', demandScore: 86 },
    },
    'Carhartt': {
      jackor: { min: 1200, max: 2400, retail: 2800, bestMkt: 'Plick & Tradera', turnaroundDays: '1–3 dagar', demandScore: 95 },
      stickat: { min: 450, max: 850, retail: 1200, bestMkt: 'Vinted & Plick', turnaroundDays: '2–4 dagar', demandScore: 87 },
      denim: { min: 550, max: 1100, retail: 1400, bestMkt: 'Tradera & Vinted', turnaroundDays: '2–5 dagar', demandScore: 90 },
      vaskor: { min: 350, max: 700, retail: 900, bestMkt: 'Vinted & Plick', turnaroundDays: '2–4 dagar', demandScore: 83 },
      skor: { min: 600, max: 1100, retail: 1600, bestMkt: 'Tradera', turnaroundDays: '4–7 dagar', demandScore: 76 },
    },
    'Ganni': {
      jackor: { min: 1600, max: 3200, retail: 4500, bestMkt: 'Tradera & Vinted', turnaroundDays: '2–5 dagar', demandScore: 91 },
      stickat: { min: 1100, max: 2100, retail: 2800, bestMkt: 'Vinted & Tradera', turnaroundDays: '2–4 dagar', demandScore: 93 },
      denim: { min: 650, max: 1200, retail: 1900, bestMkt: 'Sellpy & Vinted', turnaroundDays: '3–5 dagar', demandScore: 84 },
      vaskor: { min: 800, max: 1600, retail: 2400, bestMkt: 'Vinted & Plick', turnaroundDays: '2–4 dagar', demandScore: 86 },
      skor: { min: 900, max: 1800, retail: 3400, bestMkt: 'Tradera & Sellpy', turnaroundDays: '3–6 dagar', demandScore: 80 },
    },
    "Levi's": {
      jackor: { min: 650, max: 1400, retail: 1600, bestMkt: 'Tradera & Blocket', turnaroundDays: '2–4 dagar', demandScore: 88 },
      stickat: { min: 300, max: 550, retail: 900, bestMkt: 'Vinted & Sellpy', turnaroundDays: '2–5 dagar', demandScore: 79 },
      denim: { min: 450, max: 950, retail: 1300, bestMkt: 'Tradera & Vinted', turnaroundDays: '1–3 dagar', demandScore: 94 },
      vaskor: { min: 250, max: 480, retail: 700, bestMkt: 'Vinted', turnaroundDays: '3–6 dagar', demandScore: 72 },
      skor: { min: 350, max: 650, retail: 1000, bestMkt: 'Sellpy', turnaroundDays: '4–8 dagar', demandScore: 70 },
    },
    'Our Legacy': {
      jackor: { min: 2400, max: 4600, retail: 6500, bestMkt: 'Tradera & Grailed', turnaroundDays: '2–4 dagar', demandScore: 93 },
      stickat: { min: 1600, max: 2800, retail: 3900, bestMkt: 'Tradera & Plick', turnaroundDays: '1–3 dagar', demandScore: 96 },
      denim: { min: 1400, max: 2400, retail: 3400, bestMkt: 'Tradera & Plick', turnaroundDays: '1–3 dagar', demandScore: 97 },
      vaskor: { min: 1100, max: 2100, retail: 3200, bestMkt: 'Tradera & Vinted', turnaroundDays: '3–5 dagar', demandScore: 86 },
      skor: { min: 1900, max: 3600, retail: 5200, bestMkt: 'Tradera & Plick', turnaroundDays: '2–5 dagar', demandScore: 92 },
    }
  };

  const conditionMultipliers = {
    mint: { factor: 1.15, labelSv: 'Nyskick (med tags / oanvänd)', labelEn: 'Mint (with tags / unworn)' },
    very_good: { factor: 1.00, labelSv: 'Mycket fint skick (inga defekter)', labelEn: 'Very good (no flaws)' },
    good: { factor: 0.80, labelSv: 'Gott skick (normalt slitage)', labelEn: 'Good (normal wear)' },
    worn: { factor: 0.55, labelSv: 'Använt / Patina (synligt slitage)', labelEn: 'Worn / Patina (visible wear)' },
  };

  const selectedData = VALUATIONS[brand]?.[category] || VALUATIONS['Acne Studios']['jackor'];
  const conditionMeta = conditionMultipliers[condition];

  const estimatedMin = Math.round(selectedData.min * conditionMeta.factor);
  const estimatedMax = Math.round(selectedData.max * conditionMeta.factor);
  const estimatedAvg = Math.round((estimatedMin + estimatedMax) / 2);

  // Swedish Platform Net Seller Payout Math:
  // Tradera: 10% fee (capped at 200 kr)
  const traderaFee = Math.min(200, Math.round(estimatedAvg * 0.10));
  const traderaNet = estimatedAvg - traderaFee;

  // Sellpy: 40% commission cut + 12 kr listing fee
  const sellpyFee = Math.round(estimatedAvg * 0.40) + 12;
  const sellpyNet = Math.max(0, estimatedAvg - sellpyFee);

  // Vinted: 0% seller fee (the buyer pays buyer protection 5% + 7 kr)
  const vintedNet = estimatedAvg;

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto scroll-mt-24 font-sans" id="vardera">
      <div className="bg-[#0b0d10] border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
          
          {/* Left Column: Interactive Selector Form */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider mb-2">
                <Tag className="w-3.5 h-3.5" />
                <span>{isEn ? 'Nordic Wardrobe Valuation' : 'Garderobsvärdering för Andrahandsmarknaden'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display text-balance">
                {isEn ? 'What is your garment worth secondhand?' : 'Vad är ditt plagg värt på andrahandsmarknaden?'}
              </h2>
              <p className="text-white/60 text-xs sm:text-sm mt-2 font-light leading-relaxed">
                {isEn
                  ? 'Calculate realistic resale value and compare net payouts across Tradera, Sellpy, and Vinted with Swedish fee structures.'
                  : 'Få en realistisk andrahandsvärdering och se exakt hur mycket pengar du behåller i plånboken efter avgifter på Tradera, Sellpy och Vinted.'}
              </p>
            </div>

            <div className="space-y-5">
              {/* 1. Brand Selector */}
              <div>
                <label className="block text-xs font-mono text-white/50 mb-1.5 uppercase font-bold tracking-wider">
                  {isEn ? '1. Brand' : '1. Varumärke'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.keys(VALUATIONS).map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBrand(b)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer truncate text-left border ${
                        brand === b
                          ? 'bg-white text-neutral-950 font-bold border-white shadow-md'
                          : 'bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.06] border-white/5'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Category Selector */}
              <div>
                <label className="block text-xs font-mono text-white/50 mb-1.5 uppercase font-bold tracking-wider">
                  {isEn ? '2. Category' : '2. Typ av plagg'}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'jackor', labelSv: 'Jacka', labelEn: 'Jacket' },
                    { id: 'stickat', labelSv: 'Stickat', labelEn: 'Knitwear' },
                    { id: 'denim', labelSv: 'Jeans', labelEn: 'Denim' },
                    { id: 'vaskor', labelSv: 'Väska', labelEn: 'Bag' },
                    { id: 'skor', labelSv: 'Skor', labelEn: 'Shoes' },
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer text-center border ${
                        category === c.id
                          ? 'bg-emerald-500 text-neutral-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.06] border-white/5'
                      }`}
                    >
                      {isEn ? c.labelEn : c.labelSv}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Condition Wear Stepper */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-white/50 uppercase font-bold tracking-wider">
                    {isEn ? '3. Condition Grading' : '3. Skickgradering'}
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {conditionMeta.factor === 1.15 ? '+15% premium' : conditionMeta.factor === 1.0 ? 'Standard 100%' : `${Math.round((conditionMeta.factor - 1) * 100)}%`}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'mint', labelSv: 'Nyskick', descSv: 'Med tags', labelEn: 'Mint', descEn: 'With tags' },
                    { id: 'very_good', labelSv: 'Mycket fint', descSv: 'Inga fel', labelEn: 'Very Good', descEn: 'No flaws' },
                    { id: 'good', labelSv: 'Gott skick', descSv: 'Normalt', labelEn: 'Good', descEn: 'Normal wear' },
                    { id: 'worn', labelSv: 'Använt', descSv: 'Patina', labelEn: 'Worn', descEn: 'Patina' },
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCondition(c.id as any)}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                        condition === c.id
                          ? 'bg-white/[0.08] border-emerald-400/80 text-white shadow-sm'
                          : 'bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="text-xs font-bold">{isEn ? c.labelEn : c.labelSv}</div>
                      <div className="text-[10px] text-white/40 font-mono mt-0.5">{isEn ? c.descEn : c.descSv}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Valuation & Net Payout Comparison */}
          <div className="lg:col-span-5">
            <motion.div
              layout
              className="bg-[#101317] border border-white/10 rounded-2xl p-6 space-y-6 text-left shadow-2xl relative overflow-hidden"
            >
              {/* Header result */}
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block mb-1">
                  {isEn ? 'ESTIMATED RESALE PRICE CORRIDOR' : 'BERÄKNAT ANDRAHANDSVÄRDE'}
                </span>
                
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                  {estimatedMin.toLocaleString('sv-SE')} – {estimatedMax.toLocaleString('sv-SE')} kr
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-xs text-white/50 font-mono">
                  <span>{isEn ? 'Retail baseline:' : 'Uppskattat nypris:'} <span className="line-through text-white/40">{selectedData.retail.toLocaleString('sv-SE')} kr</span></span>
                  <span>·</span>
                  <span className="text-emerald-400 font-bold">{selectedData.demandScore}/100 {isEn ? 'liquidity' : 'likviditet'}</span>
                </div>
              </div>

              {/* Swedish Platform Net Payout Comparison */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/60 font-bold">
                    {isEn ? 'Net Payout by Platform (SEK)' : 'Netto i plånboken per sajt'}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {isEn ? 'At ~' : 'Vid ~'}{estimatedAvg.toLocaleString('sv-SE')} kr
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Vinted */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-[#09B1BA]/30 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#09B1BA]">Vinted</span>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          0% {isEn ? 'seller fee' : 'säljaravgift'}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/40 block mt-0.5">{isEn ? 'Buyer pays protection' : 'Köparen betalar köparskydd'}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-white font-mono tabular-nums">{vintedNet.toLocaleString('sv-SE')} kr</div>
                      <span className="text-[9px] text-white/40 font-mono">{isEn ? '100% net' : '100% netto'}</span>
                    </div>
                  </div>

                  {/* Tradera */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-[#f07c00]/30 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#f07c00]">Tradera</span>
                        <span className="text-[9px] font-mono text-white/50">
                          10% {isEn ? 'fee (max 200 kr)' : 'provision (max 200 kr)'}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/40 block mt-0.5">{isEn ? 'High buyer bidding' : 'Högsta budgivning'}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-white font-mono tabular-nums">{traderaNet.toLocaleString('sv-SE')} kr</div>
                      <span className="text-[9px] text-white/40 font-mono">-{traderaFee} kr {isEn ? 'fee' : 'avgift'}</span>
                    </div>
                  </div>

                  {/* Sellpy */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-400">Sellpy</span>
                        <span className="text-[9px] font-mono text-white/50">
                          40% {isEn ? 'commission + 12 kr' : 'provision + 12 kr'}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/40 block mt-0.5">{isEn ? 'Sellpy handles photos & ship' : 'Sellpy fotar & skickar'}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-white font-mono tabular-nums">{sellpyNet.toLocaleString('sv-SE')} kr</div>
                      <span className="text-[9px] text-white/40 font-mono">-{sellpyFee} kr {isEn ? 'deductions' : 'avdrag'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liquidity info & Direct Search Button */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-white/60 mb-3 font-mono">
                  <span>{isEn ? 'Est. days to sell:' : 'Uppskattad säljtid:'}</span>
                  <span className="font-bold text-white">{selectedData.turnaroundDays}</span>
                </div>

                <Link
                  to={`/search?q=${encodeURIComponent(`${brand} ${category === 'jackor' ? 'jacka' : category === 'stickat' ? 'stickat' : category === 'denim' ? 'jeans' : category === 'vaskor' ? 'väska' : 'skor'}`)}`}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-[1.01]"
                >
                  <span>{isEn ? `Search live ${brand} listings` : `Hitta aktiva ${brand}-annonser`}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

