import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Trash2, 
  ExternalLink, 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingDown, 
  SlidersHorizontal,
  CloudCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useFavorites } from '../FavoritesContext';
import { SavedFavoriteItem } from '../types';

export default function Favorites() {
  const { language } = useLanguage();
  const isEn = language === 'EN';
  const { favorites, removeFavorite, loading, user } = useFavorites();

  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [removedNotification, setRemovedNotification] = useState<string | null>(null);

  // Compute stats
  const totalValue = useMemo(() => {
    return favorites.reduce((sum, f) => sum + (f.price || 0), 0);
  }, [favorites]);

  const totalSavings = useMemo(() => {
    return favorites.reduce((sum, f) => {
      const orig = f.originalPrice || f.price;
      return sum + Math.max(0, orig - f.price);
    }, 0);
  }, [favorites]);

  // Filter items
  const filteredFavorites = useMemo(() => {
    return favorites.filter(item => {
      if (selectedMarketplace !== 'all' && item.marketplace.toLowerCase() !== selectedMarketplace.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesBrand = item.brand?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand) return false;
      }
      return true;
    });
  }, [favorites, selectedMarketplace, searchQuery]);

  const handleRemove = async (item: SavedFavoriteItem) => {
    await removeFavorite(item.id);
    setRemovedNotification(item.title);
    setTimeout(() => {
      setRemovedNotification(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold mb-3">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>{isEn ? 'FIREBASE CLOUD FAVORITES' : 'SPARADE FAVORITER (FIREBASE)'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
            {isEn ? 'Saved Listings & Favorites' : 'Dina sparade fynd & favoriter'}
          </h1>
          
          <p className="text-white/60 text-sm mt-1.5 font-light max-w-2xl">
            {isEn 
              ? 'Keep track of items you love across Tradera, Vinted, Sellpy, Blocket and Plick. Synced securely to your Firebase account.'
              : 'Håll koll på dina favoritplagg från Tradera, Vinted, Sellpy och Blocket. Allt synkat i realtid till ditt Firebase-konto.'}
          </p>
        </div>

        {/* Sync status badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/70 self-start md:self-end">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isEn ? 'Cloud Synced' : 'Molnsynkad'}</span>
          <span className="text-white/30">•</span>
          <span className="text-emerald-400 font-bold">{favorites.length} {isEn ? 'saved' : 'sparade'}</span>
        </div>
      </div>

      {/* Mini Stats Banner */}
      {favorites.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-[#0f0f13] border border-white/10 rounded-2xl p-4">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
              {isEn ? 'Total Saved Items' : 'Antal sparade annonser'}
            </span>
            <div className="text-2xl font-black text-white font-mono">
              {favorites.length} <span className="text-xs font-normal text-white/50">{isEn ? 'items' : 'st'}</span>
            </div>
          </div>

          <div className="bg-[#0f0f13] border border-white/10 rounded-2xl p-4">
            <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
              {isEn ? 'Total Secondhand Value' : 'Totalt andrahandsvärde'}
            </span>
            <div className="text-2xl font-black text-white font-mono">
              {totalValue.toLocaleString('sv-SE')} kr
            </div>
          </div>

          <div className="bg-[#0f0f13] border border-white/10 rounded-2xl p-4 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">
              {isEn ? 'Total Savings vs Retail' : 'Total besparing mot nypris'}
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono flex items-center gap-1.5">
              <TrendingDown className="w-5 h-5" />
              <span>{totalSavings.toLocaleString('sv-SE')} kr</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar inside Favorites */}
      {favorites.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0f0f13] border border-white/10 p-3 rounded-2xl">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Filter by brand or title...' : 'Filtrera på märke eller titel...'}
              className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Marketplace filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {['all', 'Tradera', 'Vinted', 'Sellpy', 'Blocket', 'Plick'].map(mkt => (
              <button
                key={mkt}
                onClick={() => setSelectedMarketplace(mkt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  selectedMarketplace === mkt
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5'
                }`}
              >
                {mkt === 'all' ? (isEn ? 'All platforms' : 'Alla sajter') : mkt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Removed notification toast */}
      <AnimatePresence>
        {removedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white/80 flex items-center justify-between"
          >
            <span>{isEn ? `Removed "${removedNotification}" from favorites.` : `Tog bort "${removedNotification}" från dina sparade favoriter.`}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {loading && favorites.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-white/50 font-mono">{isEn ? 'Loading favorites from Firebase...' : 'Hämtar dina favoriter från Firebase...'}</p>
        </div>
      ) : favorites.length === 0 ? (
        /* Empty State */
        <div className="bg-[#0e0e12] border border-white/10 rounded-3xl p-12 sm:p-16 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <Heart className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isEn ? 'No saved items yet' : 'Du har inga sparade favoriter än'}
            </h2>
            <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed">
              {isEn
                ? 'When browsing secondhand listings across Tradera, Vinted, Sellpy or Blocket, click the heart icon on any card to save it here.'
                : 'När du söker bland annonser från Tradera, Vinted, Sellpy eller Blocket, klicka på hjärtikonen på valfritt plagg för att spara det här.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/search"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{isEn ? 'Search Secondhand Listings' : 'Sök bland secondhand-annonser'}</span>
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{isEn ? 'Explore Homepage' : 'Till startsidan'}</span>
            </Link>
          </div>
        </div>
      ) : filteredFavorites.length === 0 ? (
        /* Filter Empty State */
        <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-white/70">
            {isEn ? 'No saved items match your current filter.' : 'Inga sparade annonser matchar din filtrering.'}
          </p>
          <button
            onClick={() => { setSelectedMarketplace('all'); setSearchQuery(''); }}
            className="text-xs text-emerald-400 hover:underline font-mono"
          >
            {isEn ? 'Reset filters' : 'Rensa filter'}
          </button>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map(item => {
            const mLower = item.marketplace.toLowerCase();
            const discountPct = item.originalPrice && item.originalPrice > item.price
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
              : 0;

            return (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                className="group bg-[#111115] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-colors relative"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden border-b border-white/5 flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />

                    {/* Marketplace badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider shadow-md ${
                        mLower === 'vinted' ? 'bg-[#09B1BA] text-white' :
                        mLower === 'tradera' ? 'bg-[#f07c00] text-white' :
                        mLower === 'blocket' ? 'bg-[#004f9e] text-white' :
                        mLower === 'plick' ? 'bg-[#f43f5e] text-white' :
                        mLower === 'sellpy' ? 'bg-amber-400 text-black' :
                        'bg-white/20 text-white'
                      }`}>
                        {item.marketplace}
                      </span>
                    </div>

                    {/* Remove favorite button */}
                    <button
                      onClick={() => handleRemove(item)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-rose-600 text-rose-400 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
                      title={isEn ? 'Remove from favorites' : 'Ta bort från sparade'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Discount badge */}
                    {discountPct > 0 && (
                      <div className="absolute bottom-3 left-3 bg-emerald-500 text-neutral-950 font-black font-mono text-[11px] px-2 py-0.5 rounded-md shadow-md">
                        -{discountPct}%
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
                      <span className="text-emerald-400 font-bold uppercase">{item.brand}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.size}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{item.condition}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Footer price & link */}
                <div className="p-4 pt-3 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div>
                    <div className="text-base font-black text-white font-mono tabular-nums">
                      {item.price.toLocaleString('sv-SE')} kr
                    </div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-white/40 line-through font-mono tabular-nums">
                        {item.originalPrice.toLocaleString('sv-SE')} kr
                      </span>
                    )}
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-neutral-950 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>{isEn ? 'View listing' : 'Se annons'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
