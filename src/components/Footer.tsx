import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, ArrowUp } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Footer() {
  const { language, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#399a6f] text-neutral-950 py-16 px-6 relative mt-auto border-t border-emerald-800/10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start mb-12">
          
          {/* Brand/mission column */}
          <div className="md:col-span-6 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                <Shirt className="w-4.5 h-4.5 text-[#3cbd82]" />
              </div>
              <span className="text-xl font-bold font-display text-white uppercase tracking-wider block">
                Repeak
              </span>
            </div>
            
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              {t.footer.desc}
            </p>

            {/* Back to top circular button */}
            <div className="pt-2">
              <button
                onClick={scrollToTop}
                title={language === 'SV' ? 'Scrolla till toppen' : 'Scroll to top'}
                className="w-10 h-10 rounded-full bg-black hover:bg-neutral-950 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-emerald-950/20 active:scale-95 group focus:outline-none"
              >
                <ArrowUp className="w-4 h-4 text-white group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Product Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase font-mono">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-white/80">
              <li>
                <Link to="/pricing" className="hover:text-black transition-colors">
                  {language === 'SV' ? 'Priser' : 'Pricing'}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-black transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/pro" className="hover:text-black transition-colors">
                  Repeak Pro
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase font-mono">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-white/80">
              <li>
                <Link to="/about" className="hover:text-black transition-colors">
                  {language === 'SV' ? 'Om oss' : 'About'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-black transition-colors">
                  {language === 'SV' ? 'Kontakt' : 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase font-mono">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-white/80">
              <li>
                <Link to="/privacy" className="hover:text-black transition-colors">
                  {language === 'SV' ? 'Integritetspolicy' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-black transition-colors">
                  {language === 'SV' ? 'Användarvillkor' : 'Terms of Service'}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower row */}
        <div className="border-t border-white/10 pt-8 text-center md:text-left text-[11px] font-mono text-white/60 flex flex-col md:flex-row justify-between items-center gap-4 font-semibold">
          <span>
            {t.footer.copyright}
          </span>
          <span className="text-white/40 font-light">
            {t.footer.swedishDesign}
          </span>
        </div>
      </div>
    </footer>
  );
}
