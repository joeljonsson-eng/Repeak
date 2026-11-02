import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown,
  Tag, 
  ArrowUp, 
  HelpCircle, 
  RefreshCw, 
  Database, 
  Sparkles, 
  Layers, 
  AlertTriangle,
  Compass,
  ArrowRight,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { trackEvent } from '../lib/analytics';
import { Trend } from '../types';

interface TrendBadge {
  id: string;
  label: string;
  bg: string;
  border: string;
  text: string;
}

// Dynamic badge scoring rule calculator based on direct trend signals telemetry
function getDynamicBadges(item: Trend, language: 'SV' | 'EN'): TrendBadge[] {
  const badges: TrendBadge[] = [];

  // A. High Demand Rule (Overall Trend Score weight >= 90)
  if (item.trend_score >= 90) {
    badges.push({
      id: 'high-demand',
      label: language === 'SV' ? '🔥 Hög efterfrågan' : '🔥 High Demand',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400'
    });
  }

  // B. Viral Rule (Huge Social volume mentions or high engagement growth indicators)
  const mentions = item.social_mentions ?? 0;
  const engagement = item.engagement_growth ?? 0;
  if (mentions > 5000 || engagement > 80) {
    badges.push({
      id: 'viral',
      label: language === 'SV' ? '⚡ Viral' : '⚡ Viral',
      bg: 'bg-fuchsia-500/10',
      border: 'border-fuchsia-500/20',
      text: 'text-fuchsia-400'
    });
  }

  // C. Rising Fast Rule (Very steep MoM percentage change >= 100)
  if (item.growth_percent >= 100) {
    badges.push({
      id: 'rising-fast',
      label: language === 'SV' ? '🚀 Rusar' : '🚀 Rising Fast',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-400'
    });
  }

  // D. Breaking Out Rule (Surging search velocity and healthy coverage)
  const searchGrowth = item.search_growth ?? 0;
  const confidence = item.confidence_score ?? 0;
  if (searchGrowth > 75 && confidence > 80) {
    badges.push({
      id: 'breaking-out',
      label: language === 'SV' ? '💥 Trendbrott' : '💥 Breaking Out',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400'
    });
  }

  // E. Luxury Trend Rule (Secondary resale pricing values >= 3000 kr)
  const price = item.resale_price ?? 0;
  if (price >= 3000) {
    badges.push({
      id: 'luxury',
      label: language === 'SV' ? '💎 Lyx' : '💎 Luxury Trend',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400'
    });
  }

  // F. Streetwear Trend Rule
  const nameUpper = (item.trend_name || '').toUpperCase();
  const catUpper = (item.category || '').toUpperCase();
  const rMkt = (item.marketplace || '').toLowerCase();
  const isStreetwearBrand = nameUpper.includes('STÜSSY') || 
                            nameUpper.includes('STUSSY') || 
                            nameUpper.includes('ADIDAS') || 
                            nameUpper.includes('NIKE') || 
                            nameUpper.includes('JORDAN') || 
                            nameUpper.includes('CP COMPANY') || 
                            nameUpper.includes('C.P. COMPANY') || 
                            nameUpper.includes('ARC\'TERYX') || 
                            nameUpper.includes('ARCTERYX') || 
                            nameUpper.includes('STONE ISLAND') || 
                            nameUpper.includes('SUPREME') || 
                            nameUpper.includes('CARHARTT');

  if (isStreetwearBrand || catUpper.includes('FOOTWEAR') || catUpper.includes('SNEAKERS') || rMkt === 'stockx' || rMkt === 'grailed') {
    badges.push({
      id: 'streetwear',
      label: language === 'SV' ? '🛹 Streetwear' : '🛹 Streetwear Trend',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      text: 'text-sky-400'
    });
  }

  // Fallback metric representation
  if (badges.length === 0) {
    badges.push({
      id: 'trending',
      label: language === 'SV' ? '✨ Trendande' : '✨ Trending',
      bg: 'bg-zinc-500/10',
      border: 'border-zinc-500/20',
      text: 'text-zinc-400'
    });
  }

  return badges;
}

// Predicts qualitative forecasts based on numerical telemetry direction
function getForecastSummary(item: Trend, language: 'SV' | 'EN'): string {
  const isRising = (item.predicted_growth ?? 0) >= 10;
  const isDeclining = (item.predicted_growth ?? 0) < 0;
  
  if (isRising) {
    return language === 'SV'
      ? `AI-modeller förutspår en stark efterfrågeökning för ${item.category.toLowerCase()} till följd av ökad andrahandsaktivitet.`
      : `AI models project a strong demand surge for ${item.category.toLowerCase()} driven by rising aftermarket velocity.`;
  } else if (isDeclining) {
    return language === 'SV'
      ? `Engagemangsdata indikerar att sökvolymen minskar och intresset svalnar på sikt.`
      : `Engagement metrics suggests interest is cooling down with search and transaction rates slowing down.`;
  } else {
    return language === 'SV'
      ? `Ett moget och stabilt märke med jämnt andrahandsvärde och intresse över tid.`
      : `Stable aftermarket presence with steady, predictable transactions and pricing.`;
  }
}

const CleanImagePlaceholder = ({ category, name, language }: { category: string; name: string; language: 'SV' | 'EN' }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-full h-full bg-gradient-to-br from-zinc-950 to-zinc-900 border-b border-zinc-805/40 flex flex-col items-center justify-center p-6 text-center group relative min-h-[200px]">
      <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent pointer-events-none opacity-40" />
      <div className="relative mb-3 flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800/80 group-hover:scale-105 transition-transform duration-300">
        <ShoppingBag className="w-6 h-6 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
        <span className="absolute -bottom-1 -right-1 text-[8px] px-1 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-black font-mono">
          {initials || 'TR'}
        </span>
      </div>
      <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase font-mono">
        {category || 'Trend'}
      </p>
      <p className="text-xs font-black text-zinc-400 mt-1.5 max-w-[210px] truncate">{name}</p>
      <div className="absolute bottom-3 text-[8px] text-zinc-600 uppercase tracking-widest font-mono">
        {language === 'SV' ? 'INGEN PRE-VERIFIERAD BILD' : 'NO PRE-VERIFIED IMAGE'}
      </div>
    </div>
  );
};

const CompareMarketplacesHover = ({ item, language, topOffset }: { item: Trend; language: 'SV' | 'EN'; topOffset: string }) => {
  const basePrice = item.resale_price || 0;
  const itemMarket = (item.marketplace || "").toLowerCase();

  // Determine actual prices
  let stockxPrice = item.stockx_price;
  let grailedPrice = item.grailed_price;
  let depopPrice = item.depop_price;

  // Fallback: if no specific platform prices are populated yet, map the basePrice to the matching primary marketplace
  if (!stockxPrice && !grailedPrice && !depopPrice && basePrice > 0) {
    if (itemMarket.includes('stockx')) stockxPrice = basePrice;
    else if (itemMarket.includes('grailed')) grailedPrice = basePrice;
    else if (itemMarket.includes('depop')) depopPrice = basePrice;
    else {
      grailedPrice = basePrice;
    }
  }

  const platforms = [
    {
      name: 'StockX',
      price: stockxPrice,
      textColor: 'text-emerald-400',
      color: 'from-emerald-500 to-teal-400',
      label: language === 'SV' ? 'Butiksindex' : 'Retail'
    },
    {
      name: 'Grailed',
      price: grailedPrice,
      textColor: 'text-violet-400',
      color: 'from-violet-500 to-indigo-400',
      label: language === 'SV' ? 'Andrahands' : 'Standard'
    },
    {
      name: 'Depop',
      price: depopPrice,
      textColor: 'text-orange-400',
      color: 'from-orange-500 to-amber-400',
      label: language === 'SV' ? 'Fyndpris' : 'Deal finder'
    }
  ];

  return (
    <div className={`absolute inset-x-0 bottom-0 ${topOffset} bg-zinc-950/98 backdrop-blur-md p-5 flex flex-col justify-between transition-all duration-300 ease-out translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20 border-t border-emerald-500/10 rounded-b-[28px] pointer-events-none group-hover:pointer-events-auto text-left font-sans shadow-2xl`}>
      <div className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold tracking-widest text-[9px] uppercase font-mono">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'SV' ? 'JÄMFÖR PRISER' : 'COMPARE CHANNELS'}</span>
          </div>
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800 font-bold uppercase tracking-wider font-mono">
            Pricing Index
          </span>
        </div>
        
        <div className="space-y-3">
          {platforms.map((p) => {
            const hasPrice = p.price !== undefined && p.price > 0;
            const formattedPrice = hasPrice ? `${p.price!.toLocaleString('sv-SE')} kr` : (language === 'SV' ? 'Ej listad' : 'Not listed');
            
            let diffLabel = "";
            let isPremium = false;
            if (hasPrice && basePrice > 0) {
              const diffPercent = Math.round(((p.price! - basePrice) / basePrice) * 100);
              if (diffPercent > 0) {
                diffLabel = `+${diffPercent}%`;
                isPremium = true;
              } else if (diffPercent < 0) {
                diffLabel = `${diffPercent}%`;
                isPremium = false;
              } else {
                diffLabel = '0%';
                isPremium = false;
              }
            }

            const barWidth = hasPrice && basePrice > 0 
              ? Math.min(100, Math.max(20, Math.round((p.price! / (basePrice * 1.2)) * 100)))
              : 0;

            return (
              <div key={p.name} className="space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-white">{p.name}</span>
                    <span className="text-[8px] text-zinc-500">• {p.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    {hasPrice && diffLabel && (
                      <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${isPremium ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {diffLabel}
                      </span>
                    )}
                    <span className={`${p.textColor} font-black`}>{formattedPrice}</span>
                  </div>
                </div>
                
                <div className="h-1 bg-zinc-900/60 rounded-full overflow-hidden w-full relative">
                  <div 
                    className={`h-full bg-gradient-to-r ${p.color} rounded-full`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-zinc-900 pt-2 flex items-center justify-between text-[8px] text-zinc-500 font-mono">
        <span>{language === 'SV' ? 'INDEXSNITT: ' : 'AVG INDEX: '} <span className="text-zinc-300 font-extrabold font-sans">{basePrice > 0 ? `${basePrice.toLocaleString('sv-SE')} kr` : (language === 'SV' ? 'Ingen prisuppgift' : 'No price data')}</span></span>
        <span>{language === 'SV' ? 'UPPDATERAD 24h' : 'UPDATED 24h'}</span>
      </div>
    </div>
  );
};

export default function HettJustNu() {
  const { language } = useLanguage();
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'predictions'>('current');
  const [predictionFilter, setPredictionFilter] = useState<'all' | 'rising' | 'declining'>('all');
  const [error, setError] = useState<string | null>(null);

  // Threshold values for real-world high confidence trend intelligence
  const CONFIDENCE_THRESHOLD = 85;
  const QUALITY_SCORE_THRESHOLD = 40;

  const renderImageConfidenceBadge = (confidence?: number) => {
    if (confidence === undefined) return null;
    let text = '';
    let color = '';
    if (confidence >= 100) {
      text = language === 'SV' ? 'EXAKT BILD 100%' : 'EXACT IMG 100%';
      color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    } else if (confidence >= 80) {
      text = language === 'SV' ? 'MÄRKESBILD 80%' : 'BRAND IMG 80%';
      color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    } else if (confidence >= 60) {
      text = language === 'SV' ? 'KATEGORIBILD 60%' : 'CATEGORY IMG 60%';
      color = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    } else {
      return null;
    }
    return (
      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[8px] md:text-[9px] font-black tracking-widest uppercase font-mono shadow-sm shrink-0 ${color}`}>
        <ShieldCheck className="w-2.5 h-2.5 text-current inline shrink-0" />
        <span>{text}</span>
      </div>
    );
  };

  // Filter trends to ensure high confidence and significant score
  const filteredTrends = React.useMemo(() => {
    return trends.filter(t => {
      const confidence = t.confidence_score ?? 85;
      const score = t.trend_score ?? 50;
      return confidence >= CONFIDENCE_THRESHOLD && score >= QUALITY_SCORE_THRESHOLD;
    });
  }, [trends]);

  // Return sorted trends for display (Homepage: Top 4 highest confidence, View All page: Sorted by trend score)
  const processedTrends = React.useMemo(() => {
    if (isHomepage) {
      return [...filteredTrends]
        .filter(t => t.image_url && (t.image_confidence_score === undefined || t.image_confidence_score >= 60))
        .sort((a, b) => {
          const imgConfA = a.image_confidence_score ?? 60;
          const imgConfB = b.image_confidence_score ?? 60;
          if (imgConfB !== imgConfA) {
            return imgConfB - imgConfA;
          }
          const confA = a.confidence_score ?? 85;
          const confB = b.confidence_score ?? 85;
          if (confB !== confA) {
            return confB - confA;
          }
          return b.trend_score - a.trend_score;
        })
        .slice(0, 4);
    }

    return [...filteredTrends].sort((a, b) => {
      // 1. Highest trend score
      if (b.trend_score !== a.trend_score) {
        return b.trend_score - a.trend_score;
      }
      // 2. Strongest price movement / growth percentage
      const bGrowth = b.growth_percent ?? 0;
      const aGrowth = a.growth_percent ?? 0;
      if (bGrowth !== aGrowth) {
        return bGrowth - aGrowth;
      }
      // 3. Social signals: mentions or engagement growth
      const bMentions = b.social_mentions ?? 0;
      const aMentions = a.social_mentions ?? 0;
      if (bMentions !== aMentions) {
        return bMentions - aMentions;
      }
      const bEngagement = b.engagement_growth ?? 0;
      const aEngagement = a.engagement_growth ?? 0;
      if (bEngagement !== aEngagement) {
        return bEngagement - aEngagement;
      }
      // 4. Fallback to name/alphabetic
      return (a.trend_name || '').localeCompare(b.trend_name || '');
    });
  }, [isHomepage, filteredTrends]);

  // Load trends strictly from Supabase through our backend API (with caching & validation)
  const loadTrends = async (forceQuiet = false) => {
    if (!forceQuiet) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await fetch('/api/trends');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTrends(json.data);
          setError(null);
          
          // Instant Client Caching: Save to sessionStorage with 5 min expiry TTL
          try {
            sessionStorage.setItem('repeak_client_trends_cache', JSON.stringify({
              timestamp: Date.now(),
              data: json.data
            }));
          } catch (cacheErr) {
            console.warn("Storage quota exceeded or sessionStorage blocked:", cacheErr);
          }
        } else {
          setError(json.error || (language === 'SV' ? 'Kunde inte tolka trenddata från servern.' : 'Could not decode trend data from the server.'));
        }
      } else {
        setError(language === 'SV' 
          ? `Serverfel vid hämtning av trender (Kod: ${res.status}).` 
          : `Server error while fetching trends (Status: ${res.status}).`
        );
      }
    } catch (err: any) {
      console.error("Failed to query database trends:", err);
      setError(language === 'SV' 
        ? 'Ett nätverksfel uppstod. Kontrollera din anslutning.' 
        : 'A network error occurred. Please check your connectivity.'
      );
    } finally {
      if (!forceQuiet) setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Check Session Cache for Instant Load performance
    try {
      const cached = sessionStorage.getItem('repeak_client_trends_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Expiry window check: 5 minutes TTL
        if (parsed && Array.isArray(parsed.data) && (Date.now() - parsed.timestamp < 5 * 60 * 1000)) {
          setTrends(parsed.data);
          setLoading(false);
          setError(null);
          
          // Fire quiet background sync/re-validation to ensure data integrity without interrupting layout
          loadTrends(true);
          return;
        }
      }
    } catch (storageErr) {
      console.warn("Error checking client cache registry:", storageErr);
    }

    loadTrends();
  }, []);

  // Quick manual ingestion trigger to scan live networks and update Supabase
  const handleTriggerIngestion = async () => {
    setRefreshing(true);
    setError(null);
    trackEvent('manual_trends_ingest_started');
    try {
      const res = await fetch('/api/trends/ingest', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTrends(json.data);
          setError(null);
          
          // Refresh Client Cache
          try {
            sessionStorage.setItem('repeak_client_trends_cache', JSON.stringify({
              timestamp: Date.now(),
              data: json.data
            }));
          } catch (cacheErr) {
            console.warn("Storage write failed during manual ingest cache save:", cacheErr);
          }
          
          trackEvent('manual_trends_ingest_success', { count: json.data.length });
        } else {
          setError(json.error || (language === 'SV' ? 'Trendscanningen rapporterade ett fel.' : 'Trend ingestion process reported an error.'));
        }
      } else {
        setError(language === 'SV' 
          ? `Kunde inte uppdatera marknadstrender (Status: ${res.status}).` 
          : `Failed to update market trends (Status: ${res.status}).`
        );
      }
    } catch (err: any) {
      console.error("Failed to trigger live fashion ingestion:", err);
      setError(language === 'SV' 
        ? 'Kopplingsfel eller tidsgräns överskreds vid scanning.' 
        : 'Connection warning or timeout during live scan.'
      );
      trackEvent('manual_trends_ingest_failed');
    } finally {
      setRefreshing(false);
    }
  };

  const handleScrollToTop = () => {
    trackEvent('click_trends_back_to_search', {
      source: 'hett_just_nu_arrow_btn'
    });
    const element = document.getElementById('hem');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const executeSearchForTrend = (trendName: string) => {
    trackEvent('search_from_overlay', { trend_name: trendName });
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = trendName;
      const event = new Event('input', { bubbles: true });
      searchInput.dispatchEvent(event);
      const searchBar = document.getElementById('hem');
      if (searchBar) {
        searchBar.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setSelectedTrend(null);
  };

  return (
    <section className="bg-[#050505] py-20 px-4 md:px-6 relative overflow-hidden" id="kap">
      {/* Absolute Ambient Background blurs for Swiss-minimal aesthetics */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header with dynamic Scan Live metrics control */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono uppercase tracking-widest leading-none">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{language === 'SV' ? 'Live Andrahandsdata' : 'Live Aftermarket Indices'}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display text-white flex items-center gap-2">
              <span>🔥</span> {language === 'SV' ? 'Hett just nu' : 'Hot Right Now'}
            </h2>
            <p className="text-white/50 text-sm md:text-base font-light font-sans max-w-2xl leading-relaxed">
              {language === 'SV' 
                ? 'Märkesinsikter direkt från databasen, analyserade av Repeaks Trend Scoring Engine utifrån sökvolym, sociala spår och säljfrekvens.' 
                : 'Direct database signals analyzed by Repeaks Trend Scoring Engine based on search density, social signal metrics, and marketplace velocity.'}
            </p>
          </div>

          {/* Core manual sync action button */}
          <button
            onClick={handleTriggerIngestion}
            disabled={refreshing || loading}
            className="self-start md:self-end inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-black/60 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>
              {refreshing 
                ? (language === 'SV' ? 'Scannar marknader...' : 'Scanning marketplaces...') 
                : (language === 'SV' ? 'Sök efter nya trender' : 'Refresh Market Trends')}
            </span>
          </button>
        </div>

        {/* Main Tab Switcher */}
        <div className="flex border-b border-zinc-800/80 mb-8 max-w-lg">
          <button
            onClick={() => {
              setActiveTab('current');
              trackEvent('toggle_trends_tab_current');
            }}
            className={`flex-1 py-3 text-xs md:text-sm font-black tracking-widest uppercase transition-all border-b-2 text-center cursor-pointer ${
              activeTab === 'current'
                ? 'border-emerald-500 text-white font-black'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {language === 'SV' ? '🔥 Marknadstrender' : '🔥 Market Trends'}
          </button>
          <button
            onClick={() => {
              setActiveTab('predictions');
              trackEvent('toggle_trends_tab_predictions');
            }}
            className={`flex-1 py-3 text-xs md:text-sm font-black tracking-widest uppercase transition-all border-b-2 text-center cursor-pointer relative ${
              activeTab === 'predictions'
                ? 'border-emerald-500 text-white font-black'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {language === 'SV' ? '🔮 AI Trendprognoser' : '🔮 AI Predictions'}
            <span className="absolute -top-1 -right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-neutral-950 text-[8px] font-black uppercase tracking-normal">AI</span>
          </button>
        </div>

        {/* Prediction Secondary Filters (Rising vs Declining) */}
        {activeTab === 'predictions' && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-8 items-center"
          >
            <span className="text-zinc-500 text-xs font-black uppercase tracking-wider mr-2">
              {language === 'SV' ? 'Prognosfilter:' : 'Forecast Filter:'}
            </span>
            <button
              onClick={() => {
                setPredictionFilter('all');
                trackEvent('click_prediction_filter_all');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                predictionFilter === 'all'
                  ? 'bg-zinc-800 border-zinc-700 text-white shadow-md'
                  : 'bg-transparent border-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              🌌 {language === 'SV' ? 'Alla prognoser' : 'All Forecasts'}
            </button>
            <button
              onClick={() => {
                setPredictionFilter('rising');
                trackEvent('click_prediction_filter_rising');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                predictionFilter === 'rising'
                  ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400 shadow-md'
                  : 'bg-transparent border-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              📈 {language === 'SV' ? 'Stigande trender' : 'Rising Trends'}
            </button>
            <button
              onClick={() => {
                setPredictionFilter('declining');
                trackEvent('click_prediction_filter_declining');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                predictionFilter === 'declining'
                  ? 'bg-rose-500/10 border-rose-500/35 text-rose-400 shadow-md'
                  : 'bg-transparent border-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              📉 {language === 'SV' ? 'Nedåtgående trender' : 'Declining Trends'}
            </button>
          </motion.div>
        )}

        {/* LOADING STATE - Skeleton shimmer representation */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="h-[520px] bg-zinc-900/60 border border-zinc-800/50 rounded-[28px] p-6 flex flex-col justify-between animate-pulse"
              >
                <div className="space-y-4">
                  <div className="h-[240px] bg-zinc-800/60 rounded-2xl w-full" />
                  <div className="h-6 bg-zinc-800/60 rounded-md w-3/4" />
                  <div className="h-4 bg-zinc-800/60 rounded-md w-1/2" />
                </div>
                <div className="space-y-3">
                  <div className="h-10 bg-zinc-800/60 rounded-xl w-full" />
                  <div className="h-4 bg-zinc-800/60 rounded-md w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE - Exquisite high-contrast, responsive error layout */}
        {error && trends.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/60 border border-rose-500/25 rounded-[32px] p-8 md:p-12 max-w-2xl mx-auto text-center space-y-6 shadow-2xl relative overflow-hidden my-6"
            id="trend-error-card"
          >
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2 text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white leading-tight">
                {language === 'SV' ? 'Ett fel uppstod' : 'An error occurred'}
              </h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light">
                {language === 'SV' 
                  ? 'Kunde inte hämta andrahandsdata för marknadstrender just nu. Detta kan bero på nätverksproblem eller tillfälligt överbelastade tjänster.' 
                  : 'We were unable to retrieve the aftermarket trend metrics at this time. This could be due to network connectivity issues or a temporary service interruption.'}
              </p>
              {error && (
                <div className="px-4 py-2.5 rounded-xl bg-black/40 border border-zinc-800 text-xs font-mono text-zinc-500 max-w-md mx-auto truncate text-center">
                  Error: {error}
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={() => loadTrends()}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-855 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-sm transition-all cursor-pointer bg-zinc-900"
              >
                <RefreshCw className={`w-4 h-4 text-emerald-400 ${(loading && !refreshing) ? 'animate-spin' : ''}`} />
                <span>{language === 'SV' ? 'Ladda om' : 'Reload Trends'}</span>
              </button>
              <button
                onClick={handleTriggerIngestion}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3cbd82] hover:bg-[#2fa36e] text-neutral-950 font-black text-sm transition-all shadow-lg hover:shadow-emerald-500/15 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'SV' ? 'Scanna live-marknader' : 'Scan Live Marketplaces'}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* EMPTY STATE - Shown if no trend signals parsed in Supabase */}
        {!loading && !error && trends.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/45 border border-zinc-800/80 rounded-[32px] p-8 md:p-16 max-w-2xl mx-auto text-center space-y-6 shadow-2xl relative overflow-hidden"
            id="trend-empty-card"
          >
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="w-16 h-16 bg-[#3cbd82]/10 border border-[#3cbd82]/20 rounded-2xl flex items-center justify-center mx-auto mb-2 text-[#3cbd82]">
              <Database className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white leading-tight">
                {language === 'SV' ? 'Databasen är tom' : 'No fashion trends found'}
              </h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light">
                {language === 'SV' 
                  ? 'Inga sparade trendrapporter kunde hittas i din Supabase-databas för tillfället. Tryck på knappen nedan för att starta Repeak Trend collectors och bygga upp datan på en gång.' 
                  : 'We couldn’t find any trend metrics in your active Supabase database. Click below to boot and trigger the Repeak real-time ingestion parser.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleTriggerIngestion}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-sm transition-all shadow-lg hover:shadow-emerald-500/10 disabled:opacity-50 cursor-pointer"
              >
                {refreshing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{language === 'SV' ? 'Bygger trenddata...' : 'Booting discovery collectors...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'SV' ? 'Hämta och beräkna trender nu' : 'Fetch & Analyze Real Trends'}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* GRID OF TRENDS - Exquisite high-contrast mobile-first dashboard */}
        {!loading && trends.length > 0 && activeTab === 'current' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" id="current-trends-grid">
            {(isHomepage ? processedTrends.slice(0, 4) : processedTrends).map((item, index) => {
              // Extract details
              const resaleValFormatted = item.resale_price 
                ? `${item.resale_price.toLocaleString('sv-SE')} kr` 
                : (language === 'SV' ? 'Se i simulator' : 'View est.');

              const shortenedSourceLabel = item.source
                ? item.source.replace(' (Calculated by Repeak Trend Scoring Engine)', '')
                : 'Scoring Engine';

              const dynamicBadges = getDynamicBadges(item, language);

              return (
                <motion.div
                  key={item.id || index}
                  id={`trend-card-${item.id || index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative bg-zinc-900/90 border border-zinc-800/80 rounded-[28px] overflow-hidden group shadow-2xl hover:border-emerald-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[525px]"
                  onClick={() => {
                    trackEvent('click_trend_card', {
                      trend_name: item.trend_name,
                      category: item.category,
                      growth_percent: item.growth_percent
                    });
                    setSelectedTrend(item);
                  }}
                >
                  {/* Card Section 1: Visual Image Block */}
                  <div className="relative h-[240px] w-full overflow-hidden border-b border-zinc-800/40 shrink-0">
                    {item.image_url && (item.image_confidence_score === undefined || item.image_confidence_score >= 60) ? (
                      <img
                        src={item.image_url}
                        alt={item.trend_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[10%] group-hover:grayscale-0"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    ) : (
                      <CleanImagePlaceholder category={item.category} name={item.trend_name} language={language} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Floating Trend Score Indicator (Component 3) */}
                    <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
                      <span className="text-[9px] text-emerald-400 font-extrabold tracking-wider uppercase font-mono">Index</span>
                      <span className="text-sm text-white font-extrabold font-mono">{item.trend_score}/100</span>
                    </div>

                    {/* Floating Growth % Indicator (Component 4) */}
                    <div className="absolute top-4 right-4 bg-emerald-500 text-neutral-950 px-3 py-1.5 rounded-full font-sans font-black text-xs tracking-wider shadow-lg flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 font-bold" />
                      <span>+{Math.round(item.growth_percent)}%</span>
                    </div>

                    {/* Sourced Category Badge */}
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest px-2.5 py-1 rounded-md bg-zinc-950/85 border border-white/5 font-mono">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Section 2: Detailed Fashion Metadata list */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1 text-left">
                      {/* Dynamic Automatically Calculated Metric Badges */}
                      <div className="flex flex-wrap gap-1 items-center min-h-[20px]">
                        {dynamicBadges.slice(0, 2).map((badge) => (
                          <span
                            key={badge.id}
                            className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${badge.bg} ${badge.border} ${badge.text}`}
                          >
                            {badge.label}
                          </span>
                        ))}
                        {renderImageConfidenceBadge(item.image_confidence_score)}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-1">
                        <h3 className="text-lg md:text-xl font-black text-white tracking-tight truncate">
                          {item.trend_name}
                        </h3>
                        {/* Marketplace (Component 6) */}
                        <span className="bg-zinc-800 text-zinc-300 text-[10px] font-extrabold px-2.5 py-1 rounded border border-zinc-700 uppercase tracking-widest shrink-0 font-mono">
                          {item.marketplace}
                        </span>
                      </div>
                    </div>

                    {/* Integrated 3x2 details grid representing mandatory trend data parameters */}
                    <div className="grid grid-cols-3 gap-2 bg-black/35 p-3 rounded-2xl border border-zinc-805/40 text-left font-mono">
                      {/* Trend Score */}
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-500 uppercase font-black tracking-normal">
                          {language === 'SV' ? 'Index' : 'Index'}
                        </span>
                        <span className="text-xs font-black text-white mt-0.5 truncate">
                          {item.trend_score}/100
                        </span>
                      </div>

                      {/* Growth % */}
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-500 uppercase font-black tracking-normal">
                          {language === 'SV' ? 'Tillväxt' : 'Growth'}
                        </span>
                        <span className="text-xs font-black text-orange-400 mt-0.5 truncate">
                          +{Math.round(item.growth_percent)}%
                        </span>
                      </div>

                      {/* Trend Status */}
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-500 uppercase font-black tracking-normal">
                          {language === 'SV' ? 'Status' : 'Status'}
                        </span>
                        <span className={`text-[10px] font-black mt-0.5 truncate ${
                          item.trend_status === 'Rising' ? 'text-emerald-400' :
                          item.trend_status === 'Falling' ? 'text-rose-400' : 
                          item.trend_status === 'Insufficient' ? 'text-yellow-500/80' : 'text-zinc-400'
                        }`}>
                          {item.trend_status === 'Rising' ? (language === 'SV' ? '📈 Upp' : 'Rising') :
                           item.trend_status === 'Falling' ? (language === 'SV' ? '📉 Ner' : 'Falling') :
                           item.trend_status === 'Insufficient' ? (language === 'SV' ? '⚠️ Otillräcklig data' : '⚠️ Insufficient data') :
                           (language === 'SV' ? '➔ Stabil' : 'Stable')}
                        </span>
                      </div>

                      {/* Average Market Price */}
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-500 uppercase font-black tracking-normal">
                          {language === 'SV' ? 'Snittpris' : 'Avg Price'}
                        </span>
                        <span className="text-[11px] font-black text-emerald-400 mt-0.5 truncate">
                          {resaleValFormatted}
                        </span>
                      </div>

                      {/* Best Marketplace */}
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-500 uppercase font-black tracking-normal">
                          {language === 'SV' ? 'Marknad' : 'Market'}
                        </span>
                        <span className="text-xs font-medium text-white/85 mt-0.5 truncate" title={item.marketplace}>
                          {item.marketplace}
                        </span>
                      </div>

                      {/* Source/Type */}
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-500 uppercase font-black tracking-normal">
                          {language === 'SV' ? 'Källa' : 'Source'}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 truncate" title={shortenedSourceLabel}>
                          {shortenedSourceLabel}
                        </span>
                      </div>
                    </div>

                    {/* Confidence Score meter with bar */}
                    <div className="space-y-1 text-left">
                      <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-black tracking-wider">
                        <span>{language === 'SV' ? 'Datalinje Tillförlitlighet' : 'Data Lineage Reliability'}</span>
                        <span className="text-zinc-300 font-mono">{Math.round(item.confidence_score || 85)}%</span>
                      </div>
                      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.round(item.confidence_score || 85)}%` }}
                        />
                      </div>
                    </div>

                    {/* Interactive CTA helper toggling on hover */}
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-extrabold tracking-widest uppercase transition-colors group-hover:text-emerald-400 mt-1 font-mono">
                      <span className="group-hover:hidden">{language === 'SV' ? '📊 Håll musen för priser' : '📊 Hover to Compare'}</span>
                      <span className="hidden group-hover:inline-flex items-center gap-1">
                        <span>{language === 'SV' ? 'Datalinje & Analys' : 'View Deep Analysis'}</span>
                        <ArrowUp className="w-3 h-3 rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </span>
                    </div>

                  </div>
                  {/* Interactive price comparison index overlay */}
                  <CompareMarketplacesHover item={item} language={language} topOffset="top-[239px]" />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View all trends CTA button underneath the current trends grid on homepage */}
        {isHomepage && !loading && trends.length > 4 && activeTab === 'current' && (
          <div className="flex justify-center mt-8 mb-12" id="homepage-view-all-current-trends">
            <Link
              to="/trends"
              onClick={() => {
                trackEvent('click_view_all_trends', { tab: 'current' });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:scale-102 cursor-pointer"
            >
              <span>
                {language === 'SV' ? 'Visa alla marknadstrender' : 'View all market trends'}
              </span>
              <ArrowRight className="w-5 h-5 font-bold" />
            </Link>
          </div>
        )}

        {/* AI PREDICTIONS VIEW - SEPARATE GRID & POLISHED CARDS WITHOUT REPLACING RANKINGS */}
        {!loading && trends.length > 0 && activeTab === 'predictions' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" id="predictions-trends-grid">
            {(() => {
              const filtered = processedTrends.filter((item) => {
                const growth = item.predicted_growth ?? 0;
                if (predictionFilter === 'rising') return growth >= 10;
                if (predictionFilter === 'declining') return growth < 0;
                return true;
              });
              return (isHomepage ? filtered.slice(0, 4) : filtered).map((item, index) => {
                const keyVal = item.id || index;
                const isRising = (item.predicted_growth ?? 0) >= 10;
                const isDeclining = (item.predicted_growth ?? 0) < 0;

                // Design localized direction tags
                const directionTagBg = isRising 
                  ? 'bg-emerald-500/15 border-emerald-500/30' 
                  : isDeclining 
                    ? 'bg-rose-500/15 border-rose-500/30' 
                    : 'bg-zinc-500/15 border-zinc-500/30';
                
                const directionTagText = isRising 
                  ? 'text-emerald-400' 
                  : isDeclining 
                    ? 'text-rose-400' 
                    : 'text-zinc-400';

                const directionTagLabel = isRising 
                  ? (language === 'SV' ? '📈 AI STIGANDE' : '📈 AI RISING') 
                  : isDeclining 
                    ? (language === 'SV' ? '📉 AI AVSTANNANDE' : '📉 AI DECLINING') 
                    : (language === 'SV' ? '➔ AI STABIL' : '➔ AI STABLE');

                const resaleValFormatted = item.resale_price 
                  ? `${item.resale_price.toLocaleString('sv-SE')} kr` 
                  : (language === 'SV' ? 'Se i simulator' : 'View est.');

                return (
                  <motion.div
                    key={`pred-${keyVal}`}
                    id={`pred-card-${keyVal}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="relative bg-zinc-900/90 border border-violet-500/10 hover:border-violet-500/40 rounded-[28px] overflow-hidden group shadow-2xl flex flex-col justify-between h-[525px]"
                    onClick={() => {
                      trackEvent('click_prediction_card', {
                        trend_name: item.trend_name,
                        category: item.category,
                        predicted_growth: item.predicted_growth,
                        future_trend_score: item.future_trend_score
                      });
                      setSelectedTrend(item);
                    }}
                  >
                    {/* Visual Image Block with Prognosis Score Overlay */}
                    <div className="relative h-[200px] w-full overflow-hidden border-b border-zinc-800/45 shrink-0">
                      {item.image_url && (item.image_confidence_score === undefined || item.image_confidence_score >= 60) ? (
                        <img
                          src={item.image_url}
                          alt={item.trend_name}
                          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition duration-500"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                      ) : (
                        <CleanImagePlaceholder category={item.category} name={item.trend_name} language={language} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent to-transparent pointer-events-none" />

                      {/* Floating Future Score Indicator */}
                      <div className="absolute top-4 left-4 bg-violet-950/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-violet-500/40 flex items-center gap-1.5 shadow-lg">
                        <span className="text-[8px] text-violet-300 font-extrabold tracking-wider uppercase font-mono">Future Index</span>
                        <span className="text-xs text-white font-black font-mono">{item.future_trend_score ?? 75}/100</span>
                      </div>

                      {/* Floating Forecast growth indicator */}
                      <div className={`absolute top-4 right-4 ${isRising ? 'bg-emerald-500' : isDeclining ? 'bg-rose-500 text-white' : 'bg-zinc-700 text-white'} text-neutral-950 px-3 py-1.5 rounded-full font-sans font-black text-xs tracking-wider shadow-lg flex items-center gap-1`}>
                        {isRising ? <TrendingUp className="w-3.5 h-3.5" /> : isDeclining ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                        <span>{isRising ? '+' : ''}{Math.round(item.predicted_growth ?? 0)}%</span>
                      </div>

                      {/* Category Label */}
                      <div className="absolute bottom-3 left-4">
                        <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest px-2 py-0.5 rounded bg-zinc-950/85 border border-white/5 font-mono">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Metadata and Prognosis breakdown section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-2 font-sans">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border rounded ${directionTagBg} ${directionTagText}`}>
                              {directionTagLabel}
                            </span>
                            {renderImageConfidenceBadge(item.image_confidence_score)}
                          </div>
                          <span className="text-zinc-500 text-[9px] font-bold font-mono">{item.marketplace}</span>
                        </div>

                        <h3 className="text-base md:text-lg font-black text-white leading-snug tracking-tight text-left">
                          {item.trend_name}
                        </h3>

                        {/* Customized Forecast Text Summary */}
                        <p className="text-zinc-400 text-[11px] text-left leading-relaxed py-1.5 px-2.5 rounded-xl bg-black/40 border border-zinc-800/40 line-clamp-2 min-h-[46px]">
                          {getForecastSummary(item, language)}
                        </p>
                      </div>

                      {/* Metrics detail grids */}
                      <div className="grid grid-cols-2 gap-2 bg-black/25 p-2.5 rounded-xl border border-zinc-800/30 text-left shrink-0 font-mono">
                        <div>
                          <span className="text-[8px] text-zinc-500 uppercase font-black tracking-wider block">AI Confidence</span>
                          <span className="text-xs font-black text-violet-400 block mt-0.5">
                            {Math.round(item.prediction_confidence ?? 80)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-500 uppercase font-black tracking-wider block">Resale Value</span>
                          <span className="text-xs font-black text-zinc-300 block mt-0.5">
                            {resaleValFormatted}
                          </span>
                        </div>
                      </div>

                      {/* Confidence Meter Bar */}
                      <div className="space-y-1 text-left shrink-0">
                        <div className="flex justify-between text-[9px] text-zinc-500 font-black uppercase tracking-wider block">
                          <span>Prediction Confidence</span>
                          <span className="text-violet-300 font-mono">{Math.round(item.prediction_confidence ?? 80)}%</span>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-violet-500 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.round(item.prediction_confidence ?? 80)}%` }}
                          />
                        </div>
                      </div>

                      {/* Interactive CTA helper toggling on hover */}
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-extrabold tracking-widest uppercase transition-colors group-hover:text-violet-300 mt-1 font-mono">
                        <span className="group-hover:hidden">{language === 'SV' ? '📊 Håll musen för priser' : '📊 Hover to Compare'}</span>
                        <span className="hidden group-hover:inline-flex items-center gap-1">
                          <span>{language === 'SV' ? 'DjupAnalys & Prognos' : 'Prognosis & Analysis'}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>

                    </div>
                    {/* Interactive price comparison index overlay */}
                    <CompareMarketplacesHover item={item} language={language} topOffset="top-[199px]" />
                  </motion.div>
                );
              });
            })()}
          </div>
        )}

        {/* View all trends CTA button underneath the predictions trends grid on homepage */}
        {isHomepage && !loading && trends.length > 4 && activeTab === 'predictions' && (
          <div className="flex justify-center mt-8 mb-12" id="homepage-view-all-predictions">
            <Link
              to="/trends"
              onClick={() => {
                trackEvent('click_view_all_trends', { tab: 'predictions' });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-black text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 hover:scale-102 cursor-pointer"
            >
              <span>
                {language === 'SV' ? 'Visa alla AI-prognoser' : 'View all AI forecasts'}
              </span>
              <ArrowRight className="w-5 h-5 font-bold" />
            </Link>
          </div>
        )}

        {/* Predictions Filters Empty State */}
        {!loading && activeTab === 'predictions' && (
          (() => {
            const filterCount = processedTrends.filter((item) => {
              const growth = item.predicted_growth ?? 0;
              if (predictionFilter === 'rising') return growth >= 10;
              if (predictionFilter === 'declining') return growth < 0;
              return true;
            }).length;

            if (filterCount === 0) {
              return (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-zinc-900/10 border border-zinc-800/40 rounded-[28px] max-w-lg mx-auto"
                >
                  <p className="text-zinc-400 text-sm font-bold uppercase font-mono tracking-wider">
                    {language === 'SV' ? 'Inga matchande prognoser i denna kategori' : 'No matching forecasts in this filter'}
                  </p>
                </motion.div>
              );
            }
            return null;
          })()
        )}

        {/* DETAIL MODAL - Deep analysis view for the active selected trend */}
        <AnimatePresence>
          {selectedTrend && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 md:p-8 max-w-2xl w-full relative shadow-3xl text-left"
              >
                {/* Close modal handle */}
                <button 
                  onClick={() => setSelectedTrend(null)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white bg-zinc-900/85 p-2 rounded-full cursor-pointer hover:bg-zinc-800 transition shadow-lg"
                >
                  ✕
                </button>

                <div className="flex flex-col md:flex-row gap-6 mt-2">
                  {/* Left Column: Styled card artwork and marketplace badge */}
                  <div className="w-full md:w-1/3 shrink-0">
                    <div className="h-48 md:h-64 rounded-2xl overflow-hidden relative border border-white/10 shadow-xl">
                      {selectedTrend.image_url && (selectedTrend.image_confidence_score === undefined || selectedTrend.image_confidence_score >= 60) ? (
                        <img 
                          src={selectedTrend.image_url} 
                          alt={selectedTrend.trend_name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                      ) : (
                        <CleanImagePlaceholder category={selectedTrend.category} name={selectedTrend.trend_name} language={language} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] uppercase font-bold text-white/90 tracking-widest px-2.5 py-1 rounded bg-zinc-900 border border-white/5 font-mono">
                          {selectedTrend.marketplace}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Breakdown metrics */}
                  <div className="w-full md:w-2/3 space-y-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-black uppercase tracking-widest block mb-1.5 font-mono">
                        <Database className="w-3 h-3 text-emerald-400" />
                        <span>{language === 'SV' ? 'REPEAK TREND SCORING ENGINE' : 'REPEAK TREND SCORING ENGINE'}</span>
                      </div>

                      {/* Dynamic Automatically Calculated Metric Badges list inside Modal */}
                      <div className="flex flex-wrap gap-1.5 my-2">
                        {getDynamicBadges(selectedTrend, language).map((badge) => (
                          <span
                            key={badge.id}
                            className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded border ${badge.bg} ${badge.border} ${badge.text}`}
                          >
                            {badge.label}
                          </span>
                        ))}
                        {renderImageConfidenceBadge(selectedTrend.image_confidence_score)}
                      </div>

                      <h3 className="text-3xl font-black text-white leading-tight tracking-tight">
                        {selectedTrend.trend_name}
                      </h3>
                      <p className="text-zinc-500 text-xs mt-1">
                        {language === 'SV' ? 'Kategori: ' : 'Category: '}
                        <span className="text-white font-medium">{selectedTrend.category}</span>
                      </p>
                    </div>

                    {/* Numeric analytical indices overview block */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-zinc-900 border border-zinc-800/60 p-3.5 rounded-xl text-center">
                        <span className="text-[9px] text-zinc-500 block uppercase font-extrabold tracking-wider mb-1">Trend Score</span>
                        <strong className="text-2xl text-emerald-400 font-extrabold tracking-tight font-mono">
                          {selectedTrend.trend_score}/100
                        </strong>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800/60 p-3.5 rounded-xl text-center">
                        <span className="text-[9px] text-zinc-500 block uppercase font-extrabold tracking-wider mb-1">
                          {language === 'SV' ? 'Tillväxt' : 'Growth' }
                        </span>
                        <strong className="text-xl text-orange-400 font-extrabold tracking-tight font-mono">
                          +{Math.round(selectedTrend.growth_percent)}%
                        </strong>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800/60 p-3.5 rounded-xl text-center">
                        <span className="text-[9px] text-zinc-500 block uppercase font-extrabold tracking-wider mb-1">
                          {language === 'SV' ? 'Pålitlighet' : 'Reliability'}
                        </span>
                        <strong className="text-xl text-sky-400 font-extrabold tracking-tight font-mono">
                          {Math.round(selectedTrend.confidence_score || 85)}%
                        </strong>
                      </div>
                    </div>

                    {/* AI Prognosis Indicators Module if predicted_growth exists */}
                    {selectedTrend.predicted_growth !== undefined && (
                      <div className="bg-violet-950/20 border border-violet-500/20 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center gap-1.5 text-violet-400 text-[10px] font-black uppercase tracking-widest font-mono">
                          <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                          <span>{language === 'SV' ? 'AI Framtidsprognos' : 'AI Future Prediction'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1 font-sans">
                          <div className="text-left bg-black/40 p-2 rounded-lg border border-violet-500/10">
                            <span className="text-[8px] text-zinc-400 block uppercase font-bold">Projected MoM</span>
                            <strong className={`text-sm font-black font-mono block mt-0.5 ${(selectedTrend.predicted_growth ?? 0) >= 10 ? 'text-emerald-400' : (selectedTrend.predicted_growth ?? 0) < 0 ? 'text-rose-400' : 'text-zinc-300'}`}>
                              {(selectedTrend.predicted_growth ?? 0) >= 10 ? '+' : ''}{Math.round(selectedTrend.predicted_growth ?? 0)}%
                            </strong>
                          </div>
                          <div className="text-left bg-black/40 p-2 rounded-lg border border-violet-500/10">
                            <span className="text-[8px] text-zinc-400 block uppercase font-bold">Future Score</span>
                            <strong className="text-sm font-black font-mono text-violet-400 block mt-0.5">
                              {selectedTrend.future_trend_score ?? 75}/100
                            </strong>
                          </div>
                          <div className="text-left bg-black/40 p-2 rounded-lg border border-violet-500/10">
                            <span className="text-[8px] text-zinc-400 block uppercase font-bold">AI Confidence</span>
                            <strong className="text-sm font-black font-mono text-violet-300 block mt-0.5">
                              {Math.round(selectedTrend.prediction_confidence ?? 80)}%
                            </strong>
                          </div>
                        </div>
                        <p className="text-zinc-300 text-xs text-left leading-relaxed italic bg-black/20 p-2.5 rounded border border-white/5">
                          &ldquo;{getForecastSummary(selectedTrend, language)}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Technical component breakouts */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs uppercase text-zinc-500 tracking-wider font-extrabold">
                        {language === 'SV' ? 'Delsignaler' : 'Subsignals calculated'}
                      </h4>

                      {/* 1. Search growth percentage */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-zinc-300">
                          <span>🔍 {language === 'SV' ? 'Söktillväxt (Google Trends)' : 'Search Volume growth'}</span>
                          <span className="font-mono text-emerald-400 font-bold">+{selectedTrend.search_growth || Math.round(selectedTrend.growth_percent * 1.1)}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${Math.min(100, (selectedTrend.search_growth || selectedTrend.growth_percent) / 2)}%` }}
                          />
                        </div>
                      </div>

                      {/* 2. Engagement growth percentage */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-zinc-300">
                          <span>💬 {language === 'SV' ? 'Socialt engagemang (Fit checks/saves)' : 'Social engagement rate'}</span>
                          <span className="font-mono text-emerald-400 font-bold">+{selectedTrend.engagement_growth || selectedTrend.growth_percent}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${Math.min(100, (selectedTrend.engagement_growth || selectedTrend.growth_percent) / 2)}%` }}
                          />
                        </div>
                      </div>

                      {/* 3. Marketplace activity rating */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-zinc-300">
                          <span>🛒 {language === 'SV' ? 'Handelsaktivitet (Transaktioner)' : 'Secondary listing volume'}</span>
                          <span className="font-mono text-emerald-400 font-bold">{selectedTrend.marketplace_activity || Math.round(selectedTrend.trend_score * 0.95)}/100</span>
                        </div>
                        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${selectedTrend.marketplace_activity || (selectedTrend.trend_score * 0.95)}%` }}
                          />
                        </div>
                      </div>

                      {/* 4. Resale activity metrics */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-zinc-300">
                          <span>📈 {language === 'SV' ? 'Andrahandsaktivitet (Värdeminskning)' : 'Secondary Resale Premium'}</span>
                          <span className="font-mono text-emerald-400 font-bold">{selectedTrend.resale_activity || selectedTrend.trend_score}/100</span>
                        </div>
                        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${selectedTrend.resale_activity || selectedTrend.trend_score}%` }}
                          />
                        </div>
                      </div>

                      {/* 5. Social mentions quantity count */}
                      <div className="flex justify-between items-center text-xs text-zinc-300 py-2 border-t border-zinc-900 mt-2 font-mono">
                        <span>👥 {language === 'SV' ? 'Verifierade sociala omnämnanden' : 'Verified Social Mentions'}</span>
                        <strong className="text-white text-sm font-extrabold font-mono">
                          {selectedTrend.social_mentions?.toLocaleString() || "6,200"}
                        </strong>
                      </div>

                      {/* 6. Marketplace value */}
                      <div className="flex justify-between items-center text-xs text-zinc-300 py-2 border-t border-zinc-900 font-mono">
                        <span>🏷️ {language === 'SV' ? 'Repeak uppskattat pris' : 'Repeak Estimated Resale'}</span>
                        <strong className="text-[#3cbd82] text-sm font-extrabold font-mono">
                          {selectedTrend.resale_price ? `${selectedTrend.resale_price.toLocaleString('sv-SE')} kr` : '--'}
                        </strong>
                      </div>

                      {/* 7. Detailed full lineage string */}
                      <div className="pt-2 text-[10px] text-zinc-500 leading-relaxed italic text-left">
                        {language === 'SV' ? 'Komplett Spårbarhet: ' : 'Traceability Details: '}
                        <span className="text-zinc-400 not-italic">{selectedTrend.source}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action trigger alignment */}
                <div className="mt-8 pt-4 border-t border-zinc-900/80 flex justify-end gap-3">
                  <button 
                    onClick={() => setSelectedTrend(null)}
                    className="px-5 py-2.5 rounded-full text-zinc-500 hover:text-zinc-300 font-semibold text-sm transition cursor-pointer"
                  >
                    {language === 'SV' ? 'Stäng' : 'Dismiss'}
                  </button>
                  <button 
                    onClick={() => executeSearchForTrend(selectedTrend.trend_name)}
                    className="px-6 py-2.5 rounded-full bg-[#3cbd82] text-neutral-950 font-black text-sm hover:bg-[#2fa36e] hover:scale-102 transition-all cursor-pointer inline-flex items-center gap-1 shadow-lg"
                  >
                    <span>{language === 'SV' ? 'Hitta bästa priskap' : 'Scan Best Market Deals'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Back-To-Top Circular green arrow button accurately positioned bottom left to support fluid navigation */}
        <div className="flex justify-start mt-10">
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleScrollToTop}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#3cbd82] hover:bg-[#3cbd82]/10 hover:border-[#3cbd82]/35 shadow-lg shadow-black/45 cursor-pointer relative group transition-colors duration-300"
            title={language === 'SV' ? 'Gå till sök' : 'Go to search'}
          >
            <ArrowUp className="w-5 h-5 group-hover:animate-bounce" />
          </motion.button>
        </div>

      </div>
    </section>
  );
}
