import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shirt, User, LogOut, Settings, CreditCard, Bell, Key, X, Menu, Sun, Moon, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useFavorites } from '../FavoritesContext';
import { trackEvent } from '../lib/analytics';

export default function Header() {
  const { language, setLanguage, t, isLoggedIn, setIsLoggedIn, logout } = useLanguage();
  const { favorites } = useFavorites();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Theme support
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: theme }));
  }, [theme]);

  const handleLogoutClick = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    trackEvent('user_logout_success');
    navigate('/');
  };

  const handleLinkClick = (name: string) => {
    setIsMobileMenuOpen(false);
    trackEvent('navigate_link', { name });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0f0d]/90 border-b border-white/5 transition-all duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between relative">
        
        {/* Repeak Logo */}
        <Link 
          to="/" 
          onClick={() => handleLinkClick('logo')}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#3cbd82] flex items-center justify-center shadow-lg shadow-emerald-920/10 group-hover:scale-105 transition-transform">
            <Shirt className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight leading-none block">Repeak</span>
          </div>
        </Link>

        {/* Central / Right Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/70">
          <Link 
            to="/" 
            onClick={() => handleLinkClick('home')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {language === 'SV' ? 'Hem' : 'Home'}
          </Link>
          <Link 
            to="/search" 
            onClick={() => handleLinkClick('search')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {language === 'SV' ? 'Sök' : 'Search'}
          </Link>
          <Link 
            to="/" 
            onClick={() => {
              handleLinkClick('fashion-evaluator');
              setTimeout(() => {
                const evalEl = document.getElementById('vardera');
                if (evalEl) evalEl.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 font-semibold"
          >
            {language === 'SV' ? 'Värdera' : 'Valuation'}
          </Link>
          <Link 
            to="/trends" 
            onClick={() => handleLinkClick('trends')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {language === 'SV' ? 'Prisindex' : 'Trends & Index'}
          </Link>
          <Link 
            to="/pro" 
            onClick={() => handleLinkClick('pro')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 font-semibold text-amber-300/90"
          >
            Pro
          </Link>
          <Link 
            to="/pricing" 
            onClick={() => handleLinkClick('pricing')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {language === 'SV' ? 'Priser' : 'Pricing'}
          </Link>
          <Link 
            to="/about" 
            onClick={() => handleLinkClick('about')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {language === 'SV' ? 'Om oss' : 'About'}
          </Link>
        </nav>

        {/* Right Nav Options (User + Language + Hamburger) */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Favorites quick icon button */}
          <Link
            to="/favorites"
            onClick={() => handleLinkClick('favorites')}
            className="relative p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/40 text-white hover:text-rose-400 cursor-pointer transition-all flex items-center justify-center focus:outline-none"
            title={language === 'SV' ? `Sparade favoriter (${favorites.length})` : `Saved favorites (${favorites.length})`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-black flex items-center justify-center shadow-md">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              const nextTheme = theme === 'dark' ? 'light' : 'dark';
              setTheme(nextTheme);
              trackEvent('theme_toggle', { theme: nextTheme });
            }}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-[#3cbd82]/10 hover:border-[#3cbd82]/40 text-white hover:text-[#3cbd82] cursor-pointer transition-all flex items-center justify-center focus:outline-none"
            title={language === 'SV' ? (theme === 'dark' ? 'Byt till ljust läge' : 'Byt till mörkt läge') : (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" style={{ animationDuration: '6s' }} />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            )}
          </button>

          {/* Language Selector badge */}
          <button
            onClick={() => setLanguage(language === 'SV' ? 'EN' : 'SV')}
            className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-[#3cbd82]/10 hover:border-[#3cbd82]/40 text-[10px] font-black text-white hover:text-[#3cbd82] cursor-pointer transition-all leading-none font-mono uppercase tracking-widest select-none"
            title={language === 'SV' ? 'Switch to English' : 'Byt till Svenska'}
          >
            {language}
          </button>

          {/* User Status Options */}
          <div className="relative hidden sm:block">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  id="my-account-btn"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-xs text-white/90 cursor-pointer transition-all select-none focus:outline-none"
                >
                  <User className="w-3.5 h-3.5 text-white/70" />
                  <span className="font-medium text-[11px]">Joel.jonsson</span>
                </button>

                {/* FloatingDropdown */}
                {isDropdownOpen && (
                  <div 
                    id="my-account-dropdown"
                    className="absolute right-0 top-full mt-3 w-72 bg-[#090e0c] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md z-[100] animate-in fade-in slide-in-from-top-2 duration-200 text-left"
                  >
                    <div className="border-b border-white/5 pb-3 mb-3">
                      <div className="text-[10px] font-mono tracking-widest text-[#3cbd82] uppercase mb-1 font-bold">
                        {language === 'SV' ? 'AKTIV PRO-MEDLEM' : 'ACTIVE PRO MEMBER'}
                      </div>
                      <h4 className="font-sans font-bold text-white text-sm">Joel.jonsson</h4>
                      <p className="text-[10px] text-white/40 font-medium">joel.jonsson@student.ksgyf.se</p>
                    </div>

                    <ul className="space-y-2 mb-4">
                      <li>
                        <Link 
                          to="/favorites" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center justify-between text-xs text-white/70 hover:text-white py-1 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500/30' : 'text-rose-400'}`} />
                            <span>{language === 'SV' ? 'Sparade annonser' : 'Saved Listings'}</span>
                          </div>
                          {favorites.length > 0 && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                              {favorites.length}
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/account" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 text-xs text-white/70 hover:text-white py-1 transition-colors"
                        >
                          <CreditCard className="w-4 h-4 text-[#3cbd82]" />
                          <span>{language === 'SV' ? 'Mitt konto' : 'My Account'}</span>
                        </Link>
                      </li>
                      <li className="flex items-center gap-2.5 text-xs text-white/70 py-1">
                        <Bell className="w-4 h-4 text-[#3cbd82]" />
                        <span>{language === 'SV' ? '3/5 Aktiva bevakningar' : '3/5 Active alerts'}</span>
                      </li>
                      <li>
                        <Link 
                          to="/account" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 text-xs text-white/70 hover:text-white py-1 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-white/40" />
                          <span>{language === 'SV' ? 'Kontoinställningar' : 'Settings'}</span>
                        </Link>
                      </li>
                    </ul>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogoutClick}
                      id="logout-btn"
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/10 text-xs font-bold transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{language === 'SV' ? 'Logga ut' : 'Log Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                id="login-btn"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#152e22] text-[#3cbd82] border border-[#3cbd82]/20 hover:bg-[#204935] text-xs font-bold cursor-pointer transition-all"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{language === 'SV' ? 'Logga in' : 'Log In'}</span>
              </Link>
            )}
          </div>

          {/* Upgrade CTA button */}
          <Link
            to="/pro"
            onClick={() => handleLinkClick('kom-igång')}
            className="hidden sm:inline-block px-4 py-2 hover:opacity-95 rounded-full bg-[#3cbd82] text-[#091a11] text-xs font-bold transition-all shadow-[0_4px_12px_rgba(59,189,130,0.15)] cursor-pointer"
          >
            {language === 'SV' ? 'Prova Pro' : 'Try Pro'}
          </Link>

          {/* Mobile Hamburger menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[#3cbd82]/40"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#3cbd82]" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* MOBILE DRAWER DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#090e0c]/98 border-b border-white/10 shadow-2xl backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <div className="px-5 py-6 space-y-4 text-left flex flex-col font-sans">
            
            <Link 
              to="/" 
              onClick={() => handleLinkClick('home')}
              className="text-sm font-bold text-white/70 hover:text-white py-2 border-b border-white/5 transition-colors uppercase tracking-wider"
            >
              {language === 'SV' ? 'Hem' : 'Home'}
            </Link>

            <Link 
              to="/search" 
              onClick={() => handleLinkClick('search')}
              className="text-sm font-bold text-white/70 hover:text-white py-2 border-b border-white/5 transition-colors uppercase tracking-wider"
            >
              {language === 'SV' ? 'Sök' : 'Search'}
            </Link>

            <Link 
              to="/favorites" 
              onClick={() => {
                handleLinkClick('favorites');
                setIsMobileMenuOpen(false);
              }}
              className="text-sm font-bold text-rose-300 hover:text-rose-200 py-2 border-b border-white/5 transition-colors uppercase tracking-wider flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
                <span>{language === 'SV' ? 'Sparade favoriter' : 'Saved Favorites'}</span>
              </div>
              {favorites.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-mono font-bold">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link 
              to="/" 
              onClick={() => {
                handleLinkClick('fashion-evaluator');
                setIsMobileMenuOpen(false);
                setTimeout(() => {
                  const evalEl = document.getElementById('vardera');
                  if (evalEl) evalEl.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-bold text-emerald-300 hover:text-emerald-200 py-2 border-b border-white/5 transition-colors uppercase tracking-wider flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {language === 'SV' ? 'Värdera plagg' : 'Wardrobe Valuation'}
            </Link>

            <Link 
              to="/pro" 
              onClick={() => handleLinkClick('pro')}
              className="text-sm font-bold text-amber-400 hover:text-amber-300 py-2 border-b border-white/5 transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              PRO ☀️
            </Link>

            <Link 
              to="/pricing" 
              onClick={() => handleLinkClick('pricing')}
              className="text-sm font-bold text-white/70 hover:text-white py-2 border-b border-white/5 transition-colors uppercase tracking-wider"
            >
              {language === 'SV' ? 'Priser' : 'Pricing'}
            </Link>

            <Link 
              to="/faq" 
              onClick={() => handleLinkClick('faq')}
              className="text-sm font-bold text-white/70 hover:text-white py-2 border-b border-white/5 transition-colors uppercase tracking-wider"
            >
              FAQ
            </Link>

            <Link 
              to="/about" 
              onClick={() => handleLinkClick('about')}
              className="text-sm font-bold text-white/70 hover:text-white py-2 border-b border-white/5 transition-colors uppercase tracking-wider"
            >
              {language === 'SV' ? 'Om oss' : 'About'}
            </Link>

            {/* Mobile authentication items */}
            {isLoggedIn ? (
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2 px-1 py-1">
                  <User className="w-4 h-4 text-[#3cbd82]" />
                  <span className="text-xs font-semibold text-white/95">Joel.jonsson</span>
                </div>
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xs font-bold text-white/60 hover:text-white pl-6"
                >
                  {language === 'SV' ? 'Mitt konto' : 'My Account'}
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-950/25 text-red-400 border border-red-500/10 text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'SV' ? 'Logga ut' : 'Log Out'}</span>
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#152e22] text-[#3cbd82] border border-[#3cbd82]/20 font-bold text-xs"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{language === 'SV' ? 'Logga in' : 'Log In'}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
