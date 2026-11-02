import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Calendar, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Eye, 
  Info,
  DollarSign,
  Activity,
  ShoppingBag,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export interface CategoryMetric {
  id: string;
  nameSv: string;
  nameEn: string;
  color: string;
  gradientId: string;
  iconName: string;
  currentAvgPrice: number;
  startPrice: number;
  changePercent: number;
  changeSek: number;
  volatilitySv: 'Hög säsongseffekt' | 'Måttlig' | 'Mycket stabil' | 'Avsvalnande';
  volatilityEn: 'High seasonality' | 'Moderate' | 'Very stable' | 'Cooling';
  topBrands: string[];
  bestTipSv: string;
  bestTipEn: string;
  sampleItemsSv: string;
  sampleItemsEn: string;
}

export const CATEGORIES: CategoryMetric[] = [
  {
    id: 'jackor',
    nameSv: 'Jackor & Ytterkläder',
    nameEn: 'Jackets & Outerwear',
    color: '#3cbd82',
    gradientId: 'gradJackor',
    iconName: 'Shield',
    currentAvgPrice: 3120,
    startPrice: 2150,
    changePercent: 45.1,
    changeSek: 970,
    volatilitySv: 'Hög säsongseffekt',
    volatilityEn: 'High seasonality',
    topBrands: ["Arc'teryx", 'Patagonia', 'Carhartt', 'The North Face', 'Barbour'],
    bestTipSv: 'Säljläge just nu! Höst- och vinterefterfrågan toppar i okt-nov. Priserna väntas sjunka i januari.',
    bestTipEn: 'Prime selling window! Fall/winter demand peaks in Oct-Nov. Resale values historically drop in January.',
    sampleItemsSv: 'Beta LT, Retro-X fleece, Detroit jackets, Puffers',
    sampleItemsEn: 'Beta LT, Retro-X fleece, Detroit jackets, Puffers'
  },
  {
    id: 'stickat',
    nameSv: 'Stickat & Tröjor',
    nameEn: 'Knitwear & Sweaters',
    color: '#a855f7',
    gradientId: 'gradStickat',
    iconName: 'Layers',
    currentAvgPrice: 1890,
    startPrice: 1350,
    changePercent: 40.0,
    changeSek: 540,
    volatilitySv: 'Hög säsongseffekt',
    volatilityEn: 'High seasonality',
    topBrands: ['Totême', 'Acne Studios', 'Our Legacy', 'Ganni', 'Ralph Lauren'],
    bestTipSv: 'Kvalitetsmaterial (ull/mohair/kashmir) ökar med 40% inför hösten. Hållbar andrahandsmarknad.',
    bestTipEn: 'Natural wool, mohair, and cashmere pieces surged 40% entering Q4. Strong resale retention.',
    sampleItemsSv: 'Randiga stickade tröjor, Mohair cardigans, Kabelstickat',
    sampleItemsEn: 'Striped knits, Mohair cardigans, Cable knits'
  },
  {
    id: 'skor',
    nameSv: 'Skor & Sneakers',
    nameEn: 'Footwear & Sneakers',
    color: '#f59e0b',
    gradientId: 'gradSkor',
    iconName: 'Footprints',
    currentAvgPrice: 1510,
    startPrice: 1620,
    changePercent: -6.8,
    changeSek: -110,
    volatilitySv: 'Avsvalnande',
    volatilityEn: 'Cooling',
    topBrands: ['Salomon', 'Adidas', 'Nike', 'Asics', 'New Balance'],
    bestTipSv: 'Köpläge för köpare! Sneakers har normaliserats efter sommarens hype. Bra fynd på Tradera & Vinted.',
    bestTipEn: 'Buyer’s advantage! Sneaker prices softened post-summer. Great deals on secondary platforms.',
    sampleItemsSv: 'Salomon XT-6, Adidas Samba/Spezial, Dunks, Gel-Kayano 14',
    sampleItemsEn: 'Salomon XT-6, Adidas Samba/Spezial, Dunks, Gel-Kayano 14'
  },
  {
    id: 'vaskor',
    nameSv: 'Väskor & Lyxaccessoarer',
    nameEn: 'Bags & Luxury Accessories',
    color: '#f43f5e',
    gradientId: 'gradVaskor',
    iconName: 'ShoppingBag',
    currentAvgPrice: 3920,
    startPrice: 3450,
    changePercent: 13.6,
    changeSek: 470,
    volatilitySv: 'Mycket stabil',
    volatilityEn: 'Very stable',
    topBrands: ['Acne Studios', 'Prada', 'Goyard', 'Jacquemus', 'Maison Margiela'],
    bestTipSv: 'Mest inflationssäkra kategorin. Tidlösa designerväskor behåller 80-95% av sitt andrahandsvärde.',
    bestTipEn: 'Strongest inflation hedge. Timeless designer bags consistently preserve 80-95% resale value.',
    sampleItemsSv: 'Acne Musubi, Prada Nylon Mini, Vintage Shoulder bags',
    sampleItemsEn: 'Acne Musubi, Prada Nylon Mini, Vintage Shoulder bags'
  },
  {
    id: 'denim',
    nameSv: 'Jeans & Byxor',
    nameEn: 'Denim & Trousers',
    color: '#38bdf8',
    gradientId: 'gradDenim',
    iconName: 'Scissors',
    currentAvgPrice: 1210,
    startPrice: 980,
    changePercent: 23.5,
    changeSek: 230,
    volatilitySv: 'Måttlig',
    volatilityEn: 'Moderate',
    topBrands: ["Levi's", 'Our Legacy', 'Carhartt', 'Diesel', 'Acne Studios'],
    bestTipSv: 'Vintage 90s Levi’s 501 och vida silhuetter stiger stadigt varje månad.',
    bestTipEn: 'Vintage 90s Levi’s 501 and wide-leg silhouettes show consistent month-over-month price climbs.',
    sampleItemsSv: 'Vintage 501, Third Cut Digital Denim, Double Knee',
    sampleItemsEn: 'Vintage 501, Third Cut Digital Denim, Double Knee'
  },
  {
    id: 'streetwear',
    nameSv: 'Streetwear & Hoodies',
    nameEn: 'Streetwear & Hoodies',
    color: '#84cc16',
    gradientId: 'gradStreetwear',
    iconName: 'Zap',
    currentAvgPrice: 1420,
    startPrice: 1150,
    changePercent: 23.5,
    changeSek: 270,
    volatilitySv: 'Måttlig',
    volatilityEn: 'Moderate',
    topBrands: ['Stüssy', 'Corteiz', 'Supreme', 'Carhartt WIP', 'Palace'],
    bestTipSv: 'Skolstarts- och hösteffekt ger kraftigt lyft för hoodies och crewnecks.',
    bestTipEn: 'Back-to-school and autumn chill drove heightened buyer demand for premium hoodies.',
    sampleItemsSv: 'Stüssy 8-Ball, Box Logo hoodies, Tracksuits',
    sampleItemsEn: 'Stüssy 8-Ball, Box Logo hoodies, Tracksuits'
  }
];

// Historical monthly points over the last 6 months (May 2026 - Oct 2026)
export const MONTHLY_PRICE_DATA = [
  {
    monthSv: 'Maj 2026',
    monthEn: 'May 2026',
    shortMonthSv: 'Maj',
    shortMonthEn: 'May',
    jackor: 2150,
    stickat: 1350,
    skor: 1620,
    vaskor: 3450,
    denim: 980,
    streetwear: 1150,
    jackorIndex: 100,
    stickatIndex: 100,
    skorIndex: 100,
    vaskorIndex: 100,
    denimIndex: 100,
    streetwearIndex: 100,
    volumeIndex: 21200,
    topMarketplace: 'Tradera',
    noteSv: 'Sommarkläder dominerar, låg säsong för ytterplagg',
    noteEn: 'Summer styles lead, low season for outer layers'
  },
  {
    monthSv: 'Jun 2026',
    monthEn: 'Jun 2026',
    shortMonthSv: 'Jun',
    shortMonthEn: 'Jun',
    jackor: 1980,
    stickat: 1180,
    skor: 1740,
    vaskor: 3600,
    denim: 1020,
    streetwear: 1080,
    jackorIndex: 92.1,
    stickatIndex: 87.4,
    skorIndex: 107.4,
    vaskorIndex: 104.3,
    denimIndex: 104.1,
    streetwearIndex: 93.9,
    volumeIndex: 23400,
    topMarketplace: 'Plick',
    noteSv: 'Sommarskor & festivalmode rusar i volym',
    noteEn: 'Summer kicks & festival fashion surge in sales'
  },
  {
    monthSv: 'Jul 2026',
    monthEn: 'Jul 2026',
    shortMonthSv: 'Jul',
    shortMonthEn: 'Jul',
    jackor: 1820,
    stickat: 1050,
    skor: 1810,
    vaskor: 3750,
    denim: 1040,
    streetwear: 990,
    jackorIndex: 84.7,
    stickatIndex: 77.8,
    skorIndex: 111.7,
    vaskorIndex: 108.7,
    denimIndex: 106.1,
    streetwearIndex: 86.1,
    volumeIndex: 19800,
    topMarketplace: 'Vinted',
    noteSv: 'Årets lägsta prisnotering för vinterjackor och stickat',
    noteEn: 'Yearly price bottom for winter coats and knitwear'
  },
  {
    monthSv: 'Aug 2026',
    monthEn: 'Aug 2026',
    shortMonthSv: 'Aug',
    shortMonthEn: 'Aug',
    jackor: 2340,
    stickat: 1320,
    skor: 1690,
    vaskor: 3820,
    denim: 1080,
    streetwear: 1180,
    jackorIndex: 108.8,
    stickatIndex: 97.8,
    skorIndex: 104.3,
    vaskorIndex: 110.7,
    denimIndex: 110.2,
    streetwearIndex: 102.6,
    volumeIndex: 26100,
    topMarketplace: 'Tradera',
    noteSv: 'Hösttrenden vänder uppåt tidigt för Gorpcore & denim',
    noteEn: 'Pre-fall inflection begins for Gorpcore & denim'
  },
  {
    monthSv: 'Sep 2026',
    monthEn: 'Sep 2026',
    shortMonthSv: 'Sep',
    shortMonthEn: 'Sep',
    jackor: 2750,
    stickat: 1640,
    skor: 1580,
    vaskor: 3790,
    denim: 1160,
    streetwear: 1340,
    jackorIndex: 127.9,
    stickatIndex: 121.5,
    skorIndex: 97.5,
    vaskorIndex: 109.9,
    denimIndex: 118.4,
    streetwearIndex: 116.5,
    volumeIndex: 29500,
    topMarketplace: 'Plick',
    noteSv: 'Skolstart & temperaturfall driver kraftig budgivning',
    noteEn: 'Back to school & temperature drops spark bidding wars'
  },
  {
    monthSv: 'Okt 2026',
    monthEn: 'Oct 2026',
    shortMonthSv: 'Okt',
    shortMonthEn: 'Oct',
    jackor: 3120,
    stickat: 1890,
    skor: 1510,
    vaskor: 3920,
    denim: 1210,
    streetwear: 1420,
    jackorIndex: 145.1,
    stickatIndex: 140.0,
    skorIndex: 93.2,
    vaskorIndex: 113.6,
    denimIndex: 123.5,
    streetwearIndex: 123.5,
    volumeIndex: 32800,
    topMarketplace: 'Tradera',
    noteSv: 'All-time high snittpriser för dunjackor och skaljackor',
    noteEn: 'All-time high average prices for down & shell jackets'
  }
];

type ViewMode = 'price' | 'index' | 'deepdive';
type MarketplaceFilter = 'all' | 'tradera' | 'plick' | 'vinted' | 'sellpy';

export default function CategoryPriceFluctuationsChart() {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('price');
  const [selectedCategory, setSelectedCategory] = useState<string>('jackor');
  const [visibleCategories, setVisibleCategories] = useState<Record<string, boolean>>({
    jackor: true,
    stickat: true,
    skor: true,
    vaskor: true,
    denim: true,
    streetwear: true
  });
  const [marketplaceFilter, setMarketplaceFilter] = useState<MarketplaceFilter>('all');

  // Toggle single category in multi-view
  const toggleCategoryVisibility = (catId: string) => {
    setVisibleCategories(prev => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (prev[catId] && activeCount <= 1) {
        // Don't turn off the last active category
        return prev;
      }
      return { ...prev, [catId]: !prev[catId] };
    });
  };

  // Solo category
  const soloCategory = (catId: string) => {
    setSelectedCategory(catId);
    setVisibleCategories({
      jackor: catId === 'jackor',
      stickat: catId === 'stickat',
      skor: catId === 'skor',
      vaskor: catId === 'vaskor',
      denim: catId === 'denim',
      streetwear: catId === 'streetwear'
    });
  };

  // Select all categories
  const showAllCategories = () => {
    setVisibleCategories({
      jackor: true,
      stickat: true,
      skor: true,
      vaskor: true,
      denim: true,
      streetwear: true
    });
  };

  // Adjust chart data based on marketplace modifier
  const chartData = useMemo(() => {
    // Marketplace premium/discount multipliers
    const multipliers: Record<MarketplaceFilter, number> = {
      all: 1.0,
      tradera: 1.05, // slightly higher vintage/auction bids
      plick: 0.98,   // youth/streetwear competitive pricing
      vinted: 0.92,  // fast international turnover
      sellpy: 0.88   // warehouse consignment pricing
    };
    const mult = multipliers[marketplaceFilter];

    return MONTHLY_PRICE_DATA.map(d => {
      const label = language === 'SV' ? d.shortMonthSv : d.shortMonthEn;
      const fullLabel = language === 'SV' ? d.monthSv : d.monthEn;
      const note = language === 'SV' ? d.noteSv : d.noteEn;

      return {
        ...d,
        label,
        fullLabel,
        note,
        jackor: Math.round(d.jackor * mult),
        stickat: Math.round(d.stickat * mult),
        skor: Math.round(d.skor * mult),
        vaskor: Math.round(d.vaskor * mult),
        denim: Math.round(d.denim * mult),
        streetwear: Math.round(d.streetwear * mult),
        // Deep dive high / low price corridors
        activeLow: Math.round(((d as any)[selectedCategory] * mult) * 0.78),
        activeAvg: Math.round((d as any)[selectedCategory] * mult),
        activeHigh: Math.round(((d as any)[selectedCategory] * mult) * 1.32),
        // Volume for the selected category
        activeVolume: Math.round((d.volumeIndex / 6) * (selectedCategory === 'jackor' ? 1.3 : selectedCategory === 'skor' ? 1.2 : 0.9))
      };
    });
  }, [language, marketplaceFilter, selectedCategory]);

  const activeCategoryMeta = useMemo(() => {
    return CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];
  }, [selectedCategory]);

  // Custom tooltips for Recharts
  const CustomMultiTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const currentItem = chartData.find(d => d.label === label);

    return (
      <div className="bg-[#0b0c10]/95 backdrop-blur-md border border-white/15 rounded-xl p-3.5 shadow-2xl text-xs font-mono min-w-[240px]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
          <span className="font-bold text-white text-sm">{currentItem?.fullLabel}</span>
          <span className="text-[10px] text-[#3cbd82] bg-[#3cbd82]/10 px-2 py-0.5 rounded-full border border-[#3cbd82]/20">
            {marketplaceFilter.toUpperCase()}
          </span>
        </div>

        <div className="space-y-1.5 mb-2.5">
          {payload.map((entry: any) => {
            const cat = CATEGORIES.find(c => c.id === entry.dataKey || `${c.id}Index` === entry.dataKey);
            if (!cat) return null;
            const catName = language === 'SV' ? cat.nameSv : cat.nameEn;
            const isIndexMode = viewMode === 'index';

            return (
              <div key={entry.dataKey} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-zinc-300 truncate max-w-[130px]">{catName}</span>
                </div>
                <span className="font-bold text-white text-right">
                  {isIndexMode ? `${entry.value.toFixed(1)}p` : `${entry.value.toLocaleString()} kr`}
                </span>
              </div>
            );
          })}
        </div>

        {currentItem?.note && (
          <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400 font-sans italic leading-tight">
            💡 {currentItem.note}
          </div>
        )}
      </div>
    );
  };

  const CustomDeepDiveTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const currentItem = chartData.find(d => d.label === label);

    return (
      <div className="bg-[#0b0c10]/95 backdrop-blur-md border border-white/15 rounded-xl p-3.5 shadow-2xl text-xs font-mono min-w-[250px]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
          <span className="font-bold text-white text-sm">{currentItem?.fullLabel}</span>
          <span className="text-[10px] text-zinc-400">
            {language === 'SV' ? activeCategoryMeta.nameSv : activeCategoryMeta.nameEn}
          </span>
        </div>

        <div className="space-y-1 text-zinc-300">
          <div className="flex justify-between items-center text-emerald-400">
            <span>{language === 'SV' ? 'Premium / Skick A:' : 'Peak / Mint condition:'}</span>
            <span className="font-bold">{currentItem?.activeHigh.toLocaleString()} kr</span>
          </div>
          <div className="flex justify-between items-center text-white font-bold bg-white/5 px-2 py-1 rounded">
            <span>{language === 'SV' ? 'Genomsnittspris:' : 'Average Price:'}</span>
            <span className="text-[#3cbd82]">{currentItem?.activeAvg.toLocaleString()} kr</span>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span>{language === 'SV' ? 'Lägsta fyndnivå:' : 'Bargain / Fair condition:'}</span>
            <span className="font-bold">{currentItem?.activeLow.toLocaleString()} kr</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-white/10 text-zinc-400 text-[11px]">
            <span>{language === 'SV' ? 'Estimerad volym:' : 'Estimated listings:'}</span>
            <span>~{currentItem?.activeVolume.toLocaleString()} st</span>
          </div>
        </div>

        {currentItem?.note && (
          <div className="pt-2 mt-2 border-t border-white/5 text-[11px] text-zinc-400 font-sans italic leading-tight">
            💡 {currentItem.note}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16 relative z-10">
      {/* Container Card */}
      <div className="bg-[#0a0a0d] border border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3cbd82]/5 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-purple-500/5 blur-3xl pointer-events-none rounded-full" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono tracking-widest uppercase bg-[#3cbd82]/15 text-[#3cbd82] border border-[#3cbd82]/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[#3cbd82]" />
                {language === 'SV' ? '6-MÅNADERS PRISFLUKTUATIONER' : '6-MONTH PRICE FLUCTUATION INDEX'}
              </span>
              <span className="text-zinc-500 text-xs font-mono">
                {language === 'SV' ? 'Maj 2026 – Okt 2026' : 'May 2026 – Oct 2026'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              {language === 'SV' ? 'Prisutveckling per Klädkategori' : 'Category Price Fluctuations & Volatility'}
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-2xl font-light">
              {language === 'SV'
                ? 'Visualiserade andrahandspriser baserat på 140 000+ avslutade transaktioner och annonser över Tradera, Plick, Vinted, Sellpy och Blocket.'
                : 'Real transaction index tracking historical price movements across Nordic marketplaces, identifying seasonal spikes and optimal buy/sell windows.'}
            </p>
          </div>

          {/* Controls: View Mode & Marketplace selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-1 flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('price')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  viewMode === 'price'
                    ? 'bg-[#3cbd82] text-neutral-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {language === 'SV' ? 'Snittpris (kr)' : 'Avg Price (SEK)'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('index')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  viewMode === 'index'
                    ? 'bg-[#3cbd82] text-neutral-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {language === 'SV' ? 'Index (Bas 100)' : 'Index (% Change)'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('deepdive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  viewMode === 'deepdive'
                    ? 'bg-[#3cbd82] text-neutral-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {language === 'SV' ? 'Djupdykning' : 'Deep Dive'}
              </button>
            </div>

            {/* Marketplace Filter Pill Selector */}
            <div className="relative">
              <select
                aria-label={language === 'SV' ? 'Välj marknadsplats' : 'Select marketplace'}
                value={marketplaceFilter}
                onChange={e => setMarketplaceFilter(e.target.value as MarketplaceFilter)}
                className="bg-black/60 border border-white/10 text-zinc-300 text-xs font-mono rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-[#3cbd82] transition-colors appearance-none cursor-pointer"
              >
                <option value="all">{language === 'SV' ? 'Alla marknadsplatser' : 'All Marketplaces'}</option>
                <option value="tradera">Tradera</option>
                <option value="plick">Plick</option>
                <option value="vinted">Vinted</option>
                <option value="sellpy">Sellpy</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                <Filter className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Selector Chips & Quick Stats */}
        <div className="py-4 flex items-center justify-between gap-3 flex-wrap border-b border-white/5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mr-1">
              {language === 'SV' ? 'Kategorier:' : 'Categories:'}
            </span>
            {CATEGORIES.map(cat => {
              const isVisible = visibleCategories[cat.id];
              const isSelected = selectedCategory === cat.id;
              const isPositive = cat.changePercent >= 0;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (viewMode === 'deepdive') {
                      setSelectedCategory(cat.id);
                    } else {
                      toggleCategoryVisibility(cat.id);
                    }
                  }}
                  onDoubleClick={() => soloCategory(cat.id)}
                  title={language === 'SV' ? 'Klicka för att tända/släcka. Dubbelklicka för att isolera.' : 'Click to toggle. Double-click to solo.'}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 border transition-all cursor-pointer ${
                    (viewMode === 'deepdive' ? isSelected : isVisible)
                      ? 'bg-zinc-900 border-white/20 text-white shadow-sm'
                      : 'bg-black/30 border-white/5 text-zinc-500 hover:text-zinc-300 opacity-60'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{language === 'SV' ? cat.nameSv : cat.nameEn}</span>
                  <span
                    className={`text-[10px] font-bold ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPositive ? `+${cat.changePercent}%` : `${cat.changePercent}%`}
                  </span>
                </button>
              );
            })}

            {viewMode !== 'deepdive' && (
              <button
                type="button"
                onClick={showAllCategories}
                className="text-[11px] font-mono text-zinc-400 hover:text-[#3cbd82] underline underline-offset-4 px-2 py-1 transition-colors cursor-pointer"
              >
                {language === 'SV' ? 'Visa alla' : 'Show all'}
              </button>
            )}
          </div>

          <div className="text-[11px] font-mono text-zinc-400 hidden sm:flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#3cbd82]" />
            <span>
              {language === 'SV'
                ? 'Dubbelklicka på en kategori för att isolera den'
                : 'Double-click any category badge to isolate it'}
            </span>
          </div>
        </div>

        {/* MAIN RECHARTS VISUALIZATION CONTAINER */}
        <div className="pt-6 pb-2">
          <div className="w-full h-[380px] md:h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'price' ? (
                // 1. AVERAGE PRICE (LINE / MONOTONE)
                <LineChart data={chartData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#71717a"
                    fontSize={12}
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis
                    stroke="#71717a"
                    fontSize={11}
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickFormatter={(val: number) => `${(val / 1000).toFixed(1)}k kr`}
                    domain={['dataMin - 300', 'dataMax + 400']}
                  />
                  <Tooltip content={<CustomMultiTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value: string) => {
                      const cat = CATEGORIES.find(c => c.id === value);
                      return (
                        <span className="text-xs text-zinc-300 font-mono mr-3">
                          {cat ? (language === 'SV' ? cat.nameSv : cat.nameEn) : value}
                        </span>
                      );
                    }}
                  />
                  {CATEGORIES.map(cat => {
                    if (!visibleCategories[cat.id]) return null;
                    return (
                      <Line
                        key={cat.id}
                        type="monotone"
                        dataKey={cat.id}
                        name={cat.id}
                        stroke={cat.color}
                        strokeWidth={selectedCategory === cat.id ? 3.5 : 2.5}
                        dot={{ r: 4, stroke: cat.color, strokeWidth: 2, fill: '#0a0a0d' }}
                        activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2, fill: cat.color }}
                        animationDuration={800}
                      />
                    );
                  })}
                </LineChart>
              ) : viewMode === 'index' ? (
                // 2. RELATIVE INDEX % (BASE 100 IN MAY)
                <LineChart data={chartData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" vertical={false} />
                  <ReferenceLine
                    y={100}
                    stroke="rgba(255,255,255,0.25)"
                    strokeDasharray="4 4"
                    label={{
                      value: language === 'SV' ? 'Basnivå Maj (100)' : 'May Baseline (100)',
                      fill: '#a1a1aa',
                      fontSize: 10,
                      position: 'insideTopLeft'
                    }}
                  />
                  <XAxis
                    dataKey="label"
                    stroke="#71717a"
                    fontSize={12}
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis
                    stroke="#71717a"
                    fontSize={11}
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickFormatter={(val: number) => `${val}p`}
                    domain={[70, 155]}
                  />
                  <Tooltip content={<CustomMultiTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value: string) => {
                      const id = value.replace('Index', '');
                      const cat = CATEGORIES.find(c => c.id === id);
                      return (
                        <span className="text-xs text-zinc-300 font-mono mr-3">
                          {cat ? (language === 'SV' ? cat.nameSv : cat.nameEn) : value}
                        </span>
                      );
                    }}
                  />
                  {CATEGORIES.map(cat => {
                    if (!visibleCategories[cat.id]) return null;
                    return (
                      <Line
                        key={cat.id}
                        type="monotone"
                        dataKey={`${cat.id}Index`}
                        name={`${cat.id}Index`}
                        stroke={cat.color}
                        strokeWidth={selectedCategory === cat.id ? 3.5 : 2.5}
                        dot={{ r: 4, stroke: cat.color, strokeWidth: 2, fill: '#0a0a0d' }}
                        activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2, fill: cat.color }}
                        animationDuration={800}
                      />
                    );
                  })}
                </LineChart>
              ) : (
                // 3. DEEP DIVE (AREA + PRICE CORRIDOR)
                <AreaChart data={chartData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeCategoryMeta.color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={activeCategoryMeta.color} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#71717a"
                    fontSize={12}
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis
                    stroke="#71717a"
                    fontSize={11}
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickFormatter={(val: number) => `${val.toLocaleString()} kr`}
                    domain={['dataMin - 200', 'dataMax + 400']}
                  />
                  <Tooltip content={<CustomDeepDiveTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="activeHigh"
                    name={language === 'SV' ? 'Toppskick' : 'Mint condition'}
                    stroke="rgba(255,255,255,0.2)"
                    strokeDasharray="2 2"
                    fill="transparent"
                  />
                  <Area
                    type="monotone"
                    dataKey="activeAvg"
                    name={language === 'SV' ? 'Genomsnitt' : 'Average'}
                    stroke={activeCategoryMeta.color}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#activeGrad)"
                    dot={{ r: 5, stroke: activeCategoryMeta.color, strokeWidth: 2, fill: '#0a0a0d' }}
                    activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 2, fill: activeCategoryMeta.color }}
                  />
                  <Area
                    type="monotone"
                    dataKey="activeLow"
                    name={language === 'SV' ? 'Fyndpris' : 'Bargain price'}
                    stroke="rgba(255,255,255,0.15)"
                    strokeDasharray="2 2"
                    fill="transparent"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6-Month Macro Intelligence Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 mt-4 border-t border-white/10">
          {/* Card 1: Största vinnare */}
          <div className="bg-zinc-950/70 border border-emerald-500/20 rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                {language === 'SV' ? '🔥 Största Prislyft' : '🔥 Top Gainer (6M)'}
              </span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white mb-1">
              {language === 'SV' ? 'Jackor & Ytterkläder' : 'Jackets & Outerwear'}
            </div>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-2xl font-black text-emerald-400">+45.1%</span>
              <span className="text-xs text-zinc-400">(+970 kr snitt)</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 font-light">
              {language === 'SV'
                ? 'Drivet av Gorpcore-efterfrågan på Arc\'teryx & Patagonia inför kylan.'
                : 'Driven by Gorpcore craze for Arc\'teryx & Patagonia outerwear entering Q4.'}
            </p>
          </div>

          {/* Card 2: Köpläge / Re-entry */}
          <div className="bg-zinc-950/70 border border-amber-500/20 rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                {language === 'SV' ? '👟 Bästa Köpläge' : '👟 Best Buyer Dip'}
              </span>
              <ArrowDownRight className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-white mb-1">
              {language === 'SV' ? 'Skor & Sneakers' : 'Footwear & Sneakers'}
            </div>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-2xl font-black text-amber-400">-6.8%</span>
              <span className="text-xs text-zinc-400">(1 510 kr snitt)</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 font-light">
              {language === 'SV'
                ? 'Sneakermarknaden kyls av efter sommaren. Bra tillfälle att fynda Samba & Salomon.'
                : 'Sneaker hype softened after summer. Prime timing to snap up Samba & Salomon models.'}
            </p>
          </div>

          {/* Card 3: Högsta Värdebevaring */}
          <div className="bg-zinc-950/70 border border-rose-500/20 rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                {language === 'SV' ? '💎 Högst Värdebevaring' : '💎 Top Value Retention'}
              </span>
              <Sparkles className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-lg font-bold text-white mb-1">
              {language === 'SV' ? 'Väskor & Lyxaccessoarer' : 'Bags & Luxury'}
            </div>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-2xl font-black text-white">3 920 kr</span>
              <span className="text-xs text-emerald-400 font-bold">+13.6%</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 font-light">
              {language === 'SV'
                ? 'Minst volatila tillgången. Acne Musubi och Prada Nylon behåller 90%+ av inköpsvärdet.'
                : 'Most resilient luxury asset. Acne Musubi and Prada Nylon retain 90%+ of cost.'}
            </p>
          </div>

          {/* Card 4: Omsättningsvolym */}
          <div className="bg-zinc-950/70 border border-white/10 rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-[#3cbd82] font-bold uppercase tracking-wider">
                {language === 'SV' ? '📊 Repeak Databas' : '📊 Repeak Index Data'}
              </span>
              <Activity className="w-4 h-4 text-[#3cbd82]" />
            </div>
            <div className="text-lg font-bold text-white mb-1">
              {language === 'SV' ? 'Analyserade Annonser' : 'Tracked Listings'}
            </div>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-2xl font-black text-white">152 800+</span>
              <span className="text-xs text-[#3cbd82]">Live data</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 font-light">
              {language === 'SV'
                ? 'Automatisk prisnormalisering över 5 ledande nordiska marknadsplatser.'
                : 'Automated price standardization across 5 leading Nordic secondhand venues.'}
            </p>
          </div>
        </div>

        {/* Deep Dive Category Analysis Box (changes dynamically when clicked) */}
        <div className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-neutral-950 shrink-0 shadow-lg"
                style={{ backgroundColor: activeCategoryMeta.color }}
              >
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-bold text-white">
                    {language === 'SV' ? activeCategoryMeta.nameSv : activeCategoryMeta.nameEn}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                    {language === 'SV' ? activeCategoryMeta.volatilitySv : activeCategoryMeta.volatilityEn}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  {language === 'SV' ? 'Populära modeller:' : 'Trending items:'}{' '}
                  <span className="text-zinc-200">
                    {language === 'SV' ? activeCategoryMeta.sampleItemsSv : activeCategoryMeta.sampleItemsEn}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-zinc-500">
                {language === 'SV' ? 'Viktigaste varumärken:' : 'Driver brands:'}
              </span>
              {activeCategoryMeta.topBrands.map(b => (
                <span
                  key={b}
                  className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-zinc-300"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-300 font-sans">
              <span className="text-emerald-400 font-bold font-mono uppercase tracking-wider text-[11px]">
                {language === 'SV' ? '💡 AI Rekommendation:' : '💡 AI Market Advice:'}
              </span>
              <span>
                {language === 'SV' ? activeCategoryMeta.bestTipSv : activeCategoryMeta.bestTipEn}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setViewMode('deepdive');
              }}
              className="text-[#3cbd82] hover:text-[#52e4a1] font-mono text-xs flex items-center gap-1 font-bold whitespace-nowrap cursor-pointer transition-colors"
            >
              {language === 'SV' ? 'Öppna spridningsanalys' : 'View price band'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
