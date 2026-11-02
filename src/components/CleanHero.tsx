import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, TrendingUp, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { trackEvent } from '../lib/analytics';

const HERO_BG_IMAGE = '/src/assets/images/hero_scandi_fashion_minimal_1792668380172.jpg';

export default function CleanHero() {
  const { language } = useLanguage();
  const isEn = language === 'EN';
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const popularSearches = [
    { label: 'Acne Studios Musubi', cat: isEn ? 'Bags' : 'Väskor', avgPrice: '4 800 kr' },
    { label: "Arc'teryx Beta LT", cat: isEn ? 'Jackets' : 'Jackor', avgPrice: '3 200 kr' },
    { label: 'Totême Stickat', cat: isEn ? 'Knitwear' : 'Stickat', avgPrice: '2 350 kr' },
    { label: 'Vintage Carhartt Detroit', cat: isEn ? 'Jackets' : 'Jackor', avgPrice: '1 650 kr' },
    { label: 'Ganni Seersucker', cat: isEn ? 'Dresses' : 'Klänningar', avgPrice: '1 100 kr' },
    { label: 'Adidas Samba OG', cat: isEn ? 'Shoes' : 'Skor', avgPrice: '850 kr' },
    { label: "Levi's 501 Vintage", cat: isEn ? 'Denim' : 'Jeans', avgPrice: '650 kr' },
  ];

  const quickSearches = [
    { label: 'Acne Studios', q: 'Acne Studios' },
    { label: "Arc'teryx", q: "Arc'teryx" },
    { label: 'Totême', q: 'Totême' },
    { label: 'Carhartt', q: 'Carhartt' },
    { label: 'Ganni', q: 'Ganni' },
    { label: 'Our Legacy', q: 'Our Legacy' },
    { label: 'Adidas Samba', q: 'Adidas Samba' },
    { label: "Levi's 501", q: "Levi's 501" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) {
      navigate('/search');
      return;
    }
    trackEvent('hero_search_submitted', { query: clean });
    navigate(`/search?q=${encodeURIComponent(clean)}`);
  };

  const handleSelectQuery = (q: string) => {
    setQuery(q);
    setIsFocused(false);
    trackEvent('hero_suggestion_selected', { query: q });
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative pt-14 pb-20 md:pt-20 md:pb-28 px-4 overflow-hidden border-b border-white/5" id="hero-search">
      {/* Editorial Background Image with Dark Luxury Scrim */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <img
          src={HERO_BG_IMAGE}
          alt="Scandinavian circular fashion background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-15 scale-105 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/85 to-[#050505]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6 md:space-y-8">
        
        {/* Subtle, unboxed editorial kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">
          <span>{isEn ? 'Nordic Secondhand Index' : 'Nordiskt Secondhand-Index'}</span>
          <span className="text-white/30">/</span>
          <span>{isEn ? 'Tradera · Vinted · Sellpy · Blocket · Plick' : 'Tradera · Vinted · Sellpy · Blocket · Plick'}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-display leading-[1.06] text-balance">
          {isEn ? (
            <>
              Every secondhand marketplace. <br className="hidden sm:inline" />
              <span className="text-emerald-400">One intelligent search.</span>
            </>
          ) : (
            <>
              Sök alla second hand-sajter. <br className="hidden sm:inline" />
              <span className="text-emerald-400">Hitta de äkta fynden.</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-white/65 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed text-balance">
          {isEn
            ? 'Compare live listings, real-time resale price corridors, and platform fees across Sweden’s leading circular fashion apps in seconds.'
            : 'Jämför aktiva annonser, andrahandsvärderingar och säljaravgifter över Tradera, Vinted, Sellpy, Blocket och Plick på sekunden.'}
        </p>

        {/* Search Input Box */}
        <div className="max-w-2xl mx-auto relative text-left" ref={dropdownRef}>
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-[#0d0f11]/90 backdrop-blur-xl border border-white/15 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 rounded-2xl p-2 sm:p-2.5 shadow-2xl transition-all"
          >
            <div className="pl-3.5 pr-2.5 text-white/40">
              <Search className="w-5 h-5 text-emerald-400/80" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={isEn ? 'Search brand, item or model (e.g. Acne Studios, Arc’teryx, Totême)...' : 'Sök märke, modell eller kategori (t.ex. Acne Studios, Arc’teryx, Totême)...'}
              className="flex-1 bg-transparent text-white text-sm sm:text-base placeholder:text-white/35 focus:outline-none py-2 font-sans"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 text-white/40 hover:text-white transition-colors mr-1 cursor-pointer rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
            >
              <span>{isEn ? 'Search' : 'Sök'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Autocomplete / Suggested Searches Dropdown */}
          {isFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c0e10]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-40 p-3 space-y-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/40 px-2 font-bold">
                <span>{isEn ? 'TRENDING SECONDHAND SEARCHES' : 'POPULÄRASTE SÖKNINGARNA IDAG'}</span>
                <span>{isEn ? 'MARKET AVG' : 'SNITTPRIS'}</span>
              </div>
              <div className="space-y-1">
                {popularSearches.map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSelectQuery(item.label)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-sm text-white group-hover:text-emerald-400 transition-colors font-medium block">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-white/40 font-mono">
                          {item.cat}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white/70 tabular-nums">
                      {item.avgPrice}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Search Editorial Text Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto pt-1">
          <span className="text-xs text-white/40 font-mono mr-1">
            {isEn ? 'Trending:' : 'Populärt:'}
          </span>
          {quickSearches.map(item => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSelectQuery(item.q)}
              className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-emerald-400/40 text-white/75 hover:text-white text-xs transition-all cursor-pointer font-sans"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Supported Marketplaces Showcase Strip */}
        <div className="pt-10 border-t border-white/5 max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-white/40 font-bold">
            {isEn 
              ? 'REAL-TIME AGGREGATION ACROSS NORDIC MARKETPLACES' 
              : 'REALTIDS-INDEXERING ÖVER SVERIGES 5 STÖRSTA ANDRAHANDSMARKNADER'}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Tradera */}
            <Link
              to="/search?marketplace=Tradera"
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#f07c00]/50 transition-all flex flex-col items-center text-center group hover:bg-white/[0.04]"
            >
              <span className="text-sm font-black text-[#f07c00] group-hover:scale-105 transition-transform">Tradera</span>
              <span className="text-[11px] text-white/45 mt-0.5">{isEn ? 'Auctions & Buy Now' : 'Auktioner & fastpris'}</span>
            </Link>

            {/* Vinted */}
            <Link
              to="/search?marketplace=Vinted"
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#09B1BA]/50 transition-all flex flex-col items-center text-center group hover:bg-white/[0.04]"
            >
              <span className="text-sm font-black text-[#09B1BA] group-hover:scale-105 transition-transform">Vinted</span>
              <span className="text-[11px] text-white/45 mt-0.5">{isEn ? '0% Seller Fee' : '0% säljaravgift'}</span>
            </Link>

            {/* Sellpy */}
            <Link
              to="/search?marketplace=Sellpy"
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-amber-400/50 transition-all flex flex-col items-center text-center group hover:bg-white/[0.04]"
            >
              <span className="text-sm font-black text-amber-400 group-hover:scale-105 transition-transform">Sellpy</span>
              <span className="text-[11px] text-white/45 mt-0.5">{isEn ? 'Quality Checked' : 'Kvalitetskontrollerat'}</span>
            </Link>

            {/* Blocket */}
            <Link
              to="/search?marketplace=Blocket"
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#2cb1fc]/50 transition-all flex flex-col items-center text-center group hover:bg-white/[0.04]"
            >
              <span className="text-sm font-black text-[#2cb1fc] group-hover:scale-105 transition-transform">Blocket</span>
              <span className="text-[11px] text-white/45 mt-0.5">{isEn ? 'Local & Shipping' : 'Frakt & direktköp'}</span>
            </Link>

            {/* Plick */}
            <Link
              to="/search?marketplace=Plick"
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#f43f5e]/50 transition-all flex flex-col items-center text-center group col-span-2 sm:col-span-1 hover:bg-white/[0.04]"
            >
              <span className="text-sm font-black text-[#f43f5e] group-hover:scale-105 transition-transform">Plick</span>
              <span className="text-[11px] text-white/45 mt-0.5">{isEn ? 'Streetwear & Vintage' : 'Streetwear & vintage'}</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-white/45 pt-2 font-mono flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {isEn ? '42,000+ listings tracked' : '42 000+ analyserade annonser'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {isEn ? 'Independent price index' : 'Oberoende marknadsvärdering'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {isEn ? '100% Free for buyers' : '100% Gratis för köpare & säljare'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

