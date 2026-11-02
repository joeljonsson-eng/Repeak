import React from 'react';
import { Search, Scale, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: '1',
      title: t.howItWorks.steps.oneTitle,
      desc: t.howItWorks.steps.oneDesc,
      icon: Search
    },
    {
      number: '2',
      title: t.howItWorks.steps.twoTitle,
      desc: t.howItWorks.steps.twoDesc,
      icon: Scale
    },
    {
      number: '3',
      title: t.howItWorks.steps.threeTitle,
      desc: t.howItWorks.steps.threeDesc,
      icon: ShoppingBag
    }
  ];

  return (
    <section className="py-24 px-4 bg-[#050505] border-t border-white/5 scroll-mt-24" id="hur-det-funkar">
      <div className="max-w-7xl mx-auto">
        
        {/* Upper Title and badge */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#3cbd82] uppercase block font-mono">
            {t.howItWorks.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display text-white">
            {t.howItWorks.title}
          </h2>
        </div>

        {/* 3 Step columns from screenshot 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-14 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-5 group">
                
                {/* Circular styled icon container (Screenshot has a neat circular outline/green theme) */}
                <div className="w-20 h-20 rounded-full bg-emerald-950/15 border-2 border-[#3cbd82]/30 flex items-center justify-center text-[#3cbd82] group-hover:border-[#3cbd82] transition-all duration-300 relative shadow-lg shadow-black/80">
                  <IconComponent className="w-8 h-8 text-[#3cbd82] group-hover:scale-110 transition-transform duration-300" />
                  {/* Subtle index glow */}
                  <div className="absolute inset-x-0 bottom-0 bg-[#3cbd82]/10 h-1/2 rounded-full blur-lg opacity-80" />
                </div>

                {/* Subtitle / Description text block from Screenshot 2 */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {step.number}. {step.title}
                  </h3>
                  <p className="text-white/50 text-sm font-light leading-relaxed max-w-sm mx-auto">
                    {step.desc}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
