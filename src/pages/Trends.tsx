import React from 'react';
import HettJustNu from '../components/HettJustNu';
import FashionPriceEvaluator from '../components/FashionPriceEvaluator';
import CategoryPriceFluctuationsChart from '../components/CategoryPriceFluctuationsChart';
import { useLanguage } from '../LanguageContext';
import { Sparkles } from 'lucide-react';

export default function Trends() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] py-12 relative font-sans">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white/2 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-4 relative z-10 text-center">
        <span className="text-[10px] font-mono tracking-[0.2em] text-[#3cbd82] uppercase bg-[#153a2a]/30 border border-[#3cbd82]/20 px-3 py-1 rounded-full font-bold inline-block mb-4">
          {language === 'SV' ? 'EXKLUSIVA INSIGHTS' : 'EXCLUSIVE INSIGHTS'}
        </span>
        <h1 className="text-4xl md:text-6xl font-black font-sans text-white tracking-tight leading-[1.1] mb-4">
          {language === 'SV' ? 'Alla Marknadstrender' : 'All Market Trends'}
        </h1>
        <p className="text-white/60 text-xs sm:text-sm font-light font-sans max-w-xl mx-auto leading-relaxed">
          {language === 'SV'
            ? 'Djupdyk i den kompletta listan över de mest eftertraktade märkena och modellerna just nu. Analyserade minut för minut baserat på realtidssökningar, social hype och transaktionsvolym.'
            : 'Explore the complete comprehensive lineup of highly sought-after brand items in real time. Updated continuously based on transaction density, search velocity, and live social mentions.'}
        </p>
      </div>

      {/* 6-Month Category Price Fluctuations Chart powered by Recharts */}
      <CategoryPriceFluctuationsChart />

      {/* Real-time Item Price Valuation & Trajectory Analyzer */}
      <FashionPriceEvaluator />

      {/* Renders the full HettJustNu widget (which auto-detects it is not on the homepage and shows all items) */}
      <HettJustNu />
    </div>
  );
}

