import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function WhyRepeak() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 bg-[#050505] relative overflow-hidden scroll-mt-24" id="om-oss">
      {/* Structural ambient details */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#3cbd82]/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image with rounded corners and warm lighting, matching Screenshot 4 */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#3cbd82] to-emerald-900 rounded-2xl blur opacity-15 group-hover:opacity-20 transition-opacity duration-500" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-neutral-900">
              <img
                src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&auto=format&fit=crop&q=80"
                alt="Repeak workspace design"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale brightness-90 contrast-105 group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Back to top or small icon identifier */}
              <div className="absolute bottom-4 left-4 p-2 bg-[#3cbd82]/10 border border-[#3cbd82]/20 rounded-full text-[#3cbd82]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Right Column: Copywriting from Screenshot 4 */}
          <div className="space-y-8 mt-10 lg:mt-0">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display text-white">
                {t.whyRepeak.title}
              </h2>
              <div className="w-12 h-1 bg-[#3cbd82] rounded-full" />
            </div>

            <div className="space-y-5 text-white/70 text-xs sm:text-sm font-light leading-relaxed font-sans">
              <p>
                {t.whyRepeak.desc1}
              </p>
              <p>
                {t.whyRepeak.desc2}
              </p>
            </div>

            {/* Verification checklist Row from Screenshot 4 */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 py-2 px-3.5 rounded-full text-xs text-white/90">
                <Check className="w-4 h-4 text-[#3cbd82]" />
                <span className="font-semibold text-[11px] sm:text-xs">{t.whyRepeak.badge1}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 py-2 px-3.5 rounded-full text-xs text-white/90">
                <Check className="w-4 h-4 text-[#3cbd82]" />
                <span className="font-semibold text-[11px] sm:text-xs">{t.whyRepeak.badge2}</span>
              </div>

              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 py-2 px-3.5 rounded-full text-xs text-white/90">
                <Check className="w-4 h-4 text-[#3cbd82]" />
                <span className="font-semibold text-[11px] sm:text-xs">{t.whyRepeak.badge3}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
