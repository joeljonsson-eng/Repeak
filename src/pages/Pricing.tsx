import React, { useState } from 'react';
import { motion } from 'motion/react';
import PricingHero from '../components/PricingHero';
import PricingCards from '../components/PricingCards';
import FreeTrial from '../components/FreeTrial';
import { useLanguage } from '../LanguageContext';
import { Check, ShieldCheck, Sparkles, Zap, ArrowRight } from 'lucide-react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { language } = useLanguage();

  const comparisonRows = [
    { name: language === 'SV' ? 'Centraliserad sökning' : 'Unified cross-market search', free: true, pro: true, ent: true },
    { name: language === 'SV' ? 'Flerfaldig prisskanning' : 'Compare 8 platforms at once', free: true, pro: true, ent: true },
    { name: language === 'SV' ? 'AI Kapbedömning' : 'AI Deal scoring metric', free: true, pro: true, ent: true },
    { name: language === 'SV' ? 'Aktiva sparade bevakningar' : 'Active saved search queries', free: '3', pro: 'Obegränsat/Unlimited', ent: 'Bulk' },
    { name: language === 'SV' ? 'Direktnotiser (< 1 min)' : 'Immediate alerts (< 1 min)', free: false, pro: true, ent: true },
    { name: language === 'SV' ? 'Kurerade äkthetskontroller' : 'Authenticity diagnostics', free: false, pro: true, ent: true },
    { name: language === 'SV' ? 'Prishistorik & visualisering' : 'Historical charting & trends', free: false, pro: true, ent: true },
    { name: language === 'SV' ? 'Wholesale-API access' : 'REST api & webhook streams', free: false, pro: false, ent: true },
    { name: language === 'SV' ? '1-on-1 dedikerat support' : '1-on-1 Dedicated success architect', free: false, pro: false, ent: true },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] py-8 relative">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white/2 to-transparent pointer-events-none" />

      {/* Hero Header with Toggle */}
      <PricingHero isAnnual={isAnnual} setIsAnnual={setIsAnnual} />

      {/* Subscription Cards Deck */}
      <PricingCards isAnnual={isAnnual} />

      {/* Comparison Grid */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 border-t border-white/5 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {language === 'SV' ? 'Jämför alla funktioner' : 'Detailed Feature Comparison'}
          </h2>
          <p className="text-xs text-white/50 mt-1.5">
            {language === 'SV' ? 'Hitta det abonnemang som passar bäst för din budget och passion.' : 'Compare features side-by-side to choose the right fit.'}
          </p>
        </div>

        <div className="overflow-x-auto bg-white/[0.01] border border-white/5 rounded-2xl">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-white/5 font-mono text-[10px] tracking-wider text-white/40 uppercase bg-white/[0.01]">
                <th className="p-4 font-bold">{language === 'SV' ? 'FUNKTIONER' : 'FEATURES'}</th>
                <th className="p-4 font-bold text-center">{language === 'SV' ? 'GRATIS' : 'FREE'}</th>
                <th className="p-4 font-bold text-center text-[#ffcc00]">{language === 'SV' ? 'PRO' : 'PRO'}</th>
                <th className="p-4 font-bold text-center">{language === 'SV' ? 'FÖRETAG' : 'ENTERPRISE'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 text-white/80 font-medium font-sans">{row.name}</td>
                  
                  {/* Free */}
                  <td className="p-4 text-center">
                    {typeof row.free === 'boolean' ? (
                      row.free ? <Check className="w-4 h-4 text-white/50 mx-auto" /> : <span className="text-white/20">—</span>
                    ) : (
                      <span className="text-white/60 font-mono">{row.free}</span>
                    )}
                  </td>

                  {/* Pro */}
                  <td className="p-4 text-center bg-[#3cbd82]/5">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? <Check className="w-4 h-4 text-[#3cbd82] mx-auto" /> : <span className="text-[#3cbd82]/20">—</span>
                    ) : (
                      <span className="text-[#3cbd82] font-semibold font-mono">{row.pro}</span>
                    )}
                  </td>

                  {/* Enterprise */}
                  <td className="p-4 text-center">
                    {typeof row.ent === 'boolean' ? (
                      row.ent ? <Check className="w-4 h-4 text-white/80 mx-auto" /> : <span className="text-white/20">—</span>
                    ) : (
                      <span className="text-white/80 font-mono font-medium">{row.ent}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Embedded Free Trial chronological details */}
      <FreeTrial />
    </div>
  );
}
