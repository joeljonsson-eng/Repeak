import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, ShieldCheck, Bell, ChevronRight, Coins, CheckCircle2, ArrowRight } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../LanguageContext';

export default function FreeTrial() {
  const { language, isLoggedIn } = useLanguage();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [isActivated, setIsActivated] = useState(false);

  const steps = [
    {
      day: language === 'SV' ? 'Dag 1' : 'Day 1',
      title: language === 'SV' ? 'Ställ in din bevakningslista' : 'Configure Your Matchlist',
      desc: language === 'SV' 
        ? 'Ange varumärken och plagg (t.ex. vintage Stone Island, Margiela). Vår indexeringsmotor samlar in aktiva annonser i realtid.' 
        : 'Specify designers and items (e.g., vintage Stone Island, Margiela). Our indexing engine compiles active secondhand inventories.',
      icon: Calendar
    },
    {
      day: language === 'SV' ? 'Dag 3' : 'Day 3',
      title: language === 'SV' ? 'Följ marknadstrender' : 'Observe Market Trends',
      desc: language === 'SV' 
        ? 'Prisdatabaser fastställer historiska värdeintervall, så att du tidigt identifierar prisskillnader och felaktigt prissatt inventar.' 
        : 'Price databases establish historical value ranges, identifying pricing deltas and underpriced inventory early.',
      icon: Coins
    },
    {
      day: language === 'SV' ? 'Dag 7' : 'Day 7',
      title: language === 'SV' ? 'Aktivera direktnotiser' : 'Enable Curated Notifications',
      desc: language === 'SV' 
        ? 'Dina notiser matchar faktisk tillgänglighet, vilket låter dig norpa fantastiska vintagefynd samt avfärda kopior med hög risk.' 
        : 'Your alerts match actual availability, letting you connect with authenticated fashion finds securely.',
      icon: Bell
    }
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto border-t border-white/5 scroll-mt-24" id="free-trial">
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-14 relative overflow-hidden shadow-2xl">
        {/* Subtle decorative mesh background glow */}
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-[80px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Pitch Panel */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[#00FF80] border border-white/10 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00FF80]" />
              <span>{language === 'SV' ? 'RISKFRITT PROV' : 'RISK-FREE TRIAL'}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight font-display text-white">
              {language === 'SV' ? '7 dagars gratis Pro-test' : '7 Days Free Pro Trial'}
            </h2>
            
            <p className="text-white/60 text-sm md:text-base leading-relaxed font-light">
              {language === 'SV' 
                ? 'Vi anser att ett bevakningsverktyg måste förtjäna sin plats i din rutin. Testa Pro helt obegränsat. Se hur vårt realtidsflöde säkrar äkta klädesplagg samtidigt som det filtrerar bort kopior med hög risk.'
                : 'We believe a scouting platform must earn its place in your inventory routine. Try Pro unrestricted. Watch how the real-time feedback loop secures genuine clothing pieces while discarding high-risk counterfeits.'}
            </p>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-xs text-white/80 font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF80] shrink-0 shadow-[0_0_6px_#00FF80]" />
                <span>
                  {language === 'SV' ? 'Ingen förskottsbetalning eller dolda bindningstider' : 'No credit card pre-charge or aggressive lock-ins'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/80 font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF80] shrink-0 shadow-[0_0_6px_#00FF80]" />
                <span>
                  {language === 'SV' ? 'Pausa abonnemanget med ett klick i inställningarna' : 'Single-click account pause from settings'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/80 font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF80] shrink-0 shadow-[0_0_6px_#00FF80]" />
                <span>
                  {language === 'SV' ? 'Exportera historisk prisgrafik till CSV för eget arkiv' : 'Export historic graphs to CSV for inventory archiving'}
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              {isActivated ? (
                <div className="p-4 rounded-xl bg-[#00FF80]/10 border border-[#00FF80]/30 text-left space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 text-[#00FF80]">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-sm">
                      {language === 'SV' 
                        ? 'Provperiod aktiverad! Välkommen till Repeak Pro.' 
                        : 'Trial Activated! Welcome to Repeak Pro.'}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 font-light">
                    {language === 'SV'
                      ? 'Ditt konto har nu 7 dagars full tillgång till realtidsnotiser och prishistorik.'
                      : 'You now have 7 full days of instant real-time alerts and market intelligence.'}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <Link
                      to="/search"
                      className="px-4 py-2 rounded-lg bg-[#00FF80] text-black font-bold text-xs hover:bg-[#00e673] transition-colors"
                    >
                      {language === 'SV' ? 'Börja söka med Pro' : 'Start Scanning with Pro'}
                    </Link>
                    <Link
                      to="/account"
                      className="px-4 py-2 rounded-lg bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors"
                    >
                      {language === 'SV' ? 'Mitt konto' : 'My Account'}
                    </Link>
                  </div>
                </div>
              ) : showEmailInput ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!email) return;
                    setIsActivated(true);
                    trackEvent('free_trial_email_activated', { email });
                  }}
                  className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-md"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === 'SV' ? 'Ange din e-postadress...' : 'Enter your email address...'}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#00FF80]/50"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#00FF80] text-black font-bold text-xs hover:bg-[#00e673] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {language === 'SV' ? 'Aktivera direkt' : 'Activate Instantly'}
                  </button>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    id="btn-activate-trial"
                    onClick={() => {
                      if (isLoggedIn) {
                        setIsActivated(true);
                      } else {
                        setShowEmailInput(true);
                      }
                      trackEvent('click_free_trial', {
                        plan_id: 'pro_trial_section',
                        plan_name: 'Pro',
                        cta_text: language === 'SV' ? 'Aktivera gratis Pro-bevakning' : 'Activate Free Scans',
                        source: 'free_trial_footer_cards'
                      });
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>{language === 'SV' ? 'Aktivera gratis Pro-bevakning' : 'Activate Free Scans'}</span>
                    <ChevronRight className="w-4 h-4 text-black" />
                  </button>

                  <span className="text-[10px] text-white/40 font-mono">
                    {language === 'SV' ? 'Inga dolda startavgifter. Klart på 90 sekunder.' : 'No setup fees. Setup completes in 90 seconds.'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Chronological Roadmap Panel */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-8 pl-0 xl:pl-8 border-l-0 xl:border-l border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-bold mb-2">
              {language === 'SV' ? 'Varför verktyget blir starkare över tid' : 'Why value amplifies over time'}
            </h3>
            
            <div className="relative space-y-8 before:absolute before:inset-y-1 before:left-5 before:w-[1px] before:bg-white/10 font-sans">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4 relative"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white relative z-10 shrink-0">
                      <StepIcon className="w-4 h-4 text-[#00FF80]" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase text-[#00FF80] font-bold">
                          {step.day}
                        </span>
                        <h4 className="text-white text-sm font-semibold">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-white/50 text-xs leading-normal font-light">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
