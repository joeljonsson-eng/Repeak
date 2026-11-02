import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, CreditCard, Bell, Settings, LogOut, 
  Trash2, Plus, Sparkles, Check, Bookmark, 
  History, Sliders, ShieldCheck, Mail, Search, ExternalLink, Heart 
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useFavorites } from '../FavoritesContext';
import { trackEvent } from '../lib/analytics';

interface SavedSearch {
  id: string;
  query: string;
  maxPrice: number;
  size: string;
  alerts: boolean;
}

export default function Account() {
  const { language, isLoggedIn, logout } = useLanguage();
  const { favorites, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'saved' | 'history' | 'settings'>('profile');

  // If not logged in, redirect to login page immediately
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Initial user setups
  const userName = 'Joel.jonsson';
  const userEmail = 'joel.jonsson@student.ksgyf.se';

  // Saved searches state
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    { id: '1', query: "Arc'teryx vintage shells", maxPrice: 1500, size: 'L', alerts: true },
    { id: '2', query: 'Acne Studios denim', maxPrice: 800, size: '31/32', alerts: true },
    { id: '3', query: 'Patagonia Synchilla', maxPrice: 600, size: 'M', alerts: false }
  ]);

  // History logs
  const [historyLogs, setHistoryLogs] = useState([
    { id: 'h1', query: 'vintage Stone Island knitwear', timestamp: '2026-06-03 16:45', resultsCount: 14, category: 'Knitwear' },
    { id: 'h2', query: 'Salomon XT-6 sneakers', timestamp: '2026-06-03 12:20', resultsCount: 8, category: 'Sneakers' },
    { id: 'h3', query: 'Our Legacy third cut jeans', timestamp: '2026-06-02 09:30', resultsCount: 4, category: 'Jeans' },
    { id: 'h4', query: 'Prada Nylon Sport shoulder bag', timestamp: '2026-06-01 18:15', resultsCount: 2, category: 'Bags' }
  ]);

  // Alert settings state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [securityShield, setSecurityShield] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleDeleteSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(item => item.id !== id));
    trackEvent('delete_saved_search', { search_id: id });
  };

  const handleToggleAlert = (id: string) => {
    setSavedSearches(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, alerts: !item.alerts };
      }
      return item;
    }));
  };

  const handleLogoutAction = () => {
    logout();
    trackEvent('user_logout_success', { source: 'account_dashboard' });
    navigate('/');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] py-12 relative font-sans">
      <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-white/2 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-12 relative z-10">
        
        {/* Welcome Header Section */}
        <div className="bg-[#0a0f0d] border border-white/10 rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl relative select-none">
              🧑‍🎓
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#3cbd82] border-2 border-[#050505] rounded-full" />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-mono tracking-widest text-[#3cbd82] uppercase bg-[#3cbd82]/10 border border-[#3cbd82]/20 px-2 py-0.5 rounded font-bold">
                {language === 'SV' ? 'AKTIV PRO-MEDLEM' : 'ACTIVE PRO MEMBER'}
              </span>
              <h1 className="text-xl md:text-2xl font-black font-sans text-white tracking-tight mt-1">{userName}</h1>
              <p className="text-xs text-white/40 mt-0.5 font-light">{userEmail}</p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleLogoutAction}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/10 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'SV' ? 'Logga ut' : 'Log Out'}</span>
            </button>
          </div>
        </div>

        {/* Multi-Tab Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Rails column */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 font-sans">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 px-4.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'profile'
                  ? 'bg-white/10 text-white shadow-md'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.01]'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#3cbd82]" />
              <span>{language === 'SV' ? 'Medlemskap' : 'Subscription'}</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2.5 px-4.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'favorites'
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-md'
                  : 'text-white/50 hover:text-rose-400 hover:bg-white/[0.01]'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
              <span>{language === 'SV' ? 'Sparade favoriter' : 'Saved Favorites'}</span>
              {favorites.length > 0 && (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-mono font-bold ml-auto">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2.5 px-4.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'saved'
                  ? 'bg-white/10 text-white shadow-md'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.01]'
              }`}
            >
              <Bookmark className="w-4 h-4 text-[#3cbd82]" />
              <span>{language === 'SV' ? 'Sparade sökningar' : 'Saved Searches'}</span>
              {savedSearches.length > 0 && (
                <span className="text-[10px] bg-white/10 border border-white/20 text-white px-2 py-0.5 rounded-full font-mono ml-auto">
                  {savedSearches.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2.5 px-4.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'history'
                  ? 'bg-white/10 text-white shadow-md'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.01]'
              }`}
            >
              <History className="w-4 h-4 text-[#3cbd82]" />
              <span>{language === 'SV' ? 'Sökhistorik' : 'Search History'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-4.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-white/10 text-white shadow-md'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.01]'
              }`}
            >
              <Sliders className="w-4 h-4 text-[#3cbd82]" />
              <span>{language === 'SV' ? 'Inställningar' : 'Settings'}</span>
            </button>
          </div>

          {/* Right Main Panel display column */}
          <div className="lg:col-span-9 bg-[#0a0a0c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl min-h-[400px]">
            
            {/* 1. OVERVIEW & SUBSCRIPTION TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6 text-left animate-in fade-in duration-200">
                <div className="border-b border-white/5 pb-4">
                  <h2 className="text-lg font-bold text-white font-sans">{language === 'SV' ? 'Abonnemang och Kontostatus' : 'Plan & Account Details'}</h2>
                  <p className="text-xs text-white/40 mt-1">{language === 'SV' ? 'Månadsvisa kvitton och fakturor för Repeak Pro' : 'Monthly billing coordinates and receipts for Repeak Pro'}</p>
                </div>

                {/* Status card */}
                <div className="bg-gradient-to-tr from-emerald-950/20 to-black border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#3cbd82]/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative">
                    <div className="text-[10px] font-mono tracking-widest text-[#3cbd82] uppercase mb-1 font-bold">
                      {language === 'SV' ? 'AKTIV MEDLEM' : 'BILLING STATUS'}
                    </div>
                    <h3 className="text-xl font-bold text-white font-sans">{language === 'SV' ? 'Pro Plus (Årlig)' : 'Pro Plus (Annual)'}</h3>
                    <p className="text-xs text-white/50 mt-1 font-light">
                      {language === 'SV' ? 'Nästa förnyelse: 24 december 2026 (756 kr/år)' : 'Next billing cycle: December 24, 2026 (756 SEK/yr)'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#3cbd82]/10 border border-[#3cbd82]/30 text-[#3cbd82] rounded-lg text-xs font-semibold relative select-none">
                    <Check className="w-4 h-4" />
                    <span>{language === 'SV' ? 'Betald via kort' : 'Auto-renew active'}</span>
                  </div>
                </div>

                {/* Plan indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="border border-white/5 rounded-xl p-4.5 text-xs bg-white/[0.01]">
                    <span className="text-white/40 block font-mono text-[9px] uppercase">{language === 'SV' ? 'SÖKBEVAKNINGAR' : 'WATCHLIST VOLUME'}</span>
                    <span className="text-base font-bold text-white block mt-1">3 / 5 {language === 'SV' ? 'Aktiva' : 'Active'}</span>
                    <span className="text-white/40 block mt-1 font-light">{language === 'SV' ? 'Du kan lägga till 2 bevakningar till' : 'You can compile 2 additional search monitors'}</span>
                  </div>
                  <div className="border border-white/5 rounded-xl p-4.5 text-xs bg-white/[0.01]">
                    <span className="text-white/40 block font-mono text-[9px] uppercase">{language === 'SV' ? 'NOTISHALSTIGHET' : 'ALERT LATENCY'}</span>
                    <span className="text-base font-bold text-[#3cbd82] block mt-1">Under 1 {language === 'SV' ? 'minut' : 'minute'}</span>
                    <span className="text-white/40 block mt-1 font-light">{language === 'SV' ? 'Blixtsnabb skanning dygnet runt' : 'Real-time database scraping active'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* FAVORITES / SAVED LISTINGS TAB */}
            {activeTab === 'favorites' && (
              <div className="space-y-6 text-left animate-in fade-in duration-200">
                <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      <span>{language === 'SV' ? 'Sparade favoriter' : 'Saved Favorites'}</span>
                      <span className="text-xs font-mono font-normal text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                        {favorites.length}
                      </span>
                    </h2>
                    <p className="text-xs text-white/40 mt-1">
                      {language === 'SV' 
                        ? 'Synkroniseras säkert i realtid via ditt Firebase-konto.' 
                        : 'Synchronized in real-time with your Firebase account.'}
                    </p>
                  </div>

                  <Link
                    to="/favorites"
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                  >
                    <span>{language === 'SV' ? 'Öppna galleri' : 'Open full view'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {favorites.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                    <Heart className="w-10 h-10 text-rose-500/30 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-white mb-1">
                      {language === 'SV' ? 'Inga sparade annonser än' : 'No saved listings yet'}
                    </h3>
                    <p className="text-xs text-white/40 max-w-sm mx-auto mb-4">
                      {language === 'SV' 
                        ? 'Klicka på hjärtikonen på valfri annons i sökresultaten för att spara den här.' 
                        : 'Click the heart icon on any listing in search results to save it here.'}
                    </p>
                    <Link
                      to="/search"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3cbd82] text-black text-xs font-bold hover:bg-[#3cbd82]/90 transition-all"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{language === 'SV' ? 'Upptäck plagg' : 'Discover Items'}</span>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={fav.imageUrl}
                            alt={fav.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover bg-neutral-900 border border-white/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-[#3cbd82] uppercase">
                                {fav.marketplace}
                              </span>
                              <span className="text-[10px] text-white/40 font-mono">
                                • {fav.brand}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white truncate hover:text-[#3cbd82] transition-colors">
                              {fav.title}
                            </h4>
                            <p className="text-xs font-mono font-black text-white/90 mt-0.5">
                              {fav.price.toLocaleString('sv-SE')} kr
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={fav.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1 border border-white/10 transition-colors"
                          >
                            <span>{language === 'SV' ? 'Se' : 'View'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => removeFavorite(fav.id)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title={language === 'SV' ? 'Ta bort' : 'Remove'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. SAVED SEARCHES TAB */}
            {activeTab === 'saved' && (
              <div className="space-y-6 text-left animate-in fade-in duration-200">
                <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-white font-sans">{language === 'SV' ? 'Sparade sökbevakningar' : 'Active Saved Alerts'}</h2>
                    <p className="text-xs text-white/40 mt-1">{language === 'SV' ? 'Ändra gränsvärden eller klicka bort föråldrade bevakningar.' : 'Configure pricing alerts and conditions'}</p>
                  </div>
                </div>

                {savedSearches.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                    <Bookmark className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-xs text-white/50">{language === 'SV' ? 'Inga sparade sökbevakningar ännu.' : 'No active alerts recorded yet.'}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {savedSearches.map((item) => (
                      <div key={item.id} className="py-4.5 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/search?q=${encodeURIComponent(item.query)}`}
                              className="text-sm font-bold text-white hover:text-[#3cbd82] transition-colors inline-flex items-center gap-1.5 group"
                              title={language === 'SV' ? 'Kör denna sökning nu' : 'Run this search now'}
                            >
                              <span>{item.query}</span>
                              <Search className="w-3 h-3 text-[#3cbd82] opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                            </Link>
                            <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white/60">
                              {language === 'SV' ? `Storlek: ${item.size}` : `Size: ${item.size}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[11px] text-white/45 font-light">
                            <span>{language === 'SV' ? `Maxpris: ${item.maxPrice} kr` : `Max Price: ${item.maxPrice} SEK`}</span>
                            <button
                              onClick={() => handleToggleAlert(item.id)}
                              className={`flex items-center gap-1 text-[10px] font-mono uppercase font-bold px-1.5 py-0.25 rounded border transition-all ${
                                item.alerts
                                  ? 'bg-[#3cbd82]/5 border-[#3cbd82]/20 text-[#3cbd82]'
                                  : 'bg-white/5 border-white/10 text-white/40'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${item.alerts ? 'bg-[#3cbd82]' : 'bg-white/20'}`} />
                              <span>{item.alerts ? (language === 'SV' ? 'Notiser PÅ' : 'ALERTS ON') : (language === 'SV' ? 'Notiser AV' : 'ALERTS MUTED')}</span>
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteSearch(item.id)}
                          className="p-2 text-white/35 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                          title={language === 'SV' ? 'Ta bort sökbevakning' : 'Delete alert'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. SEARCH HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="space-y-6 text-left animate-in fade-in duration-200">
                <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-white font-sans">{language === 'SV' ? 'Sökhistorik' : 'Search Query Logs'}</h2>
                    <p className="text-xs text-white/40 mt-1">{language === 'SV' ? 'Se tidigare sökningar genomförda på ditt konto.' : 'Browse past comparison searches executed'}</p>
                  </div>
                  <button
                    onClick={() => setHistoryLogs([])}
                    className="text-[10px] font-mono font-bold text-white/30 hover:text-white uppercase transition-colors"
                  >
                    {language === 'SV' ? 'Rensa historik' : 'Clear logs'}
                  </button>
                </div>

                {historyLogs.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                    <History className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-xs text-white/50">{language === 'SV' ? 'Din sökhistorik är tom.' : 'No historic search queries recorded.'}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="border-b border-white/5 text-[9px] font-mono uppercase tracking-widest text-white/40">
                          <th className="py-3 px-1 font-bold">{language === 'SV' ? 'SÖKORD' : 'QUERY'}</th>
                          <th className="py-3 px-1 font-bold">{language === 'SV' ? 'KATEGORI' : 'CATEGORY'}</th>
                          <th className="py-3 px-1 font-bold text-center">{language === 'SV' ? 'RESULTAT' : 'HITS'}</th>
                          <th className="py-3 px-1 font-bold text-right">{language === 'SV' ? 'TIDPUNKT' : 'TIMESTAMP'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs text-white/80">
                        {historyLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-white/[0.01]">
                            <td className="py-3 px-1 font-bold text-white">
                              <Link
                                to={`/search?q=${encodeURIComponent(log.query)}`}
                                className="hover:text-[#3cbd82] transition-colors inline-flex items-center gap-1 group"
                                title={language === 'SV' ? 'Upprepa denna sökning' : 'Repeat this search'}
                              >
                                <span>{log.query}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 text-[#3cbd82] transition-opacity" />
                              </Link>
                            </td>
                            <td className="py-3 px-1 text-white/50">{log.category}</td>
                            <td className="py-3 px-1 text-center font-mono font-bold text-[#3cbd82]">{log.resultsCount}</td>
                            <td className="py-3 px-1 text-right text-white/40 font-mono text-[11px]">{log.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. SETTINGS CONTROL TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6 text-left animate-in fade-in duration-200">
                <div className="border-b border-white/5 pb-4">
                  <h2 className="text-lg font-bold text-white font-sans">{language === 'SV' ? 'Kontoinställningar' : 'Platform Configurations'}</h2>
                  <p className="text-xs text-white/40 mt-1">{language === 'SV' ? 'Konfigurera dina meddelanden och säkerhetsfilter.' : 'Personalize notification rules and compliance'}</p>
                </div>

                <div className="space-y-4">
                  {/* Toggle 1 */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5">
                    <div className="space-y-1 pr-4">
                      <h4 className="text-xs font-bold text-white">{language === 'SV' ? 'E-postnotiser vid kap-fynd' : 'Send Fast Bargain Notifications'}</h4>
                      <p className="text-[10px] text-white/50 font-light leading-relaxed">
                        {language === 'SV' ? 'Skicka e-postnotiser omedelbart när ett sparad sökning matchar ett kap på Tradera/Plick.' : 'Dispatch instant emails when an indexed item deal-metric drops below the average.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={`w-10 h-6.5 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${emailAlerts ? 'bg-[#3cbd82]' : 'bg-white/10'}`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full bg-[#050505] transition-transform ${emailAlerts ? 'translate-x-3.5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Toggle 2 */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5">
                    <div className="space-y-1 pr-4">
                      <h4 className="text-xs font-bold text-white">{language === 'SV' ? 'AI Rep-skydd & Äkthetsfiltrering' : 'AI Replicas Shielding'}</h4>
                      <p className="text-[10px] text-white/50 font-light leading-relaxed">
                        {language === 'SV' ? 'Filtrera bort annonser med hög förfalskningsrisk och flagga mönstermisstankar direkt.' : 'Omit listings displaying safety anomalies or low-quality seller scorecards.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSecurityShield(!securityShield)}
                      className={`w-10 h-6.5 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${securityShield ? 'bg-[#3cbd82]' : 'bg-white/10'}`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full bg-[#050505] transition-transform ${securityShield ? 'translate-x-3.5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Toggle 3 */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5">
                    <div className="space-y-1 pr-4">
                      <h4 className="text-xs font-bold text-white">{language === 'SV' ? 'Veckovis andrahandsanalys' : 'Weekly Resale Trend Insights'}</h4>
                      <p className="text-[10px] text-white/50 font-light leading-relaxed">
                        {language === 'SV' ? 'Sammanställning av de mest eftertraktade varumärkenas prisutveckling levererad till din mejl.' : 'Compile most-wanted wardrobe valuations and average deltas delivered to inbox.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setWeeklyDigest(!weeklyDigest)}
                      className={`w-10 h-6.5 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${weeklyDigest ? 'bg-[#3cbd82]' : 'bg-white/10'}`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full bg-[#050505] transition-transform ${weeklyDigest ? 'translate-x-3.5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
