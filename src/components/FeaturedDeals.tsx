import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ExternalLink, ArrowRight, Tag, ShieldCheck, Search, Heart } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useFavorites } from '../FavoritesContext';
import { INITIAL_LISTINGS } from '../data/searchListingsData';
import { SearchListing } from '../types';

export default function FeaturedDeals() {
  const { language } = useLanguage();
  const isEn = language === 'EN';
  const { isFavorite, toggleFavorite } = useFavorites();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelSv: 'Alla fynd', labelEn: 'All Bargains' },
    { id: 'jackor', labelSv: '🧥 Jackor', labelEn: '🧥 Jackets' },
    { id: 'stickat', labelSv: '🧶 Stickat', labelEn: '🧶 Knitwear' },
    { id: 'vaskor', labelSv: '👜 Väskor', labelEn: '👜 Bags' },
    { id: 'denim', labelSv: '👖 Jeans & Denim', labelEn: '👖 Denim' },
    { id: 'skor', labelSv: '👟 Sneakers & Skor', labelEn: '👟 Shoes' },
  ];

  const displayedListings = useMemo(() => {
    let list = INITIAL_LISTINGS;
    if (activeCategory !== 'all') {
      list = list.filter(item => item.category === activeCategory);
    }
    // Take the top 8 best deals with largest discount or high value
    return list.slice(0, 8);
  }, [activeCategory]);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto scroll-mt-24" id="populara-fynd">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'CURATED DEALS TODAY' : 'HANDPLOCKADE KAP JUST NU'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {isEn ? 'Trending secondhand bargains' : 'Populära fynd från alla sajter'}
          </h2>
          <p className="text-white/60 text-sm md:text-base mt-2 max-w-2xl font-light">
            {isEn 
              ? 'Real active listings from Tradera, Vinted, Sellpy and Blocket compared side-by-side.'
              : 'Aktiva annonser från Tradera, Vinted, Sellpy och Blocket där du sparar upp till 70% mot nypris.'}
          </p>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group self-start md:self-end shrink-0"
        >
          <span>{isEn ? 'View all listings' : 'Visa alla annonser'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-white text-black font-bold shadow-lg shadow-white/10'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {isEn ? cat.labelEn : cat.labelSv}
          </button>
        ))}
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedListings.map(item => {
          const mLower = item.marketplace.toLowerCase();
          const discountPct = item.originalPrice 
            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
            : 0;

          return (
            <motion.article
              key={item.id}
              whileHover={{ 
                y: -6,
                transition: { type: 'spring', stiffness: 420, damping: 26 }
              }}
              whileTap={{ scale: 0.985 }}
              className="group bg-[#0e1013] border border-white/10 hover:border-emerald-500/40 rounded-2xl overflow-hidden transition-colors hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col cursor-default"
            >
              {/* Image Container with Zoom & Fallback */}
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-900 border-b border-white/5 flex items-center justify-center">
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

                {/* Marketplace Badge (top left) */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-md ${
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

                {/* Discount Badge & Favorite Button (top right) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  {discountPct > 0 && (
                    <div className="bg-emerald-500 text-neutral-950 font-black font-mono text-[11px] px-2 py-0.5 rounded-lg shadow-md">
                      -{discountPct}%
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite({
                        id: item.id,
                        title: item.title,
                        brand: item.brand,
                        price: item.price,
                        originalPrice: item.originalPrice,
                        marketplace: item.marketplace as any,
                        imageUrl: item.imageUrl,
                        condition: item.condition as any,
                        size: item.size,
                        url: item.directUrl || `/search?q=${encodeURIComponent(item.title)}`,
                        tag: discountPct > 30 ? 'Kap!' : 'Rättvist',
                        category: item.category,
                        sizeCategory: 'clothing',
                        color: 'Black',
                        desc: item.title
                      });
                    }}
                    className={`p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-md ${
                      isFavorite(item.id)
                        ? 'bg-rose-500 text-white shadow-rose-500/30'
                        : 'bg-black/60 hover:bg-black/80 text-white/70 hover:text-white'
                    }`}
                    title={isFavorite(item.id) ? (isEn ? 'Remove from favorites' : 'Ta bort från sparade') : (isEn ? 'Save to favorites' : 'Spara i favoriter')}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite(item.id) ? 'fill-white' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">{item.brand}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.size}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.condition}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                </div>

                {/* Price & Action Row */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-white font-mono tabular-nums">
                        {item.price.toLocaleString('sv-SE')} kr
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-white/40 line-through font-mono tabular-nums">
                          {item.originalPrice.toLocaleString('sv-SE')} kr
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Direct button */}
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/search?q=${encodeURIComponent(item.brand)}`}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      title={isEn ? `More from ${item.brand}` : `Fler från ${item.brand}`}
                    >
                      <Search className="w-3.5 h-3.5" />
                    </Link>
                    
                    {item.directUrl ? (
                      <a
                        href={item.directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-neutral-950 text-white text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <span>{isEn ? 'View' : 'Se annons'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        to={`/search?q=${encodeURIComponent(item.title)}`}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-neutral-950 text-white text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <span>{isEn ? 'View' : 'Se annons'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div className="mt-12 text-center">
        <Link
          to="/search"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-xl shadow-emerald-500/10 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <span>{isEn ? 'Search all 30+ verified listings' : 'Sök bland alla verifierade annonser'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
