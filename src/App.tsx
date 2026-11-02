import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ModusBot from './components/ModusBot';
import { LanguageProvider } from './LanguageContext';
import { FavoritesProvider } from './FavoritesContext';

// Import newly refactored pages
import Home from './pages/Home';
import Pro from './pages/Pro';
import Pricing from './pages/Pricing';
import Faq from './pages/Faq';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Account from './pages/Account';
import Trends from './pages/Trends';
import Search from './pages/Search';
import Favorites from './pages/Favorites';

// Import analytics setup
import { initAnalytics } from './lib/analytics';

// Scroll to top helper to simulate premium site loading behaviors
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    // Fire up analytics tracking tags dynamically
    initAnalytics();
  }, []);

  return (
    <LanguageProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen bg-[#050505] text-[#ededed] flex flex-col relative selection:bg-[#3cbd82]/20 selection:text-white">
            
            {/* Background radial soft light representing Scandinavian minimal style */}
            <div className="absolute top-0 inset-x-0 h-[640px] bg-gradient-to-b from-white/2 to-transparent pointer-events-none -z-10" />

            {/* Styled Repeak Header Navigation */}
            <Header />

            {/* Central Router Sourcing Hub */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/sok" element={<Navigate to="/search" replace />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/sparade" element={<Navigate to="/favorites" replace />} />
                <Route path="/trends" element={<Trends />} />
                <Route path="/pro" element={<Pro />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Solid green Scandinavian design footer */}
            <Footer />

            {/* Persistent AI Assistant */}
            <ModusBot />
          </div>
        </BrowserRouter>
      </FavoritesProvider>
    </LanguageProvider>
  );
}
