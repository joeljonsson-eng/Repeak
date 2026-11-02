import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, ShieldCheck, Mail, LineChart, Cpu, 
  Grid, Bell, Sparkles, Plus, Check, ArrowRight, Shield 
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import FreeTrial from '../components/FreeTrial';
import { trackEvent } from '../lib/analytics';

export default function Pro() {
  const { language } = useLanguage();
  const [activeFeature, setActiveFeature] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const benefits = [
    {
      icon: Zap,
      title: language === 'SV' ? 'Snabbare än alla andra' : 'Faster than anyone else',
      desc: language === 'SV' 
        ? 'Vårt index uppdateras dygnet runt. Få notiser om nypublicerade kap sekunder efter att de lagts upp på Plick eller Tradera.' 
        : 'Our index updates round the clock. Get alerts about new bargains seconds after they are posted on Plick or Tradera.'
    },
    {
      icon: ShieldCheck,
      title: language === 'SV' ? 'Autentiserings-skydd' : 'Authentication Shield',
      desc: language === 'SV' 
        ? 'Vår AI skannar bilder och beskrivningar efter varningsflaggor för att upptäcka och sortera bort potentiella förfalskningar.' 
        : 'Our AI scans images and product copy for red flags to filter out potential counterfeits and fraudulent listings.'
    },
    {
      icon: LineChart,
      title: language === 'SV' ? 'Historiskt prisindex' : 'Historical Price Index',
      desc: language === 'SV' 
        ? 'Se exakt vad liknande plagg har sålts för under de senaste 24 månaderna för att alltid bjuda eller prissätta rätt.' 
        : 'See exactly what similar fashion pieces have sold for over the last 24 months to always bid and price correctly.'
    }
  ];

  const features = [
    {
      title: language === 'SV' ? 'Direktnotiser via Gmail' : 'Instant Email Alerts',
      desc: language === 'SV' 
        ? 'Du slipper uppdatera flödena. Ange dina drömplagg, önskat skick och maxpris så skickar vi e-post direkt när en matchning dyker upp.' 
        : 'Skip the manual refreshing. State your dream pieces, desired condition, and maximum budget, and we will email you the split second a match is indexed.',
      badge: 'PRO EXKLUSIV',
      details: language === 'SV' ? 'Leveranstid: < 50 sekunder' : 'Delivery latency: < 50 seconds'
    },
    {
      title: language === 'SV' ? 'Obegränsad AI-skanning' : 'Unlimited AI Valuation',
      desc: language === 'SV' 
        ? 'Värdera obegränsat antal plagg per månad. Vår neurala motor läser av märken, passformer och slitage direkt på dina foton.' 
        : 'Price and value an infinite amount of clothing items per month. Our neural engine recognizes brands, fits, and wear directly from uploaded images.',
      badge: 'GRATIS TRIAL',
      details: language === 'SV' ? '99.4% precision i norden' : '99.4% precision in Nordic markets'
    },
    {
      title: language === 'SV' ? 'Smarta sökfilter' : 'Smart Search Filters',
      desc: language === 'SV' 
        ? 'Sök och filtrera på alla plattformar samtidigt efter slitage, färgton, exakt storlek eller säljarens historiska omdömen.' 
        : 'Search and filter across all synchronized platforms at once by condition, colorway, size clusters, or seller feedback history.',
      badge: 'STANDARD',
      details: language === 'SV' ? 'Spara hundratals sökningar' : 'Save hundreds of search patterns'
    }
  ];

  const handleUpgrade = () => {
    trackEvent('click_pro_upgrade_checkout', {
      source: 'pro_upgrade_cta',
      tier: 'pro_annual'
    });
    
    setToastMessage(
      language === 'SV'
        ? 'Ditt fiktiva PRO-konto håller på att uppgraderas! Tack för att du testar Repeak.'
        : 'Your simulated PRO account is being upgraded! Thank you for testing Repeak.'
    );

    // Auto-dismiss toast in 5 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] py-12 relative overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#3cbd82]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-20 text-center relative z-10">
        <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#3cbd82] uppercase bg-[#153a2a]/40 border border-[#3cbd82]/20 px-3 py-1.5 rounded-full font-black mb-6 inline-block">
          REPEAK PRO PLATFORM
        </span>
        <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          {language === 'SV' ? 'Sluta leta. Börja fynda som ett proffs.' : 'Stop searching. Start scouting like a pro.'}
        </h1>
        <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto mb-8 font-light relative leading-relaxed">
          {language === 'SV' 
            ? 'Repeak Pro samlar de mest kraftfulla algoritmerna, omedelbara notiser och historiska prisanalyser i ett supersnabbt gränssnitt.' 
            : 'Repeak Pro packs state-of-the-art resale web indexes, real-time alerts, and historical statistics inside a lightning-fast interface.'}
        </p>

        {/* Dynamic Trial CTA Button */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#free-trial"
            className="px-6 py-3.5 rounded-xl bg-[#3cbd82] text-black font-bold hover:bg-[#32ad75] active:scale-95 transition-all text-xs flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <span>{language === 'SV' ? 'Aktivera 7 dagars provperiod' : 'Activate 7-Day Trial'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={handleUpgrade}
            className="px-6 py-3.5 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 active:scale-95 border border-white/10 transition-all text-xs cursor-pointer"
          >
            {language === 'SV' ? 'Uppgradera direkt' : 'Upgrade Instantly'}
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {language === 'SV' ? 'Varför Repeak Pro dominerar' : 'Why Repeak Pro Dominates'}
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-2">
            {language === 'SV' ? 'Designat för samlare, återförsäljare och smarta konsumenter.' : 'Architected for collectors, vintage resellers, and smart shoppers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6.5 hover:border-white/10 transition-all shadow-xl hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#3cbd82]/10 border border-[#3cbd82]/20 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-[#3cbd82]" />
                </div>
                <h3 className="text-base font-bold text-white mb-2.5 font-sans">{benefit.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Showcase Panel */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 relative z-10 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left panel Selection list */}
          <div className="lg:col-span- così lg:col-span-5 space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-6">
              {language === 'SV' ? 'Premiumfunktioner för modeexperter' : 'Premium Features for Fashion Experts'}
            </h2>
            <div className="space-y-3">
              {features.map((feat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFeature(idx)}
                  className={`w-full text-left p-4.5 rounded-xl border transition-all cursor-pointer ${
                    activeFeature === idx
                      ? 'bg-white/5 border-[#3cbd82]/40 text-white'
                      : 'bg-transparent border-white/5 text-white/55 hover:text-white/80 hover:bg-white/[0.01]'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{feat.title}</span>
                    <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 bg-white/5 border border-white/10 rounded uppercase font-bold">
                      {feat.badge}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-80 font-light">{feat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel Visualizer */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 relative min-h-[340px] flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Header info mock */}
            <div className="border-b border-white/5 pb-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3cbd82] animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-[#3cbd82] uppercase font-bold">
                  {features[activeFeature].badge} STATUS
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/40">
                {features[activeFeature].details}
              </span>
            </div>

            {/* Simulated Live View based on Selection */}
            <div className="flex-1 flex flex-col justify-center text-center px-4 py-8 relative">
              {activeFeature === 0 && (
                <div className="space-y-4 animate-in fade-in-50 duration-300">
                  <div className="w-12 h-12 bg-[#3cbd82]/10 border border-[#3cbd82]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-[#3cbd82]" />
                  </div>
                  <h4 className="text-white text-base font-bold font-sans">
                    {language === 'SV' ? 'Matchning skickad till joel.jonsson@gmail.com' : 'Match dispatched to joel.jonsson@gmail.com'}
                  </h4>
                  <div className="max-w-xs mx-auto bg-black/60 border border-white/5 rounded-lg p-3 text-left text-[11px] space-y-1.5">
                    <div className="text-white/40 font-mono">FRÅN: alerting@repeak.se</div>
                    <div className="text-white font-semibold">"FYND: Vintage Prada Nylon Bag för 650 kr hittad på Plick"</div>
                    <div className="text-[#3cbd82] font-mono font-bold">PRISAVVIKELSE: -55% under snittvärde</div>
                  </div>
                </div>
              )}
              {activeFeature === 1 && (
                <div className="space-y-4 animate-in fade-in-50 duration-300">
                  <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Cpu className="w-6 h-6 text-amber-400" />
                  </div>
                  <h4 className="text-white text-base font-bold">
                    {language === 'SV' ? 'Skeningskapacitet påslagen' : 'Unlimited Valuation Active'}
                  </h4>
                  <div className="max-w-xs mx-auto bg-black/60 border border-white/5 rounded-lg p-3 text-left text-[11px] font-mono space-y-1 text-white/80">
                    <p>&gt; Model: repeak-ai-lens-v4.2</p>
                    <p>&gt; Confidence score: 99.1%</p>
                    <p>&gt; Suggested retail value: 1,840 SEK</p>
                    <p className="text-[#3cbd82]">&gt; Status: High authenticity index</p>
                  </div>
                </div>
              )}
              {activeFeature === 2 && (
                <div className="space-y-4 animate-in fade-in-50 duration-300">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Grid className="w-6 h-6 text-white/80" />
                  </div>
                  <h4 className="text-white text-base font-bold">
                    {language === 'SV' ? 'Flerdimensionella sökportar' : 'Multidimensional Search Gates'}
                  </h4>
                  <p className="text-xs text-white/50 max-w-sm mx-auto">
                    {language === 'SV' 
                      ? 'Skapa sökfilter anpassade till återförsäljare. Filtrera bort oseriösa säljare, sortera efter fraktpris eller välj endast varor med verifierat skick.'
                      : 'Establish customized scouting gates. Automatically omit low-rated sellers, filter out invalid locations, or display pristine condition listings only.'}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom visual guide */}
            <div className="border-t border-white/5 pt-4 text-center">
              <span className="text-[10px] text-white/30 font-mono">
                {language === 'SV' ? 'Repeak Pro levererar mätbar framgång varje dag.' : 'Repeak Pro powers verified metrics daily.'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Free Trial chronological steps */}
      <FreeTrial />

      {/* Upgrade CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 relative z-10 border-t border-white/5 text-center">
        <div className="bg-gradient-to-r from-emerald-950/20 to-black border border-white/10 rounded-3xl p-10 md:p-16 max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
          {/* Subtle orb background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#3cbd82]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black font-sans text-white tracking-tight">
              {language === 'SV' ? 'Redo att lyfta dina sökningar?' : 'Ready to Elevate Your Search?'}
            </h2>
            <p className="text-white/60 text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light">
              {language === 'SV' 
                ? 'Anslut dig till tusentals andra modefantaster och andrahandsentreprenörer i norden. Få full tillgång till alla premium-verktyg nu.' 
                : 'Join thousands of collectors, designers, and fashion enthusiasts across Europe. Get complete unrestricted access right now.'}
            </p>
            <div className="pt-4">
              <button
                onClick={handleUpgrade}
                className="px-8 py-4 rounded-full bg-[#3cbd82] text-black font-extrabold hover:bg-[#3ec48a] active:scale-95 transition-all text-xs flex items-center gap-2 mx-auto shadow-xl shadow-emerald-400/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>{language === 'SV' ? 'Uppgradera till Pro Plus' : 'Upgrade to Pro Plus'}</span>
              </button>
              <p className="text-[10px] text-white/35 font-mono mt-3">
                {language === 'SV' ? 'Pausa eller avsluta när du vill. Inga dolda kostnader.' : 'Pause or cancel anytime. Zero extra fees.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating beautiful success toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-[10%] right-[10%] sm:left-auto sm:right-8 sm:max-w-md bg-gradient-to-br from-[#121915] to-[#0a0f0d] border-2 border-[#3cbd82] text-white p-4 rounded-xl shadow-2xl z-50 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-[#3cbd82]/10 border border-[#3cbd82]/30 flex items-center justify-center shrink-0 text-[#3cbd82]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-xs uppercase font-mono font-black tracking-wider text-[#3cbd82]">Repeak Pro</span>
              <p className="text-xs text-white/90 leading-relaxed font-light">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/40 hover:text-white transition-all cursor-pointer select-none text-xs ml-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
