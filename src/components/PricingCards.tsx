import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, Flame, Shield, Briefcase, Sparkles, TrendingUp } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../LanguageContext';

interface PricingCardsProps {
  isAnnual: boolean;
}

export default function PricingCards({ isAnnual }: PricingCardsProps) {
  const { language, t } = useLanguage();

  const plans = [
    {
      id: 'free',
      name: language === 'SV' ? 'Gratis' : 'Free',
      badge: language === 'SV' ? 'Hobbyföljare' : 'Casual Enthusiast',
      icon: Shield,
      description: language === 'SV' ? 'Centraliserad sökning och grundläggande jämförelse av annonser.' : 'Unified cross-market search and fundamental listing comparison.',
      priceMonthly: 0,
      priceYearly: 0,
      valueTag: language === 'SV' ? 'Utforska marknaden helt riskfritt' : 'Explore the index safely',
      ctaText: language === 'SV' ? 'Börja jämföra' : 'Start Scanning',
      ctaSub: language === 'SV' ? 'Ingen betalmetod krävs' : 'No payment method required',
      popular: false,
      premiumGlow: false,
      features: language === 'SV' ? [
        'Sök över alla marknadsplatser',
        'Jämför på 8 plattformar samtidigt',
        'Grundläggande kapfaktor-bedömning',
        '3 aktiva sparade bevakningar',
        'Lokal personlig bevakningslista',
      ] : [
        'Unified multi-market search',
        'Compare across 8 marketplaces',
        'Basic listing deal score',
        '3 active saved searches',
        'Personalized local watchlist',
      ],
      excluded: language === 'SV' ? [
        'Direkta direktfynd-notiser (< 1 min)',
        'Äkthetskontroll med checklistor',
        'Historisk prisutvecklingsdatabas',
        'Wholesale-API & prioriterat flöde',
      ] : [
        'Immediate discovery alerts',
        'Authenticity verification checkmarks',
        'Historical price indexing chart',
        'Reseller API access & priority feed',
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      badge: language === 'SV' ? 'Premiumjägare' : 'Serious Hunter',
      icon: Sparkles,
      description: language === 'SV' ? 'Omedelbara notiser, avancerade äkthetsavvikelser och historisk priskalibrering.' : 'Immediate alert triggers, premium authenticity checkmarks, and historical trend diagnostics.',
      priceMonthly: 79,
      priceYearly: 63, // 20% discount approx
      valueTag: language === 'SV' ? 'Betalar sig självt vid första köpet' : 'Pays for itself in 1 underpriced purchase',
      ctaText: language === 'SV' ? 'Påbörja 7-dagars gratis provperiod' : 'Start 7-Day Free Trial',
      ctaSub: language === 'SV' ? 'Full tillgång. Avsluta när du vill.' : 'Full access. Cancel anytime.',
      popular: true,
      premiumGlow: true,
      features: language === 'SV' ? [
        'Omedelbara direktnotiser (< 1 min)',
        'Obegränsat sparring & bevakningar',
        'Kurerade äkthetskontroller',
        'Interaktiv historisk prisdatabas',
        'Avancerad premium kap-analys',
        'Snabbaste uppdateringshastighet (1 min)',
        'Fina sökmodifierare & filter',
        'Personliga dagliga fyndlistor',
      ] : [
        'Immediate discovery alerts (< 1 min)',
        'Unlimited saved searches',
        'Curated authenticity checkpoints',
        'Interactive Historical price database',
        'High-density premium deal analysis',
        'Fastest crawler refresh rates (1-min)',
        'Advanced search modifiers & filters',
        'Personalized daily bargain feeds',
      ],
      excluded: language === 'SV' ? [
        'Wholesale-API & råa JSON-strömmar',
        'Fleranvändarkonton & teampass',
      ] : [
        'Reseller API access & raw JSON streams',
        'Multi-seat team administration',
      ]
    },
    {
      id: 'enterprise',
      name: language === 'SV' ? 'Företag' : 'Enterprise',
      badge: language === 'SV' ? 'Återförsäljare & Butik' : 'Reseller & Boutique',
      icon: Briefcase,
      description: language === 'SV' ? 'Fullskalig sourcing-pipeline med bulksökning och API-ingestion.' : 'Industrial vintage sourcing pipeline with bulk trackers and API ingestion.',
      priceMonthly: 399,
      priceYearly: 319,
      valueTag: language === 'SV' ? 'Byggd för professionella vintagevalv' : 'Built for professional fashion vaults',
      isCustom: true,
      ctaText: language === 'SV' ? 'Kontakta säljavdelningen' : 'Contact Sourcing Desk',
      ctaSub: language === 'SV' ? 'Konsultera våra sortimentsexperter' : 'Consult with our collection coordinators',
      popular: false,
      premiumGlow: false,
      features: language === 'SV' ? [
        'Trendanalys med hög hastighet',
        'Bulkbevakningar i realtid',
        'Avancerade insikter för företag',
        'Integrationer med CRM-verktyg',
        'Fullständiga REST-API-strömmar',
        'Dedikerat supportteam 1-on-1',
        'Förtur på kurerade arkivläpp',
      ] : [
        'High-velocity trend analytics',
        'Bulk cross-platform triggers',
        'Advanced wholesale market insights',
        'Reseller CRM tool integrations',
        'Full REST API & webhook web-sockets',
        'Dedicated 1-on-1 support architect',
        'Exclusive catalog preemptive locks',
      ],
      excluded: []
    }
  ];

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto scroll-mt-24" id="pricing-cards">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const displayPrice = isAnnual ? plan.priceYearly : plan.priceMonthly;
          
          return (
            <motion.div
              key={plan.id}
              id={`pricing-card-${plan.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`relative flex flex-col justify-between rounded-2xl p-8 transition-all duration-500 ${
                plan.popular 
                  ? 'bg-white/[0.05] border border-white/20 shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)] scale-[1.02] md:scale-[1.03] z-10' 
                  : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Premium Glow effect behind the Pro card */}
              {plan.premiumGlow && (
                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent rounded-2xl blur-[12px] -z-10 pointer-events-none opacity-80" />
              )}

              {/* Card Header */}
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl bg-white/5 text-white/70 border border-white/5`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-mono text-xs tracking-tight text-white/50">
                      {plan.badge}
                    </span>
                  </div>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-3.5 py-1 rounded-full text-[10px] font-bold tracking-tighter shadow-[0_0_20px_rgba(255,255,255,0.35)]">
                      {language === 'SV' ? 'MEST POPULÄR' : 'MOST POPULAR'}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold font-display text-white mb-2">{plan.name}</h3>
                <p className="text-white/50 text-xs leading-relaxed mb-6 h-12 font-light">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  {plan.isCustom ? (
                    <div>
                      <span className="text-3xl font-bold tracking-tight font-display text-white">
                        {language === 'SV' ? 'Anpassad' : 'Custom'}
                      </span>
                      <span className="text-white/30 text-xs font-mono ml-2">
                        {language === 'SV' ? '/ säljavtal' : '/ reselling volume'}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold tracking-tight font-display text-white">
                          {displayPrice}
                        </span>
                        <span className="text-xl font-medium text-white">kr</span>
                        <span className="text-white/30 text-xs font-mono ml-1.5">
                          {language === 'SV' ? '/ månad' : '/ month'}
                        </span>
                      </div>
                      {isAnnual && plan.priceMonthly > 0 ? (
                        <div className="text-[10px] text-white/40 font-mono mt-1 italic">
                          {t.pricing.billedAnnually.replace('{val}', (displayPrice * 12).toString())}
                        </div>
                      ) : (
                        <div className="text-[10px] text-white/40 font-mono mt-1 italic">
                          {plan.priceMonthly > 0 ? t.pricing.billedMonthly : t.pricing.zeroCommitment}
                        </div>
                      )}
                    </div>
                  )}

                  {/* High-conversion microcopy value index */}
                  <div className="mt-4 flex items-center gap-1.5 text-[#00FF80] text-xs font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{plan.valueTag}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-8">
                  <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">
                    {t.pricing.includedHeader}
                  </div>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-light">
                      <Check className="w-4 h-4 text-[#00FF80] shrink-0 mt-0.5" />
                      <span className="text-white/80 leading-normal">{feature}</span>
                    </div>
                  ))}
                  
                  {/* Subtle indication of what is NOT in Free or Pro */}
                  {plan.excluded && plan.excluded.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-white/5 space-y-2">
                      {plan.excluded.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs opacity-30">
                          <span className="text-white/30 font-semibold shrink-0 w-4 text-center mt-0.5">✕</span>
                          <span className="text-white/50 leading-normal line-through">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto">
                {plan.id === 'free' ? (
                  <Link
                    to="/search"
                    id={`cta-btn-${plan.id}`}
                    onClick={() => {
                      trackEvent('click_pricing_cta', {
                        plan_id: plan.id,
                        plan_name: plan.name,
                        cta_text: plan.ctaText,
                        billing_cycle: isAnnual ? 'annual' : 'monthly',
                        price_value: displayPrice,
                        currency: 'SEK'
                      });
                    }}
                    className="w-full py-3 rounded-xl text-center block text-xs font-semibold tracking-tight border border-white/20 text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {plan.ctaText}
                  </Link>
                ) : plan.id === 'enterprise' ? (
                  <Link
                    to="/contact"
                    id={`cta-btn-${plan.id}`}
                    onClick={() => {
                      trackEvent('click_pricing_cta', {
                        plan_id: plan.id,
                        plan_name: plan.name,
                        cta_text: plan.ctaText,
                        billing_cycle: isAnnual ? 'annual' : 'monthly',
                        price_value: displayPrice,
                        currency: 'SEK'
                      });
                    }}
                    className="w-full py-3 rounded-xl text-center block text-xs font-semibold tracking-tight border border-white/20 text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {plan.ctaText}
                  </Link>
                ) : (
                  <a
                    href="#free-trial"
                    id={`cta-btn-${plan.id}`}
                    onClick={(e) => {
                      trackEvent('click_free_trial', {
                        plan_id: plan.id,
                        plan_name: plan.name,
                        cta_text: plan.ctaText,
                        billing_cycle: isAnnual ? 'annual' : 'monthly',
                        price_value: displayPrice,
                        currency: 'SEK'
                      });
                      const el = document.getElementById('free-trial');
                      if (el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full py-3 rounded-xl text-center block text-sm font-bold tracking-tight bg-white text-black shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    {plan.ctaText}
                  </a>
                )}
                <span className="block text-[10px] text-white/30 text-center font-mono mt-2.5">
                  {plan.ctaSub}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
