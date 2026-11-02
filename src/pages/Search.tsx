import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search as SearchIcon, 
  SlidersHorizontal, 
  Sparkles, 
  ExternalLink, 
  Mail, 
  X, 
  ArrowUpDown, 
  Tag, 
  TrendingUp, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  Info,
  Heart
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useFavorites } from '../FavoritesContext';
import { trackEvent } from '../lib/analytics';
import { SearchListing, SearchFilterState } from '../types';
import { 
  INITIAL_LISTINGS, 
  INITIAL_FILTER_STATE, 
  filterListings, 
  computeFacets, 
  COLOR_CONFIG,
  detectSmartCorrection
} from '../data/searchListingsData';
import SearchSidebarFilter from '../components/SearchSidebarFilter';
import WorkspaceShare from '../components/WorkspaceShare';

export default function Search() {
  const { language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query parameter synchronization
  const initialQuery = searchParams.get('q') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialCategory = searchParams.get('category') || '';

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'relevance' | 'lowestPrice' | 'highestPrice' | 'newest' | 'dealScore'>('relevance');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [shareItem, setShareItem] = useState<{ title: string; price: number; marketplace: string; link: string; condition: string } | null>(null);

  // Smart spelling/alias detection
  const smartCorrection = useMemo(() => {
    return detectSmartCorrection(activeQuery);
  }, [activeQuery]);

  // Filters State
  const [filters, setFilters] = useState<SearchFilterState>(() => {
    return {
      ...INITIAL_FILTER_STATE,
      brands: initialBrand ? [initialBrand] : []
    };
  });

  // Keep queryInput in sync if URL query changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const b = searchParams.get('brand') || '';
    if (q !== activeQuery) {
      setActiveQuery(q);
      setQueryInput(q);
    }
    if (b && !filters.brands.includes(b)) {
      setFilters(prev => ({ ...prev, brands: [b] }));
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = queryInput.trim();
    setActiveQuery(clean);
    setSearchParams(prev => {
      if (clean) {
        prev.set('q', clean);
      } else {
        prev.delete('q');
      }
      return prev;
    });
    trackEvent('search_page_query_submitted', { query: clean });
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTER_STATE);
    trackEvent('search_page_filters_reset');
  };

  // Remove a single active filter pill
  const handleRemoveBrand = (brand: string) => {
    setFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }));
  };

  const handleRemoveSize = (size: string) => {
    setFilters(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));
  };

  const handleRemoveColor = (color: string) => {
    setFilters(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }));
  };

  const handleRemoveCondition = (cond: string) => {
    setFilters(prev => ({ ...prev, conditions: prev.conditions.filter(c => c !== cond) }));
  };

  const handleRemoveMarketplace = (market: string) => {
    setFilters(prev => ({ ...prev, marketplaces: prev.marketplaces.filter(m => m !== market) }));
  };

  const handleClearPrice = () => {
    setFilters(prev => ({ ...prev, minPrice: null, maxPrice: null }));
  };

  // Filtered and sorted listings
  const filteredResults = useMemo(() => {
    return filterListings(INITIAL_LISTINGS, activeQuery, filters, sortBy);
  }, [activeQuery, filters, sortBy]);

  // Facet calculations on current items
  const facets = useMemo(() => {
    return computeFacets(INITIAL_LISTINGS);
  }, []);

  // Compute market summary stats for filtered items
  const stats = useMemo(() => {
    if (filteredResults.length === 0) return null;
    const prices = filteredResults.map(i => i.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
    const bargains = filteredResults.filter(i => i.tag === 'Kap!').length;
    return { min, max, avg, bargains };
  }, [filteredResults]);

  // Check if any filter is active
  const hasActiveFilters = 
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.conditions.length > 0 ||
    filters.marketplaces.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null;

  const totalActiveFilterCount = 
    filters.brands.length +
    filters.sizes.length +
    filters.colors.length +
    filters.conditions.length +
    filters.marketplaces.length +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Soft Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#3cbd82]/5 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link to="/" className="hover:text-white transition-colors">
            {language === 'SV' ? 'Hem' : 'Home'}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-white font-medium">
            {language === 'SV' ? 'Sökresultat' : 'Search Results'}
          </span>
        </div>

        {/* Search Bar Header */}
        <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder={language === 'SV' ? 'Sök plagg, märke, modell eller färg (t.ex. Ganni, Levi’s 501, Musubi)...' : 'Search garment, brand, model or color...'}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-12 pr-10 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#3cbd82] focus:ring-1 focus:ring-[#3cbd82] transition-all"
              />
              {queryInput && (
                <button
                  type="button"
                  onClick={() => {
                    setQueryInput('');
                    setActiveQuery('');
                    setSearchParams({});
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#3cbd82] hover:bg-[#34a974] text-neutral-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#3cbd82]/20 cursor-pointer shrink-0"
            >
              {language === 'SV' ? 'Sök' : 'Search'}
            </button>
          </form>

          {/* Trending suggestions */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#3cbd82]" />
              {language === 'SV' ? 'Populärt:' : 'Trending:'}
            </span>
            {[
              "Nike Dunk",
              "Arc'teryx",
              "Acne Studios",
              "Patagonia",
              "Comme des Garçons",
              "Ganni",
              "Levi's",
              "Salomon XT-6",
              "Totême",
              "Our Legacy",
              "Carhartt"
            ].map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setQueryInput(preset);
                  setActiveQuery(preset);
                  setSearchParams({ q: preset });
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeQuery.toLowerCase() === preset.toLowerCase()
                    ? 'bg-[#3cbd82] text-neutral-950 font-bold'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5 hover:border-white/15'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Results Metadata Bar: Title, Count, Mobile Filter Button, Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {activeQuery ? (
                <>
                  <span>{language === 'SV' ? 'Resultat för' : 'Results for'}</span>
                  <span className="text-[#3cbd82]">"{activeQuery}"</span>
                </>
              ) : (
                <span>{language === 'SV' ? 'Alla secondhand-annonser' : 'All Secondhand Listings'}</span>
              )}
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              {language === 'SV' 
                ? `Visar ${filteredResults.length} annonser från Tradera, Plick, Vinted, Sellpy och Blocket`
                : `Showing ${filteredResults.length} listings aggregated across Tradera, Plick, Vinted, Sellpy, and Blocket`}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-[#3cbd82]/40 text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#3cbd82]" />
              <span>{language === 'SV' ? 'Filter' : 'Filters'}</span>
              {totalActiveFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#3cbd82] text-neutral-950 text-[10px] font-mono font-black flex items-center justify-center">
                  {totalActiveFilterCount}
                </span>
              )}
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                {language === 'SV' ? 'Sortera:' : 'Sort:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="relevance" className="bg-zinc-900 text-white">
                  {language === 'SV' ? 'Relevans (Bästa kap först)' : 'Relevance (Best deals first)'}
                </option>
                <option value="lowestPrice" className="bg-zinc-900 text-white">
                  {language === 'SV' ? 'Lägsta pris' : 'Lowest Price'}
                </option>
                <option value="highestPrice" className="bg-zinc-900 text-white">
                  {language === 'SV' ? 'Högsta pris' : 'Highest Price'}
                </option>
                <option value="dealScore" className="bg-zinc-900 text-white">
                  {language === 'SV' ? 'Högst Deal Score' : 'Highest Deal Score'}
                </option>
                <option value="newest" className="bg-zinc-900 text-white">
                  {language === 'SV' ? 'Skick (Nyskick först)' : 'Condition (Best condition first)'}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* SMART CORRECTION / ALIAS BANNER */}
        {smartCorrection && activeQuery.toLowerCase().trim() !== smartCorrection.brand.toLowerCase() && (
          <div className="bg-[#3cbd82]/10 border border-[#3cbd82]/25 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3cbd82] shrink-0" />
              <span>
                {language === 'SV' ? (
                  <>
                    Visar sökresultat för <strong className="text-white font-bold">{smartCorrection.brand}</strong>
                    {smartCorrection.confidence === 'alias' && <span className="text-zinc-400 font-mono text-[11px]"> (matchat via varumärkes-alias)</span>}
                  </>
                ) : (
                  <>
                    Showing search results for <strong className="text-white font-bold">{smartCorrection.brand}</strong>
                    {smartCorrection.confidence === 'alias' && <span className="text-zinc-400 font-mono text-[11px]"> (matched via brand alias)</span>}
                  </>
                )}
              </span>
            </div>
            <button
              onClick={() => {
                setQueryInput(smartCorrection.brand);
                setActiveQuery(smartCorrection.brand);
                setSearchParams({ q: smartCorrection.brand });
              }}
              className="px-2.5 py-1 bg-[#3cbd82]/20 hover:bg-[#3cbd82]/30 text-[#3cbd82] hover:text-white rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer"
            >
              {language === 'SV' ? 'Sök exakt' : 'Search exact'}
            </button>
          </div>
        )}

        {/* ACTIVE FILTER PILLS STRIP */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap py-2 border-y border-white/5 text-xs font-mono">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold">
              {language === 'SV' ? 'Aktiva filter:' : 'Active filters:'}
            </span>

            {/* Brands */}
            {filters.brands.map(b => (
              <span 
                key={b}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3cbd82]/10 border border-[#3cbd82]/25 text-[#3cbd82] text-xs"
              >
                <span>{b}</span>
                <button onClick={() => handleRemoveBrand(b)} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Sizes */}
            {filters.sizes.map(s => (
              <span 
                key={s}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-white border border-white/10 text-xs"
              >
                <span>{language === 'SV' ? `Stl ${s}` : `Size ${s}`}</span>
                <button onClick={() => handleRemoveSize(s)} className="hover:text-zinc-300 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Colors */}
            {filters.colors.map(c => {
              const colorMeta = COLOR_CONFIG[c];
              return (
                <span 
                  key={c}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-white border border-white/10 text-xs"
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ background: colorMeta?.hex || '#ccc' }}
                  />
                  <span>{language === 'SV' ? colorMeta?.labelSv || c : colorMeta?.labelEn || c}</span>
                  <button onClick={() => handleRemoveColor(c)} className="hover:text-zinc-300 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {/* Conditions */}
            {filters.conditions.map(c => (
              <span 
                key={c}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs"
              >
                <span>{c}</span>
                <button onClick={() => handleRemoveCondition(c)} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Marketplaces */}
            {filters.marketplaces.map(m => (
              <span 
                key={m}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs"
              >
                <span>{m}</span>
                <button onClick={() => handleRemoveMarketplace(m)} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Price Range */}
            {(filters.minPrice !== null || filters.maxPrice !== null) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs">
                <span>
                  {filters.minPrice !== null && filters.maxPrice !== null 
                    ? `${filters.minPrice} - ${filters.maxPrice} kr`
                    : filters.minPrice !== null 
                    ? `Från ${filters.minPrice} kr` 
                    : `Upp till ${filters.maxPrice} kr`}
                </span>
                <button onClick={handleClearPrice} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Clear all button */}
            <button
              onClick={handleResetFilters}
              className="text-[#3cbd82] hover:text-white underline text-xs font-mono ml-auto cursor-pointer"
            >
              {language === 'SV' ? 'Rensa alla filter' : 'Clear all filters'}
            </button>
          </div>
        )}

        {/* MAIN BODY: SIDEBAR + RESULTS GRID */}
        <div className="flex gap-6 items-start">
          
          {/* ADVANCED SIDEBAR FILTER COMPONENT */}
          <SearchSidebarFilter
            filters={filters}
            onFilterChange={setFilters}
            facets={facets}
            totalMatches={filteredResults.length}
            onResetFilters={handleResetFilters}
            isOpenMobile={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />

          {/* MAIN RESULTS FEED */}
          <main className="flex-1 min-w-0 space-y-4">
            
            {/* Quick Price Intelligence Header Ticker */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0a0a0c] border border-white/5 p-3.5 rounded-xl text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">
                    {language === 'SV' ? 'Lägsta fyndpris' : 'Lowest Deal'}
                  </span>
                  <span className="text-[#3cbd82] font-black text-base">
                    {stats.min.toLocaleString('sv-SE')} kr
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">
                    {language === 'SV' ? 'Genomsnittspris' : 'Average Price'}
                  </span>
                  <span className="text-white font-bold text-base">
                    {stats.avg.toLocaleString('sv-SE')} kr
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">
                    {language === 'SV' ? 'Högsta pris' : 'Highest Price'}
                  </span>
                  <span className="text-zinc-400 font-bold text-base">
                    {stats.max.toLocaleString('sv-SE')} kr
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">
                    {language === 'SV' ? 'Identifierade kap' : 'Identified Deals'}
                  </span>
                  <span className="text-amber-400 font-black text-base flex items-center gap-1">
                    <span>🔥</span> {stats.bargains} {language === 'SV' ? 'st' : 'items'}
                  </span>
                </div>
              </div>
            )}

            {/* RESULTS LIST / EMPTY STATE */}
            {filteredResults.length === 0 ? (
              <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">
                    {language === 'SV' ? 'Inga annonser matchar filtren' : 'No listings match these filters'}
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    {language === 'SV'
                      ? 'Prova att bredda din sökning genom att rensa något av filtren för märke, storlek, färg eller prisspann.'
                      : 'Try broadening your search by clearing one of the filters for brand, size, color, or price range.'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-[#3cbd82] hover:bg-[#34a974] text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                  >
                    {language === 'SV' ? 'Återställ alla filter' : 'Reset all filters'}
                  </button>
                  {activeQuery && (
                    <button
                      onClick={() => handleSearchSubmit('')}
                      className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs border border-white/10 transition-all cursor-pointer"
                    >
                      {language === 'SV' ? 'Visa alla annonser' : 'Show all listings'}
                    </button>
                  )}
                </div>

                {/* Helpful suggestions */}
                <div className="pt-4 border-t border-white/5 max-w-md mx-auto">
                  <span className="text-[11px] text-zinc-500 font-mono block mb-2">
                    {language === 'SV' ? 'Eller prova att söka efter:' : 'Or try searching for:'}
                  </span>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {['Nike Dunk', 'Arc\'teryx', 'Acne Studios', 'Totême', 'Patagonia', 'Salomon XT-6'].map(sugg => (
                      <button
                        key={sugg}
                        type="button"
                        onClick={() => handleSearchSubmit(sugg)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredResults.map(item => {
                  const mLower = item.marketplace.toLowerCase();
                  const savings = item.originalPrice ? item.originalPrice - item.price : 0;
                  const discountPct = item.originalPrice ? Math.round((savings / item.originalPrice) * 100) : 0;

                  return (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      whileHover={{ 
                        y: -3,
                        scale: 1.004,
                        transition: { type: 'spring', stiffness: 450, damping: 28 } 
                      }}
                      whileTap={{ scale: 0.996 }}
                      className="bg-[#0a0a0c]/80 hover:bg-[#0f0f13] border border-white/5 hover:border-[#3cbd82]/30 rounded-xl p-4 transition-colors hover:shadow-[0_10px_28px_rgba(0,0,0,0.45)] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group cursor-default"
                    >
                      {/* Left: Thumbnail & Main Info */}
                      <div className="flex gap-4 items-center min-w-0 flex-1">
                        {/* Image with fallback container */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/10 flex items-center justify-center">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          {item.tag === 'Kap!' && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500 text-neutral-950 font-mono font-black text-[8px] uppercase tracking-wider shadow">
                              KAP!
                            </span>
                          )}

                          {/* Quick Favorite Heart on Thumbnail */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item);
                              trackEvent('toggle_favorite', { item_id: item.id, saved: !isFavorite(item.id) });
                            }}
                            className={`absolute top-1 right-1 p-1 rounded-md backdrop-blur-md transition-all cursor-pointer z-10 ${
                              isFavorite(item.id)
                                ? 'bg-rose-500 text-white shadow-md'
                                : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/80'
                            }`}
                            title={isFavorite(item.id) 
                              ? (language === 'SV' ? 'Sparad i favoriter' : 'Saved to favorites') 
                              : (language === 'SV' ? 'Spara i favoriter' : 'Save to favorites')}
                          >
                            <Heart className={`w-3 h-3 ${isFavorite(item.id) ? 'fill-white' : ''}`} />
                          </button>
                        </div>

                        {/* Text Details */}
                        <div className="space-y-1.5 min-w-0 flex-1">
                          {/* Unboxed Metadata Header */}
                          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                              mLower === 'vinted' ? 'bg-[#09B1BA]/15 text-[#09B1BA] border border-[#09B1BA]/25' :
                              mLower === 'tradera' ? 'bg-[#f07c00]/15 text-[#f07c00] border border-[#f07c00]/25' :
                              mLower === 'blocket' ? 'bg-[#004f9e]/15 text-[#2cb1fc] border border-[#004f9e]/25' :
                              mLower === 'plick' ? 'bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/25' :
                              mLower === 'sellpy' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
                              'bg-white/5 text-zinc-300'
                            }`}>
                              {item.marketplace}
                            </span>

                            <span className="font-bold text-[#3cbd82]">
                              {item.brand}
                            </span>
                            <span className="text-zinc-500" aria-hidden="true">·</span>
                            <span className="text-zinc-400 text-[11px]">
                              {item.condition}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="text-sm font-bold text-white group-hover:text-[#3cbd82] transition-colors truncate font-sans">
                            {item.title}
                          </h2>

                          {/* Description */}
                          <p className="text-xs text-zinc-400 line-clamp-1 font-light leading-relaxed">
                            {item.desc}
                          </p>

                          {/* Unboxed Separators for Size, Color, Seller info */}
                          <div className="flex items-center gap-2 pt-0.5 flex-wrap text-[11px] font-mono text-zinc-400">
                            <span>{language === 'SV' ? `Stl ${item.size}` : `Size ${item.size}`}</span>
                            <span className="text-zinc-600" aria-hidden="true">·</span>
                            <span className="flex items-center gap-1.5">
                              <span 
                                className="w-2 h-2 rounded-full inline-block" 
                                style={{ background: item.colorHex || '#fff' }} 
                              />
                              <span>{item.color}</span>
                            </span>
                            {item.sellerRating && (
                              <>
                                <span className="text-zinc-600" aria-hidden="true">·</span>
                                <span>{item.sellerRating}</span>
                              </>
                            )}
                            {item.finalScore && (
                              <>
                                <span className="text-zinc-600" aria-hidden="true">·</span>
                                <span className="text-[#3cbd82] font-bold">
                                  Deal Score: {item.finalScore}/100
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & CTA buttons */}
                      <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 gap-2">
                        <div className="text-left sm:text-right">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-white font-mono">
                              {item.price.toLocaleString('sv-SE')} kr
                            </span>
                            {item.originalPrice && (
                              <span className="text-xs text-zinc-500 line-through font-mono">
                                {item.originalPrice.toLocaleString('sv-SE')} kr
                              </span>
                            )}
                          </div>
                          {discountPct > 0 && (
                            <span className="text-[10px] text-[#3cbd82] font-mono font-bold block">
                              -{discountPct}% {language === 'SV' ? 'under nypris' : 'below retail'}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              toggleFavorite(item);
                              trackEvent('toggle_favorite', { item_id: item.id, saved: !isFavorite(item.id) });
                            }}
                            className={`px-2.5 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isFavorite(item.id)
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 hover:bg-rose-500/25'
                                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border-white/10'
                            }`}
                            title={isFavorite(item.id) 
                              ? (language === 'SV' ? 'Ta bort från sparade favoriter' : 'Remove from favorites') 
                              : (language === 'SV' ? 'Spara plagg i favoriter' : 'Save to favorites')}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorite(item.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span className="hidden sm:inline">
                              {isFavorite(item.id) 
                                ? (language === 'SV' ? 'Sparad' : 'Saved') 
                                : (language === 'SV' ? 'Spara' : 'Save')}
                            </span>
                          </button>

                          <button
                            onClick={() => setShareItem({
                              title: item.title,
                              price: item.price,
                              marketplace: item.marketplace,
                              link: item.url,
                              condition: item.condition
                            })}
                            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                            title={language === 'SV' ? 'Dela annons via Gmail' : 'Share listing via Gmail'}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#3cbd82] hover:text-neutral-950 text-white font-bold text-xs tracking-wide transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{language === 'SV' ? 'Visa annons' : 'View Listing'}</span>
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Share via Gmail Workspace modal */}
      {shareItem && (
        <WorkspaceShare
          listing={shareItem}
          onClose={() => setShareItem(null)}
          language={language}
        />
      )}
    </div>
  );
}
