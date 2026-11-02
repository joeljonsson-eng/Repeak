import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  RotateCcw, 
  DollarSign, 
  ShoppingBag, 
  Layers, 
  Sliders, 
  ArrowRight,
  Zap,
  HelpCircle,
  Tag
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { FashionValuationResult } from '../types';

interface PresetItem {
  name: string;
  price: number;
  category: string;
  condition: string;
  marketplace: string;
  tag: string;
  image: string;
}

const PRESET_ITEMS: PresetItem[] = [
  {
    name: 'Acne Studios Musubi Mini Bag',
    price: 4800,
    category: 'Väskor',
    condition: 'Mycket gott skick',
    marketplace: 'Tradera',
    tag: 'Lyxaccessoar',
    image: '/src/assets/images/product_acne_musubi_black_1792668380821.jpg'
  },
  {
    name: "Arc'teryx Beta LT Jacket",
    price: 3200,
    category: 'Jackor & Ytterkläder',
    condition: 'Mycket gott skick',
    marketplace: 'Plick',
    tag: 'Gorpcore Hype',
    image: '/src/assets/images/product_arcteryx_beta_jacket_1792668381886.jpg'
  },
  {
    name: 'Totême Striped Wool Knit',
    price: 2350,
    category: 'Stickat',
    condition: 'Nyskick / Med lappar',
    marketplace: 'Sellpy',
    tag: 'Klassiker',
    image: '/src/assets/images/product_toteme_striped_knit_1792668381116.jpg'
  },
  {
    name: 'Ganni Seersucker Check Midi Dress',
    price: 1100,
    category: 'Klänningar',
    condition: 'Gott skick',
    marketplace: 'Vinted',
    tag: 'Sommarfavorit',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Our Legacy Camion Boots (Black)',
    price: 3400,
    category: 'Skor',
    condition: 'Mycket gott skick',
    marketplace: 'Tradera',
    tag: 'Trending Footwear',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Stüssy 8-Ball Mohair Cardigan',
    price: 2850,
    category: 'Stickat',
    condition: 'Mycket gott skick',
    marketplace: 'Plick',
    tag: 'Streetwear Grail',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=400&q=80'
  }
];

const CATEGORIES_SV = [
  'Alla kategorier',
  'Jackor & Ytterkläder',
  'Väskor',
  'Stickat',
  'Klänningar',
  'Skor',
  'Jeans & Byxor',
  'Tröjor & Hoodies',
  'Accessoarer'
];

const CATEGORIES_EN = [
  'All categories',
  'Jackets & Outerwear',
  'Bags',
  'Knitwear',
  'Dresses',
  'Shoes & Boots',
  'Jeans & Trousers',
  'Sweaters & Hoodies',
  'Accessories'
];

const CONDITIONS_SV = [
  'Nyskick / Med lappar',
  'Mycket gott skick',
  'Gott skick / Normalt slitage',
  'Defekt / Synligt slitage'
];

const CONDITIONS_EN = [
  'New with tags',
  'Very good condition',
  'Good condition / Normal wear',
  'Worn / Minor flaws'
];

const MARKETPLACES = [
  'Tradera',
  'Plick',
  'Sellpy',
  'Vinted',
  'Blocket',
  'Vestiaire Collective',
  'Grailed'
];

export default function FashionPriceEvaluator() {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  // Input states
  const [itemName, setItemName] = useState('Acne Studios Musubi Mini Bag');
  const [askingPrice, setAskingPrice] = useState<number | string>(4800);
  const [category, setCategory] = useState(isEn ? 'Bags' : 'Väskor');
  const [condition, setCondition] = useState(isEn ? 'Very good condition' : 'Mycket gott skick');
  const [marketplace, setMarketplace] = useState('Tradera');

  // Execution states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<FashionValuationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Sync category & condition language when language changes
  useEffect(() => {
    if (isEn) {
      if (category === 'Väskor') setCategory('Bags');
      if (category === 'Jackor & Ytterkläder') setCategory('Jackets & Outerwear');
      if (category === 'Stickat') setCategory('Knitwear');
      if (category === 'Klänningar') setCategory('Dresses');
      if (category === 'Skor') setCategory('Shoes & Boots');
      if (category === 'Jeans & Byxor') setCategory('Jeans & Trousers');
      if (condition === 'Mycket gott skick') setCondition('Very good condition');
      if (condition === 'Nyskick / Med lappar') setCondition('New with tags');
    } else {
      if (category === 'Bags') setCategory('Väskor');
      if (category === 'Jackets & Outerwear') setCategory('Jackets & Outerwear');
      if (category === 'Knitwear') setCategory('Stickat');
      if (category === 'Dresses') setCategory('Klänningar');
      if (category === 'Shoes & Boots') setCategory('Skor');
      if (category === 'Jeans & Trousers') setCategory('Jeans & Byxor');
      if (condition === 'Very good condition') setCondition('Mycket gott skick');
      if (condition === 'New with tags') setCondition('Nyskick / Med lappar');
    }
  }, [isEn]);

  // Handle Preset selection
  const handleSelectPreset = (preset: PresetItem) => {
    setItemName(preset.name);
    setAskingPrice(preset.price);
    setCategory(preset.category);
    setCondition(preset.condition);
    setMarketplace(preset.marketplace);
    runValuation(preset.name, preset.price, preset.category, preset.condition, preset.marketplace);
  };

  // Perform Valuation API call
  const runValuation = async (
    customName?: string, 
    customPrice?: number | string,
    customCat?: string,
    customCond?: string,
    customMarket?: string
  ) => {
    const targetName = (customName || itemName).trim();
    const targetPrice = Number(customPrice !== undefined ? customPrice : askingPrice);

    if (!targetName) {
      setError(isEn ? 'Please enter a fashion item name to evaluate.' : 'Ange ett plagg eller modellnamn att värdera.');
      return;
    }

    if (!targetPrice || isNaN(targetPrice) || targetPrice <= 0) {
      setError(isEn ? 'Please enter a valid asking price.' : 'Ange ett giltigt begärt pris i kr.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingStep(1);

    // Step simulator for pleasant user feedback while Gemini analyzes
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const response = await fetch('/api/fashion-valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: targetName,
          askingPrice: targetPrice,
          category: customCat || category,
          condition: customCond || condition,
          marketplace: customMarket || marketplace,
          language: isEn ? 'EN' : 'SV'
        })
      });

      const json = await response.json();
      clearInterval(stepInterval);

      if (json.success && json.data) {
        setResult(json.data);
      } else {
        throw new Error(json.error || 'Valuation failed');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Valuation error:', err);
      setError(isEn ? 'Could not evaluate the item. Please try again.' : 'Kunde inte slutföra värderingen. Försök igen.');
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  // Run initial valuation on mount
  useEffect(() => {
    runValuation();
  }, []);

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleCopyShare = () => {
    if (!result) return;
    const shareText = isEn
      ? `Repeak AI Price Valuation for ${result.itemName}:\nAsking: ${result.askingPrice} SEK | Fair Market Avg: ${result.fairMarketPrice.average} SEK\nVerdict: ${result.verdictLabel} (Deal Score: ${result.dealScore}/100)\nTrend: ${result.priceTrendTrajectory.direction} (${result.priceTrendTrajectory.percentage3Months > 0 ? '+' : ''}${result.priceTrendTrajectory.percentage3Months}% / 3 mo)`
      : `Repeak AI-Prisvärdering för ${result.itemName}:\nBegärt pris: ${result.askingPrice} kr | Marknadssnitt: ${result.fairMarketPrice.average} kr\nOmdöme: ${result.verdictLabel} (Deal Score: ${result.dealScore}/100)\nTrend: ${result.priceTrendTrajectory.direction} (${result.priceTrendTrajectory.percentage3Months > 0 ? '+' : ''}${result.priceTrendTrajectory.percentage3Months}% / 3 mån)`;
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const getVerdictTheme = (verdict?: string) => {
    switch (verdict) {
      case 'great_bargain':
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
          badge: 'bg-emerald-500 text-neutral-950',
          ring: '#10b981',
          label: isEn ? 'Great Bargain' : 'Stort Fyndläge',
          glow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]'
        };
      case 'fair_price':
        return {
          bg: 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300',
          badge: 'bg-cyan-500 text-neutral-950',
          ring: '#06b6d4',
          label: isEn ? 'Fair Price' : 'Rimligt Pris',
          glow: 'shadow-[0_0_30px_rgba(6,182,212,0.25)]'
        };
      case 'slightly_high':
        return {
          bg: 'bg-amber-950/40 border-amber-500/40 text-amber-300',
          badge: 'bg-amber-500 text-neutral-950',
          ring: '#f59e0b',
          label: isEn ? 'Slightly High' : 'Något Överpris',
          glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]'
        };
      case 'overpriced':
      default:
        return {
          bg: 'bg-rose-950/40 border-rose-500/40 text-rose-300',
          badge: 'bg-rose-500 text-white',
          ring: '#f43f5e',
          label: isEn ? 'Overpriced' : 'Överpris / Dålig affär',
          glow: 'shadow-[0_0_30px_rgba(244,63,94,0.25)]'
        };
    }
  };

  const theme = getVerdictTheme(result?.priceVerdict);

  return (
    <section id="fashion-evaluator" className="w-full py-16 px-4 md:px-6 relative font-sans text-[#ededed]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-violet-600/10 via-emerald-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>{isEn ? 'Gemini 2.5 Real-Time Price Index' : 'Gemini 2.5 Realtids Värderingsmotor'}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
            {isEn ? 'Is it a fair secondhand price?' : 'Är plagget ett fynd eller överpris?'}
          </h2>

          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            {isEn
              ? 'Enter any secondhand fashion item and asking price to instantly benchmark against active & completed listings across Tradera, Plick, Sellpy, and Vinted.'
              : 'Skriv in valfritt begagnat plagg och annonspris. Vår AI analyserar tusentals avslutade och aktiva annonser från Tradera, Plick, Sellpy och Vinted för att ge dig marknadens sanna värde.'}
          </p>
        </div>

        {/* Quick Item Presets */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              {isEn ? 'Quick presets from Swedish secondhand trends:' : 'Snabbval bland populära heta plagg:'}
            </span>
            <span className="text-[11px] text-white/40 font-mono hidden sm:inline">
              {isEn ? 'Click to auto-evaluate' : 'Klicka för direktvärdering'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {PRESET_ITEMS.map((preset) => {
              const isSelected = itemName === preset.name;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                    isSelected
                      ? 'bg-violet-950/70 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                  }`}
                >
                  <div className="w-full h-20 rounded-lg overflow-hidden mb-2 relative bg-neutral-900 border border-white/5 flex items-center justify-center">
                    <img
                      src={preset.image}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-black/80 text-emerald-400">
                      {preset.price} kr
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase text-violet-400 font-bold block truncate">
                      {preset.tag}
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-violet-200 transition-colors">
                      {preset.name}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Valuation Control Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 md:p-6 shadow-2xl mb-8">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              runValuation();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Item Name Input */}
              <div className="md:col-span-5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  {isEn ? 'Fashion Item / Model' : 'Plagg & Modell'}
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder={isEn ? "e.g. Acne Studios Musubi Bag" : "T.ex. Acne Studios Musubi Bag, Arc'teryx Beta LT..."}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-zinc-700/70 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Asking Price Input */}
              <div className="md:col-span-3">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  {isEn ? 'Asking Price (SEK)' : 'Begärt Annonspris (kr)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    placeholder="4800"
                    className="w-full px-4 py-2.5 bg-black/60 border border-zinc-700/70 rounded-xl text-white text-sm font-mono font-bold placeholder:text-white/30 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-white/40">
                    SEK
                  </span>
                </div>
              </div>

              {/* Category selector */}
              <div className="md:col-span-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  {isEn ? 'Category' : 'Kategori'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/60 border border-zinc-700/70 rounded-xl text-white text-xs font-sans focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                >
                  {(isEn ? CATEGORIES_EN : CATEGORIES_SV).map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Button */}
              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 text-white font-sans font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50 cursor-pointer h-[42px]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="font-mono">{isEn ? 'Scanning...' : 'Värderar...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-emerald-300" />
                      <span>{isEn ? 'Evaluate Price' : 'Värdera Pris'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sub filters / modifiers */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-white/50 font-mono text-[11px]">{isEn ? 'Condition:' : 'Skick:'}</span>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="bg-black/40 border border-zinc-800 rounded-lg px-2.5 py-1 text-white text-xs font-sans focus:outline-none focus:border-violet-500"
                >
                  {(isEn ? CONDITIONS_EN : CONDITIONS_SV).map((c) => (
                    <option key={c} value={c} className="bg-zinc-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white/50 font-mono text-[11px]">{isEn ? 'Marketplace:' : 'Marknadsplats:'}</span>
                <select
                  value={marketplace}
                  onChange={(e) => setMarketplace(e.target.value)}
                  className="bg-black/40 border border-zinc-800 rounded-lg px-2.5 py-1 text-white text-xs font-sans focus:outline-none focus:border-violet-500"
                >
                  {MARKETPLACES.map((m) => (
                    <option key={m} value={m} className="bg-zinc-900 text-white">
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ml-auto text-[11px] font-mono text-emerald-400/80 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isEn ? 'Verified Gemini valuation model' : 'Verifierad Gemini värderingsmodell'}</span>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Loading Progress State */}
        {isLoading && (
          <div className="bg-zinc-900/60 border border-violet-500/30 rounded-2xl p-8 text-center my-6 relative overflow-hidden">
            <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-400 animate-spin mx-auto mb-4" />
            <h4 className="text-base font-bold text-white mb-2">
              {isEn ? 'Analyzing Market Price & Real-Time Trajectory...' : 'Hämtar marknadsdata och kalkylerar pristrend...'}
            </h4>
            <div className="max-w-md mx-auto space-y-2 text-xs font-mono text-white/60">
              <div className={`flex items-center gap-2 transition-opacity ${loadingStep >= 1 ? 'opacity-100 text-emerald-400' : 'opacity-40'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Searching completed transactions on Tradera, Plick & Vinted' : 'Analyserar avslutade auktioner på Tradera, Plick & Vinted'}</span>
              </div>
              <div className={`flex items-center gap-2 transition-opacity ${loadingStep >= 2 ? 'opacity-100 text-cyan-400' : 'opacity-40'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Executing Gemini 2.5 Multivariable Price Engine' : 'Kör Gemini 2.5 Multivariabla Prisindexmodell'}</span>
              </div>
              <div className={`flex items-center gap-2 transition-opacity ${loadingStep >= 3 ? 'opacity-100 text-violet-400' : 'opacity-40'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Synthesizing 6-month forecast & negotiation playbook' : 'Genererar 6-månaders prognos & förhandlingsguide'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Valuation Result Display */}
        {result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Top Verdict & Score Hero Banner */}
            <div className={`rounded-2xl border p-5 md:p-8 backdrop-blur-xl ${theme.bg} ${theme.glow} transition-all`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Left: Deal Score Gauge */}
                <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-white/10 text-center">
                  <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-white/10"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke={theme.ring}
                        strokeWidth="8"
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * result.dealScore) / 100}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black font-mono text-white tracking-tight">
                        {result.dealScore}
                      </span>
                      <span className="text-[9px] font-mono uppercase text-white/50 font-bold">
                        Deal Score
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-white/70 font-semibold">
                    {isEn ? 'AI Confidence:' : 'AI-säkerhet:'} <strong className="text-white font-mono">{result.confidenceScore}%</strong>
                  </span>
                </div>

                {/* Center: Verdict Title & Breakdown */}
                <div className="lg:col-span-6 space-y-3 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black font-mono uppercase tracking-wider ${theme.badge}`}>
                      {theme.label}
                    </span>
                    <span className="text-xs font-mono text-white/60">
                      {result.brand} · {result.category}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {result.verdictLabel}
                  </h3>

                  <p className="text-white/80 text-sm leading-relaxed">
                    {result.verdictDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-2">
                    <div className="bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase font-bold">{isEn ? 'Asking Price' : 'Begärt Pris'}</span>
                      <span className="text-white font-bold text-sm">{result.askingPrice} kr</span>
                    </div>

                    <div className="bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase font-bold">{isEn ? 'Fair Market Avg' : 'Marknadssnitt'}</span>
                      <span className="text-emerald-400 font-bold text-sm">{result.fairMarketPrice.average} kr</span>
                    </div>

                    <div className="bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase font-bold">{isEn ? 'Est. New Price' : 'Est. Nypris'}</span>
                      <span className="text-white/60 font-bold text-sm line-through">{result.estimatedRetailPrice} kr</span>
                    </div>
                  </div>
                </div>

                {/* Right: Price Trend Direction Pill & Velocity */}
                <div className="lg:col-span-3 flex flex-col gap-3">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-white/50">
                        {isEn ? 'Price Trajectory' : 'Pristrend (3 mån)'}
                      </span>
                      {result.priceTrendTrajectory.direction === 'Rising' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          +{result.priceTrendTrajectory.percentage3Months}%
                        </span>
                      ) : result.priceTrendTrajectory.direction === 'Falling' ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-mono text-xs font-bold">
                          <TrendingDown className="w-3.5 h-3.5" />
                          {result.priceTrendTrajectory.percentage3Months}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-cyan-400 font-mono text-xs font-bold">
                          <Minus className="w-3.5 h-3.5" />
                          0%
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-white/70 leading-snug line-clamp-2">
                      {result.priceTrendTrajectory.trendSummary}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-white/50 text-[10px] uppercase">{isEn ? 'Resale Velocity' : 'Säljbarhet'}:</span>
                    <span className="text-white font-bold">{result.resaleVelocity}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Interactive Price Spectrum Range Bar */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                    {isEn ? 'Fair Price Range Spectrum' : 'Marknadsvärderings-spektrum (SEK)'}
                  </h4>
                </div>
                <span className="text-xs font-mono text-white/50">
                  {isEn ? `Based on active & sold listings` : `Baserat på aktiva & avslutade köp`}
                </span>
              </div>

              {/* Visual Range Bar */}
              <div className="pt-8 pb-4 px-2">
                <div className="relative h-4 bg-zinc-800 rounded-full overflow-visible">
                  {/* Fair Value Zone */}
                  <div 
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500/30 via-cyan-500/40 to-emerald-500/30 border-y border-emerald-400/40"
                    style={{
                      left: '25%',
                      width: '50%'
                    }}
                  />

                  {/* Min Fair Price Marker */}
                  <div className="absolute top-5 left-[25%] -translate-x-1/2 text-center">
                    <span className="block text-[10px] font-mono text-white/40 uppercase font-bold">{isEn ? 'Min Fair' : 'Lägst rimligt'}</span>
                    <span className="block text-xs font-mono font-bold text-white">{result.fairMarketPrice.min} kr</span>
                  </div>

                  {/* Avg Fair Price Marker */}
                  <div className="absolute -top-6 left-[50%] -translate-x-1/2 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-neutral-950 text-[10px] font-mono font-black uppercase">
                      {isEn ? 'Market Target' : 'Marknadssnitt'} {result.fairMarketPrice.average} kr
                    </span>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rotate-45 mx-auto -mt-0.5" />
                  </div>

                  {/* Max Fair Price Marker */}
                  <div className="absolute top-5 left-[75%] -translate-x-1/2 text-center">
                    <span className="block text-[10px] font-mono text-white/40 uppercase font-bold">{isEn ? 'Max Fair' : 'Högst rimligt'}</span>
                    <span className="block text-xs font-mono font-bold text-white">{result.fairMarketPrice.max} kr</span>
                  </div>

                  {/* Current Asking Price Pin */}
                  {(() => {
                    // Calculate position between 0% and 100% relative to min/max/retail
                    const minRef = result.fairMarketPrice.min * 0.7;
                    const maxRef = result.fairMarketPrice.max * 1.3;
                    const clampedRatio = Math.max(0.05, Math.min(0.95, (result.askingPrice - minRef) / (maxRef - minRef)));
                    const pinLeft = `${clampedRatio * 100}%`;

                    return (
                      <div 
                        className="absolute -top-7 -translate-x-1/2 z-20 text-center transition-all"
                        style={{ left: pinLeft }}
                      >
                        <div className={`px-2.5 py-1 rounded-lg font-mono font-black text-xs shadow-lg flex items-center gap-1 ${theme.badge}`}>
                          <span>{isEn ? 'Asking' : 'Begärt'}: {result.askingPrice} kr</span>
                        </div>
                        <div className={`w-2 h-2 rotate-45 mx-auto -mt-1 ${theme.badge}`} />
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6 border-t border-zinc-800 text-xs font-mono">
                <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-800/80">
                  <span className="text-white/40 text-[10px] block uppercase">{isEn ? 'Price Difference' : 'Prisskillnad mot snitt'}</span>
                  <span className={`font-bold ${result.priceDifferenceSek <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.priceDifferenceSek > 0 ? `+${result.priceDifferenceSek}` : `${result.priceDifferenceSek}`} kr ({result.priceDifferencePercent > 0 ? `+${result.priceDifferencePercent}` : `${result.priceDifferencePercent}`}%)
                  </span>
                </div>

                <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-800/80">
                  <span className="text-white/40 text-[10px] block uppercase">{isEn ? 'Savings vs Retail' : 'Besparing mot Nypris'}</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.max(0, result.estimatedRetailPrice - result.askingPrice)} kr ({Math.round(((result.estimatedRetailPrice - result.askingPrice) / result.estimatedRetailPrice) * 100)}%)
                  </span>
                </div>

                <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-800/80">
                  <span className="text-white/40 text-[10px] block uppercase">{isEn ? 'Target Buy Price' : 'Rekommenderat köppris'}</span>
                  <span className="text-cyan-400 font-bold">{result.fairMarketPrice.recommendedTarget} kr</span>
                </div>

                <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-800/80">
                  <span className="text-white/40 text-[10px] block uppercase">{isEn ? 'Authenticity & Check' : 'Äkthetskontroll'}</span>
                  <span className="text-violet-300 font-bold truncate block">{result.buyerAdvice || (isEn ? 'Verify tags' : 'Kontrollera tvättråd')}</span>
                </div>
              </div>
            </div>

            {/* Trend Trajectory Chart & Valuation Drivers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left (7 cols): 6-Month Price Trend Trajectory */}
              <div className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-violet-400" />
                      <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                        {isEn ? '6-Month Price Trend Trajectory' : '6 Månaders Prisutveckling & Trend'}
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/30 text-violet-300 font-bold">
                      {result.priceTrendTrajectory.direction}
                    </span>
                  </div>

                  {/* Monthly points visual chart */}
                  {result.priceTrendTrajectory.monthlyHistory && result.priceTrendTrajectory.monthlyHistory.length > 0 ? (
                    <div className="space-y-3 py-2">
                      <div className="grid grid-cols-6 gap-2 items-end h-32 pt-6">
                        {result.priceTrendTrajectory.monthlyHistory.map((m, idx) => {
                          const prices = result.priceTrendTrajectory.monthlyHistory.map(p => p.price);
                          const minP = Math.min(...prices) * 0.9;
                          const maxP = Math.max(...prices) * 1.1;
                          const heightPct = Math.max(20, Math.min(100, ((m.price - minP) / (maxP - minP)) * 100));

                          return (
                            <div key={idx} className="flex flex-col items-center h-full justify-end group">
                              <span className="text-[10px] font-mono font-bold text-white/50 mb-1 group-hover:text-emerald-300 transition-colors">
                                {m.price}
                              </span>
                              <div className="w-full max-w-[36px] bg-zinc-800 group-hover:bg-gradient-to-t group-hover:from-violet-600 group-hover:to-emerald-400 rounded-t-md transition-all duration-300 relative overflow-hidden"
                                style={{ height: `${heightPct}%` }}
                              >
                                <div className="absolute top-0 inset-x-0 h-1 bg-violet-400" />
                              </div>
                              <span className="text-[10px] font-mono text-white/40 mt-1.5">
                                {m.month}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {/* Forecast Text */}
                  <div className="mt-4 p-3 rounded-xl bg-black/40 border border-zinc-800/80 text-xs text-white/70 font-sans leading-relaxed">
                    <strong className="text-white block font-mono text-[11px] mb-1 uppercase tracking-wider">
                      {isEn ? 'Seasonal Outlook & Forecast:' : 'Säsongsprognos & Framtidsutsikter:'}
                    </strong>
                    {result.priceTrendTrajectory.forecast6Months}
                  </div>
                </div>

                {/* Marketplace Benchmarks */}
                {result.marketBenchmarks && result.marketBenchmarks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-zinc-800/80">
                    <span className="text-[10px] font-mono uppercase font-bold text-white/50 block mb-2">
                      {isEn ? 'Platform Price Benchmarks:' : 'Prisjämförelse per marknadsplats:'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      {result.marketBenchmarks.map((bench) => (
                        <div key={bench.platform} className="bg-black/30 p-2 rounded-lg border border-zinc-800 flex flex-col justify-between">
                          <span className="text-white/50 text-[10px] font-bold">{bench.platform}</span>
                          <span className="text-white font-bold text-xs mt-1">{bench.avgPrice} kr</span>
                          <span className="text-[9px] text-white/40">{bench.activeListings} {isEn ? 'listings' : 'annonser'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right (5 cols): Key Valuation Factors & Smart Negotiation Strategy */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Value Drivers */}
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                      {isEn ? 'Valuation Drivers' : 'Faktorer Bakom Värderingen'}
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    {result.valueFactors.map((vf, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-zinc-800/80 flex items-start gap-2.5">
                        {vf.score === 'positive' ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <TrendingUp className="w-3 h-3" />
                          </div>
                        ) : vf.score === 'negative' ? (
                          <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                            <TrendingDown className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-zinc-700/40 text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                            <Minus className="w-3 h-3" />
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {vf.factor}
                          </span>
                          <p className="text-[11px] text-white/60 leading-relaxed">
                            {vf.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Negotiation Playbook */}
                <div className="bg-gradient-to-br from-violet-950/40 via-zinc-900 to-zinc-900 border border-violet-500/30 rounded-2xl p-5 md:p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-violet-400" />
                      <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                        {isEn ? 'Negotiation Playbook' : 'Smart Förhandlingsguide'}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                      {isEn ? 'AI Strategy' : 'AI-Strategi'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 font-mono text-xs">
                    <div className="bg-black/50 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-white/40 block uppercase">{isEn ? 'Opening Offer' : 'Föreslaget Öppningsbud'}</span>
                      <span className="text-emerald-400 font-bold text-sm">{result.negotiationStrategy.recommendedOpeningOffer} kr</span>
                    </div>

                    <div className="bg-black/50 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-white/40 block uppercase">{isEn ? 'Walk-Away Max' : 'Maxpris (Walk away)'}</span>
                      <span className="text-rose-300 font-bold text-sm">{result.negotiationStrategy.walkAwayPrice} kr</span>
                    </div>
                  </div>

                  <p className="text-xs text-white/70 mb-3 leading-relaxed">
                    {result.negotiationStrategy.tactic}
                  </p>

                  {/* Ready-to-copy chat template */}
                  <div className="relative bg-black/60 p-3 rounded-xl border border-zinc-800 text-xs font-mono text-white/80">
                    <span className="text-[9px] uppercase font-bold text-white/40 block mb-1">
                      {isEn ? 'Ready-to-send message to seller:' : 'Kopieringsfärdigt meddelande till säljaren:'}
                    </span>
                    <p className="pr-8 text-[11px] italic text-white/90">
                      "{result.negotiationStrategy.sampleMessage}"
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(result.negotiationStrategy.sampleMessage)}
                      className="absolute right-2.5 bottom-2.5 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white/80 hover:text-white transition-colors cursor-pointer"
                      title={isEn ? 'Copy message' : 'Kopiera meddelande'}
                    >
                      {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedShare ? (isEn ? 'Copied!' : 'Kopierat!') : (isEn ? 'Copy Valuation Report' : 'Kopiera Värderingsrapport')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => runValuation()}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white/70 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Re-calculate' : 'Kör om kalkyl'}</span>
                </button>
              </div>

              {/* Link to search active items */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/search?q=${encodeURIComponent(result.itemName)}`}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-sans font-bold flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
                >
                  <span>{isEn ? `Search "${result.itemName}" across all apps` : `Sök "${result.itemName}" på alla appar`}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </section>
  );
}
