import { motion } from 'motion/react';
import { Sparkles, ArrowDown, ShieldAlert } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../LanguageContext';

interface PricingHeroProps {
  isAnnual: boolean;
  setIsAnnual: (val: boolean) => void;
}

export default function PricingHero({ isAnnual, setIsAnnual }: PricingHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden text-center max-w-7xl mx-auto">
      {/* Decorative radial gradients - very subtle and premium */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Dynamic Floating particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute w-1.5 h-1.5 bg-sky-400 rounded-full top-20 left-[15%] animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full top-48 right-[18%] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute w-2 h-2 bg-indigo-400 rounded-full bottom-10 left-[40%] animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Premium Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest font-mono text-white/70 uppercase mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF80] shadow-[0_0_8px_#00FF80]" />
          <span>{t.pricing.badge}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display mb-6 text-white max-w-3xl leading-[1.1]"
        >
          {t.pricing.title}
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-zinc-400 text-pretty text-base sm:text-lg md:text-xl font-normal max-w-2xl mb-12 leading-relaxed"
        >
          {t.pricing.subtitle}
        </motion.p>

        {/* Primary CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 mb-16 justify-center items-center"
        >
          <a
            href="#pricing-cards"
            id="cta-hero-plans"
            onClick={() => {
              trackEvent('click_hero_pricing_plans', {
                source: 'pricing_hero_plans_btn',
                cta_text: t.pricing.ctaPlans
              });
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors shadow-2xl text-sm"
          >
            {t.pricing.ctaPlans}
          </a>
          <a
            href="#simulator"
            id="cta-hero-demo"
            onClick={() => {
              trackEvent('click_hero_pricing_diagnostics', {
                source: 'pricing_hero_demo_btn',
                cta_text: t.pricing.ctaDiagnostics
              });
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all text-sm flex items-center justify-center gap-2"
          >
            <span>{t.pricing.ctaDiagnostics}</span>
            <ArrowDown className="w-4 h-4 text-zinc-500" />
          </a>
        </motion.div>

        {/* Pricing Toggle Switch */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-full px-1.5"
        >
          <button
            id="toggle-btn-monthly"
            onClick={() => {
              setIsAnnual(false);
              trackEvent('change_pricing_cycle', {
                billing_cycle: 'monthly'
              });
            }}
            className={`cursor-pointer px-5 py-2 rounded-full text-xs font-medium transition-all ${
              !isAnnual 
                ? 'bg-white/10 text-white shadow-md' 
                : 'text-white/50 hover:text-white'
            }`}
          >
            {t.pricing.monthly}
          </button>
          <button
            id="toggle-btn-yearly"
            onClick={() => {
              setIsAnnual(true);
              trackEvent('change_pricing_cycle', {
                billing_cycle: 'annual'
              });
            }}
            className={`cursor-pointer px-5 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              isAnnual 
                ? 'bg-white/10 text-white shadow-md' 
                : 'text-white/50 hover:text-white'
            }`}
          >
            <span>{t.pricing.yearly}</span>
            <span className="text-[#00FF80] ml-1 font-bold">
              {t.pricing.discount}
            </span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
